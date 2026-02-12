
import React, { useState, useEffect, useCallback } from 'react';
import { MASCOT_COMMENTS } from '../constants';

// Emotion types for facial expressions
type Emotion = 'happy' | 'wink' | 'surprised';

interface NanDingMascotProps {
  bites: number; // Current bite count
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

  // Aesthetic Palette
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
    bubbleBorder: '#ff9ea5'   // Pink for bubble border
  };

  const isBitten = bites > 0;

  return (
    <div className="flex flex-col items-center gap-1 relative z-50">
      {/* 
        Responsive Speech Bubble:
        Mobile: Centered above mascot (bottom-[115%])
        Desktop: Positioned to the left (md:right-[115%])
      */}
      <div className={`
        absolute z-50 transition-all duration-500 transform
        bottom-[115%] left-1/2 -translate-x-1/2 w-44
        md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-[115%] md:translate-x-0 md:w-52
        bg-white p-3 md:p-4 rounded-3xl shadow-lg border-[4px] border-[#ff9ea5] 
        text-[10px] md:text-[11px] text-[#5b2b62] font-black
        ${isWiggling ? 'scale-110 -rotate-3' : 'scale-100 rotate-0'}
      `}>
        <p className="text-center leading-snug drop-shadow-sm">{displayComment}</p>
        
        {/* Responsive Tail */}
        <div className={`
          absolute bg-white border-[#ff9ea5] rotate-45 transition-all
          bottom-[-10px] left-1/2 -translate-x-1/2 border-b-[4px] border-r-[4px] w-4 h-4
          md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-[-10px] md:translate-x-0 md:border-b-0 md:border-t-[4px] md:border-r-[4px] md:rounded-tr-md md:w-5 md:h-5
        `}></div>
      </div>

      {/* Nan-Ding Mascot Button */}
      <button 
        onClick={handleMascotClick}
        className={`relative w-24 h-24 md:w-40 md:h-40 cursor-pointer focus:outline-none transition-all duration-300 ${isWiggling ? 'animate-wiggle' : 'hover:scale-105 active:scale-95'}`}
        title="Click to take a bite!"
      >
        <svg viewBox="0 0 250 250" className="w-full h-full overflow-visible">
          {/* Sticker Outer Glow/White Border */}
          <path 
            d="M30 110 C30 70 60 30 90 20 C110 10 140 10 160 20 C190 30 220 70 220 110 C220 140 200 155 180 160 L180 205 Q180 235 125 235 Q70 235 70 205 L70 160 C50 155 30 140 30 110 Z" 
            fill={colors.stickerBorder} 
            stroke={colors.stickerShadow}
            strokeWidth="14"
            transform="scale(1.1) translate(-10, -10)"
          />

          <g transform="translate(10, 10)">
            {/* Wrapper with Heart Pattern */}
            <defs>
              <pattern id="heartPatternFinalV3" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <rect width="24" height="24" fill={colors.wrapperRed} />
                <path d="M12 18 L10.5 16.5 Q7 13 7 10.5 Q7 8 9 8 Q10.5 8 12 9.5 Q13.5 8 15 8 Q17 8 17 10.5 Q17 13 13.5 16.5 Z" fill="white" />
              </pattern>
              
              {/* Mask for the bite effect */}
              <mask id="biteMaskV3">
                <rect x="0" y="0" width="250" height="250" fill="white" />
                {isBitten && (
                  <g transform="translate(195, 75) rotate(20)">
                    <circle cx="0" cy="0" r="35" fill="black" />
                    <circle cx="-15" cy="25" r="32" fill="black" />
                  </g>
                )}
              </mask>
            </defs>

            {/* Cupcake Body */}
            <g mask="url(#biteMaskV3)">
              {/* 1. Wrapper */}
              <path 
                d="M60 145 L190 145 L175 210 Q170 230 125 230 Q80 230 75 210 Z" 
                fill="url(#heartPatternFinalV3)" 
                stroke={colors.outline} 
                strokeWidth="6" 
              />

              {/* 2. TALLER CLOUDY Frosting */}
              <path 
                d="M35 110 
                   C35 55 65 35 95 45 
                   C105 15 145 15 155 45 
                   C185 35 215 55 215 110 
                   C215 135 195 155 170 155 
                   L80 155 
                   C55 155 35 135 35 110 Z" 
                fill={colors.frosting} 
                stroke={colors.outline} 
                strokeWidth="6" 
              />

              {/* Frosting Inner Detail */}
              <path 
                d="M35 110 Q55 140 85 140 Q110 140 125 125 Q140 140 165 140 Q195 140 215 110" 
                fill="none" 
                stroke={colors.outline} 
                strokeWidth="6" 
                strokeLinecap="round" 
              />

              {/* Strawberry Garnish */}
              {!isBitten && (
                <g transform="translate(160, 15) scale(0.9) rotate(20)">
                  {/* Leaves */}
                  <ellipse cx="5" cy="15" rx="12" ry="7" fill={colors.leaves} stroke={colors.outline} strokeWidth="4" transform="rotate(-30 5 15)"/>
                  <ellipse cx="25" cy="15" rx="12" ry="7" fill={colors.leaves} stroke={colors.outline} strokeWidth="4" transform="rotate(30 25 15)"/>
                  {/* Berry Body */}
                  <path d="M15 8 C0 8 -5 30 15 50 C35 30 30 8 15 8 Z" fill={colors.strawberryRed} stroke={colors.outline} strokeWidth="4" />
                  {/* Strawberry Face */}
                  <circle cx="10" cy="25" r="2.5" fill={colors.outline} />
                  <circle cx="20" cy="25" r="2.5" fill={colors.outline} />
                  <path d="M13 30 Q15 33 17 30" fill="none" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {/* Face - Centered for Maximum Cuteness */}
              <g transform="translate(0, -5)">
                {emotion !== 'surprised' ? (
                  <g>
                    {/* Left Eye */}
                    <circle cx="85" cy="115" r="16" fill={colors.eye} />
                    <circle cx="78" cy="107" r="7" fill="white" />
                    <circle cx="89" cy="123" r="3.5" fill="white" />

                    {/* Right Eye */}
                    {emotion === 'wink' ? (
                      <path d="M145 115 Q160 140 175 115" fill="none" stroke={colors.outline} strokeWidth="8" strokeLinecap="round" />
                    ) : (
                      <g>
                        <circle cx="165" cy="115" r="16" fill={colors.eye} />
                        <circle cx="158" cy="107" r="7" fill="white" />
                        <circle cx="169" cy="123" r="3.5" fill="white" />
                      </g>
                    )}

                    {/* Cute Smile */}
                    <path d="M115 125 Q125 133 135 125" fill="none" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" />
                  </g>
                ) : (
                  <g>
                    {/* Surprised Eyes */}
                    <path d="M75 105 L95 125 M95 105 L75 125" stroke={colors.outline} strokeWidth="8" strokeLinecap="round" />
                    <path d="M155 105 L175 125 M175 105 L155 125" stroke={colors.outline} strokeWidth="8" strokeLinecap="round" />
                    {/* Small Mouth */}
                    <circle cx="125" cy="135" r="8" fill="none" stroke={colors.outline} strokeWidth="5" />
                  </g>
                )}

                {/* Rosy Cheeks */}
                <circle cx="55" cy="130" r="13" fill={colors.cheek} opacity="0.8" />
                <circle cx="195" cy="130" r="13" fill={colors.cheek} opacity="0.8" />
              </g>
            </g>
            
            {/* Outline for the Bite */}
            {isBitten && (
               <g transform="translate(195, 75) rotate(20)">
                <path d="M -35 -15 A 35 35 0 0 0 5 35" fill="none" stroke={colors.outline} strokeWidth="6" strokeLinecap="round"/>
                <path d="M -20 10 A 32 32 0 0 0 15 50" fill="none" stroke={colors.outline} strokeWidth="6" strokeLinecap="round"/>
              </g>
            )}
          </g>
        </svg>
      </button>
      
      <span className="text-[#5b2b62] font-black text-xs tracking-tighter drop-shadow-sm bg-white/95 px-3 py-1 rounded-full border-[3px] border-[#fb7185] shadow-sm -rotate-2">
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
