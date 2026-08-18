import React from 'react';
import { X, Keyboard, MousePointer, Navigation, ShieldAlert } from 'lucide-react';

interface ControlGuideModalProps {
  onClose: () => void;
}

export const ControlGuideModal: React.FC<ControlGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
              🎮
            </div>
            <div>
              <h2 className="text-lg font-black text-white">遊戲玩法與操作指南</h2>
              <p className="text-xs text-slate-400">支援鍵盤 (WASD/方向鍵)、滑鼠點擊、螢幕虛擬方向盤</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-200 text-xs">
          {/* Section 1: Core Goal */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-1.5">
            <div className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>救援核心目標</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              城市各處會隨機出現受傷的小熊（附帶生命 HP 倒數），玩家作為救護隊長只能使用「大眾交通工具」趕到現場抱起小熊，並挑選「未滿床、等待人數少」的急診醫院完成救治！
            </p>
          </div>

          {/* Section 2: Control Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Keyboard Controls */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="font-bold text-sm text-sky-300 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                <span>鍵盤操作方式</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">上下左右移動：</span>
                  <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-sky-200">
                    W A S D / ↑ ↓ ← →
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">上下運具 / 步行切換</span>
                <span className="font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[11px] font-bold">
                  Z 鍵 (在運具上加速 4~30x)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">抱起救援 / 送入急診</span>
                <span className="font-mono bg-slate-800 text-amber-300 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                  Space 空白鍵 / Enter
                </span>
              </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">切換交通模式：</span>
                  <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-amber-300">
                    1(步) 2(單) 3(捷) 4(公) 5(鐵)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">快捷面板：</span>
                  <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-rose-300">
                    H(急診看板) / B(圖鑑)
                  </span>
                </div>
              </div>
            </div>

            {/* Mouse & Touch Controls */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
              <div className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                <span>滑鼠與觸控操作</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400">●</span>
                  <span>點選「下方 HUD 鄰近站點卡片」即可秒速上車前往。</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400">●</span>
                  <span>點擊地圖上的捷運站點、YouBike、公車站可直接乘車。</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400">●</span>
                  <span>接近小熊或醫院時，點選跳出的金色「抱起救援」或綠色「送入急診」按鈕。</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Transit Speeds */}
          <div className="bg-slate-800/40 border border-slate-700/70 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-xs text-slate-300 flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>交通工具速度換算 (真實時速物理)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-700">
                <div className="text-slate-400">🚶 步行</div>
                <div className="font-bold text-slate-200 mt-0.5">4.5 km/h</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-700">
                <div className="text-orange-400">🚲 YouBike</div>
                <div className="font-bold text-orange-200 mt-0.5">18.0 km/h</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-700">
                <div className="text-emerald-400">🚌 幹線公車</div>
                <div className="font-bold text-emerald-200 mt-0.5">30.0 km/h</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-700">
                <div className="text-sky-400">🚇 捷運/輕軌</div>
                <div className="font-bold text-sky-200 mt-0.5">55.0 km/h</div>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-700">
                <div className="text-purple-400">🚄 台鐵/高鐵</div>
                <div className="font-bold text-purple-200 mt-0.5">100~220 km/h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 text-center">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg transition-transform active:scale-98"
          >
            我明白了，開始救援！
          </button>
        </div>
      </div>
    </div>
  );
};
