# ADR-003: Theme centralizado y shell compartido

## Estado

Aprobado.

## Contexto

La base Expo ya dispone de rutas y navegación, pero necesita una capa visual común antes de migrar Home y los demás componentes del prototipo. Sin esa capa, cada pantalla podría repetir colores, medidas, safe areas y decisiones responsive, dificultando la coherencia entre Android, iOS y web y el futuro cambio de identidad.

La identidad actual —crema rosado, granate pastel y rosa empolvado— sigue siendo una referencia provisional. Nombre, logo, tipografía, paleta, mascota e ilustraciones pueden cambiar.

## Decisión

El sistema visual se centraliza en `src/theme/` y se consume mediante nombres semánticos. La estructura de pantalla se comparte mediante `AppShell` y `ScreenContainer` en `src/components/layout/`.

No se introduce una librería visual, una fuente externa ni una API responsive adicional. Los componentes continúan usando primitivas de React Native y los mecanismos estándar de Expo.

## Tokens semánticos

El theme contiene:

- colores para fondo, superficies, marca, acento, textos, bordes y estados;
- estilos tipográficos `display`, `title`, `heading`, `body`, `bodySmall`, `label` y `caption`, inicialmente con fuente del sistema;
- una escala de espaciado de `xs` a `xxl`;
- radios `small`, `medium`, `large` y `pill`;
- sombras `none`, `soft` y `raised`, resueltas por plataforma;
- duraciones cortas y medias y curvas conceptuales de movimiento;
- breakpoints de referencia para móvil, tablet y escritorio.

Los valores de color o medida propios del sistema no deben repetirse dentro de los componentes. Las excepciones se limitarán a casos aislados que no constituyan una decisión reutilizable.

## AppShell

`AppShell` define el fondo común y aplica la safe area superior y lateral. No contiene navegación ni lógica de negocio. La navegación por pestañas continúa gestionando el área inferior para evitar padding duplicado.

## ScreenContainer

`ScreenContainer` proporciona padding mobile-first, aumenta el espacio en tablet y escritorio y centra el contenido con un ancho máximo configurable. Puede renderizar contenido estático o scrollable sin que cada pantalla repita esa infraestructura.

## Consecuencias positivas

- Los componentes consumen valores semánticos coherentes.
- Las diferencias de sombras entre plataformas quedan encapsuladas.
- Las pantallas nuevas parten de una estrategia única de safe areas y ancho.
- El layout se adapta a móvil, tablet y web sin depender del DOM.
- Los placeholders permiten verificar la base sin adelantar la migración de Home.

## Consecuencias negativas

- Los tokens iniciales necesitarán ajustes cuando se apruebe la identidad definitiva.
- Los breakpoints son referencias simples, no un sistema responsive completo.
- Los glifos provisionales de navegación permanecen fuera del alcance de este paso.
- El shell todavía no incluye la futura navegación lateral de escritorio.

## Cambio futuro de identidad

La marca visible y las referencias sustituibles de logo, icono y mascota se concentran en `src/config/brand.ts`. La paleta y la tipografía se sustituyen desde `src/theme/`. Esta separación permitirá cambiar la identidad sin reescribir las rutas ni los componentes de cada funcionalidad.

## Condiciones para revisar esta decisión

Se revisará si las pruebas reales muestran que el shell no cubre una plataforma, si la navegación necesita controlar otras safe areas, si el sistema visual definitivo requiere nuevos tipos de token o si una futura librería de componentes aprobada aporta una base incompatible con esta estructura. Cualquier cambio arquitectónico duradero se documentará en otro ADR.
