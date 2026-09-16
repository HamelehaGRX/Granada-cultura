import { isRecord, migrateEnvelope } from '../../../storage/migrations';
import type { PersistedEnvelope } from '../../../storage/types';
import type { EventInteractionMap } from './types';

export type PersistedEventInteractionsV1 = { events: EventInteractionMap };

export function restoreEventInteractions(value: unknown): EventInteractionMap | null {
  const envelope = migrateEnvelope(value);
  if (!envelope || !isRecord(envelope.data) || !isRecord(envelope.data.events)) return null;
  const entries = Object.entries(envelope.data.events).flatMap(([eventId, raw]) => {
    if (!eventId.trim() || !isRecord(raw) || typeof raw.favorite !== 'boolean'
      || (raw.attendance !== null && raw.attendance !== 'interested' && raw.attendance !== 'going')) return [];
    if (!raw.favorite && raw.attendance === null) return [];
    return [[eventId, { favorite: raw.favorite, attendance: raw.attendance }]] as const;
  });
  return Object.fromEntries(entries);
}

export function persistableEventInteractions(events: EventInteractionMap):
PersistedEnvelope<PersistedEventInteractionsV1> {
  return { version: 1, data: { events } };
}
