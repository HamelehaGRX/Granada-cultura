# ADR-008: Persistencia local versionada con AsyncStorage

## Estado

Implementado para revisión del Paso 8. Amplía ADR-007 únicamente en persistencia de filtros.

## Contexto

Home mantiene filtros locales con useReducer. Al recargar se perdían preferencias útiles de fecha, precio, distancia y categorías. Se necesita conservar ese subconjunto no sensible en Android, iOS y web, validar instalaciones con datos antiguos y preparar una frontera sustituible sin backend, autenticación ni store global.

## Decisión

Usar `@react-native-async-storage/async-storage` 2.2.0, recomendado por el Expo SDK 57 instalado. Es la única dependencia directa añadida. No se actualizan Expo ni Expo Router. La UI no importa el proveedor: `src/storage/localStorage.ts` compone un driver con `createStorage`; la capa genérica ofrece JSON tipado y get/set/remove, captura errores y mantiene el orden de operaciones. Las pruebas inyectan un driver en memoria.

Persistir solo un subconjunto explícito de FilterState: date, price, distance y categories (IDs con subselección). No persistir query, panel abierto, datos derivados, eventos, fixtures, favoritos, agenda, perfil, onboarding, intereses, ubicación, notificaciones ni credenciales. La búsqueda expresa una intención temporal; un enlace explícito puede aplicarla en memoria, pero no se conserva entre sesiones. Otras preferencias podrán añadir sus propias claves/validadores cuando se autoricen.

## Claves, versión y migraciones

La clave centralizada `cultura.filters` no cambia con el esquema. Guarda `PersistedEnvelope<PersistedFilterStateV1>` con `{ version: 1, data: ... }`. La versión en contenido permite localizar instalaciones antiguas desde una única clave. `migrateEnvelope` reconoce solo v1; no se inventa una v0 ni una conversión que no existe. Para v2 se añadirá una conversión explícita v1→v2 antes del validador del nuevo esquema.

Un sobre corrupto, ausente o incompatible utiliza defaults. Datos corruptos/versiones desconocidas se reemplazan por v1 tras hidratar. Es una política sencilla de recuperación: volver a una versión antigua de la app puede descartar preferencias de una versión futura. Si se requiere downgrade sin pérdida, se revisará esa política antes de publicar el nuevo esquema.

## Hidratación y estado

`useEventFilters` conserva reducer, reloj y selección pura; `usePersistedEventFilters` coordina almacenamiento y fase hydrated. Espera a un catálogo cargado correctamente desde CategoryRepository, lee/migra/valida y despacha hydrate antes de guardar. La acción conserva query en memoria, evitando perder enlaces o texto introducido durante la lectura. Home reutiliza loading y oculta temporalmente controles/recuentos hasta completar hidratación. No cambia el diseño de FilterBar, SearchField, EventCard ni navegación.

Efectos cancelados ignoran sus respuestas. Una carga fallida del catálogo no se interpreta como un catálogo vacío: Home mantiene su error/reintento y no destruye selecciones guardadas. Tras hidratar se guarda únicamente si cambia el snapshot persistible. Cambios de búsqueda/panel y renders no escriben. La cola técnica evita que una escritura antigua termine después de Limpiar y la lectura de un nuevo montaje espera escrituras previas. Limpiar guarda defaults y conserva los 16 eventos al recargar.

## Validación runtime

TypeScript no valida JSON. El decodificador manual recibe unknown, comprueba sobre/versión/tipos y reconstruye solo campos conocidos. Fechas custom incompletas, invertidas o imposibles y presets desconocidos vuelven a any. Rangos finitos se redondean, limitan a 0–1000 y ordenan; tipos inválidos usan defaults. La validación no añade Zod.

El catálogo actual es fuente de verdad: se eliminan categorías inexistentes y subcategorías que no pertenecen a su padre; se deduplica y no se acepta un array mal tipado. Una categoría válida sin subcategorías válidas se interpreta como toda la categoría, según la semántica de ADR-007. No se confía en claves arbitrarias del JSON.

## Errores y seguridad

Fallo de lectura: defaults en memoria, sin escritura inicial ciega. Fallo de escritura: la UI sigue funcionando y un cambio posterior puede reintentar. Los avisos solo se emiten en desarrollo, identifican la operación y no registran valores, secretos ni stack traces. No se muestra un error técnico invasivo.

AsyncStorage contiene exclusivamente preferencias no sensibles. SecureStore queda reservado para futuros tokens/credenciales/secretos, sin instalarlo ni usarlo ahora. El almacenamiento local no elige proveedor de backend ni realiza sincronización. Web utiliza el adaptador del paquete; no hay DOM en código universal.

## Consecuencias y limitaciones

- Preferencias locales sobreviven a recargas/remontajes y la búsqueda sigue siendo temporal.
- UI, dominio y proveedor quedan separados sin librería global ni nuevos frameworks de pruebas.
- Web aísla preferencias por origen; cambiar puerto/dominio abre otro almacenamiento.
- No se sincronizan pestañas, dispositivos, cuentas ni cambios de catálogo en vivo tras hidratar.
- Un cierre abrupto puede interrumpir el último guardado asíncrono; no hay confirmación de durabilidad en UI.
- Un catálogo futuro y su carga deberán mantener el contrato de éxito/error y revisar hidratación si se actualiza en vivo.
- Los bundles validan empaquetado, no el funcionamiento físico del módulo nativo ni la publicación.

## Pruebas y condiciones para revisar

`scripts/validate-storage.ts` cubre JSON, versiones, migración base, fechas, rangos, categorías obsoletas, limpieza, búsqueda excluida, errores y orden de escritura/lectura. Se ejecutan validate-filters, typecheck, Expo Doctor, web con recargas y exports Android/iOS/web. Las instrucciones reproducibles están en la sección Persistencia local de GUIA_PROYECTO.

Revisar al incorporar v2, preferencias adicionales, sincronización, cuentas, datos sensibles, cambios dinámicos del catálogo o requisitos de durabilidad. Esas capacidades pertenecen a tareas posteriores; no se inicia el Paso 9.
