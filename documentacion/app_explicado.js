/* EXPLICACION: Configuración: rutas locales de ilustraciones y fallback, nombres de secciones y estado solo en memoria. No usa backend ni sobrescribe el localStorage de la versión anterior. */
const IMAGE_ROOT = "assets/images/categorias/";
const FALLBACK_IMAGE = IMAGE_ROOT + "generica.svg";
const sectionNames = { home: "Inicio", explore: "Explorar", agenda: "Agenda", favorites: "Favoritos", profile: "Perfil" };
/* EXPLICACION: Estado neutral: fábrica de conjuntos/mapas nuevos para evitar selecciones compartidas. Limpiar incluye el buscador y devuelve ambos rangos a 0–1.000. */
const neutralFilters = () => ({
  query: "", date: "", customMode: "single", dateStart: "", dateEnd: "",
  priceMin: 0, priceMax: 1000, distanceMin: 0, distanceMax: 1000,
  selectedCategories: new Set(), selectedSubcategories: new Map()
});
const state = { events: [], categories: [], section: "home", ...neutralFilters() };
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

/* EXPLICACION: Datos demo y fechas: cada registro tiene una fecha ISO. La diferencia respecto a fechaBase se traslada al día local de apertura para mantener planes próximos; Date.UTC calcula días sin errores por cambio de hora. */
function localDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function demoDate(value, base) {
  const source = localDate(value);
  const origin = localDate(base);
  const days = Math.round((Date.UTC(source.getFullYear(), source.getMonth(), source.getDate()) - Date.UTC(origin.getFullYear(), origin.getMonth(), origin.getDate())) / 86400000);
  const result = new Date();
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() + days);
  return dateKey(result);
}

/* EXPLICACION: Búsqueda: normaliza mayúsculas y acentos para localizar artista, evento, localidad o categoría de forma tolerante. */
function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/* EXPLICACION: Catálogo e imágenes: categoria/subcategoria buscan una entrada en categorias.json. archivo define el nombre y extensión del asset, de modo que un ilustrador puede cambiar SVG por PNG/WEBP sin modificar lógica. Un valor null o categoría desconocida resuelve directamente al fallback. */
function getCategory(event) {
  return state.categories.find(category => category.id === event.categoria);
}

function getSubcategory(event) {
  return getCategory(event)?.subcategorias.find(subcategory => subcategory.id === event.subcategoria);
}

function resolveIllustration(event) {
  const category = getCategory(event);
  const subcategory = getSubcategory(event);
  if (!category || !subcategory || !subcategory.archivo) return FALLBACK_IMAGE;
  const filename = subcategory.archivo;
  return IMAGE_ROOT + category.id + "/" + filename;
}

/* EXPLICACION: Fecha libre: valida el día ISO o intervalo inclusivo. Devuelve null mientras está incompleto/invertido, y la interfaz informa de que todavía no se aplica fecha; nunca se mezcla con un preset rápido. */
function customDateBounds() {
  const valid = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && dateKey(localDate(value)) === value;
  if (!valid(state.dateStart)) return null;
  if (state.customMode === "single") return [state.dateStart, state.dateStart];
  if (!valid(state.dateEnd) || state.dateEnd < state.dateStart) return null;
  return [state.dateStart, state.dateEnd];
}

/* EXPLICACION: Fechas: calcula hoy, mañana, fin de semana, resto de semana y mes. Los filtros operan sobre días locales e incluyen los extremos del intervalo. */
function dateMatches(value, range) {
  if (!range) return true;
  if (range === "custom") {
    const bounds = customDateBounds();
    return !bounds || (value >= bounds[0] && value <= bounds[1]);
  }
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(today);
  const end = new Date(today);
  if (range === "tomorrow") {
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
  }
  if (range === "week") end.setDate(end.getDate() + 7 - (today.getDay() || 7));
  if (range === "weekend") {
    const weekday = today.getDay() || 7;
    start.setDate(start.getDate() + Math.max(0, 6 - weekday));
    end.setDate(end.getDate() + 7 - weekday);
  }
  if (range === "month") end.setMonth(end.getMonth() + 1, 0);
  const date = localDate(value);
  return date >= start && date <= end;
}

