import { TransitNetwork } from '../types';
import { calculateDistanceKm } from '../utils/geo';

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  matchedStationName?: string;
}

// 內建台灣全島主要行政區、商圈、地標、學校與醫療中心座標快查表 (0ms 延遲、精準定位)
const TAIWAN_PRESET_LOCATIONS: Record<string, { lat: number; lng: number; name: string }> = {
  // 士林、北投、天母地區
  '天母美國學校': { lat: 25.1159, lng: 121.5300, name: '台北美國學校 (天母中山北路六段)' },
  '台北美國學校': { lat: 25.1159, lng: 121.5300, name: '台北美國學校 (天母中山北路六段)' },
  '美國學校': { lat: 25.1159, lng: 121.5300, name: '台北美國學校 (天母中山北路六段)' },
  '天母日僑學校': { lat: 25.1165, lng: 121.5315, name: '台北日僑學校 (天母)' },
  '日僑學校': { lat: 25.1165, lng: 121.5315, name: '台北日僑學校 (天母)' },
  '天母棒球場': { lat: 25.1130, lng: 121.5335, name: '天母棒球場 (士林忠誠路)' },
  '天母': { lat: 25.1180, lng: 121.5300, name: '台北市士林區天母商圈' },
  '天母新光三越': { lat: 25.1145, lng: 121.5340, name: '新光三越台北天母店' },
  '大葉高島屋': { lat: 25.1118, lng: 121.5320, name: '大葉高島屋 (士林區)' },
  '台北榮總': { lat: 25.1200, lng: 121.5195, name: '台北榮民總醫院 (石牌/北投)' },
  '榮總': { lat: 25.1200, lng: 121.5195, name: '台北榮民總醫院 (石牌/北投)' },
  '振興醫院': { lat: 25.1165, lng: 121.5225, name: '振興醫院 (北投明德路)' },
  '新光醫院': { lat: 25.0935, lng: 121.5205, name: '新光吳火獅紀念醫院 (士林文昌路)' },
  '陽明醫院': { lat: 25.1055, lng: 121.5305, name: '部立陽明醫院 (雨聲街)' },
  '士林夜市': { lat: 25.0888, lng: 121.5245, name: '士林夜市 (士林區)' },
  '士林官邸': { lat: 25.0945, lng: 121.5310, name: '士林官邸公園' },
  '故宮博物院': { lat: 25.1024, lng: 121.5485, name: '國立故宮博物院 (外雙溪)' },
  '故宮': { lat: 25.1024, lng: 121.5485, name: '國立故宮博物院 (外雙溪)' },
  '北投溫泉': { lat: 25.1365, lng: 121.5065, name: '北投溫泉博物館 (北投區)' },
  '陽明山': { lat: 25.1555, lng: 121.5485, name: '陽明山國家公園' },
  '竹子湖': { lat: 25.1725, lng: 121.5355, name: '陽明山竹子湖' },

  // 台北市中心與商圈
  '台北車站': { lat: 25.0463, lng: 121.5175, name: '台北車站 (中正區)' },
  '西門町': { lat: 25.0423, lng: 121.5072, name: '西門町商圈 (萬華區)' },
  '台北101': { lat: 25.0339, lng: 121.5644, name: '台北101 / 市政府 (信義區)' },
  '信義計畫區': { lat: 25.0360, lng: 121.5668, name: '信義商圈 (信義區)' },
  '市政府': { lat: 25.0412, lng: 121.5651, name: '台北市政府 (信義區)' },
  '大安森林公園': { lat: 25.0325, lng: 121.5358, name: '大安森林公園 (大安區)' },
  '台大醫院': { lat: 25.0410, lng: 121.5165, name: '台大醫院總院 (中正區)' },
  '國立臺灣大學': { lat: 25.0175, lng: 121.5340, name: '臺灣大學公館校區 (大安區)' },
  '公館': { lat: 25.0175, lng: 121.5340, name: '公館商圈 (中正/大安)' },
  '師大夜市': { lat: 25.0245, lng: 121.5295, name: '師大龍泉商圈 (大安區)' },
  '通化夜市': { lat: 25.0305, lng: 121.5545, name: '臨江街/通化夜市 (大安區)' },
  '饒河夜市': { lat: 25.0510, lng: 121.5775, name: '饒河街觀光夜市 (松山區)' },
  '松山機場': { lat: 25.0635, lng: 121.5515, name: '台北松山機場 (松山區)' },
  '內湖科技園區': { lat: 25.0805, lng: 121.5725, name: '內湖科技園區 (內湖區)' },
  '內湖大湖公園': { lat: 25.0835, lng: 121.6025, name: '內湖大湖公園 (內湖區)' },
  '內湖': { lat: 25.0805, lng: 121.5725, name: '台北市內湖區' },
  '南港軟體園區': { lat: 25.0592, lng: 121.6155, name: '南港軟體園區 (南港區)' },
  '南港展覽館': { lat: 25.0555, lng: 121.6175, name: '南港展覽館 (南港區)' },
  '南港': { lat: 25.0535, lng: 121.6070, name: '台北市南港區' },
  '松山文創': { lat: 25.0438, lng: 121.5605, name: '松山文創園區 (信義區)' },
  '華山文創': { lat: 25.0440, lng: 121.5295, name: '華山1914文化創意產業園區 (中正區)' },
  '美麗華': { lat: 25.0836, lng: 121.5574, name: '美麗華百樂園 (中山區大直)' },
  '大直': { lat: 25.0805, lng: 121.5475, name: '大直商圈 (中山區)' },
  '中山站': { lat: 25.0531, lng: 121.5204, name: '心中山線形公園 / 中山商圈' },
  '馬偕醫院': { lat: 25.0585, lng: 121.5225, name: '台北馬偕紀念醫院 (中山區)' },
  '中正紀念堂': { lat: 25.0345, lng: 121.5215, name: '中正紀念堂 (中正區)' },
  '台北植物園': { lat: 25.0325, lng: 121.5095, name: '台北植物園 (中正區)' },
  '萬芳醫院': { lat: 24.9995, lng: 121.5585, name: '萬芳醫院 (文山區)' },
  '政治大學': { lat: 24.9875, lng: 121.5765, name: '國立政治大學 (文山區指南路)' },
  '木柵動物園': { lat: 24.9985, lng: 121.5815, name: '台北市立動物園 (文山區)' },
  '景美': { lat: 24.9935, lng: 121.5415, name: '景美夜市 / 景美站 (文山區)' },

  // 新北市各區
  '板橋車站': { lat: 25.0136, lng: 121.4623, name: '新北板橋車站 (板橋區)' },
  '板橋府中': { lat: 25.0088, lng: 121.4582, name: '板橋府中商圈 (板橋區)' },
  '亞東醫院': { lat: 24.9985, lng: 121.4525, name: '亞東紀念醫院 (板橋南雅南路)' },
  '新莊體育館': { lat: 25.0410, lng: 121.4485, name: '新莊體育園區 (新莊區)' },
  '新莊棒球場': { lat: 25.0410, lng: 121.4485, name: '新莊棒球場 (新莊區)' },
  '輔仁大學': { lat: 25.0345, lng: 121.4335, name: '輔仁大學 / 輔大醫院 (新莊區)' },
  '部立台北醫院': { lat: 25.0425, lng: 121.4595, name: '部立臺北醫院 (新莊思源路)' },
  '三重綜合體育館': { lat: 25.0625, lng: 121.4925, name: '三重綜合體育館 (三重區)' },
  '中和四號公園': { lat: 25.0015, lng: 121.5125, name: '中和四號公園 (中和區)' },
  '雙和醫院': { lat: 24.9935, lng: 121.4915, name: '雙和醫院 (中和中正路)' },
  '永和樂華夜市': { lat: 25.0095, lng: 121.5135, name: '樂華觀光夜市 (永和區)' },
  '新店碧潭': { lat: 24.9565, lng: 121.5368, name: '碧潭風景區 (新店區)' },
  '新店大坪林': { lat: 24.9829, lng: 121.5414, name: '大坪林 (新店區)' },
  '淡水老街': { lat: 25.1702, lng: 121.4395, name: '淡水老街渡船頭 (淡水區)' },
  '淡水漁人碼頭': { lat: 25.1830, lng: 121.4125, name: '淡水漁人碼頭 (淡水區)' },
  '淡江大學': { lat: 25.1755, lng: 121.4495, name: '淡江大學 (淡水區)' },
  '土城醫院': { lat: 24.9745, lng: 121.4465, name: '新北市立土城醫院 (土城區)' },
  '林口長庚': { lat: 25.0605, lng: 121.3685, name: '林口長庚紀念醫院 (龜山/林口)' },
  '三井outlet': { lat: 25.0715, lng: 121.3645, name: 'MITSUI OUTLET PARK 林口' },
  '三峽老街': { lat: 24.9345, lng: 121.3715, name: '三峽民權老街 / 祖師廟' },
  '鶯歌陶瓷老街': { lat: 24.9535, lng: 121.3485, name: '鶯歌陶瓷老街 (鶯歌區)' },
  '汐止車站': { lat: 25.0685, lng: 121.6625, name: '汐止火車站 (汐止區)' },
  '汐止國泰醫院': { lat: 25.0645, lng: 121.6575, name: '汐止國泰綜合醫院' },
  '基隆廟口': { lat: 25.1285, lng: 121.7435, name: '基隆廟口夜市 (基隆仁愛區)' },
  '基隆長庚醫院': { lat: 25.1115, lng: 121.7225, name: '基隆長庚紀念醫院' },

  // 桃園、新竹、台中、台南、高雄、宜蘭、花蓮
  '桃園火車站': { lat: 24.9895, lng: 121.3135, name: '桃園火車站 (桃園區)' },
  '桃園藝文特區': { lat: 25.0175, lng: 121.3015, name: '桃園藝文特區 (桃園區)' },
  '中壢火車站': { lat: 24.9535, lng: 121.2255, name: '中壢火車站 (中壢區)' },
  '新竹科學園區': { lat: 24.7795, lng: 121.0145, name: '新竹科學園區 (竹科)' },
  '新竹巨城': { lat: 24.8095, lng: 120.9755, name: 'Big City 巨城 (新竹市東區)' },
  '新竹火車站': { lat: 24.8015, lng: 120.9715, name: '新竹火車站 (新竹市)' },
  '台中火車站': { lat: 24.1370, lng: 120.6865, name: '台中火車站 (台中中區)' },
  '台中秋紅谷': { lat: 24.1675, lng: 120.6395, name: '秋紅谷景觀生態公園 (台中西屯區)' },
  '台中勤美': { lat: 24.1512, lng: 120.6635, name: '勤美誠品綠園道 (台中西區)' },
  '逢甲夜市': { lat: 24.1795, lng: 120.6465, name: '逢甲觀光夜市 (台中西屯區)' },
  '台中榮總': { lat: 24.1845, lng: 120.6035, name: '台中榮民總醫院 (西屯區)' },
  '中國醫藥大學': { lat: 24.1545, lng: 120.6825, name: '中國醫藥大學附設醫院 (台中北區)' },
  '彰化大佛': { lat: 24.0815, lng: 120.5485, name: '八卦山大佛風景區 (彰化市)' },
  '台南火車站': { lat: 22.9972, lng: 120.2125, name: '台南火車站 (台南東區)' },
  '成大醫院': { lat: 23.0035, lng: 120.2215, name: '國立成功大學醫學院附設醫院 (台南)' },
  '奇美醫院': { lat: 23.0205, lng: 120.2225, name: '奇美醫療財團法人奇美醫院 (台南永康)' },
  '高雄火車站': { lat: 22.6395, lng: 120.3025, name: '高雄火車站 (高雄三民區)' },
  '高雄駁二': { lat: 22.6195, lng: 120.2825, name: '駁二藝術特區 (高雄鹽埕區)' },
  '高雄巨蛋': { lat: 22.6695, lng: 120.3025, name: '高雄巨蛋 (高雄左營區)' },
  '高雄醫學大學': { lat: 22.6475, lng: 120.3105, name: '高醫附設中和紀念醫院 (三民區)' },
  '高雄榮總': { lat: 22.6785, lng: 120.3235, name: '高雄榮民總醫院 (左營區)' },
  '高雄長庚': { lat: 22.6515, lng: 120.3585, name: '高雄長庚紀念醫院 (鳥松區)' },
  '宜蘭火車站': { lat: 24.7545, lng: 121.7585, name: '宜蘭火車站 / 幾米廣場' },
  '羅東夜市': { lat: 24.6775, lng: 121.7675, name: '羅東觀光夜市 (羅東鎮)' },
  '花蓮火車站': { lat: 23.9935, lng: 121.6015, name: '花蓮火車站 (花蓮市)' },
  '花蓮慈濟醫院': { lat: 24.0045, lng: 121.5975, name: '佛教慈濟醫療財團法人花蓮慈濟醫院' }
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

  // 1. 優先嘗試內建關鍵字與常見地標快查 (0ms 延遲、絕對命中)
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

  // 2. 針對包含特殊地名（如「天母」、「士林」、「內湖」、「板橋」等）做分詞模糊快查
  const regionalKeywords = ['天母', '士林', '北投', '石牌', '內湖', '南港', '大直', '信義', '大安', '萬華', '文山', '板橋', '新莊', '三重', '中和', '永和', '新店', '淡水', '土城', '汐止', '林口', '蘆洲', '樹林', '桃園', '中壢', '新竹', '台中', '台南', '高雄', '宜蘭', '羅東', '花蓮'];
  for (const region of regionalKeywords) {
    if (query.includes(region)) {
      // 找包含該區域的預設地點
      const matchedKey = Object.keys(TAIWAN_PRESET_LOCATIONS).find((k) => k.includes(region));
      if (matchedKey) {
        const val = TAIWAN_PRESET_LOCATIONS[matchedKey];
        const nearestStation = findNearestStationName(val.lat, val.lng, transitNetwork);
        return {
          lat: val.lat,
          lng: val.lng,
          displayName: `${query} (${val.name})`,
          matchedStationName: nearestStation
        };
      }
    }
  }

  // 3. 嘗試在大眾運具路網 (捷運/公車/單車站) 模糊比對
  if (transitNetwork) {
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

  // 4. 線上 OpenStreetMap Nominatim 台灣地理編碼查詢 (包含多詞階層回退)
  const candidateQueries = [query];
  // 若包含「學校」、「國小」、「國中」、「高中」、「大學」，也嘗試縮減搜尋
  if (query.includes('美國學校')) candidateQueries.push('美國學校', '台北美國學校');

  for (const q of candidateQueries) {
    try {
      const encoded = encodeURIComponent(q);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=tw&limit=2`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
          'User-Agent': 'SaveTheBearsRescueApp/1.0'
        }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // 優先找非 highway bus_stop 的主要地標或第一個結果
          const item = data.find((d: { class?: string }) => d.class !== 'highway') || data[0];
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
    } catch {
      // Continue next candidate
    }
  }

  // 5. 所有方式都查不到時回傳 null，讓 UI 層顯示明確的錯誤訊息
  return null;
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

  // 若周邊有更近的 YouBike 站 (< 400m)
  transitNetwork.youbike.forEach((ub) => {
    const dist = calculateDistanceKm(lat, lng, ub.lat, ub.lng);
    if (dist < minDistance && dist < 0.4) {
      minDistance = dist;
      stationName = `YouBike ${ub.name}`;
    }
  });

  return stationName;
}
