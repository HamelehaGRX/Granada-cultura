"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortHomeEvents = sortHomeEvents;
exports.formatEventDate = formatEventDate;
exports.formatEventPrice = formatEventPrice;
exports.formatDemoDistance = formatDemoDistance;
exports.eventCategoryLabel = eventCategoryLabel;
/** Orden cronológico real; el offset ISO puede variar entre eventos. No muta la entrada. */
function sortHomeEvents(results) {
    return [...results].sort((a, b) => {
        const chronological = Date.parse(a.event.startsAt) - Date.parse(b.event.startsAt);
        if (chronological !== 0)
            return chronological;
        const distanceA = a.distanceMeters ?? Infinity;
        const distanceB = b.distanceMeters ?? Infinity;
        return distanceA === distanceB ? 0 : distanceA < distanceB ? -1 : 1;
    });
}
function formatEventDate(event) {
    const date = new Date(event.startsAt);
    const options = { timeZone: event.location.timeZone };
    const day = new Intl.DateTimeFormat('es-ES', {
        ...options, weekday: 'short', day: 'numeric', month: 'short',
    }).format(date);
    const hour = new Intl.DateTimeFormat('es-ES', {
        ...options, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).format(date);
    return `${day} · ${hour}`;
}
function formatEventPrice(price) {
    const amount = (cents) => new Intl.NumberFormat('es-ES', {
        style: 'currency', currency: price.currency,
        minimumFractionDigits: cents % 100 === 0 ? 0 : 2, maximumFractionDigits: 2,
    }).format(cents / 100);
    switch (price.kind) {
        case 'free': return 'Gratis';
        case 'fixed': return amount(price.amountCents);
        case 'range': return `${amount(price.minAmountCents)} — ${amount(price.maxAmountCents)}`;
    }
}
function formatDemoDistance(meters) {
    if (meters === undefined)
        return undefined;
    const value = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(meters / 1000);
    return `A ${value} km · demo`;
}
function eventCategoryLabel(event, categories) {
    const category = categories.find(item => item.id === event.categoryId);
    const subcategory = category?.subcategories.find(item => item.id === event.subcategoryId);
    return `${category?.name ?? event.categoryId} · ${subcategory?.name ?? event.subcategoryId}`;
}