/* EXPLICACION: Categorías OR y subcategorías por categoría: cualquier categoría marcada puede coincidir. Dentro de ella, ninguna subcategoría marcada equivale a todas; si hay varias, basta coincidir con una. El resto de filtros se combina por AND. */
function categoryMatches(event) {
  if (!state.selectedCategories.size) return true;
  if (!state.selectedCategories.has(event.categoria)) return false;
  const subcategories = state.selectedSubcategories.get(event.categoria);
  return !subcategories?.size || subcategories.has(event.subcategoria);
}

/* EXPLICACION: Filtros combinados: búsqueda, fecha, precio mínimo/máximo, distancia mínima/máxima, categorías y subcategorías se intersectan. El resultado se ordena cronológicamente y por cercanía cuando coinciden fecha y hora. */
function filteredEvents() {
  const query = normalize(state.query.trim());
  return state.events.filter(event => {
    const searchable = [event.nombre, event.artista, event.localidad, event.lugar, event.descripcion, getCategory(event)?.nombre, getSubcategory(event)?.nombre].map(normalize).join(" ");
    return (!query || searchable.includes(query))
      && dateMatches(event.fecha, state.date)
      && event.precio >= state.priceMin && event.precio <= state.priceMax
      && event.distanciaKm >= state.distanceMin && event.distanciaKm <= state.distanceMax
      && categoryMatches(event);
  }).sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora) || a.distanciaKm - b.distanciaKm);
}

/* EXPLICACION: Creación segura de tarjetas: textContent evita interpretar los textos de datos como HTML. Cada tarjeta muestra ilustración decorativa, categoría, nombre, fecha/hora, lugar, distancia y precio. */
function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildCard(event) {
  const card = element("article", "event-card");
  card.dataset.eventId = event.id;
  const image = element("img", "event-art");
  image.width = 110;
  image.height = 110;
  image.alt = "";
  image.loading = "lazy";
/* EXPLICACION: Fallback de red: si un archivo declarado falta o no se puede decodificar, se sustituye por generica.svg una sola vez; el guard evita bucles si también falla el fallback. */
  image.addEventListener("error", () => {
    if (image.dataset.fallback === "true") return;
    image.dataset.fallback = "true";
    image.src = FALLBACK_IMAGE;
  });
  image.src = resolveIllustration(event);
  const info = element("div", "event-info");
  info.append(element("span", "event-category", (getCategory(event)?.nombre || "Cultura") + " · " + (getSubcategory(event)?.nombre || event.subcategoria)));
  info.append(element("h3", "event-title", event.nombre));
  const date = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(localDate(event.fecha));
  const time = element("p", "event-time");
  const dateNode = document.createElement("time");
  dateNode.dateTime = event.fecha + "T" + event.hora;
  dateNode.textContent = date + " · " + event.hora + " h";
  time.append(dateNode);
  info.append(time);
  info.append(element("p", "event-place", event.lugar + " · " + event.localidad));
  const bottom = element("div", "event-bottom");
  bottom.append(element("span", "event-distance", "A " + event.distanciaKm + " km"));
  const price = event.precio === 0 ? "Gratis" : new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(event.precio);
  bottom.append(element("span", "event-price" + (event.precio === 0 ? " free" : ""), price));
  info.append(bottom);
  card.append(image, info);
  return card;
}

function renderEvents() {
  const events = filteredEvents();
  $("#eventList").replaceChildren(...events.map(buildCard));
  $("#resultCount").textContent = events.length + (events.length === 1 ? " plan" : " planes");
  $("#emptyState").hidden = events.length !== 0;
}

