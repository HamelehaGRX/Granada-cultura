# CULTURA - Constitución del Proyecto

**Versión 0.1 - 15 de septiembre de 2026**  
**Estado:** documento vivo, sujeto a revisión consciente y documentada.

> CULTURA debe ayudar a descubrir cultura, no convertir a las personas en el producto.

---

## 0. Para qué existe este documento

Este documento fija la base ética, de producto y técnica de CULTURA antes de seguir añadiendo funcionalidades. No pretende ser inmutable: puede cambiar cuando aparezcan casos nuevos, pero los cambios importantes deben ser conscientes, quedar documentados y no contradecir silenciosamente los principios del proyecto.

Se organiza en tres capas:

1. **Identidad y ética:** qué es CULTURA, para quién existe y qué límites no quiere cruzar.
2. **Producto y funcionamiento:** cómo deben comportarse usuarios, publicadores, recomendaciones, datos, moderación, IA y monetización.
3. **Biografía técnica:** cómo ha evolucionado el proyecto, qué arquitectura existe hoy y qué vendrá después.

### Regla de gobernanza

Cuando una propuesta de ChatGPT, Codex o cualquier colaborador entre en conflicto con esta Constitución, debe **avisarlo de forma explícita antes de implementarla**. El conflicto se resuelve conscientemente; nunca por accidente.

### Estados de decisión

- **PRINCIPIO BASE:** forma parte de la identidad del proyecto. Cambiarlo requiere una decisión expresa.
- **DECIDIDO:** decisión actual de producto o arquitectura.
- **PENDIENTE:** tema identificado pero todavía no cerrado.
- **INVESTIGAR:** hace falta estudiar implicaciones técnicas, legales o de negocio.
- **DESCARTADO:** opción considerada y rechazada por ahora.

---

# CAPA I - IDENTIDAD Y ÉTICA

## 1. Misión

**PRINCIPIO BASE.** CULTURA existe para facilitar que cualquier persona pueda descubrir qué ocurre a su alrededor o en cualquier punto de España, desde un gran festival hasta una actividad gratuita en un pueblo pequeño.

El objetivo no es que el usuario pase horas dentro de la aplicación. El éxito es que encuentre algo que le interese con poco esfuerzo y pueda decidir libremente si quiere asistir.

## 2. Cultura accesible significa mucho más que precio

**PRINCIPIO BASE.** Accesibilidad cultural incluye:

- actividades gratuitas y de pago;
- grandes eventos y propuestas pequeñas;
- ciudades, pueblos y entornos rurales;
- asociaciones, colectivos, salas, instituciones y artistas emergentes;
- información de accesibilidad física, sensorial y comunicativa cuando exista;
- contenidos en todas las lenguas presentes en España;
- herramientas comprensibles también para personas poco familiarizadas con redes sociales o tecnología.

La capacidad económica o promocional de un organizador no debe decidir la visibilidad orgánica de su evento.

## 3. Lo grande no debe comerse a lo pequeño

**PRINCIPIO BASE.** CULTURA no ordenará el mundo únicamente por popularidad, presupuesto publicitario o tamaño del organizador.

Las recomendaciones pueden adaptarse a los intereses del usuario, pero deben conservar espacio para descubrimiento, diversidad y proximidad. Una fiesta de un municipio, una exposición pequeña o un concierto gratuito deben poder aparecer junto a propuestas de gran formato cuando sean relevantes.

## 4. No diseñar para crear adicción

**PRINCIPIO BASE.** CULTURA no optimizará su producto para maximizar tiempo de pantalla, scroll infinito o dependencia.

Las métricas prioritarias deben acercarse a:

- descubrimientos útiles;
- eventos guardados;
- incorporación a agenda;
- clics hacia información oficial o entradas;
- diversidad de propuestas descubiertas;
- satisfacción del usuario.

No es un objetivo que la persona permanezca más tiempo dentro de la aplicación.

## 5. Evitar la burbuja cultural

**PRINCIPIO BASE.** La personalización no debe encerrar al usuario en un catálogo repetitivo.

Si alguien muestra interés por hip hop, CULTURA puede priorizar conciertos, exposiciones, danza, talleres o historia relacionada, pero también debe introducir oportunidades distintas que tengan sentido por cercanía, gratuidad, contexto o novedad.

La recomendación combinará, cuando sea posible:

