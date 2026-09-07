# PROYECTO CULTURA

## 1. Rama de trabajo y Git

- Trabajar siempre en la rama `desarrollo`.
- Nunca modificar directamente `main`.
- No hacer merge a `main` sin aprobación explícita del usuario.
- No hacer commits ni pushes automáticos salvo que el usuario lo solicite expresamente.
- Antes de cerrar cualquier tarea, revisar `git status` y `git diff`.
- Informar de todos los archivos creados, modificados, movidos o eliminados.

## 1.1. Autonomía operativa y aprobaciones

Codex puede actuar de forma autónoma dentro del alcance de la tarea activa cuando las acciones sean seguras, locales, reversibles y no afecten a Git remoto, producción, configuración del sistema o arquitectura no autorizada.

Esta autonomía no amplía el alcance de la petición del usuario. Si existe una duda razonable sobre si una acción es segura o está dentro del alcance, Codex debe pedir aprobación antes de ejecutarla.

### Acciones permitidas sin aprobación adicional

Cuando formen parte clara de la tarea activa, Codex puede ejecutar sin pedir permiso para cada acción:

- leer archivos del repositorio;
- buscar dentro del repositorio;
- crear archivos autorizados por la tarea;
- modificar archivos autorizados por la tarea;
- ejecutar `git status`;
- ejecutar `git diff`;
- ejecutar `git diff --check`;
- ejecutar `npm run typecheck`;
- ejecutar `npx expo-doctor`;
- ejecutar lint o tests ya existentes;
- arrancar servidores locales de desarrollo;
- detener servidores locales iniciados por Codex;
- ejecutar builds locales o exports de comprobación;
- usar npm o npx para comandos propios del proyecto;
- instalar dependencias dentro del proyecto cuando la propia tarea lo haya autorizado expresamente;
- generar scaffolds temporales dentro del repositorio cuando la tarea lo requiera;
- eliminar durante la misma tarea los temporales creados por Codex;
- comprobar rutas, puertos y recursos locales;
- ejecutar herramientas de validación y diagnóstico no destructivas.

### Acciones que requieren aprobación explícita

Codex debe pedir autorización antes de:

- hacer commit;
- hacer push;
- hacer merge;
- cambiar de rama;
- modificar `main`;
- ejecutar un rebase;
- ejecutar un reset destructivo;
- hacer force push;
- borrar archivos existentes del proyecto que no sean temporales creados por Codex durante la tarea activa;
- borrar carpetas con contenido real;
- ejecutar comandos destructivos;
- instalar software a nivel del sistema operativo;
- modificar `PATH`, el registro de Windows o la configuración global del sistema;
- modificar archivos fuera del repositorio;
- cambiar la arquitectura fuera del alcance de la tarea;
- introducir dependencias grandes o no solicitadas;
- cambiar de gestor de paquetes;
- modificar credenciales, tokens, claves o secretos;
- desplegar a producción;
- publicar en tiendas;
- modificar servicios externos;
- realizar cualquier acción irreversible o con impacto fuera del entorno local.

## 2. Etapa y arquitectura principal

CULTURA está migrando de forma incremental desde un prototipo web hacia su arquitectura definitiva:

- React Native;
- Expo;
- TypeScript estricto;
- Expo Router;
- diseño mobile-first.

Prioridad de plataformas:

1. Android.
2. iOS.
3. Web.

La web debe seguir siendo funcional, accesible y cuidada, pero no es la plataforma principal.

Hasta que exista una base Expo aprobada, no crear `package.json`, `src/`, rutas, componentes ni dependencias sin una petición explícita.

## 3. Prototipo web legado

La carpeta `/app` contiene temporalmente el prototipo aprobado en HTML, CSS y JavaScript nativo.

- No eliminar, mover ni sustituir el prototipo sin aprobación explícita.
- No reescribirlo innecesariamente.
- No ampliarlo con funcionalidades grandes durante la migración.
- Utilizarlo como referencia visual y funcional para la nueva aplicación.
- Modificarlo únicamente cuando el usuario solicite expresamente una corrección del prototipo.
- Mantener operativos sus datos, assets, manifest y service worker mientras siga utilizándose.

Cuando la versión Expo alcance una paridad suficiente, el usuario decidirá expresamente si el prototipo se mueve a una zona de documentación o legado.

## 4. Estructura objetivo

La nueva aplicación se organizará, cuando se autorice su creación, mediante:

- `src/app/`: rutas y layouts de Expo Router.
- `src/components/`: componentes reutilizables de interfaz y layout.
- `src/features/`: funcionalidades y dominio agrupados por área.
- `src/services/`: integraciones, repositorios y adaptadores externos.
- `src/hooks/`: hooks compartidos.
- `src/utils/`: funciones puras y utilidades compartidas.
- `src/types/`: tipos compartidos entre funcionalidades.
- `src/theme/`: tokens y sistema visual centralizado.
- `src/config/`: configuración de aplicación, entornos y marca.
- `src/data/fixtures/`: datos locales de demostración.

