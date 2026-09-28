# EXPLORA v1 — biblia funcional

**Fase actual:** 0–1, documentación funcional y dominio puro. Esta especificación describe el diseño acordado; la pestaña Explorar sigue mostrando un placeholder. Ningún carrusel, listado «Ver más» ni control visual descrito aquí está todavía conectado a la interfaz.

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

Todo carrusel horizontal de eventos tendrá como máximo **7 eventos + tarjeta final Ver más**. Si hay cuatro candidatos válidos, muestra cuatro y Ver más. No se rellenan huecos artificialmente. El selector `previewEvents` y el ensamblado de bloques aplican ya el límite de siete; la tarjeta y la navegación son futuras.

Ver más no tiene tope artificial. Si hay 70 candidatos, se conservan los 70. Al abrir el listado completo se priorizan los candidatos que aún no aparecieron en la portada de esa sesión y, después, los ya vistos allí. Esto no almacena impresiones ni historial permanente.

## Radio habitual y ubicación

El radio habitual es contexto común de Inicio y de todos los bloques de Explora, salvo Escápate un poco, donde se usa como límite inferior estricto. Es una preferencia conceptual de zona aproximada, sin necesidad de dirección exacta ni rastreo continuo. Actualmente **no existe una preferencia persistida reutilizable de radio habitual**: la capa de dominio recibe `HabitualArea { radiusKm }` y resultados con una distancia calculada fuera de Explora. No lee la distancia circunstancial del modal de filtros de Inicio ni guarda una zona nueva.

Un resultado sin distancia conocida queda fuera de los bloques dependientes del radio; no se inventa proximidad. `EventResult.distanceMeters` del repositorio actual es una distancia **ficticia desde Granada**, solo apta para demostración. En una fase posterior habrá que decidir cómo seleccionar, guardar y modificar la zona habitual, cómo calcular distancias reales y cómo compartir esa preferencia con Inicio. No se pide geolocalización en esta fase.

## Ocurre pronto

Busca eventos futuros, activos y dentro del radio habitual. Default: **7 días**. Opciones: Hoy, próximos 3 días, 7 días, 14 días; precio Todos, Gratis o De pago. No lleva otros filtros. Las ventanas son días civiles en la zona horaria del evento: por ejemplo, «3 días» incluye hoy y los dos días siguientes. Dentro de cada grupo de disponibilidad se ordena por instante real de inicio, fecha y después hora.

Los cancelados y terminados no aparecen en estos listados; siguen conservados en el catálogo y su historial según la Constitución. Los aplazados pueden aparecer si disponen de nueva fecha futura válida. La antigüedad de publicación nunca entra en el orden. Un evento ya iniciado, aunque siga abierto varios días, no ocupa el bloque por esa sola razón: haría falta una sesión o actividad próxima representada con una fecha de inicio propia. Los agotados son válidos para Ver más, pero se sitúan detrás de los disponibles y no ocupan el carrusel mientras existan alternativas disponibles. «Gratis» requiere precio explícitamente gratuito; «De pago» requiere importe positivo, sin inferir que un precio desconocido sea gratuito.

## Descubre de otra forma

Amplía gustos mediante disciplinas y experiencias distintas. Con señales explícitas, prioriza una disciplina diferente que tenga una conexión editorial indirecta con categorías conocidas; también ofrece otras disciplinas sin conexión. Sin señales, usa diversidad general y fecha, sin etiqueta de personalización. Una experiencia usa una clave editorial explícita o, si falta, el par categoría/subcategoría. La vista previa intenta no superar dos experiencias muy similares entre sus siete eventos cuando hay alternativas; si el catálogo es más pequeño, muestra las disponibles sin inventar contenido.

La selección actual es determinista y no usa IA, popularidad ni métricas sociales. En el futuro «Muéstrame otras» podrá cambiar la semilla o el conjunto de candidatos entre solicitudes deliberadas; no habrá refresco automático ni reordenamiento durante la sesión.

## Escápate un poco

