# EXPLORA v1 — biblia funcional

**Fase actual:** 3. Esta biblia distingue el diseño acordado de lo conectado: la pestaña Explorar muestra **Ocurre pronto**, **Descubre de otra forma** y **Escápate un poco**. Colecciones y También podría interesarte siguen sin interfaz pública.

## Objetivo y diferencia con Inicio

Inicio responde «lo que probablemente te interesa» y Explora responde «lo que existe más allá de lo que ya sabes que te gusta». El 80 % afinidad / 20 % descubrimiento de Inicio y el 20 % contexto / 80 % descubrimiento de Explora son una filosofía de producto, **no cuotas matemáticas** ni pesos de un algoritmo. El Inicio actual aún ordena principalmente por fecha, no aplica esa proporción de afinidad. Explora debe ser útil con solo una zona y radio habitual: jamás debe fingir personalización cuando no hay señales.

La selección orgánica no depende de patrocinio, tamaño o popularidad del organizador. Debe ayudar a descubrir propuestas pequeñas, gratuitas, rurales y de disciplinas distintas, de modo explicable y sin optimizar el tiempo de pantalla. Esta dirección sigue la [Constitución de CULTURA](../CONSTITUCION_CULTURA.md).

## Estructura de la portada y orden

Orden recomendado:

1. Ocurre pronto.
2. Descubre de otra forma.
3. Escápate un poco.
4. Colecciones.
5. También podría interesarte, solo con señales suficientes.

El dominio permite resolver el orden recomendado, un orden propio de los tres bloques centrales y un orden dinámico determinado por una semilla de sesión. Ocurre pronto queda primero; También podría interesarte queda último si existe. En el modo dinámico solo rotan los tres bloques centrales. La futura interfaz debe fijar la semilla al abrir una sesión y no reordenar mientras la persona navega. **No existe aún UI ni preferencia persistida para elegir el modo u ordenar bloques.**

## Regla transversal: siete eventos y Ver más

Todo carrusel horizontal de eventos tendrá como máximo **7 eventos + tarjeta final Ver más**. Si hay cuatro candidatos válidos, muestra cuatro y Ver más. No se rellenan huecos artificialmente. Los tres bloques visibles reutilizan `ExploreCarousel`, EventCard y la misma tarjeta de acción neutra.

Ver más no tiene tope artificial. Si hay 70 candidatos, se conservan los 70. En Ocurre pronto, el listado completo agrupa cronológicamente los disponibles por día y sitúa los agotados después. La deduplicación de portada no invalida candidatos en Ver más. No se almacenan impresiones ni historial permanente.

## Radio habitual y ubicación

El radio habitual es contexto común de Inicio y de todos los bloques de Explora, salvo Escápate un poco, donde se usa como límite inferior estricto. Es una preferencia conceptual de zona aproximada, sin necesidad de dirección exacta ni rastreo continuo. Actualmente **no existe una preferencia persistida reutilizable de radio habitual**: la capa de dominio recibe `HabitualArea { radiusKm }` y resultados con una distancia calculada fuera de Explora. No lee la distancia circunstancial del modal de filtros de Inicio ni guarda una zona nueva.

Un resultado sin distancia conocida queda fuera de los bloques dependientes del radio; no se inventa proximidad. `EventResult.distanceMeters` del repositorio actual es una distancia **ficticia desde Granada**, solo apta para demostración. En una fase posterior habrá que decidir cómo seleccionar, guardar y modificar la zona habitual, cómo calcular distancias reales y cómo compartir esa preferencia con Inicio. No se pide geolocalización en esta fase.

La UI inyecta **30 km como radio demo fijo** desde Granada. No es una preferencia personal persistida ni se mezcla con el filtro de Inicio. El máximo de Escápate, en cambio, sí se guarda localmente.

## Ocurre pronto

Busca eventos futuros, activos y dentro del radio habitual. Default: **7 días**. Opciones: Hoy, próximos 3 días, 7 días, 14 días; precio Todos, Gratis o De pago. No lleva otros filtros. Las ventanas son días civiles en la zona horaria del evento: por ejemplo, «3 días» incluye hoy y los dos días siguientes. Dentro de cada grupo de disponibilidad se ordena por instante real de inicio, fecha y después hora.