- gustos conocidos;
- proximidad;
- novedad;
- diversidad cultural;
- contexto temporal;
- precio o gratuidad;
- decisiones explícitas del usuario.

## 6. El usuario debe entender y controlar las recomendaciones

**PRINCIPIO BASE.** CULTURA debe poder explicar de forma sencilla por qué muestra un evento.

Ejemplos:

- "Está a 4 km de tu zona de interés".
- "Es gratuito".
- "Sigues eventos de flamenco".
- "Has guardado actividades similares".

El usuario podrá indicar que quiere ver más o menos propuestas de un tipo y ajustar parámetros como descubrimiento, proximidad, precio o categorías.

## 7. Patrocinios claramente separados

**PRINCIPIO BASE.** Un patrocinio puede dar visibilidad, pero no comprar relevancia orgánica ni controlar el algoritmo.

Los contenidos patrocinados deben estar claramente identificados. Su selección puede considerar contexto y zona para evitar publicidad absurda o irrelevante.

Ejemplo: una campaña nacional puede tener alcance nacional; una campaña local debe priorizar usuarios para los que tenga sentido geográfico.

Nunca se disfrazará publicidad como recomendación neutral.

## 8. Límites editoriales y políticos

**DECIDIDO.** CULTURA no pretende ser una plataforma de propaganda partidista. Los actos estrictamente electorales o de partido quedan fuera del objetivo principal de la aplicación.

Sí pueden aparecer obras, exposiciones, cine, literatura, debates o actividades culturales con contenido político, histórico o social cuando sean legítimamente culturales y legales.

Las reglas deben aplicarse de forma consistente, sin convertir a CULTURA en un árbitro ideológico. Se distinguirá entre contenido polémico y contenido ilegal, fraudulento o que promueva odio o violencia prohibidos.

## 9. Bienestar animal

**PRINCIPIO BASE.** CULTURA no considerará dentro de su catálogo editorial aquellos eventos cuya actividad central implique sufrimiento deliberado de animales como espectáculo o tradición.

Esta regla se aplica de forma general, no únicamente a una tradición concreta.

## 10. Privacidad por defecto

**PRINCIPIO BASE.** La configuración inicial debe favorecer la privacidad, no el máximo aprovechamiento comercial de datos.

- No se pedirán datos porque "puedan ser útiles algún día".
- Se recogerá solo lo necesario para funciones concretas.
- Las notificaciones serán configurables de forma sencilla.
- La ubicación no se rastreará constantemente.
- Las preferencias podrán modificarse sin procesos deliberadamente tediosos.

## 11. Ubicación mínima y útil

**PRINCIPIO BASE.** CULTURA no necesita saber dónde está una persona a cada momento.

Un usuario puede definir zonas de interés aproximadas, barrios, ciudades o lugares que visita con frecuencia, sin proporcionar su domicilio exacto.

También podrá añadir varias zonas de interés temporal o permanente para viajes, trabajo u otras circunstancias.

La búsqueda por ubicación debe poder utilizarse sin convertir la app en un historial de movimientos.

## 12. Derechos sobre los propios datos

**PRINCIPIO BASE.** El usuario debe poder:

- recuperar su información al cambiar de dispositivo;
- consultar sus datos;
- descargarlos;
- corregirlos;
- eliminar su cuenta y los datos asociados dentro de los límites legales necesarios.

La aplicación debe diseñarse para facilitar estos derechos, no para esconderlos.

## 13. Seguridad como requisito central

**PRINCIPIO BASE.** La seguridad no se añadirá al final como un parche.

El proyecto deberá contemplar progresivamente:

- cifrado y comunicaciones seguras;
- contraseñas protegidas y/o passkeys;
- autenticación reforzada para roles sensibles;
- permisos mínimos;
- backups;
- registro de acciones críticas;
- recuperación de cuentas;
- rate limiting y protección frente a bots;
- monitorización;
- plan de incidentes;
- separación entre identidad, preferencias y sistemas críticos.

CULTURA evitará custodiar información de alto riesgo cuando no sea imprescindible.

## 14. No almacenar datos bancarios directamente

**PRINCIPIO BASE.** Si en el futuro existen pagos, tarjetas o suscripciones, CULTURA utilizará proveedores especializados y no almacenará números completos de tarjeta, CVV ni datos bancarios innecesarios.

