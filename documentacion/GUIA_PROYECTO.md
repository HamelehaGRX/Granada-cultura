# Guía del proyecto CULTURA

## Estado de transición

CULTURA ha iniciado una migración incremental hacia React Native, Expo, TypeScript estricto y Expo Router. Android e iOS son las plataformas prioritarias; web continúa como plataforma complementaria.

Ya existe una base Expo mínima en `src/`. La carpeta `app/` conserva intacto el prototipo web aprobado y no se eliminará, moverá ni ampliará con funcionalidades grandes salvo petición explícita. Seguirá sirviendo como referencia hasta que la nueva aplicación alcance suficiente paridad y el usuario autorice qué hacer con el legado.

La base nueva dispone de dominio tipado y repositorios demo. Todavía no contiene la interfaz, filtros, tarjetas ni assets del prototipo, y los datos no se muestran en las pantallas. Cada migración visual o funcional posterior requiere una tarea independiente.

## Estructura general

- `AGENTS.md`: reglas del proyecto; se mantiene en la raíz.
- `README.md`: presentación y publicación; no se ha desplegado esta versión.
- `package.json` y `package-lock.json`: scripts y versiones reproducibles de la base Expo.
- `app.json`: configuración universal mínima de Expo y Expo Router.
- `tsconfig.json`: TypeScript estricto y alias interno `@/`.
- `app/`: prototipo web legado aprobado, sin frameworks ni dependencias externas.
- `src/app/`: rutas y layouts de la nueva aplicación Expo.
- `src/components/`: componentes reutilizables; contiene el shell, el contenedor de pantalla y la pantalla provisional común.
- `src/config/`: configuración sustituible, incluida la identidad provisional de marca.
- `src/theme/`: colores, tipografía, espaciado, radios, sombras, movimiento y breakpoints centralizados.
- `src/features/events/` y `src/features/categories/`: modelos de dominio, adaptación y repositorios de eventos y categorías.
- `src/types/common.ts`: coordenadas, instantes ISO y zona horaria compartidos.
- `src/data/fixtures/`: frontera temporal que importa los JSON existentes sin modificarlos ni duplicarlos.
- `scripts/validate-data.ts`: comprobaciones de datos sin framework adicional; se ejecuta fuera de la aplicación.
- `assets/brand/`: ubicación reservada para futuros recursos definitivos de marca; no reutiliza los iconos PWA.
- `app/data/`: catálogo de categorías y eventos demo en JSON.
- `app/assets/icons/`: iconos de instalación existentes.
- `app/assets/images/categorias/`: ilustraciones genéricas por categoría/subcategoría y fallback.
- `documentacion/`: guías del prototipo, copias explicadas, arquitectura objetivo, decisiones y plan de migración.
- `documentacion/arquitectura/`: descripción comprensible de la arquitectura futura.
- `documentacion/decisiones/`: ADR de decisiones arquitectónicas aprobadas.
- `documentacion/migracion/`: fases y criterios de la migración a Expo.

## Prototipo y documentación explicada

El navegador carga `app/index.html`, `app/styles.css` y `app/app.js`. Sus copias paralelas son `index_explicado.html`, `styles_explicado.css` y `app_explicado.js` en esta carpeta.

Las copias conservan exactamente el código del prototipo y añaden comentarios marcados `EXPLICACION`. No son una aplicación alternativa ni deben abrirse para probarla: sus rutas se documentan en el contexto de `app/`. Si una petición modifica expresamente el prototipo, el cambio debe reflejarse también en su copia explicada.

El código React Native no tendrá una copia literal comentada de cada archivo TypeScript. Se mantendrá limpio y se explicará por funcionalidades, interfaces, hooks, servicios y decisiones. Los cambios arquitectónicos importantes se registrarán mediante ADR.

Las secciones v0.1 y v0.1.1 siguientes documentan el historial del prototipo, no la arquitectura definitiva.

## CULTURA v0.1

La v0.1 inicial incorporó los siguientes elementos (los filtros y tiempos se revisan en v0.1.1):

