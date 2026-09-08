import { useCallback, useEffect, useState } from 'react';

import type { Category } from '../../categories/types';
import { sortHomeEvents } from '../presentation';
import type { HomeRepositories } from '../repositories/homeRepositories';
import type { EventResult } from '../types';

type HomeEventsState = {
  data: EventResult[];
  categories: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: HomeEventsState = { data: [], categories: [], loading: true, error: null };

/** Ignora respuestas antiguas al desmontar, cambiar repositorios o reintentar. */
export function useHomeEvents({ events, categories }: HomeRepositories) {
  const [state, setState] = useState<HomeEventsState>(initialState);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);

  useEffect(() => {
    let active = true;
    setState(initialState);
    async function load() {
      try {
        const [data, catalog] = await Promise.all([events.list(), categories.list()]);
        if (active) setState({ data: sortHomeEvents(data), categories: catalog, loading: false, error: null });
      } catch {
        if (active) setState({
          data: [], categories: [], loading: false,
          error: 'No se han podido cargar los eventos. Vuelve a intentarlo.',
        });
      }
    }
    void load();
    return () => { active = false; };
  }, [events, categories, attempt]);

  return { ...state, retry };
}
