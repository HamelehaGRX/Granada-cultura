const STORAGE_KEY = "granada-cultura-events-v1";
const PREF_KEY = "granada-cultura-prefs-v1";

const categories = [
  "Conciertos", "Teatro", "Cine", "Exposiciones", "Flamenco y danza",
  "Charlas y talleres", "Literatura", "Patrimonio", "Infantil y familiar",
  "Ferias y fiestas", "Otros"
];

const statusLabels = {
  none: "Sin marcar",
  interested: "Me interesa",
  going: "Voy a ir",
  discarded: "Descartado"
};

const demoEvents = (() => {
  const now = new Date();
  const add = (days, hour = 19, minute = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d;
  };
  const isoDate = d => d.toISOString().slice(0, 10);
  const isoTime = d => d.toTimeString().slice(0, 5);

  const data = [
    {
      title: "Concierto de cámara — evento de demostración",
      category: "Conciertos",
      venue: "Auditorio de ejemplo",
      city: "Granada",
      address: "Centro de Granada",
      start: add(0, 20, 30),
      price: 0,
      priceText: "Entrada gratuita",
      description: "Evento ficticio incluido para mostrar el funcionamiento de la agenda.",
      notes: "Puedes eliminar todos los ejemplos desde el aviso superior."
    },
    {
      title: "Visita teatralizada — evento de demostración",
      category: "Teatro",
      venue: "Espacio cultural de ejemplo",
      city: "Granada",
      address: "Albaicín, Granada",
      start: add(1, 18, 0),
      price: 12,
      priceText: "12 €",
      description: "Ficha ficticia para probar filtros, favoritos y calendario.",
      notes: ""
    },
    {
      title: "Exposición temporal — evento de demostración",
      category: "Exposiciones",
      venue: "Museo de ejemplo",
      city: "Granada",
      address: "Granada",
      start: add(3, 10, 0),
      price: 5,
      priceText: "Entrada general 5 €",
      description: "Evento ficticio de muestra.",
      notes: ""
    },
    {
      title: "Taller cultural — evento de demostración",
      category: "Charlas y talleres",
      venue: "Centro cívico de ejemplo",
      city: "Armilla",
      address: "Armilla, Granada",
      start: add(6, 17, 30),
      price: 0,
      priceText: "Gratuito con inscripción",
      description: "Evento ficticio para comprobar el filtrado por municipio.",
      notes: ""
    }
  ];

  return data.map((e, i) => ({
    id: "demo-" + (i + 1),
    title: e.title,
    category: e.category,
    city: e.city,
    venue: e.venue,
    address: e.address,
    date: isoDate(e.start),
    time: isoTime(e.start),
    endDate: "",
    endTime: "",
    price: e.price,
    priceText: e.priceText,
    description: e.description,
    notes: e.notes,
    url: "",
    favorite: false,
    status: "none",
    demo: true,
    createdAt: new Date().toISOString()
  }));
})();

let events = loadEvents();
let prefs = loadPrefs();
let currentRange = "today";
let currentView = "list";
let currentDialogId = null;
let calendarCursor = new Date();

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoEvents));
      return [...demoEvents];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...demoEvents];
  } catch {
    return [...demoEvents];
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  renderAll();
}

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY)) || {};
  } catch {
    return {};
  }
}

function savePrefs() {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function eventDateTime(event, useEnd = false) {
  const date = useEnd && event.endDate ? event.endDate : event.date;
  const time = useEnd && event.endTime ? event.endTime : (event.time || "00:00");
  if (!date) return null;
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0);
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay() || 7;
  return addDays(d, 1 - day);
}

function getRangeBounds(range) {
  const today = startOfDay();
  if (range === "today") return [today, endOfDay(today)];
  if (range === "tomorrow") {
    const tomorrow = addDays(today, 1);
    return [tomorrow, endOfDay(tomorrow)];
  }
  if (range === "week") {
    const start = startOfWeek(today);
    return [start, endOfDay(addDays(start, 6))];
  }
  if (range === "weekend") {
    const start = startOfWeek(today);
    const saturday = addDays(start, 5);
    return [saturday, endOfDay(addDays(saturday, 1))];
  }
  if (range === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    return [start, end];
  }
  return [null, null];
}

