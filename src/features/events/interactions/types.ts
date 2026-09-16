export type EventAttendance = 'interested' | 'going' | null;

export type EventInteraction = {
  favorite: boolean;
  attendance: EventAttendance;
};

export type EventInteractionMap = Record<string, EventInteraction>;

export const EMPTY_EVENT_INTERACTION: EventInteraction = Object.freeze({
  favorite: false,
  attendance: null,
});