/* EXPLICACION: Carga local: obtiene eventos.json y categorias.json por HTTP, construye opciones y renderiza. Incluye estado de carga, error y reintento; datos y catálogo siguen separados del código. */
async function loadData() {
  $("#loadingMessage").hidden = false;
  $("#errorState").hidden = true;
  $("#emptyState").hidden = true;
  try {
    const responses = await Promise.all([fetch("data/eventos.json"), fetch("data/categorias.json")]);
    if (responses.some(response => !response.ok)) throw new Error("No se pudieron cargar los datos locales.");
    const [data, catalog] = await Promise.all(responses.map(response => response.json()));
    state.categories = catalog.categorias;
    state.events = data.events.map(event => ({ ...event, fecha: demoDate(event.fecha, data.fechaBase) }));
    renderCategoryOptions();
    renderEvents();
  } catch (error) {
    $("#eventList").replaceChildren();
    $("#resultCount").textContent = "";
    $("#errorState").hidden = false;
    console.error("CULTURA: error al cargar los datos demo.", error);
  } finally {
    $("#loadingMessage").hidden = true;
  }
}

/* EXPLICACION: Buscador animado: CSS controla el desplazamiento en la misma fila. JavaScript habilita el campo, actualiza ARIA y envía el foco; cierre o Escape limpian la búsqueda y restauran la marca. */
function toggleSearch(open, returnFocus = true) {
  $("#headerTrack").classList.toggle("search-open", open);
  $("#searchToggle").setAttribute("aria-expanded", String(open));
  $("#searchToggle").setAttribute("aria-label", open ? "Cerrar búsqueda" : "Abrir búsqueda");
  $("#searchToggle use").setAttribute("href", open ? "#icon-close" : "#icon-search");
  $("#searchForm").setAttribute("aria-hidden", String(!open));
  $("#searchInput").disabled = !open;
  $("#brand").tabIndex = open ? -1 : 0;
  $("#brand").setAttribute("aria-hidden", String(open));
  if (open) {
    $("#searchInput").focus({ preventScroll: true });
  } else {
    state.query = "";
    $("#searchInput").value = "";
    renderEvents();
    if (returnFocus) $("#searchToggle").focus({ preventScroll: true });
  }
}

