import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View,
  useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { breakpoints, radii, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { CollectionHeading } from '../components/CollectionIdentity';
import { ExploreCarousel } from '../components/ExploreCarousel';
import { useExploreCollections } from '../hooks/useExploreCollections';

export function AllCollectionsScreen() {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const padding = width >= breakpoints.desktop ? spacing.xxl
    : width >= breakpoints.tablet ? spacing.xl : spacing.lg;
  const { collections, categories, now, loading, error, retry } = useExploreCollections();
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/explorar');

  return <AppShell testID="all-collections-screen">
    <ScrollView testID="all-collections-scroll" keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scroll}>
      <View style={[styles.content, { paddingHorizontal: padding }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver a Explorar"
          onPress={goBack} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Text style={styles.backText}>← Colecciones</Text>
        </Pressable>
        <Text accessibilityRole="header" aria-level={1} style={styles.title}>Todas las colecciones</Text>
        <Text style={styles.subtitle}>12 formas de descubrir cultura de otra manera.</Text>
        <Text style={styles.demoNote}>Radio demo: 30 km · solo colecciones con propuestas.</Text>
        {loading ? <ActivityIndicator accessibilityLabel="Cargando colecciones" style={styles.status} />
          : error ? <Pressable accessibilityRole="button" accessibilityLabel="Reintentar cargar colecciones"
            onPress={retry} style={styles.status}>
            <Text style={styles.message}>No hemos podido cargar las colecciones. Reintentar</Text>
          </Pressable>
            : collections.length === 0 ? <Text style={styles.message}>Aún no hay colecciones disponibles.</Text>
              : collections.map(collection => <View key={collection.id}
                testID={`collection-section-${collection.id}`}
                style={[styles.section, width < breakpoints.tablet && styles.mobileSection]}>
                <CollectionHeading collection={collection} />
                <ExploreCarousel kind="collection" carouselId={`collection-${collection.id}`}
                  title={collection.title} candidates={collection.events} categories={categories} now={now}
                  onMore={() => router.push({ pathname: '/explorar/colecciones/[collectionId]',
                    params: { collectionId: collection.id } })} />
              </View>)}
      </View>
    </ScrollView>
  </AppShell>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  scroll: { flexGrow: 1 },
  content: { width: '100%', maxWidth: breakpoints.desktop, alignSelf: 'center',
    paddingTop: spacing.sm, paddingBottom: spacing.xxl },
  back: { minHeight: sizes.touchTarget, alignSelf: 'flex-start', justifyContent: 'center',
    paddingHorizontal: spacing.sm, borderRadius: radii.small },
  pressed: { backgroundColor: colors.surfaceMuted },
  backText: { ...typography.label, color: colors.brandPrimary },
  title: { ...typography.title, color: colors.textPrimary, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textPrimary, marginTop: spacing.xs },
  demoNote: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  section: { marginTop: spacing.lg, gap: spacing.xs },
  mobileSection: { marginTop: spacing.sm },
  status: { marginTop: spacing.xl, minHeight: sizes.touchTarget, justifyContent: 'center' },
  message: { ...typography.body, color: colors.textPrimary },
});
