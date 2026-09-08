"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATE_PRESETS = void 0;
exports.customDateBounds = customDateBounds;
exports.presetBounds = presetBounds;
exports.matchesDate = matchesDate;
const dates_1 = require("../events/dates");
exports.DATE_PRESETS = [
    { value: 'today', label: 'Hoy' }, { value: 'tomorrow', label: 'Mañana' },
    { value: 'week', label: 'Esta semana' }, { value: 'weekend', label: 'Este fin de semana' },
    { value: 'month', label: 'Este mes' },
];
function customDateBounds(date) {
    if (date.kind !== 'custom')
        return null;
    const end = date.mode === 'single' ? date.start : date.end;
    try {
        (0, dates_1.dateToEpoch)(date.start);
        (0, dates_1.dateToEpoch)(end);
    }
    catch {
        return null;
    }
    return end >= date.start ? [date.start, end] : null;
}
/** Presets desde hoy (no desde el lunes pasado), como en el prototipo. */
function presetBounds(preset, today) {
    const epoch = (0, dates_1.dateToEpoch)(today);
    const weekday = new Date(epoch).getUTCDay() || 7;
    const shift = (days) => new Date(epoch + days * 86_400_000).toISOString().slice(0, 10);
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
function matchesDate(event, date, now) {
    if (date.kind === 'any')
        return true;
    const bounds = date.kind === 'custom' ? customDateBounds(date)
        : presetBounds(date.preset, (0, dates_1.dateInTimeZone)(now, event.location.timeZone));
    if (!bounds)
        return true; // La fecha personalizada incompleta/inválida no se aplica.
    const day = (0, dates_1.dateInTimeZone)(new Date(event.startsAt), event.location.timeZone);
    return day >= bounds[0] && day <= bounds[1];
}
