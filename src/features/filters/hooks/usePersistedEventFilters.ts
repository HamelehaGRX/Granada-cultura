import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch } from 'react';
import type { Category } from '../../categories/types';
import { STORAGE_KEYS } from '../../../storage/keys';
import { localStorage } from '../../../storage/localStorage';
import { defaultPersistedFilters, persistableFilters, restoreFilters } from '../persistence';
import type { FilterAction, FilterState } from '../types';

/** Espera al catálogo real; no interpreta el catálogo vacío de una carga fallida como válido. */
export function usePersistedEventFilters(state: FilterState, dispatch: Dispatch<FilterAction>,
  categories: Category[], catalogReady: boolean) {
  const [hydrated, setHydrated] = useState(false);
  const lastSnapshot = useRef<string | null>(null);
  // Limpiar es una intención explícita, incluso si una lectura fallida dejó defaults en memoria.
  const requestSave = useCallback(() => { lastSnapshot.current = null; }, []);
  const envelope = useMemo(() => persistableFilters(state),
    [state.date, state.price, state.distance, state.categories]);

  useEffect(() => {
    if (!catalogReady || hydrated) return;
    let active = true;
    void localStorage.get(STORAGE_KEYS.filters, value => restoreFilters(value, categories)).then(result => {
      if (!active) return;
      const value = result.status === 'value' ? result.value : defaultPersistedFilters();
      // Un fallo de lectura no debe provocar una escritura ciega de defaults.
      lastSnapshot.current = result.status === 'error' ? JSON.stringify({ version: 1, data: value })
        : result.status === 'value' ? result.serialized : null;
      dispatch({ type: 'hydrate', value });
      setHydrated(true);
    });
    return () => { active = false; };
  }, [catalogReady, categories, dispatch, hydrated]);

  useEffect(() => {
    if (!hydrated || !catalogReady) return;
    const snapshot = JSON.stringify(envelope);
    if (snapshot === lastSnapshot.current) return;
    lastSnapshot.current = snapshot;
    void localStorage.set(STORAGE_KEYS.filters, envelope).then(saved => {
      // Reintentar en un cambio posterior; sin bucle ni error invasivo en Home.
      if (!saved && lastSnapshot.current === snapshot) lastSnapshot.current = null;
    });
  }, [catalogReady, envelope, hydrated]);

  return { hydrated, requestSave };
}
