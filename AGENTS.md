# `AGENTS.md` — Guía para agentes de IA sobre *Bubble Breathing*

> Documento de contexto enraizado en el código. Úsalo antes de tocar cualquier archivo para no romper convenciones. Si una regla entra en conflicto con lo que ves, gana este archivo.

---

## Memoria estructurada — directorio `.agents/`

Eres el agente IA trabajando en este repo. Tu bloc de notas personal vive en `./.agents/` — está **gitignored** (`# Agents internal logs`) pero es convención del proyecto. Cinco ficheros con propósito distinto:

> Antes de modificar código, vuelca aquí lo que descubras. Lo durable promueve a `AGENTS.md` o `arquitectura.md`. El resto se queda en `memoria.md` o `progreso.md`.

| Fichero | Para qué |
|---|---|
| `arquitectura.md` | Espejo técnico quick-ref. Constantes clave (versiones, sentinels, contratos audio). Reflejar `AGENTS.md` §4 sin duplicarlo. |
| `especificacion.md` | Espejo de producto. Features, variables `AppConfig`, out-of-scope, known issues. |
| `especificaciones.md` | Índice de docs tipo spec, fuente-de-verdad-por-pregunta, contratos cross-doc. |
| `memoria.md` | Bitácora de descubrimientos no triviales por sesión (bugs, patrones, decisiones, anti-patrones). Append-only. |
| `progreso.md` | Tareas: en curso / completado / pendiente. Valiosa entre sesiones. |

Reglas entre sesiones:

1. Antes de escribir, mira si ya hay una entrada previa.
2. **Append-only**. No reescribas la historia.
3. **Durable** → promueve a `AGENTS.md` o `arquitectura.md`. **Efímero** → solo `memoria.md` o `progreso.md`.
4. Acepta que `.agents/` es RAM de sesión (`git clean -fdX` lo borra). Lo importante vive en ficheros versionados.

Ahora sigue con §1 para entender el proyecto.

---

## 1. Resumen del proyecto

**Bubble Breathing** es una **PWA 100% client-side y offline-first** que guía al usuario en ciclos de respiración tipo *Wim Hof* (65 % inhalación / 35 % exhalación) y entrenamiento de apnea (retención + recuperación guiada).

**Arquitectura básica:**

- **Máquina de estados estricta** de 6 fases controlada en `SessionContext`:
  `idle` → `breathing` → `retention` → `recovery` → `finished` / `stats`.
- **App.tsx** mapea 1 componente a 1 fase (`{phase === 'breathing' && <ExerciseScreen />}`).
- **Estado global** vía React Context API (3 providers apilados). Sin Redux/Zustand.
- **Timer "headless"** desacoplado de la UI: `useBreathingTimer` corre dentro de `MainApp` y muta el contexto; los componentes sólo leen estado y aplican CSS transforms inline.
- **Persistencia** en `localStorage` con dos claves: `bubbleBreathingConfig` (settings) y `bubbleBreathingHistory` (sesiones + streaks).
- **Despliegue** a GitHub Pages en subpath `/Bubble-Breathing/` (configurado en `vite.config.ts → base`).
- **i18n custom** vía `window.translations` (NO usa `i18next`). 7 idiomas: en, es, fr, it, de, pt, zh.
- **Audio y vibración nativos** (Web Audio API + Vibration API), sin librerías externas.

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión | Notas |
|---|---|---|---|
| Runtime | React + ReactDOM | `^19.2.7` | `<StrictMode>` activo en `main.tsx` |
| Lenguaje | TypeScript | `~6.0.2` | `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedParameters`, `noFallthroughCasesInSwitch`; `noUnusedLocals` está **false** en `tsconfig.app.json` (intencional) y **true** en `node.json` |
| Bundler / dev | Vite | `^5.4.21` | `base: '/Bubble-Breathing/'` — NO CAMBIAR |
| PWA | `vite-plugin-pwa` | `^1.3.0` | `registerType: 'autoUpdate'`, `workbox.mode: 'development'` |
| Iconos UI | `lucide-react` | `^1.24.0` | única dependencia de UI |
| Audio UI | **Web Audio API nativa** | — | `useBreathingTimer` sintetiza tonos con un singleton `AudioContext` (lazy init) |
| Vibración | **Vibration API nativa** | — | `navigator.vibrate(pattern)`; el sistema operativo filtra por modo de dispositivo (esto es deliberado, ver §5) |
| Linter | **`oxlint`** (Rust) | `^1.71.0` | ⚠️ NO es ESLint; comentarios `// eslint-disable` **no funcionan** |
| Tests | **ninguno** | — | ⚠️ Si los necesitas, instala Vitest primero (ver §5) |
| Audio ambiente | MP3 en `/public/assets/` | — | WAV originales se generan con `scripts/generate_sounds.py` (Python) |
| CI/CD | GitHub Actions | — | `npm ci && npm run build` → Pages (`ubuntu-latest`, Node 20) |

