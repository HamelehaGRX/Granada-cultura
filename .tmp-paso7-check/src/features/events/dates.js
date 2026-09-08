"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateToEpoch = dateToEpoch;
exports.dateInTimeZone = dateInTimeZone;
exports.combineDateAndTime = combineDateAndTime;
exports.assertISODateTime = assertISODateTime;
/** Convierte un día civil en un ordinal UTC, sin depender de la zona del equipo. */
function dateToEpoch(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
        throw new Error(`Fecha inválida: ${date}`);
    const value = new Date(`${date}T00:00:00.000Z`);
    if (!Number.isFinite(value.getTime()) || value.toISOString().slice(0, 10) !== date) {
        throw new Error(`Fecha inválida: ${date}`);
    }
    return value.getTime();
}
function formatter(timeZone) {
    return new Intl.DateTimeFormat('en-GB', {
        timeZone, calendar: 'gregory', numberingSystem: 'latn',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
}
function localParts(date, format) {
    const parts = format.formatToParts(date);
    const part = (name) => {
        const value = parts.find(item => item.type === name)?.value;
        if (value === undefined)
            throw new Error(`Falta el componente de fecha: ${name}`);
        return value;
    };
    return {
        date: `${part('year').padStart(4, '0')}-${part('month')}-${part('day')}`,
        time: `${part('hour')}:${part('minute')}:${part('second')}`,
    };
}
function dateInTimeZone(instant, timeZone) {
    return localParts(instant, formatter(timeZone)).date;
}
/**
 * Hora civil HH:mm → instante UTC. Comprueba los offsets a ambos lados del día
 * para detectar cambios de horario. Rechaza horas inexistentes o ambiguas:
 * el formato legado no contiene un offset que permita decidir entre ellas.
 */
function combineDateAndTime(date, time, timeZone) {
    const midnight = dateToEpoch(date);
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
        throw new Error(`Hora inválida: ${time}`);
    const [hours, minutes] = time.split(':').map(Number);
    const wallTime = midnight + (hours * 60 + minutes) * 60_000;
    const format = formatter(timeZone);
    const offsets = new Set();
    for (const delta of [-86_400_000, 0, 86_400_000]) {
        const sample = wallTime + delta;
        const parts = localParts(new Date(sample), format);
        offsets.add(Date.parse(`${parts.date}T${parts.time}Z`) - sample);
    }
    const candidates = [...offsets].map(offset => wallTime - offset).filter(candidate => {
        const parts = localParts(new Date(candidate), format);
        return parts.date === date && parts.time === `${time}:00`;
    });
    if (candidates.length !== 1) {
        throw new Error(`Hora inexistente o ambigua en ${timeZone}: ${date} ${time}`);
    }
    return new Date(candidates[0]).toISOString();
}
function assertISODateTime(value) {
    if (!/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(value)) {
        throw new Error(`Instante ISO sin formato u offset válido: ${value}`);
    }
    dateToEpoch(value.slice(0, 10));
    if (!Number.isFinite(Date.parse(value)))
        throw new Error(`Instante inválido: ${value}`);
}
