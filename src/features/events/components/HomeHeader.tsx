import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BRAND } from '@/config/brand';
import { ThemePreferenceSelector } from '@/components/appearance/ThemePreferenceSelector';
import { breakpoints, motion, sizes, spacing, typography, useThemeStyles, type ThemeColors } from '@/theme';
import { SearchField } from '../../search/components/SearchField';

/** La safe area la aplica AppShell; el header no duplica sus insets. */
export function HomeHeader({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  const styles = useThemeStyles(createStyles);
  const [open, setOpen] = useState(Boolean(query));
  const [renderSearch, setRenderSearch] = useState(Boolean(query));
  const [reduceMotion, setReduceMotion] = useState(true);
  const [contentWidth, setContentWidth] = useState(0);
  const [focused, setFocused] = useState(false);
  const toggle = useRef<View>(null);
  const progress = useRef(new Animated.Value(query ? 1 : 0)).current;
  const searchWidth = Math.max(0, contentWidth - spacing.lg * 2 - sizes.touchTarget * 2 - spacing.sm * 2);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion, () => setReduceMotion(false));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const animate = useCallback((toValue: 0 | 1, onComplete?: () => void) => {
    progress.stopAnimation();
    if (reduceMotion) {
      progress.setValue(toValue);
      onComplete?.();
      return;
    }
    Animated.timing(progress, {
      toValue,
      duration: motion.duration.short,
      useNativeDriver: false,
    }).start(({ finished }) => { if (finished) onComplete?.(); });
  }, [progress, reduceMotion]);

  const showSearch = useCallback(() => {
    setRenderSearch(true);
    setOpen(true);
    animate(1);
  }, [animate]);

  useEffect(() => {
    if (query && !open) showSearch();
  }, [open, query, showSearch]);

  const close = useCallback(() => {
    setOpen(false);
    onQueryChange('');
    animate(0, () => {
      setRenderSearch(false);
      toggle.current?.focus();
    });
  }, [animate, onQueryChange]);

  const brandOpacity = progress.interpolate({ inputRange: [0, 0.7], outputRange: [1, 0], extrapolate: 'clamp' });
  const brandTranslate = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -spacing.xl] });
  const fieldWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, searchWidth] });
  const fieldOpacity = progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0, 1] });

  return (
    <View style={styles.header}>
      <View onLayout={event => setContentWidth(event.nativeEvent.layout.width)} style={styles.content}>
        <Animated.View style={[styles.brandSlot, { opacity: brandOpacity, transform: [{ translateX: brandTranslate }] }]}
          accessibilityElementsHidden={open} aria-hidden={open}
          importantForAccessibility={open ? 'no-hide-descendants' : 'auto'}>
          <Text style={styles.brand}>{BRAND.name}</Text>
        </Animated.View>
        {renderSearch ? (
          <Animated.View style={[styles.searchSlot, { opacity: fieldOpacity, width: fieldWidth }]}
            accessibilityElementsHidden={!open} aria-hidden={!open}
            importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}>
            <SearchField value={query} onChange={onQueryChange} onClose={close} />
          </Animated.View>
        ) : null}
        <ThemePreferenceSelector />
        <Pressable ref={toggle} accessibilityRole="button" accessibilityLabel={open ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
          accessibilityState={{ expanded: open }} aria-expanded={open} onPress={() => open ? close() : showSearch()}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={[styles.toggle, focused && styles.focused]}>
          {open ? <Text style={styles.close}>×</Text> : <View accessible={false} style={styles.magnifier}>
            <View style={styles.handle} />
          </View>}
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  header: { backgroundColor: colors.brandSurface },
  content: {
    minHeight: sizes.homeHeaderMinHeight, maxWidth: breakpoints.desktop,
    width: '100%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  brandSlot: { flex: 1 },
  brand: { ...typography.title, color: colors.textInverse, letterSpacing: sizes.contentLetterSpacing },
  searchSlot: {
    position: 'absolute',
    right: spacing.lg + sizes.touchTarget * 2 + spacing.sm * 2,
    overflow: 'hidden',
  },
  toggle: { width: sizes.touchTarget, height: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.brandSurface, borderRadius: sizes.touchTarget },
  focused: { borderColor: colors.textInverse }, close: { ...typography.title, color: colors.textInverse },
  magnifier: { width: spacing.md, height: spacing.md, borderWidth: 2, borderColor: colors.textInverse, borderRadius: spacing.md },
  handle: { position: 'absolute', width: spacing.sm, height: 2, backgroundColor: colors.textInverse,
    right: -spacing.sm, bottom: -spacing.xs, transform: [{ rotate: '45deg' }] },
});
