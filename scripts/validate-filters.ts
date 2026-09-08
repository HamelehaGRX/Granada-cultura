/// <reference types="node" />
import assert from 'node:assert/strict';
import { FixtureEventRepository } from '../src/features/events/repositories/FixtureEventRepository';
import { FixtureCategoryRepository } from '../src/features/categories/repositories/FixtureCategoryRepository';
import { createFilterState, filterReducer } from '../src/features/filters/reducer';
import { customDateBounds, matchesDate, presetBounds } from '../src/features/filters/dates';
import { filterEvents, filterSummaries, matchesPrice } from '../src/features/filters/utils';
import { normalizeSearchText } from '../src/features/search/utils';
import type { FilterAction, FilterState } from '../src/features/filters/types';
import type { EventResult } from '../src/features/events/types';

async function main() {
  const data = await new FixtureEventRepository({ referenceDate: '2026-09-08' }).list();
  const catalog = await new FixtureCategoryRepository().list();
  const now = new Date('2026-09-08T10:00:00Z');
  const snapshot = JSON.stringify({ data, catalog });
  const apply = (...actions: FilterAction[]) => actions.reduce(filterReducer, createFilterState());
  const run = (state: FilterState) => filterEvents(data, state, catalog, now);
  const ids = (state: FilterState) => run(state).map(item => item.event.id);
  assert.equal(run(createFilterState()).length, 16);
  assert.equal(catalog.length, 11);
  assert.equal(catalog.reduce((count, category) => count + category.subcategories.length, 0), 59);
  assert.equal(normalizeSearchText('  MÚSICA Y POESÍA '), 'musica y poesia');
  for (const [query, expected] of [
    ['RITMOS DE AZOTEA', 'demo-01'], ['los dias lentos', 'demo-01'], ['armilla', 'demo-04'],
    ['jardin de la acequia', 'demo-06'], ['poesia', 'demo-03'], ['guitarras', 'demo-01'],
  ]) assert(ids(apply({ type: 'query', value: query })).includes(expected), query);
  assert.equal(run(apply({ type: 'query', value: 'no-existe-xyz' })).length, 0);
  const musicMatches = ids(apply({ type: 'query', value: 'musica' }));
  for (const item of data.filter(item => item.event.categoryId === 'musica')) assert(musicMatches.includes(item.event.id));
  assert.deepEqual(ids(apply({ type: 'date', value: { kind: 'preset', preset: 'today' } })), ['demo-01', 'demo-02', 'demo-03', 'demo-04']);
  assert.deepEqual(ids(apply({ type: 'date', value: { kind: 'preset', preset: 'tomorrow' } })), ['demo-05', 'demo-06']);
  for (const [preset, expected] of [
    ['today', ['2026-09-08', '2026-09-08']], ['tomorrow', ['2026-09-09', '2026-09-09']],
    ['week', ['2026-09-08', '2026-09-13']], ['weekend', ['2026-09-12', '2026-09-13']],
    ['month', ['2026-09-08', '2026-09-30']],
  ] as const) {
    assert.deepEqual(presetBounds(preset, '2026-09-08'), expected);
    assert(run(apply({ type: 'date', value: { kind: 'preset', preset } })).length > 0);
  }
  assert.deepEqual(presetBounds('weekend', '2026-09-13'), ['2026-09-13', '2026-09-13']);
  assert.deepEqual(presetBounds('tomorrow', '2026-12-31'), ['2027-01-01', '2027-01-01']);
  assert.deepEqual(presetBounds('month', '2028-02-10'), ['2028-02-10', '2028-02-29']);
  const single = { kind: 'custom', mode: 'single', start: '2026-09-09', end: '' } as const;
  assert.deepEqual(ids(apply({ type: 'date', value: single })), ['demo-05', 'demo-06']);
  assert.equal(run(apply({ type: 'date', value: { ...single, mode: 'range', start: '2026-09-08', end: '2026-09-09' } })).length, 6);
  for (const date of [{ ...single, start: '2026-02-30' }, { ...single, mode: 'range' as const, end: '' },
    { ...single, mode: 'range' as const, end: '2026-09-01' }]) {
    assert.equal(customDateBounds(date), null);
    const state = apply({ type: 'date', value: date });
    assert.equal(run(state).length, 16);
    assert.equal(filterSummaries(state, catalog).date, '');
  }
  const midnight = { ...data[0].event, startsAt: '2026-09-08T22:30:00Z' };
  assert(matchesDate(midnight, { kind: 'preset', preset: 'tomorrow' }, now));
  assert(!matchesDate(midnight, { kind: 'preset', preset: 'today' }, now));
  const dst = { ...midnight, startsAt: '2026-10-25T01:30:00Z' };
  assert(matchesDate(dst, { kind: 'custom', mode: 'single', start: '2026-10-25', end: '' }, now));
  assert.equal(run(apply({ type: 'range', kind: 'price', edge: 'max', value: 0 })).length, 4);
  for (const [min, max] of [[0, 1000], [0, 25], [5, 12], [10, 10]]) {
    const state = apply({ type: 'range', kind: 'price', edge: 'min', value: min }, { type: 'range', kind: 'price', edge: 'max', value: max });
    const expected = data.filter(({ event }) => {
      const cents = event.price.kind === 'fixed' ? event.price.amountCents : 0;
      return cents >= min * 100 && cents <= max * 100;
    });
    assert.deepEqual(run(state), expected);
  }
  assert(matchesPrice({ kind: 'range', currency: 'EUR', minAmountCents: 1000, maxAmountCents: 2500 }, { min: 25, max: 40 }));
  assert(!matchesPrice({ kind: 'range', currency: 'EUR', minAmountCents: 1000, maxAmountCents: 2500 }, { min: 26, max: 40 }));
  assert(!matchesPrice({ kind: 'fixed', currency: 'EUR', amountCents: 2534 }, { min: 0, max: 25 }));
  for (const [min, max] of [[0, 1000], [0, 50], [3, 9]]) {
    const state = apply({ type: 'range', kind: 'distance', edge: 'min', value: min }, { type: 'range', kind: 'distance', edge: 'max', value: max });
    assert.deepEqual(run(state), data.filter(item => item.distanceMeters! >= min * 1000 && item.distanceMeters! <= max * 1000));
  }
  const unknown: EventResult = { event: data[0].event };
  assert.equal(filterEvents([unknown], createFilterState(), catalog, now).length, 1);
  assert.equal(filterEvents([unknown], apply({ type: 'range', kind: 'distance', edge: 'max', value: 50 }), catalog, now).length, 0);
  const category: FilterAction = { type: 'category', id: 'musica' };
  const rock: FilterAction = { type: 'subcategory', categoryId: 'musica', id: 'rock' };
  const jazz: FilterAction = { type: 'subcategory', categoryId: 'musica', id: 'jazz' };
  assert.deepEqual(ids(apply(category, rock)), ['demo-01', 'demo-14']);
  assert.deepEqual(ids(apply(category, rock, jazz)), ['demo-01', 'demo-06', 'demo-14']);
  assert(ids(apply(category, rock, { type: 'category', id: 'cine' })).includes('demo-04'));
  assert.deepEqual(apply(category, rock, category).categories, {});
  assert.deepEqual(apply(rock).categories, {});
  assert.equal(filterSummaries(createFilterState(), catalog).price, '');
  assert.equal(filterSummaries(createFilterState(), catalog).distance, '');
  const combined = apply(category, jazz, { type: 'query', value: 'bruma' },
    { type: 'date', value: { kind: 'preset', preset: 'tomorrow' } },
    { type: 'range', kind: 'price', edge: 'max', value: 25 },
    { type: 'range', kind: 'distance', edge: 'max', value: 50 });
  assert.deepEqual(ids(combined), ['demo-06']);
  assert.equal(run(filterReducer(combined, { type: 'clear' })).length, 16);
  for (const kind of ['price', 'distance'] as const) {
    const crossed = apply({ type: 'range', kind, edge: 'max', value: 20 }, { type: 'range', kind, edge: 'min', value: 30 });
    assert.deepEqual(crossed[kind], { min: 30, max: 30 });
    assert.deepEqual(filterReducer(crossed, { type: 'range', kind, edge: 'max', value: -4 })[kind], { min: 0, max: 0 });
    assert.equal(apply({ type: 'range', kind, edge: 'min', value: 1001 })[kind].min, 1000);
    assert.deepEqual(apply({ type: 'range', kind, edge: 'min', value: NaN }), createFilterState());
  }
  assert.equal(JSON.stringify({ data, catalog }), snapshot);
  console.log('OK filtros: búsqueda 7 campos/acentos, 5 presets, fechas/DST, rangos inclusivos, céntimos, distancia desconocida, AND/OR, invariantes, limpieza a 16 y ausencia de mutación.');
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
