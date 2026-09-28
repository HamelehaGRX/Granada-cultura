import { useEffect, useMemo, useState } from 'react';

import { useHomeEvents } from '@/features/events/hooks/useHomeEvents';
import { createHomeRepositories } from '@/features/events/repositories/homeRepositories';
import { exploreCandidates } from '../demoTravel';

export function useExploreEvents() {
  const [repositories] = useState(createHomeRepositories);
  const { data, categories, loading, error, retry } = useHomeEvents(repositories);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const candidates = useMemo(() => exploreCandidates(data), [data]);
  return { candidates, categories, loading, error, retry, now };
}