Incluye eventos a distancia **mayor** que el radio habitual y hasta el máximo elegido, con límite v1 absoluto de **300 km**. La distancia es condición de entrada; el orden principal es fecha/hora, no cercanía. Los agotados se relegan. Un resultado sin distancia se omite.

`TravelEstimate` contiene `distanceKm`, `durationMinutes`, `mode: car`, fuente `demo` o proveedor y una etiqueta de origen opcional. Se trata de información adicional sobre el trayecto: **no se deduce un tiempo de coche de la distancia en línea recta**. En esta fase no hay proveedor de rutas, llamadas web ni tiempos reales. Los tiempos de las pruebas están identificados como demo.

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

## Datos, tema y adaptación visual futura

Los metadatos `ExploreEditorial` son opcionales y distinguen `demo` de `curated`; ausencia significa desconocido. Los fixtures Expo existentes siguen siendo ficticios. La validación focalizada construye casos sintéticos claramente demo para comprobar precio final, diversidad, distancias, trayectos y curación; **no se ha alterado el catálogo de 16 eventos** ni se atribuyen cualidades reales a artistas o espacios.

La interfaz futura utilizará los tokens globales para Claro/Oscuro/Sistema y mantendrá contraste y estados accesibles en ambos temas. En móvil se diseñará una columna legible con carruseles táctiles y foco accesible; en tablet se ampliará el ancho sin añadir bloques ficticios; en escritorio se aprovechará el espacio con contenedores y controles de teclado. Ver más tendrá una lista completa adaptable, sin límite de siete. Estas son **decisiones de diseño**, todavía no validadas visualmente ni implementadas.

## Estado de implementación

| Parte | Estado real en fase 0–1 |
| --- | --- |
| Pestaña Explorar | Placeholder existente; sin interfaz nueva. |
| Tipos, radio como entrada, estimación de viaje | Implementados como contratos puros; radio no persistido, sin proveedor de rutas. |
| Ocurre pronto, Descubre, Escápate, También podría interesarte | Selectores puros implementados y probados con datos demo. |
| Colecciones y rotación | Doce definiciones estables, elegibilidad y rotación puras; sin pantalla. |
| Orden y deduplicación | Resolución y ensamblado puros; sin ajuste visual ni persistencia. |
| Carruseles, Ver más, cambio de orden, Muéstrame otras | Diseño acordado; UI pendiente. |
| Integración con Inicio y radio habitual real | Pendiente. Los filtros temporales de Inicio no se mezclan con Explora. |
| Personalización avanzada, visitas, impresiones, decaimiento | Pendiente; no se registran nuevas señales ni datos personales. |

## Decisiones aún pendientes

- Origen exacto y persistencia de zona/radio habitual compartido, con alternativa manual y privacidad por defecto.
- Definición y procedencia verificable de los atributos editoriales y del precio total confirmado al pasar de fixtures a datos reales.
- Proveedor sustituible de rutas y condiciones para mostrar duración aproximada sin hacer promesas falsas.
- Umbral y explicación de recomendaciones personales, renovación manual, decaimiento temporal y control del usuario.
- Diseño y pruebas de las pantallas de portada, Ver más, colecciones y orden personal en Android, iOS y web.
- Cómo manejar sesiones futuras de eventos de larga duración sin confundir apertura continua con una actividad próxima.

## Arquitectura y validación de esta fase

`src/features/explore/types.ts` define el contexto y metadatos; `selection.ts` concentra selección, orden y deduplicación; `collections.ts` conserva el catálogo estable y sus reglas. Consumen `EventResult`, `Event`, interacciones y estados existentes. No tienen imports de React ni de storage. El llamador futuro aportará resultados del `EventRepository`, contexto y metadatos editoriales. `scripts/validate-explore.ts` verifica las reglas sin añadir dependencias.

Desde la raíz: `node scripts/run-validation.cjs explore`, `npm run validate`, `npm run typecheck` y `git diff --check`. No hacen falta navegador, Expo Doctor ni exports en una fase sin nueva UI.
