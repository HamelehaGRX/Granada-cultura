import data from '../../../app/data/categorias.json';

export type LegacyCategoryFixture = {
  id: string;
  nombre: string;
  subcategorias: { id: string; nombre: string; archivo: string | null }[];
};

const catalog: { categorias: LegacyCategoryFixture[] } = data;

/** La única importación del catálogo legado queda detrás de esta frontera. */
export function loadLegacyCategories(): LegacyCategoryFixture[] {
  return catalog.categorias.map(category => ({
    ...category,
    subcategorias: category.subcategorias.map(subcategory => ({ ...subcategory })),
  }));
}
