import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@/theme';

type Props = { label: string; selected?: boolean; onPress: () => void; testID?: string };
export function FilterChoice({ label, selected, onPress, testID }: Props) {
  const [focused, setFocused] = useState(false);
  return <Pressable accessibilityRole={selected === undefined ? 'button' : 'checkbox'}
    accessibilityLabel={label} aria-checked={selected}
    accessibilityState={selected === undefined ? undefined : { checked: selected }} testID={testID}
    onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={({ pressed }) => [styles.button, selected && styles.selected, focused && styles.focused, pressed && styles.pressed]}>
    <Text style={[styles.label, focused && styles.focusedLabel]}>{selected ? '✓ ' : ''}{label}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  button: { minHeight: sizes.touchTarget, minWidth: sizes.touchTarget, padding: spacing.sm,
    justifyContent: 'center', borderRadius: radii.medium, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface },
  selected: { borderColor: colors.brandPrimary, backgroundColor: colors.background },
  focused: { borderColor: colors.textPrimary },
  pressed: { backgroundColor: colors.background },
  label: { ...typography.bodySmall, color: colors.textPrimary, flexShrink: 1 },
  focusedLabel: { textDecorationLine: 'underline' },
});
