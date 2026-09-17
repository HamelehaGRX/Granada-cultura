# ADR-013: tema global Claro, Oscuro y Sistema

## Estado

Aprobado el 17 de septiembre de 2026.

## Contexto

El theme inicial centralizaba una única paleta clara, pero los componentes la importaban de forma estática. CULTURA necesita respetar una preferencia explícita del usuario, seguir los cambios del dispositivo cuando se elige Sistema y mantener la misma identidad y accesibilidad en Android, iOS y web.

La apariencia es una preferencia local no sensible. El selector visible en Home es temporal: más adelante vivirá en `Perfil > Ajustes > Apariencia`, sin trasladar lógica desde el header.

## Decisión

`AppThemeProvider`, montado en el layout raíz, es la única fuente de verdad. Expone:

- `preference`: `light`, `dark` o `system`;
- `effectiveTheme`: `light` o `dark`, calculado desde la preferencia y `useColorScheme`;
- `isDark`;
- los tokens semánticos activos;
- la apariencia de categoría correspondiente al tema efectivo;
- `setThemePreference()`.

Los componentes consumen el contexto mediante `useAppTheme()` o `useThemeStyles()`. No consultan `Appearance` ni AsyncStorage por separado y no deciden colores con condicionales locales.

## Persistencia e hidratación

La clave `cultura.themePreference` guarda un sobre versionado `{ version: 1, data }` mediante la capa existente de storage. Solo se persiste la preferencia; el tema efectivo siempre se recalcula. Ausencia, JSON inválido, versión desconocida o valor distinto de los tres permitidos degradan a `system`.

Mientras se lee la preferencia, el layout muestra una superficie de arranque granate neutral y no monta la navegación. Así se evita renderizar primero toda la app clara cuando la preferencia persistida era oscura. Tras hidratar, el splash React de CULTURA usa los tokens del tema efectivo. El splash técnico nativo continúa bajo la configuración de Expo y puede requerir una adaptación separada al preparar builds de tienda.

## Tokens y categorías

`lightColors` conserva como base el diseño crema y granate aprobado. `darkColors` usa un fondo cálido casi negro, superficies vino oscuras, texto crema y estados semánticos adaptados. Ambos mantienen los mismos nombres de token.

Las once categorías tienen paletas clara y oscura centralizadas. En oscuro se conserva la familia cromática, pero se sustituyen los fondos pastel luminosos por superficies profundas y colores principales de contraste suficiente. El nombre textual de la categoría permanece siempre visible.

## Selector temporal

`ThemePreferenceSelector` es una interfaz pequeña y accesible junto a la lupa de Home. Abre un diálogo con opciones de radio rotuladas Claro, Oscuro y Sistema, muestra la selección actual y aplica/persiste el cambio inmediatamente. El componente solo usa la API global; retirarlo del header y reutilizar esa API desde Perfil no altera la arquitectura.

## Consecuencias

### Positivas

- Una única preferencia gobierna navegación, pantallas, tarjetas, detalle, filtros, splash y barra de estado.
- Sistema responde en ejecución a los cambios del dispositivo soportados por React Native.
- Los estados y categorías conservan significado sin depender solo del color.
- La persistencia sigue detrás de la abstracción existente y no añade dependencias.

### Costes y límites

- Todo componente visual nuevo debe consumir tokens dinámicos; importar la paleta clara estática volvería a introducir inconsistencias.
- La comprobación automática cubre resolución, persistencia y contraste de tokens, pero no sustituye lectores de pantalla ni dispositivos físicos.
- El selector permanece provisionalmente en Home hasta que exista la pantalla real de ajustes.

## Condiciones para revisar esta decisión

Se revisará si aparece tematización adicional, sincronización de preferencias entre cuentas, tokens de marca definitivos, requisitos de contraste más estrictos o una API nativa de splash que requiera coordinar recursos distintos por esquema.