**Lockfiles presentes:** `package-lock.json`, `pnpm-lock.yaml`, `bun.lock`. El repo soporta los tres package managers, pero el CI usa **npm** (`npm ci`). Para evitar drift, usa `npm` en CI/CD-consistent runs y `pnpm`/`bun` localmente sólo si lo prefieres.

---

## 3. Comandos frecuentes

```bash
# Instalar dependencias
npm install          # alineado con CI
# o:  pnpm install / bun install

# Desarrollo (Vite dev server con HMR + SW en dev)
npm run dev

# Build de producción — typecheck estricto + Vite build
npm run build        # equivalente a: tsc -b && vite build

# Preview del build local
npm run preview

# Lint (oxlint, NO ESLint)
npm run lint         # ejecuta: oxlint

# Typecheck rápido sin build
npx tsc -b

# Regenerar sonidos ambiente (opcional, Python puro)
python scripts/generate_sounds.py
```

**⚠️ LO QUE NO EXISTE:** `npm test`, `npm run format`, `npm run typecheck` suelto. Si los necesitas, instala primero (ver §5 *"Cómo añadir tests"*).

---

## 4. Convenciones de código y estructura

### 4.1 Layout (feature-based modular)

```
src/
├── App.tsx                 ← Shell: providers apilados + ruteo por fase
├── App.css                 ← ⚠️ LEGACY (plantilla inicial Vite, casi sin uso)
├── main.tsx                ← Bootstrap + registro PWA + i18n side-effect
├── style.css               ← ⭐ HOJA DE ESTILOS CANÓNICA (única que el bundle importa)
├── translations.js         ← Diccionario i18n (side-effect: window.translations)
│
├── contexts/               ← Estado global
│   ├── SettingsContext.tsx   # Config persistente (localStorage) + data-theme
│   ├── SessionContext.tsx    # Máquina de fases + timer state
│   └── HistoryContext.tsx    # Sesiones + streaks (current/longest)
│
├── hooks/                  ← Lógica reutilizable / headless
│   ├── useBreathingTimer.ts  # ⭐ Timer + playTone + vibrate (singleton)
│   └── useTranslation.ts     # Hook de i18n (lee window.translations)
│
├── components/             ← Una pantalla por fase
│   ├── Header.tsx             # Idioma + tema + progreso + finish
│   ├── ConfigScreen.tsx       # phase=idle — sliders + preview en vivo
│   ├── ExerciseScreen.tsx     # phase=breathing — hexágono animado
│   ├── RetentionScreen.tsx    # phase=retention — timer apnea + tap
│   ├── RecoveryScreen.tsx     # phase=recovery — inhale/hold/exhale
│   ├── ResultsScreen.tsx      # phase=finished — resumen + addSession
│   ├── StatsScreen.tsx        # phase=stats — dashboard histórico
│   └── SoundscapeManager.tsx  # Sin UI; maneja el Audio de ambiente
│
└── utils/
    └── timeFormat.ts          # formatTime(seconds): "Xs" o "Xs (Mm Ss)"

css/                        ← ⚠️ COPIA MANUAL desincronizada de src/style.css
public/assets/              ← Iconos SVG, sonidos MP3 (rain/whitenoise/ocean)
scripts/generate_sounds.py  ← Generador Python de WAV fuentes
.github/workflows/deploy.yml← Deploy a GitHub Pages
```

### 4.2 Naming

