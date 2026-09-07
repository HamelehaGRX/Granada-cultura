import data from '../../../app/data/eventos.json';
import { dateInTimeZone, dateToEpoch } from '../../features/events/dates';

/** Contrato exacto del registro actual: gratis se representa con precio === 0. */
export type LegacyEventFixture = {
  id: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  fecha: string;
  hora: string;
  lugar: string;
  localidad: string;
  precio: number;
  distanciaKm: number;
  descripcion: string;
  artista: string;
};

type LegacyEventCatalog = {
  version: string;
  demo: boolean;
  fechaBase: string;
  events: LegacyEventFixture[];
};

const catalog: LegacyEventCatalog = data;
export const LEGACY_TIME_ZONE = 'Europe/Madrid';

/** Día de referencia por defecto para la demo, siempre en la zona del piloto. */
export function currentDemoDate(): string {
  return dateInTimeZone(new Date(), LEGACY_TIME_ZONE);
}

/**
 * Copias independientes. El desplazamiento de fechaBase es exclusivo de este
 * adaptador temporal y usa días civiles, no duraciones locales de 24 horas.
 */
export function loadLegacyEvents(referenceDate: string): LegacyEventFixture[] {
  const reference = dateToEpoch(referenceDate);
  const base = dateToEpoch(catalog.fechaBase);
  return catalog.events.map(event => {
    const source = dateToEpoch(event.fecha);
    const fecha = catalog.demo
      ? new Date(reference + source - base).toISOString().slice(0, 10)
      : event.fecha;
    dateToEpoch(fecha);
    return { ...event, fecha };
  });
}