- Splash crema con CULTURA blanco: fondo primero, entrada del nombre y salida conjunta en aproximadamente 1,73 segundos. Incluye preferencia de movimiento reducido.
- Header salvia con marca y lupa. El buscador se expande dentro de la misma fila, desplaza la marca y recibe el foco. Cierre y Escape restauran la cabecera.
- Widget «¿Qué te apetece hoy?» que abre filtros de fecha, precio máximo, distancia demo y categoría.
- Tarjetas compactas de próximos encuentros, con bordes crema, salvia y terracota alternados.
- Navegación inferior en móvil/tablet: Explorar, Agenda, Inicio, Favoritos, Perfil.
- Navegación lateral desde 1100 px: Inicio, Explorar, Agenda, Favoritos, Perfil. Ancho de 158 px.
- Una columna en móvil y dos desde 700 px. Los placeholders de las otras secciones no incorporan funciones finales.

Las variables de `:root` concentran la paleta y las medidas principales. La paleta actual combina crema rosado, granate suave y rosa empolvado; los nombres de tokens describen ya esos colores. Los SVG son provisionales; su color forma parte de cada asset y se sustituirá junto con la ilustración definitiva.

## CULTURA v0.1.1

Revisión incremental sin rediseñar, añadir detalle de evento ni modificar el catálogo o los datos demo:

- **Splash:** mantiene colores y tipografía. El texto entra entre 250 y 800 ms, permanece 800 ms y todo desaparece de 1600 a 2000 ms. El modo de movimiento reducido conserva su duración abreviada.
- **Fecha:** se conservan los cinco presets y se añade Fecha personalizada. Permite un día o un intervalo inclusivo, también dentro de meses o años. No hay tope artificial al futuro. Al cambiar de preset se borran los valores personalizados para evitar contradicciones.
- **Validación de fecha:** un intervalo incompleto o invertido no se aplica y muestra una explicación; los campos exponen límites recíprocos y estado inválido. Limpiar fecha personalizada vuelve a Cualquier fecha sin alterar otros filtros.
- **Precio:** mínimo y máximo inclusivos entre 0 y 1.000 €, en pasos de 1 €. Un único slider visual de doble tirador y campos numéricos permiten deslizar, usar teclado o escribir el valor. Para ver solo gratis, usar 0–0.
- **Distancia:** mismo control entre 0 y 1.000 km, en pasos de 1 km, sobre distancias ficticias.
- **Coordinación de extremos:** al deslizar o usar teclado, cada tirador se detiene en el otro y nunca lo cruza. Al escribir números se conserva el comportamiento anterior: si el mínimo supera al máximo, el máximo acompaña al mínimo; si el máximo baja del mínimo, el mínimo acompaña al máximo. Valores fuera de 0–1.000 se limitan al dominio y un campo vacío se restaura al salir.
- **Pista dual:** dos controles range accesibles, con sus pistas nativas transparentes, comparten una única barra. JavaScript actualiza el tramo resaltado mediante porcentajes CSS. El mínimo es redondo y el máximo cuadrado; sus zonas de interacción son de 44 × 44 px y tienen foco visible. Cuando quedan próximos (menos de 52 px), se separan verticalmente junto a la misma pista, mínimo arriba y máximo abajo, incluso en 0–0 o 999–1.000. ResizeObserver recalcula esta disposición al abrir los grupos y cambiar de tamaño. No añade dependencias.
- **Categorías:** checkboxes generados desde las 11 categorías y 59 subcategorías del catálogo. No se copia ese catálogo en JavaScript.
- **Subcategorías:** aparecen al marcar su categoría. Varias categorías se unen por OR; cada categoría incluye todas sus subcategorías si no se marca ninguna, o solo las marcadas. Al desmarcar una categoría se eliminan sus subfiltros.
- **Combinación:** fecha, precio, distancia, categorías/subcategorías y búsqueda se intersectan por AND.
- **Limpiar filtros:** restaura cualquier fecha, 0–1.000 € y km, ningún checkbox y búsqueda vacía, sin recargar.
- **Responsive y accesibilidad:** grupos desplegables nativos, labels, fieldset/legend y valores hablados de sliders. Los controles se apilan en móvil; las subcategorías usan una zona de altura acotada para evitar un panel desmesurado.