- **Componentes**: `PascalCase` + **named export** (`export const Header = () => …`). **Nunca** `export default`.
- **Hooks**: `camelCase` con prefijo `use`.
- **Contextos**: sufijo `<Name>Context` (valor) + `<Name>Provider` (componente).
- **Tipos / interfaces**: `PascalCase`, exportados con el nombre del concepto (`AppConfig`, `SessionHistory`, `RoundResult`).
- **Enums de fase**: literales lower-case (`'breathing'`, `'retention'`).
- **CSS classes**: `kebab-case` (`.speed-btn`, `.stats-card`, `.hexagon-container`).
- **localStorage keys**: `camelCase` plano (`bubbleBreathingConfig`, `bubbleBreathingHistory`).

⚠️ **INCONSISTENCIA DOCUMENTADA** entre sub-fases (no la "arregles" sin coordinación):

| Context | Valores |
|---|---|
| `BreathSubPhase` | `'inhale'` · `'exhale'` · `'idle'` ← **IMPERATIVO** |
| `RecoverySubPhase` | `'inhaling'` · `'holding'` · `'exhaling'` · `'idle'` ← **GERUNDIO** |

Antes de usar cualquier valor de subfase, lee su definition en `src/contexts/SessionContext.tsx`. **No asumas** formas verbales equivalentes.

### 4.3 Manejo de errores y logging

- `console.warn` → cosas esperadas (audio no disponible, vibración bloqueada por modo silencio del OS, autoplay bloqueado, parse de localStorage fallido).
- `console.error` → errores reales (registro de Service Worker fallido).
- Los `try/catch` usan **degradación elegante**, no throw al usuario:
  - `playTone` silencia con `console.warn` si el AudioContext falla.
  - `vibrate` ignora devices sin la API sin warning.
  - Carga de localStorage: si JSON.parse falla, vuelve a defaults con `console.error`.
- **No hay librería de logging** (Sentry, Winston, etc.) — es `console.*` directo.

### 4.4 Internacionalización (i18n) — sistema frágil

- `src/translations.js` muta `window.translations[lang][key]` por side-effect.
- `src/App.tsx` lo carga por side-effect: `import './translations.js'`.
- `useTranslation.ts` lee `window.translations[config.language]` con **fallback a inglés** si falta clave/idioma.
- API:
  - `t(key)` → string del diccionario, o el **key crudo** si no existe.
  - `t(key, { placeholder })` → sustituye `{placeholder}` dentro del string (el string del diccionario DEBE contener `{placeholder}` literal).
  - `t(key, { defaultValue: 'X' })` → ⚠️ **NO es un fallback real**. El hook no lo trata especialmente: si la key existe, intenta sustituir `{defaultValue}` literal (que no estará en el string, así que es inerte); si la key NO existe, devuelve la key cruda y el `defaultValue` se ignora. Muchos componentes del codebase **creen** que es un fallback y muestran `'soundscapeLabel'` cuando se elimina esa clave del diccionario.
- ⚠️ **Regla dura**: añade TODAS las keys a `src/translations.js` en los 7 idiomas. **No confíes** en `{ defaultValue: ... }` como red de seguridad: no funciona.
- ⚠️ **NO hay type-safety**: cualquier `t('typoXyz')` compila y devuelve la string cruda `'typoXyz'`. El compilador no detecta typos i18n.
- ⚠️ **Fragilidad de side-effect**: `src/translations.js` se importa desde `App.tsx` por `import './translations.js'` **únicamente por su side-effect**. NO intentes "modernizarlo" como módulo ES con `export` — `useTranslation.ts` lee `window.translations` y un módulo ES refactorizado se ejecutaría pero `window.translations` quedaría `undefined`.
- Al **añadir claves nuevas**, tradúcelas a los 7 idiomas. Si añades un idioma, sigue el checklist del comentario al final de `src/translations.js`.

### 4.5 Estilos y theming

- Tema vía atributo `html[data-theme="dark"|"light"]`. El provider `SettingsContext` lo aplica con `document.documentElement.setAttribute('data-theme', config.theme)` cuando cambia `config.theme`.
- **Glassmorphism** con variables CSS `--color-*` (definidas en `:root` y `html[data-theme="light"]`). No hardcoded colors.
- Tamaños fluidos: `clamp()`, `dvh`, `vmin`, `env(safe-area-inset-*)`.
- Preferencias de usuario respetadas: `overflow: hidden`, `-webkit-tap-highlight-color: transparent`.
- ⚠️ **`css/style.css` está duplicado a mano** y se desincroniza con frecuencia. El bundle solo importa `src/style.css` (vía `main.tsx`). **SOLO edita `src/style.css`**. Si necesitas sincronizar la copia legacy, hazlo manualmente y menciónalo en el commit.

