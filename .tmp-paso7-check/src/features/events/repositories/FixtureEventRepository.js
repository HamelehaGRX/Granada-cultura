"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureEventRepository = void 0;
const legacyEvents_1 = require("../../../data/fixtures/legacyEvents");
const FixtureCategoryRepository_1 = require("../../categories/repositories/FixtureCategoryRepository");
const dates_1 = require("../dates");
const mappers_1 = require("../mappers");
class FixtureEventRepository {
    referenceDate;
    includeDemoDistance;
    constructor(options = {}) {
        this.referenceDate = options.referenceDate ?? (0, legacyEvents_1.currentDemoDate)();
        (0, dates_1.dateToEpoch)(this.referenceDate);
        this.includeDemoDistance = options.includeDemoDistance ?? true;
    }
    async list() {
        const categories = await new FixtureCategoryRepository_1.FixtureCategoryRepository().list();
        const ids = new Set();
        return (0, legacyEvents_1.loadLegacyEvents)(this.referenceDate).map(legacy => {
            if (ids.has(legacy.id))
                throw new Error(`Evento duplicado: ${legacy.id}`);
            ids.add(legacy.id);
            if (!Number.isFinite(legacy.distanciaKm) || legacy.distanciaKm < 0) {
                throw new Error(`Distancia demo inválida: ${legacy.id}`);
            }
            const distanceMeters = Math.round(legacy.distanciaKm * 1000);
            if (!Number.isSafeInteger(distanceMeters))
                throw new Error('Distancia fuera de rango');
            return {
                event: (0, mappers_1.mapLegacyEventToEvent)(legacy, categories),
                ...(this.includeDemoDistance ? { distanceMeters } : {}),
            };
        });
    }
    async getById(id) {
        return (await this.list()).find(result => result.event.id === id)?.event ?? null;
    }
}
exports.FixtureEventRepository = FixtureEventRepository;
