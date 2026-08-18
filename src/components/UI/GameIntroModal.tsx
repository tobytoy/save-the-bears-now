import React, { useState, useEffect, useRef } from 'react';
import { Play, MapPin, Shuffle, Sparkles, BookOpen, Loader2, CheckCircle2, Search } from 'lucide-react';
import { CaptainBear, InjuredBear } from '../Assets/BearIllustrations';
import { VehicleIcon } from '../Assets/VehicleIcons';
import { geocodeTaiwanAddress, GeocodeResult } from '../../services/geocodingService';
import { TransitNetwork } from '../../types';

interface GameIntroModalProps {
  onStart: (options?: {
    mode: 'RANDOM' | 'CUSTOM';
    customCoord?: [number, number];
    locationName?: string;
    customStationName?: string;
  }) => void;
  onOpenTutorial: () => void;
  transitNetwork: TransitNetwork | null;
}

const POPULAR_PRESETS = [
  { name: '天母美國學校', query: '天母美國學校' },
  { name: '台北101 / 信義商圈', query: '台北101' },
  { name: '新北板橋車站', query: '板橋車站' },
  { name: '新莊體育館', query: '新莊體育館' },
  { name: '新店碧潭風景區', query: '新店碧潭' },
  { name: '淡水老街渡船頭', query: '淡水老街' },
  { name: '台中秋紅谷公園', query: '台中秋紅谷' },
  { name: '高雄駁二特區', query: '高雄駁二' }
];

