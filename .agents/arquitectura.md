# Arquitectura — Quick-reference

> **Espejo técnico** de [`AGENTS.md`](../AGENTS.md) §4. NO dupliques contenido: este fichero es un **cheat-sheet de constantes clave** para acceso rápido entre sesiones. La prosa vive en `AGENTS.md` §4 — léelo para contexto completo.
>
> **Este fichero es RAM de sesión, no fuente-de-verdad.** Vive en `.agents/` (gitignored). Si lo pierdes con `git clean -fdX`, regenera desde `AGENTS.md` §4.

## Versiones (`package.json`)

| Recurso | Versión |
|---|---|
| react / react-dom | 19.2.7 |
| typescript | ~6.0.2 |
| vite | 5.4.21 |
| vite-plugin-pwa | 1.3.0 |
| lucide-react | 1.24.0 |
| oxlint | 1.71.0 |

## Constantes del dominio

- **Wim Hof ratio**: 65 % inhale / 35 % exhale. Aplicado en `getBreathTiming(totalMs)` para `custom` y como referencia mental para los presets.
- **Sentinel `rounds === 11`** ≡ modo ∞. Slider `max` en `ConfigScreen`. Esconde progress bar en `Header.tsx` y muestra `∞` en la UI.
- **PWA baseUrl**: `/Bubble-Breathing/` (hardcoded en `vite.config.ts → base`).
- **localStorage keys**: `bubbleBreathingConfig` (AppConfig), `bubbleBreathingHistory` (SessionHistory[]).

## Subfases — inconsistencia deliberada

| Tipo | Valores |
|---|---|
| `BreathSubPhase` | `'inhale' \| 'exhale' \| 'idle'` |
| `RecoverySubPhase` | `'inhaling' \| 'holding' \| 'exhaling' \| 'idle'` |

Ver `AGENTS.md` §4.2. **No "arreglar" sin coordinación** — está documentada como footgun.

## Contratos audio (no negociables)

| Cuándo | Tono | Función |
|---|---|---|
| respiración normal | 220 Hz / 200 ms | `playTone(220, 200, config.volume)` |
| per-minute cue apnea | 880 Hz / 180 ms | `playTone(880, 180, config.volume)` |
| última inhalación | 150 Hz / 600 ms | `playTone(150, 600, Math.min(1, vol*2.5))` |
| última exhalación | 120 Hz / 800 ms | `playTone(120, 800, Math.min(1, vol*2.5))` |

`vibrate(pattern)` NO se gatea con `config.volume` (deliberado: el OS filtra por modo de dispositivo). `AudioContext` es singleton lazy (`audioCtx` global en `useBreathingTimer.ts`).

## i18n (frágil)

- `translations.js` muta `window.translations[lang][key]` por side-effect.
- `useTranslation` lee con fallback a `'en'`. Sin type-safety.
- `t(key, { defaultValue: 'X' })` **NO es fallback real** — añadir clave a los 7 idiomas o devuelve la key cruda.

## Apilamiento de providers

```
SettingsProvider → SessionProvider → HistoryProvider → MainApp (monta useBreathingTimer)
```

## Notas de persistencia y estilo

- `.agents/` y `.opencode/` están en `.gitignore` (línea `# Agents internal logs`). Este fichero es **RAM de sesión** — `git clean -fdX` lo borra.
- `css/style.css` es duplicado legacy de `src/style.css`. Solo `src/style.css` se importa al bundle. NO editar `css/style.css` directamente.

## Referencias

[`AGENTS.md`](../AGENTS.md) §4 · [`PROJECT.md`](../PROJECT.md) · [`especificacion.md`](./especificacion.md) · [`especificaciones.md`](./especificaciones.md)
