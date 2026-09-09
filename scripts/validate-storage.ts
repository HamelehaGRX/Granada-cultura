/// <reference types="node" />
import assert from 'node:assert/strict';
import { FixtureCategoryRepository } from '../src/features/categories/repositories/FixtureCategoryRepository';
import { createFilterState, filterReducer } from '../src/features/filters/reducer';
import { defaultPersistedFilters, persistableFilters, restoreFilters } from '../src/features/filters/persistence';
import { createStorage } from '../src/storage/storage';
import { STORAGE_KEYS } from '../src/storage/keys';
import { migrateEnvelope } from '../src/storage/migrations';
import type { StorageDriver, StorageIssue } from '../src/storage/types';

async function main() {
  const catalog = await new FixtureCategoryRepository().list();
  const defaults = createFilterState();
  const envelope = persistableFilters(defaults);
  const decode = (value: unknown) => restoreFilters(value, catalog);
  assert.deepEqual(decode(JSON.parse(JSON.stringify(envelope))), defaultPersistedFilters());
  assert.deepEqual(migrateEnvelope(envelope), envelope);
  for (const value of [null, [], 'corrupto', 1, {}, { version: '1', data: {} },
    { version: 0, data: {} }, { version: 2, data: {} }, { version: 1 }, { version: 1, data: null }]) {
    assert.equal(decode(value), null);
  }
  assert.deepEqual(decode({ version: 1, data: {} }), defaultPersistedFilters());

  let selected = filterReducer(defaults, { type: 'category', id: 'musica' });
  selected = filterReducer(selected, { type: 'subcategory', categoryId: 'musica', id: 'jazz' });
  selected = filterReducer(selected, { type: 'range', kind: 'price', edge: 'max', value: 25 });
  selected = filterReducer(selected, { type: 'range', kind: 'distance', edge: 'max', value: 50 });
  selected = filterReducer(selected, { type: 'query', value: 'jazz' });
  const saved = persistableFilters(selected);
  assert(!Object.hasOwn(saved.data, 'query'));
  assert.deepEqual(decode(saved), saved.data);
  const hydrated = filterReducer({ ...defaults, query: 'entrada deep link' }, { type: 'hydrate', value: saved.data });
  assert.equal(hydrated.query, 'entrada deep link');
  assert.equal(hydrated.price.max, 25);

  const withData = (data: Record<string, unknown>) => decode({ version: 1, data: { ...saved.data, ...data } })!;
  assert.deepEqual(withData({ categories: { musica: ['jazz', 'jazz', 'no-existe'], desaparecida: [] } }).categories,
    { musica: ['jazz'] });
  assert.deepEqual(withData({ categories: { musica: ['desaparecida'] } }).categories, { musica: [] });
  assert.deepEqual(withData({ categories: { musica: 'jazz', cine: [23] } }).categories, {});
  assert.deepEqual(withData({ categories: JSON.parse('{"__proto__":["x"],"constructor":[]}') }).categories, {});
  assert.equal(Object.hasOwn({}, 'polluted'), false);
  for (const kind of ['price', 'distance'] as const) {
    for (const invalid of [null, [], { min: '0', max: 25 }, { min: NaN, max: 50 }, { min: 0, max: Infinity }]) {
      assert.deepEqual(withData({ [kind]: invalid })[kind], { min: 0, max: 1000 });
    }
    assert.deepEqual(withData({ [kind]: { min: -20, max: 1500 } })[kind], { min: 0, max: 1000 });
    assert.deepEqual(withData({ [kind]: { min: 70.4, max: 20.6 } })[kind], { min: 21, max: 70 });
    assert.deepEqual(withData({ [kind]: { min: 0, max: 0 } })[kind], { min: 0, max: 0 });
  }
  for (const preset of ['today', 'tomorrow', 'week', 'weekend', 'month']) {
    const date = { kind: 'preset', preset };
    assert.deepEqual(withData({ date }).date, date);
  }
  const date = { kind: 'custom', mode: 'range', start: '2028-02-29', end: '2028-03-01' };
  assert.deepEqual(withData({ date }).date, date);
  assert.deepEqual(withData({ date: { ...date, mode: 'single' } }).date, { ...date, mode: 'single', end: '' });
  for (const invalid of [null, { kind: 'preset', preset: 'yesterday' }, { ...date, start: '2026-02-29' },
    { ...date, end: '' }, { ...date, end: '2028-02-20' }, { ...date, start: 123 }, { ...date, mode: 'bad' }]) {
    assert.deepEqual(withData({ date: invalid }).date, { kind: 'any' });
  }

  const values = new Map<string, string>();
  const issues: StorageIssue[] = [];
  let writes = 0;
  const driver: StorageDriver = {
    async getItem(key) { return values.get(key) ?? null; },
    async setItem(key, value) { writes++; values.set(key, value); },
    async removeItem(key) { values.delete(key); },
  };
  const storage = createStorage(driver, issue => issues.push(issue));
  const key = STORAGE_KEYS.filters;
  assert.equal((await storage.get(key, decode)).status, 'missing');
  assert(await storage.set(key, saved));
  const read = await storage.get(key, decode);
  assert.equal(read.status, 'value');
  if (read.status === 'value') {
    assert.deepEqual(read.value, saved.data);
    assert.equal(read.serialized, JSON.stringify(saved));
  }
  assert.equal(writes, 1); // Leer/hidratar no escribe defaults.
  for (const raw of ['{broken', 'null', JSON.stringify({ version: 999, data: saved.data })]) {
    values.set(key, raw);
    assert.equal((await storage.get(key, decode)).status, 'invalid');
  }
  assert(await storage.set(key, persistableFilters(filterReducer(selected, { type: 'clear' }))));
  const cleared = await storage.get(key, decode);
  assert(cleared.status === 'value');
  assert.deepEqual(cleared.value, defaultPersistedFilters());
  assert(await storage.remove(key));
  assert.equal((await storage.get(key, decode)).status, 'missing');
  const circular: { self?: unknown } = {};
  circular.self = circular;
  assert.equal(await storage.set(key, circular), false);

  const failure = async (): Promise<never> => { throw new Error('simulated failure'); };
  const failed = createStorage({ getItem: failure, setItem: failure, removeItem: failure }, issue => issues.push(issue));
  assert.equal((await failed.get(key, decode)).status, 'error');
  assert.equal(await failed.set(key, saved), false);
  assert.equal(await failed.remove(key), false);
  assert(issues.includes('read') && issues.includes('write') && issues.includes('remove') && issues.includes('invalid'));

  // Una escritura lenta no puede terminar después de Limpiar y resucitar el filtro anterior.
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let first = true;
  const ordered = createStorage({ ...driver, async setItem(key, value) {
    if (first) { first = false; await gate; }
    await driver.setItem(key, value);
  } });
  const oldWrite = ordered.set(key, saved);
  const cleanWrite = ordered.set(key, envelope);
  const nextRead = ordered.get(key, decode);
  release();
  await Promise.all([oldWrite, cleanWrite]);
  const last = await nextRead;
  assert(last.status === 'value');
  assert.deepEqual(last.value, defaultPersistedFilters());
  assert.equal(JSON.stringify(persistableFilters(selected)), JSON.stringify(saved));
  console.log('OK storage: JSON, v1/migración base, corrupción/versiones desconocidas, catálogo/subcategorías, fechas, rangos, defaults, query excluida, limpieza, errores y orden de escritura/lectura.');
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
