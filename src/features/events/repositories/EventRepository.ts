import type { Event, EventResult } from '../types';

/** Sin consultas complejas por ahora. Los errores rechazan la promesa. */
export interface EventRepository {
  list(): Promise<EventResult[]>;
  getById(id: string): Promise<Event | null>;
}
