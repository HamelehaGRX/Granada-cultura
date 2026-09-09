import type { PersistedEnvelope } from './types';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Solo existe v1. Añadir aquí la conversión explícita antes de validar un esquema futuro. */
export function migrateEnvelope(value: unknown): PersistedEnvelope<unknown> | null {
  if (!isRecord(value) || value.version !== 1 || !Object.hasOwn(value, 'data')) return null;
  return { version: 1, data: value.data };
}
