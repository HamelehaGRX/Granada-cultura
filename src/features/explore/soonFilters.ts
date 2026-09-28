import { isRecord, migrateEnvelope } from '../../storage/migrations';
import type { PersistedEnvelope } from '../../storage/types';
import type { SoonPrice, SoonWindow } from './types';

export type SoonFilters = { window: SoonWindow; price: SoonPrice };

export const DEFAULT_SOON_FILTERS: SoonFilters = Object.freeze({ window: '7days', price: 'all' });

const windows: readonly SoonWindow[] = ['today', '3days', '7days', '14days'];
const prices: readonly SoonPrice[] = ['all', 'free', 'paid'];

export function restoreSoonFilters(value: unknown): SoonFilters | null {
  const envelope = migrateEnvelope(value);
  if (!envelope || !isRecord(envelope.data)) return null;
  const { window, price } = envelope.data;
  if (!windows.includes(window as SoonWindow) || !prices.includes(price as SoonPrice)) return null;
  return { window: window as SoonWindow, price: price as SoonPrice };
}

export function persistableSoonFilters(filters: SoonFilters): PersistedEnvelope<SoonFilters> {
  return { version: 1, data: filters };
}

export function soonFilterSummary(filters: SoonFilters): string {
  const window = filters.window === 'today' ? 'Hoy' : filters.window === '3days' ? '3 días'
    : filters.window === '14days' ? '14 días' : '7 días';
  const price = filters.price === 'free' ? 'Gratis' : filters.price === 'paid' ? 'De pago' : 'Todos';
  return `${window} · ${price}`;
}
