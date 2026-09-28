import { useMemo } from 'react';

import { useEventInteractions } from '@/features/events/interactions/EventInteractionProvider';
import { selectCollections } from '../collections';
import { DEMO_HABITUAL_RADIUS_KM } from '../getawayFilters';
import { useExploreEvents } from './useExploreEvents';

export function useExploreCollections() {
  const events = useExploreEvents();
  const interactions = useEventInteractions();
  const context = useMemo(() => ({ now: events.now,
    habitualArea: { radiusKm: DEMO_HABITUAL_RADIUS_KM }, interactions }), [events.now, interactions]);
  const collections = useMemo(() => selectCollections(events.candidates, context),
    [events.candidates, context]);
  return { ...events, collections };
}