Los cancelados y terminados no aparecen en estos listados; siguen conservados en el catálogo y su historial según la Constitución. Los aplazados pueden aparecer si disponen de nueva fecha futura válida. La antigüedad de publicación nunca entra en el orden. Un evento ya iniciado, aunque siga abierto varios días, no ocupa el bloque por esa sola razón: haría falta una sesión o actividad próxima representada con una fecha de inicio propia. Los agotados son válidos para Ver más, pero se sitúan detrás de los disponibles y no ocupan el carrusel mientras existan alternativas disponibles. «Gratis» requiere precio explícitamente gratuito; «De pago» requiere importe positivo, sin inferir que un precio desconocido sea gratuito.

La pantalla muestra `CULTURA` y búsqueda reutilizando HomeHeader, seguida de «Explorar» y el subtítulo «Descubre algo que no estabas buscando.». La búsqueda envía el texto a la ruta existente `/buscar`, que lo aplica en Inicio; no hay buscador paralelo de Explora. El filtro compacto muestra una única síntesis de periodo/precio. Su modal superpuesto usa borrador: Guardar aplica y persiste; Restablecer solo cambia el borrador hasta guardar; ×, backdrop, Escape en web o Back en native descartan. Los valores por defecto son 7 días/Todos; no hereda filtros de Inicio. El carrusel es manual, sin autoplay, reutiliza EventCard y destaca fecha relativa con fecha absoluta secundaria. La tarjeta final «Ver más» abre `/explorar/ocurre-pronto`, con filtro compartido y listado por día sin límite de siete. Se conserva el filtro aplicado y la posición de scroll de la portada durante la navegación de la sesión.

Con 1–3 resultados se indica discretamente que hay pocas propuestas; con cero se muestra un estado vacío legible. En ambos casos se ofrece ampliar explícitamente a 14 días si la ventana aún es menor; no se amplía de forma silenciosa. El filtro aplicado se guarda localmente mediante la frontera de storage existente y vuelve al visitar Explora.

## Descubre de otra forma

Amplía gustos mediante disciplinas y experiencias distintas. Con señales explícitas locales (Favorito, Me interesa, Voy a ir), prioriza una disciplina diferente que tenga una conexión editorial indirecta con categorías conocidas; también ofrece otras disciplinas sin conexión. Sin señales, usa diversidad general y fecha, sin etiqueta de personalización. Una experiencia usa una clave editorial explícita o, si falta, un tipo conservador: la música de concierto cuenta como una sola experiencia aunque cambie el género; para otras categorías se usa categoría/subcategoría. La vista previa intenta no superar dos experiencias muy similares entre sus siete eventos cuando hay alternativas; si el catálogo es más pequeño, muestra las disponibles sin inventar contenido.

La selección es determinista y no usa IA, popularidad ni métricas sociales. El botón ↻ renueva solo el preview de Descubre, prioriza IDs no mostrados inmediatamente y evita antes los que Ocurre pronto ya ocupa. Conserva el resultado hasta otra pulsación o fin de la sesión; no se persiste ni se renueva automáticamente. `/explorar/descubre` muestra el listado completo sin filtros y sin límite de siete.

## Escápate un poco

Incluye eventos a distancia **mayor** que el radio habitual y hasta el máximo elegido, con límite v1 absoluto de **300 km**. La distancia es condición de entrada; el orden principal es fecha/hora, no cercanía. Los agotados se relegan. Un resultado sin distancia se omite.

La portada muestra el chip `30–100 km` y un modal superpuesto con slider de 1 km, entrada exacta y botones ±1. El mínimo permanece fijo en el radio habitual demo. El modal trabaja con borrador: Guardar aplica y persiste el máximo; Restablecer cambia solo el borrador; ×, backdrop, Escape y Back descartan. El default es 100 km. En `/explorar/escapate` se añade únicamente ¿Cuándo?: Hoy, 3, 7, 14, 30 días o todos los próximos. La ventana temporal se mantiene en esa pantalla durante la navegación, pero aún no se persiste entre sesiones.

Si hay menos de cuatro eventos disponibles, se prueba **una sola ampliación de 25 km**, limitada a 300. Solo se aplica si añade al menos un candidato y se anuncia el radio efectivo. Con menos eventos tras esa ampliación se muestran menos; no se salta silenciosamente a 300. El preview conserva el máximo 7 + Ver más; el listado completo agrupa por día, separa agotados y no tiene tope artificial.

