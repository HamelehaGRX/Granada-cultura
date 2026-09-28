import { useEffect, useMemo, useState } from 'react';

import { useHomeEvents } from '@/features/events/hooks/useHomeEvents';
import { createHomeRepositories } from '@/features/events/repositories/homeRepositories';
import { selectSoon } from '../selection';
import type { SoonFilters } from '../soonFilters';

/** Radio provisional sobre distancias de fixture desde Granada; no es una preferencia global. */
export const DEMO_HABITUAL_RADIUS_KM = 30;

export function useSoonEvents(filters: SoonFilters) {
  const [repositories] = useState(createHomeRepositories);
  const { data, categories, loading, error, retry } = useHomeEvents(repositories);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const selected = useMemo(() => selectSoon(data.map(result => ({ result })), {
    now, habitualArea: { radiusKm: DEMO_HABITUAL_RADIUS_KM }, interactions: {},
  }, filters.window, filters.price), [data, filters.price, filters.window, now]);

  return { selected, categories, loading, error, retry, now };
}
