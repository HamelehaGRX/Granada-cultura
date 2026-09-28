import type { ExploreCandidate, ExploreContext } from './types';
import { eligibleInHabitualArea, hasSufficientExplicitSignals, preferredCategories,
  sortByAvailabilityAndDate } from './selection';

export const COLLECTIONS = [
  { id: 'under10', title: 'Cultura por menos de 10 €', subtitle: 'Planes accesibles para descubrir más.' },
  { id: 'emergingArtists', title: 'Artistas emergentes', subtitle: 'Nuevas voces y miradas.' },
  { id: 'smallVenues', title: 'Pequeños espacios', subtitle: 'La cultura también cabe cerca.' },
  { id: 'hiddenHeritage', title: 'Patrimonio escondido', subtitle: 'Historias que esperan ser contadas.' },
  { id: 'ruralCulture', title: 'Cultura rural', subtitle: 'Propuestas fuera de la capital.' },
  { id: 'localScene', title: 'Escena local', subtitle: 'Creadores vinculados al territorio.' },
  { id: 'participate', title: 'Participa, no solo mires', subtitle: 'Experiencias para formar parte.' },
  { id: 'yourNeighborhood', title: 'Descubre tu barrio', subtitle: 'Cultura en tu entorno más próximo.' },
  { id: 'curious', title: 'Para curiosos', subtitle: 'Aprender también es un plan.' },
  { id: 'atNight', title: 'De noche', subtitle: 'La cultura después del atardecer.' },
  { id: 'outdoors', title: 'Cultura al aire libre', subtitle: 'Planes que salen a respirar.' },
  { id: 'somethingNew', title: 'Elige algo nuevo', subtitle: 'Atrévete con otra disciplina.' },
] as const;

export type CollectionId = typeof COLLECTIONS[number]['id'];
export type AvailableCollection = {
  id: CollectionId;
  title: string;
  subtitle: string;
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
        case 'outdoors': return event.practicalInformation?.setting === 'outdoor'
          || editorial?.outdoor === true;
        case 'somethingNew': return sufficientSignals && preferred.size > 0
          && !preferred.has(event.categoryId);
      }
    }));
    return events.length ? [{ id: collection.id, title: collection.title,
      subtitle: collection.subtitle, events }] : [];
  });
}

/** Solo colecciones disponibles; mismo seed mantiene la selección durante la sesión. */
export function rotateCollections(collections: readonly AvailableCollection[], sessionSeed: number,
  limit = 4): AvailableCollection[] {
  if (collections.length === 0) return [];
  const offset = Math.abs(Math.trunc(sessionSeed)) % collections.length;
  const count = Math.max(0, Math.min(4, Math.trunc(limit), collections.length));
  return Array.from({ length: count }, (_, index) =>
    collections[(offset + Math.floor(index * collections.length / count)) % collections.length]);
}

/** Cada colección conserva sus eventos aunque otro bloque de portada ya los haya mostrado. */
export function collectionPreview(collection: AvailableCollection): ExploreCandidate[] {
  return collection.events.slice(0, 7);
}