Las tarjetas, navegación, header, ilustraciones y resolución de imágenes conservan su funcionamiento. La versión de caché de `sw.js` pasa a v0.1.1. El servidor de revisión sigue en la URL local indicada más abajo.

Los eventos demo solo cubren aproximadamente dos semanas: una búsqueda válida a tres meses, seis meses o un año puede devolver cero resultados. Esto no es un límite del calendario.

## Revisión visual de filtros y paleta

Los cuatro selectores —Fecha, Precio, Distancia y Categorías— comparten una rejilla y un único panel de contenido. En escritorio y tablet amplia aparecen en una sola fila; en móvil se organizan 2 × 2 para conservar legibilidad. Al abrir uno se cierra el anterior, pero los valores elegidos se mantienen y continúan combinándose.

Cada selector es un botón real vinculado por `aria-controls` a su panel y comunica el estado mediante `aria-expanded`, por lo que funciona con ratón, tacto y teclado. El panel común no duplica controles ni cambia la lógica de filtrado. La interfaz adopta crema rosado, granate pastel y rosa empolvado mediante los tokens globales; por tanto, header, navegación, foco, filtros y tarjetas mantienen una identidad coherente sin añadir un cuarto color. El texto CULTURA del header incorpora un contorno de 0,35 px en granate profundo y una sombra mínima como respaldo compatible, sin cambiar tipografía ni animación del buscador.

En estado neutral, cada botón muestra solamente Fecha, Precio, Distancia o Categorías, centrado. Un resumen aparece solo con un valor realmente aplicado: preset o fecha personalizada válida; rango distinto de 0–1.000; o alguna categoría/subcategoría. Una categoría incluye su nombre y primera subcategoría si procede; varias categorías se compactan como «Música +2». CSS reserva el indicador y aplica elipsis a textos largos para evitar saltos y desbordamiento.

## Datos locales

`app/data/eventos.json` contiene 16 registros ficticios con id, nombre, categoría, subcategoría, fecha, hora, lugar, localidad, precio y descripción. Incluye artista y distanciaKm para probar búsqueda y cercanía.

`fechaBase` permite trasladar las fechas de los ejemplos al día local de apertura. Los eventos no envejecen mientras se prueba el prototipo; no son agenda real. Los filtros intersectan sus condiciones, y distanciaKm es una cifra de ejemplo desde Granada, no una ubicación calculada. No se pide geolocalización.

`app/data/categorias.json` contiene el catálogo completo. Sus identificadores sin acentos son estables; `nombre` es la etiqueta visible y `archivo` indica la ilustración disponible. `null` utiliza la genérica.

Esta v0.1 no lee ni borra los eventos, notas o preferencias que la aplicación anterior guardó en localStorage. Las antiguas herramientas de edición/importación no se presentan en esta interfaz, según el alcance de Inicio y placeholders aprobado. No hay migración ni sincronización.

## Ilustraciones

La ruta se resuelve como `assets/images/categorias/{categoria}/{archivo}`. Dos conciertos de rock comparten `musica/rock.svg`. La improvisación demo usa `generica.svg`, pues aún no tiene asset asignado.

Un error al cargar un asset también activa el fallback. Para cambiar el formato, sustituir el recurso y actualizar `archivo` en el catálogo; no modificar la lógica. Consultar [la guía para ilustradores](GUIA_ILUSTRACIONES_CATEGORIAS.md) para catálogo y especificaciones.

## Manifest y modo sin conexión

El manifest identifica la PWA como CULTURA. El service worker precachea HTML, CSS, JavaScript, JSON, iconos y SVG; consulta la red primero y usa su caché cuando no está disponible. La caché está separada por alcance. Los errores de assets no se sustituyen por HTML.

Mientras el prototipo siga utilizándose, al añadir o sustituir ilustraciones se mantendrá también la lista ASSETS de `app/sw.js` y se cambiará su versión si se modifica el conjunto offline.

El manifest y el service worker pertenecen al prototipo legado. No se trasladarán literalmente a Android o iOS; la futura aplicación Expo utilizará su propia configuración de aplicación, assets, builds y estrategia de actualizaciones. Las referencias cromáticas antiguas del manifest quedan registradas como parte del legado y no se corrigen en esta fase documental.

## Prueba local

