import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { HomeHeader } from '@/features/events/components/HomeHeader';
import { breakpoints, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { useSoonFilters } from '../SoonFilterProvider';
import { SoonSection } from '../components/SoonSection';

export function ExploreScreen() {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const padding = width >= breakpoints.desktop ? spacing.xxl
    : width >= breakpoints.tablet ? spacing.xl : spacing.lg;
  const { rememberScroll, savedScroll } = useSoonFilters();
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
        <SoonSection />
      </View>
    </ScrollView>
  </AppShell>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  scroll: { flexGrow: 1 },
  content: { width: '100%', maxWidth: breakpoints.desktop, alignSelf: 'center',
    paddingTop: spacing.lg, paddingBottom: spacing.xl },
  eyebrow: { ...typography.caption, color: colors.textSecondary, letterSpacing: sizes.contentLetterSpacing },
  heading: { ...typography.display, color: colors.textPrimary, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
});
