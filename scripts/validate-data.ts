/// <reference types="node" />

import assert from 'node:assert/strict';

import { loadLegacyCategories } from '../src/data/fixtures/legacyCategories';
import { loadLegacyEvents } from '../src/data/fixtures/legacyEvents';
import { FixtureCategoryRepository } from '../src/features/categories/repositories/FixtureCategoryRepository';
import { combineDateAndTime, dateInTimeZone, dateToEpoch } from '../src/features/events/dates';
import { mapLegacyEventToEvent } from '../src/features/events/mappers';
import { FixtureEventRepository } from '../src/features/events/repositories/FixtureEventRepository';
import { eurosToCents } from '../src/features/events/utils';
import { validateEvent, validateEventPrice } from '../src/features/events/validation';

async function main() {
  const categoryRepository = new FixtureCategoryRepository();
  const categories = await categoryRepository.list();
  const eventRepository = new FixtureEventRepository({ referenceDate: '2026-09-03' });
  const results = await eventRepository.list();
  const legacy = loadLegacyEvents('2026-09-03');
  const catalog = loadLegacyCategories();

  assert.equal(results.length, 16);
  assert.equal(new Set(results.map(result => result.event.id)).size, 16);
  assert.equal(categories.length, 11);
  assert.equal(categories.reduce((count, category) => count + category.subcategories.length, 0), 59);
  assert.deepEqual(categories.map(category => category.id), catalog.map(category => category.id));
  for (const category of categories) {
    const original = catalog.find(item => item.id === category.id)!;
    assert.equal(category.name, original.nombre);
    assert.deepEqual(category.subcategories.map(subcategory => subcategory.id), original.subcategorias.map(item => item.id));
    for (const subcategory of category.subcategories) assert.equal(subcategory.categoryId, category.id);
    assert.deepEqual(await categoryRepository.getById(category.id), category);
  }

  for (const [index, result] of results.entries()) {
    const { event } = result;
    const original = legacy[index];
    validateEvent(event, categories);
    assert.equal(event.id, original.id);
    assert.equal(event.title, original.nombre);
    assert.equal(event.description, original.descripcion);
    assert.equal(event.artistName, original.artista || undefined);
    assert.equal(event.location.timeZone, 'Europe/Madrid');
    assert.equal(event.status, 'scheduled');
    assert.equal(dateInTimeZone(new Date(event.startsAt), event.location.timeZone), original.fecha);
    assert.equal(new Intl.DateTimeFormat('en-GB', {
      timeZone: event.location.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).format(new Date(event.startsAt)), original.hora);
    assert.deepEqual(event.price, original.precio === 0
      ? { kind: 'free', currency: 'EUR' }
      : { kind: 'fixed', currency: 'EUR', amountCents: original.precio * 100 });
    assert.equal(result.distanceMeters, original.distanciaKm * 1000);
    for (const excluded of ['distanciaKm', 'distanceKm', 'distanceMeters', 'fechaBase', 'gratis', 'precio']) {
      assert.equal(excluded in event, false);
    }
    for (const absent of ['organizerId', 'source', 'ticketUrl', 'endsAt', 'media', 'accessibility']) {
      assert.equal(absent in event, false);
    }
    assert.equal(event.location.coordinates, undefined);
    assert.deepEqual(await eventRepository.getById(event.id), event);
  }
  assert.equal(results.filter(result => result.event.price.kind === 'free').length, 4);
  assert.equal(results[0].event.illustrationKey, results[13].event.illustrationKey);
  assert.equal(results[15].event.illustrationKey, 'generica');
  assert.equal(await eventRepository.getById('no-existe'), null);
  assert.equal(await categoryRepository.getById('no-existe'), null);
  assert.equal(await eventRepository.getById(''), null);
  assert.equal(await categoryRepository.getById(''), null);
  assert((await new FixtureEventRepository({ includeDemoDistance: false }).list())
    .every(result => !('distanceMeters' in result)));

  // El consumidor puede modificar el resultado sin corromper llamadas posteriores.
  results[0].event.location.venueName = 'Modificado por la prueba';
  categories[0].subcategories[0].name = 'Modificado por la prueba';
  assert.equal((await eventRepository.getById('demo-01'))?.location.venueName, legacy[0].lugar);
  assert.equal((await categoryRepository.getById('musica'))?.subcategories[0].name, 'Rock');
  const validCategories = await categoryRepository.list();
  const snapshot = JSON.stringify(legacy[0]);
  assert.deepEqual(mapLegacyEventToEvent(legacy[0], validCategories), mapLegacyEventToEvent(legacy[0], validCategories));
  assert.equal(JSON.stringify(legacy[0]), snapshot);

  assert.equal(eurosToCents(12.34), 1234);
  assert.equal(eurosToCents(0.29), 29);
  assert.equal(eurosToCents(0.1 + 0.2), 30);
  for (const invalid of [-1, NaN, Infinity, 1.005, Number.MAX_SAFE_INTEGER]) {
    assert.throws(() => eurosToCents(invalid));
  }
  validateEventPrice({ kind: 'range', currency: 'EUR', minAmountCents: 0, maxAmountCents: 1200 });
  assert.throws(() => validateEventPrice({ kind: 'range', currency: 'EUR', minAmountCents: 1200, maxAmountCents: 1000 }));
  assert.throws(() => validateEventPrice({ kind: 'fixed', currency: 'EUR', amountCents: 0 }));
  assert.throws(() => validateEventPrice({ kind: 'fixed', currency: 'EUR', amountCents: 1.5 }));

  assert.equal(combineDateAndTime('2026-01-15', '20:30', 'Europe/Madrid'), '2026-01-15T19:30:00.000Z');
  assert.equal(combineDateAndTime('2026-07-15', '20:30', 'Europe/Madrid'), '2026-07-15T18:30:00.000Z');
  assert.equal(combineDateAndTime('2026-03-29', '03:30', 'Europe/Madrid'), '2026-03-29T01:30:00.000Z');
  assert.equal(combineDateAndTime('2026-10-25', '03:30', 'Europe/Madrid'), '2026-10-25T02:30:00.000Z');
  assert.throws(() => combineDateAndTime('2026-03-29', '02:30', 'Europe/Madrid'));
  assert.throws(() => combineDateAndTime('2026-10-25', '02:30', 'Europe/Madrid'));
  assert.throws(() => combineDateAndTime('2026-02-30', '12:00', 'Europe/Madrid'));
  assert.throws(() => combineDateAndTime('2026-01-01', '24:00', 'Europe/Madrid'));
  assert.throws(() => combineDateAndTime('2026-01-01', '12:00', 'Invalid/Zone'));
  assert.equal(dateToEpoch('2028-02-29'), Date.parse('2028-02-29T00:00:00Z'));
  assert.throws(() => dateToEpoch('2026-02-29'));
  assert.equal(dateInTimeZone(new Date('2026-09-03T22:30:00Z'), 'Europe/Madrid'), '2026-09-04');
  for (const referenceDate of ['2026-12-31', '2028-02-28', '2026-03-28', '2026-10-24']) {
    const shifted = await new FixtureEventRepository({ referenceDate }).list();
    assert.equal(dateInTimeZone(new Date(shifted[0].event.startsAt), 'Europe/Madrid'), referenceDate);
    const lastDate = dateInTimeZone(new Date(shifted[15].event.startsAt), 'Europe/Madrid');
    assert.equal(dateToEpoch(lastDate) - dateToEpoch(referenceDate), 14 * 86_400_000);
    for (const result of shifted) validateEvent(result.event, validCategories);
  }
  assert.throws(() => new FixtureEventRepository({ referenceDate: '2026-02-30' }));

  for (const patch of [{ id: ' ' }, { categoria: 'inexistente' }, { subcategoria: 'inexistente' },
    { categoria: 'teatro', subcategoria: 'rock' }, { precio: -1 }, { fecha: '2026-04-31' }, { hora: '99:00' }]) {
    assert.throws(() => mapLegacyEventToEvent({ ...legacy[0], ...patch }, validCategories));
  }
  const event = mapLegacyEventToEvent(legacy[0], validCategories);
  for (const coordinates of [{ latitude: 91, longitude: 0 }, { latitude: 0, longitude: -181 },
    { latitude: NaN, longitude: 0 }, { latitude: 0, longitude: Infinity }]) {
    assert.throws(() => validateEvent({ ...event, location: { ...event.location, coordinates } }, validCategories));
  }
  validateEvent({ ...event, location: { ...event.location, coordinates: { latitude: 37.18, longitude: -3.6 } } }, validCategories);
  assert.throws(() => validateEvent({ ...event, startsAt: '2026-09-03T20:30:00' }, validCategories));
  assert.throws(() => validateEvent({ ...event, startsAt: '2026-02-30T20:30:00Z' }, validCategories));
  assert.throws(() => validateEvent({ ...event, endsAt: '2020-01-01T00:00:00Z' }, validCategories));

  console.log('OK: 16 eventos; 11 categorías; 59 subcategorías; 4 gratis y 12 de precio fijo.');
  console.log('OK: IDs, relaciones, céntimos, fechas/DST, repositorios, null, aislamiento, coordenadas y distancia derivada.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
