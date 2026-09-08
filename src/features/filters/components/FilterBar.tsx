import type { Dispatch } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { breakpoints, colors, radii, sizes, spacing, typography } from '@/theme';
import type { Category } from '../../categories/types';
import type { FilterAction, FilterPanel, FilterState } from '../types';
import { ActiveFilterSummary } from './ActiveFilterSummary';
import { CategoryFilter } from './CategoryFilter';
import { DateFilter } from './DateFilter';
import { DistanceFilter } from './DistanceFilter';
import { FilterTrigger } from './FilterTrigger';
import { PriceFilter } from './PriceFilter';

const triggers: ReadonlyArray<{ id: FilterPanel; label: string }> = [
  { id: 'date', label: 'Fecha' }, { id: 'price', label: 'Precio' },
  { id: 'distance', label: 'Distancia' }, { id: 'categories', label: 'Categorías' },
];
type Props = { state: FilterState; dispatch: Dispatch<FilterAction>; categories: Category[];
  summaries: Record<FilterPanel, string>; onClear: () => void; panel: FilterPanel | null;
  onPanelChange: (panel: FilterPanel | null) => void };
export function FilterBar({ state, dispatch, categories, summaries, onClear, panel, onPanelChange }: Props) {
  const { width, fontScale } = useWindowDimensions();
  const wide = width >= breakpoints.tablet && fontScale <= sizes.twoColumnMaxFontScale;
  return <View testID="filter-bar" style={styles.bar}>
    <View style={styles.heading}>
      <Text accessible={false} style={styles.mark}>?</Text>
      <View style={styles.headingText}>
        <Text accessibilityRole="header" aria-level={2} style={styles.title}>¿Qué te apetece hoy?</Text>
        <Text style={styles.note}>Encuentra tu próximo plan</Text>
      </View>
    </View>
    <View style={styles.triggers}>{triggers.map(trigger => <View key={trigger.id} style={wide ? styles.quarter : styles.half}>
      <FilterTrigger {...trigger} summary={summaries[trigger.id]} expanded={panel === trigger.id}
        onPress={() => onPanelChange(panel === trigger.id ? null : trigger.id)} />
    </View>)}</View>
    {panel ? <View nativeID={`filter-panel-${panel}`} testID={`filter-panel-${panel}`} style={styles.panel}>
      {panel === 'date' ? <DateFilter value={state.date} dispatch={dispatch} /> : null}
      {panel === 'price' ? <PriceFilter value={state.price} dispatch={dispatch} /> : null}
      {panel === 'distance' ? <DistanceFilter value={state.distance} dispatch={dispatch} /> : null}
      {panel === 'categories' ? <CategoryFilter categories={categories} value={state.categories} dispatch={dispatch} /> : null}
    </View> : null}
    <ActiveFilterSummary query={state.query} summaries={summaries} onClear={onClear} />
  </View>;
}
const styles = StyleSheet.create({
  bar: { padding: spacing.md, marginTop: spacing.lg, borderRadius: radii.large, gap: spacing.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  heading: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }, headingText: { flex: 1 },
  mark: { ...typography.title, color: colors.brandPrimary, backgroundColor: colors.background,
    width: sizes.touchTarget, height: sizes.touchTarget, textAlign: 'center', borderRadius: radii.pill },
  title: { ...typography.label, color: colors.textPrimary }, note: { ...typography.caption, color: colors.textSecondary },
  triggers: { flexDirection: 'row', flexWrap: 'wrap', margin: -spacing.xs },
  half: { width: '50%', padding: spacing.xs }, quarter: { width: '25%', padding: spacing.xs },
  panel: { paddingTop: spacing.md, borderTopWidth: 1, borderColor: colors.border },
});
