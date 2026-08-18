export type TransitMode = 'WALK' | 'BIKE' | 'BUS' | 'METRO' | 'TRA' | 'THSR';

export interface Hospital {
  id: string;
  name: string;
  shortName: string;
  area: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  tier: string;
  nearMetro: string;
  tags: string[];
  // Dynamic NHI metrics
  waitSee?: number;
  waitBed?: number;
  waitGeneral?: number;
  waitIcu?: number;
  inform?: 'Y' | 'N';
  lastUpdated?: string;
}

export interface TransitStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  hospitalId?: string;
  isTransfer?: boolean;
  modes?: string[];
  bikes?: number;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  speed: number;
  stations: TransitStation[];
}

export interface BusRoute {
  id: string;
  name: string;
  color: string;
  speed: number;
  stops: TransitStation[];
}

export interface RailStation {
  id: string;
  name: string;
  type: 'THSR' | 'TRA';
  lat: number;
  lng: number;
  speed: number;
  hospitalId?: string;
}

export interface YouBikeStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  bikes: number;
  hospitalId?: string;
}

export interface TransitNetwork {
  metro: MetroLine[];
  rail: RailStation[];
  bus: BusRoute[];
  youbike: YouBikeStation[];
  speeds: Record<TransitMode, number>;
}

export type BearInjuryType = 'FRACTURE' | 'HEATSTROKE' | 'FLU' | 'HUNGRY' | 'EXHAUSTED';

export interface Bear {
  id: string;
  name: string;
  type: BearInjuryType;
  story: string;
  lat: number;
  lng: number;
  locationName: string;
  maxHealth: number;
  currentHealth: number; // 0 to 100
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  decayRate: number; // Health lost per second
  rewardScore: number;
  isRescued: boolean;
  spawnTime: number;
  avatar: string;
}

export interface Player {
  lat: number;
  lng: number;
  currentStationName: string;
  currentMode: TransitMode;
  isMoving: boolean;
  carryingBear: Bear | null;
  targetCoord: [number, number] | null;
  path: [number, number][];
  currentPathIndex: number;
}

export interface GameStats {
  score: number;
  bearsSaved: number;
  bearsLost: number;
  carbonSavedKg: number;
  totalDistanceKm: number;
  gameTimeSec: number;
}

export type GameState = 'INTRO' | 'PLAYING' | 'SETTLEMENT' | 'PAUSED' | 'GAMEOVER';

export interface RescueHistory {
  id: string;
  bearName: string;
  bearType: BearInjuryType;
  hospitalName: string;
  timeSpentSec: number;
  healthRemaining: number;
  transitModesUsed: TransitMode[];
  carbonSavedKg: number;
  rating: number; // 1 to 3 stars
  timestamp: string;
}
