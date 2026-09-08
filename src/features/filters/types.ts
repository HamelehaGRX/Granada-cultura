export type DatePreset = 'today' | 'tomorrow' | 'week' | 'weekend' | 'month';
export type DateFilterValue =
  | { kind: 'any' }
  | { kind: 'preset'; preset: DatePreset }
  | { kind: 'custom'; mode: 'single' | 'range'; start: string; end: string };
export type NumericRange = { min: number; max: number };
/** Una entrada vacía incluye toda la categoría; ausencia de entradas no restringe. */
export type CategorySelection = Record<string, string[]>;
export type FilterState = {
  query: string;
  date: DateFilterValue;
  price: NumericRange;
  distance: NumericRange;
  categories: CategorySelection;
};
export type FilterPanel = 'date' | 'price' | 'distance' | 'categories';
export type FilterAction =
  | { type: 'query'; value: string }
  | { type: 'date'; value: DateFilterValue }
  | { type: 'range'; kind: 'price' | 'distance'; edge: 'min' | 'max'; value: number }
  | { type: 'category'; id: string }
  | { type: 'subcategory'; categoryId: string; id: string }
  | { type: 'clear' };
