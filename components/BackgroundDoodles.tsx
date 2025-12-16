import React from 'react';

export const BackgroundDoodles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      
      {/* 1. The "Character" / Mascot (Top Left) */}
      <svg 
        className="absolute top-[12%] left-[5%] w-32 h-32 md:w-48 md:h-48 text-slate-700/30 animate-float" 
        viewBox="0 0 200 200" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Head */}
        <rect x="50" y="60" width="100" height="80" rx="20" />
        {/* Antenna */}
        <path d="M100 60 V 30" />
        <circle cx="100" cy="25" r="5" />
        {/* Eyes */}
        <circle cx="80" cy="90" r="8" fill="currentColor" className="opacity-50" />
        <circle cx="120" cy="90" r="8" fill="currentColor" className="opacity-50" />
        {/* Smile */}
        <path d="M85 115 Q 100 125 115 115" />
        {/* Cheeks */}
        <path d="M60 100 Q 55 105 60 110" className="opacity-50" />
        <path d="M140 100 Q 145 105 140 110" className="opacity-50" />
      </svg>

      {/* 2. Swirly Arrow (Right Middle) */}
      <svg 
        className="absolute top-[30%] right-[8%] w-40 h-40 text-violet-500/10 animate-float-delayed" 
        viewBox="0 0 200 200" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round"
      >
        <path d="M50 150 C 50 100, 150 150, 150 50" />
        <path d="M130 50 L 150 50 L 150 70" />
        <circle cx="45" cy="155" r="5" fill="currentColor" />
      </svg>

      {/* 3. Hand-drawn Planet (Bottom Left) */}
      <svg 
        className="absolute bottom-[15%] left-[8%] w-40 h-40 text-cyan-500/10 animate-float-reverse" 
        viewBox="0 0 200 200" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <circle cx="100" cy="100" r="40" />
        <ellipse cx="100" cy="100" rx="70" ry="15" transform="rotate(-20 100 100)" />
        {/* Stars around it */}
        <path d="M150 50 L 155 60 L 145 60 Z" fill="currentColor" className="opacity-50" />
        <path d="M50 150 L 55 160 L 45 160 Z" fill="currentColor" className="opacity-50" />
      </svg>

      {/* 4. Abstract Shapes/Squiggles (Top Right) */}
      <svg 
        className="absolute top-[5%] right-[20%] w-24 h-24 text-fuchsia-500/10 animate-pulse-slow" 
        viewBox="0 0 100 100" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M20 20 L 80 80 M 80 20 L 20 80" />
        <circle cx="50" cy="50" r="45" strokeDasharray="10 5" />
      </svg>
      
      {/* 5. Code Brackets Doodle (Bottom Center-ish) */}
      <svg
        className="absolute bottom-[25%] right-[25%] w-32 h-32 text-slate-600/10 animate-float"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
         <path d="M30 30 L 10 50 L 30 70" />
         <path d="M70 30 L 90 50 L 70 70" />
         <path d="M40 80 L 60 20" />
      </svg>
    </div>
  );
};