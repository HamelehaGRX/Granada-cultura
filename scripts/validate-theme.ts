/// <reference types="node" />
import assert from 'node:assert/strict';

import { darkCategoryAppearances, lightCategoryAppearances } from '../src/theme/categoryAppearances';
import { darkColors, lightColors } from '../src/theme/colors';
import {
  DEFAULT_THEME_PREFERENCE,
  persistableThemePreference,
  resolveEffectiveTheme,
  restoreThemePreference,
  type ThemePreference,
} from '../src/theme/themePreference';
import { STORAGE_KEYS } from '../src/storage/keys';
import { createStorage } from '../src/storage/storage';
import type { StorageDriver } from '../src/storage/types';

function preferenceOrDefault(value: unknown): ThemePreference {
  return restoreThemePreference(value) ?? DEFAULT_THEME_PREFERENCE;
}

function relativeLuminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)?.map(value => Number.parseInt(value, 16) / 255) ?? [];
  const [red, green, blue] = channels.map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground: string, background: string) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

async function main() {
  assert.equal(DEFAULT_THEME_PREFERENCE, 'system');
  assert.equal(resolveEffectiveTheme('light', 'dark'), 'light');
  assert.equal(resolveEffectiveTheme('dark', 'light'), 'dark');
  assert.equal(resolveEffectiveTheme('system', 'light'), 'light');
  assert.equal(resolveEffectiveTheme('system', 'dark'), 'dark');
  assert.equal(resolveEffectiveTheme('system', null), 'light');

  const systemBefore = resolveEffectiveTheme('system', 'light');
  const systemAfter = resolveEffectiveTheme('system', 'dark');
  assert.notEqual(systemBefore, systemAfter);
  assert.equal(resolveEffectiveTheme('light', 'light'), resolveEffectiveTheme('light', 'dark'));
  assert.equal(resolveEffectiveTheme('dark', 'light'), resolveEffectiveTheme('dark', 'dark'));

  for (const preference of ['light', 'dark', 'system'] as const) {
    const envelope = persistableThemePreference(preference);
    assert.equal(restoreThemePreference(envelope), preference);
  }
  for (const invalid of [null, 'dark', {}, { version: 1, data: 'sepia' }, { version: 2, data: 'dark' }]) {
    assert.equal(preferenceOrDefault(invalid), 'system');
  }

  const values = new Map<string, string>();
  const driver: StorageDriver = {
    async getItem(key) { return values.get(key) ?? null; },
    async setItem(key, value) { values.set(key, value); },
    async removeItem(key) { values.delete(key); },
  };
  const storage = createStorage(driver);
  const key = STORAGE_KEYS.themePreference;
  assert.equal((await storage.get(key, restoreThemePreference)).status, 'missing');
  assert(await storage.set(key, persistableThemePreference('dark')));
  const saved = await storage.get(key, restoreThemePreference);
  assert.deepEqual(saved.status === 'value' ? saved.value : null, 'dark');

  for (const colors of [lightColors, darkColors]) {
    assert(contrast(colors.textPrimary, colors.background) >= 4.5);
    assert(contrast(colors.textSecondary, colors.background) >= 4.5);
    assert(contrast(colors.textPrimary, colors.surface) >= 4.5);
    assert(contrast(colors.textInverse, colors.brandSurface) >= 4.5);
    assert(contrast(colors.textOnPrimary, colors.brandPrimary) >= 4.5);
    assert(contrast(colors.textOnPrimary, colors.brandPrimaryPressed) >= 4.5);
  }
  for (const appearances of [lightCategoryAppearances, darkCategoryAppearances]) {
    for (const appearance of Object.values(appearances)) {
      assert(contrast(appearance.primary, appearance.soft) >= 4.5);
    }
  }

  console.log('OK theme: default system, preferencia/tema efectivo, cambios del sistema, valores inválidos, persistencia y contraste semántico/categorías.');
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