### 4.6 Animaciones

- **Sin librerías** (no `framer-motion`, no `react-spring`).
- Cada componente de fase construye un objeto inline `{ transform: 'scale(...)', transition: 'transform Xms ease' }` que React aplica al hexágono.
- Patrón crítico: `requestAnimationFrame(() => requestAnimationFrame(startInhale))` se usa **una vez** al iniciar la fase breathing para garantizar la transición CSS desde 1.0 → 1.3. Si lo quitas, la primera inhalación "salta" sin animar.
- `useBreathingTimer` usa `setTimeout` recursivo (no `setInterval`) para fases; ordénalo por `phaseTimerRef.current`.

### 4.7 Audio y vibración — contrato crítico

`useBreathingTimer.ts` exporta dos funciones:

```ts
playTone(frequency: number, duration: number, volume: number): void
vibrate(pattern: number | number[]): void
```

**Reglas de uso (NO negociables):**

- `playTone(freq, ms, vol)` respeta `vol === 0` para **mudo real** (return temprano).
- `vibrate(pattern)` **NO se gates** con la configuración de volumen de la app. Es deliberado: Android filtra por modo de dispositivo (silencio = bloqueado por el OS; vibración/sonido = pasa). Si lo gateas con `config.volume`, rompes la semántica intencional del proyecto (ver `RetentionScreen` — per-minute cue; y `useBreathingTimer` — last-breath).
- Tonos distinguibles (ver `PROJECT.md`):
  - `220 Hz / 200ms` — respiración normal
  - `880 Hz / 180ms` — per-minute cue durante apnea
  - `150 Hz / 600ms` — última inhalación (× 2.5 volumen, cap a 1.0)
  - `120 Hz / 800ms` — última exhalación (× 2.5 volumen, cap a 1.0)
- `AudioContext` es singleton, lazy: `audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()` solo en la primera llamada. Trata como `let audioCtx: AudioContext | null = null` (fuera del hook, por eso no se reinicia entre fases).

### 4.8 Estado y derivados

- Los 3 providers están apilados en `App.tsx` en este orden:
  ```
  SettingsProvider
    └─ SessionProvider
         └─ HistoryProvider
              └─ MainApp (usa useBreathingTimer + lee phase para rutear)
  ```
- `useBreathingTimer()` se monta **dentro** de MainApp (debajo de los providers) para que el timer corra incluso cuando los componentes UI se desmontan/montan entre fases.
- Cada componente verifica `if (phase !== '<expectedPhase>') return null;` al inicio para no renderizar cuando la fase no coincide (defensivo contra renders previos en cambios de fase).
- En `Header.tsx`, **el cálculo del progreso está hardcoded para 11 rounds** (`if (config.rounds !== 11) { progressWidth = ... }`). **11 es el valor centinela para "∞" (modo infinito)**. Si lo refactorizas, respeta este sentinel.
- En Round counts, cualquier UI que muestre rondas debe respetar el sentinel: `config.rounds === 11 ? '∞' : config.rounds`.
- **Doble naturaleza del `11`**: `11` es a la vez (a) el `max` del slider de rounds en `ConfigScreen.tsx` (`min="1" max="11"`), y (b) el sentinel de "modo ∞" en `Header.progressWidth`, `ConfigScreen.getEstimatedTime()`, `ExerciseScreen` y `RetentionScreen`. Si refactorizas el sentinel, mantén los chequeos `=== 11` (o muévelos a un constante `INFINITE_ROUNDS = 11`, declarándola en `SessionContext` o `SettingsContext`).
- **Progress bar se oculta en modo ∞**: `Header.tsx` envuelve toda la lógica de cálculo en `if (config.rounds !== 11) { progressWidth = ... }`. En modo infinito la barra queda en 0 % — es decisión UX, no bug. Si lo cambias, respeta el check.

---

## 5. Reglas para agentes de IA

### ❌ EVITAR

