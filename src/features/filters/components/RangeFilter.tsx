import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@/theme';
import { RANGE_LIMIT } from '../reducer';
import type { NumericRange } from '../types';
import { FilterChoice } from './FilterChoice';

type Props = { label: string; unit: string; value: NumericRange; onChange: (edge: 'min' | 'max', value: number) => void };
function RangeEndpoint({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => setDraft(String(value)), [value]);
  const edit = (text: string) => {
    if (!/^\d*$/.test(text)) return;
    if (!text) { setDraft(''); return; }
    const next = Math.min(RANGE_LIMIT, Number(text));
    setDraft(String(next));
    onChange(next);
  };
  return <View style={styles.endpoint}>
    <Text style={styles.label}>{label}</Text>
    <TextInput accessibilityLabel={label} accessibilityHint="De 0 a 1000. El otro extremo acompaña si se cruza."
      keyboardType="number-pad" inputMode="numeric" value={draft} onChangeText={edit} selectTextOnFocus
      onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); setDraft(String(value)); }}
      style={[styles.input, focused && styles.focused]} />
    <View style={styles.steps}>
      <FilterChoice label={`−1 ${label}`} onPress={() => onChange(Math.max(0, value - 1))} />
      <FilterChoice label={`+1 ${label}`} onPress={() => onChange(Math.min(RANGE_LIMIT, value + 1))} />
    </View>
  </View>;
}

/** Frontera sustituible por un slider dual: valores controlados y callback por extremo. */
export function RangeFilter({ label, unit, value, onChange }: Props) {
  return <View style={styles.stack}>
    <Text style={styles.note}>De 0 a 1.000 {unit}. Escribe un valor o ajústalo con los botones.</Text>
    <View style={styles.endpoints}>
      <RangeEndpoint label={`${label} mínimo (${unit})`} value={value.min} onChange={next => onChange('min', next)} />
      <RangeEndpoint label={`${label} máximo (${unit})`} value={value.max} onChange={next => onChange('max', next)} />
    </View>
    <Text accessibilityLiveRegion="polite" aria-live="polite" style={styles.note}>{value.min} {unit} — {value.max} {unit}</Text>
  </View>;
}
const styles = StyleSheet.create({
  stack: { gap: spacing.md }, endpoints: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  endpoint: { flex: 1, minWidth: sizes.rangeEndpointMinWidth, gap: spacing.sm },
  steps: { gap: spacing.xs }, label: { ...typography.label, color: colors.textPrimary },
  input: { ...typography.body, color: colors.textPrimary, minHeight: sizes.touchTarget, minWidth: 0,
    borderWidth: 2, borderColor: colors.borderStrong, borderRadius: radii.small, padding: spacing.sm, backgroundColor: colors.surface },
  focused: { borderColor: colors.brandPrimary }, note: { ...typography.caption, color: colors.textSecondary },
});