Para revisar el prototipo, servir `app/` como raíz con un servidor HTTP ya disponible y no abrir el HTML con `file://`: la carga JSON y la PWA necesitan HTTP.

El servidor y el puerto son temporales. Deben iniciarse y confirmarse en cada sesión; esta guía no presupone que exista un servidor activo. No es necesario instalar dependencias para servir el prototipo.

## Arquitectura objetivo

La arquitectura es mobile-first con React Native, Expo, TypeScript estricto y Expo Router. Las rutas actuales están en `src/app/`; componentes, funcionalidades, servicios, hooks, utilidades, tipos, theme, configuración y fixtures tendrán responsabilidades separadas conforme sean necesarios.

El frontend dependerá de interfaces y adaptadores para poder sustituir datos locales por una API sin acoplar la UI a un proveedor. Se empezará con hooks y `useReducer`; no se añadirá estado global sin una necesidad demostrada.

El sistema visual se centralizará en un theme. Nombre definitivo, logo, paleta, tipografía, mascota e ilustraciones podrán cambiar sin quedar repetidos por toda la aplicación.

Usuarios, perfiles, favoritos reales, agenda real, notificaciones, organizadores, moderación, backend, base de datos y expansión territorial siguen fuera de esta fase. La ubicación comenzará en foreground, la cercanía contará con apoyo del backend y no se mantendrá una geofence por evento.

Consultar:

- [Arquitectura objetivo](arquitectura/ARQUITECTURA_OBJETIVO.md).
- [ADR-001: React Native + Expo](decisiones/ADR-001-react-native-expo.md).
- [ADR-002: estructura inicial con Expo Router](decisiones/ADR-002-estructura-src-expo-router.md).
- [ADR-003: theme centralizado y shell compartido](decisiones/ADR-003-theme-y-shell.md).
- [ADR-004: navegación con tabs, stack y rutas enlazables](decisiones/ADR-004-estructura-navegacion.md).
- [ADR-005: modelo de dominio y repositorios desacoplados](decisiones/ADR-005-modelo-datos-y-repositorios.md).
- [ADR-006: Home basada en repositorio y lista virtualizada](decisiones/ADR-006-home-y-listado-eventos.md).
- [Plan de migración Expo](migracion/PLAN_MIGRACION_EXPO.md).

## Base Expo creada

El código ejecutable nuevo vive en `src/` y utiliza el enrutamiento por archivos de Expo Router. `src/app/_layout.tsx` configura el proveedor de área segura y el layout raíz. `src/app/(tabs)/_layout.tsx` declara las cinco pestañas estables en el orden Explorar, Agenda, Inicio, Favoritos y Perfil, con Inicio como ruta inicial y posición central.

Inicio ya renderiza la primera pantalla real mediante `HomeScreen`; las otras cuatro tabs y las rutas auxiliares siguen usando placeholders pequeños compartidos. El sistema visual se concentra en `src/theme/`, el shell reutilizable en `src/components/layout/` y la marca provisional en `src/config/brand.ts`. Home consume los repositorios de fixtures sin importar JSON directamente. Los filtros, la búsqueda y los assets de ilustración continúan pendientes.

Los comandos disponibles son:

- `npm start`: inicia Expo para elegir plataforma.
- `npm run android`: abre la aplicación para Android cuando exista un emulador o dispositivo disponible.
- `npm run ios`: prepara el inicio para iOS; la ejecución local completa requiere macOS o un dispositivo/servicio compatible.
- `npm run web`: inicia la versión web.
- `npm run typecheck`: valida TypeScript sin emitir archivos.

La convivencia es intencionada: `app/` sigue siendo el prototipo legado y `src/` es la base del producto migrado. No deben mezclarse rutas, service workers, manifests, datos ni assets de ambas implementaciones.

## Theme y shell compartido

`src/theme/` ofrece tokens semánticos para que los componentes expresen la función de cada valor en lugar de repetir colores o medidas. Incluye colores de fondo, superficies, marca, texto, bordes y estados; estilos tipográficos con fuente del sistema; una escala de espaciado; radios; sombras suaves por plataforma; duraciones y curvas conceptuales de movimiento; y breakpoints de móvil, tablet y escritorio.

