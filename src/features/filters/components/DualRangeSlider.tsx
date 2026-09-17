import { RangeSlider } from '@react-native-assets/slider';
import { StyleSheet, Text, View } from 'react-native';
import { radii, sizes, spacing, typography, useAppTheme, useThemeStyles, type ThemeColors } from '@/theme';
import type { NumericRange } from '../types';

type RangeEdge = 'min' | 'max';
type Props = {
  label: string;
  unit: string;
  value: NumericRange;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onChange: (edge: RangeEdge, value: number) => void;
};

const VISIBLE_THUMB_SIZE = 28;
const TRACK_HEIGHT = 6;

/** Aísla la dependencia visual; reducer, persistencia y unidades conservan sus contratos. */
export function DualRangeSlider({ label, unit, value, minimumValue, maximumValue, step, onChange }: Props) {
  const { colors } = useAppTheme();
  const styles = useThemeStyles(createStyles);
  const handleValueChange = ([minimum, maximum]: [number, number]) => {
    if (minimum !== value.min) {
      onChange('min', minimum);
      return;
    }
    if (maximum !== value.max) onChange('max', maximum);
  };

  return <View style={styles.stack}>
    <View style={styles.bounds}>
      <Text style={styles.bound}>{minimumValue} {unit}</Text>
      <Text style={styles.bound}>{maximumValue} {unit}</Text>
    </View>
    <RangeSlider
      testID={`dual-range-${label.toLocaleLowerCase('es')}`}
      range={[value.min, value.max]}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      minimumRange={0}
      step={step}
      crossingAllowed={false}
      slideOnTap
      trackHeight={TRACK_HEIGHT}
      thumbSize={sizes.touchTarget}
      outboundColor={colors.borderStrong}
      inboundColor={colors.brandPrimary}
      thumbTintColor={colors.surfaceElevated}
      thumbStyle={styles.thumb}
      style={styles.slider}
      onValueChange={handleValueChange}
    />
  </View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  stack: { gap: spacing.xs },
  bounds: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  bound: { ...typography.caption, color: colors.textSecondary },
  slider: { width: '100%', minHeight: sizes.touchTarget },
  thumb: {
    width: VISIBLE_THUMB_SIZE,
    height: VISIBLE_THUMB_SIZE,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: colors.brandPrimary,
  },
});
