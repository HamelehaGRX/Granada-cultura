# Arquitectura objetivo de CULTURA

## Qué se está construyendo

CULTURA utiliza ya una aplicación mobile-first en Expo como base principal. Se diseña y valida primero para teléfonos, sin dejar de ofrecer una versión cuidada para tablet y web.

El orden de prioridad será:

1. Android.
2. iOS.
3. Web como plataforma complementaria.

El prototipo de `app/` se conserva intacto y congelado como referencia histórica. La aplicación Expo no importa código, datos ni assets desde esa carpeta; el legado no recibirá funcionalidad nueva ni se moverá o retirará sin aprobación expresa.

## Tecnologías principales

- **React Native:** permite construir interfaces nativas para Android e iOS y compartir gran parte del trabajo con web.
- **Expo:** aporta herramientas de desarrollo, compilación y acceso controlado a capacidades del dispositivo.
- **TypeScript estricto:** ayuda a detectar datos incorrectos y contratos incompletos antes de ejecutar la aplicación.
- **Expo Router:** organiza la navegación mediante archivos y prepara las pantallas para enlaces profundos.

Estas tecnologías sostienen la navegación, las pantallas provisionales, la Home real y el detalle de evento con datos demo, búsqueda, filtros y preferencias persistentes, splash de marca e ilustraciones temporales. Las funcionalidades de producto aplazadas continúan fuera de la migración base.

## Base actual y estructura de crecimiento

La base creada utiliza actualmente `src/app/`, `src/components/`, `src/components/layout/`, `src/theme/`, `src/config/`, `src/features/events/`, `src/features/categories/`, `src/types/` y `src/data/fixtures/`. Conforme cada fase necesite nuevas responsabilidades, crecerá hacia esta estructura:

```text
src/
├── app/                 rutas y layouts de Expo Router
├── components/          piezas visuales reutilizables
├── features/            funcionalidades agrupadas por área
├── services/            acceso a APIs y capacidades externas
├── storage/             persistencia local no sensible, claves y migraciones
├── hooks/               comportamiento React compartido
├── utils/               funciones puras
├── types/               contratos compartidos de TypeScript
├── theme/               sistema visual centralizado
├── config/              configuración y datos de marca
└── data/
    └── fixtures/        datos ficticios locales
```

No se crean carpetas vacías por anticipado. Cada parte aparece cuando una fase de migración la necesita.

## Cómo se separarán las responsabilidades

La interfaz mostrará información y recogerá acciones. Las reglas de negocio decidirán cómo filtrar, ordenar o validar. Los servicios se comunicarán con datos locales, una API o funciones del dispositivo.

Esta separación permitirá, por ejemplo, sustituir los eventos ficticios por eventos de un servidor sin reescribir las tarjetas o los filtros.

Las rutas de Expo Router serán delgadas: elegirán qué pantalla se muestra y cómo se navega, pero no contendrán las reglas completas de la aplicación.

## Pantallas y navegación

En móvil se mantendrá el orden aprobado:

1. Explorar.
2. Agenda.
3. Inicio.
4. Favoritos.
5. Perfil.

Inicio ocupa la posición central y es la ruta inicial. Esa ruta compone `HomeScreen`, mientras las restantes tabs continúan provisionales. El stack raíz incluye rutas delgadas para detalle de evento, búsqueda, organizadores, notificaciones y el grupo de modales.

La ruta `/eventos/[eventId]` ya ofrece el detalle real sobre `EventRepository`, con cabecera persistente, acciones personales, ticketing seguro, información ampliada y relacionados. Las rutas de organizador y notificaciones continúan provisionales. `/buscar?q=…` entrega la consulta a Home y `/filtros`, en el grupo `(modals)`, abre su panel inline. Ambas entradas redirigen al mismo estado local y consumen sus parámetros. No hay una segunda UI de filtros dentro del modal ni acceso a servicios.

El esquema `cultura` y la estructura de Expo Router dejan preparada la navegación mediante deep links. Los dominios universales de iOS y Android, la asociación con un dominio web y los destinos de notificaciones push se configurarán únicamente cuando exista una tarea específica y entornos de publicación definidos.

En web, desde 1100 px, las mismas tabs se presentan como una barra lateral compacta a la izquierda. Por debajo del breakpoint se conserva la navegación inferior; el cambio responde al redimensionado sin recarga y no duplica rutas ni shell.

## Theme e identidad

Los colores, tipografías, espacios, radios, sombras, movimiento y breakpoints se definen mediante tokens semánticos en un theme central. `AppThemeProvider` mantiene una única preferencia global `light`, `dark` o `system`; separa esa elección del tema efectivo y entrega a toda la UI la paleta activa. `system` se resuelve con `useColorScheme` y reacciona a cambios del dispositivo mientras la aplicación está abierta.

