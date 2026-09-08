import type { Dispatch } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { customDateBounds, DATE_PRESETS } from '../dates';
import type { DateFilterValue, FilterAction } from '../types';
import { DateInput } from './DateInput';
import { FilterChoice } from './FilterChoice';

export function DateFilter({ value, dispatch }: { value: DateFilterValue; dispatch: Dispatch<FilterAction> }) {
  const setDate = (date: DateFilterValue) => dispatch({ type: 'date', value: date });
  const valid = Boolean(customDateBounds(value));
  return <View style={styles.stack}>
    <View style={styles.choices}>
      <FilterChoice label="Cualquier fecha" selected={value.kind === 'any'} onPress={() => setDate({ kind: 'any' })} />
      {DATE_PRESETS.map(preset => <FilterChoice key={preset.value} label={preset.label}
        selected={value.kind === 'preset' && value.preset === preset.value}
        onPress={() => setDate({ kind: 'preset', preset: preset.value })} />)}
      <FilterChoice label="Fecha personalizada" selected={value.kind === 'custom'}
        onPress={() => setDate({ kind: 'custom', mode: 'single', start: '', end: '' })} />
    </View>
    {value.kind === 'custom' ? <View style={styles.stack}>
      <View style={styles.choices}>
        <FilterChoice label="Día concreto" selected={value.mode === 'single'} onPress={() => setDate({ ...value, mode: 'single', end: '' })} />
        <FilterChoice label="Rango desde/hasta" selected={value.mode === 'range'} onPress={() => setDate({ ...value, mode: 'range' })} />
      </View>
      <DateInput label={value.mode === 'single' ? 'Fecha concreta' : 'Desde'} value={value.start}
        invalid={Boolean(value.start) && !valid} onChange={start => setDate({ ...value, start })} />
      {value.mode === 'range' ? <DateInput label="Hasta" value={value.end}
        invalid={Boolean(value.end) && !valid} onChange={end => setDate({ ...value, end })} /> : null}
      <Text accessibilityLiveRegion="polite" aria-live="polite" style={styles.note}>{valid ? 'Fecha personalizada aplicada.'
        : 'Completa fechas válidas y ordenadas. Hasta entonces no se aplica el filtro de fecha.'}</Text>
      <FilterChoice label="Limpiar fecha" onPress={() => setDate({ kind: 'any' })} />
    </View> : null}
  </View>;
}
const styles = StyleSheet.create({
  stack: { gap: spacing.md }, choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  note: { ...typography.caption, color: colors.textSecondary },
});
