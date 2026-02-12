
import { GoogleGenAI, Modality } from "@google/genai";
import { getCachedSound, saveSoundToCache } from "./audioCache";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

let audioContext: AudioContext | null = null;

/**
 * Attempts to generate onomatopoeia sound using a cache-first strategy.
 * If cached, plays immediately. If not, uses Gemini API with retries and saves the result.
 */
export const playOnomatopoeiaSound = async (word: string, maxRetries = 3) => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  const normalizedWord = word.toLowerCase().trim();

  // 1. Check persistent cache first
  const cachedData = await getCachedSound(normalizedWord);
  if (cachedData) {
    console.log(`Playing "${normalizedWord}" from persistent cache 🧁`);
    try {
      const audioBuffer = await decodeAudioData(
        decode(cachedData),
        audioContext,
        24000,
        1,
      );
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      return;
    } catch (e) {
      console.warn("Cached audio data corrupted, falling back to API.");
    }
  }

  // 2. Call Gemini API if not cached
  const prompt = `Make a vivid and accurate sound effect for the onomatopoeia word: "${word}". If it's an animal, make that animal sound. If it's a collision, make a crashing sound. Just the sound effect, no talking.`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        // Save to cache for next time
        await saveSoundToCache(normalizedWord, base64Audio);
        
        const audioBuffer = await decodeAudioData(
          decode(base64Audio),
          audioContext,
          24000,
          1,
        );
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        return; // Success!
      }
      break;
    } catch (error: any) {
      const isQuotaError = error?.message?.includes("429") || error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED");
      
      if (isQuotaError && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`Gemini Quota Exceeded (429). Retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }

      console.error("Gemini TTS Error:", error);
      break;
    }
  }

  // 3. Last resort: Browser Speech Synthesis
  console.log("Falling back to browser Speech Synthesis.");
  const msg = new SpeechSynthesisUtterance(word);
  window.speechSynthesis.speak(msg);
};
