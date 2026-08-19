import { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { GameMap } from './components/Map/GameMap';
import { MAP_LAYERS, MapTileLayer } from './components/Map/TileLayers';
import { Header } from './components/UI/Header';
import { RescueHUD } from './components/UI/RescueHUD';
import { HospitalListModal } from './components/UI/HospitalListModal';
import { SettlementModal } from './components/UI/SettlementModal';
import { BearDexModal } from './components/UI/BearDexModal';
import { GameIntroModal } from './components/UI/GameIntroModal';
import { EmergencyTutorialModal } from './components/UI/EmergencyTutorialModal';
import { DirectionPad } from './components/UI/DirectionPad';
import { ToastNotification } from './components/UI/ToastNotification';
import { Hospital, TransitMode } from './types';
import { sound } from './utils/audio';

export function App() {
  const {
    gameState,
    setGameState,
    hospitals,
    transitNetwork,
    activeBears,
    player,
    stats,
    lastSettlement,
    rescueHistory,
    lastUpdatedTime,
    setSelectedHospital,
    toasts,
    dismissToast,
    startGame,
    spawnBatchBears,
    moveToLocation,
    moveByDirection,
    toggleBoardTransit,
    handleQuickAction,
    pickupBear,
    deliverBearToHospital
  } = useGameEngine();

  const [currentLayer, setCurrentLayer] = useState<MapTileLayer>(MAP_LAYERS[0]);
  const [showHospitalList, setShowHospitalList] = useState(false);
  const [showDex, setShowDex] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  // Fix #1: isSoundEnabled 現在作為 sound.enabled 的鏡像，確保兩者同步
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const handleToggleSound = () => {
    const next = !sound.enabled;
    sound.enabled = next; // 同步更新底層 SoundManager
    setIsSoundEnabled(next);
  };

  // Navigate to Hospital
  const handleNavigateToHospital = (hospital: Hospital) => {
    const mode: TransitMode = hospital.tier.includes('醫學中心') ? 'METRO' : 'BUS';
    moveToLocation(hospital.lat, hospital.lng, `${hospital.name} 急診處`, mode);
  };

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-slate-950">
      {/* In-Game Toast Notifications（取代阻塞式 alert）*/}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Top HUD Header */}
      <Header
        stats={stats}
        currentLayer={currentLayer}
        onSelectLayer={setCurrentLayer}
        onOpenDex={() => setShowDex(true)}
        onOpenHospitalList={() => setShowHospitalList(true)}
        onOpenTutorial={() => setShowTutorial(true)}
        onSpawnBears={() => spawnBatchBears(3)}
        activeBearCount={activeBears.length}
        lastUpdated={lastUpdatedTime}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Interactive Map */}
      <GameMap
        player={player}
        activeBears={activeBears}
        hospitals={hospitals}
        transitNetwork={transitNetwork}
        currentLayer={currentLayer}
        onSelectHospital={(h) => {
          setSelectedHospital(h);
          setShowHospitalList(true);
        }}
        onPickupBear={pickupBear}
        onMoveToStation={(lat, lng, name, mode) => moveToLocation(lat, lng, name, mode)}
      />

      {/* On-Screen Direction Pad for Mobile & Casual Clicks */}
      {gameState === 'PLAYING' && (
        <DirectionPad
          onDirectionMove={moveByDirection}
          onQuickAction={handleQuickAction}
          onToggleBoard={toggleBoardTransit}
          isOnTransit={player.isOnTransit}
          currentMode={player.currentMode}
          disabled={player.isMoving}
        />
      )}

      {/* Bottom Rescue Command Bar */}
      <RescueHUD
        player={player}
        activeBears={activeBears}
        hospitals={hospitals}
        transitNetwork={transitNetwork}
        onMove={(lat, lng, name, mode) => moveToLocation(lat, lng, name, mode)}
        onToggleBoard={toggleBoardTransit}
        onPickupBear={pickupBear}
        onDeliverBear={deliverBearToHospital}
      />

      {/* Intro Modal */}
      {gameState === 'INTRO' && (
        <GameIntroModal
          onStart={startGame}
          onOpenTutorial={() => setShowTutorial(true)}
          transitNetwork={transitNetwork}
        />
      )}

      {/* Settlement Modal (Rescue Completed) */}
      {gameState === 'SETTLEMENT' && (
        <SettlementModal
          settlement={lastSettlement}
          onContinue={() => setGameState('PLAYING')}
        />
      )}

      {/* Hospital List / ER Realtime Monitor Modal */}
      {showHospitalList && (
        <HospitalListModal
          hospitals={hospitals}
          player={player}
          onClose={() => {
            setShowHospitalList(false);
            setSelectedHospital(null);
          }}
          onNavigateToHospital={handleNavigateToHospital}
        />
      )}

      {/* Bear Encyclopedia Modal */}
      {showDex && (
        <BearDexModal
          rescueHistory={rescueHistory}
          onClose={() => setShowDex(false)}
        />
      )}

      {/* Comprehensive Emergency Tutorial & Real Life Simulation Modal */}
      {showTutorial && (
        <EmergencyTutorialModal onClose={() => setShowTutorial(false)} />
      )}
    </main>
  );
}

export default App;
