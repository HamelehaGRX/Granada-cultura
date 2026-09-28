import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, findNodeHandle, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, View } from 'react-native';

import { backdropBlurStyle } from '@/features/filters/components/backdropStyle';
import { useFilterModalEscape } from '@/features/filters/hooks/useFilterModalEscape';
import { radii, shadows, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { DEFAULT_SOON_FILTERS, type SoonFilters } from '../soonFilters';
import type { SoonPrice, SoonWindow } from '../types';

const windows: ReadonlyArray<{ value: SoonWindow; label: string }> = [
  { value: 'today', label: 'Hoy' },
  { value: '3days', label: 'Próximos 3 días' },
  { value: '7days', label: '7 días' },
  { value: '14days', label: '14 días' },
];
const prices: ReadonlyArray<{ value: SoonPrice; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'free', label: 'Gratis' },
  { value: 'paid', label: 'De pago' },
];

type Props = {
  visible: boolean;
  applied: SoonFilters;
  onApply: (filters: SoonFilters) => void;
  onDismiss: () => void;
};

export function SoonFilterModal({ visible, applied, onApply, onDismiss }: Props) {
  const styles = useThemeStyles(createStyles);
  const [draft, setDraft] = useState(applied);
  const [focused, setFocused] = useState<string | null>(null);
  const closeRef = useRef<View>(null);
  useFilterModalEscape(visible, onDismiss);

  useEffect(() => {
    if (visible) setDraft({ ...applied });
  }, [visible]);

  const focusClose = () => {
    if (Platform.OS === 'web') return;
    const node = findNodeHandle(closeRef.current);
    if (node !== null) AccessibilityInfo.setAccessibilityFocus(node);
  };

  const option = <T extends SoonWindow | SoonPrice>(value: T, label: string,
    active: boolean, choose: () => void) => (
    <Pressable key={value} accessibilityRole="radio" accessibilityLabel={label}
      accessibilityState={{ checked: active }} aria-checked={active}
      testID={`soon-option-${value}`} onPress={choose}
      onFocus={() => setFocused(value)} onBlur={() => setFocused(null)}
      style={({ pressed }) => [styles.option, active && styles.optionSelected,
        focused === value && styles.focused, pressed && styles.pressed]}>
      <Text accessible={false} style={[styles.radio, active && styles.radioSelected]}>
        {active ? '●' : '○'}
      </Text>
      <Text style={styles.optionLabel}>{label}</Text>
    </Pressable>
  );

  return <Modal animationType="fade" onRequestClose={onDismiss} onShow={focusClose}
    statusBarTranslucent transparent visible={visible}>
    <View style={styles.overlay}>
      <Pressable accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        testID="soon-filter-backdrop" onPress={onDismiss}
        style={[styles.backdrop, backdropBlurStyle]} />
      <View accessibilityViewIsModal aria-modal role="dialog" testID="soon-filter-modal" style={styles.modal}>
        <View style={styles.header}>
          <Text accessibilityRole="header" aria-level={2} style={styles.title}>OCURRE PRONTO</Text>
          <Pressable ref={closeRef} accessibilityRole="button"
            accessibilityLabel="Cerrar filtros de Ocurre pronto sin guardar"
            testID="soon-filter-close" onPress={onDismiss}
            onFocus={() => setFocused('close')} onBlur={() => setFocused(null)}
            style={[styles.close, focused === 'close' && styles.focused]}>
            <Text accessible={false} style={styles.closeGlyph}>×</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.options} keyboardShouldPersistTaps="handled">
          <View style={styles.group}>
            <Text accessibilityRole="header" aria-level={3} style={styles.groupTitle}>¿Cuándo?</Text>
            {windows.map(item => option(item.value, item.label, draft.window === item.value,
              () => setDraft(current => ({ ...current, window: item.value }))))}
          </View>
          <View style={styles.group}>
            <Text accessibilityRole="header" aria-level={3} style={styles.groupTitle}>Precio</Text>
            {prices.map(item => option(item.value, item.label, draft.price === item.value,
              () => setDraft(current => ({ ...current, price: item.value }))))}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable accessibilityRole="button" accessibilityLabel="Restablecer borrador a 7 días y todos los precios"
            testID="soon-filter-reset" onPress={() => setDraft({ ...DEFAULT_SOON_FILTERS })}
            onFocus={() => setFocused('reset')} onBlur={() => setFocused(null)}
            style={({ pressed }) => [styles.secondary, focused === 'reset' && styles.focused,
              pressed && styles.pressed]}>
            <Text style={styles.secondaryLabel}>Restablecer</Text>
          </Pressable>
          <Pressable accessibilityRole="button" testID="soon-filter-save"
            onPress={() => { onApply(draft); onDismiss(); }}
            onFocus={() => setFocused('save')} onBlur={() => setFocused(null)}
            style={({ pressed }) => [styles.primary, focused === 'save' && styles.focused,
              pressed && styles.primaryPressed]}>
            <Text style={styles.primaryLabel}>Guardar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  backdrop: { position: 'absolute', inset: 0, backgroundColor: colors.overlay },
  modal: { width: '100%', maxWidth: 480, maxHeight: '88%', overflow: 'hidden',
    borderRadius: radii.large, borderWidth: 1, borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceElevated, ...shadows.raised },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg,
    paddingRight: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.heading, flex: 1, color: colors.textPrimary },
  close: { width: sizes.touchTarget, height: sizes.touchTarget, alignItems: 'center',
    justifyContent: 'center', borderRadius: radii.pill, borderWidth: 2, borderColor: 'transparent' },
  closeGlyph: { ...typography.title, color: colors.textPrimary },
  scroll: { flexGrow: 0 },
  options: { gap: spacing.lg, padding: spacing.lg },
  group: { gap: spacing.sm },
  groupTitle: { ...typography.body, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xs },
  option: { minHeight: sizes.touchTarget, flexDirection: 'row', alignItems: 'center',
    gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radii.medium, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface },
  optionSelected: { borderColor: colors.brandPrimary, backgroundColor: colors.surfaceMuted },
  optionLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  radio: { ...typography.heading, color: colors.textSecondary },
  radioSelected: { color: colors.brandPrimary },
  footer: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  secondary: { flex: 1, minHeight: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radii.medium },
  primary: { flex: 1, minHeight: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.brandPrimary, borderRadius: radii.medium,
    backgroundColor: colors.brandPrimary },
  secondaryLabel: { ...typography.label, color: colors.brandPrimary },
  primaryLabel: { ...typography.label, color: colors.textOnPrimary },
  focused: { borderColor: colors.textPrimary, borderWidth: 2 },
  pressed: { backgroundColor: colors.surfaceMuted },
  primaryPressed: { backgroundColor: colors.brandPrimaryPressed },
});
