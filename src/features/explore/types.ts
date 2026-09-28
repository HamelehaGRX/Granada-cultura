import type { EventInteractionMap } from '../events/interactions/types';
import type { EventResult } from '../events/types';

export const EXPLORE_BLOCK_ORDER = [
  'soon', 'different', 'getaway', 'collections', 'forYou',
] as const;

export type ExploreBlockId = typeof EXPLORE_BLOCK_ORDER[number];
export type ExploreEventBlockId = Exclude<ExploreBlockId, 'collections'>;
export type SoonWindow = 'today' | '3days' | '7days' | '14days';
export type SoonPrice = 'all' | 'free' | 'paid';

/** La distancia se calcula fuera de Explora; nunca se solicita ubicación continua aquí. */
export type HabitualArea = { radiusKm: number };

export type ExploreContext = {
  now: Date;
  habitualArea: HabitualArea;
  interactions: Readonly<EventInteractionMap>;
  neighborhoodId?: string;
};

/** Metadatos editoriales explícitos. Ausente significa desconocido, no falso. */
export type ExploreEditorial = {
  provenance: 'demo' | 'curated';
  experienceKey?: string;
  relatedCategoryIds?: readonly string[];
  emergingArtist?: boolean;
  smallVenue?: boolean;
  hiddenHeritage?: boolean;
  rural?: boolean;
  localScene?: boolean;
  activeParticipation?: boolean;
  neighborhoodId?: string;
  curiosity?: boolean;
  nighttime?: boolean;
};

/** Estimación aportada por un fixture o proveedor futuro; no se infiere de la distancia en línea recta. */
export type TravelEstimate = {
  distanceKm: number;
  durationMinutes: number;
  mode: 'car';
  source: 'demo' | 'provider';
  originLabel?: string;
};

export type ExploreCandidate = {
  result: EventResult;
  editorial?: ExploreEditorial;
  travel?: TravelEstimate;
};

export type ExploreEventBlock = {
  id: ExploreEventBlockId;
  preview: ExploreCandidate[];
  /** Sin tope artificial: los aún no mostrados preceden a los repetidos. */
  more: ExploreCandidate[];
};
