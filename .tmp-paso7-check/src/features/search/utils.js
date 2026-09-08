"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSearchText = normalizeSearchText;
exports.eventSearchText = eventSearchText;
function normalizeSearchText(value) {
    return (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
function eventSearchText(event, categories) {
    const category = categories.find(item => item.id === event.categoryId);
    const subcategory = category?.subcategories.find(item => item.id === event.subcategoryId);
    return [event.title, event.artistName, event.location.locality, event.location.venueName,
        category?.name, subcategory?.name, event.description].map(normalizeSearchText).join(' ');
}
