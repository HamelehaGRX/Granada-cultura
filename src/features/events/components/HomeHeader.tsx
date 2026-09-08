import { StyleSheet, Text, View } from 'react-native';

import { BRAND } from '@/config/brand';
import { breakpoints, colors, sizes, spacing, typography } from '@/theme';

/** La safe area la aplica AppShell; el header no duplica sus insets. */
export function HomeHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <Text style={styles.brand}>{BRAND.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.brandPrimary },
  content: {
    minHeight: sizes.homeHeaderMinHeight, maxWidth: breakpoints.desktop,
    width: '100%', alignSelf: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  brand: { ...typography.title, color: colors.textInverse, letterSpacing: sizes.contentLetterSpacing },
});
