# Especificación — *Bubble Breathing*

> **Qué hace la app** desde la perspectiva del usuario / producto. Distinto de [`arquitectura.md`](./arquitectura.md) que describe **cómo está hecha**.

## Producto

PWA 100 % client-side y offline-first que guía al usuario en ciclos de respiración tipo **Wim Hof** (65 % inhalación / 35 % exhalación) y entrenamiento de apnea. Sin servidores, sin telemetría, sin autenticación. Datos del usuario viven en `localStorage` local del navegador.

## Flujo de usuario (máquina de fases visible)

```
1. idle        → ConfigScreen        (#configScreen)
                  - sliders: rounds, breaths, speed, volume, soundscape
                  - preview en vivo con hexágono animado

2. breathing   → ExerciseScreen      (#exerciseScreen)
                  - hexágono pulsa inhale/exhale × config.breaths veces
                  - last breath (la N-ésima) → feedback amplificado
                    (× 2.5 vol, tonos profundos, glow dorado animado)

3. retention   → RetentionScreen     (#retentionScreen)
                  - cronómetro apnea
                  - per-minute cue (880 Hz + double-tap vibración)
                  - tap sobre hexágono para terminar → recovery

4. recovery    → RecoveryScreen      (#recoveryScreen)
                  - inhale 3s → hold 15s → exhale 3s (skip-able)

5. (repetición #2–#4 según rounds, excepto ∞=11)

6. finished   → ResultsScreen       (#resultsScreen)
                  - resumen por ronda + totales
                  - sesión añadida a HistoryContext

   ↘ opcional desde ConfigScreen: StatsScreen
```

## Features de producto

### Personalización

| Variable | Rango / opciones | Default | Notas |
|---|---|---|---|
| `rounds` | 1–11 (paso 1) | `3` | `11` = ∞ |
| `breaths` | 5–60 (paso 5) | `30` | respiración por round |
| `speed` | `slow` / `standard` / `fast` / `custom` | `standard` | custom = 1.0–8.0 s con ratio 65/35 |
| `customTime` | 1.0–8.0 s (paso 0.1) | `3.0` | sólo aplica si `speed === 'custom'` |
| `volume` | 0–1 (paso 0.05) | `0.5` | silencia TONES; vibración sigue (deliberado) |
| `soundscape` | `none` / `rain` / `whitenoise` / `ocean` | `none` | MP3 en loop |
| `language` | `en` / `es` / `fr` / `it` / `de` / `pt` / `zh` | `en` | ver `especificaciones.md` |
| `theme` | `dark` / `light` | `dark` | atributo `data-theme` |

### Visual

- **Hexágono** con `clip-path: polygon(50% 0%, 100% 25%, ...)` que escala con `transform: scale(...)`.
  - Scale 1.3 en inhalación, 0.9 en exhalación, 1.0 idle/recovery-hold.
- **Glass morphism** en container y tarjetas (`backdrop-filter: blur(16px)`).
- **Glass reflection shimmer** vía `::after` linear-gradient rotado.
- **Layout responsive mobile-first** (max-width 480 px container, full-screen en mobile).

### Audio

- **Tonos UI** sintetizados con Web Audio API (no MP3), ver `arquitectura.md`.
- **Vibración háptica** sincronizada con audio.
- **Soundscapes de fondo** (MP3 loop opcional).

### Stats

- Sesiones guardadas con `id = Date.now().toString()` y `date = new Date().toISOString()`.
- **Streaks**:
  - **current** = racha de días consecutivos con al menos una sesión (≤1 día desde la última).
  - **longest** = racha histórica máxima.
- Categorización visual según `retentionSeconds`:
  - ⚡ ≥ 60 s → verde (éxito).
  - 🌬️ ≥ 30 s → azul (medio).
  - ⏱️ < 30 s → naranja (bajo).

### i18n

- 7 idiomas soportados (`en`, `es`, `fr`, `it`, `de`, `pt`, `zh`).
- Sistema custom (NO `i18next`). `useTranslation` lee `window.translations[lang][key]`.
- Fallback a inglés si falta clave o idioma.
- ⚠️ `{ defaultValue: 'X' }` **NO es fallback real** — hay que traducir las 7 lenguas manualmente o la UI enseña la key cruda.

### Persistence

- Settings + tema + language → `localStorage.bubbleBreathingConfig` automáticamente al cambiar.
- Sesiones → `localStorage.bubbleBreathingHistory` al finalizar (via `HistoryContext.addSession`).
- Carga defensiva: si `JSON.parse` falla → defaults + `console.error`.
- **Sin export / import** — todo es local.

### PWA

- Instalable (manifest, icons 192 / 512 / monochrome).
- Service Worker con `registerType: 'autoUpdate'`.
- **Actualización agresiva**: cada 30 min + al volver foco + al cargar la página (`main.tsx`).
- `import.meta.env.BASE_URL = '/Bubble-Breathing/'` resolve paths correctamente en Pages.

### Theming

- Dark (default) y Light.
- Cambio inmediato al toggle.
- Preferencia persistida.

## Variables de configuración (`AppConfig` shape)

```ts
{
  speed: 'slow' | 'standard' | 'fast' | 'custom',
  customTime: number,    // 1.0–8.0 (segundos totales del ciclo custom)
  rounds: number,        // 1–11; 11 = ∞
  breaths: number,       // 5–60 (paso 5)
  volume: number,        // 0–1 (paso 0.05)
  soundscape: 'none' | 'rain' | 'whitenoise' | 'ocean',
  language: 'en' | 'es' | 'fr' | 'it' | 'de' | 'pt' | 'zh',
  theme: 'dark' | 'light'
}
```

Defaults completos:
```ts
{
  speed: 'standard', customTime: 3.0, rounds: 3, breaths: 30,
  volume: 0.5, soundscape: 'none', language: 'en', theme: 'dark'
}
```

## Restricciones / decisiones de UX

- **Volumen = 0** silencia audio pero la vibración sigue (deliberado — el OS filtra por modo de dispositivo).
- **Modo ∞** (rounds = 11) oculta el progress bar (`Header` salta el cálculo si `config.rounds === 11`).
- **Hexágono** usa `transform` + `transition` CSS; sin bucles `requestAnimationFrame` excepto al arrancar.
- **Container** responsive mobile-first (max-width 480 px).
- **i18n sin type-safety** — los typos pasan compilación.

## Out of scope (no soportado, intencionalmente)

- Cuentas, sync en la nube, export/import de datos.
- Múltiples perfiles / identities.
- OAuth / SSO.
- Telemetría / analytics.
- Cambio del ratio Wim Hof desde UI.
- Tests automatizados (estado actual: cero).
- Modo "automático" sin apnea (no es Wim Hof).
- Notificaciones push diarias.

## Known issues / posibles mejoras (trackeables)

- ☐ No hay import/export de sesiones (CSV / JSON).
- ☐ No hay recordatorios diarios (push notifications).
- ☐ No hay estadísticas de *recovery time* (solo retention).
- ☐ `StatsScreen` muestra solo las últimas 10 sesiones (`history.slice(0, 10)`).
- ☐ No hay comparativa de velocidad / comparativa semanal en stats.
- ☐ No hay tests automatizados (completamente ausente).

## Referencias

- [`arquitectura.md`](./arquitectura.md) — implementación.
- [`AGENTS.md`](../AGENTS.md) — guía operativa para IA.
- [`PROJECT.md`](../PROJECT.md) — milestones y features técnicas.
- [`README.md`](../README.md) — descripción pública.