Esta estructura es una previsión arquitectónica. No crear carpetas vacías ni capas sin una necesidad real.

## 5. Reglas de React Native y Expo

- Usar TypeScript estricto.
- Evitar JavaScript nuevo salvo que exista una necesidad justificada.
- Utilizar componentes funcionales.
- Mantener las rutas de Expo Router delgadas: deben coordinar navegación y componer pantallas, no contener lógica de negocio.
- Preferir composición frente a componentes gigantes o jerarquías innecesarias.
- Separar la UI, el estado y las reglas de negocio.
- Mantener las funciones de filtrado, transformación y validación como lógica pura cuando sea razonable.
- Empezar con estado local, hooks y `useReducer`.
- No introducir una librería de estado global sin una necesidad demostrada y documentada mediante ADR.
- No utilizar APIs del DOM en código universal.
- Usar variantes específicas de plataforma solo cuando el comportamiento native y web realmente difiera.
- Evitar dependencias innecesarias y comprobar su mantenimiento, compatibilidad con Expo y efecto sobre las plataformas antes de añadirlas.

## 6. Separación de responsabilidades

Mantener separadas, siempre que sea razonable:

- rutas y navegación;
- estructura y componentes de UI;
- estilos y theme;
- estado;
- lógica de dominio;
- datos y fixtures;
- servicios e integraciones;
- assets;
- documentación.

No mezclar datos, diseño, navegación y acceso a servicios dentro de un mismo componente.

## 7. Frontend y backend

- El frontend debe depender de interfaces, repositorios o servicios propios, no de un proveedor concreto.
- Los datos externos deben transformarse mediante adaptadores antes de llegar a los componentes.
- No elegir un proveedor obligatorio de backend hasta que exista una decisión aprobada.
- No repartir URLs, credenciales ni detalles de transporte por los componentes.
- La arquitectura debe permitir sustituir fixtures locales por una API sin reescribir la interfaz.

## 8. Theme e identidad

Centralizar en `src/theme/`, cuando exista:

- colores;
- tipografía;
- espaciado;
- radios;
- sombras;
- movimiento;
- tamaños;
- breakpoints y adaptaciones web.

El nombre de trabajo es `CULTURA`, y Granada continúa como territorio piloto sin formar parte obligatoria de la marca principal.

El nombre definitivo, logo, paleta, tipografía, mascota e ilustraciones todavía pueden cambiar. No repetir estos valores de forma rígida por toda la aplicación; concentrarlos en theme, configuración y assets sustituibles.

## 9. Documentación del prototipo

Las copias explicadas actuales se conservan como documentación del prototipo legado:

- `documentacion/index_explicado.html`;
- `documentacion/styles_explicado.css`;
- `documentacion/app_explicado.js`.

No eliminarlas. Cuando una petición modifique expresamente el prototipo, actualizar también su copia explicada correspondiente por bloques.

## 10. Documentación del nuevo código

Para React Native y Expo no se crearán automáticamente copias literales comentadas de cada archivo `.ts` o `.tsx`.

- Mantener el código real limpio y legible.
- Añadir comentarios locales solo cuando expliquen una decisión o restricción no evidente.
- Documentar interfaces públicas, hooks, servicios y puntos de extensión cuando aporten contexto.
- Crear documentación por funcionalidad en lugar de duplicar cientos de archivos.

La documentación de cada funcionalidad relevante debe cubrir, según corresponda:

- propósito;
- componentes;
- estado;
- flujo de datos;
- rutas;
- servicios;
- accesibilidad;
- puntos configurables;
- pruebas;
- decisiones importantes.

Toda modificación funcional o arquitectónica debe actualizar la documentación afectada en la misma tarea.

## 11. Architecture Decision Records

Registrar mediante ADR las decisiones arquitectónicas relevantes, entre ellas:

- React Native y Expo;
- Expo Router;
- TypeScript;
- navegación;
- estrategia de assets;
- almacenamiento;
- backend;
- mapas;
- incorporación futura de estado global.

Cada ADR debe indicar al menos contexto, decisión, consecuencias y condiciones para revisarla. No usar un ADR para decisiones pequeñas o puramente visuales.

## 12. Diseño responsive y plataformas

- Diseñar primero para móvil.
- Comprobar después tablet y web/escritorio.
- La interfaz debe adaptarse sin perder funcionalidad, legibilidad, foco ni tamaños táctiles.
- Mantener navegación inferior en móvil y navegación compacta adaptada en escritorio.
- Compartir lógica y componentes entre plataformas; introducir variantes pequeñas cuando sean necesarias.
- Comprobar escalado de texto, orientación y ausencia de desbordamientos.

## 13. Navegación del producto

