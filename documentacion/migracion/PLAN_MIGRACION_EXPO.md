# Plan incremental de migración a Expo

## Principios

- Migrar en pasos pequeños y verificables.
- Mantener `app/` como referencia visual y funcional.
- No añadir funcionalidades grandes al prototipo salvo petición explícita.
- No borrar, mover ni retirar el prototipo hasta alcanzar paridad suficiente y recibir aprobación expresa.
- Validar cada fase antes de iniciar la siguiente.
- Documentar las decisiones importantes mediante ADR.

## Fase 0 — Baseline y prototipo

Objetivo: establecer una referencia estable antes de crear Expo.

- Conservar el prototipo actual y sus datos.
- Mantener sus copias explicadas.
- Registrar arquitectura objetivo y reglas de migración.
- Identificar comportamientos aprobados que deberán compararse más adelante.
- Corregir documentación falsa sin cambiar el funcionamiento del prototipo.

Resultado: baseline documental completo y prototipo intacto.

## Fase 1 — Base Expo

Objetivo: crear la aplicación mínima sin migrar aún la interfaz.

- Crear el proyecto Expo cuando exista autorización.
- Configurar TypeScript estricto y Expo Router.
- Utilizar `src/app/` para las rutas.
- Mantener `app/` intacto durante la convivencia.
- Añadir comandos y configuración mínimos.
- Verificar arranque Android y web.

Resultado: base universal compilable, sin funcionalidades del prototipo.

## Fase 2 — Theme y shell

Objetivo: disponer de los cimientos visuales.

- Crear tokens de color, tipografía, espaciado, radios, sombras y movimiento.
- Separar la configuración de marca.
- Preparar safe areas, layout raíz y splash.
- Añadir contenedores responsive básicos.

Resultado: shell vacío y centralizado, preparado para cambiar de identidad.

## Fase 3 — Navegación

Objetivo: reproducir la estructura principal de navegación.

- Crear Explorar, Agenda, Inicio, Favoritos y Perfil.
- Mantener Inicio en el centro y como pantalla inicial.
- Preparar stack para detalle de evento.
- Preparar rutas para búsqueda, filtros y organizadores.
- Adaptar navegación inferior a sidebar en web amplia.
- Verificar navegación, retroceso y deep links básicos.

Resultado: esqueleto navegable en Android, iOS y web.

## Fase 4 — Datos demo y tipos

Objetivo: introducir datos sin acoplar la UI al JSON legado.

- Definir tipos TypeScript de evento, categoría y subcategoría.
- Crear interfaces de repositorio.
- Incorporar los JSON actuales como fixtures.
- Crear adaptadores entre el formato legado y el dominio.
- Mantener `fechaBase` y `distanciaKm` como conceptos exclusivos del fixture.

Resultado: datos demo accesibles mediante contratos sustituibles por una API.

## Fase 5 — Home y EventCard

Objetivo: migrar la primera experiencia visual completa.

- Crear Home, header, buscador visual y listado.
- Crear EventCard.
- Integrar ilustraciones reutilizables y fallback genérico.
- Añadir estados de carga, vacío y error.
- Comparar el resultado con el prototipo en móvil, tablet y web.

Resultado: pantalla Inicio reconocible y alimentada por fixtures.

## Fase 6 — Búsqueda y filtros

Objetivo: recuperar el comportamiento funcional aprobado.

- Extraer búsqueda y reglas de filtrado como funciones puras.
- Añadir estado mediante hook y `useReducer`.
- Migrar fecha, intervalos, precio, distancia, categorías y subcategorías.
- Resolver de forma accesible el control de rangos en native y web.
- Probar combinación, resúmenes y restablecimiento.

Resultado: paridad funcional de búsqueda y filtros.

## Fase 7 — Responsive web

Objetivo: consolidar la plataforma complementaria.

- Adaptar columnas, ancho de contenido y navegación lateral.
- Preparar variantes web solo donde sean necesarias.
- Comprobar teclado, foco, URLs y desbordamiento.
- Validar móvil, tablet y escritorio con escalado de texto.

Resultado: web funcional y cuidada sin condicionar el diseño mobile-first.

## Fase 8 — Persistencia local

Objetivo: preparar funcionalidades locales sin backend.

- Definir una interfaz de almacenamiento.
- Persistir únicamente preferencias y estados no sensibles.
- Preparar favoritos y agenda demo sin presentarlos como sincronización real.
- Mantener fuera del almacenamiento no seguro cualquier token futuro.

Resultado: persistencia local sustituible por servicios autenticados.

## Fase 9 — Builds y pruebas

Objetivo: probar la aplicación fuera del entorno básico de desarrollo.

- Ejecutar typecheck y Expo Doctor.
- Crear development builds cuando se autorice.
- Probar Android real o emulado.
- Probar web.
- Probar iOS en dispositivo o infraestructura adecuada.
- Revisar navegación, accesibilidad, responsive, rendimiento y errores.

Resultado: aplicación instalable y validada en las plataformas prioritarias.

## Fase 10 — Paridad y retirada progresiva

Objetivo: decidir el futuro del prototipo con evidencia.

- Elaborar una matriz de paridad visual y funcional.
- Resolver diferencias aprobadas.
- Confirmar que documentación y rutas ya no dependen del prototipo.
- Solicitar aprobación explícita antes de mover o retirar `app/`.
- Si se aprueba, conservar una referencia histórica adecuada y actualizar despliegues.

Resultado: Expo pasa a ser la implementación principal sin pérdida accidental de comportamiento.

## Fases posteriores independientes

No forman parte de la migración base y deberán planificarse por separado:

- autenticación;
- backend y API;
- favoritos reales y sincronizados;
- agenda real;
- geolocalización;
- notificaciones push;
- mapas;
- organizadores verificados;
- moderación y panel de administración.

Cada una requerirá contratos, permisos, privacidad, pruebas y, cuando corresponda, un ADR.

## Criterio de seguridad del legado

**No se borrará el prototipo hasta que la aplicación Expo alcance una paridad suficiente y el usuario lo autorice explícitamente.**

Compilar o mostrar una pantalla parecida no constituye por sí solo paridad. Deben comprobarse navegación, datos, búsqueda, filtros, responsive, accesibilidad, estados de error y comportamiento en las plataformas acordadas.
