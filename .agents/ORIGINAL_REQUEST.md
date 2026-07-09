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
