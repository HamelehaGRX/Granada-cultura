import type { Category } from '../categories/types';
import { isRecord, migrateEnvelope } from '../../storage/migrations';
import type { PersistedEnvelope } from '../../storage/types';
import { customDateBounds, DATE_PRESETS } from './dates';
import { createFilterState, RANGE_LIMIT } from './reducer';
import type { CategorySelection, DateFilterValue, FilterState, NumericRange } from './types';

export type PersistedFilterStateV1 = Omit<FilterState, 'query'>;

function restoreDate(value: unknown): DateFilterValue {
  if (!isRecord(value)) return { kind: 'any' };
  if (value.kind === 'preset') {
    const match = DATE_PRESETS.find(item => item.value === value.preset);
    if (match) return { kind: 'preset', preset: match.value };
  }
  if (value.kind === 'custom' && (value.mode === 'single' || value.mode === 'range')
    && typeof value.start === 'string' && typeof value.end === 'string') {
    const date: DateFilterValue = { kind: 'custom', mode: value.mode, start: value.start,
      end: value.mode === 'single' ? '' : value.end };
    if (customDateBounds(date)) return date;
  }
  return { kind: 'any' };
}

function restoreRange(value: unknown): NumericRange {
  if (!isRecord(value) || typeof value.min !== 'number' || typeof value.max !== 'number'
    || !Number.isFinite(value.min) || !Number.isFinite(value.max)) return { min: 0, max: RANGE_LIMIT };
  const bound = (number: number) => Math.min(RANGE_LIMIT, Math.max(0, Math.round(number)));
  const min = bound(value.min), max = bound(value.max);
  return { min: Math.min(min, max), max: Math.max(min, max) };
}

function restoreCategories(value: unknown, catalog: Category[]): CategorySelection {
  if (!isRecord(value)) return {};
  // Recorrer el catálogo evita claves arbitrarias y valida cada subcategoría dentro de su padre.
  return Object.fromEntries(catalog.flatMap(category => {
    if (!Object.hasOwn(value, category.id)) return [];
    const selected = value[category.id];
    if (!Array.isArray(selected) || !selected.every(id => typeof id === 'string')) return [];
    return [[category.id, category.subcategories.filter(sub => selected.includes(sub.id)).map(sub => sub.id)]];
  }));
}

export function restoreFilters(value: unknown, catalog: Category[]): PersistedFilterStateV1 | null {
  const envelope = migrateEnvelope(value);
  if (!envelope || !isRecord(envelope.data)) return null;
  const data = envelope.data;
  return { date: restoreDate(data.date), price: restoreRange(data.price),
    distance: restoreRange(data.distance), categories: restoreCategories(data.categories, catalog) };
}

/** Lista explícita: nunca serializar query, resultados, catálogo ni estados de UI. */
export function persistableFilters(state: FilterState): PersistedEnvelope<PersistedFilterStateV1> {
  return { version: 1, data: { date: state.date, price: state.price,
    distance: state.distance, categories: state.categories } };
}

export function defaultPersistedFilters(): PersistedFilterStateV1 {
  return persistableFilters(createFilterState()).data;
}
