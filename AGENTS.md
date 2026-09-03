# PROYECTO CULTURA

## 1. Rama de trabajo

- Trabajar siempre en la rama `desarrollo`.
- Nunca modificar directamente `main`.
- No hacer merge a `main` sin aprobación explícita del usuario.
- No hacer commits ni pushes automáticos salvo que el usuario lo solicite expresamente.

## 2. Objetivo actual

- La prioridad actual es construir y pulir por completo la aplicación visual y funcional.
- Usar por ahora datos ficticios o locales.
- No implementar todavía backend, cuentas reales, recopiladores automáticos, base de datos remota, notificaciones reales ni agentes de producción.
- La arquitectura debe quedar preparada para integrar esas funciones en el futuro.

## 3. Código real y documentación explicada

Cada cambio debe mantenerse siempre en dos versiones paralelas:

1. Código real usado por la aplicación.
2. Copia explicada por bloques para documentación y aprendizaje.

Reglas:

- Todo cambio realizado en el código real debe actualizar también su equivalente explicado.
- No es necesario comentar cada línea.
- La documentación debe explicar por bloques:
  - qué hace cada sección;
  - por qué existe;
  - qué elementos controla;
  - qué partes se pueden modificar fácilmente.
- El código real debe permanecer limpio y legible.

## 4. Separación de responsabilidades

Mantener separadas, siempre que sea razonable:

- estructura HTML;
- estilos CSS;
- lógica JavaScript;
- datos;
- assets;
- documentación.

Evitar mezclar datos, diseño y lógica innecesariamente.

## 5. Diseño responsive

Todo cambio visual debe comprobarse en:

- móvil;
- tablet;
- escritorio.

La interfaz debe adaptarse a cada formato sin perder funcionalidad.

## 6. Filosofía de cambios

- Hacer cambios pequeños, localizados e incrementales.
- No rehacer partes no relacionadas con la tarea actual.
- No eliminar funciones ya aprobadas sin autorización.
- Mantener compatibilidad con lo que ya funciona salvo que se acuerde expresamente cambiarlo.
- Si una modificación implica una decisión importante de arquitectura, detenerse y pedir aprobación antes de continuar.

## 7. Git y revisión

Antes de dar una tarea por terminada:

- revisar `git status`;
- revisar `git diff`;
- informar de todos los archivos modificados;
- explicar qué se ha cambiado;
- indicar si existen riesgos, errores o tareas pendientes;
- no crear commits salvo indicación expresa del usuario.

## 8. Seguridad

- No guardar contraseñas, tokens, claves API ni credenciales en el repositorio.
- No instalar dependencias innecesarias.
- No borrar archivos sin explicar previamente el motivo.
- No ejecutar comandos destructivos sin aprobación.
- No modificar configuración sensible del sistema fuera del proyecto.

## 9. Identidad del producto

- El nombre visible de la aplicación es `CULTURA`.
- Granada es el territorio piloto, pero la aplicación debe diseñarse para ampliarse a otras ciudades, provincias y territorios.
- Evitar ligar visualmente la marca principal a Granada.

## 10. Navegación móvil

La barra inferior debe contener, en este orden:

- Explorar
- Agenda
- Inicio
- Favoritos
- Perfil

Reglas:

- `Inicio` debe estar situado en el centro.
- Cada elemento debe tener icono y texto.
- La barra debe ser clara, legible y cómoda de usar.

## 11. Navegación en escritorio

- La navegación será lateral.
- Debe ser compacta y ocupar poco ancho.
- `Inicio` aparecerá arriba.
- Debe incluir icono y texto.
- El contenido debe tener más espacio que la navegación.

## 12. Splash inicial

- El splash debe mostrar únicamente `CULTURA`.
- Fondo crema pastel.
- Texto `CULTURA` en blanco.
- Animación breve y perceptible:
  1. aparece primero el fondo;
  2. aparece después `CULTURA`;
  3. fondo y nombre desaparecen juntos.
- En escritorio debe funcionar igual, adaptado a mayor tamaño.

## 13. Paleta visual

- Color base: crema pastel agradable a la vista.
- Utilizar como máximo dos colores extra coordinados con el crema.
- Evitar colores agresivos o saturados.
- La estética debe ser suave, clara y agradable.

## 14. Header de Inicio

- Mostrar `CULTURA`.
- Incluir botón de búsqueda con lupa.
- El buscador debe abrirse dentro de la misma barra superior.
- Al pulsar la lupa:
  - el campo de búsqueda se expande de derecha a izquierda;
  - desplaza físicamente la palabra `CULTURA` hacia fuera de la barra;
  - no debe abrirse en una fila adicional;
  - no debe tapar los eventos.

## 15. Widget de filtros

- Debe estar dentro de la pantalla Inicio.
- Aspecto gris/blanco translúcido.
- Diseño suave y discreto.
- Utilizar inicialmente un símbolo de interrogación amigable y poco formal.
- Al pulsarlo, desplegará los filtros correspondientes.

## 16. Tarjetas de eventos

- Deben ser compactas.
- Mostrar información esencial de forma rápida:
  - tipo o categoría;
  - nombre;
  - fecha;
  - hora;
  - lugar;
  - precio o `Gratis`.
- Cada tarjeta tendrá un borde muy suave y sutil.
- Los bordes alternarán entre los tres colores principales del diseño.
- La alternancia debe ayudar a diferenciar eventos sin resultar llamativa.

## 17. Prioridad de la pantalla Inicio

La pantalla Inicio estará orientada a mostrar:

- eventos próximos;
- eventos cercanos;
- más adelante, eventos recomendados según intereses del usuario.

## 18. Arquitectura futura

Aunque todavía no se implemente, la estructura debe facilitar incorporar posteriormente:

- eventos reales;
- usuarios;
- perfiles de intereses;
- notificaciones;
- publicadores verificados;
- backend;
- base de datos;
- moderación;
- agentes de ChatGPT;
- expansión territorial.

## 19. Forma de trabajo

- No asumir cambios importantes no solicitados.
- Antes de ejecutar una modificación grande, explicar brevemente qué se va a tocar.
- Tras cada tarea, resumir:
  - archivos modificados;
  - funcionalidad añadida;
  - comportamiento esperado;
  - posibles puntos a revisar.