export const GameIntroModal: React.FC<GameIntroModalProps> = ({ onStart, onOpenTutorial, transitNetwork }) => {
  const [selectedMode, setSelectedMode] = useState<'RANDOM' | 'CUSTOM'>('RANDOM');
  const [addressInput, setAddressInput] = useState('天母美國學校');
  const [isSearching, setIsSearching] = useState(false);
  const [geocodedLocation, setGeocodedLocation] = useState<GeocodeResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);

  // 執行地址或地標查詢
  const performGeocode = async (text: string): Promise<GeocodeResult | null> => {
    if (!text.trim()) return null;
    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await geocodeTaiwanAddress(text, transitNetwork);
      if (result) {
        setGeocodedLocation(result);
        return result;
      } else {
        setSearchError('找不到該地址或地標，請嘗試輸入如「台北市士林區...」或點選推薦地標！');
        return null;
      }
    } catch {
      setSearchError('查詢逾時，已自動切換就近大眾站點！');
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  // 自動依輸入內容防抖搜尋 (Debounced Auto Search)
  useEffect(() => {
    if (selectedMode !== 'CUSTOM' || !addressInput.trim()) return;

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = window.setTimeout(() => {
      performGeocode(addressInput);
    }, 450);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [addressInput, selectedMode]);

  // 開始遊戲 (若尚未定位完畢，自動先完成定位再出發)
  const handleStartGame = async () => {
    if (selectedMode === 'CUSTOM') {
      let loc = geocodedLocation;
      if (!loc && addressInput.trim()) {
        loc = await performGeocode(addressInput.trim());
      }
      if (loc) {
        onStart({
          mode: 'CUSTOM',
          customCoord: [loc.lat, loc.lng],
          locationName: loc.displayName,
          customStationName: loc.matchedStationName
        });
        return;
      }
    }
    // 隨機開始
    onStart({ mode: 'RANDOM' });
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl text-center flex flex-col items-center max-h-[92vh] overflow-y-auto">
        {/* Banner with Captain Bear & Injured Bear */}
        <div className="flex items-center justify-center gap-3 my-1">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shadow-lg">
            <CaptainBear size={54} />
          </div>
          <span className="text-2xl animate-pulse">➕</span>
          <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-400/40 flex items-center justify-center shadow-lg">
            <InjuredBear size={54} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 mt-2">
          即刻救熊：大眾運輸救援大作戰
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-0.5">
          真實健保署急診資料 × 全台大眾交通路網 · 實戰突發應急模擬
        </p>

        {/* Mode Selector Tabs */}
        <div className="w-full grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 my-3">
          <button
            onClick={() => setSelectedMode('RANDOM')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              selectedMode === 'RANDOM'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>模式一：🎲 隨機全台出發</span>
          </button>

          <button
            onClick={() => {
              setSelectedMode('CUSTOM');
              if (addressInput && !geocodedLocation) {
                performGeocode(addressInput);
              }
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              selectedMode === 'CUSTOM'
                ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>模式二：📍 自訂地點出發</span>
          </button>
        </div>

        {/* Mode 1: Random Mode Brief */}
        {selectedMode === 'RANDOM' && (
          <div className="w-full bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5 space-y-2.5 text-left text-xs text-slate-300 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>全台 8 大都會交通樞紐隨機降落</span>
            </div>
            <p className="leading-relaxed">
              系統將隨機將柴犬隊長空投在台北車站、西門町、市政府、板橋、大安森林公園、大坪林或士林等樞紐，並在雙北各區隨機散布 3 隻受傷小熊！
            </p>
          </div>
        )}

        {/* Mode 2: Custom Address Geocoding Input */}
        {selectedMode === 'CUSTOM' && (
          <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-3 text-left text-xs text-slate-300 animate-in fade-in duration-200">
            <div>
              <label className="block text-sky-300 font-bold mb-1.5">
                輸入台灣地址、路名或地標名稱（例如：天母美國學校、台北101、我家附近）：
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => {
                      setAddressInput(e.target.value);
                      setGeocodedLocation(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') performGeocode(addressInput);
                    }}
                    placeholder="例如：天母美國學校 / 台北市士林區中山北路六段..."
                    className="w-full bg-slate-900 border border-slate-700 focus:border-sky-400 text-slate-100 text-xs px-3 py-2.5 rounded-xl outline-none transition-colors"
                  />
                  {addressInput && (
                    <button
                      onClick={() => {
                        setAddressInput('');
                        setGeocodedLocation(null);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  onClick={() => performGeocode(addressInput)}
                  disabled={isSearching || !addressInput.trim()}
                  className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow transition-all active:scale-95 flex-shrink-0"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>查詢</span>
                </button>
              </div>
            </div>

            {/* Preset Quick Chips */}
            <div>
              <div className="text-[11px] text-slate-400 mb-1 font-semibold">⚡ 熱門地點快速點選：</div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setAddressInput(p.query);
                      performGeocode(p.query);
                    }}
                    className={`text-[10px] border px-2 py-1 rounded-lg transition-all ${
                      addressInput === p.query
                        ? 'bg-sky-600 text-white border-sky-400 font-bold'
                        : 'bg-slate-900/90 hover:bg-slate-700 border-slate-700 hover:border-sky-400 text-slate-300 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Geocoded Result Card */}
            {geocodedLocation && (
              <div className="bg-emerald-950/70 border-2 border-emerald-500/60 rounded-xl p-2.5 flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="font-black text-emerald-300 text-xs truncate">
                    已精確定位：{geocodedLocation.displayName}
                  </div>
                  <div className="text-[11px] text-slate-200 mt-0.5">
                    出發座標：<span className="font-mono text-emerald-400">{geocodedLocation.lat.toFixed(4)}, {geocodedLocation.lng.toFixed(4)}</span> | 最近站點：<span className="text-amber-300 font-bold">{geocodedLocation.matchedStationName}</span>
                  </div>
                </div>
              </div>
            )}

            {searchError && (
              <div className="text-rose-400 text-[11px] font-medium">
                ⚠️ {searchError}
              </div>
            )}
          </div>
        )}

        {/* Transit Speed Preview Bar */}
        <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-slate-300 my-3 bg-slate-900/60 py-2 px-3 rounded-xl border border-slate-800 w-full">
          <span className="flex items-center gap-1"><VehicleIcon mode="WALK" size={14} /> 步行 (慢)</span>
          <span className="flex items-center gap-1"><VehicleIcon mode="BIKE" size={14} /> YouBike (4x)</span>
          <span className="flex items-center gap-1"><VehicleIcon mode="BUS" size={14} /> 公車 (8x)</span>
          <span className="flex items-center gap-1"><VehicleIcon mode="METRO" size={14} /> 捷運 (13x)</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 mt-1">
          <button
            onClick={onOpenTutorial}
            className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold py-3 rounded-2xl text-xs shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>📖 真實應急教學</span>
          </button>

          <button
            onClick={handleStartGame}
            disabled={isSearching}
            className="w-full sm:w-1/2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black py-3 rounded-2xl text-xs shadow-xl transition-all duration-200 hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>定位中...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>
                  {selectedMode === 'CUSTOM' && geocodedLocation
                    ? `從 ${geocodedLocation.displayName.slice(0, 8)} 出發！`
                    : selectedMode === 'CUSTOM' && addressInput.trim()
                    ? `從 ${addressInput.slice(0, 8)} 出發！`
                    : '出發！開始救援'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
