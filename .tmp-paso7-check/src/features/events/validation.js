"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEventPrice = validateEventPrice;
exports.validateEvent = validateEvent;
const dates_1 = require("./dates");
function validateEventPrice(price) {
    if (price.currency !== 'EUR')
        throw new Error('Moneda no soportada');
    const validCents = (amount) => Number.isSafeInteger(amount) && amount >= 0;
    switch (price.kind) {
        case 'free': return;
        case 'fixed':
            if (validCents(price.amountCents) && price.amountCents > 0)
                return;
            break;
        case 'range':
            if (validCents(price.minAmountCents) && validCents(price.maxAmountCents)
                && price.maxAmountCents > price.minAmountCents)
                return;
            break;
    }
    throw new Error('Precio incoherente: usar free para cero y fixed para un único importe');
}
/** Comprobaciones del límite de datos, sin DOM ni librerías de validación. */
function validateEvent(event, categories) {
    for (const value of [event.id, event.title, event.categoryId, event.subcategoryId,
        event.location.venueName, event.location.locality, event.location.timeZone]) {
        if (!value.trim())
            throw new Error('Campo obligatorio vacío en evento');
    }
    const category = categories.find(item => item.id === event.categoryId);
    if (!category?.subcategories.some(item => item.id === event.subcategoryId && item.categoryId === category.id)) {
        throw new Error(`Categoría/subcategoría desconocida: ${event.categoryId}/${event.subcategoryId}`);
    }
    validateEventPrice(event.price);
    (0, dates_1.assertISODateTime)(event.startsAt);
    if (event.endsAt !== undefined) {
        (0, dates_1.assertISODateTime)(event.endsAt);
        if (Date.parse(event.endsAt) < Date.parse(event.startsAt))
            throw new Error('Fin anterior al inicio');
    }
    new Intl.DateTimeFormat('en', { timeZone: event.location.timeZone });
    if (!['scheduled', 'postponed', 'cancelled', 'soldOut'].includes(event.status)) {
        throw new Error('Estado de evento no válido');
    }
    const coordinates = event.location.coordinates;
    if (coordinates && (!Number.isFinite(coordinates.latitude) || Math.abs(coordinates.latitude) > 90
        || !Number.isFinite(coordinates.longitude) || Math.abs(coordinates.longitude) > 180)) {
        throw new Error('Coordenadas fuera de rango');
    }
}
