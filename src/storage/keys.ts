/** La versión pertenece al contenido para poder migrar sin buscar claves antiguas. */
export const STORAGE_KEYS = { filters: 'cultura.filters' } as const;
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
