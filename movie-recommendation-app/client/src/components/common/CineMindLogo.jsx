import React from 'react';
import logoImg from '../../assets/logo.png';

const CineMindLogo = ({ size = 'md', className = '' }) => {
  const heightClass = {
    sm: 'h-8',
    md: 'h-10 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
  }[size] || 'h-10 sm:h-12';

  return (
    <div className={`flex items-center group select-none ${className}`}>
      <img
        src={logoImg}
        alt="CineMind - Discover Movies You'll Love"
        className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(239,68,68,0.25)]`}
      />
    </div>
  );
};

export default CineMindLogo;
