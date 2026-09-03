# Guía del proyecto CULTURA

## Estructura general

La raíz conserva los documentos generales del repositorio:

- `AGENTS.md`: reglas de trabajo, alcance, diseño, seguridad y revisión.
- `README.md`: presentación breve e indicaciones de publicación.
- `app/`: aplicación real que se ejecuta en el navegador.
- `documentacion/`: copias explicadas y material de aprendizaje.

## Código real

El código que utiliza la aplicación está dentro de `app/`:

- `index.html` define la estructura y los controles visibles.
- `styles.css` contiene la presentación visual y las adaptaciones responsive.
- `app.js` implementa el estado, el filtrado, la edición y la interacción.
- `manifest.webmanifest` describe la aplicación instalable.
- `sw.js` proporciona caché y funcionamiento básico sin conexión.

Estos archivos deben permanecer limpios. Todo cambio funcional deberá reflejarse también en su copia explicada correspondiente.

## Documentación explicada

La carpeta `documentacion/` contiene:

- `index_explicado.html`
- `styles_explicado.css`
- `app_explicado.js`

Son copias del código actual comentadas por bloques. Explican la finalidad de cada sección, los elementos que controla y los puntos que pueden modificarse con facilidad. No son los archivos que carga la aplicación.

## Datos

Los datos locales preparados para futuras importaciones se encuentran en `app/data/eventos.json`. La aplicación actual continúa usando sus eventos ficticios integrados y el almacenamiento local del navegador; esta reorganización no incorpora todavía una carga automática del archivo JSON.

## Assets

Los recursos visuales están en `app/assets/`. Actualmente, `app/assets/icons/` contiene los iconos de 192 y 512 píxeles usados por el HTML, el manifest y el service worker.

## Crecimiento futuro

La separación entre interfaz, estilos, lógica, datos, assets y documentación permite sustituir progresivamente los datos ficticios por servicios reales. En fases posteriores podrán añadirse módulos para usuarios, perfiles, notificaciones, publicadores, moderación, backend y expansión territorial sin concentrar todas esas responsabilidades en los archivos actuales.

Mientras la aplicación siga siendo estática, `app/` puede servirse directamente con cualquier servidor HTTP local. Una futura integración de herramientas de compilación o backend deberá plantearse como una decisión de arquitectura independiente y aprobarse antes de implementarla.
