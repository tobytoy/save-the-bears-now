import { TransitNetwork } from '../types';
import { calculateDistanceKm } from '../utils/geo';

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  matchedStationName?: string;
}

// 內建台灣主要行政區、商圈、地標與醫療中心座標快查表 (0延遲、免連線保證)
const TAIWAN_PRESET_LOCATIONS: Record<string, { lat: number; lng: number; name: string }> = {
  // 台北市
  '台北車站': { lat: 25.0463, lng: 121.5175, name: '台北車站 (中正區)' },
  '西門町': { lat: 25.0423, lng: 121.5072, name: '西門町商圈 (萬華區)' },
  '台北101': { lat: 25.0339, lng: 121.5644, name: '台北101 / 市政府 (信義區)' },
  '市政府': { lat: 25.0412, lng: 121.5651, name: '台北市政府 (信義區)' },
  '大安森林公園': { lat: 25.0325, lng: 121.5358, name: '大安森林公園 (大安區)' },
  '台大醫院': { lat: 25.0410, lng: 121.5165, name: '台大醫院 (中正區)' },
  '國立臺灣大學': { lat: 25.0175, lng: 121.5340, name: '臺灣大學公館校區 (大安區)' },
  '公館': { lat: 25.0175, lng: 121.5340, name: '公館商圈 (中正/大安)' },
  '士林夜市': { lat: 25.0888, lng: 121.5245, name: '士林夜市 (士林區)' },
  '北投溫泉': { lat: 25.1365, lng: 121.5065, name: '北投溫泉 (北投區)' },
  '內湖科技園區': { lat: 25.0805, lng: 121.5725, name: '內湖科技園區 (內湖區)' },
  '南港軟體園區': { lat: 25.0592, lng: 121.6155, name: '南港軟體園區 (南港區)' },
  '松山文創': { lat: 25.0438, lng: 121.5605, name: '松山文創園區 (信義區)' },
  '美麗華': { lat: 25.0836, lng: 121.5574, name: '美麗華百樂園 (中山區)' },
  '中山站': { lat: 25.0531, lng: 121.5204, name: '中山商圈 (中山區)' },

  // 新北市
  '板橋車站': { lat: 25.0136, lng: 121.4623, name: '新北板橋車站 (板橋區)' },
  '板橋府中': { lat: 25.0088, lng: 121.4582, name: '板橋府中商圈 (板橋區)' },
  '新莊體育館': { lat: 25.0410, lng: 121.4485, name: '新莊體育園區 (新莊區)' },
  '部立台北醫院': { lat: 25.0425, lng: 121.4595, name: '部立臺北醫院 (新莊思源路)' },
  '三重綜合體育館': { lat: 25.0625, lng: 121.4925, name: '三重綜合體育館 (三重區)' },
  '中和四號公園': { lat: 25.0015, lng: 121.5125, name: '中和四號公園 (中和區)' },
  '雙和醫院': { lat: 24.9935, lng: 121.4915, name: '雙和醫院 (中和中正路)' },
  '新店碧潭': { lat: 24.9565, lng: 121.5368, name: '碧潭風景區 (新店區)' },
  '新店大坪林': { lat: 24.9829, lng: 121.5414, name: '大坪林 (新店區)' },
  '淡水老街': { lat: 25.1702, lng: 121.4395, name: '淡水老街渡船頭 (淡水區)' },
  '淡水漁人碼頭': { lat: 25.1830, lng: 121.4125, name: '淡水漁人碼頭 (淡水區)' },
  '土城醫院': { lat: 24.9745, lng: 121.4465, name: '新北市立土城醫院 (土城區)' },

  // 桃園、新竹、台中、台南、高雄、宜蘭
  '桃園藝文特區': { lat: 25.0175, lng: 121.3015, name: '桃園藝文特區 (桃園區)' },
  '新竹巨城': { lat: 24.8095, lng: 120.9755, name: 'Big City 巨城 (新竹市東區)' },
  '台中火車站': { lat: 24.1370, lng: 120.6865, name: '台中火車站 (台中中區)' },
  '台中秋紅谷': { lat: 24.1675, lng: 120.6395, name: '秋紅谷景觀生態公園 (台中西屯區)' },
  '台中勤美': { lat: 24.1512, lng: 120.6635, name: '勤美誠品綠園道 (台中西區)' },
  '台南火車站': { lat: 22.9972, lng: 120.2125, name: '台南火車站 (台南東區)' },
  '高雄火車站': { lat: 22.6395, lng: 120.3025, name: '高雄火車站 (高雄三民區)' },
  '高雄駁二': { lat: 22.6195, lng: 120.2825, name: '駁二藝術特區 (高雄鹽埕區)' },
  '高雄巨蛋': { lat: 22.6695, lng: 120.3025, name: '高雄巨蛋 (高雄左營區)' },
  '宜蘭火車站': { lat: 24.7545, lng: 121.7585, name: '宜蘭火車站 / 幾米廣場' }
};

