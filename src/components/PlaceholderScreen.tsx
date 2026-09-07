import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import {
  PlaceholderAction,
  type PlaceholderActionConfig,
} from '@/components/PlaceholderAction';
import { BRAND } from '@/config/brand';
import {
  breakpoints,
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from '@/theme';

type PlaceholderScreenProps = {
  backLabel?: string;
  title: string;
  description: string;
  parameter?: {
    label: string;
    value: string;
  };
  primaryAction?: PlaceholderActionConfig;
  showBackAction?: boolean;
  showBrand?: boolean;
};

export function PlaceholderScreen({
  backLabel = 'Volver',
  title,
  description,
  parameter,
  primaryAction,
  showBackAction = false,
  showBrand = false,
}: PlaceholderScreenProps) {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  return (
    <AppShell>
      <ScreenContainer centered maxWidth={breakpoints.tablet}>
        <View style={styles.panel}>
          {showBrand ? <Text style={styles.brand}>{BRAND.name}</Text> : null}
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.description}>{description}</Text>
          {parameter ? (
            <View
              accessibilityLabel={`${parameter.label}: ${parameter.value}`}
              style={styles.parameter}
            >
              <Text style={styles.parameterLabel}>{parameter.label}</Text>
              <Text selectable style={styles.parameterValue}>
                {parameter.value}
              </Text>
            </View>
          ) : null}
          {showBackAction || primaryAction ? (
            <View style={styles.actions}>
              {showBackAction ? (
                <PlaceholderAction
                  accessibilityHint="Vuelve a la pantalla anterior o a Inicio"
                  label={backLabel}
                  onPress={handleBack}
                  variant="secondary"
                />
              ) : null}
              {primaryAction ? (
                <PlaceholderAction
                  accessibilityHint={primaryAction.accessibilityHint}
                  label={primaryAction.label}
                  onPress={primaryAction.onPress}
                  variant="primary"
                />
              ) : null}
            </View>
          ) : null}
        </View>
      </ScreenContainer>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    width: '100%',
    padding: spacing.xl,
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radii.large,
    borderWidth: StyleSheet.hairlineWidth,
    ...shadows.soft,
  },
  brand: {
    ...typography.label,
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
    color: colors.textSecondary,
    marginTop: spacing.sm,
    maxWidth: breakpoints.tablet,
    textAlign: 'center',
  },
  parameter: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.medium,
    borderWidth: StyleSheet.hairlineWidth,
  },
  parameterLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  parameterValue: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
