import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  radii,
  sizes,
  spacing,
  typography,
  useAppTheme,
  useThemeStyles,
  type ThemeColors,
  type ThemePreference,
} from '@/theme';

const options: ReadonlyArray<{ value: ThemePreference; label: string; glyph: string }> = [
  { value: 'light', label: 'Claro', glyph: '☀' },
  { value: 'dark', label: 'Oscuro', glyph: '☾' },
  { value: 'system', label: 'Sistema', glyph: '◐' },
];

function labelFor(preference: ThemePreference) {
  return options.find(option => option.value === preference)?.label ?? 'Sistema';
}

export function ThemePreferenceSelector() {
  const { preference, setThemePreference } = useAppTheme();
  const styles = useThemeStyles(createStyles);
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState<ThemePreference | 'trigger' | null>(null);
  const selected = options.find(option => option.value === preference) ?? options[2];

  const choose = (value: ThemePreference) => {
    setThemePreference(value);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Cambiar apariencia. Tema actual: ${labelFor(preference)}`}
        accessibilityState={{ expanded: visible }}
        aria-expanded={visible}
        onBlur={() => setFocused(null)}
        onFocus={() => setFocused('trigger')}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.trigger, focused === 'trigger' && styles.focused, pressed && styles.pressed]}
        testID="theme-selector-trigger"
      >
        <Text accessible={false} style={styles.triggerGlyph}>{selected.glyph}</Text>
      </Pressable>
      <Modal animationType="fade" onRequestClose={() => setVisible(false)} transparent visible={visible}>
        <View style={styles.overlay}>
          <Pressable
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            onPress={() => setVisible(false)}
            style={styles.backdrop}
            testID="theme-selector-backdrop"
          />
          <View accessibilityViewIsModal aria-modal role="dialog" style={styles.menu} testID="theme-selector-menu">
            <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Apariencia</Text>
            {options.map(option => {
              const active = option.value === preference;
              return (
                <Pressable
                  accessibilityLabel={option.label}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  aria-checked={active}
                  key={option.value}
                  onBlur={() => setFocused(null)}
                  onFocus={() => setFocused(option.value)}
                  onPress={() => choose(option.value)}
                  style={({ pressed }) => [styles.option, active && styles.optionSelected,
                    focused === option.value && styles.optionFocused, pressed && styles.optionPressed]}
                  testID={`theme-option-${option.value}`}
                >
                  <Text accessible={false} style={styles.optionGlyph}>{option.glyph}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text accessible={false} style={styles.radio}>{active ? '●' : '○'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  trigger: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.textInverse,
    backgroundColor: colors.brandSurfacePressed,
  },
  triggerGlyph: { ...typography.heading, color: colors.textInverse },
  focused: { borderColor: colors.textInverse },
  pressed: { backgroundColor: colors.brandSurfacePressed },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  backdrop: { position: 'absolute', inset: 0, backgroundColor: colors.overlay },
  menu: {
    width: '100%', maxWidth: 360, gap: spacing.sm, padding: spacing.lg,
    borderRadius: radii.large, borderWidth: 1, borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceElevated,
  },
  heading: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.sm },
  option: {
    minHeight: sizes.touchTarget, flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.medium,
    borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface,
  },
  optionSelected: { borderColor: colors.brandPrimary, backgroundColor: colors.surfaceMuted },
  optionFocused: { borderColor: colors.textPrimary },
  optionPressed: { backgroundColor: colors.surfaceMuted },
  optionGlyph: { ...typography.heading, width: 28, color: colors.brandPrimary, textAlign: 'center' },
  optionLabel: { ...typography.body, flex: 1, color: colors.textPrimary },
  radio: { ...typography.heading, color: colors.brandPrimary },
});
