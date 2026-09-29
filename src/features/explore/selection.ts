import { dateInTimeZone, dateToEpoch } from '../events/dates';
import type { EventInteractionMap } from '../events/interactions/types';
import { type ExploreBlockId, type ExploreCandidate,
  type ExploreContext, type ExploreEventBlock, type ExploreEventBlockId,
  type GetawayWindow, type SoonPrice, type SoonWindow } from './types';

const DAY_MS = 86_400_000;
const PREVIEW_LIMIT = 7;
const SOON_DAYS: Record<SoonWindow, number> = {
  today: 1, '3days': 3, '7days': 7, '14days': 14,
};

function validDistance(candidate: ExploreCandidate): number | null {
  const meters = candidate.result.distanceMeters;
  return meters !== undefined && Number.isFinite(meters) && meters >= 0 ? meters / 1000 : null;
}

export function isSoldOut(candidate: ExploreCandidate): boolean {
  return candidate.result.event.status === 'soldOut'
    || candidate.result.event.ticketing?.statuses.includes('soldOut') === true;
}

/** Los aplazados con nueva fecha futura son válidos; un evento ya iniciado no es una próxima sesión. */
export function isUpcoming(candidate: ExploreCandidate, now: Date): boolean {
  const { event } = candidate.result;
  const start = Date.parse(event.startsAt);
  return Number.isFinite(now.getTime()) && Number.isFinite(start)
    && start >= now.getTime() && event.status !== 'cancelled'
    && (!event.endsAt || Date.parse(event.endsAt) >= now.getTime());
}

export function eligibleInHabitualArea(candidate: ExploreCandidate, context: ExploreContext): boolean {
  const distance = validDistance(candidate);
  return isUpcoming(candidate, context.now) && distance !== null
    && Number.isFinite(context.habitualArea.radiusKm) && context.habitualArea.radiusKm > 0
    && distance <= context.habitualArea.radiusKm;
}

export function sortByAvailabilityAndDate(candidates: readonly ExploreCandidate[]): ExploreCandidate[] {
  return [...candidates].sort((a, b) => Number(isSoldOut(a)) - Number(isSoldOut(b))
    || Date.parse(a.result.event.startsAt) - Date.parse(b.result.event.startsAt)
    || a.result.event.id.localeCompare(b.result.event.id));
}

function matchesSoonPrice(candidate: ExploreCandidate, price: SoonPrice): boolean {
  if (price === 'all') return true;
  const eventPrice = candidate.result.event.price;
  return price === 'free' ? eventPrice.kind === 'free'
    : eventPrice.kind !== 'free' && (eventPrice.kind === 'fixed'
      ? eventPrice.amountCents > 0 : eventPrice.maxAmountCents > 0);
}

/** Ventanas por días civiles del evento: hoy + 2/6/13 días, sin cortar a medianoche UTC. */
export function selectSoon(candidates: readonly ExploreCandidate[], context: ExploreContext,
  window: SoonWindow = '7days', price: SoonPrice = 'all'): ExploreCandidate[] {
  return sortByAvailabilityAndDate(candidates.filter(candidate => {
    if (!eligibleInHabitualArea(candidate, context) || !matchesSoonPrice(candidate, price)) return false;
    const { event } = candidate.result;
    const today = dateInTimeZone(context.now, event.location.timeZone);
    const startDay = dateInTimeZone(new Date(event.startsAt), event.location.timeZone);
    const days = (dateToEpoch(startDay) - dateToEpoch(today)) / DAY_MS;
    return days >= 0 && days < SOON_DAYS[window];
  }));
}

export function hasSufficientExplicitSignals(interactions: Readonly<EventInteractionMap>): boolean {
  return Object.values(interactions).filter(value => value.favorite || value.attendance !== null).length >= 2;
}

export function preferredCategories(candidates: readonly ExploreCandidate[],
  interactions: Readonly<EventInteractionMap>) {
  const preferred = new Set<string>();
  const strong = new Set<string>();
  for (const { result } of candidates) {
    const interaction = interactions[result.event.id];
    if (interaction?.favorite || interaction?.attendance) preferred.add(result.event.categoryId);
    if (interaction?.attendance === 'going') strong.add(result.event.categoryId);
  }
  return { preferred, strong };
}

/** La música de concierto sigue siendo una experiencia aunque cambie el género. */
export function experienceKey(candidate: ExploreCandidate): string {
  const { event } = candidate.result;
  return candidate.editorial?.experienceKey ?? (event.categoryId === 'musica'
    ? 'concierto' : `${event.categoryId}/${event.subcategoryId}`);
}

