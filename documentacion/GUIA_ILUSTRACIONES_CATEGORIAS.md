# Guía de ilustraciones por categorías — CULTURA

## Una ilustración reutilizable por tipo de evento

CULTURA no asigna una imagen única a cada evento. Los registros indican `categoria` y `subcategoria`; el catálogo local resuelve una ilustración que puede compartirse por muchos eventos.

Ejemplo: dos registros con `musica / rock` utilizan el mismo `app/assets/images/categorias/musica/rock.svg`. Los placeholders actuales son recursos de prueba, no arte definitivo.

El catálogo está en `app/data/categorias.json`. Cada subcategoría contiene `id`, `nombre` y `archivo`. Cuando `archivo` es null, se utiliza `app/assets/images/categorias/generica.svg`. También se usa esa imagen si falla la carga de un archivo declarado. Esto permite añadir ilustraciones progresivamente.

## Catálogo completo

### Música — `musica/`

- Rock — `rock`
- Pop — `pop`
- Metal — `metal`
- Jazz — `jazz`
- Flamenco — `flamenco`
- Clásica — `clasica`
- Electrónica — `electronica`
- Hip hop — `hip-hop`
- Indie — `indie`
- Folk — `folk`
- Tributos — `tributos`
- Cantautores — `cantautores`

### Teatro — `teatro/`

- Drama — `drama`
- Comedia — `comedia`
- Musical — `musical`
- Teatro clásico — `teatro-clasico`
- Teatro contemporáneo — `teatro-contemporaneo`
- Teatro infantil — `teatro-infantil`

### Comedia — `comedia/`

- Monólogos — `monologos`
- Improvisación — `improvisacion`
- Stand-up — `stand-up`

### Exposiciones — `exposiciones/`

- Pintura — `pintura`
- Fotografía — `fotografia`
- Escultura — `escultura`
- Arte contemporáneo — `arte-contemporaneo`
- Ilustración — `ilustracion`
- Historia / patrimonio — `historia-patrimonio`

### Literatura — `literatura/`

- Feria del libro — `feria-del-libro`
- Presentaciones — `presentaciones`
- Encuentros con autores — `encuentros-con-autores`
- Poesía — `poesia`
- Clubes de lectura — `clubes-de-lectura`

### Gastronomía cultural — `gastronomia/`

- Jornadas gastronómicas — `jornadas-gastronomicas`
- Ferias de producto local — `ferias-de-producto-local`
- Catas — `catas`
- Tradición culinaria — `tradicion-culinaria`
- Talleres de cocina — `talleres-de-cocina`

### Cine — `cine/`

- Cine clásico — `cine-clasico`
- Cine independiente — `cine-independiente`
- Documentales — `documentales`
- Cine de verano — `cine-de-verano`
- Festivales — `festivales`

### Danza — `danza/`

- Flamenco — `flamenco`
- Contemporánea — `contemporanea`
- Clásica — `clasica`
- Folclore — `folclore`

### Patrimonio — `patrimonio/`

- Visitas guiadas — `visitas-guiadas`
- Rutas históricas — `rutas-historicas`
- Monumentos — `monumentos`
- Arqueología — `arqueologia`

### Ferias y fiestas — `ferias/`

- Feria local — `feria-local`
- Fiesta popular — `fiesta-popular`
- Mercado medieval — `mercado-medieval`
- Tradición — `tradicion`

### Infantil y familiar — `infantil/`

- Teatro infantil — `teatro-infantil`
- Cuentacuentos — `cuentacuentos`
- Talleres — `talleres`
- Magia — `magia`
- Actividades familiares — `actividades-familiares`

## Especificaciones para el ilustrador

- Relación de aspecto 1:1.
- Tamaño recomendado: 1200 × 1200 px.
- Mínimo recomendado: 800 × 800 px.
- PNG si necesita transparencia.
- JPG o WEBP si utiliza fondo completo.
- Sin texto ni nombres de artistas.
- Sin fechas ni logos de terceros.
- Sin información específica de un evento.
- Margen seguro aproximado del 10–15 %.
- Sujeto principal centrado.
- Lectura clara en miniaturas pequeñas.
- Evitar detalles esenciales pegados a los bordes.
- Estilo visual coherente entre todas las categorías.
- Pensadas para reutilizarse en numerosos eventos.

La paleta actual de referencia del prototipo es crema rosado, granate suave y rosa empolvado. No es una identidad definitiva y no debe comprometerse la legibilidad del dibujo a pequeño tamaño. La futura aplicación Expo centralizará estos valores en su theme para que puedan sustituirse sin rehacer el sistema de ilustraciones.

## Convención de nombres y entrega

Usar minúsculas, sin espacios ni acentos y con guiones entre palabras.

Ejemplos:

- `rock.png`
- `jazz.png`
- `feria-del-libro.png`
- `monologos.png`
- `pintura.png`

Entregar cada archivo en su carpeta de categoría, por ejemplo `musica/rock.png`. Las carpetas son: musica, teatro, comedia, exposiciones, literatura, gastronomia, cine, danza, patrimonio, ferias e infantil.

Para integrar el arte definitivo:

1. Añadir el archivo a la carpeta correspondiente dentro de `app/assets/images/categorias/`.
2. Indicar su nombre y extensión en el campo `archivo` del catálogo.
3. Mientras el prototipo siga activo, actualizar el precache ASSETS de `app/sw.js` y su versión para el modo offline.
4. Verificar carga, miniatura y fallback, y reflejar cualquier cambio de código en su copia explicada.

No es necesario modificar la lógica de resolución ni los eventos para pasar de SVG a PNG, JPG o WEBP.

Durante la migración a Expo se conservará esta relación categoría/subcategoría → asset y el fallback genérico. La implementación futura deberá usar un mapa de assets estáticos compatible con el empaquetador, sin crear una imagen diferente para cada evento.
