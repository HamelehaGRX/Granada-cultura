# ADR-004: Navegación con tabs, stack y rutas enlazables

## Estado

Aprobado.

## Contexto

CULTURA necesita una estructura de navegación estable antes de migrar Home, datos o funcionalidades. La base ya dispone de cinco tabs, pero también debe poder representar detalles de eventos, búsquedas, organizadores, notificaciones y pantallas modales de forma coherente en Android, iOS y web.

Estas rutas deberán poder convertirse más adelante en destinos de enlaces web, deep links y notificaciones push sin trasladar lógica de negocio al Router.

## Decisión

Expo Router organiza la navegación mediante un stack raíz declarativo. El stack compone el grupo `(tabs)`, las rutas auxiliares enlazables y el grupo `(modals)`.

Los archivos de ruta se mantienen delgados: leen parámetros de navegación y componen un placeholder reutilizable. No cargan datos, filtran eventos ni acceden a servicios.

## Tabs principales

Las tabs conservan el orden obligatorio Explorar, Agenda, Inicio, Favoritos y Perfil. Inicio es la ruta inicial y ocupa la tercera posición. Web y native comparten por ahora la misma navegación inferior; el sidebar se decidirá en una fase posterior.

## Stack raíz

El layout raíz declara:

- `(tabs)` como navegación principal;
- `eventos/[eventId]` para el detalle de evento;
- `buscar` para la búsqueda;
- `organizadores/[organizerId]` para perfiles de organizadores;
- `notificaciones/index` para la lista futura;
- `(modals)` para presentaciones modales.

Cada pantalla auxiliar incorpora una acción de vuelta. Cuando una URL directa no dispone de historial, la acción sustituye la ruta por Inicio.

## Rutas dinámicas y parámetros

`eventId` y `organizerId` son segmentos dinámicos. `buscar` acepta el parámetro opcional `q`. En esta fase solo se muestran visualmente para verificar el contrato de navegación; sus valores no se consideran datos validados ni activan lógica de dominio.

## Modales

`(modals)/filtros` utiliza una presentación modal del stack compatible con Expo Router. Inicio contiene una acción provisional para abrirlo y la pantalla ofrece Cerrar. La interfaz real de filtros no forma parte de esta decisión.

## Deep links

La estructura admite destinos como `/eventos/123`, `/buscar?q=jazz`, `/organizadores/45` y `/notificaciones`. El esquema provisional de la aplicación es `cultura`.

No se configuran todavía universal links, Android App Links, dominios asociados ni integración real con notificaciones. Esos elementos requerirán identificadores, dominios y entornos de publicación aprobados.

## Consecuencias positivas

- Las rutas principales y auxiliares tienen una jerarquía explícita.
- Android, iOS y web comparten la misma estructura.
- Los parámetros se pueden verificar antes de incorporar datos.
- Los futuros enlaces pueden apuntar a destinos estables.
- Las rutas continúan separadas de la lógica de negocio.

## Consecuencias negativas

- Las pantallas son placeholders y no validan todavía identificadores externos.
- El fallback de vuelta a Inicio sustituye el historial cuando se abre una URL directamente.
- Web mantiene tabs inferiores hasta que se autorice el sidebar.
- Los deep links de producción aún no pueden verificarse sin configuración de plataforma y dominio.

## Límites actuales

No se implementan Home, EventCard, buscador, filtros, datos demo, categorías, ilustraciones, favoritos, agenda, perfiles, organizadores, notificaciones, backend, autenticación, ubicación ni mapas. La acción «Abrir filtros» solo demuestra la presentación modal.

## Condiciones para revisar esta decisión

Se revisará si las pruebas de deep links requieren otra jerarquía, si la navegación lateral necesita un layout diferente, si autenticación introduce rutas protegidas o si los flujos reales necesitan separar stacks por funcionalidad. Cualquier cambio duradero se documentará en otro ADR.
