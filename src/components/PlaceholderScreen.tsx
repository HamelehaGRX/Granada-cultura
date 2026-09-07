import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BRAND } from '@/config/brand';
import { colors, spacing, typography } from '@/theme';

type PlaceholderScreenProps = {
  title: string;
  description: string;
  showBrand?: boolean;
};

export function PlaceholderScreen({
  title,
  description,
  showBrand = false,
}: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {showBrand ? <Text style={styles.brand}>{BRAND.name}</Text> : null}
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  brand: {
    ...typography.caption,
    color: colors.brandPrimary,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    maxWidth: 440,
    textAlign: 'center',
  },
});
