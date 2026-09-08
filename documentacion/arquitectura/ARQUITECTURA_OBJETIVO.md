# Arquitectura objetivo de CULTURA

## Qué se está construyendo

CULTURA evolucionará desde el prototipo web actual hacia una aplicación mobile-first. Esto significa que se diseñará y validará primero para teléfonos, sin dejar de ofrecer una versión cuidada para tablet y web.

El orden de prioridad será:

1. Android.
2. iOS.
3. Web como plataforma complementaria.

El prototipo de `app/` continúa siendo la referencia visual y funcional durante la migración. La nueva aplicación no lo sustituirá hasta alcanzar suficiente paridad y recibir aprobación expresa.

## Tecnologías principales

- **React Native:** permite construir interfaces nativas para Android e iOS y compartir gran parte del trabajo con web.
- **Expo:** aporta herramientas de desarrollo, compilación y acceso controlado a capacidades del dispositivo.
- **TypeScript estricto:** ayuda a detectar datos incorrectos y contratos incompletos antes de ejecutar la aplicación.
- **Expo Router:** organiza la navegación mediante archivos y prepara las pantallas para enlaces profundos.

Estas tecnologías sostienen la navegación, las pantallas provisionales y la primera Home real con eventos demo. El resto de la interfaz y las funcionalidades del prototipo continúa pendiente de migración.

## Base actual y estructura de crecimiento

La base creada utiliza actualmente `src/app/`, `src/components/`, `src/components/layout/`, `src/theme/`, `src/config/`, `src/features/events/`, `src/features/categories/`, `src/types/` y `src/data/fixtures/`. Conforme cada fase necesite nuevas responsabilidades, crecerá hacia esta estructura:

```text
src/
├── app/                 rutas y layouts de Expo Router
├── components/          piezas visuales reutilizables
├── features/            funcionalidades agrupadas por área
├── services/            acceso a APIs y capacidades externas
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

Las rutas enlazables actuales son `/eventos/[eventId]`, `/buscar`, `/organizadores/[organizerId]` y `/notificaciones`. El modal provisional de filtros se organiza en `(modals)/filtros`. Los segmentos dinámicos y la query de búsqueda solo se muestran en placeholders; todavía no consultan datos ni servicios.

El esquema `cultura` y la estructura de Expo Router dejan preparada la navegación mediante deep links. Los dominios universales de iOS y Android, la asociación con un dominio web y los destinos de notificaciones push se configurarán únicamente cuando exista una tarea específica y entornos de publicación definidos.

En web amplia, la navegación podrá transformarse en una barra lateral compacta conservando las mismas rutas y el mismo contenido.

## Theme e identidad

Los colores, tipografías, espacios, radios, sombras, movimiento y breakpoints ya se definen mediante tokens semánticos en un theme central. Las sombras resuelven sus pequeñas diferencias desde el propio theme para Android, iOS y web.

`AppShell` controla el fondo y la safe area superior y lateral. `ScreenContainer` controla el padding responsive, el ancho máximo y el contenido scrollable. La navegación por pestañas conserva la safe area inferior, de modo que cada pantalla no la aplique por duplicado.

Home separa composición, estado y presentación dentro de `src/features/events/`. `HomeScreen` une shell, header y lista; `useHomeEvents` carga interfaces de repositorio y protege frente a respuestas obsoletas; `EventList` virtualiza con `FlatList`; y `EventCard` consume únicamente datos de dominio y funciones de presentación. La composición por defecto instancia los repositorios de fixtures una vez por montaje y puede sustituirse sin modificar los componentes.

En móvil la lista usa una columna; desde tablet usa dos si el escalado de texto lo permite. Los estados loading, empty y error son componentes explícitos. El espacio de ilustración es decorativo y no resuelve assets todavía. Consultar [ADR-006](../decisiones/ADR-006-home-y-listado-eventos.md).

El nombre de trabajo es CULTURA y Granada es el territorio piloto. Nombre definitivo, logo, paleta, tipografía, mascota e ilustraciones seguirán siendo sustituibles sin tener que recorrer todos los componentes.

## Datos y filtros

Los JSON actuales se reutilizan mediante imports estáticos aislados en `src/data/fixtures/`, sin copiar datos ni modificar el prototipo. `LegacyEventFixture` describe el formato heredado y `mapLegacyEventToEvent` lo transforma al dominio. Home consume los repositorios; las rutas y componentes no importan el formato legado.

`EventRepository` y `CategoryRepository` exponen `list` y `getById` asíncronos. Sus implementaciones `FixtureEventRepository` y `FixtureCategoryRepository` devuelven objetos independientes de dominio y rechazan datos inválidos. Las categorías conservan los IDs existentes y cada subcategoría pertenece a una categoría; sus IDs no se consideran globalmente únicos.

`Event` usa `EventPrice` discriminado (gratis, fijo o rango en céntimos enteros), instantes ISO con offset y zona IANA explícita en la localización. El mapper emite UTC y utiliza `Europe/Madrid`, sin depender de la zona del dispositivo. Los datos ausentes permanecen opcionales. La adaptación temporal de fechas se limita a los fixtures y captura un día de referencia por instancia del repositorio. Las horas ambiguas o inexistentes de Madrid se rechazan.

Las claves de ilustración son semánticas y tienen fallback `generica`; no se importan assets todavía. Las validaciones y las funciones de conversión son puras y no utilizan el DOM. Consultar [ADR-005](../decisiones/ADR-005-modelo-datos-y-repositorios.md) y la sección Modelo de datos Expo de la guía para contratos y pruebas.

La lógica conceptual de búsqueda, fecha, precio, distancia, categorías y subcategorías se reescribirá como funciones puras. Un hook o reducer mantendrá el estado de los controles. No se añadirá una store global mientras el alcance no la justifique.

La distancia futura se calculará a partir de coordenadas. El repositorio demo convierte `distanciaKm` en `EventResult.distanceMeters`, que puede omitirse. No forma parte de `Event`: cambiar de usuario o consulta cambia la distancia, no la identidad ni los datos canónicos del evento.

## Assets e ilustraciones

CULTURA mantendrá una ilustración reutilizable por categoría o subcategoría, nunca una imagen distinta para cada evento como sistema base.

Existirán:

- un mapa explícito entre categoría/subcategoría y asset;
- una ilustración genérica de fallback;
- iconos y recursos de marca separados;
- una ruta clara para sustituir placeholders por ilustraciones definitivas de un dibujante externo.

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