Las paletas clara y oscura comparten los mismos contratos semánticos para fondos, superficies, textos, marca, bordes, inputs, overlay y estados. Las categorías también disponen de apariencias centralizadas por tema sin perder su familia cromática ni su rótulo. La preferencia se guarda como dato local no sensible en `cultura.themePreference`; nunca se persiste el tema efectivo. Consultar [ADR-013](../decisiones/ADR-013-tema-global-claro-oscuro-sistema.md).

`AppShell` controla el fondo y la safe area superior y lateral. `ScreenContainer` controla el padding responsive, el ancho máximo y el contenido scrollable. La navegación por pestañas conserva la safe area inferior, de modo que cada pantalla no la aplique por duplicado.

`AppSplash`, montado desde el layout raíz, implementa la secuencia visual CULTURA con primitivas `Animated`, usa el tema efectivo y consulta `AccessibilityInfo` para reducirla cuando el sistema solicita menos movimiento. Antes de hidratar la preferencia, el layout mantiene una superficie granate neutral y no monta la navegación, reduciendo el flash de un tema incorrecto. Es una capa de UI independiente del splash técnico nativo y no introduce branding definitivo en `app.json`.

Home separa composición, estado y presentación dentro de `src/features/events/`. `HomeScreen` une shell, header y lista; `useHomeEvents` carga interfaces de repositorio y protege frente a respuestas obsoletas; `EventList` virtualiza con `FlatList`; y `EventCard` consume únicamente datos de dominio y funciones de presentación. La composición por defecto instancia los repositorios de fixtures una vez por montaje y puede sustituirse sin modificar los componentes.

En móvil la lista usa una columna; desde tablet usa dos si el escalado de texto lo permite. Los estados loading, empty y error son componentes explícitos. Cada tarjeta compone una ilustración decorativa resuelta fuera de `EventCard`. Consultar [ADR-006](../decisiones/ADR-006-home-y-listado-eventos.md) y [ADR-010](../decisiones/ADR-010-cierre-paridad-visual.md).

El nombre de trabajo es CULTURA y Granada es el territorio piloto. Nombre definitivo, logo, paleta, tipografía, mascota e ilustraciones seguirán siendo sustituibles sin tener que recorrer todos los componentes.

## Datos y filtros

Expo posee sus copias exactas de demostración en `src/data/fixtures/raw/`. Los imports estáticos quedan aislados en `src/data/fixtures/`; no resuelven dentro de `/app`. `LegacyEventFixture` describe el formato heredado y `mapLegacyEventToEvent` lo transforma al dominio. Home consume los repositorios; las rutas y componentes no importan el formato legado.

`EventRepository` y `CategoryRepository` exponen `list` y `getById` asíncronos. Sus implementaciones `FixtureEventRepository` y `FixtureCategoryRepository` devuelven objetos independientes de dominio y rechazan datos inválidos. Las categorías conservan los IDs existentes y cada subcategoría pertenece a una categoría; sus IDs no se consideran globalmente únicos.

`Event` usa `EventPrice` discriminado (gratis, fijo o rango en céntimos enteros), instantes ISO con offset y zona IANA explícita en la localización. El mapper emite UTC y utiliza `Europe/Madrid`, sin depender de la zona del dispositivo. Los datos ausentes permanecen opcionales. La adaptación temporal de fechas se limita a los fixtures y captura un día de referencia por instancia del repositorio. Las horas ambiguas o inexistentes de Madrid se rechazan.

Las claves de ilustración son semánticas y tienen fallback `generica`. Un mapa central las resuelve a placeholders gráficos hechos con primitivas React Native, compatibles con Android, iOS y web y sustituibles después por assets estáticos. Las validaciones y las funciones de conversión son puras y no utilizan el DOM. Consultar [ADR-005](../decisiones/ADR-005-modelo-datos-y-repositorios.md), [ADR-010](../decisiones/ADR-010-cierre-paridad-visual.md) y la sección Modelo de datos Expo de la guía.

El Paso 7 implementa `features/filters/` y `features/search/`: tipos/reducer, lógica pura y componentes separados. Home conserva una instancia local de useEventFilters; filterEvents recibe los datos de repositorio, catálogo, estado e instante de referencia. Combina AND entre tipos de filtro y OR entre categorías/subcategorías. Las fechas respetan la zona del evento; precios se comparan en céntimos y distancia en metros. No hay store global. El Paso 8 añade persistencia local de los filtros, separada del reducer y de la UI.

Los paneles comparten el scroll de FlatList, con triggers 2×2 móvil/una fila tablet. SearchField se expande desde la derecha dentro del mismo header mientras la marca se desplaza y desvanece; cerrar o pulsar Escape limpia la consulta y devuelve el foco a la lupa. La transición usa `Animated` y se vuelve prácticamente inmediata con movimiento reducido. El slider dual y los steppers compactos coordinados cubren precio/distancia; native usa entrada de fecha ISO y web su control date. Una futura consulta remota adaptará FilterState sin acoplar la UI al transporte; ver [ADR-007](../decisiones/ADR-007-busqueda-y-filtros.md) y [ADR-011](../decisiones/ADR-011-dual-range-slider.md).

