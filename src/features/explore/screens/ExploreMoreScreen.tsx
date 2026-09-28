import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { EventCard } from '@/features/events/components/EventCard';
import { useEventInteractions } from '@/features/events/interactions/EventInteractionProvider';
import { eventCategoryLabel } from '@/features/events/presentation';
import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { useExplorePreferences } from '../ExplorePreferencesProvider';
import { useSoonFilters } from '../SoonFilterProvider';
import { GetawayFilterModal } from '../components/GetawayFilterModal';
import { DEMO_HABITUAL_RADIUS_KM } from '../getawayFilters';
import { useExploreEvents } from '../hooks/useExploreEvents';
import { groupSoonEvents, travelLabel } from '../presentation';
import { previewEvents, renewDifferent, selectDifferent, selectGetawayWithExpansion,
  selectSoon } from '../selection';
import type { ExploreCandidate, GetawayWindow } from '../types';

export function ExploreMoreScreen({ kind }: { kind: 'different' | 'getaway' }) {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const padding = width >= breakpoints.desktop ? spacing.xxl
    : width >= breakpoints.tablet ? spacing.xl : spacing.lg;
  const { maxKm, hydrated, applyMaxKm, differentPreviousIds } = useExplorePreferences();
  const { applied: soonFilters } = useSoonFilters();
  const interactions = useEventInteractions();
  const { candidates, categories, loading, error, retry, now } = useExploreEvents();
  const [window, setWindow] = useState<GetawayWindow>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const context = useMemo(() => ({ now, habitualArea: { radiusKm: DEMO_HABITUAL_RADIUS_KM },
    interactions }), [now, interactions]);
  const different = useMemo(() => {
    const selection = selectDifferent(candidates, context);
    const excluded = previewEvents(selectSoon(candidates, context, soonFilters.window, soonFilters.price))
      .map(item => item.result.event.id);
    return differentPreviousIds.length ? renewDifferent(selection, differentPreviousIds, excluded) : selection;
  }, [candidates, context, differentPreviousIds, soonFilters]);
  const getaway = useMemo(() => selectGetawayWithExpansion(candidates, context, maxKm, window),
    [candidates, context, maxKm, window]);
  const selected = kind === 'different' ? different : getaway.selected;
  const grouped = kind === 'getaway' ? groupSoonEvents(selected, now) : null;
  const title = kind === 'different' ? 'Descubre de otra forma' : 'Escápate un poco';
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/explorar');
  const cards = (items: readonly ExploreCandidate[]) => items.map(candidate =>
    <View key={candidate.result.event.id} style={styles.card}>
      <EventCard result={candidate.result} categoryLabel={eventCategoryLabel(candidate.result.event, categories)}
        illustrationKey={candidate.result.event.illustrationKey} showSoldOut
        distanceDetail={kind === 'getaway' ? travelLabel(candidate.travel) : undefined}
        onOpen={() => router.push({ pathname: '/eventos/[eventId]',
          params: { eventId: candidate.result.event.id } })} />
    </View>);

  return <AppShell testID={`${kind}-more-screen`}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
      <View style={[styles.content, { paddingHorizontal: padding }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver a Explorar" onPress={goBack}
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}>
          <Text style={styles.backText}>← Volver a Explorar</Text>
        </Pressable>
        <Text accessibilityRole="header" aria-level={1} style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{kind === 'different' ? 'Mira la cultura desde otro lado.'
          : 'Puede que merezca el viaje.'}</Text>
        {kind === 'getaway' ? <Pressable accessibilityRole="button"
          accessibilityLabel={`Filtrar distancia y fecha de Escápate: ${DEMO_HABITUAL_RADIUS_KM} a ${maxKm} kilómetros`}
          testID="getaway-more-trigger" onPress={() => setFilterOpen(true)} style={styles.chip}>
          <Text style={styles.chipText}>{DEMO_HABITUAL_RADIUS_KM}–{maxKm} km · ¿Cuándo? ▾</Text>
        </Pressable> : null}
        <Text style={styles.demoNote}>{kind === 'different'
          ? 'Radio habitual demo: 30 km desde Granada.'
          : 'Distancias y tiempos de coche ficticios desde Granada.'}</Text>
        {kind === 'getaway' && getaway.expanded ? <Text testID="getaway-more-expanded" style={styles.notice}>
          Radio ampliado a {getaway.effectiveMaxKm} km por falta de propuestas cercanas.</Text> : null}
        {loading || !hydrated ? <ActivityIndicator accessibilityLabel="Cargando eventos" />
          : error ? <Pressable accessibilityRole="button" onPress={retry}>
            <Text style={styles.message}>No hemos podido cargar propuestas. Reintentar</Text></Pressable>
            : selected.length === 0 ? <Text style={styles.message}>No hay propuestas para estos criterios.</Text>
              : <>
                <Text accessibilityLiveRegion="polite" aria-live="polite" style={styles.count}>
                  {selected.length} {selected.length === 1 ? 'evento' : 'eventos'}</Text>
                {grouped ? <>
                  {grouped.available.map(group => <View key={group.key} style={styles.group}>
                    <Text accessibilityRole="header" aria-level={2} style={styles.day}>{group.heading}</Text>
                    {cards(group.events)}
                  </View>)}
                  {grouped.soldOut.length ? <View style={styles.group}>
                    <Text accessibilityRole="header" aria-level={2} style={styles.day}>AGOTADOS</Text>
                    {grouped.soldOut.map(group => <View key={group.key} style={styles.group}>
                      <Text accessibilityRole="header" aria-level={3} style={styles.day}>{group.heading}</Text>
                      {cards(group.events)}
                    </View>)}
                  </View> : null}
                </> : cards(selected)}
              </>}
      </View>
    </ScrollView>
    {kind === 'getaway' ? <GetawayFilterModal visible={filterOpen} appliedMaxKm={maxKm}
      appliedWindow={window} showWhen onApply={(value, nextWindow) => {
        applyMaxKm(value); setWindow(nextWindow);
      }} onDismiss={() => setFilterOpen(false)} /> : null}
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
  chip: { minHeight: sizes.touchTarget, alignSelf: 'flex-start', paddingHorizontal: spacing.md,
    justifyContent: 'center', marginTop: spacing.lg, borderRadius: radii.pill,
    borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surface },
  chipText: { ...typography.label, color: colors.brandPrimary },
  demoNote: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.md },
  notice: { ...typography.bodySmall, color: colors.warning, marginTop: spacing.md },
  count: { ...typography.caption, color: colors.textSecondary, marginVertical: spacing.lg },
  group: { marginTop: spacing.lg },
  day: { ...typography.heading, color: colors.brandPrimary, marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  message: { ...typography.body, color: colors.textPrimary, marginTop: spacing.lg },
});
