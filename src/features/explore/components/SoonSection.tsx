import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { useSoonFilters } from '../SoonFilterProvider';
import { useSoonEvents } from '../hooks/useSoonEvents';
import { soonResultState } from '../presentation';
import { SoonCarousel } from './SoonCarousel';
import { SoonFilterModal } from './SoonFilterModal';
import { SoonFilterTrigger } from './SoonFilterTrigger';
import type { ExploreCandidate } from '../types';

export function SoonSection({ preview }: { preview?: readonly ExploreCandidate[] }) {
  const styles = useThemeStyles(createStyles);
  const { applied, hydrated, apply } = useSoonFilters();
  const { selected, categories, loading, error, retry, now } = useSoonEvents(applied);
  const [filterOpen, setFilterOpen] = useState(false);
  const state = soonResultState(selected.length);
  const canExpand = applied.window !== '14days';

  return <View testID="soon-section" style={styles.section}>
    <View style={styles.headingRow}>
      <Text accessibilityRole="header" aria-level={2} style={styles.title}>OCURRE PRONTO</Text>
      <SoonFilterTrigger filters={applied} onPress={() => setFilterOpen(true)} />
    </View>
    <Text style={styles.subtitle}>¡Que no se te escapen!</Text>
    <Text style={styles.demoNote}>Zona demo: 30 km desde Granada · distancias de ejemplo.</Text>
    {loading || !hydrated ? <ActivityIndicator testID="soon-loading" accessibilityLabel="Cargando eventos" />
      : error ? <View style={styles.message}><Text style={styles.messageText}>No hemos podido cargar las propuestas.</Text>
        <Pressable accessibilityRole="button" onPress={retry} style={styles.action}>
          <Text style={styles.actionText}>Reintentar</Text></Pressable></View>
        : <>
          {state === 'empty' ? <View testID="soon-empty" style={styles.message}>
            <Text style={styles.messageText}>No hemos encontrado eventos para {applied.window === 'today'
              ? 'hoy' : `los próximos ${applied.window === '3days' ? 3 : applied.window === '14days' ? 14 : 7} días`}.</Text>
          </View> : <>
            {state === 'few' ? <Text testID="soon-few" style={styles.few}>
              {applied.window === '7days' ? 'Hay pocas propuestas esta semana.'
                : 'Hay pocas propuestas en este periodo.'}</Text> : null}
            <SoonCarousel candidates={preview ?? selected} categories={categories} now={now}
              onMore={() => router.push('/explorar/ocurre-pronto')} />
          </>}
          {(state === 'empty' || state === 'few') && canExpand
            ? <Pressable accessibilityRole="button" testID="soon-expand-14"
              onPress={() => apply({ ...applied, window: '14days' })} style={styles.action}>
              <Text style={styles.actionText}>Ver próximos 14 días →</Text>
            </Pressable> : null}
        </>}
    <SoonFilterModal visible={filterOpen} applied={applied} onApply={apply} onDismiss={() => setFilterOpen(false)} />
  </View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  section: { marginTop: spacing.xl, paddingBottom: spacing.xxl },
  headingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center',
    justifyContent: 'space-between' },
  title: { ...typography.heading, color: colors.brandPrimary, flexShrink: 1 },
  subtitle: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs },
  demoNote: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm,
    marginBottom: spacing.lg },
  message: { paddingVertical: spacing.lg },
  messageText: { ...typography.body, color: colors.textPrimary },
  few: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  action: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center', marginTop: spacing.sm },
  actionText: { ...typography.label, color: colors.brandPrimary, textDecorationLine: 'underline' },
});
