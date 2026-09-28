import { createContext, useCallback, useContext, useEffect, useMemo, useRef,
  useState, type PropsWithChildren } from 'react';

import { STORAGE_KEYS } from '@/storage/keys';
import { localStorage } from '@/storage/localStorage';
import { DEFAULT_SOON_FILTERS, persistableSoonFilters, restoreSoonFilters,
  type SoonFilters } from './soonFilters';

type SoonFilterContextValue = {
  applied: SoonFilters;
  hydrated: boolean;
  apply: (filters: SoonFilters) => void;
  rememberScroll: (offset: number) => void;
  savedScroll: () => number;
};

const SoonFilterContext = createContext<SoonFilterContextValue | null>(null);

export function SoonFilterProvider({ children }: PropsWithChildren) {
  const [applied, setApplied] = useState<SoonFilters>(DEFAULT_SOON_FILTERS);
  const [hydrated, setHydrated] = useState(false);
  const lastSnapshot = useRef<string | null>(null);
  const scrollOffset = useRef(0);

  useEffect(() => {
    let active = true;
    void localStorage.get(STORAGE_KEYS.exploreSoon, restoreSoonFilters).then(result => {
      if (!active) return;
      const value = result.status === 'value' ? result.value : DEFAULT_SOON_FILTERS;
      lastSnapshot.current = result.status === 'value' ? result.serialized
        : result.status === 'error' ? JSON.stringify(persistableSoonFilters(value)) : null;
      setApplied(value);
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const envelope = persistableSoonFilters(applied);
    const snapshot = JSON.stringify(envelope);
    if (snapshot === lastSnapshot.current) return;
    lastSnapshot.current = snapshot;
    void localStorage.set(STORAGE_KEYS.exploreSoon, envelope).then(saved => {
      if (!saved && lastSnapshot.current === snapshot) lastSnapshot.current = null;
    });
  }, [applied, hydrated]);

  const apply = useCallback((filters: SoonFilters) => setApplied(filters), []);
  const rememberScroll = useCallback((offset: number) => { scrollOffset.current = offset; }, []);
  const savedScroll = useCallback(() => scrollOffset.current, []);
  const value = useMemo(() => ({ applied, hydrated, apply, rememberScroll, savedScroll }),
    [applied, hydrated, apply, rememberScroll, savedScroll]);
  return <SoonFilterContext.Provider value={value}>{children}</SoonFilterContext.Provider>;
}

export function useSoonFilters(): SoonFilterContextValue {
  const context = useContext(SoonFilterContext);
  if (!context) throw new Error('useSoonFilters requiere SoonFilterProvider');
  return context;
}
