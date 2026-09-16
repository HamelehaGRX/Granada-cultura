import { customDateBounds } from './dates';
import { createFilterState } from './reducer';
import type { FilterSelection, FilterState } from './types';
import { isRangeActive } from './utils';

/** Copia los valores editables para que el panel nunca mute el estado aplicado. */
export function filterSelection(state: FilterState): FilterSelection {
  return {
    date: { ...state.date },
    price: { ...state.price },
    distance: { ...state.distance },
    categories: Object.fromEntries(
      Object.entries(state.categories).map(([id, selected]) => [id, [...selected]]),
    ),
  };
}

export function createFilterDraft(state: FilterState): FilterState {
  return { query: state.query, ...filterSelection(state) };
}

/** Limpiar afecta solo al borrador; la búsqueda queda fuera del panel. */
export function clearFilterDraft(state: FilterState): FilterState {
  return { ...createFilterState(), query: state.query };
}

/** Cuenta grupos efectivos, no valores individuales ni la búsqueda. */
export function activeFilterGroupCount(state: FilterState): number {
  const dateActive = state.date.kind === 'preset'
    || (state.date.kind === 'custom' && Boolean(customDateBounds(state.date)));
  return Number(dateActive)
    + Number(isRangeActive(state.price))
    + Number(isRangeActive(state.distance))
    + Number(Object.keys(state.categories).length > 0);
}
