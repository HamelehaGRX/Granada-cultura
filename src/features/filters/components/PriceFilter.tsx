import type { Dispatch } from 'react';
import type { FilterAction, NumericRange } from '../types';
import { RangeFilter } from './RangeFilter';

export function PriceFilter({ value, dispatch }: { value: NumericRange; dispatch: Dispatch<FilterAction> }) {
  return <RangeFilter label="Precio" unit="€" value={value}
    onChange={(edge, next) => dispatch({ type: 'range', kind: 'price', edge, value: next })} />;
}
