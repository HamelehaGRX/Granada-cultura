import { useCallback, useEffect, useState } from 'react';

import type { Category } from '../../categories/types';
import type { HomeRepositories } from '../repositories/homeRepositories';
import type { Event, EventResult } from '../types';

type DetailState = {
  event: Event | null;
  results: EventResult[];
  categories: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: DetailState = { event: null, results: [], categories: [], loading: true, error: null };

export function useEventDetail(eventId: string, repositories: HomeRepositories) {
  const [state, setState] = useState(initialState);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  useEffect(() => {
    let active = true;
    setState(initialState);
    void Promise.all([repositories.events.list(), repositories.categories.list()]).then(([results, categories]) => {
      if (!active) return;
      const event = results.find(result => result.event.id === eventId)?.event ?? null;
      setState({ event, results, categories, loading: false, error: null });
    }, () => {
      if (active) setState({ event: null, results: [], categories: [], loading: false,
        error: 'No se ha podido cargar el evento. Vuelve a intentarlo.' });
    });
    return () => { active = false; };
  }, [attempt, eventId, repositories]);
  return { ...state, retry };
}
