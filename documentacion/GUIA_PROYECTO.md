# Guía del proyecto CULTURA

## Estado de transición

CULTURA inicia una migración incremental hacia React Native, Expo, TypeScript estricto y Expo Router. Android e iOS serán las plataformas prioritarias; web continuará como plataforma complementaria.

Todavía no existe código Expo. La carpeta `app/` conserva el prototipo web aprobado y no se eliminará, moverá ni ampliará con funcionalidades grandes salvo petición explícita. Seguirá sirviendo como referencia hasta que la futura aplicación alcance suficiente paridad y el usuario autorice qué hacer con el legado.

La siguiente fase prevista, que requiere una tarea independiente, será crear una base Expo mínima sin migrar aún la interfaz.

## Estructura general

- `AGENTS.md`: reglas del proyecto; se mantiene en la raíz.
- `README.md`: presentación y publicación; no se ha desplegado esta versión.
- `app/`: prototipo web legado aprobado, sin frameworks ni dependencias externas.
- `app/data/`: catálogo de categorías y eventos demo en JSON.
- `app/assets/icons/`: iconos de instalación existentes.
- `app/assets/images/categorias/`: ilustraciones genéricas por categoría/subcategoría y fallback.
- `documentacion/`: guías del prototipo, copias explicadas, arquitectura objetivo, decisiones y plan de migración.
- `documentacion/arquitectura/`: descripción comprensible de la arquitectura futura.
- `documentacion/decisiones/`: ADR de decisiones arquitectónicas aprobadas.
- `documentacion/migracion/`: fases y criterios de la migración a Expo.

## Prototipo y documentación explicada

El navegador carga `app/index.html`, `app/styles.css` y `app/app.js`. Sus copias paralelas son `index_explicado.html`, `styles_explicado.css` y `app_explicado.js` en esta carpeta.

Las copias conservan exactamente el código del prototipo y añaden comentarios marcados `EXPLICACION`. No son una aplicación alternativa ni deben abrirse para probarla: sus rutas se documentan en el contexto de `app/`. Si una petición modifica expresamente el prototipo, el cambio debe reflejarse también en su copia explicada.

El futuro código React Native no tendrá una copia literal comentada de cada archivo TypeScript. Se mantendrá limpio y se explicará por funcionalidades, interfaces, hooks, servicios y decisiones. Los cambios arquitectónicos importantes se registrarán mediante ADR.

Las secciones v0.1 y v0.1.1 siguientes documentan el historial del prototipo, no la arquitectura definitiva.

## CULTURA v0.1

La v0.1 inicial incorporó los siguientes elementos (los filtros y tiempos se revisan en v0.1.1):

- Splash crema con CULTURA blanco: fondo primero, entrada del nombre y salida conjunta en aproximadamente 1,73 segundos. Incluye preferencia de movimiento reducido.
- Header salvia con marca y lupa. El buscador se expande dentro de la misma fila, desplaza la marca y recibe el foco. Cierre y Escape restauran la cabecera.
- Widget «¿Qué te apetece hoy?» que abre filtros de fecha, precio máximo, distancia demo y categoría.
- Tarjetas compactas de próximos encuentros, con bordes crema, salvia y terracota alternados.
- Navegación inferior en móvil/tablet: Explorar, Agenda, Inicio, Favoritos, Perfil.
- Navegación lateral desde 1100 px: Inicio, Explorar, Agenda, Favoritos, Perfil. Ancho de 158 px.
- Una columna en móvil y dos desde 700 px. Los placeholders de las otras secciones no incorporan funciones finales.

Las variables de `:root` concentran la paleta y las medidas principales. La paleta actual combina crema rosado, granate suave y rosa empolvado; los nombres de tokens describen ya esos colores. Los SVG son provisionales; su color forma parte de cada asset y se sustituirá junto con la ilustración definitiva.

## CULTURA v0.1.1

Revisión incremental sin rediseñar, añadir detalle de evento ni modificar el catálogo o los datos demo:

