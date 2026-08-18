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
import { findMultiModalRoute } from '../utils/pathfinding';
import { sound } from '../utils/audio';
import { fetchLiveEmergencyData } from '../services/emergencyService';

// 多元真實地標事故熱點 (遍布雙北、新北各區、台中、高雄、宜蘭)
const DIVERSE_SPAWN_LOCATIONS = [
  // 台北核心與商圈
  { name: '大安森林公園 音樂台旁', lat: 25.0325, lng: 121.5358 },
  { name: '西門町 徒步區紅樓前', lat: 25.0423, lng: 121.5072 },
  { name: '信義商圈 香堤大道廣場', lat: 25.0360, lng: 121.5668 },
  { name: '士林夜市 慈诚宮廟前', lat: 25.0888, lng: 121.5245 },
  { name: '圓山花博公園 爭艷館旁', lat: 25.0705, lng: 121.5225 },
  { name: '象山步道 六巨石觀景台', lat: 25.0275, lng: 121.5742 },
  { name: '公館商圈 台大校門口林蔭道', lat: 25.0175, lng: 121.5340 },
  { name: '松山文創園區 生態池畔', lat: 25.0438, lng: 121.5605 },
  { name: '內湖大湖公園 錦帶橋旁', lat: 25.0835, lng: 121.6025 },
  { name: '美麗華百樂園 摩天輪廣場', lat: 25.0836, lng: 121.5574 },
  { name: '北投溫泉博物館 步道旁', lat: 25.1365, lng: 121.5065 },
  { name: '南港軟體園區 戶外草皮', lat: 25.0592, lng: 121.6155 },
  
  // 新北各區
  { name: '板橋新板特區 萬坪都會公園', lat: 25.0125, lng: 121.4645 },
  { name: '板橋府中 慈惠宮商圈巷弄', lat: 25.0088, lng: 121.4582 },
  { name: '淡水老街 渡船頭河岸步道', lat: 25.1702, lng: 121.4395 },
  { name: '淡水漁人碼頭 情人橋下', lat: 25.1830, lng: 121.4125 },
  { name: '新店碧潭風景區 吊橋東岸', lat: 24.9565, lng: 121.5368 },
  { name: '新莊體育園區 景觀湖畔', lat: 25.0410, lng: 121.4485 },
  { name: '三重綜合體育館 廣場前', lat: 25.0625, lng: 121.4925 },
  { name: '中和四號公園 國立圖書館前', lat: 25.0015, lng: 121.5125 },
  { name: '土城桐花公園 登山步道口', lat: 24.9585, lng: 121.4485 },
  
  // 桃園、台中、高雄、宜蘭
  { name: '桃園藝文廣場 綠地步道', lat: 25.0175, lng: 121.3015 },
  { name: '台中秋紅谷景觀生態公園', lat: 24.1675, lng: 120.6395 },
  { name: '台中勤美誠品 草悟道綠廊', lat: 24.1512, lng: 120.6635 },
  { name: '高雄駁二藝術特區 大義倉庫', lat: 22.6195, lng: 120.2825 },
  { name: '高雄愛河之心 水岸步道', lat: 22.6565, lng: 120.3065 },
  { name: '宜蘭幾米主題廣場', lat: 24.7525, lng: 121.7575 }
];