`AppShell` establece el fondo general y aplica la safe area superior y lateral. `ScreenContainer` aporta padding responsive, ancho máximo centrado en web y una variante scrollable cuando una pantalla la necesite. La safe area inferior queda bajo la responsabilidad de la navegación por pestañas, evitando padding duplicado.

Home y los placeholders restantes consumen el shell y el contenedor compartidos. Home añade un header granate y tarjetas suaves; las demás pantallas conservan una superficie elevada mínima. La StatusBar mantiene contenido oscuro sobre el fondo crema claro.

La identidad continúa siendo provisional. Nombre y referencias de logo, icono y mascota se concentran en `src/config/brand.ts`; la paleta y la tipografía pueden sustituirse desde el theme. Permanecen pendientes el splash, buscador, filtros, ilustraciones reales, sidebar y funcionalidades de las restantes pestañas.

## Navegación base enlazable

La navegación principal mantiene cinco tabs, en este orden: Explorar, Agenda, Inicio, Favoritos y Perfil. Inicio continúa como ruta inicial y ocupa la tercera posición. En esta fase web usa las mismas tabs que native; la navegación lateral de escritorio sigue pendiente.

El stack raíz compone las tabs con rutas auxiliares delgadas:

- `/eventos/[eventId]`: detalle provisional que muestra el identificador recibido;
- `/buscar?q=...`: búsqueda provisional que muestra el término opcional;
- `/organizadores/[organizerId]`: perfil provisional que muestra el identificador;
- `/notificaciones`: futura lista de notificaciones y punto de entrada para enlaces a eventos;
- `/filtros`: pantalla del grupo `(modals)`, presentada como modal mediante Expo Router.

`PlaceholderScreen` proporciona título accesible, descripción, parámetro opcional y acción de vuelta a las rutas que siguen provisionales. Si una URL se abre directamente y no existe historial, Volver lleva a Inicio. El modal de filtros continúa disponible como infraestructura de navegación, pero la Home no muestra todavía un acceso ni implementa filtros reales.

La estructura de archivos ya permite rutas web directas y enlaces con el esquema `cultura://`, pero no se han configurado dominios universales, app links ni servicios de producción. Home carga datos demo; no se ejecutan búsquedas, notificaciones o filtros reales.

## Home Expo

La ruta `src/app/(tabs)/index.tsx` se mantiene delgada y compone `HomeScreen`. La pantalla usa `AppShell` para la safe area y el fondo, coloca `HomeHeader` fuera de la lista y delega el contenido en `EventList`. `HomeHeader` obtiene `CULTURA` desde `src/config/brand.ts` y consume únicamente tokens del theme. No contiene buscador ni acciones provisionales.

`HomeScreen` crea una sola pareja de repositorios por montaje mediante `createHomeRepositories`: `FixtureEventRepository` aporta `EventResult` y `FixtureCategoryRepository` resuelve nombres de categoría y subcategoría. La prop opcional `repositories` permite sustituirlos en pruebas o por implementaciones remotas sin introducir un framework de inyección ni acoplar la UI al JSON.

`useHomeEvents` inicia la carga, expone `loading`, `error`, `data`, categorías y `retry`, y ordena los resultados con una función pura. Cada efecto conserva una marca de actividad; al cambiar de repositorio, reintentar o desmontar, una respuesta anterior deja de poder actualizar el estado. Los errores del repositorio se convierten en un mensaje estable para la interfaz.

`EventList` usa `FlatList`, claves de evento estables y renderizado inicial limitado. Muestra una columna en móvil y dos desde el breakpoint de tablet mientras el escalado de texto no supere el límite previsto; cuando aumenta, vuelve a una columna. La lista se remonta al cambiar el número de columnas, según requiere React Native. El encabezado presenta Inicio, Granada, el recuento de planes y el aviso de que eventos y distancias son ficticios.

`EventCard` es una pieza visual no interactiva en este paso. Presenta categoría y subcategoría, título, fecha/hora en la zona del evento, lugar/localidad, distancia demo y precio. Los bordes alternan tres tokens suaves. Reserva un espacio decorativo sin descripción para la futura ilustración y acepta un asset ya resuelto, pero no convierte claves en rutas ni importa SVG. Las tarjetas no navegan aún al detalle.

