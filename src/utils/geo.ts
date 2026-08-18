// Geo helper functions

/**
 * Calculate Great-Circle Distance between two coordinates (Haversine formula) in kilometers
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance nicely (e.g. 350 m or 2.4 km)
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Estimate travel time in seconds given distance in km and speed in km/h
 */
export function estimateTravelTimeSec(distanceKm: number, speedKmH: number): number {
  const hours = distanceKm / Math.max(speedKmH, 1);
  return Math.max(Math.round(hours * 3600), 1);
}

/**
 * Linear interpolation between two coordinates
 */
export function interpolateCoord(
  start: [number, number],
  end: [number, number],
  t: number
): [number, number] {
  const lat = start[0] + (end[0] - start[0]) * t;
  const lng = start[1] + (end[1] - start[1]) * t;
  return [lat, lng];
}

/**
 * Generate interpolated steps along a path
 */
export function generatePathWaypoints(
  start: [number, number],
  end: [number, number],
  numSteps: number = 20
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps;
    points.push(interpolateCoord(start, end, t));
  }
  return points;
}
