import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { radii, sizes, spacing, typography, useAppTheme, useThemeStyles, type ThemeColors } from '@/theme';
import { useEventInteraction } from '../interactions/EventInteractionProvider';
import { EventIllustration } from '../illustrations/EventIllustration';
import { formatDemoDistance, formatEventDate, formatEventPrice } from '../presentation';
import type { EventResult } from '../types';

type EventCardProps = {
  result: EventResult;
  categoryLabel: string;
  illustrationKey?: string;
  onOpen: () => void;
  dateHighlight?: string;
  showSoldOut?: boolean;
};

export function EventCard({ result, categoryLabel, illustrationKey, onOpen,
  dateHighlight, showSoldOut = false }: EventCardProps) {
  const { categoryAppearanceFor } = useAppTheme();
  const styles = useThemeStyles(createStyles);
  const { event, distanceMeters } = result;
  const appearance = categoryAppearanceFor(event.categoryId);
  const { fontScale } = useWindowDimensions();
  const distance = formatDemoDistance(distanceMeters);
  const [cardFocused, setCardFocused] = useState(false);
  const [favoriteFocused, setFavoriteFocused] = useState(false);
  const { hydrated, interaction, toggleFavorite } = useEventInteraction(event.id);

  return (
    <View testID={`event-card-${event.id}`} style={[styles.card,
      { borderColor: appearance.primary }, cardFocused && styles.cardFocused]}>
      <View style={[styles.categoryHeader, { backgroundColor: appearance.soft }]}>
        <Text numberOfLines={1} ellipsizeMode="tail"
          style={[styles.category, { color: appearance.primary }]}>{categoryLabel}</Text>
        <View style={styles.cardActions}>
          {interaction.attendance === 'interested'
            ? <Text accessibilityLabel="Marcado como Me interesa" style={styles.interested}>✦</Text> : null}
          {interaction.attendance === 'going'
            ? <Text accessibilityLabel="Marcado como Voy a ir" style={styles.going}>▣✓</Text> : null}
          <Pressable accessibilityRole="button"
            accessibilityLabel={interaction.favorite ? `Quitar ${event.title} de favoritos` : `Añadir ${event.title} a favoritos`}
            accessibilityState={{ selected: interaction.favorite, disabled: !hydrated }}
            disabled={!hydrated} hitSlop={spacing.xs} onPress={toggleFavorite}
            onFocus={() => setFavoriteFocused(true)} onBlur={() => setFavoriteFocused(false)}
            style={({ pressed }) => [styles.favorite, pressed && styles.favoritePressed,
              favoriteFocused && { borderColor: appearance.primary }]}>
            <Text style={[styles.favoriteIcon, interaction.favorite && styles.favoriteIconActive]}>
              {interaction.favorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${event.title}`}
        accessibilityHint="Abre el detalle del evento" onPress={onOpen}
        onFocus={() => setCardFocused(true)} onBlur={() => setCardFocused(false)}
        style={({ pressed }) => [styles.main, pressed && styles.mainPressed]}>
        <EventIllustration illustrationKey={illustrationKey} compact={fontScale > sizes.twoColumnMaxFontScale} />
        <View style={styles.info}>
          <Text accessibilityRole="header" aria-level={3} style={styles.title}>{event.title}</Text>
          <Text style={[styles.date, dateHighlight && styles.dateHighlight]}>{dateHighlight ?? formatEventDate(event)}</Text>
          {dateHighlight ? <Text style={styles.dateSecondary}>{formatEventDate(event)}</Text> : null}
          <Text style={styles.place}>{event.location.venueName} · {event.location.locality}</Text>
          {showSoldOut && (event.status === 'soldOut' || event.ticketing?.statuses.includes('soldOut'))
            ? <Text style={styles.soldOut}>Agotado</Text> : null}
          <View style={styles.bottom}>
            {distance ? <Text style={styles.distance}>{distance}</Text> : null}
            <Text style={styles.price}>{formatEventPrice(event.price)}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    borderWidth: 1, borderRadius: radii.large, backgroundColor: colors.surface,
    width: '100%', flex: 1, minWidth: 0, overflow: 'hidden',
  },
  cardFocused: { borderColor: colors.brandPrimary, borderWidth: 2 },
  categoryHeader: {
    minHeight: sizes.touchTarget, flexDirection: 'row', alignItems: 'center',
    paddingLeft: spacing.md, paddingRight: spacing.xs,
  },
  category: { ...typography.label, flex: 1, minWidth: 0 },
  cardActions: { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  main: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, minHeight: sizes.touchTarget },
  mainPressed: { backgroundColor: colors.surfaceElevated },
  info: { flex: 1, minWidth: 0 },
  title: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  date: { ...typography.bodySmall, color: colors.textPrimary },
  dateHighlight: { ...typography.label, color: colors.brandPrimary, fontWeight: '700' },
  dateSecondary: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  place: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  soldOut: { ...typography.label, color: colors.warning, marginTop: spacing.xs },
  bottom: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  distance: { ...typography.caption, color: colors.textSecondary },
  interested: { ...typography.heading, width: 32, color: colors.interestIndicator, textAlign: 'center', fontWeight: '800' },
  going: { ...typography.label, width: 36, color: colors.attending, textAlign: 'center', fontWeight: '700' },
  price: { ...typography.label, color: colors.brandPrimary, marginLeft: 'auto', flexShrink: 1 },
  favorite: {
    width: sizes.touchTarget, height: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent', borderRadius: radii.small, backgroundColor: 'transparent',
  },
  favoritePressed: { opacity: 0.64 },
  favoriteIcon: { ...typography.heading, color: colors.textPrimary },
  favoriteIconActive: { color: colors.favorite },
});