Las funciones de `presentation.ts` ordenan por instante de inicio y, en empate, por distancia disponible; los resultados sin distancia quedan después de los que sí la tienen. El orden no muta la entrada. La fecha se formatea con `Intl` y la zona IANA del evento. El precio consume `EventPrice`: `Gratis`, importe fijo o intervalo, conservando céntimos cuando existen. La distancia se etiqueta explícitamente como demo.

Los estados viven en componentes separados. Loading expone una región viva y `aria-busy`; empty comunica que todavía no hay encuentros; error usa rol de alerta y ofrece un botón Reintentar de 44 px con foco visible. La solución usa props aceptadas por React Native y React Native Web, sin APIs del DOM en el código universal.

La validación web cubre 390×844, 800×1280, 1440×900 y cambio de orientación: una/dos columnas, etiquetas completas en la navegación, jerarquía de encabezados, ausencia de overflow y tarjetas sin elementos interactivos. También fuerza loading, empty, error, retry, desmontaje y respuestas obsoletas mediante una ruta temporal que no forma parte del resultado final. `scripts/validate-home.ts` comprueba orden, offsets, estabilidad, precios, etiquetas y formato en Madrid sin framework adicional.

Quedan fuera de este paso el splash, búsqueda y filtros funcionales, navegación desde tarjetas, favoritos, agenda, assets reales, sidebar de escritorio, ubicación, persistencia y backend.

## Modelo de datos Expo

El Paso 5 incorporó los datos de demostración tipados y el Paso 6 conecta sus repositorios únicamente a Home. El flujo es: JSON legado → fixtures → mapper y repositorios → dominio → hook de Home. Solo `src/data/fixtures/legacyEvents.ts` y `legacyCategories.ts` importan los JSON de `app/data/`. TypeScript admite esos imports mediante `resolveJsonModule`, heredado de Expo. No se copian manualmente los 16 registros ni el catálogo 11/59.

### Modelo de dominio

- `Event` contiene identidad, título, descripción y artista opcionales, categoría/subcategoría, inicio y fin opcional, localización, precio y estado. Admite organizador, fuente, entradas, clave de ilustración, media y accesibilidad opcionales para crecer sin inventar datos en los fixtures.
- `EventStatus` permite `scheduled`, `postponed`, `cancelled` y `soldOut`; el mapper actual usa `scheduled`.
- `EventLocation` incluye lugar, localidad, zona IANA y dirección/coordenadas opcionales. Los datos actuales no incluyen coordenadas ni dirección postal.
- `EventPrice` es una unión discriminada: `free` con moneda EUR; `fixed` con `amountCents`; o `range` con `minAmountCents` y `maxAmountCents`. Los importes son enteros seguros en céntimos. Cero se normaliza a `free`, un rango debe tener mínimo menor que máximo y no se mantienen campos paralelos `gratis`/`precio`.
- `EventResult` contiene `event` y `distanceMeters` opcional. La distancia depende del usuario o consulta, por eso no forma parte del evento canónico. La demo transforma `distanciaKm` a metros ficticios; no calcula ubicación real.
- `Category` contiene id, nombre y subcategorías. `Subcategory` tiene id, `categoryId`, nombre y clave de ilustración opcional. Se conservan los IDs. Algunos se repiten entre categorías: una subcategoría se identifica por el par `categoryId`/`id`.

Los alias `ISODateTime` y `TimeZone` expresan contratos, no validan strings por sí solos. Las comprobaciones en el límite de datos verifican calendario, offset y zona. Los campos de accesibilidad ausentes significan información desconocida.

### Fixtures y mapper

`LegacyEventFixture` refleja exactamente los campos actuales en español. El JSON no contiene `gratis`, rangos, fin, organizadores ni coordenadas. `mapLegacyEventToEvent` es una función pura: recibe un registro legado y categorías de dominio, convierte nombres, omite textos opcionales vacíos, traduce euros a céntimos y valida la relación categoría/subcategoría. No altera la entrada ni lee el reloj.

Las claves de ilustración son semánticas, por ejemplo `musica/rock`; `generica` es el fallback cuando no existe ilustración asignada. No son rutas de archivos. Dos eventos de la misma subcategoría comparten la clave. No se importan SVG ni se crea todavía un mapa de assets Expo; esa integración corresponde a su fase futura.

