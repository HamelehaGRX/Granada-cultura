import { EMPTY_EVENT_INTERACTION, type EventAttendance, type EventInteractionMap } from './types';

export type EventInteractionAction =
  | { type: 'hydrate'; value: EventInteractionMap }
  | { type: 'toggleFavorite'; eventId: string }
  | { type: 'toggleAttendance'; eventId: string; attendance: Exclude<EventAttendance, null> };

export function interactionFor(state: EventInteractionMap, eventId: string) {
  return state[eventId] ?? EMPTY_EVENT_INTERACTION;
}

function withInteraction(state: EventInteractionMap, eventId: string,
  next: { favorite: boolean; attendance: EventAttendance }): EventInteractionMap {
  if (!next.favorite && next.attendance === null) {
    if (!Object.hasOwn(state, eventId)) return state;
    const { [eventId]: _removed, ...rest } = state;
    return rest;
  }
  return { ...state, [eventId]: next };
}

/** Favorito es independiente; interested y going se excluyen mutuamente. */
export function eventInteractionReducer(state: EventInteractionMap,
  action: EventInteractionAction): EventInteractionMap {
  switch (action.type) {
    case 'hydrate':
      return action.value;
    case 'toggleFavorite': {
      const current = interactionFor(state, action.eventId);
      return withInteraction(state, action.eventId, { ...current, favorite: !current.favorite });
    }
    case 'toggleAttendance': {
      const current = interactionFor(state, action.eventId);
      const attendance = current.attendance === action.attendance ? null : action.attendance;
      return withInteraction(state, action.eventId, { ...current, attendance });
    }
  }
}
