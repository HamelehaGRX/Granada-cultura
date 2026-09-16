# ADR-007: Búsqueda y filtros como lógica pura con estado local

## Estado

Implementado en el alcance solicitado para el Paso 7; pendiente de aprobación del usuario.

## Contexto

Home presenta 16 eventos a través de repositorios. El prototipo combina búsqueda, fecha,
precio, distancia y categorías. Se necesita migrar ese comportamiento sin tocar el legado,
añadir dependencias, persistencia, ubicación ni backend.

## Decisión

`src/features/filters/` separa tipos, reducer, fechas, selección pura, hook y controles.
`src/features/search/` contiene normalización, construcción del texto buscable y SearchField.
Home mantiene una instancia de `useEventFilters`, basada en `useReducer`. No existe store
global ni estado persistente. `useHomeEvents` conserva la carga y orden de los repositorios.

`filterEvents(data, state, categories, now)` recibe todas sus entradas, no lee el reloj ni
muta datos. El hook memoiza resultados y resúmenes. Actualiza el instante de referencia
cada minuto y al regresar la aplicación a primer plano, limpiando ambos observadores.
Los fixtures mantienen su día de referencia por montaje, como acordó ADR-005.

## Semántica e invariantes

- AND entre búsqueda, fecha, precio, distancia y categorías.
- OR entre categorías, y OR entre subcategorías de cada categoría seleccionada.
- Categoría sin subcategorías marcadas: todas sus subcategorías. Sin categorías: todo.
- Desmarcar categoría elimina sus subfiltros; no se aceptan subfiltros sin categoría.
- Búsqueda por subcadena normalizada sin mayúsculas ni diacríticos, incluyendo título,
  artista, localidad, lugar, categoría, subcategoría y descripción.
- Fechas inclusivas, comparadas en la zona IANA de cada evento. Hoy/mañana usan esa misma
  zona. Semana y mes comienzan hoy; el fin de semana termina el domingo y, si hoy es
  domingo, solo incluye hoy. Se conserva la semántica del prototipo.
- Custom admite día o rango. Fechas inválidas, incompletas o invertidas se explican y no
  restringen resultados ni producen un resumen activo. Los presets descartan el custom.
- Precio en euros enteros en el control, comparado en céntimos con EventPrice. Gratis es
  cero; los rangos coinciden por solapamiento inclusivo (hay al menos un precio admisible).
- Distancia en kilómetros en el control y metros en EventResult. Una distancia desconocida
  se incluye en estado neutro y se excluye cuando hay una restricción de distancia.
- Rangos limitados a 0–1000, min ≤ max. Al cruzarse por edición, el otro extremo acompaña.
  Rangos neutros no se aplican (tampoco excluyen futuros precios/distancias superiores).
- La limpieza global de Home restaura búsqueda y filtros. La acción del modal limpia inmediatamente
  fecha, rangos y categorías aplicados, pero mantiene separada la búsqueda.

## Home, rutas y fuente única de estado

HomeHeader reemplaza visualmente la marca por SearchField dentro de la misma barra y da
foco al campo. Cerrar o Escape vacía solo la búsqueda y devuelve foco a la acción de abrir.
FilterBar forma parte del encabezado de FlatList únicamente como botón de apertura. Los controles
se presentan en un `Modal` superpuesto, fuera del flujo del listado, de modo que no desplazan
EventCard ni alteran la posición de scroll. El modal bloquea la interacción con Home; usa una
ventana flotante de cuatro esquinas redondeadas y márgenes verticales en móvil, y una ventana
centrada desde tablet. Web mejora el overlay con `backdrop-filter` y native conserva una
atenuación semitransparente sin dependencia adicional.

El modal no crea una segunda fuente aplicada: al abrir clona fecha, precio, distancia y categorías
en un borrador local. Los controles existentes editan esa copia. Guardar despacha una única acción
al reducer y deja que la persistencia vigente observe el nuevo estado; cerrar, tocar el backdrop,
Escape o Back descartan la copia. Limpiar neutraliza inmediatamente borrador y estado aplicado,
actualiza la persistencia y mantiene el modal abierto; un cierre posterior no revierte la limpieza.
`/filtros` conserva una entrada enlazable y redirige a Inicio con el modal abierto en Fecha;
`/buscar?q=…` aplica la búsqueda separada. La ruta de Inicio consume ambos parámetros.

## Responsive y accesibilidad

El botón compacto tiene target mínimo, foco visible y un badge que cuenta como máximo cuatro
grupos efectivos. La búsqueda y la cantidad de subcategorías no incrementan ese valor. Dentro del
modal, los cuatro triggers usan patrón 2×2 en móvil y una fila desde tablet; solo un grupo se
expande a la vez y el contenido dispone de scroll propio mientras el pie de acciones permanece
estable. La cuenta y el vacío explican resultados y permiten limpiar los filtros ya aplicados.
Las categorías proceden del catálogo 11/59 del repositorio, sin duplicarlo.

Controles con labels, roles, estados checked/expanded explícitos, foco visible, indicación
de selección mediante marca además del color y targets mínimos de 44 px. Fecha usa `input
type=date` en la variante web; native usa temporalmente TextInput con formato AAAA-MM-DD y
validación compartida, sin instalar un calendario.

## Slider dual

El Paso 10B.2A incorpora un slider de doble tirador como ayuda visual y táctil mediante un
adaptador propio. `RangeFilter` mantiene los campos coordinados y botones −1/+1 para edición
exacta y como vía accesible garantizada. Reducer, semántica, persistencia y unidades no dependen
de la librería. La decisión y sus límites se detallan en ADR-011.

## Consecuencias y backend futuro

La lógica pura es testeable con instantes fijos y no conoce React, DOM ni transporte.
Los componentes dependen del dominio y los repositorios existentes. El catálogo y los eventos
no se duplican. Una futura API podrá recibir un contrato de consulta adaptado desde FilterState;
la paginación remota requerirá mover el filtrado al servidor para no filtrar solo una página.
Se conserva el contrato de UI y se revisará esta decisión al introducir esa consulta, un
calendario dedicado o necesidades de estado entre varias pantallas.

## Pruebas

`scripts/validate-filters.ts` cubre búsqueda, presets, custom, cambios de día/zona y DST,
precios y solapamientos, distancias desconocidas, AND/OR, invariantes, no mutación, borrador,
aplicación, descarte, limpieza y conteo de grupos sin incluir la búsqueda.
Se combina con los scripts de datos y Home, typecheck, Expo Doctor y bundles sin dependencias
nuevas. Las comprobaciones de navegador usan 390×844, 800×1280, 1440×900 y 844×390.
La ejecución web y el empaquetado no sustituyen pruebas posteriores en dispositivos físicos
Android/iOS, teclado nativo y lectores de pantalla.