function isEventInRange(event, range) {
  if (range === "all") return true;
  const date = eventDateTime(event);
  if (!date) return false;
  const [start, end] = getRangeBounds(range);
  return date >= start && date <= end;
}

function formatDate(event) {
  const d = eventDateTime(event);
  if (!d) return "Fecha pendiente";
  const datePart = new Intl.DateTimeFormat("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(d);
  return event.time ? `${datePart}, ${event.time}` : datePart;
}

function priceLabel(event) {
  if (event.priceText?.trim()) return event.priceText.trim();
  if (event.price === 0 || event.price === "0") return "Gratis";
  if (event.price !== "" && event.price != null) return `${Number(event.price).toLocaleString("es-ES")} €`;
  return "Precio no indicado";
}

function isFree(event) {
  return Number(event.price) === 0 || /gratis|gratuito|entrada libre/i.test(event.priceText || "");
}

function filteredEvents() {
  const search = $("#searchInput").value.trim().toLowerCase();
  const category = $("#categoryFilter").value;
  const price = $("#priceFilter").value;
  const city = $("#cityFilter").value;
  const status = $("#statusFilter").value;

  return events
    .filter(e => isEventInRange(e, currentRange))
    .filter(e => !category || e.category === category)
    .filter(e => !city || e.city === city)
    .filter(e => !price || (price === "free" ? isFree(e) : !isFree(e)))
    .filter(e => !status || (status === "none" ? (!e.status || e.status === "none") : e.status === status))
    .filter(e => {
      if (!search) return true;
      return [e.title, e.venue, e.city, e.category, e.description]
        .some(v => String(v || "").toLowerCase().includes(search));
    })
    .sort((a, b) => eventDateTime(a) - eventDateTime(b));
}

function eventCard(event) {
  const d = eventDateTime(event);
  const day = d ? String(d.getDate()).padStart(2, "0") : "—";
  const month = d ? new Intl.DateTimeFormat("es-ES", { month: "short" }).format(d).replace(".", "") : "";
  const free = isFree(event);
  const status = event.status && event.status !== "none" ? statusLabels[event.status] : "";
  return `
    <article class="event-card" data-id="${escapeHtml(event.id)}" tabindex="0">
      <div class="date-box">
        <span>${escapeHtml(month)}</span>
        <strong>${day}</strong>
      </div>
      <div>
        <span class="category-badge">${escapeHtml(event.category || "Otros")}</span>
        <h3 class="event-title">${escapeHtml(event.title)}</h3>
        <div class="event-meta">
          <span>◷ ${escapeHtml(event.time || "Hora pendiente")}</span>
          <span>⌖ ${escapeHtml(event.venue || event.city || "Lugar pendiente")}</span>
          ${event.city && event.venue ? `<span>${escapeHtml(event.city)}</span>` : ""}
        </div>
      </div>
      <div class="event-side">
        <div>
          <span class="price-badge ${free ? "free" : ""}">${escapeHtml(priceLabel(event))}</span>
          ${status ? `<span class="status-badge">${escapeHtml(status)}</span>` : ""}
        </div>
        <button class="favorite-btn ${event.favorite ? "active" : ""}" data-favorite="${escapeHtml(event.id)}" type="button" aria-label="Favorito">${event.favorite ? "★" : "☆"}</button>
      </div>
    </article>
  `;
}

function renderList(list, container, emptyEl) {
  container.innerHTML = list.map(eventCard).join("");
  emptyEl.classList.toggle("hidden", list.length > 0);
  bindCardActions(container);
}

function bindCardActions(container) {
  container.querySelectorAll(".event-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest("[data-favorite]")) return;
      openEvent(card.dataset.id);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter") openEvent(card.dataset.id);
    });
  });
  container.querySelectorAll("[data-favorite]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.favorite);
    });
  });
}

