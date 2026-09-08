import type { FilterAction, FilterState } from './types';

export const RANGE_LIMIT = 1000;
export function createFilterState(): FilterState {
  return { query: '', date: { kind: 'any' }, price: { min: 0, max: RANGE_LIMIT },
    distance: { min: 0, max: RANGE_LIMIT }, categories: {} };
}

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'clear': return createFilterState();
    case 'query': return { ...state, query: action.value };
    case 'date': return { ...state, date: action.value };
    case 'range': {
      if (!Number.isFinite(action.value)) return state;
      const value = Math.min(RANGE_LIMIT, Math.max(0, Math.round(action.value)));
      const range = { ...state[action.kind], [action.edge]: value };
      if (range.min > range.max) range[action.edge === 'min' ? 'max' : 'min'] = value;
      return { ...state, [action.kind]: range };
    }
    case 'category': {
      const categories = { ...state.categories };
      if (Object.hasOwn(categories, action.id)) delete categories[action.id];
      else categories[action.id] = [];
      return { ...state, categories };
    }
    case 'subcategory': {
      if (!Object.hasOwn(state.categories, action.categoryId)) return state;
      const selected = state.categories[action.categoryId];
      return { ...state, categories: { ...state.categories, [action.categoryId]: selected.includes(action.id)
        ? selected.filter(id => id !== action.id) : [...selected, action.id] } };
    }
  }
}
