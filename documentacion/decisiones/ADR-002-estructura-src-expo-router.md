# ADR-002: Uso de src/app con Expo Router

## Estado

Aprobado.

## Contexto

Tras decidir React Native con Expo como arquitectura principal, CULTURA necesita una base universal pequeña que pueda ejecutarse en Android y web y quede preparada para iOS. Durante la migración debe convivir con el prototipo aprobado de `app/`, sin moverlo ni copiar todavía su interfaz, datos o assets.

La navegación principal ya tiene un orden de producto estable: Explorar, Agenda, Inicio, Favoritos y Perfil, con Inicio en el centro y como destino inicial.

## Decisión

El nuevo código se organiza bajo `src/` y usa Expo Router con rutas por archivos. Un layout raíz proporciona el contexto de área segura y un grupo `(tabs)` declara las cinco rutas principales mediante la API estable `Tabs` de Expo Router.

Las rutas se mantienen delgadas y renderizan un componente provisional compartido. El theme mínimo vive en `src/theme/` y los valores de identidad sustituibles en `src/config/brand.ts`. Los futuros recursos de marca tendrán una ubicación separada en `assets/brand/`.

La base usa TypeScript estricto. No se añade una store global, biblioteca visual, sistema de iconos adicional ni funcionalidad nativa que todavía no sea necesaria.

## Razones

- Alinear la estructura con el enrutamiento recomendado por Expo Router.
- Evitar lógica de negocio dentro de los archivos de ruta.
- Mantener una sola navegación compartida entre Android, iOS y web en esta fase.
- Centralizar desde el principio los valores visuales y de marca que cambiarán más adelante.
- Permitir una migración incremental sin modificar el prototipo legado.

## Consecuencias positivas

- Las cinco secciones principales son navegables desde una base mínima.
- Inicio conserva la posición central y es la ruta inicial.
- El código común puede crecer sin acoplarse a una plataforma concreta.
- TypeScript estricto y Expo Doctor ofrecen controles tempranos de coherencia.
- `app/` y `src/` tienen límites claros durante la transición.

## Consecuencias negativas

- El repositorio contiene temporalmente dos aplicaciones.
- Los placeholders no representan todavía la apariencia ni las funciones aprobadas.
- Los iconos de navegación son glifos provisionales hasta que se defina el sistema visual correspondiente.
- iOS no puede validarse localmente de forma completa desde Windows.

## Alternativas consideradas

### Colocar las rutas Expo en la carpeta raíz `app/`

Es la convención más corta, pero entraría en conflicto con el prototipo legado que debe conservarse intacto. `src/app/` mantiene clara la separación.

### Crear una navegación distinta para web

Permitiría anticipar una barra lateral, pero duplicaría prematuramente la navegación. La adaptación específica de escritorio se abordará cuando se migre la interfaz.

### Copiar desde ahora componentes y datos del prototipo

Aceleraría la similitud visual aparente, pero mezclaría la creación de la base con la migración funcional. Se descarta para mantener este paso pequeño y verificable.

## Condiciones para revisar esta decisión

Se revisará si la estructura dificulta una funcionalidad aprobada, si Expo Router deja de cubrir las plataformas objetivo o si las pruebas de la interfaz migrada demuestran que una navegación compartida no es suficiente. Cualquier cambio duradero se registrará en un ADR posterior.

## Condición de retirada del prototipo

El prototipo de `/app` solo se retirará cuando la aplicación Expo alcance la paridad visual y funcional acordada y el usuario autorice expresamente su eliminación o traslado. La existencia de esta base, por sí sola, no cumple esa condición.
