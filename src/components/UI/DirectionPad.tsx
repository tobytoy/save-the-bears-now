import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { TransitMode } from '../../types';

interface DirectionPadProps {
  onDirectionMove: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onQuickAction: () => void;
  currentMode: TransitMode;
  disabled?: boolean;
}

export const DirectionPad: React.FC<DirectionPadProps> = ({
  onDirectionMove,
  onQuickAction,
  currentMode,
  disabled = false
}) => {
  return (
    <div className="absolute right-4 bottom-24 z-[1000] flex flex-col items-center gap-1 pointer-events-auto select-none">
      {/* Up Button */}
      <button
        disabled={disabled}
        onClick={() => onDirectionMove('UP')}
        className="w-10 h-10 bg-slate-900/85 hover:bg-slate-800 active:bg-sky-600 disabled:opacity-40 text-slate-200 border border-slate-700/80 rounded-xl shadow-lg flex items-center justify-center transition-transform active:scale-90"
        title="向北移動 (W / ↑)"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Middle Row (Left, Action/Center, Right) */}
      <div className="flex items-center gap-1">
        {/* Left */}
        <button
          disabled={disabled}
          onClick={() => onDirectionMove('LEFT')}
          className="w-10 h-10 bg-slate-900/85 hover:bg-slate-800 active:bg-sky-600 disabled:opacity-40 text-slate-200 border border-slate-700/80 rounded-xl shadow-lg flex items-center justify-center transition-transform active:scale-90"
          title="向西移動 (A / ←)"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Center Action (Space) */}
        <button
          disabled={disabled}
          onClick={onQuickAction}
          className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 active:scale-90 text-white rounded-xl shadow-xl flex items-center justify-center font-bold text-xs"
          title="抱起小熊 / 送醫 (Space / Enter)"
        >
          <Heart className="w-4 h-4 fill-white" />
        </button>

        {/* Right */}
        <button
          disabled={disabled}
          onClick={() => onDirectionMove('RIGHT')}
          className="w-10 h-10 bg-slate-900/85 hover:bg-slate-800 active:bg-sky-600 disabled:opacity-40 text-slate-200 border border-slate-700/80 rounded-xl shadow-lg flex items-center justify-center transition-transform active:scale-90"
          title="向東移動 (D / →)"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Down Button */}
      <button
        disabled={disabled}
        onClick={() => onDirectionMove('DOWN')}
        className="w-10 h-10 bg-slate-900/85 hover:bg-slate-800 active:bg-sky-600 disabled:opacity-40 text-slate-200 border border-slate-700/80 rounded-xl shadow-lg flex items-center justify-center transition-transform active:scale-90"
        title="向南移動 (S / ↓)"
      >
        <ArrowDown className="w-5 h-5" />
      </button>

      <span className="text-[10px] text-slate-400 font-bold bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800 mt-0.5">
        {currentMode === 'BIKE' ? '🚲 單車' : currentMode === 'WALK' ? '🚶 步行' : '🚇 大眾運輸'}
      </span>
    </div>
  );
};