`TravelEstimate` contiene `distanceKm`, `durationMinutes`, `mode: car`, fuente `demo` o proveedor y una etiqueta de origen opcional. Se trata de información adicional sobre el trayecto: **no se deduce un tiempo de coche de la distancia en línea recta**. En esta fase no hay proveedor de rutas, llamadas web ni tiempos reales. Los cuatro trayectos ficticios de Expo aparecen en las tarjetas como `km · aprox. min en coche · demo`.

## Colecciones

Orden estable de «Todas las colecciones»:

1. Cultura por menos de 10 €.
2. Artistas emergentes.
3. Pequeños espacios.
4. Patrimonio escondido.
5. Cultura rural.
6. Escena local.
7. Participa, no solo mires.
8. Descubre tu barrio.
9. Para curiosos.
10. De noche.
11. Cultura al aire libre.
12. Elige algo nuevo.

Una colección sin candidatos válidos no está disponible. Todas usan el radio habitual y excluyen cancelados/terminados. Los agotados son elegibles en listados completos y se relegan. En la futura portada habrá cuatro colecciones rotativas entre las disponibles, sin una prioridad fija. La selección pura usa una semilla de sesión estable; la UI y «Todas las colecciones» quedan pendientes.

«Menos de 10 €» admite gratis o **total confirmado** de hasta 1.000 céntimos; un precio base bajo con tasas desconocidas no basta. Los atributos de artista emergente, espacio pequeño, patrimonio escondido, ruralidad, escena local, participación, curiosidad y horario nocturno exigen metadatos editoriales explícitos con procedencia. No se infieren de seguidores, fama, tamaño de precio o simple hora de inicio. Aire libre requiere que el evento declare `setting: outdoor`. Barrio requiere un identificador hiperlocal conocido y coincidente; si no existe, se omite. «Elige algo nuevo» requiere suficientes señales y otra categoría respecto de las conocidas.

Quedan fuera de v1: Fuera del circuito habitual, Espacios inesperados, Para ir solo y Plan corto. Las colecciones son autónomas: un evento visto en Ocurre pronto puede volver a aparecer en una colección.

## También podría interesarte

Es la pequeña parte afín de Explora. Sin señales suficientes no aparece. La implementación inicial solo usa **interacciones explícitas locales**: Voy a ir, Favorito y Me interesa. De forma provisional exige interacciones con al menos dos eventos distintos; no es un peso numérico definitivo ni una decisión cerrada de producto. La afinidad por Voy a ir precede a Favorito/Me interesa, siempre después de separar los agotados. Se sugieren otros eventos de las categorías indicadas, no los mismos ya marcados.

En el futuro, visitas repetidas, apertura de detalle e impresiones simples podrán aportar señales de menor peso. Se debe definir un decaimiento temporal de intereses sin conservar un historial invasivo ni introducir una fórmula compleja prematura. La persona debe poder entender y controlar por qué se muestra cada propuesta.

## Repeticiones y estados

Los bloques de **eventos** de la portada procuran no repetir un ID ya usado por un bloque anterior del orden activo. El primero recibe la primera aparición. El ensamblado limita cada preview a siete y mantiene el listado completo; allí los no mostrados preceden a los repetidos. La deduplicación vive en el cálculo de esa pantalla/sesión: no se persiste «ya vio este evento». Las colecciones se calculan por separado y no consumen esos IDs.

Cancelado y terminado significan «fuera de recomendaciones actuales», no eliminación del evento histórico. Agotado conserva acceso en listado completo, pero pierde prioridad frente a disponible. Aplazado o modificado usa la fecha y estado **actuales**. No se crea un sistema paralelo de estados.

## Datos, tema y adaptación visual

Los metadatos `ExploreEditorial` son opcionales y distinguen `demo` de `curated`; ausencia significa desconocido. Los fixtures Expo siguen siendo ficticios. En esta fase el catálogo Expo pasó de **16 a 22 eventos**: cuatro fuera del radio de 30 km para Escápate y dos dentro para que ↻ disponga de alternativas visibles. `/app` conserva sus 16 registros originales. Las distancias y duraciones son demostrativas, no verificadas para los lugares reales nombrados; los espacios añadidos se declaran «de muestra». No se atribuyen cualidades editoriales reales a artistas o espacios.