1. **NO añadir dependencias nuevas** para features ya implementadas nativamente:
   - i18n → no `i18next`, `react-intl`, `formatjs`. Usa `useTranslation`.
   - Animación → no `framer-motion`, `react-spring`, `gsap`. Usa CSS transitions ligadas a state.
   - Audio UI → no `Howler.js`, `tone.js`. Usa `playTone` o sonidos ambiente MP3.
   - Estado global → no Redux, Zustand, Jotai. Context API.
   - Routing → no React Router. La navegación es por cambio de `phase`.

2. **NO editar `css/style.css`** — está duplicado y desincronizado. Edita SOLO `src/style.css`.

3. **NO usar comentarios `// eslint-disable*`** — el linter es `oxlint` y no los lee. Si reporta un falso positivo, refactoriza el código.

4. **NO crear componentes `export default`** — la convención es **named export** (`export const Foo = …`).

5. **NO asumir nombres de subfase**. Lee siempre `BreathSubPhase` y `RecoverySubPhase` en `SessionContext.tsx`. `inhale ≠ inhaling`.

6. **NO introducir `any`** sin justificación. El único existente está en `(window as any).webkitAudioContext` (Safari legacy) — déjalo o coméntalo.

7. **NO cambiar la `base` de Vite** (`/Bubble-Breathing/`). Romperás GitHub Pages.

8. **NO ejecutar `npm test` / `npm run test`** — no existe. Si necesitas tests, instala Vitest PRIMERO (ver abajo).

9. **NO añadir nuevos `.css` files**. Todo va a `src/style.css`. `App.css` es boilerplate legacy del template de Vite y está prácticamente sin uso; **NO metas nuevas reglas ahí**.

