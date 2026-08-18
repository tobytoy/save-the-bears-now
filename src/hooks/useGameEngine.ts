import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Bear,
  Player,
  Hospital,
  TransitNetwork,
  TransitMode,
  GameStats,
  GameState,
  RescueHistory,
  BearInjuryType
} from '../types';
import { calculateDistanceKm, generatePathWaypoints } from '../utils/geo';
import { sound } from '../utils/audio';
import { fetchLiveEmergencyData } from '../services/emergencyService';

const BEAR_STORIES: { type: BearInjuryType; name: string; story: string; avatar: string }[] = [
  {
    type: 'FRACTURE',
    name: '蹦蹦波波 (Bobo)',
    story: '在公園追蝴蝶時不小心摔跤扭傷後腿，需要送往急診照 X 光！',
    avatar: '🩹'
  },
  {
    type: 'HEATSTROKE',
    name: '雪泥可可 (Coco)',
    story: '夏季大太陽下穿著厚毛皮在柏油路散步，體溫過高頭暈目眩，急需降溫輸液！',
    avatar: '🧊'
  },
  {
    type: 'FLU',
    name: '哈啾皮皮 (Pipi)',
    story: '吹冷氣吹到感冒發燒流鼻水，全身無力需要兒醫或急診退燒！',
    avatar: '🤧'
  },
  {
    type: 'HUNGRY',
    name: '圓滾冬冬 (Dongdong)',
    story: '出門迷路找不到蜂蜜，餓到低血糖腳軟，急需營養點滴！',
    avatar: '🍔'
  },
  {
    type: 'EXHAUSTED',
    name: '趴趴奇奇 (Qiqi)',
    story: '爬象山樓梯爬到虛脫休克，需要救護隊火速送醫補充體力！',
    avatar: '🩹'
  }
];

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>('INTRO');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [transitNetwork, setTransitNetwork] = useState<TransitNetwork | null>(null);
  const [activeBears, setActiveBears] = useState<Bear[]>([]);
  const [player, setPlayer] = useState<Player>({
    lat: 25.0463, // 台北車站
    lng: 121.5175,
    currentStationName: '台北車站',
    currentMode: 'METRO',
    isMoving: false,
    carryingBear: null,
    targetCoord: null,
    path: [],
    currentPathIndex: 0
  });

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    bearsSaved: 0,
    bearsLost: 0,
    carbonSavedKg: 0,
    totalDistanceKm: 0,
    gameTimeSec: 0
  });

  const [lastSettlement, setLastSettlement] = useState<RescueHistory | null>(null);
  const [rescueHistory, setRescueHistory] = useState<RescueHistory[]>([]);
  const [usedModesInCurrentMission, setUsedModesInCurrentMission] = useState<TransitMode[]>([]);
  const [missionStartTime, setMissionStartTime] = useState<number>(0);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const moveTimerRef = useRef<number | null>(null);

  // 1. Initial Load of Datasets
  useEffect(() => {
    async function loadData() {
      try {
        const [hospRes, transitRes] = await Promise.all([
          fetch('./data/hospitals.json'),
          fetch('./data/transit_network.json')
        ]);
        const hospJson: Hospital[] = await hospRes.json();
        const transitJson: TransitNetwork = await transitRes.json();

        setTransitNetwork(transitJson);

        // Fetch live NHI emergency status
        const enrichedHospitals = await fetchLiveEmergencyData(hospJson);
        setHospitals(enrichedHospitals);
        setLastUpdatedTime(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Failed to load initial game data:', err);
      }
    }
    loadData();
  }, []);

  // Periodic Refresh for Hospital Data (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (hospitals.length > 0) {
        const refreshed = await fetchLiveEmergencyData(hospitals);
        setHospitals(refreshed);
        setLastUpdatedTime(new Date().toLocaleTimeString());
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [hospitals]);

  // 2. Spawn Bear Helper
  const spawnBear = useCallback(
    (customCoord?: [number, number]) => {
      let lat = 25.042;
      let lng = 121.52;
      let locName = '市區某處';

      if (customCoord) {
        lat = customCoord[0];
        lng = customCoord[1];
      } else if (transitNetwork && transitNetwork.youbike.length > 0) {
        // Pick near a random youbike or metro station
        const randStation =
          transitNetwork.youbike[Math.floor(Math.random() * transitNetwork.youbike.length)];
        const offsetLat = (Math.random() - 0.5) * 0.008;
        const offsetLng = (Math.random() - 0.5) * 0.008;
        lat = randStation.lat + offsetLat;
        lng = randStation.lng + offsetLng;
        locName = randStation.name.replace('YouBike ', '') + ' 附近巷弄';
      }

      const template = BEAR_STORIES[Math.floor(Math.random() * BEAR_STORIES.length)];
      const newBear: Bear = {
        id: 'bear_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        name: template.name,
        type: template.type,
        story: template.story,
        lat,
        lng,
        locationName: locName,
        maxHealth: 100,
        currentHealth: 100,
        urgency: template.type === 'HEATSTROKE' ? 'HIGH' : 'MEDIUM',
        decayRate: template.type === 'HEATSTROKE' ? 1.2 : 0.8,
        rewardScore: 1000,
        isRescued: false,
        spawnTime: Date.now(),
        avatar: template.avatar
      };

      setActiveBears((prev) => [...prev, newBear]);
    },
    [transitNetwork]
  );

  // 3. Start Game
  const startGame = useCallback(() => {
    setGameState('PLAYING');
    setStats({
      score: 0,
      bearsSaved: 0,
      bearsLost: 0,
      carbonSavedKg: 0,
      totalDistanceKm: 0,
      gameTimeSec: 0
    });
    // Spawn 2 initial bears
    setActiveBears([]);
    setTimeout(() => {
      spawnBear([25.037, 121.535]); // Near Daan Forest Park
      spawnBear([25.042, 121.508]); // Near Ximen
    }, 500);
  }, [spawnBear]);

  // 4. Main Game Loop (Health decay, game clock)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setStats((prev) => ({ ...prev, gameTimeSec: prev.gameTimeSec + 1 }));

      // Decay health of active unrescued or carried bears
      setActiveBears((prevBears) =>
        prevBears
          .map((b) => {
            const newHealth = Math.max(0, b.currentHealth - b.decayRate);
            return { ...b, currentHealth: newHealth };
          })
          .filter((b) => {
            if (b.currentHealth <= 0 && !b.isRescued) {
              // Bear expired
              setStats((s) => ({ ...s, bearsLost: s.bearsLost + 1 }));
              sound.playWarning();
              return false;
            }
            return true;
          })
      );

      // If player is carrying bear, update carried bear health
      setPlayer((p) => {
        if (p.carryingBear) {
          const updatedHealth = Math.max(0, p.carryingBear.currentHealth - p.carryingBear.decayRate);
          if (updatedHealth <= 0) {
            sound.playWarning();
            setStats((s) => ({ ...s, bearsLost: s.bearsLost + 1 }));
            return { ...p, carryingBear: null };
          }
          return {
            ...p,
            carryingBear: { ...p.carryingBear, currentHealth: updatedHealth }
          };
        }
        return p;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Auto-spawn bear if count is low
  useEffect(() => {
    if (gameState === 'PLAYING' && activeBears.length === 0 && !player.carryingBear) {
      spawnBear();
    }
  }, [gameState, activeBears.length, player.carryingBear, spawnBear]);

  // 5. Player Movement Physics (Smooth Transit Interpolation)
  const moveToLocation = useCallback(
    (targetLat: number, targetLng: number, stationName: string, mode: TransitMode) => {
      if (player.isMoving) return;

      const distKm = calculateDistanceKm(player.lat, player.lng, targetLat, targetLng);
      if (distKm < 0.0005) return;

      const speedKmH = transitNetwork?.speeds[mode] || 30;
      const steps = Math.max(12, Math.min(50, Math.round(distKm * 20)));
      const pathWaypoints = generatePathWaypoints([player.lat, player.lng], [targetLat, targetLng], steps);

      sound.playTransit(mode);

      // Record transit mode used
      setUsedModesInCurrentMission((prev) => (prev.includes(mode) ? prev : [...prev, mode]));

      // Calculate Carbon Saved (0.17 kg CO2 / km vs private gas car)
      const carbon = distKm * 0.17;
      setStats((s) => ({
        ...s,
        totalDistanceKm: Number((s.totalDistanceKm + distKm).toFixed(2)),
        carbonSavedKg: Number((s.carbonSavedKg + carbon).toFixed(2))
      }));

      setPlayer((p) => ({
        ...p,
        isMoving: true,
        currentMode: mode,
        targetCoord: [targetLat, targetLng],
        path: pathWaypoints,
        currentPathIndex: 0
      }));

      const stepInterval = Math.max(15, Math.min(50, Math.round(1200 / speedKmH)));

      let currentIndex = 0;
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);

      moveTimerRef.current = window.setInterval(() => {
        currentIndex++;
        if (currentIndex >= pathWaypoints.length) {
          if (moveTimerRef.current) clearInterval(moveTimerRef.current);
          setPlayer((p) => ({
            ...p,
            lat: targetLat,
            lng: targetLng,
            currentStationName: stationName,
            isMoving: false,
            targetCoord: null,
            path: [],
            currentPathIndex: 0
          }));
        } else {
          const pt = pathWaypoints[currentIndex];
          setPlayer((p) => ({
            ...p,
            lat: pt[0],
            lng: pt[1],
            currentPathIndex: currentIndex
          }));
        }
      }, stepInterval);
    },
    [player, transitNetwork]
  );

  // 6. Action: Directional Step (WASD / Arrow Keys / D-Pad)
  const moveByDirection = useCallback(
    (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (player.isMoving) return;

      const delta = player.currentMode === 'BIKE' ? 0.003 : player.currentMode === 'METRO' ? 0.005 : 0.0015;
      let targetLat = player.lat;
      let targetLng = player.lng;

      if (dir === 'UP') targetLat += delta;
      if (dir === 'DOWN') targetLat -= delta;
      if (dir === 'RIGHT') targetLng += delta;
      if (dir === 'LEFT') targetLng -= delta;

      moveToLocation(targetLat, targetLng, '市區街區移動', player.currentMode);
    },
    [player, moveToLocation]
  );

  // 7. Action: Pickup Bear
  const pickupBear = useCallback(
    (bear: Bear) => {
      if (player.carryingBear || player.isMoving) return;
      const dist = calculateDistanceKm(player.lat, player.lng, bear.lat, bear.lng);
      if (dist > 0.8) {
        alert('距離小熊太遠了！請先搭乘大眾運輸工具接近小熊所在位置。');
        return;
      }

      sound.playPickup();
      setPlayer((p) => ({ ...p, carryingBear: bear }));
      setActiveBears((prev) => prev.filter((b) => b.id !== bear.id));
      setMissionStartTime(Date.now());
      setUsedModesInCurrentMission([]);
    },
    [player]
  );

  // 8. Action: Deliver Bear to Hospital ER
  const deliverBearToHospital = useCallback(
    (hospital: Hospital) => {
      if (!player.carryingBear || player.isMoving) return;

      const dist = calculateDistanceKm(player.lat, player.lng, hospital.lat, hospital.lng);
      if (dist > 0.8) {
        alert(`距離 ${hospital.shortName} 太遠！請先搭乘捷運或公車抵達醫院附近。`);
        return;
      }

      const bear = player.carryingBear;
      const timeSpent = Math.round((Date.now() - missionStartTime) / 1000);
      const remainingHpRatio = bear.currentHealth / bear.maxHealth;

      // Hospital Congestion Rating Logic
      const isOvercrowded = hospital.inform === 'Y' || (hospital.waitBed && hospital.waitBed > 15);
      const isOptimal = (hospital.waitBed || 0) < 5 && hospital.inform === 'N';

      let scoreGain = bear.rewardScore;
      let stars = 2;

      if (isOptimal) {
        scoreGain += 500;
        stars = remainingHpRatio > 0.5 ? 3 : 2;
        sound.playSuccess();
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else if (isOvercrowded) {
        scoreGain = Math.max(200, scoreGain - 400);
        stars = 1;
        sound.playWarning();
      } else {
        stars = remainingHpRatio > 0.6 ? 3 : 2;
        sound.playSuccess();
      }

      const historyRecord: RescueHistory = {
        id: 'rescue_' + Date.now(),
        bearName: bear.name,
        bearType: bear.type,
        hospitalName: hospital.name,
        timeSpentSec: timeSpent,
        healthRemaining: Math.round(bear.currentHealth),
        transitModesUsed: usedModesInCurrentMission.length > 0 ? usedModesInCurrentMission : ['WALK'],
        carbonSavedKg: Number(((timeSpent * 0.05) + 0.3).toFixed(2)),
        rating: stars,
        timestamp: new Date().toLocaleTimeString()
      };

      setStats((s) => ({
        ...s,
        score: s.score + scoreGain,
        bearsSaved: s.bearsSaved + 1
      }));

      setLastSettlement(historyRecord);
      setRescueHistory((prev) => [historyRecord, ...prev]);
      setPlayer((p) => ({ ...p, carryingBear: null }));
      setGameState('SETTLEMENT');

      setTimeout(() => {
        spawnBear();
      }, 1000);
    },
    [player, missionStartTime, usedModesInCurrentMission, spawnBear]
  );

  // 9. Quick Action for Spacebar / Enter
  const handleQuickAction = useCallback(() => {
    if (player.carryingBear) {
      // Find closest hospital within 0.8km
      const nearHosp = hospitals.find(
        (h) => calculateDistanceKm(player.lat, player.lng, h.lat, h.lng) <= 0.8
      );
      if (nearHosp) {
        deliverBearToHospital(nearHosp);
      }
    } else {
      // Find closest bear within 0.8km
      const nearBear = activeBears.find(
        (b) => calculateDistanceKm(player.lat, player.lng, b.lat, b.lng) <= 0.8
      );
      if (nearBear) {
        pickupBear(nearBear);
      }
    }
  }, [player, hospitals, activeBears, deliverBearToHospital, pickupBear]);

  // 10. Global Keyboard Controller
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys or space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveByDirection('UP');
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveByDirection('DOWN');
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveByDirection('LEFT');
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveByDirection('RIGHT');
          break;
        case 'Space':
        case 'Enter':
          handleQuickAction();
          break;
        case 'Digit1':
          setPlayer((p) => ({ ...p, currentMode: 'WALK' }));
          break;
        case 'Digit2':
          setPlayer((p) => ({ ...p, currentMode: 'BIKE' }));
          break;
        case 'Digit3':
          setPlayer((p) => ({ ...p, currentMode: 'METRO' }));
          break;
        case 'Digit4':
          setPlayer((p) => ({ ...p, currentMode: 'BUS' }));
          break;
        case 'Digit5':
          setPlayer((p) => ({ ...p, currentMode: 'THSR' }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, moveByDirection, handleQuickAction]);

  return {
    gameState,
    setGameState,
    hospitals,
    transitNetwork,
    activeBears,
    player,
    setPlayer,
    stats,
    lastSettlement,
    rescueHistory,
    lastUpdatedTime,
    selectedHospital,
    setSelectedHospital,
    startGame,
    spawnBear,
    moveToLocation,
    moveByDirection,
    handleQuickAction,
    pickupBear,
    deliverBearToHospital
  };
}