Los tres bloques consumen los tokens globales de Claro/Oscuro/Sistema, sin paleta nueva. El carrusel calcula ancho según viewport y espacio disponible: aproximadamente una tarjeta más un fragmento en móvil, dos más un fragmento en tablet y tres o cuatro más un fragmento en escritorio; mantiene scroll manual y teclado/foco de los controles. Ver más usa tarjetas de ancho completo en móvil y columna de lectura en escritorio. En 390 CSS px se reduce discretamente el título de las dos nuevas secciones para mantener ↻ y el chip junto a su título.

## Estado de implementación

| Parte | Estado real en fase 3 |
| --- | --- |
| Pestaña Explorar | Cabecera, búsqueda reutilizada, scroll vertical y tres bloques de eventos visibles. |
| Tipos, radio como entrada, estimación de viaje | Implementados como contratos puros; radio no persistido, sin proveedor de rutas. |
| Ocurre pronto, Descubre, Escápate | Selectores puros e interfaz conectados a fixtures Expo; tres rutas Ver más. |
| También podría interesarte | Solo selector puro; no se muestra en portada. |
| Colecciones y rotación | Doce definiciones estables, elegibilidad y rotación puras; sin pantalla. |
| Orden y deduplicación | Portada en orden recomendado; previews sin repeticiones de ID cuando hay alternativas, sin persistencia de impresiones. |
| Carrusel y Ver más de Ocurre pronto | Máximo 7 + tarjeta final; listado completo por día, agotados al final, filtro común y retorno a Explora. |
| Filtro de Ocurre pronto | Modal draft/applied, persistencia local de ventana y precio, cierre sin guardar, defaults 7 días/Todos. |
| Renovación ↻ de Descubre | Manual, local a ese bloque y estable durante la sesión; sin autoplay. |
| Filtro y Ver más de Escápate | Máximo 30–300 km persistente; una ampliación anunciada de +25 km; fecha solo en Ver más, no persistida. |
| Cambio de orden, Colecciones y También podría interesarte | Diseño acordado; UI pendiente. |
| Integración con Inicio y radio habitual real | Pendiente. Los filtros temporales de Inicio no se mezclan con Explora. |
| Personalización avanzada, visitas, impresiones, decaimiento | Pendiente; no se registran nuevas señales ni datos personales. |

## Decisiones aún pendientes

- Origen exacto y persistencia de zona/radio habitual compartido, con alternativa manual y privacidad por defecto.
- Definición y procedencia verificable de los atributos editoriales y del precio total confirmado al pasar de fixtures a datos reales.
- Proveedor sustituible de rutas y condiciones para mostrar duración aproximada sin hacer promesas falsas.
- Umbral y explicación de recomendaciones personales, renovación manual, decaimiento temporal y control del usuario.
- Diseño y pruebas de Colecciones, También podría interesarte y orden personal; validación native de las nuevas pantallas/modales en Android e iOS.
- Cómo manejar sesiones futuras de eventos de larga duración sin confundir apertura continua con una actividad próxima.

## Arquitectura y validación de esta fase

`src/features/explore/types.ts` define el contexto y metadatos; `selection.ts` concentra selección, renovación, orden y deduplicación; `collections.ts` conserva el catálogo estable y sus reglas. Consumen `EventResult`, `Event`, interacciones y estados existentes. No tienen imports de React ni de storage. `useExploreEvents` conecta el repositorio demo; `demoTravel.ts` contiene trayectos ficticios explícitos; `ExplorePreferencesProvider` guarda solo el máximo de Escápate y conserva la renovación en memoria. `getawayFilters.ts` valida la persistencia. El carrusel y la tarjeta Ver más son comunes a los tres bloques. `scripts/validate-explore.ts` verifica las reglas sin añadir dependencias.

Desde la raíz: `node scripts/run-validation.cjs explore`, `npm run validate`, `npm run typecheck` y `git diff --check`. La fase 3 requiere además smoke visual web móvil/tablet/escritorio; Expo Doctor y exports quedan fuera de alcance.