La navegación móvil debe mantener este orden:

1. Explorar.
2. Agenda.
3. Inicio.
4. Favoritos.
5. Perfil.

`Inicio` debe estar situado en el centro. Cada elemento tendrá icono y texto.

En escritorio, la navegación será lateral, compacta y dejará más espacio al contenido. Las rutas futuras deberán admitir detalle de evento, búsqueda, filtros, organizadores, notificaciones y deep links.

## 14. Referencia visual aprobada

Mientras se migra, el prototipo de `/app` define la referencia actual para:

- splash inicial;
- header de Inicio y buscador integrado;
- widget de filtros;
- tarjetas compactas de eventos;
- navegación móvil y de escritorio;
- paleta suave;
- estados vacíos y de error;
- comportamiento responsive.

No es obligatorio reproducir técnicas propias del navegador. Se debe conservar el comportamiento y la intención visual mediante componentes nativos adecuados.

Mientras no se apruebe un cambio visual distinto:

- El splash mostrará únicamente `CULTURA`, con fondo crema pastel, texto blanco y una secuencia breve de aparición del fondo, aparición del nombre y desaparición conjunta.
- El header de Inicio mostrará `CULTURA` y una lupa. El buscador se abrirá dentro de la misma barra, se expandirá de derecha a izquierda, desplazará físicamente la marca y no tapará los eventos.
- El widget de filtros permanecerá dentro de Inicio, con aspecto claro o translúcido, diseño suave y el símbolo de interrogación amigable aprobado.
- Las tarjetas serán compactas y mostrarán categoría, nombre, fecha, hora, lugar y precio o `Gratis`.
- Los bordes de tarjetas serán sutiles y alternarán entre los tres colores principales sin resultar llamativos.
- La pantalla Inicio priorizará eventos próximos y cercanos; las recomendaciones personales llegarán en una fase posterior.
- La paleta mantendrá como referencia una base crema con un máximo de dos colores adicionales coordinados, suaves y no saturados.

## 15. Ilustraciones y assets

- Mantener como principio obligatorio una ilustración reutilizable por categoría o subcategoría.
- No crear una imagen específica por evento como sistema base.
- Mantener un fallback genérico.
- Mantener los assets separados del código y de los datos.
- Preparar el sistema para sustituir los placeholders por ilustraciones definitivas realizadas por un dibujante externo.
- Evitar rutas dinámicas que el empaquetador no pueda resolver; la futura estrategia Expo deberá usar un mapa de assets estáticos o una solución equivalente documentada.

## 16. Notificaciones y geolocalización futuras

No implementar estas capacidades hasta que exista una tarea específica.

- Las notificaciones push deberán abrir rutas mediante deep links, especialmente detalles de eventos.
- La ubicación foreground será el punto de partida.
- Debe existir una ubicación habitual configurable y una alternativa manual si el usuario no concede permiso.
- La cercanía se resolverá con coordenadas y apoyo del backend.
- No diseñar el sistema alrededor de mantener una geofence por evento.
- Solicitar permisos de forma contextual, mínima y explicada.

## 17. Testing y validación

Cuando exista la aplicación Expo, revisar según el alcance:

- typecheck;
- Expo Doctor;
- pruebas unitarias de lógica;
- navegación;
- Android;
- web;
- iOS cuando corresponda;
- accesibilidad;
- responsive;
- estados de carga, vacío y error;
- regresión frente al prototipo aprobado.

No considerar una tarea terminada únicamente porque compile.

## 18. Filosofía de cambios

- Hacer cambios pequeños, localizados e incrementales.
- No rehacer partes no relacionadas con la tarea actual.
- No eliminar funciones ya aprobadas sin autorización.
- Mantener compatibilidad con lo que ya funciona salvo que se acuerde expresamente cambiarlo.
- No borrar archivos sin explicar previamente el motivo.
- Si una modificación implica una decisión importante de arquitectura, detenerse y pedir aprobación antes de continuar.
- No avanzar automáticamente a la siguiente fase de migración.

## 19. Seguridad

- No guardar contraseñas, tokens, claves API ni credenciales en el repositorio.
- No guardar tokens de autenticación en almacenamiento no seguro.
- No instalar dependencias innecesarias.
- No ejecutar comandos destructivos sin aprobación.
- No modificar configuración sensible del sistema fuera del proyecto.
- No acoplar secretos ni credenciales a la aplicación cliente.

## 20. Cierre de tareas

Antes de dar una tarea por terminada:

- revisar `git status`;
- revisar `git diff` y `git diff --check`;
- comprobar la rama actual;
- enumerar archivos modificados y nuevos;
- explicar el comportamiento esperado;
- indicar riesgos, errores o tareas pendientes;
- confirmar si se instalaron dependencias;
- confirmar expresamente que no se hizo commit, push ni merge, salvo petición contraria del usuario.
