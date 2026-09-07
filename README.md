# CULTURA

CULTURA es una aplicación para descubrir y organizar planes culturales. Granada es el territorio piloto, pero el producto se plantea para poder ampliarse a otros territorios.

## Estado del proyecto

El proyecto está en transición incremental hacia una arquitectura mobile-first basada en React Native, Expo, TypeScript estricto y Expo Router.

Prioridad de plataformas:

1. Android.
2. iOS.
3. Web como plataforma complementaria.

Ya existe una base Expo mínima en `src/`, preparada para recibir de forma incremental la interfaz y las funcionalidades aprobadas. El prototipo de `app/` continúa intacto como referencia durante esa migración.

## Prototipo actual

La carpeta `app/` contiene el prototipo web aprobado en HTML, CSS y JavaScript nativo. Se conserva temporalmente como referencia visual y funcional durante la migración.

El prototipo utiliza datos ficticios locales. No implementa todavía cuentas reales, favoritos persistentes, agenda persistente, backend, notificaciones ni geolocalización real.

No debe eliminarse ni moverse hasta que la futura versión Expo alcance una paridad suficiente y exista autorización explícita.

## Documentación

La carpeta `documentacion/` contiene:

- las guías del prototipo;
- sus copias explicadas por bloques;
- la arquitectura objetivo;
- los ADR de decisiones relevantes;
- el plan incremental de migración.

Consulta primero `AGENTS.md`, que contiene las reglas maestras de trabajo.

## Rama de trabajo

El desarrollo se realiza en la rama `desarrollo`. No se modifica `main`, ni se hacen commits, pushes o merges automáticamente.

## Publicación

El prototipo no representa la arquitectura definitiva ni tiene en este momento un procedimiento de publicación vigente documentado. Antes de publicar cualquier versión debe decidirse expresamente qué aplicación y qué carpeta se desplegarán.
