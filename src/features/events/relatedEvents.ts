import type { EventInteractionMap } from './interactions/types';
import type { Event, EventResult } from './types';

function chronological(a: EventResult, b: EventResult) {
  return Date.parse(a.event.startsAt) - Date.parse(b.event.startsAt);
}

function interestCategories(results: readonly EventResult[], interactions: EventInteractionMap) {
  return new Set(results.flatMap(result => {
    const state = interactions[result.event.id];
    return state?.favorite || state?.attendance ? [result.event.categoryId] : [];
  }));
}

function affinity(current: Event, candidate: Event, interestedCategories: ReadonlySet<string>) {
  if (candidate.subcategoryId === current.subcategoryId && candidate.categoryId === current.categoryId) return 30;
  if (candidate.categoryId === current.categoryId) return 20;
  if (interestedCategories.has(candidate.categoryId)) return 10;
  return 0;
}

/** Hasta tres afinidades y, solo si es compatible, un único evento popular. */
export function selectRelatedEvents(current: Event, results: readonly EventResult[],
  interactions: EventInteractionMap, limit = 4): EventResult[] {
  const boundedLimit = Math.max(0, Math.min(4, Math.trunc(limit)));
  if (boundedLimit === 0) return [];
  const interestedCategories = interestCategories(results, interactions);
  const scored = results
    .filter(result => result.event.id !== current.id && result.event.status !== 'cancelled')
    .map(result => ({ result, score: affinity(current, result.event, interestedCategories) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || chronological(a.result, b.result));
  const affinities = scored.filter(item => item.result.event.popularity !== 'significant');
  const popular = scored.find(item => item.result.event.popularity === 'significant');
  const selected = affinities.slice(0, Math.min(3, boundedLimit)).map(item => item.result);
  if (popular && selected.length < boundedLimit) selected.push(popular.result);
  for (const item of affinities) {
    if (selected.length >= boundedLimit) break;
    if (!selected.some(result => result.event.id === item.result.event.id)) selected.push(item.result);
  }
  return selected;
}
