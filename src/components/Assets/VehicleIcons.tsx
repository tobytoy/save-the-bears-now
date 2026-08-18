import React from 'react';
import { TransitMode } from '../../types';

interface VehicleIconProps {
  mode: TransitMode;
  size?: number;
  className?: string;
}

export const VehicleIcon: React.FC<VehicleIconProps> = ({ mode, size = 28, className = '' }) => {
  switch (mode) {
    case 'METRO':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="4" y="3" width="16" height="15" rx="3" fill="#0284c7" stroke="#0369a1" />
          <circle cx="8" cy="14" r="1.5" fill="#ffffff" stroke="none" />
          <circle cx="16" cy="14" r="1.5" fill="#ffffff" stroke="none" />
          <rect x="7" y="6" width="10" height="5" rx="1" fill="#bae6fd" stroke="none" />
          <line x1="8" y1="18" x2="6" y2="21" stroke="#38bdf8" />
          <line x1="16" y1="18" x2="18" y2="21" stroke="#38bdf8" />
        </svg>
      );
    case 'BUS':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="4" width="18" height="14" rx="3" fill="#16a34a" stroke="#15803d" />
          <rect x="6" y="7" width="12" height="4" rx="1" fill="#bbf7d0" stroke="none" />
          <circle cx="7.5" cy="15" r="1.5" fill="#ffffff" stroke="none" />
          <circle cx="16.5" cy="15" r="1.5" fill="#ffffff" stroke="none" />
          <line x1="6" y1="18" x2="6" y2="20" stroke="#4ade80" />
          <line x1="18" y1="18" x2="18" y2="20" stroke="#4ade80" />
        </svg>
      );
    case 'BIKE':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="5.5" cy="17.5" r="3.5" fill="#fdba74" stroke="#ea580c" />
          <circle cx="18.5" cy="17.5" r="3.5" fill="#fdba74" stroke="#ea580c" />
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5l3.5-7.5H19" stroke="#f97316" strokeWidth="2" />
          <path d="M12 17.5l-4-6h5l2.5 4" stroke="#f97316" strokeWidth="2" />
          <circle cx="12" cy="17.5" r="1.5" fill="#ea580c" />
        </svg>
      );
    case 'THSR':
    case 'TRA':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 15V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#7c3aed" stroke="#6d28d9" />
          <path d="M7 6h10v4H7z" fill="#ddd6fe" stroke="none" />
          <circle cx="8" cy="14" r="1.5" fill="#ffffff" stroke="none" />
          <circle cx="16" cy="14" r="1.5" fill="#ffffff" stroke="none" />
          <path d="m9 17-2 3m8-3 2 3" stroke="#a78bfa" />
        </svg>
      );
    case 'WALK':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="5" r="2.5" fill="#94a3b8" stroke="none" />
          <path d="m9 20 2.5-6.5L14 16l2 4" stroke="#94a3b8" strokeWidth="2" />
          <path d="m7 13 4-3.5 3.5 2 2.5-1.5" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      );
  }
};
