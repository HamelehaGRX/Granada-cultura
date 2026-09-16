import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '@/theme';

type Props = {
  activeCount: number;
  onOpen: () => void;
};

/** Único elemento de filtros que permanece en el flujo de Home. */
export function FilterBar({ activeCount, onOpen }: Props) {
  const [focused, setFocused] = useState(false);
  const status = activeCount === 0
    ? 'Ningún grupo de filtros activo'
    : `${activeCount} ${activeCount === 1 ? 'grupo activo' : 'grupos activos'}`;
  return <View testID="filter-bar" style={styles.container}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Abrir filtros. ${status}.`}
      accessibilityHint="Abre un panel sin cambiar los resultados hasta que guardes."
      testID="open-filters" onPress={onOpen} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={({ pressed }) => [styles.button, focused && styles.focused, pressed && styles.pressed]}>
      <Text accessible={false} style={styles.gear}>⚙</Text>
      <Text style={styles.title}>¿Qué te apetece hoy?</Text>
      {activeCount > 0 ? <View accessible={false} testID="filter-badge" style={styles.badge}>
        <Text style={styles.badgeText}>{activeCount}</Text>
      </View> : null}
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.lg, alignItems: 'center' },
  button: {
    minWidth: 250,
    maxWidth: '100%',
    minHeight: sizes.touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  pressed: { backgroundColor: colors.background, borderColor: colors.brandPrimary },
  focused: { borderWidth: 2, borderColor: colors.textPrimary },
  gear: { ...typography.body, color: colors.brandPrimary },
  title: { ...typography.label, color: colors.textPrimary, textAlign: 'center', flexShrink: 1 },
  badge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.brandPrimary,
  },
  badgeText: { ...typography.caption, color: colors.textInverse, fontWeight: '700' },
});
