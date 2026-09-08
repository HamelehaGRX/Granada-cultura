import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, sizes, spacing, typography } from '@/theme';
import { FilterChoice } from '../../filters/components/FilterChoice';

export function EventListLoading() {
  return (
    <View aria-live="polite" aria-busy={true} testID="events-loading" style={styles.panel}>
      <ActivityIndicator size="small" color={colors.brandPrimary} accessible={false} />
      <Text style={styles.body}>Preparando tus planes…</Text>
    </View>
  );
}

export function EventListEmpty({ filtered, onClear }: { filtered?: boolean; onClear?: () => void }) {
  return (
    <View accessibilityLiveRegion="polite" aria-live="polite" testID="events-empty" style={styles.panel}>
      <View accessible={false} style={styles.illustrationSpace} />
      <Text accessibilityRole="header" aria-level={3} style={styles.title}>
        {filtered ? 'No encontramos eventos con estos filtros.' : 'Todavía no hay encuentros'}
      </Text>
      <Text style={styles.body}>{filtered ? 'Prueba otra combinación para descubrir más planes.' : 'Cuando haya eventos disponibles, los encontrarás aquí.'}</Text>
      {filtered && onClear ? <FilterChoice label="Limpiar filtros" onPress={onClear} /> : null}
    </View>
  );
}

export function EventListError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <View testID="events-error" style={styles.panel}>
      <Text accessibilityRole="alert" style={styles.body}>{message}</Text>
      <Pressable accessibilityRole="button" accessibilityHint="Intenta cargar de nuevo los eventos"
        onPress={onRetry} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed, focused && styles.focused]}>
        <Text style={[styles.buttonLabel, focused && styles.focusedLabel]}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center', gap: spacing.md, padding: spacing.lg,
    backgroundColor: colors.surface, borderRadius: radii.large,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong,
  },
  illustrationSpace: { width: sizes.placeholderMark, height: sizes.placeholderMark, borderRadius: radii.pill, backgroundColor: colors.background },
  title: { ...typography.body, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  body: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  button: {
    minHeight: sizes.touchTarget, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    justifyContent: 'center', borderRadius: radii.medium, backgroundColor: colors.brandPrimary,
    borderWidth: 2, borderColor: colors.brandPrimary,
  },
  pressed: { backgroundColor: colors.brandPrimaryPressed },
  focused: { borderColor: colors.textPrimary },
  buttonLabel: { ...typography.label, color: colors.textInverse },
  focusedLabel: { textDecorationLine: 'underline' },
});
