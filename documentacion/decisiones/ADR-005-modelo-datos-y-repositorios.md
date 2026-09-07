# ADR-005: Modelo de dominio y repositorios desacoplados

## Estado

Aprobado en el alcance solicitado para el Paso 5: datos demo y tipos.

## Contexto

La base Expo dispone de theme, shell y navegación provisional. El prototipo conserva 16 eventos y un catálogo de 11 categorías/59 subcategorías en JSON, con campos en español, precios en euros, fechas y horas separadas y distancias ficticias. Importar ese formato desde componentes acoplaría la futura UI al legado y complicaría su sustitución por un backend.

## Decisión

Se crean modelos TypeScript estrictos por feature, interfaces de repositorio y adaptadores temporales. No se conecta la capa a la UI, no se migra lógica de filtros ni se instala ninguna dependencia.

### Separación legacy/domain

Solo `src/data/fixtures/` importa los JSON originales; la configuración de Expo ya admite JSON tipado. `LegacyEventFixture` reproduce los campos realmente existentes, sin añadir un booleano `gratis` ficticio. `mapLegacyEventToEvent` recibe el registro y el catálogo de dominio, devuelve `Event` y valida los datos. No consulta reloj ni red, no muta su entrada y no depende del DOM.

Se conservan los IDs; una subcategoría se resuelve dentro de su categoría porque existen IDs repetidos entre categorías. Las ilustraciones usan claves semánticas de categoría/subcategoría y fallback `generica`. No se cargan imágenes ni se construyen rutas dinámicas para Metro. La futura estrategia de assets tendrá su propia decisión.

### Repositorios

`EventRepository` expone `list(): Promise<EventResult[]>` y `getById(id): Promise<Event | null>`. `CategoryRepository` expone `list(): Promise<Category[]>` y `getById(id): Promise<Category | null>`.

Las implementaciones de fixtures convierten y validan los datos en cada llamada. Devuelven objetos independientes, `null` para IDs desconocidos y promesas rechazadas ante datos inválidos. No hay consultas complejas, caché global ni gestor de estado. Las interfaces no conocen JSON, HTTP, proveedores ni React.

### Dinero en céntimos

`EventPrice` es una unión `free | fixed | range` con EUR. Los importes son enteros seguros en céntimos; solo el adaptador acepta euros heredados. Cero produce `free`, un importe positivo produce `fixed` y el tipo permite rangos con mínimo menor que máximo. El fixture no tiene rangos, por lo que no se inventan. No coexisten precio y booleano de gratuidad. Se rechazan importes negativos, no finitos, inseguros o fracciones de céntimo.

### Fechas ISO y zona horaria

Los instantes de dominio incluyen offset ISO 8601 y la localización declara una zona IANA. El mapper combina la fecha y hora del piloto en `Europe/Madrid` y emite UTC con `Z`, usando `Intl` y `Date`. No presupone la zona horaria de quien ejecuta la app. Las horas inexistentes o ambiguas de un cambio de horario se rechazan porque falta información para elegir un instante.

El desplazamiento de `fechaBase` queda exclusivamente en `legacyEvents.ts` y es una técnica temporal de demostración. Conserva días civiles y hora local. `FixtureEventRepository` fija un día de referencia al construirse, por defecto hoy en Madrid; se puede inyectar para obtener resultados reproducibles. Renovar la demo tras medianoche requiere otra instancia. El dominio y el mapper desconocen este desplazamiento.

### Distancia derivada

`EventResult` envuelve `event` con `distanceMeters` opcional. El adaptador convierte la cifra ficticia actual de kilómetros a metros; se puede desactivar. `Event` no contiene distancia. Una futura consulta podrá calcularla respecto al usuario o una ubicación manual sin modificar el modelo canónico.

### Extensión del modelo

Se incluyen estados `scheduled`, `postponed`, `cancelled`, `soldOut`, y campos opcionales de fin, descripción, artista, dirección, coordenadas, organizador, fuente, entradas, media y accesibilidad. Los fixtures solo rellenan lo que contienen, además de la zona piloto y el estado por defecto acordados. Los datos opcionales de accesibilidad ausentes significan desconocido, no ausencia de facilidades.

## Consecuencias

- Los componentes futuros podrán consumir contratos estables sin conocer el formato legado.
- Se mantienen los datos en una única fuente durante esta fase; `/app` permanece intacto.
- Fechas, importes y relaciones se validan antes de entregar el dominio, sin librerías adicionales.
- Existe dependencia temporal de los JSON para las implementaciones de fixtures, aislada de las interfaces y de la futura UI.
- Los alias ISO/zona y los campos numéricos no sustituyen validación en ejecución; cada adaptador nuevo deberá aplicarla.
- `Intl` requiere datos de zonas horarias en el runtime; las pruebas en Node no sustituyen pruebas posteriores en Android/iOS.
- Las horas ambiguas requieren que una futura fuente suministre offset o una política aprobada; no se resuelven silenciosamente.

## Futura sustitución por backend

Una implementación remota de las mismas interfaces transformará respuestas externas mediante su propio adaptador a `Event`, `EventResult` y `Category`. URLs, credenciales y transporte quedarán en servicios. Entonces podrá retirarse la dependencia de los fixtures sin reescribir los componentes consumidores. No se decide proveedor ni se implementa acceso a servicios en este paso.

## Validación

`scripts/validate-data.ts` comprueba los recuentos 16/11/59, IDs y pertenencia al catálogo, precios, fechas y DST de Madrid, consulta por id/null, aislamiento de resultados, distancia fuera de Event, coordenadas y entradas inválidas. Usa Node y TypeScript ya disponibles; las instrucciones reproducibles están en `GUIA_PROYECTO.md`. Se ejecutan también typecheck y Expo Doctor.

## Condiciones para revisar esta decisión

Se revisará al integrar un proveedor real, monedas adicionales, recurrencias, entradas con tarifas más complejas, nuevas zonas con requisitos específicos, resolución de horas ambiguas o necesidades de consulta/caché demostradas. Los filtros del Paso 6 y la migración visual continúan pendientes de su propia tarea.
