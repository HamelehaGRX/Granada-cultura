import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { HomeHeader } from '@/features/events/components/HomeHeader';
import { useEventInteractions } from '@/features/events/interactions/EventInteractionProvider';
import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { useExplorePreferences } from '../ExplorePreferencesProvider';
import { useSoonFilters } from '../SoonFilterProvider';
import { ExploreCarousel } from '../components/ExploreCarousel';
import { GetawayFilterModal } from '../components/GetawayFilterModal';
import { SoonSection } from '../components/SoonSection';
import { DEMO_HABITUAL_RADIUS_KM } from '../getawayFilters';
import { useExploreEvents } from '../hooks/useExploreEvents';
import { assembleExploreEventBlocks, renewDifferent, selectDifferent,
  selectGetawayWithExpansion, selectSoon, previewEvents } from '../selection';

export function ExploreScreen() {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const padding = width >= breakpoints.desktop ? spacing.xxl
    : width >= breakpoints.tablet ? spacing.xl : spacing.lg;
  const { rememberScroll, savedScroll, applied: soonFilters } = useSoonFilters();
  const { maxKm, hydrated: getawayHydrated, applyMaxKm, differentPreviousIds,
    renewDifferentFrom } = useExplorePreferences();
  const interactions = useEventInteractions();
  const { candidates, categories, loading, error, retry, now } = useExploreEvents();
  const [getawayOpen, setGetawayOpen] = useState(false);
  const context = useMemo(() => ({ now, habitualArea: { radiusKm: DEMO_HABITUAL_RADIUS_KM },
    interactions }), [now, interactions]);
  const soon = useMemo(() => selectSoon(candidates, context, soonFilters.window, soonFilters.price),
    [candidates, context, soonFilters]);
  const different = useMemo(() => selectDifferent(candidates, context), [candidates, context]);
  const orderedDifferent = useMemo(() => differentPreviousIds.length
    ? renewDifferent(different, differentPreviousIds,
      previewEvents(soon).map(item => item.result.event.id)) : different,
  [different, differentPreviousIds, soon]);
  const getaway = useMemo(() => selectGetawayWithExpansion(candidates, context, maxKm),
    [candidates, context, maxKm]);
  const blocks = useMemo(() => assembleExploreEventBlocks(['soon', 'different', 'getaway'],
    { soon, different: orderedDifferent, getaway: getaway.selected }),
  [soon, orderedDifferent, getaway]);
  const soonPreview = blocks.find(block => block.id === 'soon')?.preview;
  const differentPreview = blocks.find(block => block.id === 'different')?.preview ?? [];
  const getawayPreview = blocks.find(block => block.id === 'getaway')?.preview ?? [];
  const scrollRef = useRef<ScrollView>(null);
  const restored = useRef(false);
  const [query, setQuery] = useState('');
  const submitSearch = useCallback((value: string) => {
    if (value.trim()) router.push({ pathname: '/buscar', params: { q: value.trim() } });
  }, []);

  return <AppShell testID="explore-screen">
    <HomeHeader query={query} onQueryChange={setQuery} onSearchSubmit={submitSearch} />
    <ScrollView ref={scrollRef} testID="explore-scroll" keyboardShouldPersistTaps="handled"
      onContentSizeChange={() => {
        if (!restored.current) {
          scrollRef.current?.scrollTo({ y: savedScroll(), animated: false });
          restored.current = true;
        }
      }}
      onScroll={event => { if (restored.current) rememberScroll(event.nativeEvent.contentOffset.y); }}
      scrollEventThrottle={100} contentContainerStyle={styles.scroll}>
      <View style={[styles.content, { paddingHorizontal: padding }]}>
        <Text style={styles.eyebrow}>HAY MUCHO POR DESCUBRIR</Text>
        <Text accessibilityRole="header" aria-level={1} style={styles.heading}>Explorar</Text>
        <Text style={styles.subtitle}>Descubre algo que no estabas buscando.</Text>
        <SoonSection preview={soonPreview} />
        <View testID="different-section" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>DESCUBRE DE OTRA FORMA</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Mostrar otras propuestas de Descubre de otra forma"
              accessibilityHint="Renueva solo este carrusel" testID="different-renew"
              onPress={() => renewDifferentFrom(differentPreview.map(item => item.result.event.id))}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Text accessible={false} style={styles.icon}>↻</Text></Pressable>
          </View>
          <Text style={styles.sectionSubtitle}>Mira la cultura desde otro lado.</Text>
          <Text style={styles.demoNote}>Explorando tu radio habitual · 30 km demo desde Granada</Text>
          {loading ? <ActivityIndicator accessibilityLabel="Cargando Descubre" />
            : error ? <Pressable accessibilityRole="button" onPress={retry}><Text style={styles.message}>
              No hemos podido cargar propuestas. Reintentar</Text></Pressable>
              : differentPreview.length ? <ExploreCarousel kind="different" title="Descubre de otra forma"
                candidates={differentPreview} categories={categories} now={now}
                onMore={() => router.push('/explorar/descubre')} />
                : <Text style={styles.message}>No hay propuestas diferentes en este radio.</Text>}
        </View>
        <View testID="getaway-section" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>ESCÁPATE UN POCO</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`Filtrar Escápate: de ${DEMO_HABITUAL_RADIUS_KM} a ${maxKm} kilómetros`}
              testID="getaway-trigger" onPress={() => setGetawayOpen(true)} style={({ pressed }) =>
                [styles.chip, pressed && styles.pressed]}>
              <Text style={styles.chipText}>{DEMO_HABITUAL_RADIUS_KM}–{maxKm} km ▾</Text>
            </Pressable>
          </View>
          <Text style={styles.sectionSubtitle}>Puede que merezca el viaje.</Text>
          <Text style={styles.demoNote}>Distancias y trayectos de ejemplo desde Granada.</Text>
          {getaway.expanded ? <Text testID="getaway-expanded" style={styles.notice}>
            Radio ampliado a {getaway.effectiveMaxKm} km por falta de propuestas cercanas.</Text> : null}
          {loading || !getawayHydrated ? <ActivityIndicator accessibilityLabel="Cargando Escápate" />
            : error ? <Pressable accessibilityRole="button" onPress={retry}><Text style={styles.message}>
              No hemos podido cargar propuestas. Reintentar</Text></Pressable>
              : getawayPreview.length ? <ExploreCarousel kind="getaway" title="Escápate un poco"
                candidates={getawayPreview} categories={categories} now={now}
                onMore={() => router.push('/explorar/escapate')} />
                : <Text style={styles.message}>No hay propuestas en este radio.</Text>}
        </View>
      </View>
    </ScrollView>
    <GetawayFilterModal visible={getawayOpen} appliedMaxKm={maxKm}
      onApply={value => applyMaxKm(value)} onDismiss={() => setGetawayOpen(false)} />
  </AppShell>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  scroll: { flexGrow: 1 },
  content: { width: '100%', maxWidth: breakpoints.desktop, alignSelf: 'center',
    paddingTop: spacing.lg, paddingBottom: spacing.xl },
  eyebrow: { ...typography.caption, color: colors.textSecondary, letterSpacing: sizes.contentLetterSpacing },
  heading: { ...typography.display, color: colors.textPrimary, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  section: { marginTop: spacing.xl, paddingBottom: spacing.xxl },
  sectionHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center',
    justifyContent: 'space-between', gap: spacing.sm },
  sectionTitle: { ...typography.heading, fontSize: 18, lineHeight: 24,
    color: colors.brandPrimary, flexShrink: 1 },
  sectionSubtitle: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs },
  demoNote: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm,
    marginBottom: spacing.lg },
  iconButton: { width: sizes.touchTarget, height: sizes.touchTarget, alignItems: 'center',
    justifyContent: 'center', borderRadius: radii.pill, borderWidth: 1, borderColor: colors.borderStrong },
  icon: { ...typography.title, color: colors.brandPrimary },
  chip: { minHeight: sizes.touchTarget, paddingHorizontal: spacing.md, alignItems: 'center',
    justifyContent: 'center', borderRadius: radii.pill, borderWidth: 1,
    borderColor: colors.borderStrong, backgroundColor: colors.surface },
  chipText: { ...typography.label, color: colors.brandPrimary },
  pressed: { backgroundColor: colors.surfaceMuted },
  message: { ...typography.body, color: colors.textPrimary, marginVertical: spacing.md },
  notice: { ...typography.bodySmall, color: colors.warning, marginBottom: spacing.md },
});
