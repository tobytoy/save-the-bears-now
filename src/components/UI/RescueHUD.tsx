import React, { useMemo } from 'react';
import { Navigation, Heart, Zap } from 'lucide-react';
import { Player, Bear, Hospital, TransitNetwork, TransitMode } from '../../types';
import { calculateDistanceKm, formatDistance, estimateTravelTimeSec } from '../../utils/geo';
import { VehicleIcon } from '../Assets/VehicleIcons';
import { BearIllustration } from '../Assets/BearIllustrations';

interface RescueHUDProps {
  player: Player;
  activeBears: Bear[];
  hospitals: Hospital[];
  transitNetwork: TransitNetwork | null;
  onMove: (lat: number, lng: number, stationName: string, mode: TransitMode) => void;
  onPickupBear: (bear: Bear) => void;
  onDeliverBear: (hospital: Hospital) => void;
}

export const RescueHUD: React.FC<RescueHUDProps> = ({
  player,
  activeBears,
  hospitals,
  transitNetwork,
  onMove,
  onPickupBear,
  onDeliverBear
}) => {
  // Check if player is near any unrescued bear (< 0.8 km)
  const nearbyBear = useMemo(() => {
    if (player.carryingBear) return null;
    return (
      activeBears.find(
        (b) => calculateDistanceKm(player.lat, player.lng, b.lat, b.lng) <= 0.8
      ) || null
    );
  }, [player, activeBears]);

  // Check if player carrying bear is near any hospital (< 0.8 km)
  const nearbyHospital = useMemo(() => {
    if (!player.carryingBear) return null;
    return (
      hospitals.find(
        (h) => calculateDistanceKm(player.lat, player.lng, h.lat, h.lng) <= 0.8
      ) || null
    );
  }, [player, hospitals]);

  // Find nearest transit options around player
  const transitOptions = useMemo(() => {
    if (!transitNetwork) return [];
    const options: {
      id: string;
      name: string;
      mode: TransitMode;
      lat: number;
      lng: number;
      distKm: number;
      timeSec: number;
      badge?: string;
    }[] = [];

    // 1. YouBike Stations
    transitNetwork.youbike.forEach((ub) => {
      const dist = calculateDistanceKm(player.lat, player.lng, ub.lat, ub.lng);
      if (dist > 0.05 && dist < 3.5) {
        options.push({
          id: ub.id,
          name: ub.name,
          mode: 'BIKE',
          lat: ub.lat,
          lng: ub.lng,
          distKm: dist,
          timeSec: estimateTravelTimeSec(dist, 18),
          badge: `${ub.bikes} 輛`
        });
      }
    });

    // 2. Metro Stations
    transitNetwork.metro.forEach((line) => {
      line.stations.forEach((st) => {
        const dist = calculateDistanceKm(player.lat, player.lng, st.lat, st.lng);
        if (dist > 0.05 && dist < 12.0) {
          options.push({
            id: `${line.id}_${st.id}`,
            name: `${line.name} · ${st.name}站`,
            mode: 'METRO',
            lat: st.lat,
            lng: st.lng,
            distKm: dist,
            timeSec: estimateTravelTimeSec(dist, 55),
            badge: line.id
          });
        }
      });
    });

    // 3. Bus Routes
    transitNetwork.bus.forEach((bus) => {
      bus.stops.forEach((st) => {
        const dist = calculateDistanceKm(player.lat, player.lng, st.lat, st.lng);
        if (dist > 0.05 && dist < 6.0) {
          options.push({
            id: `${bus.id}_${st.id}`,
            name: `${bus.name.split(' ')[0]} · ${st.name}`,
            mode: 'BUS',
            lat: st.lat,
            lng: st.lng,
            distKm: dist,
            timeSec: estimateTravelTimeSec(dist, 30)
          });
        }
      });
    });

    // 4. Rail & THSR
    transitNetwork.rail.forEach((rail) => {
      const dist = calculateDistanceKm(player.lat, player.lng, rail.lat, rail.lng);
      if (dist > 0.1 && dist < 50.0) {
        options.push({
          id: rail.id,
          name: rail.name,
          mode: rail.type === 'THSR' ? 'THSR' : 'TRA',
          lat: rail.lat,
          lng: rail.lng,
          distKm: dist,
          timeSec: estimateTravelTimeSec(dist, rail.type === 'THSR' ? 220 : 100),
          badge: rail.type
        });
      }
    });

    // Sort by distance and limit to closest 8 options
    return options.sort((a, b) => a.distKm - b.distKm).slice(0, 8);
  }, [player, transitNetwork]);

  return (
    <div className="absolute bottom-4 left-3 right-3 z-[1000] flex flex-col items-center gap-2 pointer-events-none">
      {/* Dynamic Interaction Card (Rescue or Deliver Alert) */}
      {nearbyBear && (
        <div className="pointer-events-auto w-full max-w-md bg-gradient-to-r from-amber-900/95 to-orange-950/95 border-2 border-amber-400 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl animate-bounce-subtle flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BearIllustration type={nearbyBear.type} size={48} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-amber-200">{nearbyBear.name}</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full font-bold">
                  需急救
                </span>
              </div>
              <p className="text-xs text-amber-100/90 font-medium line-clamp-1">{nearbyBear.story}</p>
            </div>
          </div>
          <button
            onClick={() => onPickupBear(nearbyBear)}
            disabled={player.isMoving}
            className="flex-shrink-0 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 fill-slate-950" />
            <span>抱起救援</span>
          </button>
        </div>
      )}

      {nearbyHospital && (
        <div className="pointer-events-auto w-full max-w-md bg-gradient-to-r from-emerald-950/95 to-teal-950/95 border-2 border-emerald-400 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl animate-pulse-slow flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
              🏥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-emerald-200">{nearbyHospital.name}</span>
                {nearbyHospital.inform === 'Y' ? (
                  <span className="text-[10px] bg-rose-500/40 text-rose-200 px-2 py-0.5 rounded-full font-bold">
                    滿床警報
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    床位充足
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100/80 font-medium">
                急診待床: {nearbyHospital.waitBed ?? 0} 人 | 等待看診: {nearbyHospital.waitSee ?? 0} 人
              </p>
            </div>
          </div>
          <button
            onClick={() => onDeliverBear(nearbyHospital)}
            disabled={player.isMoving}
            className="flex-shrink-0 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>送入急診</span>
          </button>
        </div>
      )}

      {/* Main Control Console */}
      <div className="pointer-events-auto w-full max-w-4xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl p-3.5 shadow-2xl text-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Player Status & Carried Bear */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center shadow-inner">
              <VehicleIcon mode={player.currentMode} size={28} />
            </div>
            {player.carryingBear && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white truncate">
                {player.currentStationName || '城市街道'}
              </span>
              {player.isMoving && (
                <span className="text-[10px] text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  移動中...
                </span>
              )}
            </div>

            {/* Carrying Bear Health Bar */}
            {player.carryingBear ? (
              <div className="mt-1 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-amber-300 flex items-center gap-1">
                    <span>護送中:</span> {player.carryingBear.name}
                  </span>
                  <span className={player.carryingBear.currentHealth < 30 ? 'text-rose-400 font-black animate-pulse' : 'text-emerald-400'}>
                    HP: {Math.round(player.carryingBear.currentHealth)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      player.carryingBear.currentHealth < 30
                        ? 'bg-rose-500'
                        : player.carryingBear.currentHealth < 60
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${player.carryingBear.currentHealth}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium">
                {activeBears.length > 0
                  ? `地圖上有 ${activeBears.length} 隻熊熊等待救援！請搭車前往`
                  : '搜救雷達掃描中...'}
              </p>
            )}
          </div>
        </div>

        {/* Right: Nearby Transit Boarding Selector */}
        <div className="flex-1 min-w-0 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-3">
          <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              鄰近大眾交通站點 (點擊搭乘移動)
            </span>
            <span className="text-[10px] text-slate-500">限乘大眾運輸/YouBike</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {transitOptions.length === 0 ? (
              <div className="text-xs text-slate-500 py-1">正在搜尋周邊站點...</div>
            ) : (
              transitOptions.map((opt) => (
                <button
                  key={opt.id}
                  disabled={player.isMoving}
                  onClick={() => onMove(opt.lat, opt.lng, opt.name, opt.mode)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                    player.isMoving
                      ? 'opacity-50 cursor-not-allowed bg-slate-800/40 border-slate-700 text-slate-400'
                      : 'bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 text-slate-200 border-slate-600/80 hover:border-sky-400 shadow-md'
                  }`}
                >
                  <VehicleIcon mode={opt.mode} size={18} />
                  <div className="text-left">
                    <div className="font-bold text-slate-100 max-w-[120px] truncate">{opt.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span>{formatDistance(opt.distKm)}</span>
                      <span>·</span>
                      <span className="text-sky-300">約 {Math.max(1, Math.round(opt.timeSec / 60))} 分</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
