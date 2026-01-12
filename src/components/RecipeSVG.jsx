import React from 'react';

export const RecipeSVG = ({ color1, color2, thumbnail }) => {
  if (thumbnail) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
    );
  }
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad${color1}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color1, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color2, stopOpacity: 0.3 }} />
        </linearGradient>
      </defs>
      <rect width="300" height="220" fill={`url(#grad${color1})`} />
      <circle cx="150" cy="110" r="60" fill={color1} opacity="0.6" />
      <circle cx="120" cy="90" r="30" fill={color2} opacity="0.5" />
      <circle cx="180" cy="130" r="35" fill={color1} opacity="0.4" />
      <path d="M 100 180 Q 150 160 200 180" stroke={color2} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};