El negocio no requiere convertir a CULTURA en custodio de información financiera sensible.

## 15. Cierre responsable del servicio

**PRINCIPIO BASE.** Si algún día CULTURA tuviera que cerrar, se avisará con antelación razonable, se facilitará la exportación de información útil y se realizará una eliminación responsable de datos conforme a las obligaciones aplicables.

---

# CAPA II - PRODUCTO Y FUNCIONAMIENTO

## 16. Tipos principales de usuario

### 16.1 Usuario asistente o "civil"

**DECIDIDO.** Es el usuario principal de la aplicación.

Su perfil será privado por defecto y servirá para conservar:

- intereses;
- favoritos;
- agenda;
- organizadores seguidos;
- preferencias de distancia, precio y categorías;
- configuración de notificaciones;
- zonas de interés;
- otras preferencias futuras.

Cambiar de móvil o reinstalar la app no debe obligarle a reconstruir su vida cultural desde cero.

No necesita proporcionar DNI, dirección exacta, cuenta bancaria ni nombre real salvo que una función futura lo justifique claramente.

### 16.2 Usuario publicador/organizador

**DECIDIDO.** Puede aportar eventos que la recopilación automática no detecte, especialmente actividades difundidas por redes sociales, cartelería local o boca a boca.

La publicación no es un derecho automático de cualquier cuenta. Requiere un proceso de confianza y control.

### 16.3 Moderador/administrador

**DECIDIDO.** Rol interno con capacidad de revisar verificaciones, resolver conflictos, responder apelaciones, gestionar fraude, corregir datos y auditar acciones relevantes.

Las decisiones importantes no deben depender exclusivamente de IA.

## 17. Niveles de confianza para publicadores

**DECIDIDO.** El sistema debe ser progresivo. Modelo inicial orientativo:

1. **Cuenta normal:** no publica.
2. **Solicitante:** pide acceso como publicador.
3. **Publicador nuevo:** puede proponer eventos, siempre con revisión humana.
4. **Publicador verificado:** identidad o entidad comprobada; mantiene controles y auditoría.
5. **Entidad de confianza:** instituciones, salas o promotores con historial sólido; mayor automatización, nunca ausencia total de trazabilidad.

La confianza puede subir o bajar según comportamiento.

## 18. Publicadores sin CIF o estructura formal

**PENDIENTE - PRIORIDAD ALTA.** Un colectivo, asociación informal o grupo vecinal puede organizar un evento real sin tener CIF propio.

CULTURA no debe excluir automáticamente estas iniciativas, pero tampoco aceptar publicaciones sin control.

Principio acordado: debe existir una vía de **publicador comunitario verificado** mediante una combinación de identidad individual, historial, fuentes externas, redes, referencias, ubicación del evento y revisión humana.

Queda por definir el protocolo exacto y sus niveles de riesgo.

## 19. Revisión humana de publicaciones

**PRINCIPIO BASE.** En las fases iniciales, las publicaciones creadas por usuarios publicadores deben tener control humano suficiente antes de aparecer como información fiable.

Con el tiempo, entidades de alta confianza podrán beneficiarse de mayor automatización, pero las acciones seguirán auditadas.

## 20. Apelaciones

**PRINCIPIO BASE.** Los publicadores tendrán derecho a solicitar revisión cuando un evento sea rechazado, modificado, bloqueado o una cuenta sea sancionada.

CULTURA debe poder corregirse cuando se equivoca.

## 21. Eventos difíciles de verificar

**DECIDIDO.** No todo evento tendrá una web oficial o ticketera.

El sistema podrá utilizar diferentes niveles de confianza. Según el riesgo, un evento podrá:

- publicarse como verificado;
- publicarse indicando que cierta información está pendiente de confirmar;
- mantenerse en revisión;
- rechazarse si hay señales suficientes de fraude o inexistencia.

La falta de CIF no equivale automáticamente a evento falso.

## 22. Nunca borrar la historia de un evento

**PRINCIPIO BASE.** Un cambio no debe destruir el estado anterior.

Los eventos conservarán historial de versiones para poder saber:

- qué cambió;
- cuándo;
- quién lo cambió;
- por qué;
- qué fuente lo justificó.

Un evento cancelado se marca como **CANCELADO**; no desaparece sin explicación.

## 23. Notificaciones por cambios importantes