`fechaBase` se utiliza exclusivamente dentro del fixture de eventos. Sus diferencias de días se trasladan a un día de referencia, por defecto el día actual en `Europe/Madrid`. El repositorio captura ese día al construirse para que `list` y `getById` sean coherentes aunque cruce medianoche. Para renovar la demo se crea otra instancia; para pruebas se inyecta `referenceDate: 'YYYY-MM-DD'`. El desplazamiento opera sobre días civiles y conserva la hora local incluso al atravesar un cambio de horario.

El mapper combina fecha/hora con `Europe/Madrid` y emite un instante ISO UTC terminado en `Z`, conservando la zona en `location.timeZone`. Se utilizan `Intl.DateTimeFormat` y `Date` estándar, sin DOM ni librerías de fechas. No se presupone la zona del dispositivo. Las horas inexistentes o ambiguas del cambio de horario se rechazan: el legado no aporta un offset para resolverlas. Los fixtures actuales no usan esas horas.

### Repositorios y sustitución futura

`EventRepository` expone `list(): Promise<EventResult[]>` y `getById(id): Promise<Event | null>`. `FixtureEventRepository` carga y mapea los registros; `includeDemoDistance: false` permite omitir la distancia ficticia. `CategoryRepository` y `FixtureCategoryRepository` ofrecen los mismos métodos para `Category`. Un id desconocido devuelve `null`; una carga inválida rechaza la promesa y no devuelve resultados parciales.

Las implementaciones devuelven objetos independientes en cada llamada para que las modificaciones del consumidor no corrompan los fixtures. No hay caché global, red ni consultas complejas. Home depende de sus interfaces, por lo que un backend podrá sustituir los repositorios y su adaptador sin exponer transporte ni formato a los componentes. Todavía no se ha elegido proveedor ni añadido lógica de filtros.

### Validación reproducible

Las comprobaciones son simples y se ejecutan también al cargar el repositorio: IDs no vacíos ni duplicados, relaciones de catálogo, céntimos seguros no negativos, instantes válidos, zona horaria y coordenadas dentro de rango si existen. Los registros incorrectos provocan errores explícitos; no se reparan silenciosamente.

No existe framework de testing. `scripts/validate-data.ts` usa las aserciones estándar de Node y los tipos de Node ya disponibles a través de las dependencias existentes. Se compila con el TypeScript local a una carpeta temporal; no modifica `package.json` ni necesita instalar nada. Desde la raíz, estos comandos se ejecutan secuencialmente, deteniéndose si falla alguno:

```powershell
node node_modules/typescript/bin/tsc --ignoreConfig --module node16 --moduleResolution node16 --target es2022 --esModuleInterop --resolveJsonModule --strict --skipLibCheck --rootDir . --outDir .tmp-paso5-check scripts/validate-data.ts
node .tmp-paso5-check/scripts/validate-data.js
npm run typecheck
npx expo-doctor
git diff --check
```

Usar `.tmp-paso5-check` solo si no existe previamente y retirar después únicamente esa carpeta de comprobación, verificando que su ruta absoluta queda dentro del repositorio. El script cubre 16 eventos, 11 categorías, 59 subcategorías, los 4 gratuitos y 12 de precio fijo, búsquedas por id/null, aislamiento de resultados, mapper puro, distancia fuera de Event, céntimos y entradas inválidas. También comprueba años bisiestos, cruce de año, verano/invierno y horas ambiguas/inexistentes de Madrid. Compilar y probar en Node no sustituye la futura validación de estas APIs en dispositivos Android/iOS.

## Documentación futura

La documentación de cada funcionalidad React Native explicará su propósito, componentes, estado, flujo de datos, rutas, servicios, accesibilidad, puntos configurables y pruebas. Los ADR conservarán el contexto de las decisiones duraderas sin duplicar literalmente el código.

La marca de trabajo sigue siendo CULTURA; Granada solo aparece como territorio piloto y contenido ficticio. Home es la primera interfaz migrada. Todavía no hay autenticación, cuentas, recopiladores, agentes ni servicios de producción.
