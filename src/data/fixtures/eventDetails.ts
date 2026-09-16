import { combineDateAndTime, dateInTimeZone, dateToEpoch } from '../../features/events/dates';
import type { Event, EventTicketing } from '../../features/events/types';

function localDay(event: Event) {
  return dateInTimeZone(new Date(event.startsAt), event.location.timeZone);
}

function addDays(day: string, amount: number) {
  return new Date(dateToEpoch(day) + amount * 86_400_000).toISOString().slice(0, 10);
}

function at(event: Event, time: string, offsetDays = 0) {
  return combineDateAndTime(addDays(localDay(event), offsetDays), time, event.location.timeZone);
}

function ticketing(event: Event, statuses: EventTicketing['statuses'],
  action?: EventTicketing['action'], pricing?: Partial<EventTicketing>): EventTicketing {
  const baseAmountCents = event.price.kind === 'fixed' ? event.price.amountCents : undefined;
  return { statuses, ...(action ? { action } : {}), ...(baseAmountCents === undefined ? {} : { baseAmountCents }), ...pricing };
}

function officialUrl(event: Event, suffix = '') {
  return `https://example.org/cultura-demo/eventos/${event.id}${suffix}`;
}

function common(event: Event): Event {
  const organizer = event.categoryId === 'musica'
    ? { id: 'org-musica-demo', name: 'Circuito Musical de Muestra', type: 'Organizador ficticio' }
    : { id: 'org-cultural-demo', name: 'Red Cultural de Muestra', type: 'Entidad ficticia' };
  return {
    ...event,
    location: { ...event.location, province: 'Granada' },
    shortDescription: event.description,
    organizer,
    organizerId: organizer.id,
    source: {
      provider: 'Fuente oficial de demostración',
      url: officialUrl(event),
      verifiedOfficial: true,
      lastCheckedAt: at(event, '09:00', -1),
      lastUpdatedAt: at(event, '09:00', -1),
    },
    popularity: 'standard',
  };
}

/** Datos demo enriquecidos, separados del formato legado y sin fuentes externas reales. */
export function applyEventDetailFixture(input: Event): Event {
  const event = common(input);
  switch (event.id) {
    case 'demo-01':
      return {
        ...event,
        doorTime: '19:45', durationMinutes: 120, ageRestriction: 'Todos los públicos',
        location: { ...event.location, address: 'Calle de muestra, 12', coordinates: { latitude: 37.176, longitude: -3.597 } },
        ticketing: ticketing(event, ['available'],
          { kind: 'purchase', url: officialUrl(event, '/entradas'), verifiedOfficial: true },
          { feesAmountCents: 150, totalAmountCents: 1350 }),
        program: [{ items: [
          { time: '19:45', title: 'Apertura de puertas' },
          { time: '20:00', title: 'Artista invitado', detail: 'Dúo Horizonte' },
          { time: '20:30', title: 'Los Días Lentos' },
        ] }],
        accessibility: { wheelchairAccessible: true, accessibleToilet: true },
        practicalInformation: { setting: 'outdoor', publicTransport: 'Paradas urbanas a menos de 10 minutos.' },
      };
    case 'demo-02':
      return {
        ...event,
        ticketing: ticketing(event, ['free', 'freeCapacity']),
        accessibility: { wheelchairAccessible: true, notes: 'Acceso principal sin escalones.' },
        practicalInformation: { setting: 'indoor' },
      };
    case 'demo-04':
      return {
        ...event,
        changeNotice: {
          kind: 'time', title: 'Horario actualizado', summary: 'La sesión comenzará más tarde de lo previsto.',
          currentValue: 'Ahora: 21:00', previousValue: 'Anteriormente: 20:30', updatedAt: at(event, '12:00', -1),
        },
        ticketing: ticketing(event, ['available'],
          { kind: 'purchase', url: officialUrl(event, '/entradas'), verifiedOfficial: true },
          { feesMayApply: true }),
      };
    case 'demo-05': {
      return {
        ...event,
        status: 'postponed',
        changeNotice: {
          kind: 'postponed', title: 'Evento aplazado', summary: 'La organización ha confirmado una nueva fecha.',
          currentValue: 'Consulta la nueva fecha en la información principal.',
          previousValue: 'La fecha inicialmente anunciada queda anulada.', updatedAt: at(event, '10:00'),
        },
        ticketing: ticketing(event, ['notYetAvailable']),
      };
    }
    case 'demo-06':
      return {
        ...event,
        sponsored: true, popularity: 'significant', doorTime: '20:30', durationMinutes: 150,
        ticketing: ticketing(event, ['lastTickets'],
          { kind: 'purchase', url: officialUrl(event, '/entradas'), verifiedOfficial: true },
          { feesAmountCents: 100, totalAmountCents: 1100 }),
        program: [{ label: 'Programa', items: [
          { time: '20:30', title: 'Apertura' }, { time: '21:00', title: 'Cuarteto Vega' },
          { time: '22:00', title: 'Trío Bruma' },
        ] }],
        practicalInformation: { setting: 'outdoor', notes: ['Se recomienda llevar una prenda ligera de abrigo.'] },
      };
    case 'demo-07':
      return {
        ...event,
        ticketing: ticketing(event, ['reservationRequired'],
          { kind: 'reservation', url: officialUrl(event, '/reservas'), verifiedOfficial: true }),
        ageRestriction: 'Actividad familiar recomendada desde 5 años',
      };
    case 'demo-09':
      return {
        ...event,
        ticketing: ticketing(event, ['registrationRequired'],
          { kind: 'registration', url: officialUrl(event, '/inscripcion'), verifiedOfficial: true },
          { feesMayApply: false }),
        durationMinutes: 90,
      };
    case 'demo-12':
      return {
        ...event,
        endsAt: at(event, '21:00', 2),
        ticketing: ticketing(event, ['free', 'freeCapacity']),
        program: [
          { label: 'Día 1', items: [{ time: '18:00', title: 'Apertura del mercado' }, { time: '20:00', title: 'Música itinerante' }] },
          { label: 'Día 2', items: [{ time: '11:00', title: 'Taller de oficios' }, { time: '19:00', title: 'Espectáculo de plaza' }] },
          { label: 'Día 3', items: [{ time: '12:00', title: 'Pasacalles' }, { time: '21:00', title: 'Cierre' }] },
        ],
        practicalInformation: { setting: 'outdoor', parking: 'Aparcamiento disuasorio señalizado en el acceso.' },
      };
    case 'demo-15':
      return {
        ...event,
        status: 'soldOut',
        ticketing: ticketing(event, ['soldOut']),
        doorTime: '20:15',
      };
    case 'demo-16':
      return {
        ...event,
        ticketing: ticketing(event, ['unverified'],
          { kind: 'purchase', url: 'https://example.net/enlace-no-verificado', verifiedOfficial: false }),
      };
    default:
      return event.price.kind === 'free'
        ? { ...event, ticketing: ticketing(event, ['free']) }
        : { ...event, ticketing: ticketing(event, ['notYetAvailable']) };
  }
}
