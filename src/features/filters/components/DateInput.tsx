import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@/theme';

export type DateInputProps = { label: string; value: string; onChange: (value: string) => void; invalid: boolean };
/** Entrada temporal universal; web utiliza el selector de fecha del navegador. */
export function DateInput({ label, value, onChange, invalid }: DateInputProps) {
  const [focused, setFocused] = useState(false);
  return <View style={styles.group}>
    <Text style={styles.label}>{label}</Text>
    <TextInput accessibilityLabel={`${label}, formato AAAA-MM-DD`} aria-invalid={invalid}
      placeholder="AAAA-MM-DD" placeholderTextColor={colors.textSecondary} value={value} onChangeText={onChange}
      autoCapitalize="none" autoCorrect={false} maxLength={10}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={[styles.input, focused && styles.focused]} />
  </View>;
}
const styles = StyleSheet.create({
  group: { gap: spacing.xs }, label: { ...typography.label, color: colors.textPrimary },
  input: { ...typography.body, color: colors.textPrimary, minHeight: sizes.touchTarget, padding: spacing.sm,
    borderWidth: 2, borderColor: colors.borderStrong, borderRadius: radii.small, backgroundColor: colors.surface },
  focused: { borderColor: colors.brandPrimary },
});
