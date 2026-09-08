/// <reference types="node" />

import assert from 'node:assert/strict';
import { FixtureEventRepository } from '../src/features/events/repositories/FixtureEventRepository';
import { FixtureCategoryRepository } from '../src/features/categories/repositories/FixtureCategoryRepository';
import { eventCategoryLabel, formatDemoDistance, formatEventDate, formatEventPrice, sortHomeEvents } from '../src/features/events/presentation';
import type { EventResult } from '../src/features/events/types';

async function main() {
  const results = await new FixtureEventRepository({ referenceDate: '2026-09-12' }).list();
  const categories = await new FixtureCategoryRepository().list();
  const snapshot = JSON.stringify(results);
  const sorted = sortHomeEvents(results);
  assert.equal(sorted.length, 16);
  assert.equal(sorted[0].event.id, 'demo-02');
  assert.equal(JSON.stringify(results), snapshot);
  assert.notEqual(sorted, results);
  for (let index = 1; index < sorted.length; index++) {
    assert(Date.parse(sorted[index - 1].event.startsAt) <= Date.parse(sorted[index].event.startsAt));
  }
  const at = (id: string, startsAt: string, distanceMeters?: number): EventResult => ({
    event: { ...results[0].event, id, startsAt }, ...(distanceMeters === undefined ? {} : { distanceMeters }),
  });
  const ties = [at('unknown', '2026-09-12T20:00:00+02:00'), at('far', '2026-09-12T18:00:00Z', 5000),
    at('near', '2026-09-12T18:00:00Z', 1000), at('early', '2026-09-12T17:00:00Z', 9000)];
  assert.deepEqual(sortHomeEvents(ties).map(item => item.event.id), ['early', 'near', 'far', 'unknown']);
  assert.deepEqual(sortHomeEvents([ties[0], { ...ties[0], event: { ...ties[0].event, id: 'unknown2' } }])
    .map(item => item.event.id), ['unknown', 'unknown2']);
  assert.deepEqual(sortHomeEvents([]), []);
  const normalizeSpaces = (value: string) => value.replace(/\s/g, ' ');
  assert.equal(formatEventPrice({ kind: 'free', currency: 'EUR' }), 'Gratis');
  assert.equal(normalizeSpaces(formatEventPrice({ kind: 'fixed', currency: 'EUR', amountCents: 1200 })), '12 €');
  assert.equal(normalizeSpaces(formatEventPrice({ kind: 'fixed', currency: 'EUR', amountCents: 1234 })), '12,34 €');
  assert.equal(normalizeSpaces(formatEventPrice({ kind: 'range', currency: 'EUR', minAmountCents: 1000, maxAmountCents: 2500 })), '10 € — 25 €');
  assert(formatEventDate(results[0].event).includes('20:30'));
  assert(formatEventDate(results[0].event).includes('12'));
  assert(formatEventDate(results[0].event).includes('sept'));
  const winter = { ...results[0].event, startsAt: '2026-01-15T19:30:00Z' };
  assert(formatEventDate(winter).includes('20:30'));
  assert.equal(eventCategoryLabel(results[0].event, categories), 'Música · Rock');
  assert.equal(eventCategoryLabel(results[0].event, []), 'musica · rock');
  assert.equal(formatDemoDistance(undefined), undefined);
  assert.equal(formatDemoDistance(0), 'A 0 km · demo');
  assert.equal(formatDemoDistance(1500), 'A 1,5 km · demo');
  console.log('OK Home: 16 eventos, orden cronológico/offsets/distancia, estabilidad, fechas Madrid, precios y etiquetas.');
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
