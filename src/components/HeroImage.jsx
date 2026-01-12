import React, { useState } from 'react';
import heroImage from '../assets/pounded-yam.jpg';

export const HeroImage = () => {
  const [imageError, setImageError] = useState(false);

  if (!imageError) {
    return (
      <img
        src={heroImage}
        alt="Hero"
        width={450}
        height={450}
        style={{ objectFit: 'contain' }}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <svg width="450" height="450" viewBox="0 0 450 450" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="225" cy="380" rx="180" ry="30" fill="#E0E0E0" opacity="0.3"/>
      <circle cx="225" cy="200" r="150" fill="#FFE8E8"/>
      <ellipse cx="225" cy="200" rx="130" ry="125" fill="#FFF5F5"/>
      <circle cx="225" cy="170" r="70" fill="#FFD166"/>
      <ellipse cx="210" cy="160" rx="25" ry="20" fill="#FF6B6B" opacity="0.8"/>
      <ellipse cx="240" cy="165" rx="20" ry="18" fill="#4ECDC4" opacity="0.8"/>
      <ellipse cx="225" cy="185" rx="18" ry="15" fill="#06D6A0" opacity="0.8"/>
      <path
        d="M 180 220 Q 225 250 270 220"
        stroke="#2D3047"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};