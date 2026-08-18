import { TransitNetwork, TransitMode } from '../types';
import { calculateDistanceKm, generatePathWaypoints } from './geo';

export interface RouteSegment {
  mode: TransitMode;
  fromName: string;
  toName: string;
  lineName?: string;
  color?: string;
  path: [number, number][];
  distanceKm: number;
  durationSec: number;
}

export interface RoutePlan {
  totalDistanceKm: number;
  totalDurationSec: number;
  summary: string;
  segments: RouteSegment[];
  allWaypoints: [number, number][];
}

interface GraphNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'STATION' | 'POINT';
  lineId?: string;
  lineName?: string;
  mode: TransitMode;
  color?: string;
}

interface GraphEdge {
  fromId: string;
  toId: string;
  mode: TransitMode;
  lineName?: string;
  color?: string;
  path: [number, number][];
  distanceKm: number;
  durationSec: number;
}

// Speeds in km/h
const SPEED_CONFIG: Record<TransitMode, number> = {
  WALK: 4.5,
  BIKE: 18.0,
  BUS: 30.0,
  METRO: 55.0,
  TRA: 100.0,
  THSR: 220.0
};

// ─── 模組層級圖快取 ─────────────────────────────────────────────────────────
// buildTransitGraph 的 O(n²) 換乘邊很耗 CPU，每次 WASD 導航不該重建
// 快取直到 transitNetwork 路線數量有變動才重建
interface GraphCache {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  adjList: Map<string, GraphEdge[]>;
}

let _cachedGraph: GraphCache | null = null;
let _cachedNetworkId = '';

function getOrBuildGraph(network: TransitNetwork): GraphCache {
  const networkId = `${network.metro.length}_${network.bus.length}_${network.youbike.length}_${network.rail.length}`;
  if (_cachedGraph && _cachedNetworkId === networkId) {
    return _cachedGraph;
  }

  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  // 1. 捷運各線路與相鄰站點連線 (嚴格沿著軌道路線移動)
  network.metro.forEach((line) => {
    line.stations.forEach((st, idx) => {
      const nodeId = `METRO_${line.id}_${st.id}`;
      nodes.set(nodeId, {
        id: nodeId,
        name: `${line.name} · ${st.name}`,
        lat: st.lat,
        lng: st.lng,
        type: 'STATION',
        lineId: line.id,
        lineName: line.name,
        mode: 'METRO',
        color: line.color
      });

      if (idx > 0) {
        const prevSt = line.stations[idx - 1];
        const prevNodeId = `METRO_${line.id}_${prevSt.id}`;
        const dist = calculateDistanceKm(prevSt.lat, prevSt.lng, st.lat, st.lng);
        const waypoints = generatePathWaypoints([prevSt.lat, prevSt.lng], [st.lat, st.lng], 6);
        const durationSec = Math.round((dist / SPEED_CONFIG.METRO) * 3600);

        edges.push({ fromId: prevNodeId, toId: nodeId, mode: 'METRO', lineName: line.name, color: line.color, path: waypoints, distanceKm: dist, durationSec });
        edges.push({ fromId: nodeId, toId: prevNodeId, mode: 'METRO', lineName: line.name, color: line.color, path: [...waypoints].reverse(), distanceKm: dist, durationSec });
      }
    });
  });

  // 2. 幹線公車站點連線
  network.bus.forEach((bus) => {
    bus.stops.forEach((st, idx) => {
      const nodeId = `BUS_${bus.id}_${st.id}`;
      nodes.set(nodeId, {
        id: nodeId,
        name: `${bus.name} · ${st.name}`,
        lat: st.lat,
        lng: st.lng,
        type: 'STATION',
        lineId: bus.id,
        lineName: bus.name,
        mode: 'BUS',
        color: bus.color
      });

      if (idx > 0) {
        const prevSt = bus.stops[idx - 1];
        const prevNodeId = `BUS_${bus.id}_${prevSt.id}`;
        const dist = calculateDistanceKm(prevSt.lat, prevSt.lng, st.lat, st.lng);
        const waypoints = generatePathWaypoints([prevSt.lat, prevSt.lng], [st.lat, st.lng], 5);
        const durationSec = Math.round((dist / SPEED_CONFIG.BUS) * 3600);

        edges.push({ fromId: prevNodeId, toId: nodeId, mode: 'BUS', lineName: bus.name, color: bus.color, path: waypoints, distanceKm: dist, durationSec });
        edges.push({ fromId: nodeId, toId: prevNodeId, mode: 'BUS', lineName: bus.name, color: bus.color, path: [...waypoints].reverse(), distanceKm: dist, durationSec });
      }
    });
  });

  // 3. YouBike 租借站點
  network.youbike.forEach((ub) => {
    nodes.set(`UB_${ub.id}`, {
      id: `UB_${ub.id}`,
      name: `YouBike ${ub.name}`,
      lat: ub.lat,
      lng: ub.lng,
      type: 'STATION',
      mode: 'BIKE',
      color: '#f59e0b'
    });
  });

  // 4. 換乘步行邊 (Transfer Edges, < 0.6 km，同路線站點已連接，不重複)
  const nodeArray = Array.from(nodes.values());
  for (let i = 0; i < nodeArray.length; i++) {
    for (let j = i + 1; j < nodeArray.length; j++) {
      const n1 = nodeArray[i];
      const n2 = nodeArray[j];
      if (n1.lineId && n2.lineId && n1.lineId === n2.lineId) continue;

      const dist = calculateDistanceKm(n1.lat, n1.lng, n2.lat, n2.lng);
      if (dist < 0.6) {
        const waypoints = generatePathWaypoints([n1.lat, n1.lng], [n2.lat, n2.lng], 4);
        const durationSec = Math.round((dist / SPEED_CONFIG.WALK) * 3600) + 60; // +60s 進出站

        edges.push({ fromId: n1.id, toId: n2.id, mode: 'WALK', lineName: '步行轉乘', color: '#94a3b8', path: waypoints, distanceKm: dist, durationSec });
        edges.push({ fromId: n2.id, toId: n1.id, mode: 'WALK', lineName: '步行轉乘', color: '#94a3b8', path: [...waypoints].reverse(), distanceKm: dist, durationSec });
      }
    }
  }

  // 建立鄰接表
  const adjList = new Map<string, GraphEdge[]>();
  nodes.forEach((_, id) => adjList.set(id, []));
  edges.forEach((edge) => {
    adjList.get(edge.fromId)?.push(edge);
  });

  _cachedGraph = { nodes, edges, adjList };
  _cachedNetworkId = networkId;
  return _cachedGraph;
}