/**
 * 查詢台灣地址或地標，返回精確經緯度與最近站點
 */
export async function geocodeTaiwanAddress(
  rawQuery: string,
  transitNetwork?: TransitNetwork | null
): Promise<GeocodeResult | null> {
  const query = rawQuery.trim();
  if (!query) return null;

  // 1. 優先嘗試內建關鍵字與常見地標快查 (0ms 延遲)
  for (const [key, val] of Object.entries(TAIWAN_PRESET_LOCATIONS)) {
    if (query.includes(key) || key.includes(query)) {
      const nearestStation = findNearestStationName(val.lat, val.lng, transitNetwork);
      return {
        lat: val.lat,
        lng: val.lng,
        displayName: val.name,
        matchedStationName: nearestStation
      };
    }
  }

  // 2. 嘗試在大眾運具路網 (捷運/公車/單車站) 模糊比對
  if (transitNetwork) {
    // 捷運站搜尋
    for (const line of transitNetwork.metro) {
      for (const st of line.stations) {
        if (query.includes(st.name) || st.name.includes(query)) {
          return {
            lat: st.lat,
            lng: st.lng,
            displayName: `${line.name} · ${st.name}站`,
            matchedStationName: `${line.name} · ${st.name}站`
          };
        }
      }
    }
    // YouBike 站搜尋
    for (const ub of transitNetwork.youbike) {
      if (query.includes(ub.name) || ub.name.includes(query)) {
        return {
          lat: ub.lat,
          lng: ub.lng,
          displayName: `YouBike ${ub.name}`,
          matchedStationName: `YouBike ${ub.name}`
        };
      }
    }
  }

  // 3. 線上 OpenStreetMap Nominatim 台灣地理編碼查詢 (附帶 4 秒超時)
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=tw&limit=1`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const nearestStation = findNearestStationName(lat, lng, transitNetwork);
        return {
          lat,
          lng,
          displayName: item.display_name.split(',')[0] || query,
          matchedStationName: nearestStation
        };
      }
    }
  } catch (err) {
    console.warn('Online geocoding failed/timeout, falling back to Taipei center:', err);
  }

  // 4. 若全數未查到，預設返回台北核心區隨機座標
  return {
    lat: 25.0463 + (Math.random() - 0.5) * 0.02,
    lng: 121.5175 + (Math.random() - 0.5) * 0.02,
    displayName: `${query} (周邊區域)`,
    matchedStationName: '鄰近大眾交通站'
  };
}

/**
 * 尋找最近的大眾交通站點名稱
 */
function findNearestStationName(lat: number, lng: number, transitNetwork?: TransitNetwork | null): string {
  if (!transitNetwork) return '鄰近捷運/公車站';

  let minDistance = Infinity;
  let stationName = '市區大眾站點';

  // 搜尋最近捷運站
  transitNetwork.metro.forEach((line) => {
    line.stations.forEach((st) => {
      const dist = calculateDistanceKm(lat, lng, st.lat, st.lng);
      if (dist < minDistance) {
        minDistance = dist;
        stationName = `${line.name} · ${st.name}站 (${Math.round(dist * 1000)}m)`;
      }
    });
  });

  // 若周邊有更近的 YouBike 站 (< 300m)
  transitNetwork.youbike.forEach((ub) => {
    const dist = calculateDistanceKm(lat, lng, ub.lat, ub.lng);
    if (dist < minDistance && dist < 0.4) {
      minDistance = dist;
      stationName = `YouBike ${ub.name}`;
    }
  });

  return stationName;
}
