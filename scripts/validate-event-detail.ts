/// <reference types="node" />
import assert from 'node:assert/strict';

import { FixtureCategoryRepository } from '../src/features/categories/repositories/FixtureCategoryRepository';
import { FixtureEventRepository } from '../src/features/events/repositories/FixtureEventRepository';
import { eventInteractionReducer, interactionFor } from '../src/features/events/interactions/state';
import { persistableEventInteractions, restoreEventInteractions } from '../src/features/events/interactions/persistence';
import type { EventInteractionMap } from '../src/features/events/interactions/types';
import { selectRelatedEvents } from '../src/features/events/relatedEvents';
import { getSafeTicketingAction, ticketingNeedsSafetyNotice } from '../src/features/events/ticketing';
import type { EventTicketing } from '../src/features/events/types';
import { createStorage } from '../src/storage/storage';
import { STORAGE_KEYS } from '../src/storage/keys';
import type { StorageDriver } from '../src/storage/types';
import { categoryAppearances } from '../src/theme/categoryAppearances';
import { colors } from '../src/theme/colors';

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first: string, second: string) {
  const values = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

async function main() {
  const results = await new FixtureEventRepository({ referenceDate: '2026-09-03' }).list();
  const categories = await new FixtureCategoryRepository().list();
  const byId = (id: string) => results.find(result => result.event.id === id)!.event;
  const ticketingWithUrl = (url: string, verifiedOfficial = true): EventTicketing => ({
    statuses: ['available'], action: { kind: 'purchase', url, verifiedOfficial },
  });

  assert.equal(getSafeTicketingAction(byId('demo-01').ticketing)?.label, 'Comprar entradas');
  assert.equal(getSafeTicketingAction(byId('demo-07').ticketing)?.label, 'Reservar plaza');
  assert.equal(getSafeTicketingAction(byId('demo-09').ticketing)?.label, 'Inscribirse');
  assert.equal(getSafeTicketingAction(byId('demo-15').ticketing), null);
  assert.equal(getSafeTicketingAction(byId('demo-16').ticketing), null);
  assert.equal(getSafeTicketingAction(ticketingWithUrl('https://example.org/entradas'))?.label, 'Comprar entradas');
  assert.equal(getSafeTicketingAction(ticketingWithUrl('http://example.org/entradas')), null);
  assert(ticketingNeedsSafetyNotice(ticketingWithUrl('http://example.org/entradas')));
  assert.equal(getSafeTicketingAction(ticketingWithUrl('https://example.org/entradas', false)), null);
  assert.equal(getSafeTicketingAction(ticketingWithUrl('javascript:alert(1)')), null);
  assert.equal(getSafeTicketingAction(ticketingWithUrl('data:text/html,unsafe')), null);
  assert.equal(getSafeTicketingAction(ticketingWithUrl('file:///tmp/entradas.html')), null);
  assert.equal(getSafeTicketingAction(ticketingWithUrl('cultura://entradas/demo-01')), null);
  assert(ticketingNeedsSafetyNotice(byId('demo-16').ticketing));
  assert.equal(byId('demo-02').ticketing?.statuses.includes('free'), true);
  assert.equal(byId('demo-04').changeNotice?.kind, 'time');
  assert.equal(byId('demo-05').status, 'postponed');
  assert.equal(byId('demo-12').program?.length, 3);
  assert.equal(byId('demo-16').accessibility, undefined);

  assert.deepEqual(Object.keys(categoryAppearances).sort(), categories.map(category => category.id).sort());
  for (const appearance of Object.values(categoryAppearances)) {
    assert.match(appearance.primary, /^#[0-9a-f]{6}$/i);
    assert.match(appearance.soft, /^#[0-9a-f]{6}$/i);
    assert(contrastRatio(appearance.primary, appearance.soft) >= 4.5);
    assert(contrastRatio(colors.interestIndicator, appearance.soft) >= 4.5);
  }
  assert(contrastRatio(colors.brandPrimary, colors.textInverse) >= 4.5);

  let interactions: EventInteractionMap = {};
  interactions = eventInteractionReducer(interactions, { type: 'toggleFavorite', eventId: 'demo-01' });
  interactions = eventInteractionReducer(interactions, {
    type: 'toggleAttendance', eventId: 'demo-01', attendance: 'interested',
  });
  assert.deepEqual(interactionFor(interactions, 'demo-01'), { favorite: true, attendance: 'interested' });
  interactions = eventInteractionReducer(interactions, {
    type: 'toggleAttendance', eventId: 'demo-01', attendance: 'going',
  });
  assert.deepEqual(interactionFor(interactions, 'demo-01'), { favorite: true, attendance: 'going' });
  interactions = eventInteractionReducer(interactions, {
    type: 'toggleAttendance', eventId: 'demo-01', attendance: 'going',
  });
  assert.deepEqual(interactionFor(interactions, 'demo-01'), { favorite: true, attendance: null });

  const envelope = persistableEventInteractions(interactions);
  assert.deepEqual(restoreEventInteractions(JSON.parse(JSON.stringify(envelope))), interactions);
  assert.equal(restoreEventInteractions({ version: 2, data: envelope.data }), null);
  assert.deepEqual(restoreEventInteractions({ version: 1, data: { events: {
    valid: { favorite: true, attendance: null }, invalid: { favorite: 'sí', attendance: 'going' },
  } } }), { valid: { favorite: true, attendance: null } });

  const values = new Map<string, string>();
  const driver: StorageDriver = {
    async getItem(key) { return values.get(key) ?? null; },
    async setItem(key, value) { values.set(key, value); },
    async removeItem(key) { values.delete(key); },
  };
  const storage = createStorage(driver);
  assert(await storage.set(STORAGE_KEYS.eventInteractions, envelope));
  const restored = await storage.get(STORAGE_KEYS.eventInteractions, restoreEventInteractions);
  assert(restored.status === 'value');
  assert.deepEqual(restored.value, interactions);

  const related = selectRelatedEvents(byId('demo-01'), results, interactions);
  assert(related.length <= 4);
  assert(!related.some(result => result.event.id === 'demo-01'));
  assert(!related.some(result => result.event.status === 'cancelled'));
  assert(related.filter(result => result.event.popularity === 'significant').length <= 1);
  const unrelated = selectRelatedEvents(byId('demo-02'), results, {});
  assert(!unrelated.some(result => result.event.id === 'demo-06'));

  console.log('OK detalle: estados personales, persistencia v1, CTA HTTPS, bloqueo no verificado y relacionados.');
  console.log('OK visual: granate con contraste y 11 apariencias de categoría centralizadas.');
  console.log('OK fixtures: pago, gratuito, agotado, cambio, aplazado, reserva, inscripción, programas y accesibilidad desconocida.');
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
