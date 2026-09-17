import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { localStorage } from '@/storage/localStorage';
import { STORAGE_KEYS } from '@/storage/keys';
import { categoryAppearanceFor, type CategoryAppearance } from './categoryAppearances';
import { themeColors, type ThemeColors } from './colors';
import {
  DEFAULT_THEME_PREFERENCE,
  persistableThemePreference,
  resolveEffectiveTheme,
  restoreThemePreference,
  type EffectiveTheme,
  type ThemePreference,
} from './themePreference';

type AppThemeContextValue = Readonly<{
  preference: ThemePreference;
  effectiveTheme: EffectiveTheme;
  isDark: boolean;
  hydrated: boolean;
  colors: ThemeColors;
  categoryAppearanceFor: (categoryId: string) => CategoryAppearance;
  setThemePreference: (preference: ThemePreference) => void;
}>;

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>(DEFAULT_THEME_PREFERENCE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    localStorage.get(STORAGE_KEYS.themePreference, restoreThemePreference).then(result => {
      if (!active) return;
      setPreference(result.status === 'value' ? result.value : DEFAULT_THEME_PREFERENCE);
      setHydrated(true);
    });
    return () => { active = false; };
  }, []);

  const setThemePreference = useCallback((next: ThemePreference) => {
    setPreference(next);
    void localStorage.set(STORAGE_KEYS.themePreference, persistableThemePreference(next));
  }, []);

  const effectiveTheme = resolveEffectiveTheme(preference, systemColorScheme);
  const value = useMemo<AppThemeContextValue>(() => ({
    preference,
    effectiveTheme,
    isDark: effectiveTheme === 'dark',
    hydrated,
    colors: themeColors[effectiveTheme],
    categoryAppearanceFor: categoryId => categoryAppearanceFor(categoryId, effectiveTheme),
    setThemePreference,
  }), [effectiveTheme, hydrated, preference, setThemePreference]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme(): AppThemeContextValue {
  const value = useContext(AppThemeContext);
  if (!value) throw new Error('useAppTheme debe usarse dentro de AppThemeProvider.');
  return value;
}

export function useThemeStyles<T>(factory: (colors: ThemeColors) => T): T {
  const { colors } = useAppTheme();
  return useMemo(() => factory(colors), [colors, factory]);
}
