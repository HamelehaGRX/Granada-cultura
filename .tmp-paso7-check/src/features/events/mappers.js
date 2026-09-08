"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLegacyEventToEvent = mapLegacyEventToEvent;
const dates_1 = require("./dates");
const utils_1 = require("./utils");
const validation_1 = require("./validation");
/** Adaptador puro; recibe la fecha ya preparada por la capa de fixtures. */
function mapLegacyEventToEvent(legacy, categories) {
    const amountCents = (0, utils_1.eurosToCents)(legacy.precio);
    const subcategory = categories.find(category => category.id === legacy.categoria)
        ?.subcategories.find(item => item.id === legacy.subcategoria);
    const description = (0, utils_1.optionalText)(legacy.descripcion);
    const artistName = (0, utils_1.optionalText)(legacy.artista);
    const timeZone = 'Europe/Madrid';
    const event = {
        id: legacy.id,
        title: legacy.nombre.trim(),
        ...(description ? { description } : {}),
        ...(artistName ? { artistName } : {}),
        categoryId: legacy.categoria,
        subcategoryId: legacy.subcategoria,
        startsAt: (0, dates_1.combineDateAndTime)(legacy.fecha, legacy.hora, timeZone),
        location: { venueName: legacy.lugar.trim(), locality: legacy.localidad.trim(), timeZone },
        price: amountCents === 0
            ? { kind: 'free', currency: 'EUR' }
            : { kind: 'fixed', currency: 'EUR', amountCents },
        illustrationKey: subcategory?.illustrationKey ?? 'generica',
        status: 'scheduled',
    };
    (0, validation_1.validateEvent)(event, categories);
    return event;
}
