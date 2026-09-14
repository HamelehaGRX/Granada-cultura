# CULTURA

CULTURA es una aplicación para descubrir y organizar planes culturales. Granada es el territorio piloto, pero el producto se plantea para poder ampliarse a otros territorios.

## Estado del proyecto

La migración base ha finalizado. La aplicación activa y principal de CULTURA es la implementación mobile-first de `src/`, basada en React Native, Expo, TypeScript estricto y Expo Router. Toda funcionalidad nueva debe desarrollarse sobre esta base.

Prioridad de plataformas:

1. Android.
2. iOS.
3. Web como plataforma complementaria.

La aplicación Expo contiene navegación responsive, Home, búsqueda, filtros persistentes, splash de marca y placeholders gráficos reutilizables. Sus fixtures son propios y no dependen en runtime ni durante el build del prototipo de `app/`.

## Prototipo legado congelado

La carpeta `app/` contiene el prototipo web aprobado en HTML, CSS y JavaScript nativo. Se conserva intacta, funcional y congelada únicamente como referencia histórica; ya no es la aplicación principal ni una fuente de runtime o build para Expo.

El prototipo utiliza datos ficticios locales. No implementa todavía cuentas reales, favoritos persistentes, agenda persistente, backend, notificaciones ni geolocalización real.

No debe ampliarse ni recibir funcionalidades nuevas. Solo podrá modificarse por una necesidad histórica excepcional solicitada expresamente, y no se eliminará ni moverá sin autorización explícita.

## Puesta en marcha de la aplicación Expo

Requisitos locales:

- Node.js 20 LTS o posterior compatible con Expo SDK 57;
- npm, usando el `package-lock.json` versionado;
- Android Studio, emulador o dispositivo para ejecutar Android;
- macOS con Xcode, dispositivo compatible o un servicio autorizado para ejecutar iOS.

Desde la raíz del repositorio:

```bash
npm ci
npm start
```

También están disponibles `npm run web`, `npm run android` y `npm run ios`. La ejecución local de iOS no puede completarse en Windows, aunque su bundle sí puede validarse con Expo.

Las comprobaciones reproducibles del código actual son:

```bash
npm run validate
npm run typecheck
npx expo-doctor
```

`npm run validate` ejecuta las validaciones de datos, Home, filtros, almacenamiento, claves de ilustración e independencia respecto a `/app`. Sus carpetas de compilación son temporales, se eliminan automáticamente y están excluidas por Git.

La configuración de EAS Build y los identificadores definitivos de Android/iOS se aplazan hasta disponer de cuentas, entornos de publicación y assets de marca aprobados. No deben inventarse para una build de producción.

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

Expo es la única base candidata a futuras distribuciones. Todavía no existe un procedimiento de publicación: antes de distribuir deben aprobarse identificadores, assets técnicos, firma, EAS y configuración de tiendas o del posible despliegue web.
