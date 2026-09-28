import { createContext, useCallback, useContext, useEffect, useMemo, useRef,
  useState, type PropsWithChildren } from 'react';

import { STORAGE_KEYS } from '@/storage/keys';
import { localStorage } from '@/storage/localStorage';
import { clampGetawayMax, DEFAULT_GETAWAY_MAX_KM, persistableGetawayMax,
  restoreGetawayMax } from './getawayFilters';

type ExplorePreferences = {
  maxKm: number;
  hydrated: boolean;
  applyMaxKm: (value: number) => void;
  differentPreviousIds: readonly string[];
  renewDifferentFrom: (ids: readonly string[]) => void;
};

const Context = createContext<ExplorePreferences | null>(null);

export function ExplorePreferencesProvider({ children }: PropsWithChildren) {
  const [maxKm, setMaxKm] = useState(DEFAULT_GETAWAY_MAX_KM);
  const [hydrated, setHydrated] = useState(false);
  const [differentPreviousIds, setDifferentPreviousIds] = useState<readonly string[]>([]);
  const lastSnapshot = useRef<string | null>(null);
  useEffect(() => {
    let active = true;
    void localStorage.get(STORAGE_KEYS.exploreGetaway, restoreGetawayMax).then(result => {
      if (!active) return;
      const value = result.status === 'value' ? result.value : DEFAULT_GETAWAY_MAX_KM;
      lastSnapshot.current = result.status === 'value' ? result.serialized
        : result.status === 'error' ? JSON.stringify(persistableGetawayMax(value)) : null;
      setMaxKm(value);
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const envelope = persistableGetawayMax(maxKm);
    const snapshot = JSON.stringify(envelope);
    if (snapshot === lastSnapshot.current) return;
    lastSnapshot.current = snapshot;
    void localStorage.set(STORAGE_KEYS.exploreGetaway, envelope).then(saved => {
      if (!saved && lastSnapshot.current === snapshot) lastSnapshot.current = null;
    });
  }, [maxKm, hydrated]);
  const applyMaxKm = useCallback((value: number) => setMaxKm(clampGetawayMax(value)), []);
  const renewDifferentFrom = useCallback((ids: readonly string[]) => setDifferentPreviousIds([...ids]), []);
  const context = useMemo(() => ({ maxKm, hydrated, applyMaxKm, differentPreviousIds,
    renewDifferentFrom }), [maxKm, hydrated, applyMaxKm, differentPreviousIds, renewDifferentFrom]);
  return <Context.Provider value={context}>{children}</Context.Provider>;
}

export function useExplorePreferences(): ExplorePreferences {
  const context = useContext(Context);
  if (!context) throw new Error('useExplorePreferences requiere ExplorePreferencesProvider');
  return context;
}
