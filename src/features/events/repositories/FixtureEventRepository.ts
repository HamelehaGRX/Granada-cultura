import { currentDemoDate, loadLegacyEvents } from '../../../data/fixtures/legacyEvents';
import { FixtureCategoryRepository } from '../../categories/repositories/FixtureCategoryRepository';
import { dateToEpoch } from '../dates';
import { mapLegacyEventToEvent } from '../mappers';
import type { Event, EventResult } from '../types';
import type { EventRepository } from './EventRepository';

export type FixtureEventRepositoryOptions = {
  /** Día civil YYYY-MM-DD en Madrid, fijado al crear la instancia. */
  referenceDate?: string;
  includeDemoDistance?: boolean;
};

export class FixtureEventRepository implements EventRepository {
  private readonly referenceDate: string;
  private readonly includeDemoDistance: boolean;

  constructor(options: FixtureEventRepositoryOptions = {}) {
    this.referenceDate = options.referenceDate ?? currentDemoDate();
    dateToEpoch(this.referenceDate);
    this.includeDemoDistance = options.includeDemoDistance ?? true;
  }

  async list(): Promise<EventResult[]> {
    const categories = await new FixtureCategoryRepository().list();
    const ids = new Set<string>();
    return loadLegacyEvents(this.referenceDate).map(legacy => {
      if (ids.has(legacy.id)) throw new Error(`Evento duplicado: ${legacy.id}`);
      ids.add(legacy.id);
      if (!Number.isFinite(legacy.distanciaKm) || legacy.distanciaKm < 0) {
        throw new Error(`Distancia demo inválida: ${legacy.id}`);
      }
      const distanceMeters = Math.round(legacy.distanciaKm * 1000);
      if (!Number.isSafeInteger(distanceMeters)) throw new Error('Distancia fuera de rango');
      return {
        event: mapLegacyEventToEvent(legacy, categories),
        ...(this.includeDemoDistance ? { distanceMeters } : {}),
      };
    });
  }

  async getById(id: string): Promise<Event | null> {
    return (await this.list()).find(result => result.event.id === id)?.event ?? null;
  }
}
