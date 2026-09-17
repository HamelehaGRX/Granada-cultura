import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { breakpoints, radii, shadows, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import type { Category } from '../../categories/types';
import { activeFilterGroupCount, clearFilterDraft, createFilterDraft, filterSelection } from '../draft';
import { filterReducer } from '../reducer';
import type { FilterPanel, FilterSelection, FilterState } from '../types';
import { filterSummaries } from '../utils';
import { useFilterModalEscape } from '../hooks/useFilterModalEscape';
import { backdropBlurStyle } from './backdropStyle';
import { CategoryFilter } from './CategoryFilter';
import { DateFilter } from './DateFilter';
import { DistanceFilter } from './DistanceFilter';
import { FilterTrigger } from './FilterTrigger';
import { PriceFilter } from './PriceFilter';

const triggers: ReadonlyArray<{ id: FilterPanel; label: string }> = [
  { id: 'date', label: 'Fecha' },
  { id: 'price', label: 'Precio' },
  { id: 'distance', label: 'Distancia' },
  { id: 'categories', label: 'Categorías' },
];

type Props = {
  appliedState: FilterState;
  categories: Category[];
  initialPanel?: FilterPanel | null;
  onApply: (selection: FilterSelection) => void;
  onClearApplied: () => void;
  onDismiss: () => void;
  visible: boolean;
};

export function FilterModal({ appliedState, categories, initialPanel = null, onApply, onClearApplied,
  onDismiss, visible }: Props) {
  const styles = useThemeStyles(createStyles);
  const { width } = useWindowDimensions();
  const wide = width >= breakpoints.tablet;
  const [draft, dispatch] = useReducer(filterReducer, appliedState, createFilterDraft);
  const [panel, setPanel] = useState<FilterPanel | null>(initialPanel);
  const [focusedAction, setFocusedAction] = useState<'close' | 'clear' | 'save' | null>(null);
  const [reduceMotion, setReduceMotion] = useState(true);
  const closeRef = useRef<View>(null);
  const dismiss = useCallback(() => onDismiss(), [onDismiss]);
  useFilterModalEscape(visible, dismiss);

  useEffect(() => {
    if (!visible) return;
    dispatch({ type: 'hydrate', value: filterSelection(appliedState) });
    setPanel(initialPanel);
  }, [visible]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion, () => setReduceMotion(false));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const summaries = filterSummaries(draft, categories);
  const draftCount = activeFilterGroupCount(draft);
  const canClear = draftCount > 0 || activeFilterGroupCount(appliedState) > 0;
  const focusClose = () => {
    if (Platform.OS === 'web') return;
    const node = findNodeHandle(closeRef.current);
    if (node !== null) AccessibilityInfo.setAccessibilityFocus(node);
  };
  const save = () => {
    onApply(filterSelection(draft));
    onDismiss();
  };
  const clear = () => {
    dispatch({ type: 'hydrate', value: filterSelection(clearFilterDraft(draft)) });
    onClearApplied();
  };

  return <Modal animationType={reduceMotion ? 'none' : 'fade'} onRequestClose={dismiss} onShow={focusClose}
    statusBarTranslucent transparent visible={visible}>
    <View style={[styles.overlay, wide ? styles.overlayCentered : styles.overlayFloating]}>
      <Pressable accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        testID="filter-backdrop" onPress={dismiss} style={[styles.backdrop, backdropBlurStyle]} />
      <View accessibilityViewIsModal aria-modal role="dialog" testID="filters-modal"
        style={[styles.modal, wide ? styles.modalWide : styles.modalMobile]}>
        <View style={styles.header}>
          <Text accessibilityRole="header" aria-level={2} style={styles.heading}>¿Qué te apetece hoy?</Text>
          <Pressable ref={closeRef} accessibilityRole="button" accessibilityLabel="Cerrar filtros sin guardar"
            testID="close-filters" onPress={dismiss} onFocus={() => setFocusedAction('close')}
            onBlur={() => setFocusedAction(null)}
            style={({ pressed }) => [styles.close, focusedAction === 'close' && styles.focused, pressed && styles.pressed]}>
            <Text accessible={false} style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.triggers}>{triggers.map(trigger => <View key={trigger.id}
            style={wide ? styles.quarter : styles.half}>
            <FilterTrigger {...trigger} summary={summaries[trigger.id]} expanded={panel === trigger.id}
              onPress={() => setPanel(panel === trigger.id ? null : trigger.id)} />
          </View>)}</View>
          {panel ? <View nativeID={`filter-panel-${panel}`} testID={`filter-panel-${panel}`} style={styles.panel}>
            {panel === 'date' ? <DateFilter value={draft.date} dispatch={dispatch} /> : null}
            {panel === 'price' ? <PriceFilter value={draft.price} dispatch={dispatch} /> : null}
            {panel === 'distance' ? <DistanceFilter value={draft.distance} dispatch={dispatch} /> : null}
            {panel === 'categories' ? <CategoryFilter categories={categories} value={draft.categories} dispatch={dispatch} /> : null}
          </View> : <Text style={styles.help}>Elige un grupo para ajustar sus opciones.</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable accessibilityRole="button" testID="save-filters" onPress={save}
            onFocus={() => setFocusedAction('save')} onBlur={() => setFocusedAction(null)}
            style={({ pressed }) => [styles.primaryAction, focusedAction === 'save' && styles.primaryFocused,
              pressed && styles.primaryPressed]}>
            <Text style={styles.primaryLabel}>Guardar filtros</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Limpiar filtros aplicados ahora"
            accessibilityState={{ disabled: !canClear }} disabled={!canClear} testID="clear-filter-draft"
            onFocus={() => setFocusedAction('clear')} onBlur={() => setFocusedAction(null)}
            onPress={clear}
            style={({ pressed }) => [styles.secondaryAction, !canClear && styles.disabled,
              focusedAction === 'clear' && styles.focused, pressed && styles.pressed]}>
            <Text style={styles.secondaryLabel}>Limpiar filtros</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: { flex: 1, padding: spacing.md },
  overlayFloating: { alignItems: 'center', justifyContent: 'center', paddingBottom: spacing.xl },
  overlayCentered: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: colors.overlay,
  },
  modal: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceElevated,
    ...shadows.raised,
  },
  modalMobile: {
    height: '82%',
    borderRadius: radii.large,
  },
  modalWide: { maxWidth: 760, height: '80%', maxHeight: 760, borderRadius: radii.large },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heading: { ...typography.heading, color: colors.textPrimary, flex: 1 },
  close: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  closeText: { ...typography.title, color: colors.textPrimary, lineHeight: 32 },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: spacing.lg },
  triggers: { flexDirection: 'row', flexWrap: 'wrap', margin: -spacing.xs },
  half: { width: '50%', padding: spacing.xs },
  quarter: { width: '25%', padding: spacing.xs },
  panel: { paddingTop: spacing.md, borderTopWidth: 1, borderColor: colors.border },
  help: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryAction: {
    minHeight: sizes.touchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  primaryAction: {
    minHeight: sizes.touchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radii.medium,
    backgroundColor: colors.brandPrimary,
  },
  primaryPressed: { backgroundColor: colors.brandPrimaryPressed },
  focused: { borderWidth: 2, borderColor: colors.textPrimary },
  primaryFocused: { borderWidth: 2, borderColor: colors.textPrimary },
  pressed: { backgroundColor: colors.background },
  disabled: { opacity: 0.45 },
  secondaryLabel: { ...typography.label, color: colors.brandPrimary, textAlign: 'center' },
  primaryLabel: { ...typography.label, color: colors.textOnPrimary, textAlign: 'center' },
});
