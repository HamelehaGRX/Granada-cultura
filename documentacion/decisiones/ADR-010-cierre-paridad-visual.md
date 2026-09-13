# ADR-010: Independencia del legado y cierre de paridad visual base

## Estado

Implementado para revisión del Paso 10B.1.

## Contexto

La auditoría del Paso 10A confirmó que Home, búsqueda, filtros y persistencia estaban migrados, pero Expo importaba sus dos JSON desde `/app`, no mostraba el splash visual aprobado y dejaba vacío el espacio de ilustración de las tarjetas. `/app` debe permanecer intacto como referencia histórica y Expo debe poder compilar sin depender de esa carpeta.

Los SVG del prototipo no son consumibles directamente por React Native en Android/iOS sin soporte adicional. La identidad y el arte definitivos siguen pendientes, y este paso no autoriza una dependencia SVG ni una imagen distinta por evento.

## Decisión

### Fixtures independientes

Expo conserva un snapshot propio y funcionalmente idéntico en `src/data/fixtures/raw/`. Los adaptadores importan exclusivamente esos archivos. El prototipo conserva por separado sus datos, assets, manifest y service worker, sin cambios.

Una validación recorre los imports ejecutables de `src/`, resuelve sus rutas relativas y falla si alguna apunta dentro de `/app`. Esto convierte la independencia en una condición reproducible y no solo documental.

### Splash de marca

`AppSplash` es una capa de UI montada desde el layout raíz. Utiliza `Animated`, `AccessibilityInfo`, el nombre centralizado y los colores del theme. La secuencia normal dura aproximadamente dos segundos: aparición suave, permanencia breve y salida conjunta. Con movimiento reducido, el nombre aparece sin animación de entrada y la capa desaparece rápidamente.

El stack se monta detrás del overlay para adelantar la carga. El fondo compartido evita un flash visual. Esta secuencia no configura ni sustituye el splash técnico nativo, cuyos assets definitivos siguen pendientes.

### Ilustraciones temporales

`illustrationMap.ts` es la única tabla de resolución. Recibe una clave semántica y devuelve una definición visual; cualquier ausencia o clave desconocida devuelve `generica`. `EventIllustration` representa esa definición mediante `View` y `Text`, sin DOM, SVG, rutas dinámicas ni librerías nuevas. EventList entrega la clave y EventCard solo compone el componente especializado.

La representación es decorativa y se oculta a tecnologías de asistencia. Sus marcas y superficies son placeholders, no arte definitivo. El contrato permite sustituir las definiciones por imports estáticos de assets compatibles sin cambiar el dominio ni crear imágenes por evento.

## Consecuencias positivas

- Expo puede compilar y ejecutarse sin leer `/app`.
- El legado queda congelado y funcional por sí mismo.
- Las tarjetas dejan de mostrar un hueco visual.
- Todas las claves demo y las desconocidas tienen una resolución segura.
- Android, iOS y web comparten la misma solución sin una dependencia nueva.
- El splash respeta movimiento reducido y no bloquea la carga del contenido.

## Consecuencias y limitaciones

- Los datos demo están duplicados mientras conviven ambas aplicaciones; sus copias no deben presentarse como sincronizadas.
- Los placeholders gráficos no reproducen los SVG ni sustituyen el arte del ilustrador.
- Un futuro catálogo remoto deberá entregar claves compatibles o adaptar su propia estrategia de assets.
- El splash técnico nativo continúa con la configuración mínima de Expo.
- No se implementan todavía sidebar de escritorio ni animación final del buscador.
- Los exports no sustituyen pruebas físicas de animación, movimiento reducido o renderizado en Android/iOS.

## Validación

`validate-illustrations.ts` comprueba las 15 claves demo resueltas, `generica`, una clave desconocida y la ausencia de imports desde `src/` hacia `/app`. Se combina con typecheck, todas las validaciones previas, Expo Doctor, diff check, smoke web móvil/escritorio y exports Android/iOS/web.

## Condiciones para revisar

Revisar al recibir el arte definitivo, adoptar un formato o dependencia de assets distinta, sustituir fixtures por backend, cambiar la identidad de marca o configurar el splash técnico de distribución. Sidebar, buscador final y funcionalidades futuras requieren tareas separadas.
