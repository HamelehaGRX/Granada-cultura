import { useMemo } from 'react';

import { selectSoon } from '../selection';
import type { SoonFilters } from '../soonFilters';
import { DEMO_HABITUAL_RADIUS_KM } from '../getawayFilters';
import { useExploreEvents } from './useExploreEvents';

/** Radio provisional sobre distancias de fixture desde Granada; no es una preferencia global. */
export { DEMO_HABITUAL_RADIUS_KM } from '../getawayFilters';

export function useSoonEvents(filters: SoonFilters) {
  const { candidates, categories, loading, error, retry, now } = useExploreEvents();

  const selected = useMemo(() => selectSoon(candidates, {
    now, habitualArea: { radiusKm: DEMO_HABITUAL_RADIUS_KM }, interactions: {},
  }, filters.window, filters.price), [candidates, filters.price, filters.window, now]);

  return { selected, categories, loading, error, retry, now };
}
