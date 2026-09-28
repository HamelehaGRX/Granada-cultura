import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { soonFilterSummary, type SoonFilters } from '../soonFilters';

export function SoonFilterTrigger({ filters, onPress }: { filters: SoonFilters; onPress: () => void }) {
  const styles = useThemeStyles(createStyles);
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={`Filtrar Ocurre pronto: ${soonFilterSummary(filters)}`}
    testID="soon-filter-trigger" onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.trigger, focused && styles.focused, pressed && styles.pressed]}>
    <Text numberOfLines={1} style={styles.label}>{soonFilterSummary(filters)}  ▾</Text>
  </Pressable>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  trigger: { minHeight: sizes.touchTarget, minWidth: 146, paddingHorizontal: spacing.md,
    alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong },
  label: { ...typography.label, color: colors.brandPrimary },
  focused: { borderWidth: 2, borderColor: colors.textPrimary },
  pressed: { backgroundColor: colors.surfaceMuted },
});
