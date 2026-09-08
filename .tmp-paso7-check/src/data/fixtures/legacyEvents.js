"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_TIME_ZONE = void 0;
exports.currentDemoDate = currentDemoDate;
exports.loadLegacyEvents = loadLegacyEvents;
const eventos_json_1 = __importDefault(require("../../../app/data/eventos.json"));
const dates_1 = require("../../features/events/dates");
const catalog = eventos_json_1.default;
exports.LEGACY_TIME_ZONE = 'Europe/Madrid';
/** Día de referencia por defecto para la demo, siempre en la zona del piloto. */
function currentDemoDate() {
    return (0, dates_1.dateInTimeZone)(new Date(), exports.LEGACY_TIME_ZONE);
}
/**
 * Copias independientes. El desplazamiento de fechaBase es exclusivo de este
 * adaptador temporal y usa días civiles, no duraciones locales de 24 horas.
 */
function loadLegacyEvents(referenceDate) {
    const reference = (0, dates_1.dateToEpoch)(referenceDate);
    const base = (0, dates_1.dateToEpoch)(catalog.fechaBase);
    return catalog.events.map(event => {
        const source = (0, dates_1.dateToEpoch)(event.fecha);
        const fecha = catalog.demo
            ? new Date(reference + source - base).toISOString().slice(0, 10)
            : event.fecha;
        (0, dates_1.dateToEpoch)(fecha);
        return { ...event, fecha };
    });
}
