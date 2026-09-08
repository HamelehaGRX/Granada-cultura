"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureCategoryRepository = void 0;
const legacyCategories_1 = require("../../../data/fixtures/legacyCategories");
class FixtureCategoryRepository {
    async list() {
        const ids = new Set();
        return (0, legacyCategories_1.loadLegacyCategories)().map(category => {
            if (!category.id.trim() || !category.nombre.trim() || ids.has(category.id)) {
                throw new Error(`Categoría vacía o duplicada: ${category.id}`);
            }
            ids.add(category.id);
            const subcategoryIds = new Set();
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
    async getById(id) {
        return (await this.list()).find(category => category.id === id) ?? null;
    }
}
exports.FixtureCategoryRepository = FixtureCategoryRepository;
