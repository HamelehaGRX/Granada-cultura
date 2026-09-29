import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { HomeHeader } from '@/features/events/components/HomeHeader';
import { useEventInteractionsState } from '@/features/events/interactions/EventInteractionProvider';
import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { useExplorePreferences } from '../ExplorePreferencesProvider';
import { useSoonFilters } from '../SoonFilterProvider';
import { rotateCollections, selectCollections } from '../collections';
import { CollectionTile } from '../components/CollectionIdentity';
import { ExploreCarousel } from '../components/ExploreCarousel';
import { GetawayFilterModal } from '../components/GetawayFilterModal';
import { SoonSection } from '../components/SoonSection';
import { DEMO_HABITUAL_RADIUS_KM } from '../getawayFilters';
import { useExploreEvents } from '../hooks/useExploreEvents';
import { useStableExploreSelection } from '../hooks/useStableExploreSelection';
import { assembleExploreEventBlocks, renewDifferent, selectDifferent,
  selectForYou, selectGetawayWithExpansion, selectSoon, previewEvents,
  retainValidExploreSessionIds } from '../selection';

export function ExploreScreen() {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const padding = width >= breakpoints.desktop ? spacing.xxl
    : width >= breakpoints.tablet ? spacing.xl : spacing.lg;
  const { rememberScroll, savedScroll, applied: soonFilters, hydrated: soonHydrated } = useSoonFilters();
  const { maxKm, hydrated: getawayHydrated, applyMaxKm, differentPreviousIds, collectionSessionSeed,
    collectionRotationReady,
    renewDifferentFrom, forYouSessionIds, rememberForYouSession } = useExplorePreferences();
  const { interactions, hydrated: interactionsHydrated } = useEventInteractionsState();
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
  const stableDifferent = useStableExploreSelection(orderedDifferent, candidates, context,
    !loading && !error && interactionsHydrated && soonHydrated,
    differentPreviousIds.join('\u0000'));
  const getaway = useMemo(() => selectGetawayWithExpansion(candidates, context, maxKm),
    [candidates, context, maxKm]);
  const availableCollections = useMemo(() => selectCollections(candidates, context), [candidates, context]);
  const featuredCollections = useMemo(() => rotateCollections(availableCollections, collectionSessionSeed),
    [availableCollections, collectionSessionSeed]);
  const forYou = useMemo(() => selectForYou(candidates, context), [candidates, context]);
  const blocks = useMemo(() => assembleExploreEventBlocks(['soon', 'different', 'getaway',
    'collections', 'forYou'], { soon, different: stableDifferent ?? [], getaway: getaway.selected, forYou }),
  [soon, stableDifferent, getaway, forYou]);
  const soonPreview = blocks.find(block => block.id === 'soon')?.preview;
  const differentPreview = blocks.find(block => block.id === 'different')?.preview ?? [];
  const getawayPreview = blocks.find(block => block.id === 'getaway')?.preview ?? [];
  const liveForYouBlock = blocks.find(block => block.id === 'forYou');
  const liveForYouPreview = forYouSessionIds
    ? retainValidExploreSessionIds(forYouSessionIds.preview, candidates, context)
    : liveForYouBlock?.preview ?? [];
  const forYouPreview = useStableExploreSelection(liveForYouPreview, candidates, context,
    !loading && !error && soonHydrated && getawayHydrated && collectionRotationReady
      && interactionsHydrated && stableDifferent !== null);
  useEffect(() => {
    if (!forYouSessionIds && forYouPreview?.length && liveForYouBlock) {
      rememberForYouSession(forYouPreview.map(item => item.result.event.id),
        liveForYouBlock.more.map(item => item.result.event.id));
    }
  }, [forYouSessionIds, forYouPreview, liveForYouBlock, rememberForYouSession]);
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
          {loading || stableDifferent === null && orderedDifferent.length > 0
            ? <ActivityIndicator accessibilityLabel="Cargando Descubre" />
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
        {!loading && !error && collectionRotationReady && availableCollections.length > 0 ? <View testID="collections-section"
          style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>COLECCIONES</Text>
          <Text style={styles.sectionSubtitle}>¿Por qué no?</Text>
          <Text style={styles.demoNote}>Otras formas de descubrir · selección con datos demo.</Text>
          <View style={styles.collectionGrid}>
            {featuredCollections.map(collection => <View key={collection.id}
              style={{ width: width >= breakpoints.tablet ? '23%' : '47%' }}>
              <CollectionTile collection={collection} onPress={() => router.push({
                pathname: '/explorar/colecciones/[collectionId]', params: { collectionId: collection.id },
              })} />
            </View>)}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Ver todas las colecciones"
            testID="all-collections-link" onPress={() => router.push('/explorar/colecciones')}
            style={({ pressed }) => [styles.allCollectionsLink, pressed && styles.pressed]}>
            <Text style={styles.allCollectionsText}>Ver todas →</Text>
          </Pressable>
        </View> : null}
        {!loading && !error && collectionRotationReady && interactionsHydrated && forYouPreview?.length ? <View
          testID="for-you-section" style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>
            TAMBIÉN PODRÍA INTERESARTE</Text>
          <Text style={styles.sectionSubtitle}>Un poco más cerca de lo tuyo.</Text>
          <Text style={styles.demoNote}>Selección local · radio habitual demo de 30 km desde Granada.</Text>
          <ExploreCarousel kind="forYou" title="También podría interesarte" candidates={forYouPreview}
            categories={categories} now={now} onMore={() => router.push('/explorar/para-ti')} />
        </View> : null}
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
  collectionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  allCollectionsLink: { minHeight: sizes.touchTarget, alignSelf: 'flex-end',
    paddingHorizontal: spacing.sm, justifyContent: 'center', marginTop: spacing.md },
  allCollectionsText: { ...typography.label, color: colors.brandPrimary },
});
