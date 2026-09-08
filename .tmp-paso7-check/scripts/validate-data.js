"use strict";
/// <reference types="node" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const legacyCategories_1 = require("../src/data/fixtures/legacyCategories");
const legacyEvents_1 = require("../src/data/fixtures/legacyEvents");
const FixtureCategoryRepository_1 = require("../src/features/categories/repositories/FixtureCategoryRepository");
const dates_1 = require("../src/features/events/dates");
const mappers_1 = require("../src/features/events/mappers");
const FixtureEventRepository_1 = require("../src/features/events/repositories/FixtureEventRepository");
const utils_1 = require("../src/features/events/utils");
const validation_1 = require("../src/features/events/validation");
async function main() {
    const categoryRepository = new FixtureCategoryRepository_1.FixtureCategoryRepository();
    const categories = await categoryRepository.list();
    const eventRepository = new FixtureEventRepository_1.FixtureEventRepository({ referenceDate: '2026-09-03' });
    const results = await eventRepository.list();
    const legacy = (0, legacyEvents_1.loadLegacyEvents)('2026-09-03');
    const catalog = (0, legacyCategories_1.loadLegacyCategories)();
    strict_1.default.equal(results.length, 16);
    strict_1.default.equal(new Set(results.map(result => result.event.id)).size, 16);
    strict_1.default.equal(categories.length, 11);
    strict_1.default.equal(categories.reduce((count, category) => count + category.subcategories.length, 0), 59);
    strict_1.default.deepEqual(categories.map(category => category.id), catalog.map(category => category.id));
    for (const category of categories) {
        const original = catalog.find(item => item.id === category.id);
        strict_1.default.equal(category.name, original.nombre);
        strict_1.default.deepEqual(category.subcategories.map(subcategory => subcategory.id), original.subcategorias.map(item => item.id));
        for (const subcategory of category.subcategories)
            strict_1.default.equal(subcategory.categoryId, category.id);
        strict_1.default.deepEqual(await categoryRepository.getById(category.id), category);
    }
    for (const [index, result] of results.entries()) {
        const { event } = result;
        const original = legacy[index];
        (0, validation_1.validateEvent)(event, categories);
        strict_1.default.equal(event.id, original.id);
        strict_1.default.equal(event.title, original.nombre);
        strict_1.default.equal(event.description, original.descripcion);
        strict_1.default.equal(event.artistName, original.artista || undefined);
        strict_1.default.equal(event.location.timeZone, 'Europe/Madrid');
        strict_1.default.equal(event.status, 'scheduled');
        strict_1.default.equal((0, dates_1.dateInTimeZone)(new Date(event.startsAt), event.location.timeZone), original.fecha);
        strict_1.default.equal(new Intl.DateTimeFormat('en-GB', {
            timeZone: event.location.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
        }).format(new Date(event.startsAt)), original.hora);
        strict_1.default.deepEqual(event.price, original.precio === 0
            ? { kind: 'free', currency: 'EUR' }
            : { kind: 'fixed', currency: 'EUR', amountCents: original.precio * 100 });
        strict_1.default.equal(result.distanceMeters, original.distanciaKm * 1000);
        for (const excluded of ['distanciaKm', 'distanceKm', 'distanceMeters', 'fechaBase', 'gratis', 'precio']) {
            strict_1.default.equal(excluded in event, false);
        }
        for (const absent of ['organizerId', 'source', 'ticketUrl', 'endsAt', 'media', 'accessibility']) {
            strict_1.default.equal(absent in event, false);
        }
        strict_1.default.equal(event.location.coordinates, undefined);
        strict_1.default.deepEqual(await eventRepository.getById(event.id), event);
    }
    strict_1.default.equal(results.filter(result => result.event.price.kind === 'free').length, 4);
    strict_1.default.equal(results[0].event.illustrationKey, results[13].event.illustrationKey);
    strict_1.default.equal(results[15].event.illustrationKey, 'generica');
    strict_1.default.equal(await eventRepository.getById('no-existe'), null);
    strict_1.default.equal(await categoryRepository.getById('no-existe'), null);
    strict_1.default.equal(await eventRepository.getById(''), null);
    strict_1.default.equal(await categoryRepository.getById(''), null);
    (0, strict_1.default)((await new FixtureEventRepository_1.FixtureEventRepository({ includeDemoDistance: false }).list())
        .every(result => !('distanceMeters' in result)));
    // El consumidor puede modificar el resultado sin corromper llamadas posteriores.
    results[0].event.location.venueName = 'Modificado por la prueba';
    categories[0].subcategories[0].name = 'Modificado por la prueba';
    strict_1.default.equal((await eventRepository.getById('demo-01'))?.location.venueName, legacy[0].lugar);
    strict_1.default.equal((await categoryRepository.getById('musica'))?.subcategories[0].name, 'Rock');
    const validCategories = await categoryRepository.list();
    const snapshot = JSON.stringify(legacy[0]);
    strict_1.default.deepEqual((0, mappers_1.mapLegacyEventToEvent)(legacy[0], validCategories), (0, mappers_1.mapLegacyEventToEvent)(legacy[0], validCategories));
    strict_1.default.equal(JSON.stringify(legacy[0]), snapshot);
    strict_1.default.equal((0, utils_1.eurosToCents)(12.34), 1234);
    strict_1.default.equal((0, utils_1.eurosToCents)(0.29), 29);
    strict_1.default.equal((0, utils_1.eurosToCents)(0.1 + 0.2), 30);
    for (const invalid of [-1, NaN, Infinity, 1.005, Number.MAX_SAFE_INTEGER]) {
        strict_1.default.throws(() => (0, utils_1.eurosToCents)(invalid));
    }
    (0, validation_1.validateEventPrice)({ kind: 'range', currency: 'EUR', minAmountCents: 0, maxAmountCents: 1200 });
    strict_1.default.throws(() => (0, validation_1.validateEventPrice)({ kind: 'range', currency: 'EUR', minAmountCents: 1200, maxAmountCents: 1000 }));
    strict_1.default.throws(() => (0, validation_1.validateEventPrice)({ kind: 'fixed', currency: 'EUR', amountCents: 0 }));
    strict_1.default.throws(() => (0, validation_1.validateEventPrice)({ kind: 'fixed', currency: 'EUR', amountCents: 1.5 }));
    strict_1.default.equal((0, dates_1.combineDateAndTime)('2026-01-15', '20:30', 'Europe/Madrid'), '2026-01-15T19:30:00.000Z');
    strict_1.default.equal((0, dates_1.combineDateAndTime)('2026-07-15', '20:30', 'Europe/Madrid'), '2026-07-15T18:30:00.000Z');
    strict_1.default.equal((0, dates_1.combineDateAndTime)('2026-03-29', '03:30', 'Europe/Madrid'), '2026-03-29T01:30:00.000Z');
    strict_1.default.equal((0, dates_1.combineDateAndTime)('2026-10-25', '03:30', 'Europe/Madrid'), '2026-10-25T02:30:00.000Z');
    strict_1.default.throws(() => (0, dates_1.combineDateAndTime)('2026-03-29', '02:30', 'Europe/Madrid'));
    strict_1.default.throws(() => (0, dates_1.combineDateAndTime)('2026-10-25', '02:30', 'Europe/Madrid'));
    strict_1.default.throws(() => (0, dates_1.combineDateAndTime)('2026-02-30', '12:00', 'Europe/Madrid'));
    strict_1.default.throws(() => (0, dates_1.combineDateAndTime)('2026-01-01', '24:00', 'Europe/Madrid'));
    strict_1.default.throws(() => (0, dates_1.combineDateAndTime)('2026-01-01', '12:00', 'Invalid/Zone'));
    strict_1.default.equal((0, dates_1.dateToEpoch)('2028-02-29'), Date.parse('2028-02-29T00:00:00Z'));
    strict_1.default.throws(() => (0, dates_1.dateToEpoch)('2026-02-29'));
    strict_1.default.equal((0, dates_1.dateInTimeZone)(new Date('2026-09-03T22:30:00Z'), 'Europe/Madrid'), '2026-09-04');
    for (const referenceDate of ['2026-12-31', '2028-02-28', '2026-03-28', '2026-10-24']) {
        const shifted = await new FixtureEventRepository_1.FixtureEventRepository({ referenceDate }).list();
        strict_1.default.equal((0, dates_1.dateInTimeZone)(new Date(shifted[0].event.startsAt), 'Europe/Madrid'), referenceDate);
        const lastDate = (0, dates_1.dateInTimeZone)(new Date(shifted[15].event.startsAt), 'Europe/Madrid');
        strict_1.default.equal((0, dates_1.dateToEpoch)(lastDate) - (0, dates_1.dateToEpoch)(referenceDate), 14 * 86_400_000);
        for (const result of shifted)
            (0, validation_1.validateEvent)(result.event, validCategories);
    }
    strict_1.default.throws(() => new FixtureEventRepository_1.FixtureEventRepository({ referenceDate: '2026-02-30' }));
    for (const patch of [{ id: ' ' }, { categoria: 'inexistente' }, { subcategoria: 'inexistente' },
        { categoria: 'teatro', subcategoria: 'rock' }, { precio: -1 }, { fecha: '2026-04-31' }, { hora: '99:00' }]) {
        strict_1.default.throws(() => (0, mappers_1.mapLegacyEventToEvent)({ ...legacy[0], ...patch }, validCategories));
    }
    const event = (0, mappers_1.mapLegacyEventToEvent)(legacy[0], validCategories);
    for (const coordinates of [{ latitude: 91, longitude: 0 }, { latitude: 0, longitude: -181 },
        { latitude: NaN, longitude: 0 }, { latitude: 0, longitude: Infinity }]) {
        strict_1.default.throws(() => (0, validation_1.validateEvent)({ ...event, location: { ...event.location, coordinates } }, validCategories));
    }
    (0, validation_1.validateEvent)({ ...event, location: { ...event.location, coordinates: { latitude: 37.18, longitude: -3.6 } } }, validCategories);
    strict_1.default.throws(() => (0, validation_1.validateEvent)({ ...event, startsAt: '2026-09-03T20:30:00' }, validCategories));
    strict_1.default.throws(() => (0, validation_1.validateEvent)({ ...event, startsAt: '2026-02-30T20:30:00Z' }, validCategories));
    strict_1.default.throws(() => (0, validation_1.validateEvent)({ ...event, endsAt: '2020-01-01T00:00:00Z' }, validCategories));
    console.log('OK: 16 eventos; 11 categorías; 59 subcategorías; 4 gratis y 12 de precio fijo.');
    console.log('OK: IDs, relaciones, céntimos, fechas/DST, repositorios, null, aislamiento, coordenadas y distancia derivada.');
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
