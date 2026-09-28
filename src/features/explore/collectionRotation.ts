import { isRecord, migrateEnvelope } from '../../storage/migrations';
import type { PersistedEnvelope } from '../../storage/types';

/** Un cursor, no historial de vistas ni eventos: reparte la selección entre sesiones. */
export function restoreCollectionRotation(value: unknown): number | null {
  const envelope = migrateEnvelope(value);
  if (!envelope || !isRecord(envelope.data)) return null;
  const cursor = envelope.data.cursor;
  return typeof cursor === 'number' && Number.isSafeInteger(cursor) && cursor >= 0 && cursor < 12
    ? cursor : null;
}

export function persistableCollectionRotation(cursor: number): PersistedEnvelope<{ cursor: number }> {
  return { version: 1, data: { cursor: Math.abs(Math.trunc(cursor)) % 12 } };
}
