import type { Dispatch } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import type { Category } from '../../categories/types';
import type { CategorySelection, FilterAction } from '../types';
import { FilterChoice } from './FilterChoice';

export function CategoryFilter({ categories, value, dispatch }: {
  categories: Category[]; value: CategorySelection; dispatch: Dispatch<FilterAction>;
}) {
  return <View style={styles.stack}>
    <Text style={styles.note}>Sin selección se incluyen todas. Una categoría marcada incluye todas sus subcategorías hasta que elijas alguna.</Text>
    <View style={styles.choices}>{categories.map(category => <FilterChoice key={category.id}
      testID={`category-${category.id}`} label={category.name} selected={Object.hasOwn(value, category.id)}
      onPress={() => dispatch({ type: 'category', id: category.id })} />)}</View>
    {categories.filter(category => Object.hasOwn(value, category.id)).map(category => <View key={category.id} style={styles.stack}>
      <Text accessibilityRole="header" aria-level={3} style={styles.title}>{category.name}</Text>
      <View style={styles.choices}>{category.subcategories.map(sub => <FilterChoice key={sub.id}
        testID={`subcategory-${category.id}-${sub.id}`} label={sub.name} selected={value[category.id].includes(sub.id)}
        onPress={() => dispatch({ type: 'subcategory', categoryId: category.id, id: sub.id })} />)}</View>
    </View>)}
  </View>;
}
const styles = StyleSheet.create({
  stack: { gap: spacing.md }, choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  note: { ...typography.caption, color: colors.textSecondary }, title: { ...typography.label, color: colors.textPrimary },
});
