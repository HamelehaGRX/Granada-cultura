import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View,
  useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { EventCard } from '@/features/events/components/EventCard';
import { eventCategoryLabel } from '@/features/events/presentation';
import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { COLLECTIONS, type CollectionId } from '../collections';
import { CollectionHeading } from '../components/CollectionIdentity';
import { useExploreCollections } from '../hooks/useExploreCollections';
import type { ExploreCandidate } from '../types';

export function CollectionDetailScreen({ collectionId }: { collectionId: string }) {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const padding = width >= breakpoints.desktop ? spacing.xxl
    : width >= breakpoints.tablet ? spacing.xl : spacing.lg;
  const { collections, categories, loading, error, retry } = useExploreCollections();
  const definition = COLLECTIONS.find(item => item.id === collectionId);
  const collection = collections.find(item => item.id === collectionId);
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/explorar/colecciones');
  const renderEvent = ({ item }: { item: ExploreCandidate }) => <View style={styles.card}>
    <EventCard result={item.result} categoryLabel={eventCategoryLabel(item.result.event, categories)}
      illustrationKey={item.result.event.illustrationKey} showSoldOut
      onOpen={() => router.push({ pathname: '/eventos/[eventId]',
        params: { eventId: item.result.event.id } })} />
  </View>;

  return <AppShell testID={`collection-detail-${collectionId}`}>
    <FlatList data={collection?.events ?? []} keyExtractor={item => item.result.event.id}
      renderItem={renderEvent} initialNumToRender={8} windowSize={5}
      keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content,
        { paddingHorizontal: padding }]}
      ListHeaderComponent={<View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver a Colecciones"
          onPress={goBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Text style={styles.backText}>← Colecciones</Text>
        </Pressable>
        {definition ? <CollectionHeading collection={definition} level={1} />
          : <Text accessibilityRole="header" aria-level={1} style={styles.title}>Colección desconocida</Text>}
        <Text style={styles.demoNote}>Selección con datos demo · radio habitual de 30 km desde Granada.</Text>
        {loading ? <ActivityIndicator accessibilityLabel="Cargando colección" />
          : error ? <Pressable accessibilityRole="button" accessibilityLabel="Reintentar cargar colección"
            onPress={retry} style={styles.action}>
            <Text style={styles.message}>No hemos podido cargar la colección. Reintentar</Text>
          </Pressable>
            : !collection ? <Text style={styles.message}>Esta colección todavía no tiene propuestas disponibles.</Text>
              : <Text accessibilityLiveRegion="polite" style={styles.count}>
                {collection.events.length} {collection.events.length === 1 ? 'evento' : 'eventos'}</Text>}
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
  title: { ...typography.title, color: colors.textPrimary },
  demoNote: { ...typography.caption, color: colors.textSecondary },
  action: { minHeight: sizes.touchTarget, justifyContent: 'center' },
  message: { ...typography.body, color: colors.textPrimary },
  count: { ...typography.caption, color: colors.textSecondary },
  card: { marginBottom: spacing.md },
});
