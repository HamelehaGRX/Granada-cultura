# ADR-001: React Native + Expo como arquitectura principal

## Estado

Aprobado.

## Contexto

CULTURA dispone de un prototipo funcional en HTML, CSS y JavaScript nativo. El producto futuro necesita dar prioridad a Android e iOS e incorporar progresivamente cuentas, favoritos, agenda, ubicación, notificaciones, deep links y publicación en stores. La web seguirá siendo importante, pero secundaria.

El prototipo es útil como referencia, aunque su arquitectura basada en DOM, PWA y service worker no es la base adecuada para todas las capacidades nativas previstas.

## Decisión

La arquitectura principal será React Native con Expo, TypeScript estricto y Expo Router. El diseño será mobile-first y compartirá lógica y componentes con web cuando resulte razonable.

La migración será incremental. El prototipo de `app/` permanecerá intacto hasta alcanzar suficiente paridad y recibir autorización explícita para moverlo o retirarlo.

## Motivos

- Prioridad real de Android e iOS.
- Posibilidad de compartir una parte amplia del producto entre plataformas.
- Acceso progresivo a notificaciones, ubicación, enlaces y almacenamiento nativo.
- Navegación y deep links coherentes mediante Expo Router.
- Herramientas de build y distribución adecuadas para un equipo que trabaja también desde Windows.
- TypeScript reduce errores en datos, filtros, rutas y servicios.
- Expo permite empezar con una base gestionada sin impedir extensiones nativas futuras.

## Alternativas consideradas

### Seguir con Vanilla JS/PWA

Mantendría máxima simplicidad web, pero haría más costosa la integración y distribución de capacidades nativas y no responde a la prioridad mobile.

### React + Capacitor

Facilitaría la reutilización del enfoque web, pero la interfaz y muchos controles continuarían siendo principalmente web dentro de un contenedor. Se considera menos adecuada para una experiencia mobile-first sostenida.

### React Native sin Expo

Ofrece control nativo directo, pero añade configuración y mantenimiento prematuros. Expo cubre las necesidades previstas y mantiene una vía hacia código nativo cuando sea necesario.

### Flutter

Es una alternativa sólida y multiplataforma, pero exigiría adoptar Dart y un ecosistema diferente. React Native permite continuar dentro de TypeScript y React, con una transición conceptual más cercana al prototipo.

## Consecuencias positivas

- Una arquitectura principal para Android e iOS.
- Reutilización de lógica y buena parte de la UI en web.
- Navegación preparada para enlaces profundos.
- Theme, tipos y servicios compartidos.
- Builds y distribución centralizados mediante herramientas Expo.
- Evolución incremental sin borrar el prototipo.

## Consecuencias negativas

- La interfaz actual deberá reescribirse; HTML y CSS no se trasladan literalmente.
- Algunos componentes necesitarán variantes para web y native.
- Las dependencias nativas y los permisos aumentarán la complejidad de pruebas y publicación.
- El desarrollo y la depuración local completa de iOS requieren macOS; desde Windows se dependerá de builds remotos y dispositivos para ciertas validaciones.
- Habrá duplicación temporal mientras convivan ambas aplicaciones.

## Riesgos

- Buscar una reproducción literal del DOM en lugar de componentes nativos.
- Añadir dependencias o estado global antes de necesitarlos.
- Diferencias de accesibilidad y responsive entre plataformas.
- Problemas con SVG y resolución estática de assets.
- Mantener demasiado tiempo dos implementaciones activas.
- Acoplar el frontend al primer backend, proveedor de mapas o servicio de notificaciones elegido.

## Condiciones para revisar esta decisión

La decisión se revisará si:

- Expo impide una capacidad esencial y no existe una extensión nativa razonable;
- la web pasa a ser la plataforma principal;
- pruebas técnicas muestran un coste inaceptable de compartir la interfaz;
- requisitos regulatorios, de rendimiento o distribución exigen otra arquitectura;
- cambia sustancialmente el alcance del producto.

Cualquier revisión deberá documentarse en un nuevo ADR; no se modificará retrospectivamente esta decisión aprobada.
