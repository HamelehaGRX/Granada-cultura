import type { EffectiveTheme } from './themePreference';

export type CategoryAppearance = Readonly<{ primary: string; soft: string }>;
type CategoryAppearanceMap = Readonly<Record<string, CategoryAppearance>>;

const lightFallback: CategoryAppearance = { primary: '#7a1738', soft: '#f3dde4' };
const darkFallback: CategoryAppearance = { primary: '#f09ab5', soft: '#492332' };

/** Colecciones cromáticas centrales: el texto siempre acompaña al color. */
export const lightCategoryAppearances: CategoryAppearanceMap = Object.freeze({
  musica: { primary: '#7a1738', soft: '#f3dde4' },
  teatro: { primary: '#6b234e', soft: '#eedce8' },
  comedia: { primary: '#8a3f1f', soft: '#f4dfd2' },
  exposiciones: { primary: '#136b68', soft: '#d8ecea' },
  literatura: { primary: '#5e3a8c', soft: '#e9e0f4' },
  gastronomia: { primary: '#73540a', soft: '#f4e7bc' },
  cine: { primary: '#234e78', soft: '#dae7f2' },
  danza: { primary: '#8a2149', soft: '#f3d9e3' },
  patrimonio: { primary: '#51621f', soft: '#e4e9cf' },
  ferias: { primary: '#0f666b', soft: '#d8eff0' },
  infantil: { primary: '#653488', soft: '#e9def2' },
});

export const darkCategoryAppearances: CategoryAppearanceMap = Object.freeze({
  musica: { primary: '#f08dab', soft: '#492332' },
  teatro: { primary: '#dca1cf', soft: '#3e2637' },
  comedia: { primary: '#f2a477', soft: '#462a20' },
  exposiciones: { primary: '#6fd0ca', soft: '#193837' },
  literatura: { primary: '#c5a3f0', soft: '#332943' },
  gastronomia: { primary: '#e8ca78', soft: '#40351d' },
  cine: { primary: '#92bee8', soft: '#213445' },
  danza: { primary: '#f08db0', soft: '#492333' },
  patrimonio: { primary: '#bfd27b', soft: '#303820' },
  ferias: { primary: '#72d3d8', soft: '#18383b' },
  infantil: { primary: '#d4a4ef', soft: '#382743' },
});

export const categoryAppearances = lightCategoryAppearances;

export function categoryAppearanceFor(categoryId: string, theme: EffectiveTheme = 'light'): CategoryAppearance {
  const appearances = theme === 'dark' ? darkCategoryAppearances : lightCategoryAppearances;
  return appearances[categoryId] ?? (theme === 'dark' ? darkFallback : lightFallback);
}
