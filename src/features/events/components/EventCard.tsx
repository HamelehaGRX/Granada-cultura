import { Image, StyleSheet, Text, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';

import { colors, radii, sizes, spacing, typography } from '@/theme';
import { formatDemoDistance, formatEventDate, formatEventPrice } from '../presentation';
import type { EventResult } from '../types';

type EventCardProps = {
  result: EventResult;
  categoryLabel: string;
  index?: number;
  /** Asset resuelto por el consumidor; no se resuelven rutas ni claves aquí. */
  illustration?: ImageSourcePropType;
};

const borders = [colors.cardBorderCream, colors.borderStrong, colors.cardBorderRose] as const;

export function EventCard({ result, categoryLabel, index = 0, illustration }: EventCardProps) {
  const { event, distanceMeters } = result;
  const { fontScale } = useWindowDimensions();
  const distance = formatDemoDistance(distanceMeters);
  const illustrationStyle = [styles.illustration, fontScale > sizes.twoColumnMaxFontScale && styles.compactIllustration];

  return (
    <View testID={`event-card-${event.id}`} style={[styles.card, { borderColor: borders[index % borders.length] }]}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={illustrationStyle}>
        {illustration ? (
          <Image accessible={false} source={illustration} resizeMode="contain" style={styles.image} />
        ) : (
          <View style={styles.placeholderMark} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{categoryLabel}</Text>
        <Text accessibilityRole="header" aria-level={3} style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{formatEventDate(event)}</Text>
        <Text style={styles.place}>{event.location.venueName} · {event.location.locality}</Text>
        <View style={styles.bottom}>
          {distance ? <Text style={styles.distance}>{distance}</Text> : null}
          <Text style={styles.price}>{formatEventPrice(event.price)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md,
    borderWidth: 1, borderRadius: radii.large, backgroundColor: colors.surface,
    width: '100%', flex: 1, minWidth: 0,
  },
  illustration: {
    width: sizes.eventIllustration, height: sizes.eventIllustration, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center', borderRadius: radii.medium, backgroundColor: colors.background,
  },
  compactIllustration: { width: sizes.eventIllustrationCompact, height: sizes.eventIllustrationCompact },
  image: { width: '100%', height: '100%' },
  placeholderMark: {
    width: sizes.placeholderMark, height: sizes.placeholderMark,
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radii.small,
  },
  info: { flex: 1, minWidth: 0 },
  category: { ...typography.caption, color: colors.brandPrimary, marginBottom: spacing.xs },
  title: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  date: { ...typography.bodySmall, color: colors.textPrimary },
  place: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  bottom: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  distance: { ...typography.caption, color: colors.textSecondary },
  price: { ...typography.label, color: colors.brandPrimary, marginLeft: 'auto', flexShrink: 1 },
});
