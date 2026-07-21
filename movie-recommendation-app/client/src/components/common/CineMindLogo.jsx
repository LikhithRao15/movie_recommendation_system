import React from 'react';
import logoImg from '../../assets/logo.png';

const CineMindLogo = ({ size = 'md', className = '' }) => {
  const heightClass = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-16',
    lg: 'h-20 sm:h-24',
    xl: 'h-28 sm:h-36',
  }[size] || 'h-14 sm:h-16';

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
