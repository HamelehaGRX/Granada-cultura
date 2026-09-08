"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eurosToCents = eurosToCents;
exports.optionalText = optionalText;
/** Única frontera que acepta euros del legado; rechaza fracciones de céntimo. */
function eurosToCents(euros) {
    if (!Number.isFinite(euros) || euros < 0)
        throw new Error('Precio no válido');
    const scaled = euros * 100;
    const cents = Math.round(scaled);
    const tolerance = Math.min(0.000001, Number.EPSILON * Math.max(1, scaled) * 4);
    if (!Number.isSafeInteger(cents) || Math.abs(scaled - cents) > tolerance) {
        throw new Error('El precio debe representar céntimos enteros seguros');
    }
    return cents;
}
function optionalText(value) {
    return value.trim() || undefined;
}
