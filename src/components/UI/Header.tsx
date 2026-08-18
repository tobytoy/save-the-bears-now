import React from 'react';
import { Volume2, VolumeX, Layers, BookOpen, Activity, HelpCircle } from 'lucide-react';
import { GameStats } from '../../types';
import { sound } from '../../utils/audio';
import { MAP_LAYERS, MapTileLayer } from '../Map/TileLayers';

interface HeaderProps {
  stats: GameStats;
  currentLayer: MapTileLayer;
  onSelectLayer: (layer: MapTileLayer) => void;
  onOpenDex: () => void;
  onOpenHospitalList: () => void;
  onOpenTutorial: () => void;
  lastUpdated: string;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentLayer,
  onSelectLayer,
  onOpenDex,
  onOpenHospitalList,
  onOpenTutorial,
  lastUpdated,
  isSoundEnabled,
  onToggleSound
}) => {
  const [showLayerDropdown, setShowLayerDropdown] = React.useState(false);

  return (
    <header className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
      {/* Left Brand Badge */}
      <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl shadow-inner">
            🐻
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400">
            即刻救熊：大眾運輸救援
          </h1>
          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">● 任務進行中</span>
            <span>|</span>
            <span>健保即時連線 {lastUpdated || '已同步'}</span>
          </p>
        </div>
      </div>

      {/* Middle Stats Badges */}
      <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded-2xl shadow-xl text-xs sm:text-sm">
        {/* Score */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-xl font-bold text-amber-300">
          <span>🏆</span>
          <span>{stats.score.toLocaleString()} 分</span>
        </div>

        {/* Bears Saved */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-xl font-bold text-emerald-300">
          <span>💖 拯救</span>
          <span>{stats.bearsSaved} 隻</span>
        </div>

        {/* Carbon Credit Saved */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/15 border border-teal-500/30 rounded-xl font-bold text-teal-300">
          <span>🌱 減碳</span>
          <span>{stats.carbonSavedKg.toFixed(1)} kg</span>
        </div>
      </div>

      {/* Right Control Actions */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Real Emergency Simulation & How to Play Tutorial */}
        <button
          onClick={onOpenTutorial}
          className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-xs font-black shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          title="查看真實應急模擬與玩法教學"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>應急教學</span>
        </button>

        {/* Hospital Dashboard Trigger */}
        <button
          onClick={onOpenHospitalList}
          className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900/90 text-rose-200 border border-rose-600/50 backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-xs font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="hidden sm:inline">全台急診看板</span>
        </button>

        {/* Bear Encyclopedia */}
        <button
          onClick={onOpenDex}
          className="flex items-center gap-1.5 bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-xs font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">熊熊圖鑑</span>
        </button>

        {/* Map Layer Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLayerDropdown(!showLayerDropdown)}
            className="flex items-center gap-1.5 bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md px-3 py-2.5 rounded-2xl text-xs font-bold shadow-xl transition-all duration-200 hover:scale-105"
            title="切換地圖圖層"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline">{currentLayer.name.split(' ')[1] || '底圖'}</span>
          </button>

          {showLayerDropdown && (
            <div className="absolute right-0 top-12 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-2 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 border-b border-slate-800">
                選擇地圖圖層 (Tile Layers)
              </div>
              {MAP_LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    onSelectLayer(layer);
                    setShowLayerDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    currentLayer.id === layer.id
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span>{layer.name}</span>
                  {currentLayer.id === layer.id && <span className="text-sky-400 text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            sound.enabled = !isSoundEnabled;
            onToggleSound();
          }}
          className="p-2.5 bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md rounded-2xl shadow-xl transition-transform active:scale-95"
          title={isSoundEnabled ? '靜音' : '開啟音效'}
        >
          {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>
    </header>
  );
};
