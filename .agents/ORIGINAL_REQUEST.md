# Original User Request

## Initial Request — 2026-07-09T22:50:04Z

Restaurar y reparar las animaciones CSS y las transiciones de estado del hexágono de respiración en la nueva versión React (v2.0) de Bubble Breathing, igualando exactamente el comportamiento fluido que tenía la versión original (legacy) sin perder la nueva arquitectura.

Working directory: `/data/data/com.termux/files/home/Bubble-Breathing`
Integrity mode: development

## Requirements

### R1. Restaurar Animaciones del Hexágono
El hexágono debe expandirse y contraerse suavemente durante las fases de inhalación y exhalación en tiempo real, respondiendo de la misma forma que lo hacía en la versión anterior. Las clases CSS o estilos en línea deben sincronizarse correctamente con el ciclo del temporizador.

### R2. Mantener la Arquitectura React
Las reparaciones no deben retroceder a la manipulación manual del DOM (`document.querySelector`, `element.style`, etc.). Todo debe seguir el paradigma declarativo de React usando estados (`useBreathingTimer`, `SessionContext`, etc.).

### R3. Consultar Historial (Referencia Legacy)
El equipo debe consultar el historial de Git (commits anteriores) para revisar el código de `script.js` y `style.css` original, con el fin de extraer los tiempos exactos, las funciones matemáticas y la sintaxis de las animaciones CSS (como `transform`, `transition-duration`, etc.) que daban el efecto deseado.

## Acceptance Criteria

### Verificación Visual y de Estado
- [ ] La animación del hexágono (escala/transición) dura exactamente lo estipulado por los cálculos de tiempo (inhale/exhale) configurados.
- [ ] El texto interior del contador se actualiza en el momento correcto sin parpadeos extraños.
- [ ] Todo el código nuevo respeta la validación de TypeScript (`npm run build` sin errores).

## Follow-up — 2026-07-09T23:10:31Z

Rediseñar y pulir la interfaz de estadísticas (`StatsScreen`) para darle un aspecto "premium", visual y definitivo acorde al diseño de la aplicación. Además, reorganizar la disposición de los botones en la pantalla de configuración (`ConfigScreen`).

Working directory: `/data/data/com.termux/files/home/Bubble-Breathing`
Integrity mode: development

## Requirements

### R1. Reorganización de Botones de Configuración
En `ConfigScreen.tsx`, la botonera inferior debe quedar alineada de la siguiente manera: "Reset" alineado a la izquierda, "Stats" en el centro, y "Start" a la derecha. Deben verse equilibrados y mantener un espaciado consistente.

### R2. Pulido Visual "Premium" de Estadísticas
En `StatsScreen.tsx`, eliminar el aspecto de "placeholder". Se debe aplicar un diseño mucho más refinado: usar transparencias tipo *glassmorphism* (acordes al tema oscuro/claro actual), mejorar el espaciado (padding/margin), redondear bordes, alinear correctamente la grilla de estadísticas (rachas y sesiones) y hacer que la lista del historial sea mucho más atractiva visualmente (por ejemplo, con íconos o colores de estado).

## Acceptance Criteria

### Verificación Visual y de Estado
- [ ] En la pantalla principal, los tres botones inferiores están ordenados exactamente como: Reset (Izquierda), Stats (Centro), Start (Derecha) usando Flexbox o Grid de manera equitativa.
- [ ] La pantalla de estadísticas es responsiva y no se desborda en pantallas pequeñas.
- [ ] El diseño de estadísticas se integra orgánicamente con el CSS global (`style.css`), sin usar estilos en línea excesivos, migrando las reglas a clases CSS limpias.
- [ ] Todo el código nuevo respeta la validación de TypeScript (`npm run build` sin errores).

## Follow-up — 2026-07-15T08:19:05Z

Mejorar el espaciado de elementos en las pantallas de recuperación entre rondas, y ajustar la pantalla de estadísticas reduciendo la altura vertical del contenedor de historial de estadísticas para que encaje mejor en pantalla, manteniendo su scroll.

Working directory: /data/data/com.termux/files/home/Bubble-Breathing
Integrity mode: development

## Requirements

### R1. Pantalla de recuperación
Ajustar el espaciado (márgenes/paddings) de los elementos en la pantalla de recuperación entre rondas para que la distribución sea visualmente equilibrada y profesional.

### R2. Pantalla de estadísticas
Reducir la altura máxima (vertical) del contenedor que muestra las estadísticas pasadas eligiendo una altura razonable (ej. `max-height: 50vh`) para que encaje bien en el espacio disponible de la pantalla sin empujar otros elementos. El contenido interno debe seguir siendo scrolleable.

## Acceptance Criteria

### Interfaz de Usuario
- [ ] Un agente independiente (Agent-as-judge) revisa los archivos HTML/CSS modificados y confirma que los márgenes/paddings de la pantalla de recuperación han sido ajustados de manera balanceada.
- [ ] Un agente independiente (Agent-as-judge) verifica analíticamente que al contenedor de estadísticas se le ha aplicado una propiedad de restricción de altura (como `max-height`) y que mantiene `overflow-y: auto` o similar.
