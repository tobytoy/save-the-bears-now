/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bear: {
          dark: '#1e293b',
          brown: '#78350f',
          tan: '#d97706',
          light: '#fef3c7',
          honey: '#f59e0b',
        },
        transit: {
          metro: '#0284c7', // 捷運藍
          bus: '#16a34a',   // 公車綠
          bike: '#f97316',  // YouBike 橘
          train: '#7c3aed', // 台鐵/高鐵 紫
          walk: '#64748b',  // 步行 灰
        },
        er: {
          good: '#22c55e',  // 床位充裕
          busy: '#eab308',  // 忙碌
          full: '#ef4444',  // 滿床警報
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
