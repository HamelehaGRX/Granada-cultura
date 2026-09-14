# ADR-012: Expo como base principal de CULTURA

## Estado

Aprobado e implementado como cierre del Paso 10B.2B.

## Contexto

CULTURA inició su migración con un prototipo web nativo en `app/`. La base Expo ha incorporado progresivamente shell, navegación, dominio tipado, repositorios, Home, datos demo, búsqueda, filtros, persistencia, ilustraciones, splash y paridad responsive. Mantener dos aplicaciones activas prolongaría una ambigüedad que ya no aporta valor.

## Decisión

La aplicación React Native + Expo de `src/` es la implementación activa y principal de CULTURA. Las nuevas funcionalidades se desarrollarán exclusivamente sobre ella. Android mantiene la primera prioridad, seguido de iOS; web continúa como plataforma complementaria funcional y accesible.

`app/` queda intacta, funcional e independiente como prototipo legado congelado y referencia histórica. Expo conserva fixtures propios y ninguna ruta, import runtime o build depende del legado. El prototipo no recibirá funcionalidades nuevas y solo se modificará ante una necesidad histórica excepcional autorizada expresamente.

La navegación conserva las cinco secciones y las mismas rutas: bottom tabs en móvil, tablet y web estrecha; sidebar compacta desde 1100 px en web. El shell, safe areas, contenido, stacks, rutas directas y modal siguen compartidos. Explorar, Agenda, Favoritos, Perfil, detalle, organizadores y notificaciones permanecen como placeholders de futuras fases.

Home utiliza fixtures y repositorios sustituibles, 16 eventos, ilustraciones reutilizables por categoría y fallback genérico. La búsqueda conserva su lógica y se abre con una transición breve del header que respeta movimiento reducido. Los filtros mantienen reducer, semántica inclusiva, persistencia local versionada, slider dual y steppers compactos. El splash visual continúa separado del futuro splash técnico de distribución.

La base se considera cerrada tras validar lógica, navegación, responsive, accesibilidad web razonable, consola, TypeScript, Expo Doctor y exports Android/iOS/web. Estos controles demuestran paridad y empaquetado, no equivalen a pruebas físicas, firma ni publicación.

## Consecuencias

- El repositorio tiene una única base activa para evolucionar el producto.
- El legado permanece disponible sin condicionar imports, builds ni diseño futuro.
- Mobile-first sigue guiando las decisiones; la web adapta navegación y ancho sin crear otra aplicación.
- Backend, API, autenticación, favoritos, agenda, perfil, recomendaciones, ubicación, mapas, notificaciones, organizadores, moderación y eventos reales quedan fuera de esta migración.
- Los futuros cambios funcionales deberán respetar los contratos de dominio, repositorios, almacenamiento, rutas y theme existentes o documentar su revisión.

## Deuda y limitaciones no bloqueantes

Quedan pendientes pruebas físicas Android/iOS, TalkBack y VoiceOver; identificadores, iconos, splash técnico y branding definitivos; configuración EAS, builds firmadas y tiendas; y decidir PWA/offline para Expo web. El slider externo puede emitir en web el warning no bloqueante sobre `props.pointerEvents`; deberá revisarse al actualizar o sustituir la dependencia.

## Condiciones para revisar

Revisar esta decisión si cambia la plataforma principal, Expo deja de cubrir una capacidad esencial, se decide retirar físicamente el legado o una fase futura exige modificar de forma sustancial la arquitectura aprobada.