10. **NO usar `React.memo` React.lazy` `Suspense`** sin justificación fuerte — el proyecto no los usa y el bundle es deliberadamente simple.

11. **NO cambiar `StrictMode` en `main.tsx`** a menos que entiendas las implicaciones (los efectos de `useBreathingTimer` ya están protegidos con `stopTimer` cleanup).

### ✅ CÓMO escribir un componente nuevo

1. **Ubicación**: `src/components/<Nombre>.tsx` para utility components, `src/components/<Nombre>Screen.tsx` para pantallas mapeadas a una fase.
2. **Named export**, nunca `export default`.
3. **Verificación defensiva** al inicio:
   ```tsx
   const { phase } = useSession();
   if (phase !== '<expectedPhase>') return null;
   ```
4. **Lectura de estado vía hooks contextuales**: `useSession`, `useSettings`, `useHistory`, `useTranslation`.
5. **Texto de UI SIEMPRE vía `t('key')`**. Para placeholders: `t('key', { var: value })`. Para degradación segura: `t('key', { defaultValue: 'X' })`.
6. **Si añades keys i18n nuevas**, tradúcelas a los **7 idiomas** en `src/translations.js` (en, es, fr, it, de, pt, zh). Si añades idioma, también actualiza el checklist al pie del archivo + la `(LANGUAGES)` en `Header.tsx`.
7. **Feedback sensorial** → usa `playTone(freq, ms, vol)` y `vibrate(pattern)` de `'../hooks/useBreathingTimer'`. NO importar `useBreathingTimer` directamente sólo para esto (es headless y se monta una vez en `MainApp`).
8. **Assets en `/public/`**: usa `import.meta.env.BASE_URL + 'assets/...'`. (BASE_URL es `/Bubble-Breathing/` en prod, `/` en dev.)
9. **No inline-style salvo para `transform`/`transition` dinámico del hexágono**. Para todo lo demás, usa clases en `src/style.css`.
10. **Commit messages** estilo convencional: `feat: …`, `fix: …`, `style: …`, `chore: …`, `docs: …` (ver historial de git).

### ✅ CÓMO añadir tests (cuando sea necesario)

⚠️ **No hay setup**. Antes de escribir tests:

1. Instala: `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom`.
2. Añade `"test": "vitest"` a `package.json` scripts.
3. Si usas jest-dom: crea `src/test/setup.ts` y referéncialo en `vitest.config.ts`.
4. **Los hooks que manejan timers** (`useBreathingTimer`, `RetentionScreen`, `RecoveryScreen`) requieren `vi.useFakeTimers()`.
5. Para testear componentes que usan contextos, monta con los 3 Providers apilados en un wrapper.
6. **No mofifiques la lógica de side-effects en `main.tsx`** (registro SW, listener de `controllerchange`) — son difíciles de testear y son correctos según el contrato PWA.

### ✅ CÓMO añadir un nuevo idioma i18n

1. Edita `src/translations.js`: añade un nuevo bloque al objeto `window.translations = { … }`.
2. Edita `src/components/Header.tsx`: añade la entrada al array `LANGUAGES = [...]` con `{ code, name, flag }`.
3. Verifica que `src/translations.js` y `src/components/Header.tsx` siguen sincronizados (el comment al final de `translations.js` lo advierte).

### ✅ Antes de hacer un commit

- `npm run lint` debe pasar (oxlint, sin warnings).
- `npm run build` debe compilar sin errores de TS.
- Si modificas estilos, verifica también `css/style.css` y sincronízalo si está muy desincronizado (manual).
- Si modificas sonidos WAV fuente (Python), regenera con `python scripts/generate_sounds.py` y commitea los WAV resultantes.
- Si modificas la lógica de fases, lee `PROJECT.md` para entender las features existentes (Last Breath Amplified, Per-Minute Cue, Wim Hof 65/35) y no las rompas silenciosamente.

---

## 6. Footguns específicos (leer antes de cualquier PR)

1. **CSS duplicado**: `src/style.css` es la canónica (importada en `main.tsx`). `css/style.css` es legado y se desincroniza con frecuencia. **SOLO edita `src/style.css`**. Si la copia `css/` está muy desincronizada y quieres sincronizarla, hazlo manualmente y menciónalo en el commit. Regla completa en §4.5 y §5.
2. **`window.translations`** se carga por side-effect desde `App.tsx` (`import './translations.js'`). Si lo refactorizas a un módulo ES con `export`, perderás la disponibilidad global para `useTranslation.ts`.
3. **`config.rounds === 11`** es el sentinel de **"∞ / modo infinito"**. Condiciones que aparecen en `Header.tsx`, `ConfigScreen.getEstimatedTime()` (devuelve `'∞'`), `ExerciseScreen`, `RetentionScreen`, `RecoveryScreen`. Verifica antes de cambiar límites de slider.
4. **Service Worker se actualiza agresivamente** (cada 30 min + al volver foco, ver `main.tsx`). Si modificas lógica crítica, fuerza una recarga dura o espera 30 min en testing.
5. **El progress bar está hardcoded para 11 rounds** en `Header.tsx`. Si modificas el cálculo, respeta `if (config.rounds !== 11) { … }`.
6. **No tests = TS strict + tu única red de seguridad**. `verbatimModuleSyntax: true` y `erasableSyntaxOnly: true` te forzarán a ser explícito con imports y tipos.
7. **`tsBuildInfoFile`** configura incremental builds; si algo parece "raro", borra `node_modules/.tmp/` y reintenta.
8. **`pnpm-workspace.yaml`** existe pero el repo no es un workspace real — sólo tiene un flag `allowBuilds`. No agregues paquetes al "workspace" sin entender para qué sirve.
9. **`App.css` existe pero casi no se usa** (es boilerplate del template inicial de Vite). Si quieres añadir CSS, ve a `src/style.css`.
10. **`Header.tsx` tiene IDs hardcoded** (`id="langToggle"`, `id="exerciseHexagon"`, etc.) que sobreviven de la versión vanilla JS. Mantén la compatibilidad si vas a tocar IDs (no los necesitas para nada en React, son reliquia).

---

## 7. Glosario mínimo (solo términos con trampa semántica)

- **Last breath**: la respiración N-ésima (= `config.breaths`) inmediatamente antes de la apnea; recibe feedback sensorial **amplificado**. Condición: `breathRef.current === config.breaths` en `useBreathingTimer`.
- **Wim Hof ratio**: 65 % inhalación, 35 % exhalación (ratio **deliberado** del proyecto, no bug; un comentarío en el código lo justifica).
- **Sentinel `11`**: doble rol — `max` del slider de rounds **y** valor que activa el "modo ∞" en cálculos de progreso/tiempo.

---

**Si dudas entre dos aproximaciones, prioriza: simpleza → reutilización (helpers existentes) → consistencia con código cercano → solo entonces innovación.** Mantén el bundle pequeño, el código legible y la lógica de fases intacta.
