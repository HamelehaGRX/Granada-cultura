import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@/theme';

export function SearchField({ value, onChange, onClose }: {
  value: string; onChange: (value: string) => void; onClose: () => void;
}) {
  const input = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  useEffect(() => { input.current?.focus(); }, []);
  return <TextInput ref={input} autoFocus testID="event-search" accessibilityLabel="Buscar eventos"
    placeholder="Artista, lugar, plan…" placeholderTextColor={colors.textSecondary}
    value={value} onChangeText={onChange} autoCorrect={false} returnKeyType="search"
    onKeyPress={event => { if (event.nativeEvent.key === 'Escape') onClose(); }}
    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    style={[styles.input, focused && styles.focused]} />;
}
const styles = StyleSheet.create({
  input: { ...typography.body, flex: 1, minWidth: 0, minHeight: sizes.touchTarget, paddingHorizontal: spacing.sm,
    borderWidth: 2, borderColor: colors.borderStrong, borderRadius: radii.medium,
    color: colors.textPrimary, backgroundColor: colors.surface },
  focused: { borderColor: colors.textPrimary },
});
