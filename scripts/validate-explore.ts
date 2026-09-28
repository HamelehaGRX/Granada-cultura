/// <reference types="node" />
import assert from 'node:assert/strict';

import { FixtureEventRepository } from '../src/features/events/repositories/FixtureEventRepository';
import type { Event, EventPrice, EventStatus } from '../src/features/events/types';
import { COLLECTIONS, collectionPreview, rotateCollections, selectCollections } from '../src/features/explore/collections';
import { assembleExploreEventBlocks, previewEvents, resolveExploreOrder, selectDifferent,
  selectForYou, selectGetaway, selectSoon } from '../src/features/explore/selection';
import type { ExploreCandidate, ExploreContext, ExploreEditorial } from '../src/features/explore/types';

const NOW = new Date('2026-09-03T08:00:00.000Z');
const FREE: EventPrice = { kind: 'free', currency: 'EUR' };
const PAID: EventPrice = { kind: 'fixed', currency: 'EUR', amountCents: 1200 };

async function main() {
  const fixture = await new FixtureEventRepository({ referenceDate: '2026-09-03' }).list();
  const original = JSON.stringify(fixture);
  const base = fixture[0].event;
  const make = (id: string, hours: number, options: {
    distanceKm?: number; status?: EventStatus; categoryId?: string; subcategoryId?: string;
    price?: EventPrice; editorial?: ExploreEditorial; ticketing?: Event['ticketing'];
    endsAt?: string; travel?: ExploreCandidate['travel'];
  } = {}): ExploreCandidate => ({
    result: {
      event: {
        ...base, id, startsAt: new Date(NOW.getTime() + hours * 3_600_000).toISOString(),
        status: options.status ?? 'scheduled', categoryId: options.categoryId ?? 'musica',
        subcategoryId: options.subcategoryId ?? 'rock', price: options.price ?? PAID,
        ...(options.ticketing ? { ticketing: options.ticketing } : { ticketing: undefined }),
        ...(options.endsAt ? { endsAt: options.endsAt } : { endsAt: undefined }),
      },
      distanceMeters: (options.distanceKm ?? 10) * 1000,
    },
    ...(options.editorial ? { editorial: options.editorial } : {}),
    ...(options.travel ? { travel: options.travel } : {}),
  });
  const ids = (items: readonly ExploreCandidate[]) => items.map(item => item.result.event.id);
  const context: ExploreContext = { now: NOW, habitualArea: { radiusKm: 30 }, interactions: {} };

  const soon = [
    make('late', 5), make('old-publication', 1), make('cancelled', 0.5, { status: 'cancelled' }),
    make('ended', -2, { endsAt: new Date(NOW.getTime() - 3_600_000).toISOString() }),
    make('running-long', -24, { endsAt: new Date(NOW.getTime() + 24 * 3_600_000).toISOString() }),
    make('sold', 0.5, { status: 'soldOut' }), make('tomorrow', 25),
    make('outside', 2, { distanceKm: 31 }),
  ];
  soon[1].result.event.source = { provider: 'fixture', lastUpdatedAt: '2020-01-01T00:00:00Z' };
  soon[0].result.event.source = { provider: 'fixture', lastUpdatedAt: '2026-09-03T07:00:00Z' };
  assert.deepEqual(ids(selectSoon(soon, context, 'today')), ['old-publication', 'late', 'sold']);
  assert.deepEqual(ids(selectSoon(soon, context, '3days')), ['old-publication', 'late', 'tomorrow', 'sold']);
  assert.deepEqual(ids(selectSoon([make('rescheduled', 2, { status: 'postponed' })], context)), ['rescheduled']);
  const unknownDistance = make('unknown-distance', 2);
  delete unknownDistance.result.distanceMeters;
  assert.deepEqual(selectSoon([unknownDistance], context), []);
  assert.deepEqual(ids(selectSoon([make('free', 1, { price: FREE }), make('paid', 2)], context, '7days', 'free')), ['free']);
  assert.deepEqual(ids(selectSoon([make('free', 1, { price: FREE }), make('paid', 2)], context, '7days', 'paid')), ['paid']);
  const seventy = Array.from({ length: 70 }, (_, index) => make(`list-${index}`, 1 + index / 100));
  assert.equal(selectSoon(seventy, context).length, 70);
  assert.equal(previewEvents(selectSoon(seventy, context)).length, 7);
  assert.equal(selectSoon([make('day-13', 13 * 24), make('day-14', 14 * 24)], context, '14days').length, 1);

  const varied = [
    ...Array.from({ length: 5 }, (_, index) => make(`rock-${index}`, index + 1)),
    ...Array.from({ length: 5 }, (_, index) => make(`theatre-${index}`, index + 1,
      { categoryId: 'teatro', subcategoryId: 'drama' })),
    ...Array.from({ length: 5 }, (_, index) => make(`history-${index}`, index + 1,
      { categoryId: 'patrimonio', subcategoryId: 'visitas-guiadas' })),
    make('poetry', 6, { categoryId: 'literatura', subcategoryId: 'poesia' }),
  ];
  const diversePreview = previewEvents(selectDifferent(varied, context));
  for (const categoryId of ['musica', 'teatro', 'patrimonio']) {
    assert(diversePreview.filter(item => item.result.event.categoryId === categoryId).length <= 2);
  }
  const known: ExploreContext = { ...context, interactions: {
    'rock-0': { favorite: true, attendance: null },
    'rock-1': { favorite: false, attendance: 'going' },
  } };
  const indirect = make('indirect', 6, { categoryId: 'danza', subcategoryId: 'contemporanea',
    editorial: { provenance: 'demo', relatedCategoryIds: ['musica'] } });
  assert.equal(selectDifferent([...varied, indirect], known)[0].result.event.id, 'indirect');
  const soldOutDifferent = make('sold-other', 1, { status: 'soldOut',
    categoryId: 'cine', subcategoryId: 'documentales' });
  assert.equal(selectDifferent([...varied.slice(0, 8), soldOutDifferent], context).at(-1)?.result.event.id,
    'sold-other');

  const travel: ExploreCandidate['travel'] = {
    distanceKm: 72, durationMinutes: 68, mode: 'car', source: 'demo', originLabel: 'Granada demo',
  };
  const getaway = [make('far-early', 2, { distanceKm: 200 }),
    make('near-late', 24, { distanceKm: 40, travel }),
    make('inside', 1, { distanceKm: 30 }), make('too-far', 1, { distanceKm: 301 })];
  assert.deepEqual(ids(selectGetaway(getaway, context)), ['far-early', 'near-late']);
  assert.deepEqual(ids(selectGetaway(getaway, context, 100)), ['near-late']);
  assert.deepEqual(ids(selectGetaway(getaway, context, 1000)), ['far-early', 'near-late']);
  assert.equal(selectGetaway(getaway, context)[1].travel?.durationMinutes, 68);

  const cheap = make('cheap', 1, { price: { kind: 'fixed', currency: 'EUR', amountCents: 800 },
    ticketing: { statuses: ['available'], totalAmountCents: 950 } });
  const uncertain = make('uncertain', 2, { price: { kind: 'fixed', currency: 'EUR', amountCents: 800 } });
  const costly = make('costly', 3, { price: { kind: 'fixed', currency: 'EUR', amountCents: 900 },
    ticketing: { statuses: ['available'], totalAmountCents: 1100 } });
  const tagged = make('tagged', 4, { categoryId: 'patrimonio', subcategoryId: 'visitas-guiadas',
    price: FREE, editorial: { provenance: 'demo', emergingArtist: true, smallVenue: true,
      hiddenHeritage: true, rural: true, localScene: true, activeParticipation: true,
      neighborhoodId: 'demo-barrio', curiosity: true, nighttime: true } });
  tagged.result.event.practicalInformation = { setting: 'outdoor' };
  const collections = selectCollections([cheap, uncertain, costly, tagged], context);
  assert.deepEqual(ids(collections.find(item => item.id === 'under10')!.events), ['cheap', 'tagged']);
  assert(!collections.some(item => item.id === 'yourNeighborhood' || item.id === 'somethingNew'));
  assert(!collections.some(item => item.id === 'localScene' && item.events.length === 0));
  assert(!selectCollections([uncertain], context).some(item => item.id === 'under10'));
  const withContext = selectCollections([cheap, uncertain, costly, tagged, ...varied], {
    ...known, neighborhoodId: 'demo-barrio',
  });
  assert.equal(withContext.find(item => item.id === 'yourNeighborhood')?.events[0].result.event.id, 'tagged');
  assert(withContext.some(item => item.id === 'somethingNew'));
  assert.equal(COLLECTIONS.length, 12);
  assert.deepEqual(rotateCollections(withContext, 3).map(item => item.id),
    rotateCollections(withContext, 3).map(item => item.id));
  assert(rotateCollections(withContext, 3).length <= 4);
  assert(rotateCollections(withContext, 3).every(item => item.events.length > 0));
  assert(collectionPreview(withContext[0]).length <= 7);

  assert.deepEqual(selectForYou(varied, context), []);
  assert.deepEqual(selectForYou(varied, { ...context, interactions: {
    'rock-0': { favorite: true, attendance: null },
  } }), []);
  const forYou = selectForYou(varied, known);
  assert(forYou.length > 0 && forYou.every(item => item.result.event.categoryId === 'musica'));
  assert(!forYou.some(item => item.result.event.id === 'rock-0' || item.result.event.id === 'rock-1'));
  assert.equal(selectForYou([...varied, make('sold-music', 0.5, { status: 'soldOut' })], known)
    .at(-1)?.result.event.id, 'sold-music');

  const order = resolveExploreOrder();
  assert.deepEqual(order, ['soon', 'different', 'getaway', 'collections', 'forYou']);
  assert.deepEqual(resolveExploreOrder('dynamic', { sessionSeed: 1, includeForYou: false }),
    ['soon', 'getaway', 'collections', 'different']);
  assert.deepEqual(resolveExploreOrder('custom', { customMiddle: ['collections', 'different'] }),
    ['soon', 'collections', 'different', 'getaway', 'forYou']);
  const blocks = assembleExploreEventBlocks(order, {
    soon: [varied[0], varied[1], varied[2]],
    different: [varied[0], varied[3], varied[4], varied[5]],
  });
  assert.deepEqual(ids(blocks[0].preview), ['rock-0', 'rock-1', 'rock-2']);
  assert.deepEqual(ids(blocks[1].preview), ['rock-3', 'rock-4', 'theatre-0']);
  assert.deepEqual(ids(blocks[1].more), ['rock-0', 'rock-3', 'rock-4', 'theatre-0']);
  const longBlock = assembleExploreEventBlocks(order, { soon: seventy });
  assert.equal(longBlock[0].preview.length, 7);
  assert.equal(longBlock[0].more.length, 70);
  assert.equal(longBlock[0].more[0].result.event.id, 'list-7');
  assert(selectCollections([tagged], context).some(item => item.events.some(candidate =>
    candidate.result.event.id === tagged.result.event.id)));
  assert.equal(JSON.stringify(fixture), original);
  console.log('OK Explora: ventanas/precio/estados, 7 + Ver más, diversidad, escapadas y radio, 12 colecciones, señales, orden y deduplicación.');
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
