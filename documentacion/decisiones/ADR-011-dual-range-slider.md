# ADR-011: Dual-range slider encapsulado como dependencia de UI

## Estado

Implementado para revisión en el Paso 10B.2A.

## Contexto

Precio y Distancia comparten rangos enteros inclusivos entre 0 y 1000. La migración Expo
conservó temporalmente dos campos mínimo/máximo con botones, mientras que el prototipo muestra
una sola barra con dos tiradores. Implementar manualmente gestos, teclado y soporte para Android,
iOS y web añadiría complejidad ajena al dominio de filtros.

## Decisión

Usar `@react-native-assets/slider` 11.0.12 y su `RangeSlider`. Es una dependencia directa de UI,
sin dependencias runtime adicionales declaradas. `DualRangeSlider.tsx` encapsula por completo su
tupla, propiedades y estilos. `RangeFilter` consume la interfaz propia de CULTURA y continúa
siendo compartido por Precio y Distancia; reducer, `NumericRange`, filtrado, unidades y
persistencia no importan la librería.

La configuración usa límites 0–1000, paso 1, separación mínima 0 y cruce desactivado. El track
seleccionado utiliza los tokens existentes. Cada tirador fija 28 px visibles dentro de un objetivo
enfocable de 44 px; el área del responder incluye además el padding táctil de la
librería. No se crea variante `.web.tsx` mientras el componente universal funcione correctamente.

## Accesibilidad y fallback

La librería expone los tiradores como controles ajustables, con valor, acciones de incremento y
decremento y flechas en web. Su API pública no permite asignar una etiqueta contextual distinta
a cada contenedor de tirador: internamente anuncia solo `min` y `max`. Por ello no se considera
que el slider resuelva por sí solo toda la accesibilidad.

Se conservan dos steppers compactos, Mínimo y Máximo, con composición `[− | valor + unidad | +]`.
Cada uno presenta un único borde exterior, divisiones internas y targets laterales de 44 px. Los
botones y el campo editable comparten la única fuente de verdad del reducer, permiten edición
precisa y constituyen la vía accesible garantizada. La UI limita cada extremo contra el otro antes
de despachar; el reducer sigue siendo la defensa final. La región de resumen permanece después de
los controles y no se añade una región viva por cada movimiento del slider.

## Consecuencias y riesgos

- Se recupera una interacción táctil próxima al prototipo sin duplicar lógica entre filtros.
- Sustituir la librería afecta principalmente a `DualRangeSlider.tsx` y al manifiesto de paquetes.
- Los valores coincidentes son válidos; el gesto elige el tirador según la dirección y los campos
  permiten separarlos si la plataforma dificulta seleccionar uno concreto.
- El empaquetado no sustituye las pruebas físicas con TalkBack, VoiceOver ni targets táctiles.
- Deben comprobarse teclado, foco, zoom, orientación y gestos en cada actualización relevante.
- La persistencia continúa guardando el mismo `NumericRange` v1 y no requiere migración.

## Condiciones para revisar

Revisar la decisión si la dependencia pierde mantenimiento o compatibilidad con una plataforma,
si no supera pruebas físicas, si se necesitan etiquetas contextuales completas por tirador o si
una incompatibilidad web obliga a una variante `DualRangeSlider.web.tsx`. Retirar los steppers
requiere una decisión posterior basada en accesibilidad y UX verificadas.
