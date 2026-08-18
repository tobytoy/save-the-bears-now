import React from 'react';
import { BearInjuryType } from '../../types';

interface BearSvgProps {
  className?: string;
  size?: number;
}

// 1. 🐻 台灣黑熊急救隊長 (Captain Bear)
export const CaptainBear: React.FC<BearSvgProps> = ({ className = '', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ears */}
    <circle cx="28" cy="28" r="14" fill="#1e293b" />
    <circle cx="28" cy="28" r="8" fill="#fdba74" />
    <circle cx="72" cy="28" r="14" fill="#1e293b" />
    <circle cx="72" cy="28" r="8" fill="#fdba74" />
    
    {/* Body & Head */}
    <rect x="24" y="60" width="52" height="35" rx="16" fill="#1e293b" />
    <circle cx="50" cy="50" r="32" fill="#1e293b" />
    
    {/* Formosan V Mark (Chest) */}
    <path d="M 38 72 L 50 86 L 62 72 L 58 70 L 50 80 L 42 70 Z" fill="#ffffff" />

    {/* Muzzle */}
    <ellipse cx="50" cy="56" rx="16" ry="12" fill="#fde68a" />
    <polygon points="46,50 54,50 50,55" fill="#0f172a" />
    <path d="M 50 55 Q 50 60 46 62 M 50 55 Q 50 60 54 62" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

    {/* Eyes */}
    <circle cx="40" cy="44" r="4.5" fill="#0f172a" />
    <circle cx="41.5" cy="42.5" r="1.5" fill="#ffffff" />
    <circle cx="60" cy="44" r="4.5" fill="#0f172a" />
    <circle cx="61.5" cy="42.5" r="1.5" fill="#ffffff" />

    {/* Rosy Cheeks */}
    <circle cx="34" cy="53" r="4" fill="#fca5a5" opacity="0.6" />
    <circle cx="66" cy="53" r="4" fill="#fca5a5" opacity="0.6" />

    {/* Medic Hat */}
    <path d="M 38 24 C 38 16 62 16 62 24 Z" fill="#ef4444" />
    <rect x="34" y="24" width="32" height="6" rx="3" fill="#ffffff" />
    <path d="M 48 18 H 52 M 50 16 V 20" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 2. 🩹 受傷骨折小熊 (Injured Bear)
export const InjuredBear: React.FC<BearSvgProps> = ({ className = '', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ears */}
    <circle cx="28" cy="28" r="14" fill="#b45309" />
    <circle cx="28" cy="28" r="8" fill="#fed7aa" />
    <circle cx="72" cy="28" r="14" fill="#b45309" />
    <circle cx="72" cy="28" r="8" fill="#fed7aa" />

    {/* Head & Body */}
    <rect x="25" y="60" width="50" height="34" rx="15" fill="#b45309" />
    <circle cx="50" cy="50" r="32" fill="#b45309" />

    {/* Muzzle */}
    <ellipse cx="50" cy="56" rx="15" ry="11" fill="#ffedd5" />
    <polygon points="46,51 54,51 50,55" fill="#451a03" />
    <path d="M 46 60 Q 50 57 54 60" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />

    {/* Sad Teary Eyes */}
    <path d="M 36 45 Q 40 42 44 46" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
    <path d="M 64 45 Q 60 42 56 46" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
    {/* Teardrop */}
    <path d="M 34 50 C 34 53 37 53 37 50 C 37 48 35.5 46 35.5 46 C 35.5 46 34 48 34 50 Z" fill="#38bdf8" />

    {/* Bandage around head */}
    <path d="M 22 36 L 78 30 L 76 22 L 20 28 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
    <path d="M 48 24 L 54 34 M 54 24 L 48 34" stroke="#ef4444" strokeWidth="2" />

    {/* Cheek Band-Aid */}
    <rect x="62" y="52" width="12" height="6" rx="2" transform="rotate(-15 62 52)" fill="#fed7aa" stroke="#fb923c" strokeWidth="1" />
  </svg>
);

// 3. 🧊 中暑高溫小熊 (Heatstroke Bear)
export const HeatstrokeBear: React.FC<BearSvgProps> = ({ className = '', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ears */}
    <circle cx="28" cy="28" r="14" fill="#ea580c" />
    <circle cx="28" cy="28" r="8" fill="#ffedd5" />
    <circle cx="72" cy="28" r="14" fill="#ea580c" />
    <circle cx="72" cy="28" r="8" fill="#ffedd5" />

    {/* Body & Head */}
    <rect x="25" y="60" width="50" height="34" rx="15" fill="#ea580c" />
    <circle cx="50" cy="50" r="32" fill="#ea580c" />

    {/* Dizzy Swirl Eyes */}
    <path d="M 36 44 C 36 41 42 41 42 44 C 42 47 38 47 38 44" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M 58 44 C 58 41 64 41 64 44 C 64 47 60 47 60 44" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Muzzle with open panting mouth */}
    <ellipse cx="50" cy="57" rx="15" ry="11" fill="#ffedd5" />
    <polygon points="47,52 53,52 50,55" fill="#431407" />
    <path d="M 46 60 Q 50 66 54 60" fill="#ef4444" stroke="#431407" strokeWidth="1.5" />
    
    {/* Sweat drops */}
    <path d="M 74 42 C 74 45 77 45 77 42 C 77 40 75.5 38 75.5 38 C 75.5 38 74 40 74 42 Z" fill="#0284c7" />
    <path d="M 23 48 C 23 50 25 50 25 48 C 25 46 24 45 24 45 C 24 45 23 46 23 48 Z" fill="#0284c7" />

    {/* Ice Bag on Head */}
    <ellipse cx="50" cy="22" rx="16" ry="10" fill="#38bdf8" />
    <polygon points="46,14 54,14 50,8" fill="#0284c7" />
    <circle cx="50" cy="8" r="4" fill="#0369a1" />
  </svg>
);

// 4. 🤧 流感發燒小熊 (Flu Bear)
export const FluBear: React.FC<BearSvgProps> = ({ className = '', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ears */}
    <circle cx="28" cy="28" r="14" fill="#78716c" />
    <circle cx="28" cy="28" r="8" fill="#e7e5e4" />
    <circle cx="72" cy="28" r="14" fill="#78716c" />
    <circle cx="72" cy="28" r="8" fill="#e7e5e4" />

    {/* Body & Head */}
    <rect x="25" y="60" width="50" height="34" rx="15" fill="#78716c" />
    <circle cx="50" cy="50" r="32" fill="#78716c" />

    {/* Droopy Sick Eyes */}
    <path d="M 37 43 L 45 46" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />
    <path d="M 63 43 L 55 46" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />

    {/* Fever Flush */}
    <circle cx="34" cy="52" r="6" fill="#f87171" opacity="0.8" />
    <circle cx="66" cy="52" r="6" fill="#f87171" opacity="0.8" />

    {/* Muzzle */}
    <ellipse cx="50" cy="57" rx="15" ry="11" fill="#f5f5f4" />
    <circle cx="50" cy="53" r="3" fill="#dc2626" /> {/* Red nose */}

    {/* Thermometer in mouth */}
    <rect x="52" y="58" width="22" height="4" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" transform="rotate(-15 52 58)" />
    <circle cx="72" cy="53" r="4" fill="#ef4444" />

    {/* Cozy Scarf */}
    <path d="M 28 66 Q 50 74 72 66 Q 74 76 50 78 Q 26 76 28 66 Z" fill="#3b82f6" />
    <rect x="58" y="70" width="10" height="18" rx="3" fill="#2563eb" />
  </svg>
);

// 5. 🍔 肚子餓餓小熊 (Hungry Bear)
export const HungryBear: React.FC<BearSvgProps> = ({ className = '', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ears */}
    <circle cx="28" cy="28" r="14" fill="#d97706" />
    <circle cx="28" cy="28" r="8" fill="#fef3c7" />
    <circle cx="72" cy="28" r="14" fill="#d97706" />
    <circle cx="72" cy="28" r="8" fill="#fef3c7" />

    {/* Body & Head */}
    <rect x="25" y="60" width="50" height="34" rx="15" fill="#d97706" />
    <circle cx="50" cy="50" r="32" fill="#d97706" />

    {/* Big Begging Eyes */}
    <circle cx="40" cy="44" r="6" fill="#451a03" />
    <circle cx="38" cy="42" r="2.5" fill="#ffffff" />
    <circle cx="42" cy="46" r="1" fill="#ffffff" />

    <circle cx="60" cy="44" r="6" fill="#451a03" />
    <circle cx="58" cy="42" r="2.5" fill="#ffffff" />
    <circle cx="62" cy="46" r="1" fill="#ffffff" />

    {/* Muzzle */}
    <ellipse cx="50" cy="57" rx="15" ry="11" fill="#fef3c7" />
    <polygon points="47,52 53,52 50,55" fill="#451a03" />
    {/* Drool */}
    <path d="M 52 61 C 52 64 54 64 54 61 C 54 59 53 58 53 58 C 53 58 52 59 52 61 Z" fill="#67e8f9" />

    {/* Empty Honey Pot */}
    <ellipse cx="50" cy="80" rx="14" ry="10" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
    <text x="44" y="83" fill="#78350f" fontSize="8" fontWeight="bold">HONEY</text>
  </svg>
);

// 6. 💖 康復開心熊 (Healed Happy Bear)
export const HealedBear: React.FC<BearSvgProps> = ({ className = '', size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ears */}
    <circle cx="26" cy="26" r="15" fill="#f59e0b" />
    <circle cx="26" cy="26" r="8" fill="#fef3c7" />
    <circle cx="74" cy="26" r="15" fill="#f59e0b" />
    <circle cx="74" cy="26" r="8" fill="#fef3c7" />

    {/* Raised Cheerful Arms */}
    <ellipse cx="18" cy="48" rx="8" ry="14" fill="#f59e0b" transform="rotate(-30 18 48)" />
    <ellipse cx="82" cy="48" rx="8" ry="14" fill="#f59e0b" transform="rotate(30 82 48)" />

    {/* Body & Head */}
    <rect x="25" y="60" width="50" height="34" rx="15" fill="#f59e0b" />
    <circle cx="50" cy="50" r="32" fill="#f59e0b" />

    {/* Heart Eyes */}
    <path d="M 36 42 C 34 38 30 40 30 43 C 30 46 36 50 36 50 C 36 50 42 46 42 43 C 42 40 38 38 36 42 Z" fill="#ec4899" />
    <path d="M 64 42 C 62 38 58 40 58 43 C 58 46 64 50 64 50 C 64 50 70 46 70 43 C 70 40 66 38 64 42 Z" fill="#ec4899" />

    {/* Muzzle with Big Happy Smile */}
    <ellipse cx="50" cy="58" rx="16" ry="12" fill="#fef3c7" />
    <polygon points="47,53 53,53 50,56" fill="#78350f" />
    <path d="M 43 60 Q 50 69 57 60" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="#ef4444" />

    {/* Sparkles */}
    <path d="M 12 24 L 14 18 L 20 20 L 14 22 Z" fill="#fbbf24" />
    <path d="M 86 24 L 88 18 L 82 20 L 88 22 Z" fill="#fbbf24" />
  </svg>
);

export const BearIllustration: React.FC<{ type: BearInjuryType | 'CAPTAIN' | 'HEALED'; size?: number; className?: string }> = ({
  type,
  size = 64,
  className = ''
}) => {
  switch (type) {
    case 'CAPTAIN':
      return <CaptainBear size={size} className={className} />;
    case 'HEALED':
      return <HealedBear size={size} className={className} />;
    case 'HEATSTROKE':
      return <HeatstrokeBear size={size} className={className} />;
    case 'FLU':
      return <FluBear size={size} className={className} />;
    case 'HUNGRY':
      return <HungryBear size={size} className={className} />;
    case 'FRACTURE':
    case 'EXHAUSTED':
    default:
      return <InjuredBear size={size} className={className} />;
  }
};