**DECIDIDO.** Si un usuario guardó o marcó interés en un evento, podrá recibir avisos ante cambios relevantes:

- cancelación;
- aplazamiento;
- cambio de hora;
- cambio de lugar;
- entradas agotadas;
- nueva disponibilidad;
- otras incidencias relevantes.

Estas categorías de avisos serán configurables de forma sencilla.

## 24. Trazabilidad de modificaciones

**PRINCIPIO BASE.** La app debe distinguir internamente y, cuando aporte valor, mostrar si un cambio proviene de:

- fuente oficial;
- publicador;
- moderador CULTURA;
- proceso automático;
- IA;
- combinación de fuentes.

## 25. Papel de la IA

**PRINCIPIO BASE.** La IA es asistente, no autoridad soberana.

Puede:

- recopilar información;
- comparar fuentes;
- clasificar;
- detectar duplicados;
- resumir;
- detectar cambios;
- sugerir correcciones;
- asignar señales de confianza;
- alertar de anomalías.

No debe decidir por sí sola acciones de alto impacto como sanciones permanentes, resolución de disputas complejas o decisiones editoriales sensibles.

## 26. Auditoría de IA

**PRINCIPIO BASE.** Las acciones relevantes de IA deben dejar registro suficiente para entender:

- qué detectó;
- qué fuentes utilizó;
- qué acción propuso o realizó;
- nivel de confianza;
- fecha;
- incidencias encontradas.

El objetivo es localizar errores con rapidez y poder reconstruir decisiones.

## 27. Redes sociales como fuente, no como dependencia absoluta

**DECIDIDO.** Muchos eventos pequeños solo aparecerán en redes sociales o canales informales. CULTURA intentará cubrirlos mediante publicadores humanos, fuentes permitidas y mecanismos compatibles con los términos de cada plataforma.

No se asumirá que todo contenido técnicamente extraíble puede copiarse o redistribuirse sin límites.

## 28. Imágenes y copyright

**PRINCIPIO BASE.** CULTURA utilizará un sistema visual propio de ilustraciones por categorías y subcategorías para no depender de carteles ajenos.

Cuando exista una ficha de detalle:

- podrá enlazar la fuente original;
- un publicador podrá subir su cartel si dispone de derecho para hacerlo y concede permiso de visualización a CULTURA;
- se registrará la procedencia del material cuando sea necesario.

El arte propio podrá disponer de varias variantes por categoría/subcategoría para evitar repetición visual excesiva.

## 29. Información de accesibilidad de eventos

**DECIDIDO.** Siempre que sea posible se recopilarán datos como:

- acceso para silla de ruedas;
- aseos adaptados;
- intérprete de lengua de signos;
- subtítulos;
- audiodescripción;
- asientos;
- accesibilidad sensorial;
- edad mínima;
- acompañantes;
- otras condiciones relevantes.

Si la información no está disponible, se indicará claramente en lugar de inventarla.

## 30. Precios transparentes

**PRINCIPIO BASE.** CULTURA intentará mostrar el precio de forma honesta, incluyendo gastos conocidos o indicando que existen costes adicionales cuando no pueda calcularse un precio final.

Los eventos gratuitos deben poder encontrarse fácilmente y nunca recibir peor trato por no generar comisión.

## 31. Cobertura rural como prioridad estratégica

**PRINCIPIO BASE.** CULTURA no se diseñará únicamente para grandes capitales.

Los municipios pequeños y zonas rurales forman parte central del problema que intenta resolver la aplicación. Se medirá y mejorará progresivamente la cobertura geográfica.

## 32. Lenguas de España

**PRINCIPIO BASE.** CULTURA respetará la lengua original del evento y buscará ofrecer traducciones opcionales cuando tenga sentido.

No sustituirá silenciosamente un texto original en catalán, gallego, euskera u otra lengua por castellano. La diversidad lingüística forma parte del valor cultural del proyecto.

## 33. Moderación sin convertir CULTURA en una red de confrontación

**DECIDIDO.** CULTURA no tendrá comentarios públicos en su planteamiento inicial.

No se busca crear debates, guerras de opiniones o espacios de insulto. La app muestra opciones culturales; el usuario decide si le interesan.

Se moderarán fraude, estafas, eventos inexistentes, contenido ilegal y otros incumplimientos claros.

## 34. Perfiles civiles privados y organizadores seguibles

