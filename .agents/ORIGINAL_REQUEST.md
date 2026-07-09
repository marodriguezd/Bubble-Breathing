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
