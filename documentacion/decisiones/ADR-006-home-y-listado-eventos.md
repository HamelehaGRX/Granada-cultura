# ADR-006: Home basada en repositorio y lista virtualizada

## Estado

Aprobado en el alcance solicitado para el Paso 6: Home y listado de eventos.

## Contexto

La aplicación Expo ya contaba con navegación, theme, shell y una capa de dominio con repositorios de fixtures. Inicio seguía siendo un placeholder. Era necesario migrar la primera pantalla real y presentar los 16 eventos demo sin acoplar componentes al JSON legado ni adelantar búsqueda, filtros, assets o persistencia.

## Decisión

La ruta de Inicio se limita a renderizar `HomeScreen`. Dentro de la feature de eventos se separan la composición de pantalla, el header, la lista, las tarjetas, los estados de carga y el hook. La UI consume `Event`, `EventResult`, `Category` e interfaces de repositorio; no importa fixtures ni formatos heredados.

## HomeScreen y repositorios

`HomeScreen` compone `AppShell`, `HomeHeader` y `EventList`. Al montarse crea una única pareja mediante `createHomeRepositories`: `FixtureEventRepository` para eventos y `FixtureCategoryRepository` para el catálogo. Puede recibir otra implementación por props, una forma pequeña de inyección explícita que evita añadir un framework.

Esta frontera permite que un futuro backend implemente las mismas interfaces y adapte sus respuestas al dominio. Cambiar el origen no requerirá reescribir Home, las tarjetas ni sus utilidades de presentación.

## Hook y estados

`useHomeEvents` carga ambos repositorios en paralelo y expone datos, categorías, loading, error y retry. Cada ejecución mantiene una marca local de actividad. Su limpieza invalida el resultado cuando se desmonta el componente, cambia el repositorio o comienza un reintento, de modo que respuestas antiguas no pisan el estado vigente.

Loading, empty y error son componentes separados. Loading anuncia una región ocupada; empty explica la ausencia de eventos; error usa rol de alerta y una acción Reintentar con tamaño táctil y foco visible. El hook no incorpora React Query, Redux, Zustand ni caché global.

## FlatList y EventCard

`EventList` utiliza `FlatList`, IDs estables e `initialNumToRender`. La lista ordenada llega desde el hook; el componente visual no ejecuta reglas de ordenación. En móvil usa una columna y desde tablet utiliza dos mientras el escalado de texto sea compatible. Cambiar el número de columnas remonta la lista, tal como requiere React Native.

`EventCard` muestra categoría/subcategoría, título, fecha y hora, lugar/localidad, distancia demo y precio. Es compacta, no interactiva y no navega al detalle en esta fase. Alterna tres bordes suaves del theme. El espacio reservado para ilustración es decorativo; el componente acepta un asset resuelto, pero no conoce rutas ni realiza imports dinámicos.

## Presentación y orden

Las funciones puras de `presentation.ts` ordenan primero por el instante ISO de inicio y después por distancia cuando coincide. Los elementos sin distancia quedan tras los que tienen una disponible. Se devuelve una copia y no se muta la entrada.

Fecha y hora se formatean con `Intl` en la zona IANA del evento. El precio deriva de la unión `EventPrice`: Gratis, importe fijo o intervalo en euros. Los decimales solo aparecen cuando existen céntimos. La distancia convertida por el repositorio se presenta como dato demo y no se incorpora a `Event`.

## Responsive y accesibilidad

El diseño es mobile-first y conserva el ancho máximo del contenedor compartido. La navegación inferior tiene altura suficiente para iconos y etiquetas. Si aumenta el escalado de texto, la lista prioriza una columna. Los textos pueden envolver, las tarjetas limitan encogimientos y no existe scroll horizontal.

La jerarquía accesible usa niveles 1, 2 y 3 para pantalla, sección y tarjetas. Los espacios de ilustración no se anuncian. Loading comunica estado ocupado; error se anuncia y su acción conserva foco visible. No se utilizan APIs del DOM en el código universal.

## Consecuencias positivas

- Inicio demuestra el flujo completo repositorio → hook → lista → tarjeta.
- La UI queda separada del JSON y del futuro transporte.
- FlatList proporciona virtualización compatible con native y web.
- Los estados principales son explícitos y verificables.
- Orden y formato se prueban como funciones puras.
- La composición admite repositorios alternativos sin dependencia adicional.

## Consecuencias y limitaciones

- Las distancias continúan siendo ficticias y se identifican como demo.
- Las ilustraciones son placeholders hasta aprobar el mapa estático de assets.
- Las tarjetas no abren detalles, guardan favoritos ni añaden eventos a Agenda.
- El header no implementa todavía búsqueda.
- Tablet y web comparten por ahora dos columnas y navegación inferior; el sidebar sigue pendiente.
- Los fixtures se recrean por llamada y no existe caché, paginación ni carga incremental remota.

## Validación

La validación cubre los 16 eventos, orden por instante/distancia, etiquetas del catálogo, fechas en Madrid, precios y ausencia de mutación. En web se verifican 390×844, 800×1280, 1440×900 y cambio de orientación; loading, empty, error, retry, desmontaje y respuestas obsoletas; jerarquía de encabezados; navegación previa; ausencia de overflow; y consola sin errores ni warnings. También se generan bundles Android, iOS y web.

## Condiciones para revisar esta decisión

Se revisará al introducir backend y paginación, carga incremental, assets reales, interacción de tarjetas, filtrado, búsqueda, caché o una navegación lateral de escritorio. Esos cambios pertenecen a fases posteriores y deberán conservar la separación entre UI, dominio y origen de datos.
