export type CategoryAppearance = Readonly<{
  primary: string;
  soft: string;
}>;

const fallbackAppearance: CategoryAppearance = {
  primary: '#7a1738',
  soft: '#f3dde4',
};

/** Colección cromática central: el texto siempre acompaña al color. */
export const categoryAppearances: Readonly<Record<string, CategoryAppearance>> = Object.freeze({
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

export function categoryAppearanceFor(categoryId: string): CategoryAppearance {
  return categoryAppearances[categoryId] ?? fallbackAppearance;
}
