import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

export type PlaceholderActionConfig = {
  accessibilityHint?: string;
  label: string;
  onPress: () => void;
};

type PlaceholderActionProps = PlaceholderActionConfig & {
  variant: 'primary' | 'secondary';
};

export function PlaceholderAction({
  accessibilityHint,
  label,
  onPress,
  variant,
}: PlaceholderActionProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        variant === 'primary' ? styles.primaryAction : styles.secondaryAction,
        pressed &&
          (variant === 'primary'
            ? styles.primaryActionPressed
            : styles.secondaryActionPressed),
        focused && styles.actionFocused,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary'
            ? styles.primaryLabel
            : styles.secondaryLabel,
          focused && styles.focusedLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 112,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.medium,
    borderWidth: 2,
  },
  actionFocused: {
    borderWidth: 3,
  },
  primaryAction: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  primaryActionPressed: {
    backgroundColor: colors.brandPrimaryPressed,
    borderColor: colors.brandPrimaryPressed,
  },
  secondaryAction: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
  },
  secondaryActionPressed: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.brandPrimary,
  },
  label: {
    ...typography.label,
    textAlign: 'center',
  },
  primaryLabel: {
    color: colors.textInverse,
  },
  secondaryLabel: {
    color: colors.brandPrimary,
  },
  focusedLabel: {
    textDecorationLine: 'underline',
  },
});
