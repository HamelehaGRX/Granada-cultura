import { Pressable, StyleSheet, Text, View } from 'react-native';

import { collectionAppearanceFor, radii, sizes, spacing, typography,
  useAppTheme, useThemeStyles, type ThemeColors } from '@/theme';
import type { AvailableCollection } from '../collections';

type Identity = Pick<AvailableCollection, 'id' | 'title' | 'subtitle'>;

export function CollectionTile({ collection, onPress }: { collection: Identity; onPress: () => void }) {
  const { effectiveTheme } = useAppTheme();
  const styles = useThemeStyles(createStyles);
  const appearance = collectionAppearanceFor(collection.id, effectiveTheme);

  return <Pressable accessibilityRole="button" accessibilityLabel={`Abrir colección ${collection.title}`}
    accessibilityHint={collection.subtitle} testID={`collection-tile-${collection.id}`} onPress={onPress}
    style={({ pressed }) => [styles.tile, { backgroundColor: appearance.surface,
      borderColor: appearance.accent }, pressed && styles.pressed]}>
    <Text accessible={false} style={[styles.tileIcon, { color: appearance.accent }]}>{appearance.icon}</Text>
    <Text style={[styles.tileTitle, { color: appearance.accent }]}>{collection.title}</Text>
    <Text style={styles.tileArrow} accessible={false}>→</Text>
  </Pressable>;
}

export function CollectionHeading({ collection, level = 2 }: { collection: Identity; level?: 1 | 2 }) {
  const { effectiveTheme } = useAppTheme();
  const styles = useThemeStyles(createStyles);
  const appearance = collectionAppearanceFor(collection.id, effectiveTheme);

  return <View style={styles.headingRow}>
    <View style={[styles.badge, { backgroundColor: appearance.surface,
      borderColor: appearance.accent }]}>
      <Text accessible={false} style={[styles.headingIcon, { color: appearance.accent }]}>
        {appearance.icon}</Text>
    </View>
    <View style={styles.headingCopy}>
      <Text accessibilityRole="header" aria-level={level}
        style={[level === 1 ? styles.detailTitle : styles.headingTitle,
          { color: appearance.accent }]}>{collection.title}</Text>
      <Text style={styles.subtitle}>{collection.subtitle}</Text>
    </View>
  </View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  tile: { minHeight: 132, minWidth: 0, flex: 1, borderWidth: 1, borderRadius: radii.large,
    padding: spacing.md, justifyContent: 'space-between' },
  pressed: { opacity: 0.76 },
  tileIcon: { ...typography.heading, fontSize: 27, lineHeight: 31 },
  tileTitle: { ...typography.label, fontWeight: '700', flexShrink: 1 },
  tileArrow: { ...typography.body, color: colors.textSecondary, position: 'absolute',
    right: spacing.md, top: spacing.md },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minWidth: 0 },
  badge: { width: sizes.touchTarget, height: sizes.touchTarget, borderWidth: 1,
    borderRadius: radii.medium, alignItems: 'center', justifyContent: 'center' },
  headingIcon: { ...typography.heading, fontSize: 25 },
  headingCopy: { flex: 1, minWidth: 0 },
  headingTitle: { ...typography.heading },
  detailTitle: { ...typography.title },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
