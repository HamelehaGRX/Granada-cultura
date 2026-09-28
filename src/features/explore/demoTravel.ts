import type { EventResult } from '../events/types';
import type { ExploreCandidate, TravelEstimate } from './types';
import { DEMO_EDITORIAL } from './demoEditorial';

/** Trayectos ficticios explícitos; nunca inferir minutos de distancia en línea recta. */
const DEMO_TRAVEL: Readonly<Record<string, TravelEstimate>> = {
  'demo-17': { distanceKm: 55, durationMinutes: 49, mode: 'car', source: 'demo', originLabel: 'Granada' },
  'demo-18': { distanceKm: 68, durationMinutes: 52, mode: 'car', source: 'demo', originLabel: 'Granada' },
  'demo-19': { distanceKm: 85, durationMinutes: 66, mode: 'car', source: 'demo', originLabel: 'Granada' },
  'demo-20': { distanceKm: 115, durationMinutes: 88, mode: 'car', source: 'demo', originLabel: 'Granada' },
};

export function exploreCandidates(data: readonly EventResult[]): ExploreCandidate[] {
  return data.map(result => ({ result,
    ...(DEMO_EDITORIAL[result.event.id] ? { editorial: DEMO_EDITORIAL[result.event.id] } : {}),
    ...(DEMO_TRAVEL[result.event.id] ? { travel: DEMO_TRAVEL[result.event.id] } : {}),
  }));
}
