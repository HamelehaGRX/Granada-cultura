import type { Category } from '../categories/types';
import type { EventPrice, EventResult } from '../events/types';
import { eventSearchText, normalizeSearchText } from '../search/utils';
import { customDateBounds, DATE_PRESETS, matchesDate } from './dates';
import { RANGE_LIMIT } from './reducer';
import type { FilterState, NumericRange } from './types';

export function isRangeActive(range: NumericRange): boolean {
  return range.min !== 0 || range.max !== RANGE_LIMIT;
}
/** Los intervalos de precios coinciden si se solapan, extremos incluidos. */
export function matchesPrice(price: EventPrice, range: NumericRange): boolean {
  if (!isRangeActive(range)) return true;
  const min = price.kind === 'free' ? 0 : price.kind === 'fixed' ? price.amountCents : price.minAmountCents;
  const max = price.kind === 'range' ? price.maxAmountCents : min;
  return min <= range.max * 100 && max >= range.min * 100;
}

/** Conserva el orden del repositorio/consumidor. Nunca muta eventos o filtros. */
export function filterEvents(data: readonly EventResult[], filters: FilterState,
  categories: readonly Category[], now: Date): EventResult[] {
  const query = normalizeSearchText(filters.query);
  const restrictCategories = Object.keys(filters.categories).length > 0;
  return data.filter(result => {
    const { event, distanceMeters } = result;
    const selected = filters.categories[event.categoryId];
    return (!query || eventSearchText(event, categories).includes(query))
      && matchesDate(event, filters.date, now)
      && matchesPrice(event.price, filters.price)
      && (!isRangeActive(filters.distance) || (distanceMeters !== undefined
        && distanceMeters >= filters.distance.min * 1000 && distanceMeters <= filters.distance.max * 1000))
      && (!restrictCategories || (Object.hasOwn(filters.categories, event.categoryId)
        && (selected.length === 0 || selected.includes(event.subcategoryId))));
  });
}

export function filterSummaries(state: FilterState, categories: readonly Category[]) {
  const bounds = customDateBounds(state.date);
  const selected = categories.filter(category => Object.hasOwn(state.categories, category.id));
  const first = selected[0];
  const sub = first?.subcategories.find(item => state.categories[first.id].includes(item.id));
  const subCount = first ? state.categories[first.id].length : 0;
  return {
    date: state.date.kind === 'preset' ? DATE_PRESETS.find(item => item.value === (state.date.kind === 'preset' ? state.date.preset : ''))?.label ?? ''
      : bounds ? bounds[0] === bounds[1] ? bounds[0] : `${bounds[0]} — ${bounds[1]}` : '',
    price: isRangeActive(state.price) ? `${state.price.min} € — ${state.price.max} €` : '',
    distance: isRangeActive(state.distance) ? `${state.distance.min} km — ${state.distance.max} km` : '',
    categories: first ? selected.length > 1 ? `${first.name} +${selected.length - 1}`
      : `${first.name}${sub ? ` · ${sub.name}${subCount > 1 ? ` +${subCount - 1}` : ''}` : ''}` : '',
  };
}
