import { migrateEnvelope } from '../storage/migrations';
import type { PersistedEnvelope } from '../storage/types';

export type ThemePreference = 'light' | 'dark' | 'system';
export type EffectiveTheme = Exclude<ThemePreference, 'system'>;
export type SystemColorScheme = EffectiveTheme | 'unspecified' | null | undefined;

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function resolveEffectiveTheme(preference: ThemePreference, systemColorScheme: SystemColorScheme): EffectiveTheme {
  if (preference !== 'system') return preference;
  return systemColorScheme === 'dark' ? 'dark' : 'light';
}

export function persistableThemePreference(preference: ThemePreference): PersistedEnvelope<ThemePreference> {
  return { version: 1, data: preference };
}

export function restoreThemePreference(value: unknown): ThemePreference | null {
  const envelope = migrateEnvelope(value);
  return envelope && isThemePreference(envelope.data) ? envelope.data : null;
}
