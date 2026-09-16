import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { STORAGE_KEYS } from '@/storage/keys';
import { localStorage } from '@/storage/localStorage';
import { persistableEventInteractions, restoreEventInteractions } from './persistence';
import { eventInteractionReducer, interactionFor } from './state';
import type { EventInteractionMap } from './types';

type EventInteractionContextValue = {
  hydrated: boolean;
  interactions: EventInteractionMap;
  toggleFavorite: (eventId: string) => void;
  toggleInterested: (eventId: string) => void;
  toggleGoing: (eventId: string) => void;
};

const EventInteractionContext = createContext<EventInteractionContextValue | null>(null);

export function EventInteractionProvider({ children }: PropsWithChildren) {
  const [interactions, dispatch] = useReducer(eventInteractionReducer, {});
  const [hydrated, setHydrated] = useState(false);
  const lastSnapshot = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    void localStorage.get(STORAGE_KEYS.eventInteractions, restoreEventInteractions).then(result => {
      if (!active) return;
      const value = result.status === 'value' ? result.value : {};
      lastSnapshot.current = result.status === 'value' ? result.serialized
        : result.status === 'error' ? JSON.stringify(persistableEventInteractions(value)) : null;
      dispatch({ type: 'hydrate', value });
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const envelope = persistableEventInteractions(interactions);
    const snapshot = JSON.stringify(envelope);
    if (snapshot === lastSnapshot.current) return;
    lastSnapshot.current = snapshot;
    void localStorage.set(STORAGE_KEYS.eventInteractions, envelope).then(saved => {
      if (!saved && lastSnapshot.current === snapshot) lastSnapshot.current = null;
    });
  }, [hydrated, interactions]);

  const toggleFavorite = useCallback((eventId: string) => {
    dispatch({ type: 'toggleFavorite', eventId });
  }, []);
  const toggleInterested = useCallback((eventId: string) => {
    dispatch({ type: 'toggleAttendance', eventId, attendance: 'interested' });
  }, []);
  const toggleGoing = useCallback((eventId: string) => {
    dispatch({ type: 'toggleAttendance', eventId, attendance: 'going' });
  }, []);
  const value = useMemo(() => ({ hydrated, interactions, toggleFavorite, toggleInterested, toggleGoing }),
    [hydrated, interactions, toggleFavorite, toggleGoing, toggleInterested]);

  return <EventInteractionContext.Provider value={value}>{children}</EventInteractionContext.Provider>;
}

export function useEventInteraction(eventId: string) {
  const context = useContext(EventInteractionContext);
  if (!context) throw new Error('useEventInteraction requiere EventInteractionProvider');
  return {
    hydrated: context.hydrated,
    interaction: interactionFor(context.interactions, eventId),
    interactions: context.interactions,
    toggleFavorite: () => context.toggleFavorite(eventId),
    toggleInterested: () => context.toggleInterested(eventId),
    toggleGoing: () => context.toggleGoing(eventId),
  };
}
