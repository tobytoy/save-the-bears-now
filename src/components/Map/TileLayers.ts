export interface MapTileLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom?: number;
  subdomains?: string | string[];
}

export const MAP_LAYERS: MapTileLayer[] = [
  {
    id: 'carto-dark',
    name: '🌙 暗黑救援 (Carto Dark)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OSM contributors',
    subdomains: 'abcd',
    maxZoom: 19
  },
  {
    id: 'nlsc-emap',
    name: '🗺️ 臺灣通用電子地圖 (NLSC)',
    url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}',
    attribution: '&copy; 內政部國土測繪中心 (NLSC)',
    maxZoom: 19
  },
  {
    id: 'carto-light',
    name: '☀️ 清新簡約 (Carto Positron)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OSM contributors',
    subdomains: 'abcd',
    maxZoom: 19
  },
  {
    id: 'osm',
    name: '🌍 OpenStreetMap 標準',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  {
    id: 'esri-satellite',
    name: '🛰️ 衛星影像 (Esri Satellite)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  },
  {
    id: 'nlsc-photo',
    name: '📷 國土正射航照 (NLSC Photo)',
    url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
    attribution: '&copy; 內政部國土測繪中心正射影像',
    maxZoom: 19
  }
];
