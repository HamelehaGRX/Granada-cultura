import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, sizes, spacing, typography } from '@/theme';
import type { EventInteraction } from '../interactions/types';

type ActionKind = 'favorite' | 'interested' | 'going';

const activeStyle = {
  favorite: { borderColor: colors.brandPrimary, backgroundColor: colors.errorSurface, color: colors.brandPrimary },
  interested: { borderColor: colors.warning, backgroundColor: colors.warningSurface, color: colors.warning },
  going: { borderColor: colors.success, backgroundColor: colors.successSurface, color: colors.success },
} as const;

function PersonalAction({ active, disabled, glyph, kind, label, onPress }: {
  active: boolean; disabled: boolean; glyph: string; kind: ActionKind; label: string; onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const palette = activeStyle[kind];
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }} disabled={disabled}
      onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={({ pressed }) => [styles.action, active && { borderColor: palette.borderColor,
        backgroundColor: palette.backgroundColor, borderWidth: 2 },
      pressed && styles.pressed, focused && styles.focused]}>
      <Text style={[styles.glyph, active && { color: palette.color }]}>{glyph}</Text>
      <Text style={[styles.label, active && { color: palette.color }]}>{label}</Text>
    </Pressable>
  );
}

export function EventPersonalActions({ hydrated, interaction, onFavorite, onInterested, onGoing }: {
  hydrated: boolean; interaction: EventInteraction; onFavorite: () => void;
  onInterested: () => void; onGoing: () => void;
}) {
  return (
    <View accessibilityLabel="Acciones personales del evento" style={styles.group}>
      <PersonalAction active={interaction.favorite} disabled={!hydrated}
        glyph={interaction.favorite ? '♥' : '♡'} kind="favorite" label="Favorito" onPress={onFavorite} />
      <PersonalAction active={interaction.attendance === 'interested'} disabled={!hydrated}
        glyph={interaction.attendance === 'interested' ? '✦' : '✧'} kind="interested"
        label="Me interesa" onPress={onInterested} />
      <PersonalAction active={interaction.attendance === 'going'} disabled={!hydrated}
        glyph={interaction.attendance === 'going' ? '▣✓' : '▣'} kind="going"
        label="Voy a ir" onPress={onGoing} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  action: {
    flexGrow: 1, flexBasis: 120, minHeight: sizes.touchTarget, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radii.medium, backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.72 },
  focused: { borderColor: colors.brandPrimary, borderWidth: 3 },
  glyph: { ...typography.body, color: colors.textSecondary, fontWeight: '700' },
  label: { ...typography.label, color: colors.textPrimary },
});
