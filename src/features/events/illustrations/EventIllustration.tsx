import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, sizes, typography } from '@/theme';
import { resolveEventIllustration, type IllustrationVariant } from './illustrationMap';

const variantStyles: Record<IllustrationVariant, { backgroundColor: string; color: string }> = {
  cream: { backgroundColor: colors.cardBorderCream, color: colors.brandPrimaryPressed },
  rose: { backgroundColor: colors.cardBorderRose, color: colors.brandPrimary },
  burgundy: { backgroundColor: colors.borderStrong, color: colors.brandPrimaryPressed },
};

/** Placeholder gráfico multiplataforma, sustituible por assets estáticos definitivos. */
export function EventIllustration({ illustrationKey, compact = false, featured = false }: {
  illustrationKey?: string;
  compact?: boolean;
  featured?: boolean;
}) {
  const illustration = resolveEventIllustration(illustrationKey);
  const palette = variantStyles[illustration.variant];

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.frame, featured ? styles.featured : styles.thumbnail,
        !featured && compact && styles.compact,
        { backgroundColor: palette.backgroundColor }]}
      testID={`event-illustration-${illustration.key.replace('/', '-')}`}
    >
      <View style={styles.halo} />
      <Text style={[styles.mark, { color: palette.color }]}>{illustration.mark}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radii.medium,
  },
  thumbnail: {
    width: sizes.eventIllustration,
    height: sizes.eventIllustration,
  },
  compact: {
    width: sizes.eventIllustrationCompact,
    height: sizes.eventIllustrationCompact,
  },
  featured: {
    width: '100%',
    aspectRatio: sizes.eventHeroAspectRatio,
    borderRadius: radii.large,
  },
  halo: {
    position: 'absolute',
    width: '72%',
    height: '72%',
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    opacity: 0.58,
  },
  mark: {
    ...typography.heading,
    fontWeight: '700',
  },
});
