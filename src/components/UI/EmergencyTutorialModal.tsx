import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Activity,
  Navigation,
  Keyboard,
  Sparkles,
  HeartPulse,
  ArrowRight
} from 'lucide-react';
import { CaptainBear } from '../Assets/BearIllustrations';
import { VehicleIcon } from '../Assets/VehicleIcons';

interface EmergencyTutorialModalProps {
  onClose: () => void;
}

export const EmergencyTutorialModal: React.FC<EmergencyTutorialModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'REAL_LIFE' | 'NHI_DATA' | 'TRANSIT' | 'GAMEPLAY'>('REAL_LIFE');

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-rose-500/30 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner">
              🚑
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>真實應急模擬與玩法教學</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                  真實開放資料連線
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                平時多模擬，突發狀況不慌張 · 真實大眾交通路網 × 健保署急診即時資訊
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('REAL_LIFE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'REAL_LIFE'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>1. 現實突發應急模擬</span>
          </button>

          <button
            onClick={() => setActiveTab('NHI_DATA')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'NHI_DATA'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>2. 健保即時急診數據解密</span>
          </button>

          <button
            onClick={() => setActiveTab('TRANSIT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'TRANSIT'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>3. 大眾運輸轉乘實戰</span>
          </button>

          <button
            onClick={() => setActiveTab('GAMEPLAY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'GAMEPLAY'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>4. 遊戲操作與高分指南</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs leading-relaxed">
          {/* TAB 1: REAL LIFE SIMULATION */}
          {activeTab === 'REAL_LIFE' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-r from-rose-950/50 via-slate-900 to-amber-950/40 border border-rose-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-950/80 border border-rose-500/50 flex items-center justify-center flex-shrink-0">
                  <CaptainBear size={68} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-rose-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    為什麼這款遊戲能救命？
                  </h3>
                  <p className="text-slate-300 mt-1">
                    在現實生活中，如果自己、朋友或路人突發中暑昏倒、骨折扭傷，此時若叫不到計程車、路面塞車、或是叫不到救護車時，往往容易陷入恐慌不知所措。這款遊戲讓您以真實地理與路網進行模擬，熟練如何運用身邊的 <strong className="text-amber-300">YouBike、公車、捷運</strong> 第一時間送醫！
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 space-y-1.5">
                  <div className="text-amber-400 font-bold text-xs flex items-center gap-1">
                    <span>⚡ 狀況一：鬧區中暑/低血糖昏倒</span>
                  </div>
                  <p className="text-slate-300/90">
                    在巷弄或公園最快的方式是直接刷 <strong className="text-orange-300">YouBike</strong> 短距接駁，或利用鄰近捷運站空調車廂快速送醫降溫！
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 space-y-1.5">
                  <div className="text-sky-400 font-bold text-xs flex items-center gap-1">
                    <span>🚇 狀況二：跨區重大急救</span>
                  </div>
                  <p className="text-slate-300/90">
                    避開尖峰時段平面道路塞車風險，直接搭乘 <strong className="text-sky-300">捷運 (55km/h)</strong> 直達如台大、北榮、亞東、萬芳等直通醫院站點。
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 space-y-1.5">
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                    <span>🏥 狀況三：避免送到滿床急診</span>
                  </div>
                  <p className="text-slate-300/90">
                    送醫前先查健保即時 API！若大醫院已發出滿床通報，改送鄰近次級責任醫院反而能更快獲得醫師診治。
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/70 rounded-2xl p-3.5 flex items-center gap-3">
                <div className="text-2xl">💡</div>
                <div className="text-slate-300">
                  <strong className="text-white">口訣記憶：</strong> 遇事故不要慌，找最近 YouBike/捷運站，開健保即時查床位，分秒必爭救小熊！
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NHI EMERGENCY DATA */}
          {activeTab === 'NHI_DATA' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                <div className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>衛福部健保署即時急診 API 資料欄位說明</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  本遊戲連線健保署公開的真實急診看板資訊，每 5~10 分鐘自動同步全台 28+ 家主要重度急救責任醫院與兒童醫院：
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900/80 border border-rose-500/40 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300 text-xs">🔴 滿床通報 (inform: Y)</span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">高警報</span>
                  </div>
                  <p className="text-slate-300">
                    代表該院急診留觀床或加護病房已 100% 飽和！送去可能要排隊數小時甚至延誤急救，遊戲內將扣分！
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-emerald-500/40 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 text-xs">🟢 急診待床數 (waitBed) &lt; 5</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">推薦</span>
                  </div>
                  <p className="text-slate-300">
                    代表急診床位充足，推床與醫師能第一時間接手搶救！送達可獲得 <strong className="text-emerald-400">+500分加成</strong>！
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-3.5 space-y-1">
                  <div className="font-bold text-sky-300 text-xs">🩺 等待看診人數 (waitSee)</div>
                  <p className="text-slate-300">
                    目前正在急診候診區等待檢傷與醫師問診的人數。人數過多（&gt;10人）代表現場醫護極度繁忙。
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-3.5 space-y-1">
                  <div className="font-bold text-purple-300 text-xs">🛏️ 等待住院 / ICU (waitGeneral / waitIcu)</div>
                  <p className="text-slate-300">
                    重症病患需要入住一般病房或加護病房但尚在排隊的人數，反映全院總體醫療量能負荷。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSIT NETWORK */}
          {activeTab === 'TRANSIT' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                <div className="font-extrabold text-sm text-sky-300 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-sky-400" />
                  <span>台灣大眾運輸路網特點與時速換算</span>
                </div>
                <p className="text-slate-300">
                  遊戲內嚴格套用大眾運輸速度物理模型，玩家無法憑空瞬間移動：
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="bg-slate-900/80 border border-orange-500/40 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <VehicleIcon mode="BIKE" size={24} />
                    <div>
                      <div className="font-bold text-orange-300 text-xs">YouBike 共享單車 (18 km/h)</div>
                      <div className="text-slate-400 text-[11px]">巷弄穿梭第一名！適合從事故現場接駁到最近捷運站或公車站。</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-orange-300 font-bold">短程接駁 (0~3km)</span>
                </div>

                <div className="bg-slate-900/80 border border-sky-500/40 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <VehicleIcon mode="METRO" size={24} />
                    <div>
                      <div className="font-bold text-sky-300 text-xs">捷運 / 輕軌 (55 km/h)</div>
                      <div className="text-slate-400 text-[11px]">都會區最準時、不受紅綠燈影響的高速路網，直通多家醫學中心。</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-sky-300 font-bold">都會核心 (2~15km)</span>
                </div>

                <div className="bg-slate-900/80 border border-emerald-500/40 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <VehicleIcon mode="BUS" size={24} />
                    <div>
                      <div className="font-bold text-emerald-300 text-xs">幹線公車 (30 km/h)</div>
                      <div className="text-slate-400 text-[11px]">如 307、信義、承德、南京幹線，站點直接設於醫院門口。</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 font-bold">路網密集 (1~8km)</span>
                </div>

                <div className="bg-slate-900/80 border border-purple-500/40 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <VehicleIcon mode="THSR" size={24} />
                    <div>
                      <div className="font-bold text-purple-300 text-xs">台灣高鐵 / 台鐵 (100~220 km/h)</div>
                      <div className="text-slate-400 text-[11px]">跨縣市（台北 ↔ 台中 ↔ 高雄）特急長途醫療長征救助！</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-purple-300 font-bold">跨縣市長征 (20~100km)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GAMEPLAY CONTROLS */}
          {activeTab === 'GAMEPLAY' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Step Flow */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
                <div className="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>5 步驟完成一次完美救援任務</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-black flex items-center justify-center flex-shrink-0 text-xs">1</span>
                    <div>
                      <strong className="text-slate-200">搜救定位：</strong> 查看地圖上閃爍的小熊圖標與生命值（HP）。
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-black flex items-center justify-center flex-shrink-0 text-xs">2</span>
                    <div>
                      <strong className="text-slate-200">趕往現場：</strong> 點擊下方 HUD 鄰近站點或使用鍵盤 <span className="font-mono bg-slate-800 px-1 py-0.2 rounded border border-slate-700 text-sky-300">W/A/S/D</span> 或 <span className="font-mono bg-slate-800 px-1 py-0.2 rounded border border-slate-700 text-sky-300">↑↓←→</span> 移動。
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-black flex items-center justify-center flex-shrink-0 text-xs">3</span>
                    <div>
                      <strong className="text-slate-200">抱起小熊：</strong> 靠近小熊身邊後，按下 <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-amber-300 font-bold">Space 空白鍵</span> 或點選畫面上跳出的「抱起救援」按鈕。
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-black flex items-center justify-center flex-shrink-0 text-xs">4</span>
                    <div>
                      <strong className="text-slate-200">查看急診看板：</strong> 點擊右上角「全台急診看板」挑選一所 <strong className="text-emerald-400">綠色未滿床</strong> 的醫院點擊「搭車前往」。
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 font-black flex items-center justify-center flex-shrink-0 text-xs">5</span>
                    <div>
                      <strong className="text-slate-200">送入急診室：</strong> 抵達醫院後按下 <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-emerald-300 font-bold">Space 空白鍵</span> 完成治療，解鎖彩帶慶祝與 3 星評價！
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyboard Cheat Sheet */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400">移動鍵</div>
                  <div className="font-mono font-bold text-sky-300 mt-1">WASD / 方向鍵</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-emerald-500/30">
                  <div className="text-emerald-400 font-bold">上下運具 (加速)</div>
                  <div className="font-mono font-bold text-emerald-300 mt-1">Z 鍵</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400">救援 / 送醫</div>
                  <div className="font-mono font-bold text-emerald-300 mt-1">Space / Enter</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400">切換交通模式</div>
                  <div className="font-mono font-bold text-amber-300 mt-1">1 2 3 4 5 鍵</div>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400">急診 / 圖鑑</div>
                  <div className="font-mono font-bold text-rose-300 mt-1">H 鍵 / B 鍵</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400">●</span>
            <span>衛福部健保署 API 與全台大眾運輸路網即時連線中</span>
          </div>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <span>我學會了！開始模擬救援</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