/* EXPLICACION: Navegación: sincroniza activo y aria-current en menús móvil y escritorio. Solo Inicio está desarrollado; las otras cuatro secciones comparten un placeholder. No se eliminan los datos previamente guardados. */
function showSection(name) {
  state.section = name;
  $("#homeSection").hidden = name !== "home";
  $("#placeholderSection").hidden = name === "home";
  $("#placeholderTitle").textContent = sectionNames[name];
  $$("[data-section]").forEach(button => {
    const active = button.dataset.section === name;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (name !== "home") toggleSearch(false, false);
  $("#searchToggle").hidden = name !== "home";
}

/* EXPLICACION: Estado visual del botón: actualiza el resumen, lo oculta cuando el filtro es neutral y aplica has-value. La fecha exige preset o fecha válida; los rangos comparan con 0–1.000. */
function setFilterTabSummary(id, text, active) {
  const summary = $("#" + id);
  summary.textContent = text;
  summary.hidden = !active;
  summary.closest(".filter-tab").classList.toggle("has-value", active);
}

/* EXPLICACION: Sincronización del calendario: muestra día único o inicio/fin, deshabilita campos inactivos, establece límites recíprocos, mensajes y aria-invalid. No limita la búsqueda a meses cercanos. */
function syncDateControls() {
  const custom = state.date === "custom";
  const interval = state.customMode === "range";
  $("#customDateControls").hidden = !custom;
  $("#dateEndControl").hidden = !interval;
  $("#dateStart").disabled = !custom;
  $("#dateEnd").disabled = !custom || !interval;
  $("#dateStartLabel").textContent = interval ? "Fecha inicial" : "Fecha concreta";
  $("#dateStart").value = state.dateStart;
  $("#dateEnd").value = state.dateEnd;
  $("#dateStart").max = interval ? state.dateEnd : "";
  $("#dateEnd").min = state.dateStart;
  const bounds = customDateBounds();
  const reversed = interval && state.dateStart && state.dateEnd && state.dateEnd < state.dateStart;
  $("#dateStart").setAttribute("aria-invalid", String(Boolean(reversed)));
  $("#dateEnd").setAttribute("aria-invalid", String(Boolean(reversed)));
  $("#customDateMessage").textContent = bounds ? "Fecha personalizada aplicada." : reversed
    ? "La fecha final debe ser igual o posterior a la inicial. No se aplica la fecha hasta corregirla."
    : "Elige " + (interval ? "ambas fechas" : "una fecha") + ". Mientras tanto, no se aplica filtro de fecha.";
  const format = value => new Intl.DateTimeFormat("es-ES", { dateStyle: "short" }).format(localDate(value));
  const summary = custom
    ? bounds ? bounds.map(format).filter((value, i, values) => !i || value !== values[0]).join(" — ") : "Pendiente"
    : $("#dateFilter").selectedOptions[0].textContent;
  setFilterTabSummary("dateSummary", summary, Boolean(state.date && (!custom || bounds)));
}

function clearCustomDate() {
  Object.assign(state, { date: "", customMode: "single", dateStart: "", dateEnd: "" });
  $("#dateFilter").value = "";
  $("#customDateMode").value = "single";
  syncDateControls();
  renderEvents();
}

/* EXPLICACION: Rangos precisos: pasos de 1 euro o 1 km entre 0 y 1.000. Los sliders se detienen en el otro extremo sin cruzarlo; la entrada numérica conserva la coordinación anterior, desplazando el extremo contrario si es necesario. Ambos limitan valores al dominio e impiden min > max. */
function coordinateRange(kind, edge, value, clampToOther = false) {
  if (!Number.isFinite(value)) return;
  if (clampToOther) value = edge === "Min" ? Math.min(value, state[kind + "Max"]) : Math.max(value, state[kind + "Min"]);
  state[kind + edge] = Math.min(1000, Math.max(0, Math.round(value)));
  if (state[kind + "Min"] > state[kind + "Max"]) {
    state[kind + (edge === "Min" ? "Max" : "Min")] = state[kind + edge];
  }
}

/* EXPLICACION: Cercanía de tiradores: convierte el intervalo a píxeles útiles, descontando sus 44 px de ancho. Si hay menos de 52 px, separa mínimo arriba y máximo abajo sobre la misma pista; ResizeObserver recalcula al abrir el grupo o cambiar el ancho. */
function updateRangeLayout(kind) {
  const range = $("#" + kind + "Range");
  const separation = (state[kind + "Max"] - state[kind + "Min"]) / 1000 * Math.max(0, range.clientWidth - 44);
  range.classList.toggle("is-close", separation < 52);
}

/* EXPLICACION: Valores visibles y accesibles: sincroniza sliders, campos numéricos, resumen y aria-valuetext con sus unidades. Los porcentajes CSS actualizan los extremos de la única pista seleccionada; reset utiliza esta misma función. */
function syncRangeControls(kind) {
  const unit = kind === "price" ? "€" : "km";
  const spokenUnit = kind === "price" ? "euros" : "kilómetros";
  const format = number => new Intl.NumberFormat("es-ES", { useGrouping: true, minimumGroupingDigits: 1 }).format(number);
  for (const edge of ["Min", "Max"]) {
    const value = state[kind + edge];
    $("#" + kind + edge).value = value;
    $("#" + kind + edge + "Number").value = value;
    $("#" + kind + edge).setAttribute("aria-valuetext", value + " " + spokenUnit);
  }
  const range = $("#" + kind + "Range");
  range.style.setProperty("--range-min", state[kind + "Min"] / 10 + "%");
  range.style.setProperty("--range-max", state[kind + "Max"] / 10 + "%");
  updateRangeLayout(kind);
  const summary = format(state[kind + "Min"]) + " " + unit + " — " + format(state[kind + "Max"]) + " " + unit;
  setFilterTabSummary(kind + "Summary", summary, state[kind + "Min"] !== 0 || state[kind + "Max"] !== 1000);
}

/* EXPLICACION: Generación sin duplicar catálogo: usa las 11 categorías y 59 subcategorías de categorias.json para crear checkboxes con labels; ids prefijados por categoría evitan colisiones como Flamenco. */
function makeChoice(id, name, checked, category, subcategory) {
  const label = element("label", "choice-label");
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = id;
  input.checked = checked;
  input.dataset.category = category;
  if (subcategory) input.dataset.subcategory = subcategory;
  label.append(input, element("span", "", name));
  return label;
}

function renderCategoryOptions() {
  $("#categoryOptions").replaceChildren(...state.categories.map(category =>
    makeChoice("category-" + category.id, category.nombre, state.selectedCategories.has(category.id), category.id)));
  renderSubcategoryOptions();
}

/* EXPLICACION: Dependencias: solo aparecen subcategorías de categorías activas, agrupadas con fieldset/legend. La selección se conserva al añadir otras categorías. */
function renderSubcategoryOptions() {
  const groups = state.categories.filter(category => state.selectedCategories.has(category.id)).map(category => {
    const group = element("fieldset", "subcategory-group");
    group.append(element("legend", "", category.nombre));
    const choices = element("div", "choice-grid");
    choices.append(...category.subcategorias.map(subcategory =>
      makeChoice("subcat-" + category.id + "-" + subcategory.id, subcategory.nombre,
        state.selectedSubcategories.get(category.id)?.has(subcategory.id) || false, category.id, subcategory.id)));
    group.append(choices);
    return group;
  });
  $("#subcategoryOptions").replaceChildren(...groups);
  updateCategorySummary();
}

/* EXPLICACION: Resumen compacto: una categoría muestra su nombre y, si existen, la primera subcategoría y +N. Varias categorías muestran la primera y +N para no desbordar. */
function updateCategorySummary() {
  const categories = state.categories.filter(category => state.selectedCategories.has(category.id));
  let summary = "";
  if (categories.length > 1) summary = categories[0].nombre + " +" + (categories.length - 1);
  if (categories.length === 1) {
    summary = categories[0].nombre;
    const selected = state.selectedSubcategories.get(categories[0].id);
    const subcategories = categories[0].subcategorias.filter(subcategory => selected?.has(subcategory.id));
    if (subcategories.length) summary += " · " + subcategories[0].nombre + (subcategories.length > 1 ? " +" + (subcategories.length - 1) : "");
  }
  const active = categories.length > 0 || [...state.selectedSubcategories.values()].some(entries => entries.size);
  setFilterTabSummary("categorySummary", summary, active);
}

/* EXPLICACION: Al desmarcar una categoría se elimina también su conjunto de subcategorías; volver a marcarla no recupera filtros ocultos. */
function setCategory(id, selected) {
  if (selected) state.selectedCategories.add(id);
  else {
    state.selectedCategories.delete(id);
    state.selectedSubcategories.delete(id);
  }
}

/* EXPLICACION: Reinicio: restaura todos los filtros, incluidos búsqueda, fechas y selecciones dependientes. Precio y distancia vuelven a 0–1.000, sin recargar la página. */
function resetFilters() {
  $("#filterForm").reset();
  Object.assign(state, neutralFilters());
  $("#searchInput").value = "";
  syncDateControls();
  syncRangeControls("price");
  syncRangeControls("distance");
  renderCategoryOptions();
  renderEvents();
}

/* EXPLICACION: Enlace de controles: conecta búsqueda, panel, filtros, navegación y final del splash una sola vez. Cambiar ids del HTML requiere actualizar sus selectores aquí. */
$("#searchToggle").addEventListener("click", () => toggleSearch(!$("#headerTrack").classList.contains("search-open")));
$("#searchForm").addEventListener("submit", event => event.preventDefault());
$("#searchInput").addEventListener("input", event => { state.query = event.target.value; renderEvents(); });
$("#searchInput").addEventListener("keydown", event => { if (event.key === "Escape") toggleSearch(false); });
$("#filterToggle").addEventListener("click", () => {
  const expanded = $("#filterToggle").getAttribute("aria-expanded") !== "true";
  $("#filterToggle").setAttribute("aria-expanded", String(expanded));
  $("#filterPanel").hidden = !expanded;
});
$("#filterForm").addEventListener("submit", event => event.preventDefault());
/* EXPLICACION: Panel único: los cuatro botones actualizan aria-expanded y hidden para que solo un contenido esté visible. Cambiar de panel conserva los valores y recalcula el ancho útil de los sliders. */
const filterTabs = $$(".filter-tab");
for (const tab of filterTabs) {
  tab.addEventListener("click", () => {
    const shouldOpen = tab.getAttribute("aria-expanded") !== "true";
    for (const other of filterTabs) {
      const active = other === tab && shouldOpen;
      other.setAttribute("aria-expanded", String(active));
      $("#" + other.getAttribute("aria-controls")).hidden = !active;
    }
    for (const kind of ["price", "distance"]) updateRangeLayout(kind);
  });
}
/* EXPLICACION: Eventos de controles: un cambio de preset limpia fechas personalizadas. Ranges y números comparten actualización; el campo numérico vacío se restaura al perder foco. Cambios de checkbox actualizan el estado, resumen y tarjetas. */
$("#dateFilter").addEventListener("change", event => {
  state.date = event.target.value;
  state.dateStart = "";
  state.dateEnd = "";
  syncDateControls();
  renderEvents();
});
$("#customDateMode").addEventListener("change", event => {
  state.customMode = event.target.value;
  state.dateEnd = "";
  syncDateControls();
  renderEvents();
});
for (const [id, key] of [["dateStart", "dateStart"], ["dateEnd", "dateEnd"]]) {
  $("#" + id).addEventListener("change", event => {
    state[key] = event.target.value;
    syncDateControls();
    renderEvents();
  });
}
$("#clearCustomDate").addEventListener("click", clearCustomDate);
for (const kind of ["price", "distance"]) {
  for (const edge of ["Min", "Max"]) {
    for (const suffix of ["", "Number"]) {
      const input = $("#" + kind + edge + suffix);
      input.addEventListener("input", () => {
        if (input.value === "") return;
        coordinateRange(kind, edge, input.valueAsNumber, suffix === "");
        syncRangeControls(kind);
        renderEvents();
      });
      input.addEventListener("change", () => syncRangeControls(kind));
    }
  }
}
const rangeResizeObserver = new ResizeObserver(() => {
  for (const kind of ["price", "distance"]) updateRangeLayout(kind);
});
for (const kind of ["price", "distance"]) rangeResizeObserver.observe($("#" + kind + "Range"));
$("#categoryOptions").addEventListener("change", event => {
  const input = event.target;
  if (!input.matches('input[type="checkbox"]')) return;
  setCategory(input.dataset.category, input.checked);
  renderSubcategoryOptions();
  renderEvents();
});
$("#subcategoryOptions").addEventListener("change", event => {
  const input = event.target;
  if (!input.matches('input[type="checkbox"]')) return;
  const category = input.dataset.category;
  if (!state.selectedCategories.has(category)) return;
  if (!state.selectedSubcategories.has(category)) state.selectedSubcategories.set(category, new Set());
  const selected = state.selectedSubcategories.get(category);
  if (input.checked) selected.add(input.dataset.subcategory);
  else selected.delete(input.dataset.subcategory);
  updateCategorySummary();
  renderEvents();
});
$("#clearFilters").addEventListener("click", resetFilters);
$("#resetSearch").addEventListener("click", () => { resetFilters(); toggleSearch(false); });
$("#retryLoad").addEventListener("click", loadData);
$$("[data-section]").forEach(button => button.addEventListener("click", () => showSection(button.dataset.section)));
$("#backHome").addEventListener("click", () => showSection("home"));
$("#brand").addEventListener("click", event => { event.preventDefault(); showSection("home"); });
$("#splash").addEventListener("animationend", event => { if (event.animationName === "splash-away") $("#splash").hidden = true; });

/* EXPLICACION: PWA y arranque: registra el worker local y carga el catálogo. sw.js cachea recursos por alcance con estrategia de red primero, y no devuelve HTML como si fuera una imagen. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(error => console.warn("CULTURA: modo sin conexión no disponible.", error));
  });
}
syncDateControls();
syncRangeControls("price");
syncRangeControls("distance");
loadData();
