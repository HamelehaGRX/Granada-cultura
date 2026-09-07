import type { Category } from '../types';

/** Retorna datos de dominio; los errores de carga/validación rechazan la promesa. */
export interface CategoryRepository {
  list(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
}
