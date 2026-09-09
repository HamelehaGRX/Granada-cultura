export type PersistedEnvelope<T, V extends number = 1> = { version: V; data: T };

/** Puerto mínimo: el adaptador nativo/web queda fuera de la lógica y sus pruebas. */
export interface StorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export type StorageRead<T> =
  | { status: 'value'; value: T; serialized: string }
  | { status: 'missing' | 'invalid' | 'error' };
export type StorageIssue = 'read' | 'write' | 'remove' | 'invalid';