function diversifyExperiences(group: readonly ExploreCandidate[]): ExploreCandidate[] {
  const counts = new Map<string, number>();
  const diverse: ExploreCandidate[] = [];
  const overflow: ExploreCandidate[] = [];
  for (const candidate of group) {
    const key = experienceKey(candidate);
    const count = counts.get(key) ?? 0;
    if (count >= 2) overflow.push(candidate);
    else { diverse.push(candidate); counts.set(key, count + 1); }
  }
  return [...diverse, ...overflow];
}

/** Diversifica por experiencia explícita o por un tipo conservador de actividad. */
export function selectDifferent(candidates: readonly ExploreCandidate[],
  context: ExploreContext): ExploreCandidate[] {
  const { preferred } = preferredCategories(candidates, context.interactions);
  const ranked = candidates.filter(candidate => eligibleInHabitualArea(candidate, context))
    .sort((a, b) => {
      const tier = (candidate: ExploreCandidate) => {
        if (preferred.size === 0) return 0;
        if (candidate.editorial?.relatedCategoryIds?.some(id => preferred.has(id))
          && !preferred.has(candidate.result.event.categoryId)) return 0;
        return preferred.has(candidate.result.event.categoryId) ? 2 : 1;
      };
      return Number(isSoldOut(a)) - Number(isSoldOut(b)) || tier(a) - tier(b)
        || Date.parse(a.result.event.startsAt) - Date.parse(b.result.event.startsAt)
        || a.result.event.id.localeCompare(b.result.event.id);
    });
  return [
    ...diversifyExperiences(ranked.filter(candidate => !isSoldOut(candidate))),
    ...diversifyExperiences(ranked.filter(isSoldOut)),
  ];
}

/** Renovación deliberada y estable: prefiere eventos no vistos en el preview anterior. */
export function renewDifferent(candidates: readonly ExploreCandidate[], previousIds: readonly string[],
  previewExcludedIds: readonly string[] = []): ExploreCandidate[] {
  const previous = new Set(previousIds);
  const excluded = new Set(previewExcludedIds);
  const visible = candidates.filter(item => !excluded.has(item.result.event.id));
  const hidden = candidates.filter(item => excluded.has(item.result.event.id));
  const reordered = [...visible.filter(item => !isSoldOut(item) && !previous.has(item.result.event.id)),
    ...visible.filter(item => !isSoldOut(item) && previous.has(item.result.event.id)),
    ...hidden.filter(item => !isSoldOut(item)),
    ...visible.filter(item => isSoldOut(item) && !previous.has(item.result.event.id)),
    ...visible.filter(item => isSoldOut(item) && previous.has(item.result.event.id)),
    ...hidden.filter(item => isSoldOut(item))];
  return [...diversifyExperiences(reordered.filter(item => !isSoldOut(item))),
    ...reordered.filter(isSoldOut)];
}

/** Distancia recta de EventResult para elegibilidad; TravelEstimate solo informa del trayecto. */
export function selectGetaway(candidates: readonly ExploreCandidate[], context: ExploreContext,
  maxKm = 300, window: GetawayWindow = 'all'): ExploreCandidate[] {
  const ceiling = Math.min(300, Math.max(0, maxKm));
  return sortByAvailabilityAndDate(candidates.filter(candidate => {
    const distance = validDistance(candidate);
    if (!isUpcoming(candidate, context.now) || distance === null
      || distance <= context.habitualArea.radiusKm || distance > ceiling) return false;
    if (window === 'all') return true;
    const today = dateInTimeZone(context.now, candidate.result.event.location.timeZone);
    const startDay = dateInTimeZone(new Date(candidate.result.event.startsAt),
      candidate.result.event.location.timeZone);
    const days = (dateToEpoch(startDay) - dateToEpoch(today)) / DAY_MS;
    const limit = window === '30days' ? 30 : SOON_DAYS[window];
    return days >= 0 && days < limit;
  }));
}

export function selectGetawayWithExpansion(candidates: readonly ExploreCandidate[], context: ExploreContext,
  maxKm: number, window: GetawayWindow = 'all') {
  const selected = selectGetaway(candidates, context, maxKm, window);
  const bounded = Math.min(300, Math.max(context.habitualArea.radiusKm, maxKm));
  if (selected.filter(item => !isSoldOut(item)).length >= 4 || bounded >= 300) {
    return { selected, effectiveMaxKm: bounded, expanded: false };
  }
  const effectiveMaxKm = Math.min(300, bounded + 25);
  const expanded = selectGetaway(candidates, context, effectiveMaxKm, window);
  return expanded.length > selected.length
    ? { selected: expanded, effectiveMaxKm, expanded: true }
    : { selected, effectiveMaxKm: bounded, expanded: false };
}

