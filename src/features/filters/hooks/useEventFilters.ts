import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { AppState } from 'react-native';
import type { Category } from '../../categories/types';
import type { EventResult } from '../../events/types';
import { createFilterState, filterReducer } from '../reducer';
import { filterEvents, filterSummaries } from '../utils';

export function useEventFilters(data: EventResult[], categories: Category[]) {
  const [state, dispatch] = useReducer(filterReducer, undefined, createFilterState);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = setInterval(refresh, 60_000);
    const subscription = AppState.addEventListener('change', status => { if (status === 'active') refresh(); });
    return () => { clearInterval(timer); subscription.remove(); };
  }, []);
  const results = useMemo(() => filterEvents(data, state, categories, now), [data, state, categories, now]);
  const summaries = useMemo(() => filterSummaries(state, categories), [state, categories]);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);
  const setQuery = useCallback((value: string) => dispatch({ type: 'query', value }), []);
  const active = Boolean(state.query.trim() || Object.values(summaries).some(Boolean));
  return { state, dispatch, results, summaries, active, clear, setQuery };
}