**DECIDIDO.** El perfil civil será privado por defecto y no funcionará como perfil social público.

Los usuarios podrán seguir perfiles de organizadores por interés cultural.

No se priorizarán contadores de seguidores ni dinámicas de competición entre organizadores.

### Idea en recámara: acompañante para eventos

**PENDIENTE / INVESTIGAR.** Se conserva como posibilidad futura un sistema para encontrar compañía para asistir a un evento. No forma parte del alcance actual por sus implicaciones de seguridad, moderación, privacidad y comportamiento social.

## 35. Métricas sociales sin humillar eventos pequeños

**PENDIENTE.** Puede ser útil indicar interés general o tendencias, pero no se quiere convertir el número exacto de asistentes/interesados en una señal que perjudique automáticamente a eventos pequeños.

Sí interesa informar de disponibilidad real, como **agotado**, cuando la fuente sea fiable.

Debe estudiarse cómo mostrar tendencias sin crear un ranking social tóxico.

## 36. Monetización ética

**PRINCIPIO BASE.** La utilidad cultural esencial será gratuita.

Buscar, descubrir, filtrar y consultar información cultural no debe quedar bloqueado tras una suscripción.

Vías compatibles a estudiar:

- herramientas profesionales para organizadores;
- afiliación de entradas;
- promociones claramente marcadas;
- servicios/API B2B;
- acuerdos institucionales;
- funcionalidades Premium adicionales para usuarios sin degradar la base gratuita.

## 37. No vender al usuario

**PRINCIPIO BASE.** CULTURA no basará su negocio en vender perfiles personales ni información privada de sus usuarios.

La monetización y el ranking orgánico estarán separados técnicamente y conceptualmente.

## 38. Transparencia comercial

**PRINCIPIO BASE.** Si un enlace, promoción o compra genera ingresos para CULTURA, debe poder indicarse de manera clara.

Un acuerdo comercial no convierte automáticamente a un evento en una mejor recomendación.

## 39. Independencia tecnológica

**PRINCIPIO BASE.** Siempre que sea razonable, las integraciones críticas se diseñarán detrás de interfaces propias para poder sustituir proveedores de IA, mapas, pagos, email, almacenamiento u otros servicios.

No significa construir todo desde cero; significa evitar quedar atrapados sin necesidad en un único proveedor.

## 40. Sostenibilidad económica y operativa

**PRINCIPIO BASE.** La ética no impide que el proyecto sea rentable ni que quienes trabajan en él puedan vivir bien de su trabajo.

El crecimiento deberá contemplar:

- infraestructura;
- base de datos;
- almacenamiento;
- IA;
- mapas;
- emails y notificaciones;
- backups;
- seguridad;
- moderación;
- personal;
- soporte;
- mantenimiento de fuentes.

Las decisiones de escala deben valorar simultáneamente coste, calidad y sostenibilidad.

## 41. Automatizar sin eliminar el factor humano

**PRINCIPIO BASE.** El sistema nacional debe reducir el trabajo repetitivo humano, no trasladar miles de revisiones manuales a un pequeño equipo.

La automatización revisará grandes volúmenes y elevará al equipo humano:

- alertas;
- contradicciones;
- fuentes rotas;
- baja confianza;
- fraude potencial;
- apelaciones;
- decisiones sensibles.

El objetivo es que una persona gestione excepciones, no cientos de fuentes rutinarias una a una.

---

# CAPA III - PLATAFORMA DE DATOS, ARQUITECTURA Y BIOGRAFÍA TÉCNICA

## 42. La base nacional debe ser de CULTURA

**PRINCIPIO BASE.** CULTURA no dependerá de una supuesta base externa única que contenga toda la agenda cultural española.

Construirá su propia plataforma nacional de datos alimentada por múltiples fuentes:

- ayuntamientos;
- diputaciones;
- comunidades autónomas;
- teatros;
- salas;
- museos;
- universidades;
- festivales;
- ticketeras;
- organizadores;
- asociaciones;
- publicadores comunitarios;
- fuentes digitales autorizadas.

La app móvil consultará nuestra API y nuestra base, no miles de webs directamente.

## 43. Actualización continua de eventos

**DECIDIDO COMO DIRECCIÓN.** El sistema tendrá procesos recurrentes de revisión. Una cadencia general de aproximadamente ocho horas puede ser un punto de partida, pero la frecuencia será adaptable por fuente.

