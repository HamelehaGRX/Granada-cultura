import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View,
  useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { EventCard } from '@/features/events/components/EventCard';
import { useEventInteractionsState } from '@/features/events/interactions/EventInteractionProvider';
import { eventCategoryLabel } from '@/features/events/presentation';
import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { useExplorePreferences } from '../ExplorePreferencesProvider';
import { useSoonFilters } from '../SoonFilterProvider';
import { DEMO_HABITUAL_RADIUS_KM } from '../getawayFilters';
import { useExploreEvents } from '../hooks/useExploreEvents';
import { assembleExploreEventBlocks, previewEvents, renewDifferent, selectDifferent,
  selectForYou, selectGetawayWithExpansion, selectSoon } from '../selection';
import type { ExploreCandidate } from '../types';

export function ForYouMoreScreen() {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const padding = width >= breakpoints.desktop ? spacing.xxl
    : width >= breakpoints.tablet ? spacing.xl : spacing.lg;
  const { interactions, hydrated: interactionsHydrated } = useEventInteractionsState();
  const { applied: soonFilters, hydrated: soonHydrated } = useSoonFilters();
  const { maxKm, hydrated: getawayHydrated, differentPreviousIds } = useExplorePreferences();
  const { candidates, categories, loading, error, retry, now } = useExploreEvents();
  const context = useMemo(() => ({ now, habitualArea: { radiusKm: DEMO_HABITUAL_RADIUS_KM },
    interactions }), [now, interactions]);
  const selected = useMemo(() => {
    const soon = selectSoon(candidates, context, soonFilters.window, soonFilters.price);
    const different = selectDifferent(candidates, context);
    const orderedDifferent = differentPreviousIds.length
      ? renewDifferent(different, differentPreviousIds,
        previewEvents(soon).map(item => item.result.event.id)) : different;
    const getaway = selectGetawayWithExpansion(candidates, context, maxKm).selected;
    const forYou = selectForYou(candidates, context);
    return assembleExploreEventBlocks(['soon', 'different', 'getaway', 'collections', 'forYou'],
      { soon, different: orderedDifferent, getaway, forYou })
      .find(block => block.id === 'forYou')?.more ?? [];
  }, [candidates, context, soonFilters, differentPreviousIds, maxKm]);
  const ready = !loading && interactionsHydrated && soonHydrated && getawayHydrated;
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/explorar');
  const renderEvent = ({ item }: { item: ExploreCandidate }) => <View style={styles.card}>
    <EventCard result={item.result} categoryLabel={eventCategoryLabel(item.result.event, categories)}
      illustrationKey={item.result.event.illustrationKey} showSoldOut
      onOpen={() => router.push({ pathname: '/eventos/[eventId]',
        params: { eventId: item.result.event.id } })} />
  </View>;

  return <AppShell testID="for-you-more-screen">
    <FlatList data={ready && !error ? selected : []} keyExtractor={item => item.result.event.id}
      renderItem={renderEvent} initialNumToRender={8} windowSize={5}
      keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content,
        { paddingHorizontal: padding }]}
      ListHeaderComponent={<View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver a Explorar"
          onPress={goBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Text style={styles.backText}>← Volver a Explorar</Text>
        </Pressable>
        <Text accessibilityRole="header" aria-level={1} style={styles.title}>
          También podría interesarte</Text>
        <Text style={styles.subtitle}>Un poco más cerca de lo tuyo.</Text>
        <Text style={styles.demoNote}>Selección local · radio habitual demo de 30 km desde Granada.</Text>
        {!ready ? <ActivityIndicator accessibilityLabel="Cargando propuestas" />
          : error ? <Pressable accessibilityRole="button" accessibilityLabel="Reintentar cargar propuestas"
            onPress={retry} style={styles.action}>
            <Text style={styles.message}>No hemos podido cargar propuestas. Reintentar</Text>
          </Pressable>
            : selected.length === 0 ? <Text style={styles.message}>No hay propuestas disponibles para esta selección.</Text>
              : <Text accessibilityLiveRegion="polite" style={styles.count}>
                {selected.length} {selected.length === 1 ? 'evento' : 'eventos'}</Text>}
      </View>} />
  </AppShell>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  content: { width: '100%', maxWidth: sizes.readingMaxWidth, alignSelf: 'center',
    paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  header: { gap: spacing.md, marginBottom: spacing.lg },
  back: { minHeight: sizes.touchTarget, alignSelf: 'flex-start', justifyContent: 'center',
    paddingHorizontal: spacing.sm, borderRadius: radii.small },
  pressed: { backgroundColor: colors.surfaceMuted },
  backText: { ...typography.label, color: colors.brandPrimary },
  title: { ...typography.display, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  demoNote: { ...typography.caption, color: colors.textSecondary },
  action: { minHeight: sizes.touchTarget, justifyContent: 'center' },
  message: { ...typography.body, color: colors.textPrimary },
  count: { ...typography.caption, color: colors.textSecondary },
  card: { marginBottom: spacing.md },
});
