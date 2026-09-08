import type { Dispatch } from 'react';
import type { FilterAction, NumericRange } from '../types';
import { RangeFilter } from './RangeFilter';

export function DistanceFilter({ value, dispatch }: { value: NumericRange; dispatch: Dispatch<FilterAction> }) {
  return <RangeFilter label="Distancia" unit="km" value={value}
    onChange={(edge, next) => dispatch({ type: 'range', kind: 'distance', edge, value: next })} />;
}