Ejemplo conceptual:

- fuente crítica o dinámica: cada pocas horas;
- ayuntamiento: varias veces al día;
- museo o agenda estable: una o dos veces al día;
- fuente pequeña: según necesidad.

Los fallos de una fuente no deben bloquear la actualización nacional completa.

## 44. Ciclo de vida de eventos

**DECIDIDO COMO DIRECCIÓN.** Un evento podrá tener estados como:

- activo;
- actualizado;
- aplazado;
- cancelado;
- agotado;
- finalizado;
- pendiente de confirmar;
- en revisión.

Los estados conservarán trazabilidad.

## 45. Deduplificación y confianza

**INVESTIGAR / FUTURO.** El mismo evento puede aparecer en múltiples fuentes.

CULTURA deberá combinar reglas, similitud y posiblemente IA para decidir si dos registros son el mismo evento utilizando señales como:

- título;
- artista;
- lugar;
- fecha y hora;
- coordenadas;
- organizador;
- enlaces y fuentes.

Cada registro podrá tener un nivel de confianza y una procedencia auditable.

## 46. Base geográfica

**DIRECCIÓN TÉCNICA ACTUAL.** Para el backend nacional se considera especialmente adecuada una arquitectura basada en PostgreSQL + PostGIS por las consultas geográficas que necesitará CULTURA.

Ejemplo: "eventos durante los próximos siete días a menos de 35 km de esta zona".

La decisión definitiva se tomará durante el diseño formal del backend.

## 47. Separación entre identidad y perfil cultural

**DIRECCIÓN TÉCNICA.** La arquitectura futura debe separar, tanto como sea razonable:

- identidad/autenticación;
- perfil cultural;
- preferencias;
- ubicación;
- pagos;
- roles de publicación.

El objetivo es reducir el impacto de incidentes y aplicar permisos mínimos.

## 48. Arquitectura móvil actual

**ESTADO ACTUAL.** La migración base a React Native + Expo se completó en septiembre de 2026.

La aplicación activa utiliza:

- React Native + Expo;
- TypeScript strict;
- Expo Router;
- React Native Web;
- AsyncStorage para preferencias locales no sensibles;
- navegación móvil/tablet mediante tabs;
- sidebar responsive en escritorio;
- búsqueda y filtros;
- dual-range sliders de precio y distancia;
- fixtures propios de Expo;
- ilustraciones reutilizables por categoría/subcategoría;
- splash CULTURA;
- validaciones automatizadas.

La carpeta `/app` contiene el prototipo web histórico y queda congelada como referencia.

## 49. Biografía resumida de la migración

### Paso 1 - Reglas y documentación
Se establecieron normas de trabajo, ramas Git, documentación paralela y límites de autonomía de Codex.

### Paso 2 - Base Expo
Se creó la aplicación React Native + Expo con TypeScript y Expo Router.

### Paso 3 - Theme y shell
Se centralizaron colores, tipografía, espaciados, tamaños, safe areas y estructura visual.

### Paso 4 - Navegación
Se implementaron las cinco pestañas y rutas futuras de eventos, búsqueda, organizadores, notificaciones y filtros.

### Paso 5 - Datos y repositorios
Se crearon tipos, mappers, repositorios y validaciones para desacoplar la UI de la fuente de datos.

### Paso 6 - Home real
Se migró el listado de eventos, EventCard, estados de carga/error/vacío y responsive.

### Paso 7 - Búsqueda y filtros
Se migraron búsqueda, fecha, precio, distancia, categorías, subcategorías y combinaciones.

### Paso 8 - Persistencia local
Se añadió AsyncStorage versionado para conservar filtros sin guardar búsquedas temporales.

### Paso 9 - Estabilización técnica
Se consolidaron versiones Expo, scripts de validación, exports Android/iOS/web y documentación.

### Paso 10 - Cierre de paridad
Se desacopló Expo del prototipo, se añadió splash, ilustraciones, sliders duales, steppers compactos, sidebar web y transición del buscador. La migración base se declaró completada.

## 50. Método de trabajo técnico

**DECIDIDO.** Desarrollo nuevo en `desarrollo`; `main` permanece estable hasta aprobación.

Antes de cada cambio importante:

1. definir alcance;
2. indicar modelo/razonamiento recomendado para Codex;
3. implementar sin commit automático;
4. validar;
5. revisar Git;
6. commit manual;
7. push;
8. continuar.

