"use strict";
/// <reference types="node" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const FixtureEventRepository_1 = require("../src/features/events/repositories/FixtureEventRepository");
const FixtureCategoryRepository_1 = require("../src/features/categories/repositories/FixtureCategoryRepository");
const presentation_1 = require("../src/features/events/presentation");
async function main() {
    const results = await new FixtureEventRepository_1.FixtureEventRepository({ referenceDate: '2026-09-12' }).list();
    const categories = await new FixtureCategoryRepository_1.FixtureCategoryRepository().list();
    const snapshot = JSON.stringify(results);
    const sorted = (0, presentation_1.sortHomeEvents)(results);
    strict_1.default.equal(sorted.length, 16);
    strict_1.default.equal(sorted[0].event.id, 'demo-02');
    strict_1.default.equal(JSON.stringify(results), snapshot);
    strict_1.default.notEqual(sorted, results);
    for (let index = 1; index < sorted.length; index++) {
        (0, strict_1.default)(Date.parse(sorted[index - 1].event.startsAt) <= Date.parse(sorted[index].event.startsAt));
    }
    const at = (id, startsAt, distanceMeters) => ({
        event: { ...results[0].event, id, startsAt }, ...(distanceMeters === undefined ? {} : { distanceMeters }),
    });
    const ties = [at('unknown', '2026-09-12T20:00:00+02:00'), at('far', '2026-09-12T18:00:00Z', 5000),
        at('near', '2026-09-12T18:00:00Z', 1000), at('early', '2026-09-12T17:00:00Z', 9000)];
    strict_1.default.deepEqual((0, presentation_1.sortHomeEvents)(ties).map(item => item.event.id), ['early', 'near', 'far', 'unknown']);
    strict_1.default.deepEqual((0, presentation_1.sortHomeEvents)([ties[0], { ...ties[0], event: { ...ties[0].event, id: 'unknown2' } }])
        .map(item => item.event.id), ['unknown', 'unknown2']);
    strict_1.default.deepEqual((0, presentation_1.sortHomeEvents)([]), []);
    const normalizeSpaces = (value) => value.replace(/\s/g, ' ');
    strict_1.default.equal((0, presentation_1.formatEventPrice)({ kind: 'free', currency: 'EUR' }), 'Gratis');
    strict_1.default.equal(normalizeSpaces((0, presentation_1.formatEventPrice)({ kind: 'fixed', currency: 'EUR', amountCents: 1200 })), '12 €');
    strict_1.default.equal(normalizeSpaces((0, presentation_1.formatEventPrice)({ kind: 'fixed', currency: 'EUR', amountCents: 1234 })), '12,34 €');
    strict_1.default.equal(normalizeSpaces((0, presentation_1.formatEventPrice)({ kind: 'range', currency: 'EUR', minAmountCents: 1000, maxAmountCents: 2500 })), '10 € — 25 €');
    (0, strict_1.default)((0, presentation_1.formatEventDate)(results[0].event).includes('20:30'));
    (0, strict_1.default)((0, presentation_1.formatEventDate)(results[0].event).includes('12'));
    (0, strict_1.default)((0, presentation_1.formatEventDate)(results[0].event).includes('sept'));
    const winter = { ...results[0].event, startsAt: '2026-01-15T19:30:00Z' };
    (0, strict_1.default)((0, presentation_1.formatEventDate)(winter).includes('20:30'));
    strict_1.default.equal((0, presentation_1.eventCategoryLabel)(results[0].event, categories), 'Música · Rock');
    strict_1.default.equal((0, presentation_1.eventCategoryLabel)(results[0].event, []), 'musica · rock');
    strict_1.default.equal((0, presentation_1.formatDemoDistance)(undefined), undefined);
    strict_1.default.equal((0, presentation_1.formatDemoDistance)(0), 'A 0 km · demo');
    strict_1.default.equal((0, presentation_1.formatDemoDistance)(1500), 'A 1,5 km · demo');
    console.log('OK Home: 16 eventos, orden cronológico/offsets/distancia, estabilidad, fechas Madrid, precios y etiquetas.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
