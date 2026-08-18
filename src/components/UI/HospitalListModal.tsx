import React, { useState, useMemo } from 'react';
import { X, Search, Navigation, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import { Hospital, Player } from '../../types';
import { calculateDistanceKm, formatDistance } from '../../utils/geo';

interface HospitalListModalProps {
  hospitals: Hospital[];
  player: Player;
  onClose: () => void;
  onNavigateToHospital: (hospital: Hospital) => void;
}

export const HospitalListModal: React.FC<HospitalListModalProps> = ({
  hospitals,
  player,
  onClose,
  onNavigateToHospital
}) => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  const cities = ['ALL', '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市', '宜蘭縣', '花蓮縣'];

  const filteredHospitals = useMemo(() => {
    return hospitals
      .map((h) => ({
        ...h,
        distKm: calculateDistanceKm(player.lat, player.lng, h.lat, h.lng)
      }))
      .filter((h) => {
        const matchesCity = selectedCity === 'ALL' || h.city === selectedCity;
        const matchesSearch =
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.district.toLowerCase().includes(search.toLowerCase()) ||
          h.tier.toLowerCase().includes(search.toLowerCase());
        return matchesCity && matchesSearch;
      })
      .sort((a, b) => a.distKm - b.distKm);
  }, [hospitals, player, search, selectedCity]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-2xl">
              🏥
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                全國重度級急救責任醫院 · 即時急診監測
              </h2>
              <p className="text-xs text-slate-400">
                依據衛福部健保署公開急診 API 即時連線更新 · 請優先送往待床少、未滿床之醫院
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

        {/* Filter Toolbar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          {/* City Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedCity === c
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c === 'ALL' ? '全部縣市' : c}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜尋醫院名稱、行政區..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Hospital Card List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHospitals.map((hosp) => {
            const isFull = hosp.inform === 'Y';
            const isCrowded = (hosp.waitBed ?? 0) > 10;
            const isGood = !isFull && (hosp.waitBed ?? 0) <= 4;

            return (
              <div
                key={hosp.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isFull
                    ? 'bg-rose-950/20 border-rose-600/40'
                    : isGood
                    ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div>
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                        <span>{hosp.name}</span>
                      </h3>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{hosp.city} {hosp.district}</span>
                        <span>·</span>
                        <span className="text-amber-400 font-semibold">{hosp.tier.split(' ')[0]}</span>
                      </div>
                    </div>

                    {isFull ? (
                      <span className="flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/50 px-2.5 py-1 rounded-xl text-[11px] font-black">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        滿床警報
                      </span>
                    ) : isGood ? (
                      <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-2.5 py-1 rounded-xl text-[11px] font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        急診順暢
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-xl text-[11px] font-black">
                        普通忙碌
                      </span>
                    )}
                  </div>

                  {/* Real-time Metrics Grid */}
                  <div className="grid grid-cols-4 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center my-2.5">
                    <div>
                      <div className="text-[10px] text-slate-400">等看診</div>
                      <div className="font-black text-sm text-slate-100">{hosp.waitSee ?? 0} 人</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">急診待床</div>
                      <div className={`font-black text-sm ${isCrowded ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {hosp.waitBed ?? 0} 人
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">待住院</div>
                      <div className="font-black text-sm text-slate-100">{hosp.waitGeneral ?? 0} 人</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">待ICU</div>
                      <div className="font-black text-sm text-slate-100">{hosp.waitIcu ?? 0} 人</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{hosp.nearMetro || hosp.address}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-xs text-sky-300 font-bold">
                    距離: {formatDistance(hosp.distKm)}
                  </div>
                  <button
                    onClick={() => {
                      onNavigateToHospital(hosp);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-black px-3.5 py-1.5 rounded-xl text-xs shadow-md transition-transform active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>搭車前往此院</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
