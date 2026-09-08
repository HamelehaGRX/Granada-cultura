"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
const strict_1 = __importDefault(require("node:assert/strict"));
const FixtureEventRepository_1 = require("../src/features/events/repositories/FixtureEventRepository");
const FixtureCategoryRepository_1 = require("../src/features/categories/repositories/FixtureCategoryRepository");
const reducer_1 = require("../src/features/filters/reducer");
const dates_1 = require("../src/features/filters/dates");
const utils_1 = require("../src/features/filters/utils");
const utils_2 = require("../src/features/search/utils");
async function main() {
    const data = await new FixtureEventRepository_1.FixtureEventRepository({ referenceDate: '2026-09-08' }).list();
    const catalog = await new FixtureCategoryRepository_1.FixtureCategoryRepository().list();
    const now = new Date('2026-09-08T10:00:00Z');
    const snapshot = JSON.stringify({ data, catalog });
    const apply = (...actions) => actions.reduce(reducer_1.filterReducer, (0, reducer_1.createFilterState)());
    const run = (state) => (0, utils_1.filterEvents)(data, state, catalog, now);
    const ids = (state) => run(state).map(item => item.event.id);
    strict_1.default.equal(run((0, reducer_1.createFilterState)()).length, 16);
    strict_1.default.equal(catalog.length, 11);
    strict_1.default.equal(catalog.reduce((count, category) => count + category.subcategories.length, 0), 59);
    strict_1.default.equal((0, utils_2.normalizeSearchText)('  MÚSICA Y POESÍA '), 'musica y poesia');
    for (const [query, expected] of [
        ['RITMOS DE AZOTEA', 'demo-01'], ['los dias lentos', 'demo-01'], ['armilla', 'demo-04'],
        ['jardin de la acequia', 'demo-06'], ['poesia', 'demo-03'], ['guitarras', 'demo-01'],
    ])
        (0, strict_1.default)(ids(apply({ type: 'query', value: query })).includes(expected), query);
    strict_1.default.equal(run(apply({ type: 'query', value: 'no-existe-xyz' })).length, 0);
    const musicMatches = ids(apply({ type: 'query', value: 'musica' }));
    for (const item of data.filter(item => item.event.categoryId === 'musica'))
        (0, strict_1.default)(musicMatches.includes(item.event.id));
    strict_1.default.deepEqual(ids(apply({ type: 'date', value: { kind: 'preset', preset: 'today' } })), ['demo-01', 'demo-02', 'demo-03', 'demo-04']);
    strict_1.default.deepEqual(ids(apply({ type: 'date', value: { kind: 'preset', preset: 'tomorrow' } })), ['demo-05', 'demo-06']);
    for (const [preset, expected] of [
        ['today', ['2026-09-08', '2026-09-08']], ['tomorrow', ['2026-09-09', '2026-09-09']],
        ['week', ['2026-09-08', '2026-09-13']], ['weekend', ['2026-09-12', '2026-09-13']],
        ['month', ['2026-09-08', '2026-09-30']],
    ]) {
        strict_1.default.deepEqual((0, dates_1.presetBounds)(preset, '2026-09-08'), expected);
        (0, strict_1.default)(run(apply({ type: 'date', value: { kind: 'preset', preset } })).length > 0);
    }
    strict_1.default.deepEqual((0, dates_1.presetBounds)('weekend', '2026-09-13'), ['2026-09-13', '2026-09-13']);
    strict_1.default.deepEqual((0, dates_1.presetBounds)('tomorrow', '2026-12-31'), ['2027-01-01', '2027-01-01']);
    strict_1.default.deepEqual((0, dates_1.presetBounds)('month', '2028-02-10'), ['2028-02-10', '2028-02-29']);
    const single = { kind: 'custom', mode: 'single', start: '2026-09-09', end: '' };
    strict_1.default.deepEqual(ids(apply({ type: 'date', value: single })), ['demo-05', 'demo-06']);
    strict_1.default.equal(run(apply({ type: 'date', value: { ...single, mode: 'range', start: '2026-09-08', end: '2026-09-09' } })).length, 6);
    for (const date of [{ ...single, start: '2026-02-30' }, { ...single, mode: 'range', end: '' },
        { ...single, mode: 'range', end: '2026-09-01' }]) {
        strict_1.default.equal((0, dates_1.customDateBounds)(date), null);
        const state = apply({ type: 'date', value: date });
        strict_1.default.equal(run(state).length, 16);
        strict_1.default.equal((0, utils_1.filterSummaries)(state, catalog).date, '');
    }
    const midnight = { ...data[0].event, startsAt: '2026-09-08T22:30:00Z' };
    (0, strict_1.default)((0, dates_1.matchesDate)(midnight, { kind: 'preset', preset: 'tomorrow' }, now));
    (0, strict_1.default)(!(0, dates_1.matchesDate)(midnight, { kind: 'preset', preset: 'today' }, now));
    const dst = { ...midnight, startsAt: '2026-10-25T01:30:00Z' };
    (0, strict_1.default)((0, dates_1.matchesDate)(dst, { kind: 'custom', mode: 'single', start: '2026-10-25', end: '' }, now));
    strict_1.default.equal(run(apply({ type: 'range', kind: 'price', edge: 'max', value: 0 })).length, 4);
    for (const [min, max] of [[0, 1000], [0, 25], [5, 12], [10, 10]]) {
        const state = apply({ type: 'range', kind: 'price', edge: 'min', value: min }, { type: 'range', kind: 'price', edge: 'max', value: max });
        const expected = data.filter(({ event }) => {
            const cents = event.price.kind === 'fixed' ? event.price.amountCents : 0;
            return cents >= min * 100 && cents <= max * 100;
        });
        strict_1.default.deepEqual(run(state), expected);
    }
    (0, strict_1.default)((0, utils_1.matchesPrice)({ kind: 'range', currency: 'EUR', minAmountCents: 1000, maxAmountCents: 2500 }, { min: 25, max: 40 }));
    (0, strict_1.default)(!(0, utils_1.matchesPrice)({ kind: 'range', currency: 'EUR', minAmountCents: 1000, maxAmountCents: 2500 }, { min: 26, max: 40 }));
    (0, strict_1.default)(!(0, utils_1.matchesPrice)({ kind: 'fixed', currency: 'EUR', amountCents: 2534 }, { min: 0, max: 25 }));
    for (const [min, max] of [[0, 1000], [0, 50], [3, 9]]) {
        const state = apply({ type: 'range', kind: 'distance', edge: 'min', value: min }, { type: 'range', kind: 'distance', edge: 'max', value: max });
        strict_1.default.deepEqual(run(state), data.filter(item => item.distanceMeters >= min * 1000 && item.distanceMeters <= max * 1000));
    }
    const unknown = { event: data[0].event };
    strict_1.default.equal((0, utils_1.filterEvents)([unknown], (0, reducer_1.createFilterState)(), catalog, now).length, 1);
    strict_1.default.equal((0, utils_1.filterEvents)([unknown], apply({ type: 'range', kind: 'distance', edge: 'max', value: 50 }), catalog, now).length, 0);
    const category = { type: 'category', id: 'musica' };
    const rock = { type: 'subcategory', categoryId: 'musica', id: 'rock' };
    const jazz = { type: 'subcategory', categoryId: 'musica', id: 'jazz' };
    strict_1.default.deepEqual(ids(apply(category, rock)), ['demo-01', 'demo-14']);
    strict_1.default.deepEqual(ids(apply(category, rock, jazz)), ['demo-01', 'demo-06', 'demo-14']);
    (0, strict_1.default)(ids(apply(category, rock, { type: 'category', id: 'cine' })).includes('demo-04'));
    strict_1.default.deepEqual(apply(category, rock, category).categories, {});
    strict_1.default.deepEqual(apply(rock).categories, {});
    strict_1.default.equal((0, utils_1.filterSummaries)((0, reducer_1.createFilterState)(), catalog).price, '');
    strict_1.default.equal((0, utils_1.filterSummaries)((0, reducer_1.createFilterState)(), catalog).distance, '');
    const combined = apply(category, jazz, { type: 'query', value: 'bruma' }, { type: 'date', value: { kind: 'preset', preset: 'tomorrow' } }, { type: 'range', kind: 'price', edge: 'max', value: 25 }, { type: 'range', kind: 'distance', edge: 'max', value: 50 });
    strict_1.default.deepEqual(ids(combined), ['demo-06']);
    strict_1.default.equal(run((0, reducer_1.filterReducer)(combined, { type: 'clear' })).length, 16);
    for (const kind of ['price', 'distance']) {
        const crossed = apply({ type: 'range', kind, edge: 'max', value: 20 }, { type: 'range', kind, edge: 'min', value: 30 });
        strict_1.default.deepEqual(crossed[kind], { min: 30, max: 30 });
        strict_1.default.deepEqual((0, reducer_1.filterReducer)(crossed, { type: 'range', kind, edge: 'max', value: -4 })[kind], { min: 0, max: 0 });
        strict_1.default.equal(apply({ type: 'range', kind, edge: 'min', value: 1001 })[kind].min, 1000);
        strict_1.default.deepEqual(apply({ type: 'range', kind, edge: 'min', value: NaN }), (0, reducer_1.createFilterState)());
    }
    strict_1.default.equal(JSON.stringify({ data, catalog }), snapshot);
    console.log('OK filtros: búsqueda 7 campos/acentos, 5 presets, fechas/DST, rangos inclusivos, céntimos, distancia desconocida, AND/OR, invariantes, limpieza a 16 y ausencia de mutación.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
