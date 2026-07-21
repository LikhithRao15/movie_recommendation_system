import React from 'react';

const CineMindLogo = ({ size = 'md', showText = true, className = '' }) => {
  const dimensions = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-4xl' },
  }[size] || { icon: 36, text: 'text-xl' };

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Integrated Futuristic Film-Reel Brain Emblem */}
      <div
        className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: dimensions.icon, height: dimensions.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]"
        >
          <defs>
            <linearGradient id="cineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="mindGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Film Reel Ring */}
          <circle cx="50" cy="50" r="44" stroke="url(#cineGrad)" strokeWidth="6" opacity="0.9" />
          <circle cx="50" cy="50" r="44" stroke="url(#mindGrad)" strokeWidth="2" strokeDasharray="6 10" opacity="0.6" />

          {/* Film Reel Sprocket Holes / Neural Nodes */}
          <circle cx="50" cy="14" r="3.5" fill="#818CF8" />
          <circle cx="86" cy="50" r="3.5" fill="#EC4899" />
          <circle cx="50" cy="86" r="3.5" fill="#38BDF8" />
          <circle cx="14" cy="50" r="3.5" fill="#34D399" />

          {/* Neural Connections (Mind Network) */}
          <path d="M 50 14 L 32 38 L 50 50 L 68 38 Z" fill="none" stroke="url(#cineGrad)" strokeWidth="2.5" opacity="0.8" />
          <path d="M 50 86 L 32 62 L 50 50 L 68 62 Z" fill="none" stroke="url(#mindGrad)" strokeWidth="2.5" opacity="0.8" />

          {/* Central Cinema Play Triangle */}
          <path
            d="M 44 35 L 64 50 L 44 65 Z"
            fill="url(#cineGrad)"
            filter="url(#glow)"
          />
          <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Merged Text Logo: CineMind */}
      {showText && (
        <span className={`font-display font-extrabold tracking-tight ${dimensions.text}`}>
          <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Cine
          </span>
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Mind
          </span>
        </span>
      )}
    </div>
  );
};

export default CineMindLogo;
