import { dateInTimeZone, dateToEpoch } from '../events/dates';
import type { Event } from '../events/types';
import type { DateFilterValue, DatePreset } from './types';

export const DATE_PRESETS: ReadonlyArray<{ value: DatePreset; label: string }> = [
  { value: 'today', label: 'Hoy' }, { value: 'tomorrow', label: 'Mañana' },
  { value: 'week', label: 'Esta semana' }, { value: 'weekend', label: 'Este fin de semana' },
  { value: 'month', label: 'Este mes' },
];
export function customDateBounds(date: DateFilterValue): [string, string] | null {
  if (date.kind !== 'custom') return null;
  const end = date.mode === 'single' ? date.start : date.end;
  try { dateToEpoch(date.start); dateToEpoch(end); } catch { return null; }
  return end >= date.start ? [date.start, end] : null;
}

/** Presets desde hoy (no desde el lunes pasado), como en el prototipo. */
export function presetBounds(preset: DatePreset, today: string): [string, string] {
  const epoch = dateToEpoch(today);
  const weekday = new Date(epoch).getUTCDay() || 7;
  const shift = (days: number) => new Date(epoch + days * 86_400_000).toISOString().slice(0, 10);
  switch (preset) {
    case 'today': return [today, today];
    case 'tomorrow': return [shift(1), shift(1)];
    case 'week': return [today, shift(7 - weekday)];
    case 'weekend': return [shift(Math.max(0, 6 - weekday)), shift(7 - weekday)];
    case 'month': {
      const end = new Date(epoch);
      end.setUTCMonth(end.getUTCMonth() + 1, 0);
      return [today, end.toISOString().slice(0, 10)];
    }
  }
}

export function matchesDate(event: Event, date: DateFilterValue, now: Date): boolean {
  if (date.kind === 'any') return true;
  const bounds = date.kind === 'custom' ? customDateBounds(date)
    : presetBounds(date.preset, dateInTimeZone(now, event.location.timeZone));
  if (!bounds) return true; // La fecha personalizada incompleta/inválida no se aplica.
  const day = dateInTimeZone(new Date(event.startsAt), event.location.timeZone);
  return day >= bounds[0] && day <= bounds[1];
}
