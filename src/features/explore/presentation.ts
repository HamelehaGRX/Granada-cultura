import { dateInTimeZone, dateToEpoch } from '../events/dates';
import { formatEventTime } from '../events/presentation';
import type { Event } from '../events/types';
import { isSoldOut } from './selection';
import type { ExploreCandidate, TravelEstimate } from './types';

export function travelLabel(travel?: TravelEstimate): string | undefined {
  if (!travel || travel.mode !== 'car' || !Number.isFinite(travel.distanceKm)
    || !Number.isFinite(travel.durationMinutes)) return undefined;
  return `${travel.distanceKm} km · aprox. ${travel.durationMinutes} min en coche${travel.source === 'demo' ? ' · demo' : ''}`;
}

function dayOffset(event: Event, now: Date): number {
  const current = dateInTimeZone(now, event.location.timeZone);
  const start = dateInTimeZone(new Date(event.startsAt), event.location.timeZone);
  return (dateToEpoch(start) - dateToEpoch(current)) / 86_400_000;
}

export function soonDayHeading(event: Event, now: Date): string {
  const offset = dayOffset(event, now);
  if (offset === 0) return 'HOY';
  if (offset === 1) return 'MAÑANA';
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: event.location.timeZone, weekday: 'long', day: 'numeric',
  }).format(new Date(event.startsAt)).toLocaleUpperCase('es-ES');
}

export function soonCardDate(event: Event, now: Date): string {
  const offset = dayOffset(event, now);
  const day = offset === 0 ? 'HOY' : offset === 1 ? 'MAÑANA'
    : offset <= 7 ? `EN ${offset} DÍAS` : soonDayHeading(event, now);
  return `${day} · ${formatEventTime(event.startsAt, event.location.timeZone)}`;
}

export type SoonDayGroup = { key: string; heading: string; events: ExploreCandidate[] };

function groupByDay(candidates: readonly ExploreCandidate[], now: Date): SoonDayGroup[] {
  const groups = new Map<string, SoonDayGroup>();
  for (const candidate of candidates) {
    const { event } = candidate.result;
    const key = dateInTimeZone(new Date(event.startsAt), event.location.timeZone);
    if (!groups.has(key)) groups.set(key, { key, heading: soonDayHeading(event, now), events: [] });
    groups.get(key)!.events.push(candidate);
  }
  return [...groups.values()];
}

/** Agotados se muestran tras todas las alternativas disponibles, agrupados por día. */
export function groupSoonEvents(candidates: readonly ExploreCandidate[], now: Date) {
  return {
    available: groupByDay(candidates.filter(candidate => !isSoldOut(candidate)), now),
    soldOut: groupByDay(candidates.filter(isSoldOut), now),
  };
}

export function soonResultState(count: number): 'empty' | 'few' | 'normal' {
  return count === 0 ? 'empty' : count < 4 ? 'few' : 'normal';
}
