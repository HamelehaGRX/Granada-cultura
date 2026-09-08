import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { FilterChoice } from './FilterChoice';

export function ActiveFilterSummary({ query, summaries, onClear }: {
  query: string; summaries: Record<string, string>; onClear: () => void;
}) {
  const labels = [query.trim() ? `Búsqueda: ${query.trim()}` : '', ...Object.values(summaries)].filter(Boolean);
  return <View style={styles.footer}>
    {labels.length ? <Text testID="active-filter-summary" style={styles.text}>Filtros activos: {labels.join(' · ')}</Text>
      : <Text style={styles.text}>Todos los planes · Distancias de ejemplo desde Granada.</Text>}
    <FilterChoice label="Limpiar filtros" testID="clear-filters" onPress={onClear} />
  </View>;
}
const styles = StyleSheet.create({
  footer: { gap: spacing.sm }, text: { ...typography.caption, color: colors.textSecondary },
});
