import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';

function HeaderAction({ label, glyph, onPress, selected, disabled = false }: {
  label: string; glyph: string; onPress: () => void; selected?: boolean; disabled?: boolean;
}) {
  const styles = useThemeStyles(createStyles);
  const [focused, setFocused] = useState(false);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ selected, disabled }} disabled={disabled}
      onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={({ pressed }) => [styles.action, selected && styles.selected,
        pressed && styles.pressed, focused && styles.focused]}>
      <Text style={[styles.glyph, selected && styles.selectedGlyph]}>{glyph}</Text>
    </Pressable>
  );
}

export function EventDetailHeader({ favorite, hydrated, onBack, onFavorite, onShare }: {
  favorite: boolean; hydrated: boolean; onBack: () => void; onFavorite: () => void; onShare: () => void;
}) {
  const styles = useThemeStyles(createStyles);
  return (
    <View style={styles.header} testID="event-detail-header">
      <View style={styles.content}>
        <HeaderAction label="Volver" glyph="‹" onPress={onBack} />
        <View style={styles.spacer} />
        <HeaderAction disabled={!hydrated}
          label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          glyph={favorite ? '♥' : '♡'} selected={favorite} onPress={onFavorite} />
        <HeaderAction label="Compartir evento" glyph="↗" onPress={onShare} />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    backgroundColor: colors.brandSurface,
    borderBottomColor: colors.brandSurfacePressed,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    width: '100%', maxWidth: breakpoints.desktop, minHeight: 60, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  spacer: { flex: 1 },
  action: {
    width: sizes.touchTarget, height: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderRadius: radii.pill, borderWidth: 2, borderColor: 'transparent', backgroundColor: 'transparent',
  },
  selected: { borderColor: colors.textInverse, backgroundColor: colors.brandSurfacePressed },
  pressed: { backgroundColor: colors.brandSurfacePressed },
  focused: { borderColor: colors.textInverse },
  glyph: { ...typography.heading, color: colors.textInverse, lineHeight: 28 },
  selectedGlyph: { color: colors.textInverse },
});
