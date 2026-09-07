import { loadLegacyCategories } from '../../../data/fixtures/legacyCategories';
import type { Category } from '../types';
import type { CategoryRepository } from './CategoryRepository';

export class FixtureCategoryRepository implements CategoryRepository {
  async list(): Promise<Category[]> {
    const ids = new Set<string>();
    return loadLegacyCategories().map(category => {
      if (!category.id.trim() || !category.nombre.trim() || ids.has(category.id)) {
        throw new Error(`Categoría vacía o duplicada: ${category.id}`);
      }
      ids.add(category.id);
      const subcategoryIds = new Set<string>();
      return {
        id: category.id,
        name: category.nombre.trim(),
        subcategories: category.subcategorias.map(subcategory => {
          if (!subcategory.id.trim() || !subcategory.nombre.trim() || subcategoryIds.has(subcategory.id)) {
            throw new Error(`Subcategoría vacía o duplicada: ${category.id}/${subcategory.id}`);
          }
          subcategoryIds.add(subcategory.id);
          return {
            id: subcategory.id,
            categoryId: category.id,
            name: subcategory.nombre.trim(),
            // Clave semántica; no es una ruta SVG ni una importación de assets.
            illustrationKey: subcategory.archivo ? `${category.id}/${subcategory.id}` : 'generica',
          };
        }),
      };
    });
  }

  async getById(id: string): Promise<Category | null> {
    return (await this.list()).find(category => category.id === id) ?? null;
  }
}
