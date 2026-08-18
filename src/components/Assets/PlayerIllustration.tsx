import React from 'react';

interface PlayerIllustrationProps {
  size?: number;
  className?: string;
}

// 🐶 柴犬急救隊長 (Shiba Medic Captain)
export const ShibaMedic: React.FC<PlayerIllustrationProps> = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Shiba Ears */}
    <polygon points="22,38 34,12 44,32" fill="#d97706" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
    <polygon points="26,34 34,18 40,30" fill="#fed7aa" />
    
    <polygon points="78,38 66,12 56,32" fill="#d97706" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
    <polygon points="74,34 66,18 60,30" fill="#fed7aa" />

    {/* Shiba Head & Body */}
    <rect x="25" y="62" width="50" height="32" rx="14" fill="#d97706" stroke="#b45309" strokeWidth="2" />
    <circle cx="50" cy="50" r="32" fill="#d97706" stroke="#b45309" strokeWidth="2" />

    {/* White Fur Face Mask (Shiba Urajiro) */}
    <path
      d="M 28 54 Q 38 42 50 48 Q 62 42 72 54 C 74 68 64 78 50 78 C 36 78 26 68 28 54 Z"
      fill="#ffffff"
    />

    {/* Cute Shiba Eyes (Happy curved) */}
    <circle cx="38" cy="46" r="4.5" fill="#451a03" />
    <circle cx="39.5" cy="44.5" r="1.5" fill="#ffffff" />
    <circle cx="62" cy="46" r="4.5" fill="#451a03" />
    <circle cx="63.5" cy="44.5" r="1.5" fill="#ffffff" />

    {/* White Eyebrow Dots (Maro spots) */}
    <circle cx="36" cy="38" r="3.5" fill="#ffffff" />
    <circle cx="64" cy="38" r="3.5" fill="#ffffff" />

    {/* Rosy Cheeks */}
    <circle cx="30" cy="56" r="4.5" fill="#fca5a5" opacity="0.8" />
    <circle cx="70" cy="56" r="4.5" fill="#fca5a5" opacity="0.8" />

    {/* Shiba Snout & Nose */}
    <ellipse cx="50" cy="58" rx="6" ry="4.5" fill="#451a03" />
    <path d="M 50 62.5 Q 46 67 44 65 M 50 62.5 Q 54 67 56 65" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
    <path d="M 47 65 Q 50 69 53 65" fill="#ef4444" stroke="#451a03" strokeWidth="1" /> {/* Tongue */}

    {/* Medic Hat on Shiba */}
    <path d="M 38 20 C 38 12 62 12 62 20 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
    <rect x="34" y="20" width="32" height="6" rx="3" fill="#ffffff" />
    <path d="M 47 15 H 53 M 50 12 V 18" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

    {/* Stethoscope */}
    <path d="M 36 70 Q 50 86 64 70" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="50" cy="84" r="4.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
  </svg>
);
