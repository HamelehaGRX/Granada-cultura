# ADR-009: Estabilización técnica y estrategia de builds Expo

## Estado

Implementado para revisión del Paso 9.

## Contexto

La base migrada ya contiene navegación, Home, búsqueda, filtros y persistencia local. Antes de añadir más producto se necesita una referencia reproducible para instalar, validar y empaquetar el proyecto, además de separar la configuración local de una futura configuración de publicación.

Expo SDK 57 y Expo Router reciben correcciones dentro de su versión compatible. La configuración actual aún no dispone de icono, splash, identificadores nativos definitivos, dominio universal ni proyecto EAS aprobados. Añadir valores provisionales como si fueran de producción produciría deuda y posibles conflictos de identidad en las tiendas.

## Decisión

- Mantener React Native 0.86.3, React 19.2.3 y el resto de dependencias directas, actualizando solo `expo` a `~57.0.22` y `expo-router` a `~57.0.21`.
- Conservar `package-lock.json` y usar `npm ci` como instalación reproducible.
- Exponer `npm run validate` y comandos individuales para datos, Home, filtros y almacenamiento mediante un lanzador Node sin dependencias nuevas.
- Crear una carpeta temporal única por proceso, limitada a la raíz del repositorio, y eliminarla en un bloque `finally`; la regla existente `/.tmp-paso*-*/` evita que esos artefactos se versionen.
- Ignorar `.env` y sus variantes locales, permitiendo expresamente un futuro `.env.example` sin secretos.
- Mantener `app.json` mínimo: nombre, slug, versión, esquema `cultura`, tablet iOS, salida web estática, plugin Router y rutas tipadas. No fijar aún `ios.bundleIdentifier`, `android.package`, icono, splash, adaptive icon, favicon, app/universal links ni configuración de EAS.
- No crear `eas.json` ni ejecutar builds en la nube en este paso. Los exports locales comprueban el empaquetado, no generan binarios firmados.

## Auditoría de dependencias

`npm audit` informa vulnerabilidades moderadas dentro de la cadena de herramientas de Expo/Router y de sus dependencias transitivas. La corrección automática propuesta por npm exige versiones incompatibles o cambios mayores, por lo que no se ejecuta `npm audit fix`. Se revisarán nuevas versiones compatibles del SDK y Router en una tarea de mantenimiento específica.

No se añaden dependencias directas en este paso. Las modificaciones transitivas del lockfile proceden de los dos parches autorizados.

## Configuración futura de distribución

Antes de una build distribuible se deberán aprobar y comprobar:

- identificadores únicos de Android e iOS;
- icono, splash, adaptive icon y favicon definitivos;
- credenciales y cuentas de las tiendas;
- dominio, universal links/app links y política de deep links;
- perfiles de desarrollo, preview y producción de EAS;
- estrategia de versiones, firma y actualizaciones.

Como propuesta no vinculante, los identificadores podrían seguir un dominio controlado por el proyecto, por ejemplo `com.cultura.app`, pero no debe reservarse ni configurarse hasta confirmar propiedad, disponibilidad y nombre final.

## Consecuencias

- Una instalación limpia y las validaciones de lógica pueden repetirse con comandos estables.
- El repositorio queda protegido frente a secretos de entorno y temporales de comprobación habituales.
- El esquema `cultura://` y las rutas directas pueden validarse localmente, pero no equivalen a universal links ni notificaciones reales.
- Los exports Android/iOS/web prueban resolución y bundling; no prueban hardware, permisos, módulos nativos en dispositivo, firma ni publicación.
- Windows permite validar Android/web y generar el bundle iOS, pero no ejecutar el simulador iOS local.

## Condiciones para revisar

Revisar esta decisión al preparar la primera distribución interna, aprobar los assets de marca, definir los identificadores nativos, conectar un dominio, habilitar EAS, actualizar de SDK mayor o cuando Expo publique parches compatibles que resuelvan los avisos de seguridad pendientes.
