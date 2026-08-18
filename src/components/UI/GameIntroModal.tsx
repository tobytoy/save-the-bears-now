import React from 'react';
import { Play, Shield, Heart, Activity, BookOpen } from 'lucide-react';
import { CaptainBear, InjuredBear } from '../Assets/BearIllustrations';
import { VehicleIcon } from '../Assets/VehicleIcons';

interface GameIntroModalProps {
  onStart: () => void;
  onOpenTutorial: () => void;
}

export const GameIntroModal: React.FC<GameIntroModalProps> = ({ onStart, onOpenTutorial }) => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center">
        {/* Banner with Captain Bear & Injured Bear */}
        <div className="flex items-center justify-center gap-4 my-2">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shadow-lg">
            <CaptainBear size={68} />
          </div>
          <span className="text-2xl animate-pulse">➕</span>
          <div className="w-20 h-20 rounded-2xl bg-orange-500/15 border border-orange-400/40 flex items-center justify-center shadow-lg">
            <InjuredBear size={68} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 mt-3">
          即刻救熊：大眾運輸救援大作戰
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-1">
          真實健保署急診資料 × 全台大眾交通路網 · 實戰突發應急模擬
        </p>

        {/* Mission Brief Rules */}
        <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 my-4 space-y-3 text-left text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1 bg-amber-500/20 text-amber-300 rounded-lg flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-100">1. 只能使用大眾交通工具（真實現實路網）：</span>
              <p className="text-slate-300/80 mt-0.5">
                依距離切換 <span className="text-sky-300 font-semibold">捷運(55km/h)</span>、<span className="text-emerald-300 font-semibold">公車(30km/h)</span>、<span className="text-orange-300 font-semibold">YouBike(18km/h)</span> 或 <span className="text-purple-300 font-semibold">高鐵(220km/h)</span>。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1 bg-rose-500/20 text-rose-300 rounded-lg flex-shrink-0 mt-0.5">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-100">2. 把握黃金急救時間：</span>
              <p className="text-slate-300/80 mt-0.5">
                每隻熊熊有生命耐受度倒數（HP），鍵盤按 <span className="font-mono bg-slate-700 px-1 rounded text-amber-300">Space 空白鍵</span> 或點擊按鈕即可抱起救援！
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1 bg-emerald-500/20 text-emerald-300 rounded-lg flex-shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-100">3. 依據健保署真實急診狀態送醫：</span>
              <p className="text-slate-300/80 mt-0.5">
                避開 <span className="text-rose-400 font-bold">滿床警報 (inform: Y)</span> 醫院，挑選 <span className="text-emerald-400 font-bold">待床少、順暢</span> 的急診室可獲高分加成！
              </p>
            </div>
          </div>
        </div>

        {/* Transit Mode Preview Bar */}
        <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-slate-300 mb-3 bg-slate-900/60 py-2 px-3 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1"><VehicleIcon mode="WALK" size={14} /> 步行</span>
          <span className="flex items-center gap-1"><VehicleIcon mode="BIKE" size={14} /> YouBike</span>
          <span className="flex items-center gap-1"><VehicleIcon mode="METRO" size={14} /> 捷運</span>
          <span className="flex items-center gap-1"><VehicleIcon mode="BUS" size={14} /> 公車</span>
          <span className="flex items-center gap-1"><VehicleIcon mode="THSR" size={14} /> 高鐵</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={onOpenTutorial}
            className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold py-3 rounded-2xl text-xs shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>📖 真實應急教學</span>
          </button>

          <button
            onClick={onStart}
            className="w-full sm:w-1/2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black py-3 rounded-2xl text-xs shadow-xl transition-all duration-200 hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>出發！開始救援</span>
          </button>
        </div>
      </div>
    </div>
  );
};