function renderFilters() {
  const selectedCategory = $("#categoryFilter").value;
  const selectedCity = $("#cityFilter").value;
  $("#categoryFilter").innerHTML = `<option value="">Todas</option>` +
    categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  $("#categoryFilter").value = selectedCategory;

  const cities = [...new Set(events.map(e => e.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  $("#cityFilter").innerHTML = `<option value="">Todos</option>` +
    cities.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  $("#cityFilter").value = selectedCity;

  $("#categoryInput").innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
}

function renderAgenda() {
  const list = filteredEvents();
  renderList(list, $("#eventList"), $("#emptyState"));
  const labels = {
    today: "Hoy", tomorrow: "Mañana", week: "Esta semana",
    weekend: "Este fin de semana", month: "Este mes", all: "Todos los eventos"
  };
  $("#rangeLabel").textContent = labels[currentRange];
  $("#resultTitle").textContent = `${list.length} ${list.length === 1 ? "evento" : "eventos"}`;
  $("#eventList").classList.toggle("hidden", currentView !== "list");
  $("#calendarView").classList.toggle("hidden", currentView !== "calendar");
  if (currentView === "calendar") renderCalendar();
}

function renderFavorites() {
  const list = events.filter(e => e.favorite).sort((a, b) => eventDateTime(a) - eventDateTime(b));
  renderList(list, $("#favoriteList"), $("#favoriteEmpty"));
}

function renderDemoNotice() {
  $("#demoNotice").classList.toggle("hidden", !events.some(e => e.demo));
}

function renderAll() {
  renderFilters();
  renderAgenda();
  renderFavorites();
  renderDemoNotice();
}

function toggleFavorite(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;
  event.favorite = !event.favorite;
  saveEvents();
  showToast(event.favorite ? "Guardado en favoritos" : "Eliminado de favoritos");
  if (currentDialogId === id) updateDialog(event);
}

function nextStatus(current = "none") {
  const order = ["none", "interested", "going", "discarded"];
  return order[(order.indexOf(current) + 1) % order.length];
}

function cycleStatus(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;
  event.status = nextStatus(event.status || "none");
  saveEvents();
  showToast(`Estado: ${statusLabels[event.status]}`);
  updateDialog(event);
}

function openEvent(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;
  currentDialogId = id;
  updateDialog(event);
  $("#eventDialog").showModal();
}

function updateDialog(event) {
  $("#dialogCategory").textContent = event.category || "Otros";
  $("#dialogTitle").textContent = event.title;
  const meta = [
    `Fecha: ${formatDate(event)}`,
    event.venue ? `Lugar: ${event.venue}` : "",
    event.address ? `Dirección: ${event.address}` : "",
    event.city ? `Municipio: ${event.city}` : "",
    `Precio: ${priceLabel(event)}`
  ].filter(Boolean);
  $("#dialogMeta").innerHTML = meta.map(m => `<div>${escapeHtml(m)}</div>`).join("");
  $("#dialogDescription").textContent = event.description || "Sin descripción.";
  $("#dialogNotesWrap").classList.toggle("hidden", !event.notes);
  $("#dialogNotes").textContent = event.notes || "";
  $("#dialogFavoriteBtn").textContent = event.favorite ? "Quitar favorito" : "Guardar favorito";
  $("#dialogStatusBtn").textContent = `Estado: ${statusLabels[event.status || "none"]}`;

  const mapQuery = [event.venue, event.address, event.city, "Granada"].filter(Boolean).join(", ");
  $("#dialogMapsBtn").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  $("#dialogMapsBtn").classList.toggle("hidden", !mapQuery);
  $("#dialogUrlBtn").href = event.url || "#";
  $("#dialogUrlBtn").classList.toggle("hidden", !event.url);
}

function closeDialog() {
  if ($("#eventDialog").open) $("#eventDialog").close();
  currentDialogId = null;
}

function editEvent(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;
  closeDialog();
  switchTab("form");
  $("#formTitle").textContent = "Editar evento";
  $("#eventId").value = event.id;
  $("#titleInput").value = event.title || "";
  $("#categoryInput").value = event.category || categories[0];
  $("#cityInput").value = event.city || "Granada";
  $("#dateInput").value = event.date || "";
  $("#timeInput").value = event.time || "";
  $("#endDateInput").value = event.endDate || "";
  $("#endTimeInput").value = event.endTime || "";
  $("#venueInput").value = event.venue || "";
  $("#addressInput").value = event.address || "";
  $("#priceInput").value = event.price ?? "";
  $("#priceTextInput").value = event.priceText || "";
  $("#descriptionInput").value = event.description || "";
  $("#urlInput").value = event.url || "";
  $("#notesInput").value = event.notes || "";
  $("#cancelEditBtn").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  $("#eventForm").reset();
  $("#eventId").value = "";
  $("#cityInput").value = "Granada";
  $("#formTitle").textContent = "Añadir evento";
  $("#cancelEditBtn").classList.add("hidden");
  $("#dateInput").value = dateKey(new Date());
}

function handleSubmit(e) {
  e.preventDefault();
  const id = $("#eventId").value || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  const existing = events.find(ev => ev.id === id);
  const record = {
    id,
    title: $("#titleInput").value.trim(),
    category: $("#categoryInput").value,
    city: $("#cityInput").value.trim(),
    date: $("#dateInput").value,
    time: $("#timeInput").value,
    endDate: $("#endDateInput").value,
    endTime: $("#endTimeInput").value,
    venue: $("#venueInput").value.trim(),
    address: $("#addressInput").value.trim(),
    price: $("#priceInput").value === "" ? "" : Number($("#priceInput").value),
    priceText: $("#priceTextInput").value.trim(),
    description: $("#descriptionInput").value.trim(),
    url: $("#urlInput").value.trim(),
    notes: $("#notesInput").value.trim(),
    favorite: existing?.favorite || false,
    status: existing?.status || "none",
    demo: false,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existing) {
    events = events.map(ev => ev.id === id ? record : ev);
    showToast("Evento actualizado");
  } else {
    events.push(record);
    showToast("Evento añadido");
  }
  saveEvents();
  resetForm();
  switchTab("agenda");
  currentRange = "all";
  updateRangeButtons();
}

function deleteEvent(id) {
  const event = events.find(e => e.id === id);
  if (!event) return;
  if (!confirm(`¿Eliminar “${event.title}”?`)) return;
  events = events.filter(e => e.id !== id);
  closeDialog();
  saveEvents();
  showToast("Evento eliminado");
}

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const first = new Date(year, month, 1);
  const start = addDays(first, -((first.getDay() || 7) - 1));
  const monthEvents = filteredEvents();

  let cells = "";
  for (let i = 0; i < 42; i++) {
    const day = addDays(start, i);
    const key = dateKey(day);
    const sameMonth = day.getMonth() === month;
    const isToday = key === dateKey(new Date());
    const dayEvents = monthEvents.filter(e => e.date === key);
    cells += `
      <div class="calendar-day ${sameMonth ? "" : "muted"} ${isToday ? "today" : ""}">
        <span class="calendar-number">${day.getDate()}</span>
        ${dayEvents.slice(0, 3).map(e => `<button class="calendar-event" data-open="${escapeHtml(e.id)}" type="button">${escapeHtml(e.time ? `${e.time} · ${e.title}` : e.title)}</button>`).join("")}
        ${dayEvents.length > 3 ? `<span class="calendar-more">+${dayEvents.length - 3} más</span>` : ""}
      </div>
    `;
  }

  $("#calendarView").innerHTML = `
    <div class="calendar-head">
      <button id="prevMonthBtn" type="button">‹</button>
      <strong>${new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(first)}</strong>
      <button id="nextMonthBtn" type="button">›</button>
    </div>
    <div class="calendar-weekdays">
      ${["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => `<div>${d}</div>`).join("")}
    </div>
    <div class="calendar-grid">${cells}</div>
  `;

  $("#prevMonthBtn").addEventListener("click", () => {
    calendarCursor = new Date(year, month - 1, 1);
    renderCalendar();
  });
  $("#nextMonthBtn").addEventListener("click", () => {
    calendarCursor = new Date(year, month + 1, 1);
    renderCalendar();
  });
  $$("[data-open]").forEach(btn => btn.addEventListener("click", () => openEvent(btn.dataset.open)));
}

function exportData() {
  const payload = {
    app: "Granada Cultura",
    version: 1,
    exportedAt: new Date().toISOString(),
    events,
    prefs
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  downloadBlob(blob, `granada-cultura-${dateKey(new Date())}.json`);
  showToast("Copia exportada");
}

async function importData(file) {
  try {
    const payload = JSON.parse(await file.text());
    const imported = Array.isArray(payload) ? payload : payload.events;
    if (!Array.isArray(imported)) throw new Error("Formato no válido");
    if (!confirm(`Se importarán ${imported.length} eventos y se sustituirán los actuales. ¿Continuar?`)) return;
    events = imported;
    prefs = payload.prefs || prefs;
    savePrefs();
    saveEvents();
    showToast("Datos importados");
  } catch {
    alert("No se pudo importar el archivo. Comprueba que sea una copia JSON válida.");
  } finally {
    $("#importInput").value = "";
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportIcs(event) {
  const start = eventDateTime(event);
  if (!start) return;
  let end = eventDateTime(event, true);
  if (!end || end <= start) end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const stamp = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const safe = value => String(value || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const location = [event.venue, event.address, event.city].filter(Boolean).join(", ");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Granada Cultura//ES",
    "BEGIN:VEVENT",
    `UID:${safe(event.id)}@granada-cultura`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${safe(event.title)}`,
    `LOCATION:${safe(location)}`,
    `DESCRIPTION:${safe([event.description, event.url].filter(Boolean).join("\n"))}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  downloadBlob(new Blob([ics], { type: "text/calendar;charset=utf-8" }), `${event.title.replace(/[^\wáéíóúñ-]+/gi, "-")}.ics`);
  showToast("Archivo de calendario descargado");
}

function switchTab(name) {
  $$(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === name));
  $$(".tab-panel").forEach(panel => panel.classList.remove("active"));
  $(`#${name}Section`).classList.add("active");
}

function updateRangeButtons() {
  $$("[data-range]").forEach(btn => btn.classList.toggle("active", btn.dataset.range === currentRange));
  renderAgenda();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2100);
}

function applyTheme() {
  const dark = prefs.theme === "dark" ||
    (!prefs.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function initEvents() {
  $$(".tab").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));

  $$("[data-range]").forEach(btn => btn.addEventListener("click", () => {
    currentRange = btn.dataset.range;
    calendarCursor = new Date();
    updateRangeButtons();
  }));

  $$(".view-btn").forEach(btn => btn.addEventListener("click", () => {
    currentView = btn.dataset.view;
    $$(".view-btn").forEach(b => b.classList.toggle("active", b === btn));
    renderAgenda();
  }));

  ["searchInput", "categoryFilter", "priceFilter", "cityFilter", "statusFilter"].forEach(id => {
    $(`#${id}`).addEventListener(id === "searchInput" ? "input" : "change", renderAgenda);
  });

  $("#eventForm").addEventListener("submit", handleSubmit);
  $("#cancelEditBtn").addEventListener("click", resetForm);

  $("#closeDialogBtn").addEventListener("click", closeDialog);
  $("#eventDialog").addEventListener("click", e => {
    if (e.target === $("#eventDialog")) closeDialog();
  });

  $("#dialogFavoriteBtn").addEventListener("click", () => toggleFavorite(currentDialogId));
  $("#dialogStatusBtn").addEventListener("click", () => cycleStatus(currentDialogId));
  $("#dialogEditBtn").addEventListener("click", () => editEvent(currentDialogId));
  $("#dialogDeleteBtn").addEventListener("click", () => deleteEvent(currentDialogId));
  $("#dialogCalendarBtn").addEventListener("click", () => {
    const event = events.find(e => e.id === currentDialogId);
    if (event) exportIcs(event);
  });

  $("#clearDemoBtn").addEventListener("click", () => {
    events = events.filter(e => !e.demo);
    saveEvents();
    showToast("Eventos de ejemplo eliminados");
  });

  $("#exportBtn").addEventListener("click", exportData);
  $("#importInput").addEventListener("change", e => {
    if (e.target.files[0]) importData(e.target.files[0]);
  });

  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("¿Borrar todos los eventos guardados en este dispositivo?")) return;
    events = [];
    saveEvents();
    showToast("Agenda vaciada");
  });

  $("#themeBtn").addEventListener("click", () => {
    const dark = document.documentElement.classList.contains("dark");
    prefs.theme = dark ? "light" : "dark";
    savePrefs();
    applyTheme();
  });
}

let deferredInstallPrompt;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  $("#installBtn").classList.remove("hidden");
});
$("#installBtn")?.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("#installBtn").classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

applyTheme();
initEvents();
resetForm();
renderAll();