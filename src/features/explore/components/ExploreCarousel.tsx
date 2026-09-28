import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { EventCard } from '@/features/events/components/EventCard';
import { eventCategoryLabel } from '@/features/events/presentation';
import type { Category } from '@/features/categories/types';
import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { soonCardDate, travelLabel } from '../presentation';
import { previewEvents } from '../selection';
import type { ExploreCandidate } from '../types';

export function ExploreCarousel({ candidates, categories, now, onMore, kind, title }: {
  candidates: readonly ExploreCandidate[]; categories: Category[]; now: Date; onMore: () => void;
  kind: 'soon' | 'different' | 'getaway'; title: string;
}) {
  const styles = useThemeStyles(createStyles);
  const { width, fontScale } = useWindowDimensions();
  const [availableWidth, setAvailableWidth] = useState(0);
  const measure = availableWidth || Math.max(240, width - spacing.lg * 2);
  const columns = width >= breakpoints.desktop ? 3.4 : width >= breakpoints.tablet ? 2.25 : 1.13;
  const cardWidth = Math.max(220, Math.floor((measure - spacing.md * (Math.ceil(columns) - 1)) / columns));
  const items = previewEvents(candidates);

  return <View testID={`${kind}-carousel`} onLayout={event => setAvailableWidth(event.nativeEvent.layout.width)}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled"
      accessibilityLabel={`Eventos de ${title}; desliza para ver más`}
      contentContainerStyle={styles.track} style={styles.scroller}>
      {items.map(candidate => <View key={candidate.result.event.id} style={{ width: cardWidth }}>
        <EventCard result={candidate.result} categoryLabel={eventCategoryLabel(candidate.result.event, categories)}
          illustrationKey={candidate.result.event.illustrationKey}
          dateHighlight={kind === 'soon' ? soonCardDate(candidate.result.event, now) : undefined}
          distanceDetail={kind === 'getaway' ? travelLabel(candidate.travel) : undefined} showSoldOut
          onOpen={() => router.push({ pathname: '/eventos/[eventId]',
            params: { eventId: candidate.result.event.id } })} />
      </View>)}
      <Pressable accessibilityRole="button" accessibilityLabel={`Ver todos los eventos de ${title}`}
        testID={`${kind}-more-tile`} onPress={onMore}
        style={({ pressed }) => [styles.more, { width: cardWidth }, pressed && styles.morePressed]}>
        <Text style={styles.moreArrow}>→</Text>
        <Text style={styles.moreTitle}>VER MÁS</Text>
        <Text style={styles.moreCaption}>Todas las propuestas de este bloque</Text>
      </Pressable>
    </ScrollView>
    {fontScale > sizes.twoColumnMaxFontScale ? null : <Text style={styles.hint}>Desliza para descubrir más →</Text>}
  </View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  scroller: { width: '100%' },
  track: { gap: spacing.md, paddingRight: spacing.lg, alignItems: 'stretch' },
  more: { minHeight: 190, borderRadius: radii.large, borderWidth: 1, borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceMuted, padding: spacing.lg, justifyContent: 'center', alignItems: 'flex-start' },
  morePressed: { backgroundColor: colors.surfaceElevated },
  moreArrow: { ...typography.display, color: colors.brandPrimary },
  moreTitle: { ...typography.heading, color: colors.brandPrimary, marginTop: spacing.sm },
  moreCaption: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  hint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
});
