# Detalle de evento

## Propósito y ruta

La ruta `/eventos/[eventId]` muestra la ficha completa de un evento de CULTURA. La ruta de Expo Router permanece delgada: obtiene el identificador y delega la interfaz y el comportamiento en `EventDetailScreen`.

El detalle usa el mismo `EventRepository` que Inicio. Puede abrirse desde una tarjeta o mediante un enlace directo. La cabecera ofrece volver, favorito y compartir. Si no existe historial de navegación, volver conduce a Inicio.

## Jerarquía de información

La pantalla prioriza, en este orden:

1. avisos relevantes de cambio, aplazamiento o cancelación;
2. identificación del evento e ilustración autorizada o fallback reutilizable;
3. fecha, horario, duración, edad y localización;
4. estado de entradas, precio, gastos y acción oficial;
5. acciones personales;
6. descripción;
7. información ampliada, inicialmente plegada;
8. propuestas relacionadas.

La fecha y el estado actuales nunca se sustituyen por los datos anteriores de un aviso. El contenido patrocinado se identifica de forma visible y no obtiene prioridad orgánica por ese motivo.

## Modelo ampliado

`Event` conserva los campos básicos y admite de forma tipada datos opcionales para detalle: provincia, fin, apertura de puertas, duración, restricción de edad, programa, accesibilidad, información práctica, organizador, procedencia, ticketing, aviso de cambio y popularidad editorial. La ausencia de un campo significa que no se conoce; la interfaz no inventa valores.

`EventTicketing` separa los estados de disponibilidad de la acción externa. Admite disponible, últimas entradas, agotado, gratis, aforo libre, reserva, inscripción, venta no iniciada y procedencia no verificada. Los importes se guardan en céntimos enteros y pueden distinguir base, gastos y total.

Los fixtures actuales enriquecen los 16 eventos demo sin cambiar su identidad. Cubren ejemplos normal, gratuito, modificado, aplazado, patrocinado, reserva, inscripción, programa de varios días, agotado y enlace no verificado.

## Entradas y enlaces externos

`getSafeTicketingAction` es la única decisión que autoriza mostrar una acción directa de compra, reserva o inscripción. La acción solo aparece cuando la URL usa HTTPS, el origen está marcado como oficial y verificado y el estado no la bloquea. HTTP y cualquier esquema no web quedan bloqueados para estos CTA sensibles. Un evento agotado, sin venta iniciada o con procedencia no verificada tampoco expone un enlace directo. El enlace informativo de la fuente oficial admite HTTP o HTTPS porque no inicia una operación sensible.

La aplicación muestra una advertencia cuando no puede acreditar un punto de venta oficial. Los enlaces de demostración utilizan dominios reservados y no representan ventas reales.

«Ver en Maps» usa coordenadas cuando existen y, en su defecto, una búsqueda por dirección o lugar. Compartir genera la ruta del evento con Expo Linking; no fija un dominio de producción que aún no existe.

## Acciones personales y persistencia

Favorito, Me interesa y Voy a ir son estados locales de demostración:

- favorito es independiente;
- Me interesa y Voy a ir son mutuamente excluyentes;
- pulsar de nuevo una opción activa la desmarca;
- el estado se comparte en vivo entre tarjetas y detalle;
- la pulsación del favorito de una tarjeta no abre el detalle.

`EventInteractionProvider` mantiene el estado común y `features/events/interactions/` contiene sus reglas y persistencia. La clave `cultura.eventInteractions` almacena un sobre `{ version: 1, data: ... }` mediante la abstracción de `src/storage/`. Solo se guardan estas preferencias no sensibles; no existe cuenta, sincronización, recomendación de perfil ni envío a servicios externos. Datos corruptos o versiones desconocidas vuelven a un estado seguro.

## Eventos relacionados

`selectRelatedEvents` devuelve como máximo cuatro propuestas y excluye el evento actual y los cancelados. Prioriza afinidad explícita por categoría o subcategoría del evento actual y por categorías con interacción local. Puede incluir como máximo una propuesta culturalmente significativa y popular compatible para aportar descubrimiento.

La popularidad no desplaza por sí sola la afinidad ni constituye un ranking pagado. La selección es determinista, local y trazable; no usa IA ni crea un perfil oculto.

## Componentes y responsabilidades

- `EventDetailScreen`: coordina carga, estados, navegación, composición y relacionados.
- `useEventDetail`: carga evento, catálogo y lista desde interfaces de repositorio; ofrece reintento.
- `EventDetailHeader`: cabecera persistente con objetivos táctiles de 44 px.
- `EventTicketingPanel`: estados, importes, acción segura y advertencia.
- `EventPersonalActions`: controles accesibles de preferencia y asistencia.
- `EventMoreInformation`: programa, accesibilidad, datos prácticos, organizador y fuente.
- `EventCard`: acceso principal al detalle y favorito independiente.

La UI no conoce el formato JSON legado ni accede directamente a AsyncStorage. Los repositorios, funciones puras y adaptadores mantienen esas fronteras reemplazables.

## Identidad visual y categorías

El color principal de CULTURA es un granate intenso centralizado en el theme. La cabecera de Inicio, la cabecera persistente del detalle, los CTA principales y los estados activos de favorito comparten esta identidad sobre fondos crema claros.

`src/theme/categoryAppearances.ts` contiene una apariencia por cada categoría: un color principal de contraste accesible y un color suave relacionado. `EventCard` utiliza el principal en su borde y texto, y el suave en su franja superior. El nombre de categoría y subcategoría siempre permanece visible: el color ayuda al reconocimiento, pero no sustituye la información textual.

La imagen o ilustración principal usa una proporción 2:1 centralizada en el theme. Mantiene presencia de cabecera sin desplazar en exceso la información esencial. El control de información ampliada utiliza una flecha geométrica alineada mediante layout, sin depender de la línea base de un carácter tipográfico.

## Accesibilidad y responsive

Los controles exponen rol, etiqueta y estado seleccionado o expandido. Los objetivos principales cumplen un mínimo de 44 × 44 px, la información no depende solo del color, los avisos importantes se anuncian como alerta y las ilustraciones decorativas permanecen fuera del lector. La información ampliada comunica su expansión.

En móvil la lectura ocupa el ancho disponible sin desbordamiento; en escritorio se limita a una columna de lectura de 840 px. La cabecera permanece fuera del scroll de contenido. La interfaz conserva el orden y la legibilidad con texto ampliado, aunque la verificación física con TalkBack y VoiceOver sigue siendo necesaria antes de publicar.

## Validación

`scripts/validate-event-detail.ts` comprueba reglas de interacción, persistencia, seguridad de ticketing, escenarios demo y selección de relacionados. `npm run validate` lo ejecuta junto con datos, Home, filtros, storage e ilustraciones.

La validación web cubre navegación desde Inicio, enlace directo, vuelta con y sin historial, persistencia tras recarga, estados gratuito/agotado/cambiado/no verificado, expansión de información, Maps, móvil y escritorio, ausencia de overflow y consola sin errores.

No se han añadido backend, autenticación, servicios externos ni dependencias. Tampoco se ha creado un ADR nuevo: la implementación aplica decisiones ya documentadas sobre navegación, dominio, repositorios, Home y persistencia.
