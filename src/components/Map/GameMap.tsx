import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Player, Bear, Hospital, TransitNetwork, TransitMode } from '../../types';
import { MapTileLayer } from './TileLayers';

interface GameMapProps {
  player: Player;
  activeBears: Bear[];
  hospitals: Hospital[];
  transitNetwork: TransitNetwork | null;
  currentLayer: MapTileLayer;
  onSelectHospital: (hospital: Hospital) => void;
  onPickupBear: (bear: Bear) => void;
  onMoveToStation: (lat: number, lng: number, name: string, mode: TransitMode) => void;
}

// Map Auto-Follow Controller
const MapFollowController: React.FC<{ playerPos: [number, number] }> = ({ playerPos }) => {
  const map = useMap();
  useEffect(() => {
    map.panTo(playerPos, { animate: true, duration: 0.3 });
  }, [map, playerPos]);
  return null;
};

// 1. 🐶 Player Marker: 柴犬急救隊長 (Shiba Doctor)
function createPlayerIcon(mode: TransitMode, isOnTransit: boolean, isCarryingBear: boolean): L.DivIcon {
  const bgClass = !isOnTransit
    ? 'bg-amber-700 border-amber-300'
    : mode === 'METRO'
    ? 'bg-sky-600 border-sky-300'
    : mode === 'BUS'
    ? 'bg-emerald-600 border-emerald-300'
    : mode === 'BIKE'
    ? 'bg-orange-500 border-orange-300'
    : mode === 'THSR' || mode === 'TRA'
    ? 'bg-purple-600 border-purple-300'
    : 'bg-amber-600 border-amber-300';

  const modeIcon = !isOnTransit
    ? '🚶'
    : mode === 'METRO'
    ? '🚇'
    : mode === 'BUS'
    ? '🚌'
    : mode === 'BIKE'
    ? '🚲'
    : mode === 'THSR' || mode === 'TRA'
    ? '🚄'
    : '🚶';

  const statusLabel = isOnTransit
    ? `${modeIcon} 在運具上`
    : '🚶 步行中 (Z 上車)';

  const html = `
    <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
      <!-- Player Radar Pulse Ring (Faster when on transit) -->
      <div class="absolute ${isOnTransit ? 'w-16 h-16 bg-sky-400/40' : 'w-12 h-12 bg-amber-400/25'} rounded-full animate-ping pointer-events-none"></div>
      
      <!-- Player Avatar Core (🐶 柴犬隊長) -->
      <div class="relative w-12 h-12 rounded-2xl ${bgClass} border-2 border-white shadow-2xl flex items-center justify-center text-2xl transition-transform hover:scale-115">
        <span class="filter drop-shadow">🐶</span>
        
        <!-- Mode Badge -->
        <span class="absolute -bottom-1 -right-1 text-[11px] bg-slate-950 px-1 py-0.2 rounded-md shadow border border-slate-700 font-black">
          ${modeIcon}
        </span>

        <!-- Carrying Bear Indicator -->
        ${
          isCarryingBear
            ? '<span class="absolute -top-2 -right-2 bg-rose-500 border-2 border-white text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce font-bold">🐻</span>'
            : ''
        }
      </div>

      <!-- Player Nameplate with Transit Status -->
      <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/95 border ${isOnTransit ? 'border-sky-500 text-sky-300' : 'border-slate-700 text-amber-300'} px-2 py-0.2 rounded-full shadow text-[10px] font-black">
        柴犬隊長 · ${statusLabel}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-player-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
}

// 2. 🐻 Injured Bear Marker: 顯眼受傷小熊 (Very distinct from player)
function createBearIcon(bear: Bear): L.DivIcon {
  const hpRatio = bear.currentHealth / bear.maxHealth;
  const hpColor = hpRatio < 0.3 ? '#ef4444' : hpRatio < 0.6 ? '#f59e0b' : '#10b981';

  const html = `
    <div class="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
      <!-- Pulsing Distress Ring -->
      <div class="absolute w-16 h-16 rounded-full bg-rose-500/35 animate-ping pointer-events-none"></div>

      <!-- Floating SOS Balloon Tag -->
      <div class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-rose-600 to-amber-600 text-white border border-rose-300 px-2 py-0.5 rounded-full shadow-xl flex items-center gap-1 animate-bounce">
        <span class="text-[10px] font-black">🆘 救救小熊!</span>
        <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${hpColor}"></span>
        <span class="text-[9px] font-black">${Math.round(bear.currentHealth)}%</span>
      </div>
      
      <!-- Bear Face Core Marker -->
      <div class="relative w-12 h-12 rounded-2xl bg-amber-900 border-2 border-amber-300 shadow-2xl flex items-center justify-center text-2xl hover:scale-120 transition-transform">
        <span class="filter drop-shadow">🐻</span>
        <span class="absolute -bottom-1 -right-1 text-xs bg-slate-900/90 rounded-full px-0.5 shadow">${bear.avatar || '🩹'}</span>
      </div>

      <!-- Bear Name -->
      <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 border border-amber-500/50 px-2 py-0.2 rounded-md shadow text-[10px] font-bold text-amber-200">
        ${bear.name.split(' ')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bear-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
}

// 3. 🏥 Hospital Marker
function createHospitalIcon(hospital: Hospital): L.DivIcon {
  const isFull = hospital.inform === 'Y';
  const waitBed = hospital.waitBed ?? 0;
  const isGood = !isFull && waitBed <= 4;

  const bgClass = isFull
    ? 'bg-rose-600 border-rose-300'
    : isGood
    ? 'bg-emerald-600 border-emerald-300'
    : 'bg-amber-600 border-amber-300';

  const badgeText = isFull ? '滿床' : `待床${waitBed}`;

  const html = `
    <div class="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
      <!-- Glow Aura -->
      <div class="absolute w-12 h-12 rounded-full ${isFull ? 'bg-rose-500/30' : 'bg-emerald-500/20'} animate-pulse pointer-events-none"></div>
      
      <!-- Hospital Core Icon -->
      <div class="relative w-10 h-10 rounded-2xl ${bgClass} border-2 border-white shadow-2xl flex items-center justify-center text-lg hover:scale-115 transition-transform text-white font-bold">
        <span>🏥</span>
        
        <!-- Wait Bed Tag -->
        <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/95 border border-slate-700 px-1.5 py-0.2 rounded-md shadow text-[9px] font-black text-slate-100">
          ${badgeText}
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-hospital-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
}

// 4. Metro Station Icon
function createMetroStationIcon(color: string): L.DivIcon {
  const html = `
    <div class="w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-150 transition-transform -translate-x-1/2 -translate-y-1/2" style="background-color: ${color}"></div>
  `;
  return L.divIcon({
    html,
    className: 'custom-metro-node',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

// 5. YouBike Station Icon
function createYouBikeIcon(): L.DivIcon {
  const html = `
    <div class="w-5 h-5 rounded-full bg-amber-400 border border-slate-900 shadow-md flex items-center justify-center text-[10px] font-black text-slate-950 cursor-pointer hover:scale-150 transition-transform -translate-x-1/2 -translate-y-1/2">
      🚲
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-youbike-node',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

export const GameMap: React.FC<GameMapProps> = ({
  player,
  activeBears,
  hospitals,
  transitNetwork,
  currentLayer,
  onSelectHospital,
  onPickupBear,
  onMoveToStation
}) => {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[player.lat, player.lng]}
        zoom={14}
        minZoom={8}
        maxZoom={18}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        {/* Dynamic Tile Layer */}
        <TileLayer
          key={currentLayer.id}
          url={currentLayer.url}
          attribution={currentLayer.attribution}
          maxZoom={currentLayer.maxZoom || 19}
        />

        {/* Auto Follow Controller */}
        <MapFollowController playerPos={[player.lat, player.lng]} />

        {/* Transit Routes: Metro Lines */}
        {transitNetwork?.metro.map((line) => {
          const latLngs = line.stations.map((st) => [st.lat, st.lng] as [number, number]);
          return (
            <React.Fragment key={line.id}>
              <Polyline
                positions={latLngs}
                pathOptions={{
                  color: line.color,
                  weight: 5,
                  opacity: 0.85,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              {/* Station Markers */}
              {line.stations.map((st) => (
                <Marker
                  key={st.id}
                  position={[st.lat, st.lng]}
                  icon={createMetroStationIcon(line.color)}
                  eventHandlers={{
                    click: () => onMoveToStation(st.lat, st.lng, `${line.name} · ${st.name}站`, 'METRO')
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 text-xs text-slate-900 font-bold">
                      <div>🚇 {line.name} - {st.name}站</div>
                      <button
                        onClick={() => onMoveToStation(st.lat, st.lng, `${line.name} · ${st.name}站`, 'METRO')}
                        className="mt-1.5 w-full bg-sky-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-black hover:bg-sky-700 shadow-md"
                      >
                        搭捷運至此站
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}

        {/* Transit Routes: Bus Lines */}
        {transitNetwork?.bus.map((bus) => {
          const latLngs = bus.stops.map((st) => [st.lat, st.lng] as [number, number]);
          return (
            <React.Fragment key={bus.id}>
              <Polyline
                positions={latLngs}
                pathOptions={{
                  color: bus.color,
                  weight: 3.5,
                  opacity: 0.75,
                  dashArray: '6, 6'
                }}
              />
              {bus.stops.map((st) => (
                <Marker
                  key={st.id}
                  position={[st.lat, st.lng]}
                  icon={L.divIcon({
                    html: `<div class="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white shadow hover:scale-150 transition-transform -translate-x-1/2 -translate-y-1/2"></div>`,
                    className: 'custom-bus-node',
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                  })}
                  eventHandlers={{
                    click: () => onMoveToStation(st.lat, st.lng, `${bus.name.split(' ')[0]} · ${st.name}`, 'BUS')
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 text-xs text-slate-900 font-bold">
                      <div>🚌 {bus.name}</div>
                      <div className="text-slate-600 font-medium">{st.name}</div>
                      <button
                        onClick={() => onMoveToStation(st.lat, st.lng, `${bus.name.split(' ')[0]} · ${st.name}`, 'BUS')}
                        className="mt-1.5 w-full bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-black hover:bg-emerald-700 shadow-md"
                      >
                        搭乘此公車站
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}

        {/* YouBike Stations */}
        {transitNetwork?.youbike.map((ub) => (
          <Marker
            key={ub.id}
            position={[ub.lat, ub.lng]}
            icon={createYouBikeIcon()}
            eventHandlers={{
              click: () => onMoveToStation(ub.lat, ub.lng, ub.name, 'BIKE')
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 text-xs text-slate-900 font-bold">
                <div>🚲 {ub.name}</div>
                <div className="text-slate-600 font-normal text-[11px]">可借單車: {ub.bikes} 輛</div>
                <button
                  onClick={() => onMoveToStation(ub.lat, ub.lng, ub.name, 'BIKE')}
                  className="mt-1.5 w-full bg-amber-500 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-black hover:bg-amber-600 shadow-md"
                >
                  騎 YouBike 至此站
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Player Path Trail */}
        {player.isMoving && player.targetCoord && (
          <Polyline
            positions={[
              [player.lat, player.lng],
              player.targetCoord
            ]}
            pathOptions={{
              color: '#38bdf8',
              weight: 4,
              opacity: 0.85,
              dashArray: '4, 8'
            }}
          />
        )}

        {/* Hospitals */}
        {hospitals.map((hosp) => (
          <Marker
            key={hosp.id}
            position={[hosp.lat, hosp.lng]}
            icon={createHospitalIcon(hosp)}
            eventHandlers={{
              click: () => onSelectHospital(hosp)
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1.5 text-xs text-slate-900 min-w-[160px]">
                <div className="font-black text-sm text-slate-900">🏥 {hosp.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{hosp.tier}</div>
                
                <div className="mt-2 p-1.5 bg-slate-100 rounded-lg text-[11px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>等待看診:</span>
                    <span className="font-bold">{hosp.waitSee ?? 0} 人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>急診待床:</span>
                    <span className={`font-bold ${(hosp.waitBed ?? 0) > 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {hosp.waitBed ?? 0} 人
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>滿床通報:</span>
                    <span className={`font-black ${hosp.inform === 'Y' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {hosp.inform === 'Y' ? '🔴 滿床' : '🟢 正常'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectHospital(hosp)}
                  className="mt-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 rounded-lg text-xs"
                >
                  查看急診詳情與導航
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Active Bears */}
        {activeBears.map((bear) => (
          <Marker
            key={bear.id}
            position={[bear.lat, bear.lng]}
            icon={createBearIcon(bear)}
            eventHandlers={{
              click: () => onPickupBear(bear)
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1.5 text-xs text-slate-900 min-w-[160px]">
                <div className="font-black text-sm text-amber-900 flex items-center gap-1">
                  <span>🐻 {bear.name}</span>
                </div>
                <div className="text-rose-600 font-bold text-xs mt-0.5">
                  生命耐受度: {Math.round(bear.currentHealth)}%
                </div>
                <p className="text-slate-600 text-[11px] mt-1">{bear.story}</p>
                <button
                  onClick={() => onPickupBear(bear)}
                  className="mt-2 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black py-1.5 rounded-lg text-xs shadow"
                >
                  抱起小熊開始送醫
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Player Marker: 🐶 柴犬隊長 */}
        <Marker
          position={[player.lat, player.lng]}
          icon={createPlayerIcon(player.currentMode, player.isOnTransit, Boolean(player.carryingBear))}
          zIndexOffset={1000}
        />
      </MapContainer>
    </div>
  );
};
