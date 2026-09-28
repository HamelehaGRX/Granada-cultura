import type { ExploreCandidate, ExploreContext } from './types';
import { eligibleInHabitualArea, hasSufficientExplicitSignals, preferredCategories,
  sortByAvailabilityAndDate } from './selection';

export const COLLECTIONS = [
  { id: 'under10', title: 'Cultura por menos de 10 €' },
  { id: 'emergingArtists', title: 'Artistas emergentes' },
  { id: 'smallVenues', title: 'Pequeños espacios' },
  { id: 'hiddenHeritage', title: 'Patrimonio escondido' },
  { id: 'ruralCulture', title: 'Cultura rural' },
  { id: 'localScene', title: 'Escena local' },
  { id: 'participate', title: 'Participa, no solo mires' },
  { id: 'yourNeighborhood', title: 'Descubre tu barrio' },
  { id: 'curious', title: 'Para curiosos' },
  { id: 'atNight', title: 'De noche' },
  { id: 'outdoors', title: 'Cultura al aire libre' },
  { id: 'somethingNew', title: 'Elige algo nuevo' },
] as const;

export type CollectionId = typeof COLLECTIONS[number]['id'];
export type AvailableCollection = {
  id: CollectionId;
  title: string;
  events: ExploreCandidate[];
};

function hasConfirmedLowTotal(candidate: ExploreCandidate) {
  const { price, ticketing } = candidate.result.event;
  if (price.kind === 'free') return true;
  const total = ticketing?.totalAmountCents;
  return ticketing?.feesMayApply !== true && total !== undefined
    && Number.isSafeInteger(total) && total >= 0 && total <= 1000;
}

export function selectCollections(candidates: readonly ExploreCandidate[],
  context: ExploreContext): AvailableCollection[] {
  const { preferred } = preferredCategories(candidates, context.interactions);
  const sufficientSignals = hasSufficientExplicitSignals(context.interactions);
  const eligible = candidates.filter(candidate => eligibleInHabitualArea(candidate, context));
  return COLLECTIONS.flatMap(collection => {
    const events = sortByAvailabilityAndDate(eligible.filter(candidate => {
      const { event } = candidate.result;
      const editorial = candidate.editorial;
      switch (collection.id) {
        case 'under10': return hasConfirmedLowTotal(candidate);
        case 'emergingArtists': return editorial?.emergingArtist === true;
        case 'smallVenues': return editorial?.smallVenue === true;
        case 'hiddenHeritage': return editorial?.hiddenHeritage === true;
        case 'ruralCulture': return editorial?.rural === true;
        case 'localScene': return editorial?.localScene === true;
        case 'participate': return editorial?.activeParticipation === true;
        case 'yourNeighborhood': return Boolean(context.neighborhoodId
          && editorial?.neighborhoodId === context.neighborhoodId);
        case 'curious': return editorial?.curiosity === true;
        case 'atNight': return editorial?.nighttime === true;
        case 'outdoors': return event.practicalInformation?.setting === 'outdoor';
        case 'somethingNew': return sufficientSignals && preferred.size > 0
          && !preferred.has(event.categoryId);
      }
    }));
    return events.length ? [{ id: collection.id, title: collection.title, events }] : [];
  });
}

/** Solo colecciones disponibles; mismo seed mantiene la selección durante la sesión. */
export function rotateCollections(collections: readonly AvailableCollection[], sessionSeed: number,
  limit = 4): AvailableCollection[] {
  if (collections.length === 0) return [];
  const offset = Math.abs(Math.trunc(sessionSeed)) % collections.length;
  const rotated = [...collections.slice(offset), ...collections.slice(0, offset)];
  return rotated.slice(0, Math.max(0, Math.min(4, Math.trunc(limit))));
}

/** Cada colección conserva sus eventos aunque otro bloque de portada ya los haya mostrado. */
export function collectionPreview(collection: AvailableCollection): ExploreCandidate[] {
  return collection.events.slice(0, 7);
}
