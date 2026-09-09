import type { StorageKey } from './keys';
import type { StorageDriver, StorageIssue, StorageRead } from './types';

/** JSON no es un contrato: cada lectura exige un decodificador runtime. */
export function createStorage(driver: StorageDriver, report: (issue: StorageIssue) => void = () => {}) {
  // Conserva el orden de cambios rápidos y de una lectura tras desmontar/remontar Home.
  let pending: Promise<unknown> = Promise.resolve();
  function ordered<T>(operation: () => Promise<T>): Promise<T> {
    const result = pending.then(operation);
    pending = result.catch(() => {});
    return result;
  }
  return {
    get<T>(key: StorageKey, decode: (value: unknown) => T | null): Promise<StorageRead<T>> {
      return ordered(async () => {
        let serialized: string | null;
        try { serialized = await driver.getItem(key); }
        catch { report('read'); return { status: 'error' }; }
        if (serialized === null) return { status: 'missing' };
        try {
          const value = decode(JSON.parse(serialized) as unknown);
          if (value !== null) return { status: 'value', value, serialized };
        } catch { /* JSON o esquema inválido: el consumidor utiliza defaults. */ }
        report('invalid');
        return { status: 'invalid' };
      });
    },
    set<T>(key: StorageKey, value: T): Promise<boolean> {
      // Captura el snapshot antes de encolarlo, sin retener objetos mutables del consumidor.
      let serialized: string;
      try {
        const json = JSON.stringify(value);
        if (json === undefined) throw new Error('Not JSON');
        serialized = json;
      } catch { report('write'); return Promise.resolve(false); }
      return ordered(async () => {
        try { await driver.setItem(key, serialized); return true; }
        catch { report('write'); return false; }
      });
    },
    remove(key: StorageKey): Promise<boolean> {
      return ordered(async () => {
        try { await driver.removeItem(key); return true; }
        catch { report('remove'); return false; }
      });
    },
  };
}
