import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@/theme';
import { RANGE_LIMIT } from '../reducer';
import type { NumericRange } from '../types';
import { DualRangeSlider } from './DualRangeSlider';

type Props = { label: string; unit: string; value: NumericRange; onChange: (edge: 'min' | 'max', value: number) => void };
type EndpointProps = { filterLabel: string; edgeLabel: string; unit: string; value: number;
  minimumValue: number; maximumValue: number; onChange: (value: number) => void };

function StepperButton({ label, symbol, side, onPress, onFocusChange }: { label: string; symbol: string;
  side: 'left' | 'right'; onPress: () => void; onFocusChange: (focused: boolean) => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
    onFocus={() => onFocusChange(true)} onBlur={() => onFocusChange(false)}
    style={({ pressed }) => [styles.stepButton, side === 'left' ? styles.stepLeft : styles.stepRight,
      pressed && styles.stepPressed]}>
    <Text accessible={false} style={styles.stepSymbol}>{symbol}</Text>
  </Pressable>;
}

function RangeEndpoint({ filterLabel, edgeLabel, unit, value, minimumValue, maximumValue, onChange }: EndpointProps) {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => setDraft(String(value)), [value]);
  const spokenEdgeLabel = filterLabel === 'Distancia'
    ? edgeLabel === 'Mínimo' ? 'mínima' : 'máxima'
    : edgeLabel.toLocaleLowerCase('es');
  const accessibilityLabel = `${filterLabel} ${spokenEdgeLabel}`;
  const clamp = (next: number) => Math.min(maximumValue, Math.max(minimumValue, next));
  const edit = (text: string) => {
    if (!/^\d*$/.test(text)) return;
    if (!text) { setDraft(''); return; }
    const parsed = Number(text);
    if (!Number.isFinite(parsed)) return;
    const next = clamp(parsed);
    setDraft(String(next));
    onChange(next);
  };
  return <View style={styles.endpoint}>
    <Text style={styles.label}>{edgeLabel}</Text>
    <View style={[styles.stepper, focused && styles.focused]}>
      <StepperButton label={`Reducir ${accessibilityLabel.toLocaleLowerCase('es')}`} symbol="−" side="left"
        onPress={() => onChange(clamp(value - 1))} onFocusChange={setFocused} />
      <View style={styles.valueCell}>
        <TextInput accessibilityLabel={accessibilityLabel}
          accessibilityHint={`Valor entre ${minimumValue} y ${maximumValue} ${unit}.`}
          keyboardType="number-pad" inputMode="numeric" value={draft} onChangeText={edit} selectTextOnFocus
          onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); setDraft(String(value)); }}
          style={styles.input} />
        <Text accessible={false} style={styles.unit}>{unit}</Text>
      </View>
      <StepperButton label={`Aumentar ${accessibilityLabel.toLocaleLowerCase('es')}`} symbol="+" side="right"
        onPress={() => onChange(clamp(value + 1))} onFocusChange={setFocused} />
    </View>
  </View>;
}

/** Frontera sustituible por un slider dual: valores controlados y callback por extremo. */
export function RangeFilter({ label, unit, value, onChange }: Props) {
  return <View style={styles.stack}>
    <Text style={styles.note}>Desliza los tiradores o escribe un valor exacto entre 0 y 1.000 {unit}.</Text>
    <DualRangeSlider label={label} unit={unit} value={value} minimumValue={0} maximumValue={RANGE_LIMIT}
      step={1} onChange={onChange} />
    <View style={styles.endpoints}>
      <RangeEndpoint filterLabel={label} edgeLabel="Mínimo" unit={unit} value={value.min}
        minimumValue={0} maximumValue={value.max} onChange={next => onChange('min', next)} />
      <RangeEndpoint filterLabel={label} edgeLabel="Máximo" unit={unit} value={value.max}
        minimumValue={value.min} maximumValue={RANGE_LIMIT} onChange={next => onChange('max', next)} />
    </View>
    <Text accessibilityLiveRegion="polite" aria-live="polite" style={styles.note}>{value.min} {unit} — {value.max} {unit}</Text>
  </View>;
}
const styles = StyleSheet.create({
  stack: { gap: spacing.md }, endpoints: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  endpoint: { flex: 1, minWidth: sizes.rangeEndpointMinWidth, gap: spacing.sm },
  label: { ...typography.label, color: colors.textPrimary },
  stepper: { flexDirection: 'row', minHeight: sizes.touchTarget, borderWidth: 2, borderColor: colors.borderStrong,
    borderRadius: radii.small, overflow: 'hidden', backgroundColor: colors.surface },
  stepButton: { width: sizes.touchTarget, minHeight: sizes.touchTarget, alignItems: 'center', justifyContent: 'center' },
  stepLeft: { borderRightWidth: 1, borderRightColor: colors.border },
  stepRight: { borderLeftWidth: 1, borderLeftColor: colors.border },
  stepPressed: { backgroundColor: colors.background },
  stepSymbol: { ...typography.title, color: colors.brandPrimary },
  valueCell: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xs },
  input: { ...typography.caption, color: colors.textPrimary, minWidth: 0, flex: 1, minHeight: sizes.touchTarget,
    padding: 0, textAlign: 'right', backgroundColor: colors.surface },
  unit: { ...typography.caption, color: colors.textSecondary, paddingLeft: spacing.xs },
  focused: { borderColor: colors.brandPrimary }, note: { ...typography.caption, color: colors.textSecondary },
});