- **Splash:** mantiene colores y tipografía. El texto entra entre 250 y 800 ms, permanece 800 ms y todo desaparece de 1600 a 2000 ms. El modo de movimiento reducido conserva su duración abreviada.
- **Fecha:** se conservan los cinco presets y se añade Fecha personalizada. Permite un día o un intervalo inclusivo, también dentro de meses o años. No hay tope artificial al futuro. Al cambiar de preset se borran los valores personalizados para evitar contradicciones.
- **Validación de fecha:** un intervalo incompleto o invertido no se aplica y muestra una explicación; los campos exponen límites recíprocos y estado inválido. Limpiar fecha personalizada vuelve a Cualquier fecha sin alterar otros filtros.
- **Precio:** mínimo y máximo inclusivos entre 0 y 1.000 €, en pasos de 1 €. Un único slider visual de doble tirador y campos numéricos permiten deslizar, usar teclado o escribir el valor. Para ver solo gratis, usar 0–0.
- **Distancia:** mismo control entre 0 y 1.000 km, en pasos de 1 km, sobre distancias ficticias.
- **Coordinación de extremos:** al deslizar o usar teclado, cada tirador se detiene en el otro y nunca lo cruza. Al escribir números se conserva el comportamiento anterior: si el mínimo supera al máximo, el máximo acompaña al mínimo; si el máximo baja del mínimo, el mínimo acompaña al máximo. Valores fuera de 0–1.000 se limitan al dominio y un campo vacío se restaura al salir.
- **Pista dual:** dos controles range accesibles, con sus pistas nativas transparentes, comparten una única barra. JavaScript actualiza el tramo resaltado mediante porcentajes CSS. El mínimo es redondo y el máximo cuadrado; sus zonas de interacción son de 44 × 44 px y tienen foco visible. Cuando quedan próximos (menos de 52 px), se separan verticalmente junto a la misma pista, mínimo arriba y máximo abajo, incluso en 0–0 o 999–1.000. ResizeObserver recalcula esta disposición al abrir los grupos y cambiar de tamaño. No añade dependencias.
- **Categorías:** checkboxes generados desde las 11 categorías y 59 subcategorías del catálogo. No se copia ese catálogo en JavaScript.
- **Subcategorías:** aparecen al marcar su categoría. Varias categorías se unen por OR; cada categoría incluye todas sus subcategorías si no se marca ninguna, o solo las marcadas. Al desmarcar una categoría se eliminan sus subfiltros.
- **Combinación:** fecha, precio, distancia, categorías/subcategorías y búsqueda se intersectan por AND.
- **Limpiar filtros:** restaura cualquier fecha, 0–1.000 € y km, ningún checkbox y búsqueda vacía, sin recargar.
- **Responsive y accesibilidad:** grupos desplegables nativos, labels, fieldset/legend y valores hablados de sliders. Los controles se apilan en móvil; las subcategorías usan una zona de altura acotada para evitar un panel desmesurado.

Las tarjetas, navegación, header, ilustraciones y resolución de imágenes conservan su funcionamiento. La versión de caché de `sw.js` pasa a v0.1.1. El servidor de revisión sigue en la URL local indicada más abajo.

Los eventos demo solo cubren aproximadamente dos semanas: una búsqueda válida a tres meses, seis meses o un año puede devolver cero resultados. Esto no es un límite del calendario.

## Revisión visual de filtros y paleta

Los cuatro selectores —Fecha, Precio, Distancia y Categorías— comparten una rejilla y un único panel de contenido. En escritorio y tablet amplia aparecen en una sola fila; en móvil se organizan 2 × 2 para conservar legibilidad. Al abrir uno se cierra el anterior, pero los valores elegidos se mantienen y continúan combinándose.

Cada selector es un botón real vinculado por `aria-controls` a su panel y comunica el estado mediante `aria-expanded`, por lo que funciona con ratón, tacto y teclado. El panel común no duplica controles ni cambia la lógica de filtrado. La interfaz adopta crema rosado, granate pastel y rosa empolvado mediante los tokens globales; por tanto, header, navegación, foco, filtros y tarjetas mantienen una identidad coherente sin añadir un cuarto color. El texto CULTURA del header incorpora un contorno de 0,35 px en granate profundo y una sombra mínima como respaldo compatible, sin cambiar tipografía ni animación del buscador.

En estado neutral, cada botón muestra solamente Fecha, Precio, Distancia o Categorías, centrado. Un resumen aparece solo con un valor realmente aplicado: preset o fecha personalizada válida; rango distinto de 0–1.000; o alguna categoría/subcategoría. Una categoría incluye su nombre y primera subcategoría si procede; varias categorías se compactan como «Música +2». CSS reserva el indicador y aplica elipsis a textos largos para evitar saltos y desbordamiento.

## Datos locales

