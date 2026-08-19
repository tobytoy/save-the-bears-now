import { useState, useEffect, useRef } from 'react';
import { Hospital, TransitNetwork } from '../types';
import { fetchLiveEmergencyData } from '../services/emergencyService';

/**
 * 負責載入與定期刷新醫院及大眾運輸路網資料
 * 從 useGameEngine 中抽離，降低單一 hook 的職責
 */
export function useDataLoader() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [transitNetwork, setTransitNetwork] = useState<TransitNetwork | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('');

  // Ref 確保 interval callback 能讀到最新 hospitals 而不需要重建 interval
  const hospitalsRef = useRef<Hospital[]>([]);
  useEffect(() => {
    hospitalsRef.current = hospitals;
  }, [hospitals]);

  // 首次載入：醫院 + 路網
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
        const enrichedHospitals = await fetchLiveEmergencyData(hospJson);
        setHospitals(enrichedHospitals);
        setLastUpdatedTime(new Date().toLocaleTimeString());
      } catch (err) {
        console.error('Failed to load initial game data:', err);
      }
    }
    loadData();
  }, []);

  // 每 30 分鐘刷新急診即時資料（interval 只建立一次）
  useEffect(() => {
    const interval = setInterval(async () => {
      if (hospitalsRef.current.length > 0) {
        const refreshed = await fetchLiveEmergencyData(hospitalsRef.current);
        setHospitals(refreshed);
        setLastUpdatedTime(new Date().toLocaleTimeString());
      }
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { hospitals, transitNetwork, lastUpdatedTime };
}