/** Solo señales explícitas actuales. Visitas e impresiones no se recogen en esta fase. */
export function selectForYou(candidates: readonly ExploreCandidate[],
  context: ExploreContext): ExploreCandidate[] {
  if (!hasSufficientExplicitSignals(context.interactions)) return [];
  const signals = candidates.flatMap(candidate => {
    const interaction = context.interactions[candidate.result.event.id];
    return interaction?.favorite || interaction?.attendance
      ? [{ candidate, priority: interaction.attendance === 'going' ? 2 : 1 }] : [];
  });
  const ranked = candidates.flatMap(candidate => {
    const event = candidate.result.event;
    const interaction = context.interactions[event.id];
    if (!eligibleInHabitualArea(candidate, context) || interaction?.favorite || interaction?.attendance) return [];
    const matches = signals.flatMap(signal => {
      const source = signal.candidate.result.event;
      const relation = source.categoryId === event.categoryId
        && source.subcategoryId === event.subcategoryId ? 3
        : experienceKey(signal.candidate) === experienceKey(candidate) ? 2
          : source.categoryId === event.categoryId
            || candidate.editorial?.relatedCategoryIds?.includes(source.categoryId)
            || signal.candidate.editorial?.relatedCategoryIds?.includes(event.categoryId) ? 1 : 0;
      return relation ? [{ priority: signal.priority, relation }] : [];
    });
    if (!matches.length) return [];
    return [{ candidate, priority: Math.max(...matches.map(match => match.priority)),
      relation: Math.max(...matches.map(match => match.relation)), support: matches.length }];
  });
  return ranked.sort((a, b) => Number(isSoldOut(a.candidate)) - Number(isSoldOut(b.candidate))
    || b.priority - a.priority || b.relation - a.relation || b.support - a.support
    || Date.parse(a.candidate.result.event.startsAt) - Date.parse(b.candidate.result.event.startsAt)
    || validDistance(a.candidate)! - validDistance(b.candidate)!
    || a.candidate.result.event.id.localeCompare(b.candidate.result.event.id))
    .map(item => item.candidate);
}

export function previewEvents(candidates: readonly ExploreCandidate[]): ExploreCandidate[] {
  return candidates.slice(0, PREVIEW_LIMIT);
}

/** Los modos son contratos de dominio; ninguna preferencia de orden se persiste aún. */
export function resolveExploreOrder(mode: 'recommended' | 'custom' | 'dynamic' = 'recommended',
  options: { customMiddle?: readonly ExploreBlockId[]; sessionSeed?: number; includeForYou?: boolean } = {}): ExploreBlockId[] {
  const middle: ExploreBlockId[] = ['different', 'getaway', 'collections'];
  if (mode === 'custom' && options.customMiddle) {
    const requested = options.customMiddle.filter(id => middle.includes(id));
    middle.splice(0, middle.length, ...new Set(requested), ...middle.filter(id => !requested.includes(id)));
  } else if (mode === 'dynamic') {
    const offset = Math.abs(Math.trunc(options.sessionSeed ?? 0)) % middle.length;
    middle.push(...middle.splice(0, offset));
  }
  return ['soon', ...middle, ...(options.includeForYou === false ? [] : ['forYou' as const])];
}

/** Desduplicación local de portada. Las colecciones se seleccionan por separado y no consumen IDs. */
export function assembleExploreEventBlocks(order: readonly ExploreBlockId[],
  selections: Partial<Record<ExploreEventBlockId, readonly ExploreCandidate[]>>): ExploreEventBlock[] {
  const used = new Set<string>();
  const blocks: ExploreEventBlock[] = [];
  for (const id of order) {
    if (id === 'collections') continue;
    const unique = new Map<string, ExploreCandidate>();
    for (const candidate of selections[id] ?? []) {
      if (!unique.has(candidate.result.event.id)) unique.set(candidate.result.event.id, candidate);
    }
    const all = [...unique.values()];
    const unseen = all.filter(candidate => !used.has(candidate.result.event.id));
    const available = unseen.filter(candidate => !isSoldOut(candidate));
    const previouslyShownAvailable = id === 'forYou' && !available.length
      ? all.filter(candidate => !isSoldOut(candidate)) : [];
    const pool = previouslyShownAvailable.length ? previouslyShownAvailable
      : available.length ? available : unseen;
    const preview = previewEvents(id === 'different' || id === 'forYou'
      ? diversifyExperiences(pool) : pool);
    if (preview.length === 0) continue;
    preview.forEach(candidate => used.add(candidate.result.event.id));
    const unseenForMore = all.filter(candidate => !used.has(candidate.result.event.id));
    const promoted = id === 'forYou' ? previewEvents(unseenForMore.filter(candidate => !isSoldOut(candidate)))
      : unseenForMore;
    const promotedIds = new Set(promoted.map(candidate => candidate.result.event.id));
    blocks.push({ id, preview, more: [...promoted,
      ...all.filter(candidate => !promotedIds.has(candidate.result.event.id))] });
  }
  return blocks;
}