`app/data/eventos.json` contiene 16 registros ficticios con id, nombre, categoría, subcategoría, fecha, hora, lugar, localidad, precio y descripción. Incluye artista y distanciaKm para probar búsqueda y cercanía.

`fechaBase` permite trasladar las fechas de los ejemplos al día local de apertura. Los eventos no envejecen mientras se prueba el prototipo; no son agenda real. Los filtros intersectan sus condiciones, y distanciaKm es una cifra de ejemplo desde Granada, no una ubicación calculada. No se pide geolocalización.

`app/data/categorias.json` contiene el catálogo completo. Sus identificadores sin acentos son estables; `nombre` es la etiqueta visible y `archivo` indica la ilustración disponible. `null` utiliza la genérica.

Esta v0.1 no lee ni borra los eventos, notas o preferencias que la aplicación anterior guardó en localStorage. Las antiguas herramientas de edición/importación no se presentan en esta interfaz, según el alcance de Inicio y placeholders aprobado. No hay migración ni sincronización.

## Ilustraciones

La ruta se resuelve como `assets/images/categorias/{categoria}/{archivo}`. Dos conciertos de rock comparten `musica/rock.svg`. La improvisación demo usa `generica.svg`, pues aún no tiene asset asignado.

Un error al cargar un asset también activa el fallback. Para cambiar el formato, sustituir el recurso y actualizar `archivo` en el catálogo; no modificar la lógica. Consultar [la guía para ilustradores](GUIA_ILUSTRACIONES_CATEGORIAS.md) para catálogo y especificaciones.

## Manifest y modo sin conexión

El manifest identifica la PWA como CULTURA. El service worker precachea HTML, CSS, JavaScript, JSON, iconos y SVG; consulta la red primero y usa su caché cuando no está disponible. La caché está separada por alcance. Los errores de assets no se sustituyen por HTML.

Mientras el prototipo siga utilizándose, al añadir o sustituir ilustraciones se mantendrá también la lista ASSETS de `app/sw.js` y se cambiará su versión si se modifica el conjunto offline.

El manifest y el service worker pertenecen al prototipo legado. No se trasladarán literalmente a Android o iOS; la futura aplicación Expo utilizará su propia configuración de aplicación, assets, builds y estrategia de actualizaciones. Las referencias cromáticas antiguas del manifest quedan registradas como parte del legado y no se corrigen en esta fase documental.

## Prueba local

Para revisar el prototipo, servir `app/` como raíz con un servidor HTTP ya disponible y no abrir el HTML con `file://`: la carga JSON y la PWA necesitan HTTP.

El servidor y el puerto son temporales. Deben iniciarse y confirmarse en cada sesión; esta guía no presupone que exista un servidor activo. No es necesario instalar dependencias para servir el prototipo.

## Arquitectura objetivo

La arquitectura definitiva será mobile-first con React Native, Expo, TypeScript estricto y Expo Router. Las rutas estarán en `src/app/`; componentes, funcionalidades, servicios, hooks, utilidades, tipos, theme, configuración y fixtures tendrán responsabilidades separadas.

El frontend dependerá de interfaces y adaptadores para poder sustituir datos locales por una API sin acoplar la UI a un proveedor. Se empezará con hooks y `useReducer`; no se añadirá estado global sin una necesidad demostrada.

El sistema visual se centralizará en un theme. Nombre definitivo, logo, paleta, tipografía, mascota e ilustraciones podrán cambiar sin quedar repetidos por toda la aplicación.

Usuarios, perfiles, favoritos reales, agenda real, notificaciones, organizadores, moderación, backend, base de datos y expansión territorial siguen fuera de esta fase. La ubicación comenzará en foreground, la cercanía contará con apoyo del backend y no se mantendrá una geofence por evento.

Consultar:

- [Arquitectura objetivo](arquitectura/ARQUITECTURA_OBJETIVO.md).
- [ADR-001: React Native + Expo](decisiones/ADR-001-react-native-expo.md).
- [Plan de migración Expo](migracion/PLAN_MIGRACION_EXPO.md).

## Documentación futura

La documentación de cada funcionalidad React Native explicará su propósito, componentes, estado, flujo de datos, rutas, servicios, accesibilidad, puntos configurables y pruebas. Los ADR conservarán el contexto de las decisiones duraderas sin duplicar literalmente el código.

La marca de trabajo sigue siendo CULTURA; Granada solo aparece como territorio piloto y contenido ficticio. No hay todavía proyecto Expo, autenticación, cuentas, recopiladores, agentes ni servicios de producción.
