import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Heart, Bike, Footprints } from 'lucide-react';
import { TransitMode } from '../../types';

interface DirectionPadProps {
  onDirectionMove: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onQuickAction: () => void;
  onToggleBoard?: () => void;
  isOnTransit?: boolean;
  currentMode: TransitMode;
  disabled: boolean;
}

export const DirectionPad: React.FC<DirectionPadProps> = ({
  onDirectionMove,
  onQuickAction,
  onToggleBoard,
  isOnTransit,
  currentMode,
  disabled
}) => {
  return (
    <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-[1200] flex flex-col items-center gap-1 pointer-events-auto select-none">
      {/* Top: Transit Boarding Quick Button (Z) */}
      {onToggleBoard && (
        <button
          onClick={onToggleBoard}
          disabled={disabled}
          className={`w-full py-1.5 px-3 rounded-2xl border text-[11px] font-black shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 mb-1 backdrop-blur-md ${
            isOnTransit
              ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400'
              : 'bg-amber-500/90 hover:bg-amber-400 text-slate-950 border-amber-300'
          }`}
          title="按 Z 鍵上下運具"
        >
          {isOnTransit ? <Footprints className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
          <span>{isOnTransit ? `下車 (Z)` : `上運具 (Z)`}</span>
        </button>
      )}

      {/* D-Pad Container */}
      <div className="relative w-32 h-32 bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-1 shadow-2xl flex items-center justify-center">
        {/* UP */}
        <button
          disabled={disabled}
          onClick={() => onDirectionMove('UP')}
          className="absolute top-1.5 left-1/2 -translate-x-1/2 w-9 h-9 bg-slate-800/90 hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 text-white rounded-xl border border-slate-600 flex items-center justify-center shadow transition-all active:scale-90"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* DOWN */}
        <button
          disabled={disabled}
          onClick={() => onDirectionMove('DOWN')}
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-9 h-9 bg-slate-800/90 hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 text-white rounded-xl border border-slate-600 flex items-center justify-center shadow transition-all active:scale-90"
        >
          <ArrowDown className="w-4 h-4" />
        </button>

        {/* LEFT */}
        <button
          disabled={disabled}
          onClick={() => onDirectionMove('LEFT')}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-800/90 hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 text-white rounded-xl border border-slate-600 flex items-center justify-center shadow transition-all active:scale-90"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* RIGHT */}
        <button
          disabled={disabled}
          onClick={() => onDirectionMove('RIGHT')}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-800/90 hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 text-white rounded-xl border border-slate-600 flex items-center justify-center shadow transition-all active:scale-90"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* CENTER ACTION: Pick Up / Deliver (Space) */}
        <button
          disabled={disabled}
          onClick={onQuickAction}
          className="w-10 h-10 bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 rounded-2xl shadow-lg border border-amber-300 flex items-center justify-center transition-transform active:scale-90"
          title="抱起小熊 / 送入急診 (Space)"
        >
          <Heart className="w-5 h-5 fill-slate-950" />
        </button>
      </div>

      {/* Speed Badge */}
      <div className="text-[10px] font-bold text-slate-400 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-slate-800">
        {isOnTransit ? `🚀 高速 (${currentMode})` : `🚶 慢速步行`}
      </div>
    </div>
  );
};