La distancia futura se calculará a partir de coordenadas. El repositorio demo convierte `distanciaKm` en `EventResult.distanceMeters`, que puede omitirse. No forma parte de `Event`: cambiar de usuario o consulta cambia la distancia, no la identidad ni los datos canónicos del evento.

## Persistencia local no sensible

`src/storage/` contiene claves centralizadas, tipos de sobre/driver, get/set/remove con JSON seguro, la frontera mínima de migraciones y el único adaptador AsyncStorage. `features/filters/persistence.ts` valida el dominio guardado; `usePersistedEventFilters` coordina la hidratación y el guardado automático de la instancia local de Home. `features/events/interactions/` aplica la misma frontera a favorito, Me interesa y Voy a ir mediante un proveedor común para tarjetas y detalle. `AppThemeProvider` utiliza la misma capa para la preferencia de apariencia. La UI no accede al proveedor. El driver sustituible permite pruebas sin native/DOM y la futura incorporación de otras preferencias sin duplicar la capa técnica.

La clave estable `cultura.filters` contiene `{ version: 1, data: ... }`. Solo se persisten fecha, precio, distancia y categorías/subcategorías. `cultura.eventInteractions` usa otro sobre v1 y conserva únicamente favorito y la asistencia local de cada evento. No se persisten query, eventos/resultados, fixtures ni información sensible. La hidratación de filtros espera al catálogo actual, descarta IDs obsoletos, normaliza fechas/rangos y aplica el reducer antes de permitir escrituras. Home usa su loading existente y mantiene la búsqueda temporal. La cola de storage ordena cambios rápidos; la comparación de snapshots evita duplicados.

JSON corrupto y versiones desconocidas vuelven a defaults y se reparan con v1. Un fallo de lectura mantiene defaults en memoria sin sobrescribir storage; los fallos de escritura no bloquean la app. No existe sincronización entre pestañas, dispositivos o cuentas. AsyncStorage no cifra datos sensibles: futuros tokens/credenciales requerirán SecureStore en una tarea específica. Las futuras migraciones serán explícitas y testeadas; actualmente solo existe v1. Ver [ADR-008](../decisiones/ADR-008-persistencia-local.md).

El detalle mantiene separadas carga, presentación, interacciones, ticketing y relacionados. Los enlaces directos de entrada solo se exponen tras una comprobación central de URL, origen oficial y estado. La selección relacionada es local, determinista y explicable: afinidad primero y, como máximo, una propuesta popular compatible. No hay perfilado remoto ni IA. Ver [la documentación del detalle](../DETALLE_EVENTO.md).

## Assets e ilustraciones

CULTURA mantendrá una ilustración reutilizable por categoría o subcategoría, nunca una imagen distinta para cada evento como sistema base.

Actualmente existen:

- un mapa explícito entre `illustrationKey` y representación temporal;
- una representación genérica de fallback;
- iconos y recursos de marca separados;
- una ruta clara para sustituir placeholders por ilustraciones definitivas de un dibujante externo.

Los SVG del prototipo no se importan: React Native native no los consume directamente sin soporte adicional. Los placeholders se construyen con `View` y `Text`, permanecen ocultos al lector de pantalla y conservan la misma interfaz de resolución para sustituirlos por PNG, WEBP u otra estrategia estática aprobada.

## Backend futuro

El frontend hablará con interfaces propias. Detrás de ellas podrá existir primero un repositorio de datos ficticios y, más adelante, una API.

El proveedor de backend no está decidido. El frontend necesitará contratos para eventos, usuarios, favoritos, preferencias, organizadores, notificaciones y moderación sin quedar unido a una marca o servicio concreto.

## Notificaciones y geolocalización

Estas funciones pertenecen a fases futuras.

- La ubicación foreground será el primer nivel de acceso.
- El usuario podrá configurar una ubicación habitual o elegirla manualmente.
- El backend ayudará a buscar eventos cercanos y decidir notificaciones.
- No se mantendrá una geofence por evento.
- Las notificaciones podrán abrir el detalle correspondiente mediante deep links.

## Responsive, accesibilidad y pruebas

Cada funcionalidad visual deberá comprobarse en móvil, tablet y web. También se revisarán escalado de texto, orientación, teclado web, tamaños táctiles, foco y lectores de pantalla.

La validación incluye typecheck, Expo Doctor, navegación, Android, web, iOS cuando corresponda y pruebas del comportamiento. Compilar es necesario, pero no suficiente.

## Documentación

Las copias explicadas de HTML, CSS y JavaScript se conservarán como documentación del prototipo.

El nuevo código TypeScript no se duplicará de forma literal. Cada funcionalidad importante tendrá una guía sobre propósito, componentes, estado, datos, rutas, servicios, accesibilidad, configuración y pruebas. Las decisiones arquitectónicas duraderas se registrarán mediante ADR.
