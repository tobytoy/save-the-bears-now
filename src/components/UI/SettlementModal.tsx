import React from 'react';
import { Star, Leaf, Clock, ArrowRight, Heart } from 'lucide-react';
import { RescueHistory } from '../../types';
import { HealedBear } from '../Assets/BearIllustrations';
import { VehicleIcon } from '../Assets/VehicleIcons';

interface SettlementModalProps {
  settlement: RescueHistory | null;
  onContinue: () => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({ settlement, onContinue }) => {
  if (!settlement) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Animated Celebration Bear */}
        <div className="relative my-2">
          <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center shadow-inner animate-bounce-subtle">
            <HealedBear size={80} />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-pink-500 text-white rounded-full p-1.5 shadow-lg">
            <Heart className="w-4 h-4 fill-white" />
          </span>
        </div>

        {/* Mission Title */}
        <h2 className="text-xl font-black text-white mt-2">救援大成功！</h2>
        <p className="text-xs text-amber-300 font-bold mt-0.5">
          {settlement.bearName} 已經平安抵達急診室並完成治療！
        </p>

        {/* Star Rating */}
        <div className="flex items-center justify-center gap-1.5 my-3">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-7 h-7 ${
                star <= settlement.rating
                  ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Mission Metrics Card */}
        <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 my-3 space-y-2.5 text-xs text-left">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              送醫急救耗時
            </span>
            <span className="font-extrabold text-slate-100">{settlement.timeSpentSec} 秒</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              剩餘生命耐受度
            </span>
            <span className="font-extrabold text-emerald-400">{settlement.healthRemaining}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              大眾運輸減碳貢獻
            </span>
            <span className="font-extrabold text-emerald-300">+{settlement.carbonSavedKg} kg CO2</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <span className="text-slate-400">送達急診醫院</span>
            <span className="font-bold text-amber-300 truncate max-w-[180px]">{settlement.hospitalName}</span>
          </div>

          {/* Transit Modes Used */}
          <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
            <span className="text-slate-400">使用的綠色交通</span>
            <div className="flex items-center gap-1">
              {settlement.transitModesUsed.map((mode, i) => (
                <span key={i} className="p-1 bg-slate-700 rounded-lg" title={mode}>
                  <VehicleIcon mode={mode} size={16} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black py-3 rounded-2xl text-sm shadow-xl transition-all duration-200 hover:scale-102 active:scale-98 flex items-center justify-center gap-2 mt-1"
        >
          <span>出動救援下一隻小熊</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
