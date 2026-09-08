import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@/theme';
import type { FilterPanel } from '../types';

type Props = { id: FilterPanel; label: string; summary: string; expanded: boolean; onPress: () => void };
export function FilterTrigger({ id, label, summary, expanded, onPress }: Props) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole="button" accessibilityState={{ expanded }} aria-expanded={expanded}
    accessibilityLabel={`${label}${summary ? `: ${summary}` : ''}`} aria-controls={expanded ? `filter-panel-${id}` : undefined}
    testID={`filter-trigger-${id}`} onPress={onPress}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.trigger, expanded && styles.expanded, focused && styles.focused, pressed && styles.pressed]}>
    <Text style={[styles.label, focused && styles.focusedLabel]}>{label}{expanded ? ' ▴' : ''}</Text>
    {summary ? <Text numberOfLines={1} style={styles.summary}>{summary}</Text> : null}
  </Pressable>;
}
const styles = StyleSheet.create({
  trigger: { minHeight: sizes.touchTarget, padding: spacing.sm, alignItems: 'center', justifyContent: 'center',
    borderRadius: radii.medium, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, gap: spacing.xs },
  expanded: { borderColor: colors.brandPrimary }, focused: { borderColor: colors.textPrimary },
  pressed: { backgroundColor: colors.background },
  label: { ...typography.label, color: colors.textPrimary, textAlign: 'center' },
  summary: { ...typography.caption, color: colors.textSecondary, maxWidth: '100%' },
  focusedLabel: { textDecorationLine: 'underline' },
});
