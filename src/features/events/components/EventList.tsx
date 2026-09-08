import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { breakpoints, colors, sizes, spacing, typography } from '@/theme';
import type { Category } from '../../categories/types';
import { eventCategoryLabel } from '../presentation';
import type { EventResult } from '../types';
import { EventCard } from './EventCard';
import { EventListEmpty, EventListError, EventListLoading } from './EventListStates';

type EventListProps = {
  data: EventResult[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
};

export function EventList({ data, categories, loading, error, onRetry }: EventListProps) {
  const { width, fontScale } = useWindowDimensions();
  const columns = width >= breakpoints.tablet && fontScale <= sizes.twoColumnMaxFontScale ? 2 : 1;
  const empty = loading ? <EventListLoading /> : error
    ? <EventListError message={error} onRetry={onRetry} /> : <EventListEmpty />;

  return (
    <FlatList
      // React Native requiere remontar la lista al cambiar numColumns.
      key={columns}
      testID="event-list"
      data={loading || error ? [] : data}
      keyExtractor={item => item.event.id}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.content}
      style={styles.list}
      initialNumToRender={8}
      ListHeaderComponent={
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>TU MOMENTO, TU CULTURA</Text>
          <Text accessibilityRole="header" aria-level={1} style={styles.heading}>Inicio.</Text>
          <Text style={styles.territory}>Granada y alrededores</Text>
          <View style={styles.section}>
            <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Próximos encuentros</Text>
            {!loading && !error ? <Text accessibilityLiveRegion="polite" style={styles.count}>
              {data.length} {data.length === 1 ? 'plan' : 'planes'}
            </Text> : null}
          </View>
          <Text style={styles.note}>Eventos ficticios · Distancias de ejemplo, sin geolocalización.</Text>
        </View>
      }
      renderItem={({ item, index }) => (
        <View style={[styles.cell, columns > 1 && styles.twoColumnCell]}>
          <EventCard result={item} index={index} categoryLabel={eventCategoryLabel(item.event, categories)} />
        </View>
      )}
      ListEmptyComponent={empty}
      ListFooterComponent={!loading && !error && data.length > 0
        ? <Text style={styles.footer}>Una pequeña muestra de lo que está por venir.</Text> : null}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  content: { paddingBottom: spacing.md },
  intro: { marginBottom: spacing.lg },
  eyebrow: { ...typography.caption, color: colors.textSecondary, letterSpacing: sizes.contentLetterSpacing },
  heading: { ...typography.display, color: colors.textPrimary, marginTop: spacing.xs },
  territory: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  section: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.xl },
  sectionTitle: { ...typography.heading, color: colors.textPrimary, flexShrink: 1 },
  count: { ...typography.caption, color: colors.textSecondary, marginLeft: 'auto' },
  note: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  row: { gap: spacing.md },
  cell: { flex: 1, minWidth: 0, marginBottom: spacing.md },
  twoColumnCell: { maxWidth: '50%' },
  footer: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.md },
});
