import { isRecord, migrateEnvelope } from '../../storage/migrations';
import type { PersistedEnvelope } from '../../storage/types';

export const DEFAULT_GETAWAY_MAX_KM = 100;
export const MAX_GETAWAY_KM = 300;
export const DEMO_HABITUAL_RADIUS_KM = 30;

export function clampGetawayMax(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_GETAWAY_KM,
    Math.max(DEMO_HABITUAL_RADIUS_KM, Math.round(value))) : DEFAULT_GETAWAY_MAX_KM;
}

export function restoreGetawayMax(value: unknown): number | null {
  const envelope = migrateEnvelope(value);
  if (!envelope || !isRecord(envelope.data)) return null;
  const maxKm = envelope.data.maxKm;
  return typeof maxKm === 'number' && Number.isFinite(maxKm) && maxKm >= DEMO_HABITUAL_RADIUS_KM
    && maxKm <= MAX_GETAWAY_KM ? Math.round(maxKm) : null;
}

export function persistableGetawayMax(maxKm: number): PersistedEnvelope<{ maxKm: number }> {
  return { version: 1, data: { maxKm: clampGetawayMax(maxKm) } };
}
