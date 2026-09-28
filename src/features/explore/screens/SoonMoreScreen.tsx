import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { EventCard } from '@/features/events/components/EventCard';
import { eventCategoryLabel } from '@/features/events/presentation';
import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { useSoonFilters } from '../SoonFilterProvider';
import { SoonFilterModal } from '../components/SoonFilterModal';
import { SoonFilterTrigger } from '../components/SoonFilterTrigger';
import { useSoonEvents } from '../hooks/useSoonEvents';
import { groupSoonEvents, soonCardDate, soonResultState, type SoonDayGroup } from '../presentation';

export function SoonMoreScreen() {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const padding = width >= breakpoints.desktop ? spacing.xxl
    : width >= breakpoints.tablet ? spacing.xl : spacing.lg;
  const { applied, hydrated, apply } = useSoonFilters();
  const { selected, categories, loading, error, retry, now } = useSoonEvents(applied);
  const [filterOpen, setFilterOpen] = useState(false);
  const { available, soldOut } = groupSoonEvents(selected, now);
  const state = soonResultState(selected.length);
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/explorar');
  const renderGroups = (groups: SoonDayGroup[], prefix: string) => groups.map(group => <View
    key={`${prefix}-${group.key}`} style={styles.group}>
    <Text accessibilityRole="header" aria-level={2} style={styles.day}>{group.heading}</Text>
    {group.events.map(candidate => <View key={candidate.result.event.id} style={styles.card}>
      <EventCard result={candidate.result}
        categoryLabel={eventCategoryLabel(candidate.result.event, categories)}
        illustrationKey={candidate.result.event.illustrationKey}
        dateHighlight={soonCardDate(candidate.result.event, now)} showSoldOut
        onOpen={() => router.push({ pathname: '/eventos/[eventId]',
          params: { eventId: candidate.result.event.id } })} />
    </View>)}
  </View>);

  return <AppShell testID="soon-more-screen">
    <ScrollView testID="soon-more-scroll" keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
      <View style={[styles.content, { paddingHorizontal: padding }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver a Explorar" onPress={goBack}
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}>
          <Text style={styles.backText}>← Volver a Explorar</Text>
        </Pressable>
        <Text accessibilityRole="header" aria-level={1} style={styles.title}>Ocurre pronto</Text>
        <Text style={styles.subtitle}>Todas las propuestas del periodo elegido.</Text>
        <View style={styles.filterRow}>
          <SoonFilterTrigger filters={applied} onPress={() => setFilterOpen(true)} />
          {!loading && !error && hydrated ? <Text accessibilityLiveRegion="polite" aria-live="polite"
            style={styles.count}>{selected.length} {selected.length === 1 ? 'evento' : 'eventos'}</Text> : null}
        </View>
        <Text style={styles.demoNote}>Zona demo: 30 km desde Granada · distancias de ejemplo.</Text>
        {loading || !hydrated ? <ActivityIndicator accessibilityLabel="Cargando eventos" />
          : error ? <View style={styles.message}><Text style={styles.messageText}>No hemos podido cargar las propuestas.</Text>
            <Pressable accessibilityRole="button" onPress={retry} style={styles.action}>
              <Text style={styles.actionText}>Reintentar</Text></Pressable></View>
            : <>
              {state === 'empty' ? <Text testID="soon-more-empty" style={styles.messageText}>
                No hemos encontrado eventos para este periodo.</Text> : null}
              {state === 'few' ? <Text style={styles.messageText}>
                {applied.window === '7days' ? 'Hay pocas propuestas esta semana.'
                  : 'Hay pocas propuestas en este periodo.'}</Text> : null}
              {(state === 'empty' || state === 'few') && applied.window !== '14days'
                ? <Pressable accessibilityRole="button" onPress={() => apply({ ...applied, window: '14days' })}
                  style={styles.action}><Text style={styles.actionText}>Ver próximos 14 días →</Text></Pressable> : null}
              {renderGroups(available, 'available')}
              {soldOut.length > 0 ? <View style={styles.soldOutSection}>
                <Text accessibilityRole="header" aria-level={2} style={styles.soldOutTitle}>AGOTADOS</Text>
                {renderGroups(soldOut, 'sold-out')}
              </View> : null}
            </>}
      </View>
    </ScrollView>
    <SoonFilterModal visible={filterOpen} applied={applied} onApply={apply} onDismiss={() => setFilterOpen(false)} />
  </AppShell>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  scroll: { flexGrow: 1 },
  content: { width: '100%', maxWidth: sizes.readingMaxWidth, alignSelf: 'center',
    paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  back: { minHeight: sizes.touchTarget, alignSelf: 'flex-start', justifyContent: 'center',
    paddingHorizontal: spacing.sm, borderRadius: radii.small },
  backPressed: { backgroundColor: colors.surfaceMuted },
  backText: { ...typography.label, color: colors.brandPrimary },
  title: { ...typography.display, color: colors.textPrimary, marginTop: spacing.md },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md,
    marginTop: spacing.lg },
  count: { ...typography.caption, color: colors.textSecondary },
  demoNote: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  group: { marginTop: spacing.xl },
  day: { ...typography.heading, color: colors.brandPrimary, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  soldOutSection: { borderTopWidth: 1, borderTopColor: colors.borderStrong, marginTop: spacing.xl },
  soldOutTitle: { ...typography.heading, color: colors.warning, marginTop: spacing.xl },
  message: { paddingTop: spacing.lg },
  messageText: { ...typography.body, color: colors.textPrimary, marginTop: spacing.lg },
  action: { minHeight: sizes.touchTarget, alignSelf: 'flex-start', justifyContent: 'center' },
  actionText: { ...typography.label, color: colors.brandPrimary, textDecorationLine: 'underline' },
});
