
import React, { useState, useEffect, useCallback } from 'react';
import { MASCOT_COMMENTS } from '../constants';

// Emotion types for facial expressions
type Emotion = 'happy' | 'wink' | 'surprised';

interface NanDingMascotProps {
  bites: number; // Current bite count (0-4)
  onBite: () => void;
  comment?: string;
}

const NanDingMascot: React.FC<NanDingMascotProps> = ({ bites, onBite, comment }) => {
  const [displayComment, setDisplayComment] = useState(MASCOT_COMMENTS[0]);
  const [isWiggling, setIsWiggling] = useState(false);
  const [emotion, setEmotion] = useState<Emotion>('happy');

  const triggerWiggle = useCallback(() => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
  }, []);

  // Cycle random idle emotions and comments
  useEffect(() => {
    if (!comment) {
      const interval = setInterval(() => {
        setDisplayComment(MASCOT_COMMENTS[Math.floor(Math.random() * MASCOT_COMMENTS.length)]);
        setEmotion(Math.random() > 0.8 ? 'wink' : 'happy');
        triggerWiggle();
      }, 8000);
      return () => clearInterval(interval);
    } else {
      setDisplayComment(comment);
      triggerWiggle();
    }
  }, [comment, triggerWiggle]);

  const handleMascotClick = () => {
    onBite();
    triggerWiggle();
    setEmotion('surprised');
    setTimeout(() => {
      setEmotion('happy');
    }, 1200);
  };

  // Palette exactly matching the reference image
  const colors = {
    outline: '#5b2b62',       // Dark purple/burgundy outline
    frosting: '#ffffff',      // Pure white frosting
    wrapperRed: '#ff696d',    // Soft red for wrapper
    strawberryRed: '#ff5358', // Strawberry red
    leaves: '#8bd180',        // Pastel green leaves
    cheek: '#ff9ea5',         // Pink blush
    eye: '#000000',           // Pure black eyes
    stickerBorder: '#ffffff', // White die-cut border
    stickerShadow: '#ffccd4', // Soft pink outer glow/border
    biteFill: '#fff1f2'       // Match background to simulate missing chunk
  };

  const isBitten = bites > 0;

  return (
    <div className="flex flex-col items-center gap-1 relative z-50">
      {/* Speech Bubble */}
      <div className={`absolute top-1/2 -translate-y-1/2 -left-52 w-48 bg-white p-4 rounded-2xl shadow-[0_4px_0px_#5b2b62] border-[3px] border-[#5b2b62] text-[11px] text-[#5b2b62] font-black z-50 transition-all duration-500 transform ${isWiggling ? 'scale-110 -rotate-2' : 'scale-100 rotate-0'}`}>
        <p className="text-center leading-snug drop-shadow-sm">{displayComment}</p>
        <div className="absolute top-1/2 -translate-y-1/2 -right-2.5 w-4 h-4 bg-white border-r-[3px] border-t-[3px] border-[#5b2b62] rounded-tr-sm rotate-45"></div>
      </div>

      {/* Nan-Ding Mascot Button */}
      <button 
        onClick={handleMascotClick}
        className={`relative w-28 h-28 md:w-32 md:h-32 cursor-pointer focus:outline-none transition-all duration-300 ${isWiggling ? 'animate-wiggle' : 'hover:scale-105 active:scale-95'}`}
        title="Click to take a bite!"
      >
        <svg viewBox="0 0 250 250" className="w-full h-full overflow-visible">
          {/* Outer Sticker Border & Shadow Effect */}
          <path 
            d="M50 110 C50 60 90 45 125 45 C160 45 200 60 200 110 C200 125 180 135 180 145 L180 190 Q180 215 125 215 Q70 215 70 190 L70 145 C70 135 50 125 50 110 Z" 
            fill={colors.stickerBorder} 
            stroke={colors.stickerShadow} 
            strokeWidth="12" 
            transform="scale(1.1) translate(-10, -10)"
          />

          <g transform="translate(15, 15)">
            {/* 1. Wrapper with Heart Pattern */}
            <defs>
              <pattern id="heartPatternRef" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <rect width="24" height="24" fill={colors.wrapperRed} />
                <path d="M12 18 L10.5 16.5 Q7 13 7 10.5 Q7 8 9 8 Q10.5 8 12 9.5 Q13.5 8 15 8 Q17 8 17 10.5 Q17 13 13.5 16.5 Z" fill="white" />
              </pattern>
            </defs>
            <path 
              d="M60 140 L190 140 L175 195 Q170 215 125 215 Q80 215 75 195 Z" 
              fill="url(#heartPatternRef)" 
              stroke={colors.outline} 
              strokeWidth="6" 
            />

            {/* 2. Scalloped Frosting */}
            <path 
              d="M40 120 C40 60 90 40 125 40 C160 40 210 60 210 120 C210 140 190 150 170 150 Q125 150 125 135 Q125 150 80 150 C60 150 40 140 40 120 Z" 
              fill={colors.frosting} 
              stroke={colors.outline} 
              strokeWidth="6" 
            />

            {/* 3. The Bite - Subtractive look, taking a chunk out of the left frosting bump */}
            {isBitten && (
              <g transform="translate(45, 60)">
                <path 
                  d="M-20 -20 Q0 10 20 -20 Q40 10 60 -20 Q80 10 100 -20 L100 -50 L-20 -50 Z" 
                  fill={colors.biteFill} 
                  stroke={colors.outline} 
                  strokeWidth="6" 
                  strokeLinejoin="round" 
                />
              </g>
            )}

            {/* 4. Strawberry Garnish (Nestled in frosting bump) */}
            {!isBitten && (
              <g transform="translate(145, 45) scale(0.9) rotate(10)">
                {/* Leaves */}
                <ellipse cx="5" cy="20" rx="12" ry="7" fill={colors.leaves} stroke={colors.outline} strokeWidth="4" transform="rotate(-30 5 20)"/>
                <ellipse cx="25" cy="20" rx="12" ry="7" fill={colors.leaves} stroke={colors.outline} strokeWidth="4" transform="rotate(30 25 20)"/>
                
                {/* Berry Body */}
                <path 
                  d="M15 10 C0 10 -5 30 15 50 C35 30 30 10 15 10 Z" 
                  fill={colors.strawberryRed} 
                  stroke={colors.outline} 
                  strokeWidth="5" 
                />
                
                {/* Berry Face */}
                <circle cx="9" cy="25" r="2.5" fill={colors.outline} />
                <circle cx="21" cy="25" r="2.5" fill={colors.outline} />
                <path d="M12 30 Q15 33 18 30" fill="none" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" />
                <path d="M22 15 L26 19 M22 19 L26 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {/* 5. Nan-Ding Face */}
            <g transform="translate(10, 20)">
              {emotion !== 'surprised' ? (
                <g>
                  {/* Left Eye */}
                  <circle cx="85" cy="115" r="14" fill={colors.eye} />
                  <circle cx="79" cy="109" r="5" fill="white" />
                  <circle cx="88" cy="120" r="2.5" fill="white" />

                  {/* Right Eye */}
                  {emotion === 'wink' ? (
                    <path d="M140 115 Q155 130 170 115" fill="none" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" />
                  ) : (
                    <g>
                      <circle cx="160" cy="115" r="14" fill={colors.eye} />
                      <circle cx="154" cy="109" r="5" fill="white" />
                      <circle cx="163" cy="120" r="2.5" fill="white" />
                    </g>
                  )}

                  {/* Simple Cute Mouth */}
                  <path d="M112 125 Q125 135 138 125" fill="none" stroke={colors.outline} strokeWidth="5" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  {/* Surprised Face */}
                  <path d="M75 110 L95 125 M95 110 L75 125" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" />
                  <path d="M150 110 L170 125 M170 110 L150 125" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" />
                  <circle cx="122" cy="135" r="8" fill="none" stroke={colors.outline} strokeWidth="4" />
                </g>
              )}

              {/* Pink Cheeks */}
              <circle cx="60" cy="130" r="10" fill={colors.cheek} opacity="0.9" />
              <circle cx="185" cy="130" r="10" fill={colors.cheek} opacity="0.9" />
            </g>
          </g>
        </svg>
      </button>
      
      <span className="text-[#5b2b62] font-black text-sm tracking-tighter drop-shadow-sm bg-white/90 px-3 py-0.5 rounded-full border-[3px] border-[#5b2b62] shadow-sm -rotate-1">
        Nan-Ding
      </span>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-3deg) scale(1.05); }
          75% { transform: rotate(3deg) scale(1.05); }
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NanDingMascot;
