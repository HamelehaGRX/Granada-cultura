"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLegacyCategories = loadLegacyCategories;
const categorias_json_1 = __importDefault(require("../../../app/data/categorias.json"));
const catalog = categorias_json_1.default;
/** La única importación del catálogo legado queda detrás de esta frontera. */
function loadLegacyCategories() {
    return catalog.categorias.map(category => ({
        ...category,
        subcategorias: category.subcategorias.map(subcategory => ({ ...subcategory })),
    }));
}