/**
 * Multi-Modal A* 演算法：搜尋從起點到終點的最佳大眾運輸路徑
 * 利用模組層級圖快取，WASD 移動時不重建圖
 */
export function findMultiModalRoute(
  startCoord: [number, number],
  startName: string,
  endCoord: [number, number],
  endName: string,
  network: TransitNetwork
): RoutePlan {
  const directDist = calculateDistanceKm(startCoord[0], startCoord[1], endCoord[0], endCoord[1]);

  // 若距離極近 (< 350m)，直接步行前往
  if (directDist < 0.35) {
    const walkWaypoints = generatePathWaypoints(startCoord, endCoord, 12);
    const duration = Math.round((directDist / SPEED_CONFIG.WALK) * 3600);
    return {
      totalDistanceKm: directDist,
      totalDurationSec: duration,
      summary: `步行前往 (${Math.round(directDist * 1000)}m)`,
      segments: [{ mode: 'WALK', fromName: startName, toName: endName, path: walkWaypoints, distanceKm: directDist, durationSec: duration, color: '#94a3b8' }],
      allWaypoints: walkWaypoints
    };
  }

  const { nodes, adjList } = getOrBuildGraph(network);

  const START_ID = 'ORIGIN_START';
  const END_ID = 'DESTINATION_END';

  // 動態加入起終點臨時節點（不污染快取圖）
  const tempNodes = new Map<string, GraphNode>(nodes);
  const tempAdjList = new Map<string, GraphEdge[]>(adjList);

  tempNodes.set(START_ID, { id: START_ID, name: startName, lat: startCoord[0], lng: startCoord[1], type: 'POINT', mode: 'WALK' });
  tempNodes.set(END_ID, { id: END_ID, name: endName, lat: endCoord[0], lng: endCoord[1], type: 'POINT', mode: 'WALK' });
  tempAdjList.set(START_ID, []);
  tempAdjList.set(END_ID, []);

  // 連接起點至周邊站點 (第一哩路)
  nodes.forEach((node, id) => {
    const distFromStart = calculateDistanceKm(startCoord[0], startCoord[1], node.lat, node.lng);
    if (distFromStart < 2.5) {
      const mode: TransitMode = node.mode === 'BIKE' ? 'BIKE' : 'WALK';
      const speed = SPEED_CONFIG[mode];
      const duration = Math.round((distFromStart / speed) * 3600);
      const waypoints = generatePathWaypoints(startCoord, [node.lat, node.lng], 5);
      tempAdjList.get(START_ID)!.push({ fromId: START_ID, toId: id, mode, lineName: mode === 'BIKE' ? '騎 YouBike' : '步行前往站點', color: mode === 'BIKE' ? '#f59e0b' : '#94a3b8', path: waypoints, distanceKm: distFromStart, durationSec: duration });
    }

    // 連接周邊站點至終點 (最後一哩路)
    const distToEnd = calculateDistanceKm(node.lat, node.lng, endCoord[0], endCoord[1]);
    if (distToEnd < 2.5) {
      const mode: TransitMode = node.mode === 'BIKE' ? 'BIKE' : 'WALK';
      const speed = SPEED_CONFIG[mode];
      const duration = Math.round((distToEnd / speed) * 3600);
      const waypoints = generatePathWaypoints([node.lat, node.lng], endCoord, 5);
      tempAdjList.get(id)!.push({ fromId: id, toId: END_ID, mode, lineName: mode === 'BIKE' ? '騎 YouBike 抵達' : '步行抵達', color: mode === 'BIKE' ? '#f59e0b' : '#94a3b8', path: waypoints, distanceKm: distToEnd, durationSec: duration });
    }
  });

// ─── 快速二元最小堆積 (Binary Min-Heap for A* Priority Queue) ───────────────
class MinPriorityQueue<T> {
  private heap: { element: T; priority: number }[] = [];

  push(element: T, priority: number) {
    this.heap.push({ element, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0].element;
    const bottom = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.sinkDown(0);
    }
    return top;
  }

  get size(): number {
    return this.heap.length;
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.heap[index].priority >= this.heap[parentIdx].priority) break;
      [this.heap[index], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[index]];
      index = parentIdx;
    }
  }

  private sinkDown(index: number) {
    const length = this.heap.length;
    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let smallestIdx = index;

      if (leftChildIdx < length && this.heap[leftChildIdx].priority < this.heap[smallestIdx].priority) {
        smallestIdx = leftChildIdx;
      }
      if (rightChildIdx < length && this.heap[rightChildIdx].priority < this.heap[smallestIdx].priority) {
        smallestIdx = rightChildIdx;
      }
      if (smallestIdx === index) break;
      [this.heap[index], this.heap[smallestIdx]] = [this.heap[smallestIdx], this.heap[index]];
      index = smallestIdx;
    }
  }
}

  // ─── A* Search (O(log n) Priority Queue) ──────────────────────────────────
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, { edge: GraphEdge; fromNodeId: string }>();

  tempNodes.forEach((_, id) => { gScore.set(id, Infinity); fScore.set(id, Infinity); });
  gScore.set(START_ID, 0);
  const startF = (directDist / SPEED_CONFIG.METRO) * 3600;
  fScore.set(START_ID, startF);

  const openQueue = new MinPriorityQueue<string>();
  openQueue.push(START_ID, startF);
  const visited = new Set<string>();

  while (openQueue.size > 0) {
    const current = openQueue.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    if (current === END_ID) {
      // 路徑重建
      const segments: RouteSegment[] = [];
      let currId = END_ID;

      while (cameFrom.has(currId)) {
        const step = cameFrom.get(currId)!;
        const fromNode = tempNodes.get(step.fromNodeId)!;
        const toNode = tempNodes.get(currId)!;

        segments.unshift({
          mode: step.edge.mode,
          fromName: fromNode.name,
          toName: toNode.name,
          lineName: step.edge.lineName,
          color: step.edge.color,
          path: step.edge.path,
          distanceKm: step.edge.distanceKm,
          durationSec: step.edge.durationSec
        });

        currId = step.fromNodeId;
      }

      const allWaypoints: [number, number][] = [];
      let totalDist = 0;
      let totalTime = 0;

      segments.forEach((seg) => {
        totalDist += seg.distanceKm;
        totalTime += seg.durationSec;
        seg.path.forEach((pt) => {
          const last = allWaypoints[allWaypoints.length - 1];
          if (!last || last[0] !== pt[0] || last[1] !== pt[1]) {
            allWaypoints.push(pt);
          }
        });
      });

      const transitModesUsed = Array.from(new Set(segments.map((s) => s.lineName || s.mode))).join(' ➔ ');

      return {
        totalDistanceKm: Number(totalDist.toFixed(2)),
        totalDurationSec: totalTime,
        summary: transitModesUsed,
        segments,
        allWaypoints
      };
    }

    const currG = gScore.get(current) ?? Infinity;
    const neighbors = tempAdjList.get(current) || [];

    for (const edge of neighbors) {
      const neighborId = edge.toId;
      const tentativeG = currG + edge.durationSec;

      if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, { edge, fromNodeId: current });
        gScore.set(neighborId, tentativeG);

        const targetNode = tempNodes.get(neighborId)!;
        const h = (calculateDistanceKm(targetNode.lat, targetNode.lng, endCoord[0], endCoord[1]) / SPEED_CONFIG.METRO) * 3600;
        const nextF = tentativeG + h;
        fScore.set(neighborId, nextF);
        openQueue.push(neighborId, nextF);
      }
    }
  }

  // Fallback: 圖無連通路徑，YouBike 直接騎過去
  const fallbackPoints = generatePathWaypoints(startCoord, endCoord, 20);
  const fallbackDuration = Math.round((directDist / SPEED_CONFIG.BIKE) * 3600);
  return {
    totalDistanceKm: directDist,
    totalDurationSec: fallbackDuration,
    summary: '街道直接騎乘',
    segments: [{ mode: 'BIKE', fromName: startName, toName: endName, path: fallbackPoints, distanceKm: directDist, durationSec: fallbackDuration, color: '#f59e0b' }],
    allWaypoints: fallbackPoints
  };
}
