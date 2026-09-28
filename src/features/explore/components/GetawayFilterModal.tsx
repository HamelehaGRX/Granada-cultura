import { Slider } from '@react-native-assets/slider';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, findNodeHandle, Modal, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View } from 'react-native';

import { backdropBlurStyle } from '@/features/filters/components/backdropStyle';
import { useFilterModalEscape } from '@/features/filters/hooks/useFilterModalEscape';
import { radii, shadows, sizes, spacing, typography, useAppTheme, useThemeStyles,
  type ThemeColors } from '@/theme';
import { clampGetawayMax, DEFAULT_GETAWAY_MAX_KM, DEMO_HABITUAL_RADIUS_KM,
  MAX_GETAWAY_KM } from '../getawayFilters';
import type { GetawayWindow } from '../types';

const WINDOWS: ReadonlyArray<{ value: GetawayWindow; label: string }> = [
  { value: 'today', label: 'Hoy' }, { value: '3days', label: 'Próximos 3 días' },
  { value: '7days', label: '7 días' }, { value: '14days', label: '14 días' },
  { value: '30days', label: '30 días' }, { value: 'all', label: 'Todos los próximos' },
];

export function GetawayFilterModal({ visible, appliedMaxKm, appliedWindow = 'all', showWhen = false,
  onApply, onDismiss }: { visible: boolean; appliedMaxKm: number; appliedWindow?: GetawayWindow;
    showWhen?: boolean; onApply: (maxKm: number, window: GetawayWindow) => void; onDismiss: () => void }) {
  const { colors } = useAppTheme();
  const styles = useThemeStyles(createStyles);
  const [draftMax, setDraftMax] = useState(appliedMaxKm);
  const [draftWindow, setDraftWindow] = useState<GetawayWindow>(appliedWindow);
  const [draftText, setDraftText] = useState(String(appliedMaxKm));
  const [focused, setFocused] = useState<string | null>(null);
  const closeRef = useRef<View>(null);
  useFilterModalEscape(visible, onDismiss);
  useEffect(() => {
    if (visible) { setDraftMax(appliedMaxKm); setDraftText(String(appliedMaxKm));
      setDraftWindow(appliedWindow); }
  }, [visible, appliedMaxKm, appliedWindow]);
  const changeMax = (value: number) => { const next = clampGetawayMax(value);
    setDraftMax(next); setDraftText(String(next)); };
  const focusClose = () => {
    if (Platform.OS === 'web') return;
    const node = findNodeHandle(closeRef.current);
    if (node !== null) AccessibilityInfo.setAccessibilityFocus(node);
  };

  return <Modal animationType="fade" onRequestClose={onDismiss} onShow={focusClose}
    statusBarTranslucent transparent visible={visible}>
    <View style={styles.overlay}>
      <Pressable accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        testID="getaway-backdrop" onPress={onDismiss} style={[styles.backdrop, backdropBlurStyle]} />
      <View accessibilityViewIsModal aria-modal role="dialog" testID="getaway-modal" style={styles.modal}>
        <View style={styles.header}>
          <Text accessibilityRole="header" aria-level={2} style={styles.title}>ESCÁPATE UN POCO</Text>
          <Pressable ref={closeRef} accessibilityRole="button" accessibilityLabel="Cerrar filtro de Escápate sin guardar"
            testID="getaway-close" onPress={onDismiss} onFocus={() => setFocused('close')}
            onBlur={() => setFocused(null)} style={[styles.close, focused === 'close' && styles.focused]}>
            <Text accessible={false} style={styles.closeGlyph}>×</Text>
          </Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
          <Text style={styles.groupTitle}>Radio habitual</Text>
          <Text style={styles.habitual}>{DEMO_HABITUAL_RADIUS_KM} km · demo desde Granada</Text>
          <Text style={styles.groupTitle}>Distancia máxima</Text>
          <View style={styles.bounds}><Text style={styles.note}>{DEMO_HABITUAL_RADIUS_KM} km</Text>
            <Text style={styles.note}>{MAX_GETAWAY_KM} km</Text></View>
          <Slider testID="getaway-slider" value={draftMax} minimumValue={DEMO_HABITUAL_RADIUS_KM}
            maximumValue={MAX_GETAWAY_KM} step={1} slideOnTap trackHeight={6} thumbSize={sizes.touchTarget}
            minimumTrackTintColor={colors.brandPrimary} maximumTrackTintColor={colors.borderStrong}
            thumbTintColor={colors.surfaceElevated} thumbStyle={styles.thumb} style={styles.slider}
            onValueChange={changeMax} accessibilityLabel="Distancia máxima de Escápate en kilómetros"
            accessibilityValue={{ min: DEMO_HABITUAL_RADIUS_KM, max: MAX_GETAWAY_KM, now: draftMax }} />
          <View style={styles.precise}>
            <Pressable accessibilityRole="button" accessibilityLabel="Reducir distancia máxima un kilómetro"
              onPress={() => changeMax(draftMax - 1)} style={styles.step}><Text style={styles.stepText}>−</Text></Pressable>
            <TextInput testID="getaway-max-input" accessibilityLabel="Distancia máxima exacta en kilómetros"
              accessibilityHint={`Entre ${DEMO_HABITUAL_RADIUS_KM} y ${MAX_GETAWAY_KM} kilómetros`}
              keyboardType="number-pad" inputMode="numeric" selectTextOnFocus value={draftText}
              onChangeText={value => { if (!/^\d*$/.test(value)) return; setDraftText(value);
                if (value) setDraftMax(clampGetawayMax(Number(value))); }}
              onBlur={() => setDraftText(String(draftMax))} style={styles.input} />
            <Text style={styles.note}>km</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Aumentar distancia máxima un kilómetro"
              onPress={() => changeMax(draftMax + 1)} style={styles.step}><Text style={styles.stepText}>+</Text></Pressable>
          </View>
          {showWhen ? <View style={styles.when}>
            <Text accessibilityRole="header" aria-level={3} style={styles.groupTitle}>¿Cuándo?</Text>
            {WINDOWS.map(option => <Pressable key={option.value} accessibilityRole="radio"
              accessibilityLabel={option.label} accessibilityState={{ checked: draftWindow === option.value }}
              aria-checked={draftWindow === option.value}
              testID={`getaway-when-${option.value}`} onPress={() => setDraftWindow(option.value)}
              style={[styles.option, draftWindow === option.value && styles.optionActive]}>
              <Text style={styles.optionText}>{draftWindow === option.value ? '●' : '○'}  {option.label}</Text>
            </Pressable>)}
          </View> : null}
        </ScrollView>
        <View style={styles.footer}>
          <Pressable accessibilityRole="button" testID="getaway-reset"
            accessibilityLabel="Restablecer borrador a 100 kilómetros y todos los próximos"
            onPress={() => { changeMax(DEFAULT_GETAWAY_MAX_KM); setDraftWindow('all'); }} style={styles.secondary}>
            <Text style={styles.secondaryText}>Restablecer</Text></Pressable>
          <Pressable accessibilityRole="button" testID="getaway-save"
            onPress={() => { onApply(draftMax, draftWindow); onDismiss(); }} style={styles.primary}>
            <Text style={styles.primaryText}>Guardar</Text></Pressable>
        </View>
      </View>
    </View>
  </Modal>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md },
  backdrop: { position: 'absolute', inset: 0, backgroundColor: colors.overlay },
  modal: { width: '100%', maxWidth: 480, maxHeight: '88%', overflow: 'hidden', borderRadius: radii.large,
    borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surfaceElevated, ...shadows.raised },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg,
    paddingRight: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.heading, flex: 1, color: colors.textPrimary },
  close: { width: sizes.touchTarget, height: sizes.touchTarget, justifyContent: 'center', alignItems: 'center' },
  closeGlyph: { ...typography.title, color: colors.textPrimary },
  body: { gap: spacing.sm, padding: spacing.lg },
  groupTitle: { ...typography.body, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.sm },
  habitual: { ...typography.body, color: colors.textSecondary },
  bounds: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  note: { ...typography.caption, color: colors.textSecondary },
  slider: { width: '100%', minHeight: sizes.touchTarget },
  thumb: { width: 28, height: 28, borderRadius: radii.pill, borderWidth: 3, borderColor: colors.brandPrimary },
  precise: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  step: { width: sizes.touchTarget, height: sizes.touchTarget, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radii.small },
  stepText: { ...typography.title, color: colors.brandPrimary },
  input: { minWidth: 75, minHeight: sizes.touchTarget, textAlign: 'center', ...typography.body,
    color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderStrong,
    borderRadius: radii.small, backgroundColor: colors.surface },
  when: { gap: spacing.sm, marginTop: spacing.md },
  option: { minHeight: sizes.touchTarget, justifyContent: 'center', paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border, borderRadius: radii.medium, backgroundColor: colors.surface },
  optionActive: { borderColor: colors.brandPrimary, backgroundColor: colors.surfaceMuted },
  optionText: { ...typography.body, color: colors.textPrimary },
  footer: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border },
  secondary: { flex: 1, minHeight: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radii.medium },
  secondaryText: { ...typography.label, color: colors.brandPrimary },
  primary: { flex: 1, minHeight: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderRadius: radii.medium, backgroundColor: colors.brandPrimary },
  primaryText: { ...typography.label, color: colors.textOnPrimary },
  focused: { borderWidth: 2, borderColor: colors.textPrimary },
});
