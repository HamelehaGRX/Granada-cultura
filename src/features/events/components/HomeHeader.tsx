import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BRAND } from '@/config/brand';
import { breakpoints, colors, sizes, spacing, typography } from '@/theme';
import { SearchField } from '../../search/components/SearchField';

/** La safe area la aplica AppShell; el header no duplica sus insets. */
export function HomeHeader({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  const [open, setOpen] = useState(Boolean(query));
  const [focused, setFocused] = useState(false);
  const toggle = useRef<View>(null);
  useEffect(() => { if (query) setOpen(true); }, [query]);
  const close = () => {
    setOpen(false);
    onQueryChange('');
    toggle.current?.focus();
  };
  return (
    <View style={styles.header}>
      <View style={styles.content}>
        {open ? <SearchField value={query} onChange={onQueryChange} onClose={close} />
          : <Text style={styles.brand}>{BRAND.name}</Text>}
        <Pressable ref={toggle} accessibilityRole="button" accessibilityLabel={open ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
          accessibilityState={{ expanded: open }} aria-expanded={open} onPress={() => open ? close() : setOpen(true)}
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

const styles = StyleSheet.create({
  header: { backgroundColor: colors.brandPrimary },
  content: {
    minHeight: sizes.homeHeaderMinHeight, maxWidth: breakpoints.desktop,
    width: '100%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  brand: { ...typography.title, color: colors.textInverse, letterSpacing: sizes.contentLetterSpacing, flex: 1 },
  toggle: { width: sizes.touchTarget, height: sizes.touchTarget, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.brandPrimary, borderRadius: sizes.touchTarget },
  focused: { borderColor: colors.textInverse }, close: { ...typography.title, color: colors.textInverse },
  magnifier: { width: spacing.md, height: spacing.md, borderWidth: 2, borderColor: colors.textInverse, borderRadius: spacing.md },
  handle: { position: 'absolute', width: spacing.sm, height: 2, backgroundColor: colors.textInverse,
    right: -spacing.sm, bottom: -spacing.xs, transform: [{ rotate: '45deg' }] },
});