Las decisiones arquitectónicas importantes se documentan mediante ADR.

## 51. Próximas grandes fases

El orden exacto podrá evolucionar, pero la dirección actual es:

1. Constitución y arquitectura ética/organizativa.
2. Ficha real de evento.
3. Cuentas de usuario y autenticación segura.
4. Favoritos y agenda sincronizados.
5. Perfil e intereses.
6. Sistema de publicadores y verificación.
7. Backend/API y base de datos nacional.
8. Motor de fuentes y actualización automática.
9. IA para clasificación, deduplicación y detección de cambios.
10. Geolocalización respetuosa y zonas de interés.
11. Notificaciones configurables.
12. Piloto con datos reales en Granada/provincia.
13. Expansión Andalucía.
14. Expansión nacional.
15. Monetización ética y herramientas profesionales.
16. EAS, builds firmadas y tiendas.

---

# PRINCIPIOS SAGRADOS - RESUMEN CORTO

1. La cultura debe ser descubrible para cualquiera.
2. Lo grande no debe borrar a lo pequeño.
3. El usuario no es el producto.
4. No vender perfiles personales.
5. No diseñar para crear adicción.
6. Privacidad por defecto y datos mínimos.
7. Ubicación solo cuando aporte valor real.
8. Recomendaciones explicables y controlables.
9. Patrocinio claramente identificado.
10. El dinero no compra ranking orgánico.
11. La base cultural esencial debe ser gratuita.
12. Publicadores verificados, auditados y con posibilidad de apelación.
13. La IA ayuda; las decisiones sensibles conservan responsabilidad humana.
14. Todo cambio importante debe ser trazable.
15. Los eventos cancelados o modificados conservan historia.
16. Precios transparentes.
17. Cobertura rural como prioridad real.
18. Respeto a las lenguas y a la diversidad cultural.
19. No comentarios públicos ni competición social innecesaria.
20. Seguridad desde el diseño.
21. Independencia tecnológica razonable.
22. Automatizar lo repetitivo y elevar excepciones a personas.
23. Sostenibilidad económica compatible con ética.
24. Si una propuesta contradice esta Constitución, debe avisarse antes de implementarla.

---

# CUESTIONES ABIERTAS PRIORITARIAS

Estas cuestiones quedan reconocidas, no olvidadas:

- protocolo exacto para publicadores comunitarios sin CIF;
- niveles concretos de verificación y reputación;
- política de retención de documentos usados para verificación;
- proveedor o mecanismo de verificación de identidad si fuera necesario;
- modelo exacto de cuenta, passkeys y recuperación;
- métricas de interés sin perjudicar eventos pequeños;
- tratamiento de "agotado" y disponibilidad de entradas;
- política detallada de contenido adulto/restricciones de edad;
- idea futura para encontrar acompañante y sus riesgos;
- PWA/offline de la web Expo;
- catálogo exacto de Premium, si algún día existe;
- esquema de afiliación y transparencia comercial;
- protección frente a abuso automatizado y fraude;
- arquitectura definitiva PostgreSQL/PostGIS/backend;
- estrategia nacional de fuentes;
- gobernanza y auditoría de modelos de IA;
- política legal/copyright para carteles y contenido de terceros;
- proceso formal de modificación de esta Constitución.

---

# PROCEDIMIENTO DE CAMBIO DE LA CONSTITUCIÓN

Esta Constitución es viva, pero no volátil.

Un cambio importante debe:

1. describir el problema o caso nuevo;
2. indicar qué principio afecta;
3. explicar por qué el texto actual ya no es suficiente;
4. valorar riesgos para usuarios, publicadores y sostenibilidad;
5. aprobarse conscientemente;
6. actualizar Markdown y PDF;
7. registrar fecha y versión;
8. reflejar, si procede, la decisión en ADR/AGENTS/documentación técnica.

Los cambios de implementación que no alteren principios no requieren reabrir la Constitución.

---

# CONTROL DE VERSIONES DEL DOCUMENTO

## v0.1 - 15/09/2026

Primera Constitución base de CULTURA. Consolida las decisiones éticas, de producto y técnicas surgidas tras completar la migración del prototipo a Expo y antes de iniciar las fases de usuarios, backend, publicadores, IA y datos nacionales.