const INITIAL_PLAYER_HUBS = [
  { name: '台北車站 (三鐵共構)', lat: 25.0463, lng: 121.5175 },
  { name: '西門町 (捷運站前)', lat: 25.0421, lng: 121.5083 },
  { name: '市政府站 (信義核心)', lat: 25.0412, lng: 121.5651 },
  { name: '板橋車站 (新板特區)', lat: 25.0136, lng: 121.4623 },
  { name: '大安森林公園 (信義路)', lat: 25.0334, lng: 121.5352 },
  { name: '中山站 (心中山線形公園)', lat: 25.0531, lng: 121.5204 },
  { name: '大坪林站 (新店核心)', lat: 24.9829, lng: 121.5414 },
  { name: '士林站 (士林官邸旁)', lat: 25.0936, lng: 121.5262 }
];

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
    lat: 25.0463,
    lng: 121.5175,
    currentStationName: '台北車站',
    currentMode: 'WALK',
    isOnTransit: false,
    boardedVehicleName: undefined,
    isMoving: false,
    carryingBear: null,
    targetCoord: null,
    path: [],
    currentPathIndex: 0,
    activeRouteSummary: undefined,
    plannedWaypoints: []
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

  // 2. High-Randomness Spawn Bear Helper
  const spawnBear = useCallback(
    (customCoord?: [number, number], customLocName?: string) => {
      let lat = 25.042;
      let lng = 121.52;
      let locName = '市區某處';

      if (customCoord) {
        lat = customCoord[0];
        lng = customCoord[1];
        locName = customLocName || '指定搜救區域';
      } else {
        const pickedLocation =
          DIVERSE_SPAWN_LOCATIONS[Math.floor(Math.random() * DIVERSE_SPAWN_LOCATIONS.length)];
        const jitterLat = (Math.random() - 0.5) * 0.005;
        const jitterLng = (Math.random() - 0.5) * 0.005;
        lat = pickedLocation.lat + jitterLat;
        lng = pickedLocation.lng + jitterLng;
        locName = pickedLocation.name;
      }

      const template = BEAR_STORIES[Math.floor(Math.random() * BEAR_STORIES.length)];
      const newBear: Bear = {
        id: 'bear_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
        name: template.name,
        type: template.type,
        story: template.story,
        lat,
        lng,
        locationName: locName,
        maxHealth: 100,
        currentHealth: 100,
        urgency: template.type === 'HEATSTROKE' ? 'HIGH' : 'MEDIUM',
        decayRate: template.type === 'HEATSTROKE' ? 1.0 : 0.6,
        rewardScore: 1000,
        isRescued: false,
        spawnTime: Date.now(),
        avatar: template.avatar
      };

      setActiveBears((prev) => [...prev, newBear]);
      return newBear;
    },
    []
  );

  // 3. Batch Spawn Emergency Bears (+N Bears)
  const spawnBatchBears = useCallback(
    (count = 3) => {
      sound.playPickup();
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          spawnBear();
        }, i * 150);
      }
    },
    [spawnBear]
  );

  // 4. Start Game with High Randomness
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

    const startHub = INITIAL_PLAYER_HUBS[Math.floor(Math.random() * INITIAL_PLAYER_HUBS.length)];
    setPlayer({
      lat: startHub.lat,
      lng: startHub.lng,
      currentStationName: startHub.name,
      currentMode: 'WALK',
      isOnTransit: false,
      boardedVehicleName: undefined,
      isMoving: false,
      carryingBear: null,
      targetCoord: null,
      path: [],
      currentPathIndex: 0,
      activeRouteSummary: undefined,
      plannedWaypoints: []
    });

    setActiveBears([]);
    setTimeout(() => {
      const shuffled = [...DIVERSE_SPAWN_LOCATIONS].sort(() => 0.5 - Math.random());
      for (let i = 0; i < 3; i++) {
        spawnBear([shuffled[i].lat, shuffled[i].lng], shuffled[i].name);
      }
    }, 400);
  }, [spawnBear]);

  // 5. Main Game Loop (Health decay, game clock)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setStats((prev) => ({ ...prev, gameTimeSec: prev.gameTimeSec + 1 }));

      setActiveBears((prevBears) =>
        prevBears
          .map((b) => {
            const newHealth = Math.max(0, b.currentHealth - b.decayRate);
            return { ...b, currentHealth: newHealth };
          })
          .filter((b) => {
            if (b.currentHealth <= 0 && !b.isRescued) {
              setStats((s) => ({ ...s, bearsLost: s.bearsLost + 1 }));
              sound.playWarning();
              return false;
            }
            return true;
          })
      );

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

  // 6. Auto-replenish bears if all are rescued
  useEffect(() => {
    if (gameState === 'PLAYING' && activeBears.length === 0 && !player.carryingBear) {
      const timer = setTimeout(() => {
        spawnBear();
        spawnBear();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, activeBears.length, player.carryingBear, spawnBear]);

  // 7. A* Multi-Modal Transit Path Execution Engine
  // 嚴格沿著大眾運具實體路線與軌道站點平滑移動
  const executePathRoute = useCallback(
    (targetLat: number, targetLng: number, targetName: string, explicitMode?: TransitMode) => {
      if (player.isMoving) return;

      const distKm = calculateDistanceKm(player.lat, player.lng, targetLat, targetLng);
      if (distKm < 0.0002) return;

      let waypoints: [number, number][] = [];
      let routeSummary = `前往 ${targetName}`;
      let primaryMode: TransitMode = explicitMode || player.currentMode;

      if (transitNetwork) {
        // 使用 Multi-modal A* 計算真實大眾運輸路線 (含步行接駁 ➔ 捷運軌道 ➔ 公車路線)
        const plan = findMultiModalRoute(
          [player.lat, player.lng],
          player.currentStationName || '目前位置',
          [targetLat, targetLng],
          targetName,
          transitNetwork
        );

        waypoints = plan.allWaypoints;
        routeSummary = plan.summary;
        // 若有捷運段優先標為捷運，否則依路線判斷
        const firstTransitSeg = plan.segments.find((s) => s.mode !== 'WALK');
        if (firstTransitSeg) {
          primaryMode = firstTransitSeg.mode;
        } else {
          primaryMode = 'WALK';
        }
      } else {
        waypoints = generatePathWaypoints([player.lat, player.lng], [targetLat, targetLng], 20);
      }

      if (waypoints.length < 2) return;

      sound.playTransit(primaryMode);

      setUsedModesInCurrentMission((prev) => (prev.includes(primaryMode) ? prev : [...prev, primaryMode]));

      const carbon = distKm * 0.17;
      setStats((s) => ({
        ...s,
        totalDistanceKm: Number((s.totalDistanceKm + distKm).toFixed(2)),
        carbonSavedKg: Number((s.carbonSavedKg + carbon).toFixed(2))
      }));

      const isTransit = primaryMode !== 'WALK';

      setPlayer((p) => ({
        ...p,
        isMoving: true,
        currentMode: primaryMode,
        isOnTransit: isTransit,
        boardedVehicleName: isTransit ? targetName : undefined,
        targetCoord: [targetLat, targetLng],
        path: waypoints,
        plannedWaypoints: waypoints,
        activeRouteSummary: routeSummary,
        currentPathIndex: 0
      }));

      // Frame interval: 依真實速度調整 (捷運/高鐵沿軌道極速行進，步行平穩)
      const speedKmH = transitNetwork?.speeds[primaryMode] || (primaryMode === 'WALK' ? 4.5 : 45);
      const stepInterval = Math.max(12, Math.min(38, Math.round(750 / speedKmH)));

      let currentIndex = 0;
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);

      moveTimerRef.current = window.setInterval(() => {
        currentIndex++;
        if (currentIndex >= waypoints.length) {
          if (moveTimerRef.current) clearInterval(moveTimerRef.current);
          setPlayer((p) => ({
            ...p,
            lat: targetLat,
            lng: targetLng,
            currentStationName: targetName,
            isMoving: false,
            targetCoord: null,
            path: [],
            plannedWaypoints: [],
            activeRouteSummary: undefined,
            currentPathIndex: 0
          }));
        } else {
          const pt = waypoints[currentIndex];
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

  // 8. Toggle Board / Alight Transit (上下運具切換，按 'Z' 鍵)
  const toggleBoardTransit = useCallback(
    (forcedMode?: TransitMode, forcedName?: string) => {
      if (player.isMoving) return;

      if (player.isOnTransit) {
        sound.playTransit('WALK');
        setPlayer((p) => ({
          ...p,
          isOnTransit: false,
          currentMode: 'WALK',
          boardedVehicleName: undefined
        }));
      } else {
        let modeToBoard: TransitMode = forcedMode || 'BIKE';
        let vehicleName = forcedName || 'YouBike 微笑單車';

        if (!forcedMode && transitNetwork) {
          const nearestYoubike = [...transitNetwork.youbike].sort(
            (a, b) => calculateDistanceKm(player.lat, player.lng, a.lat, a.lng) - calculateDistanceKm(player.lat, player.lng, b.lat, b.lng)
          )[0];

          if (nearestYoubike && calculateDistanceKm(player.lat, player.lng, nearestYoubike.lat, nearestYoubike.lng) < 1.5) {
            modeToBoard = 'BIKE';
            vehicleName = nearestYoubike.name;
          } else {
            modeToBoard = 'BIKE';
            vehicleName = 'YouBike 微笑單車';
          }
        }

        sound.playTransit(modeToBoard);
        setPlayer((p) => ({
          ...p,
          isOnTransit: true,
          currentMode: modeToBoard,
          boardedVehicleName: vehicleName
        }));
      }
    },
    [player, transitNetwork]
  );

  // 9. Action: Directional Step (WASD / Arrow Keys / D-Pad)
  const moveByDirection = useCallback(
    (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (player.isMoving) return;

      let delta = 0.0006;
      if (player.isOnTransit) {
        if (player.currentMode === 'BIKE') delta = 0.0022;
        else if (player.currentMode === 'BUS') delta = 0.0040;
        else if (player.currentMode === 'METRO') delta = 0.0075;
        else if (player.currentMode === 'THSR' || player.currentMode === 'TRA') delta = 0.016;
      }

      let targetLat = player.lat;
      let targetLng = player.lng;

      if (dir === 'UP') targetLat += delta;
      if (dir === 'DOWN') targetLat -= delta;
      if (dir === 'RIGHT') targetLng += delta;
      if (dir === 'LEFT') targetLng -= delta;

      const locDesc = player.isOnTransit
        ? `${player.boardedVehicleName || '大眾運具'} 行駛中`
        : '街道步行探索';

      executePathRoute(targetLat, targetLng, locDesc, player.currentMode);
    },
    [player, executePathRoute]
  );

  // 10. Action: Pickup Bear
  const pickupBear = useCallback(
    (bear: Bear) => {
      if (player.carryingBear || player.isMoving) return;
      const dist = calculateDistanceKm(player.lat, player.lng, bear.lat, bear.lng);
      if (dist > 0.8) {
        alert(`距離「${bear.name}」太遠（約 ${Math.round(dist * 1000)} 公尺）！請先搭車至鄰近站點。`);
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

  // 11. Action: Deliver Bear to Hospital ER
  const deliverBearToHospital = useCallback(
    (hospital: Hospital) => {
      if (!player.carryingBear || player.isMoving) return;

      const dist = calculateDistanceKm(player.lat, player.lng, hospital.lat, hospital.lng);
      if (dist > 0.8) {
        alert(`距離「${hospital.shortName}」還有 ${Math.round(dist * 1000)} 公尺！請先搭車至醫院門口。`);
        return;
      }

      const bear = player.carryingBear;
      const timeSpent = Math.round((Date.now() - missionStartTime) / 1000);
      const remainingHpRatio = bear.currentHealth / bear.maxHealth;

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
    },
    [player, missionStartTime, usedModesInCurrentMission]
  );

  // 12. Quick Action for Spacebar / Enter
  const handleQuickAction = useCallback(() => {
    if (player.carryingBear) {
      const nearHosp = hospitals.find(
        (h) => calculateDistanceKm(player.lat, player.lng, h.lat, h.lng) <= 0.8
      );
      if (nearHosp) {
        deliverBearToHospital(nearHosp);
      }
    } else {
      const nearBear = activeBears.find(
        (b) => calculateDistanceKm(player.lat, player.lng, b.lat, b.lng) <= 0.8
      );
      if (nearBear) {
        pickupBear(nearBear);
      }
    }
  }, [player, hospitals, activeBears, deliverBearToHospital, pickupBear]);

  // 13. Global Keyboard Controller
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
        case 'KeyZ':
          toggleBoardTransit();
          break;
        case 'Digit1':
          setPlayer((p) => ({ ...p, currentMode: 'WALK', isOnTransit: false, boardedVehicleName: undefined }));
          break;
        case 'Digit2':
          setPlayer((p) => ({ ...p, currentMode: 'BIKE', isOnTransit: true, boardedVehicleName: 'YouBike 微笑單車' }));
          break;
        case 'Digit3':
          setPlayer((p) => ({ ...p, currentMode: 'METRO', isOnTransit: true, boardedVehicleName: '台北捷運' }));
          break;
        case 'Digit4':
          setPlayer((p) => ({ ...p, currentMode: 'BUS', isOnTransit: true, boardedVehicleName: '市區公車' }));
          break;
        case 'Digit5':
          setPlayer((p) => ({ ...p, currentMode: 'THSR', isOnTransit: true, boardedVehicleName: '台灣高鐵' }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, moveByDirection, handleQuickAction, toggleBoardTransit]);

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
    spawnBatchBears,
    moveToLocation: executePathRoute,
    moveByDirection,
    toggleBoardTransit,
    handleQuickAction,
    pickupBear,
    deliverBearToHospital
  };
}
