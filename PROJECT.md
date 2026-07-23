# Project: Bubble Breathing UI Refactoring

## Architecture
- **React Frontend**: Modular UI components (`src/components/`) compiled with Vite and TypeScript.
- **State Management**: React Context (`SessionContext`) or state hooks managing session statistics (streaks, breathing log/history, active timer state).
- **Styling**: Global and component styles managed via `css/style.css`. Responsive design optimized for mobile and desktop screens.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| 1 | M1: Exploration & Audit | Investigate StatsScreen.tsx, ConfigScreen.tsx, and css/style.css to plan changes. | None | DONE |
| 2 | M2: Implementation | Modify components for button layout, premium glassmorphism stats screen, and style classes. | M1 | DONE |
| 3 | M3: Verification & Auditing | Run TypeScript compilation check (`npm run build`) and perform reviewer/auditor gates. | M2 | IN_PROGRESS |
| 4 | M4: Final Handoff | Document achievements and prepare final report for Sentinel. | M3 | PLANNED |

## Features

### Last Breath Amplified Feedback (v2026-07-16)
The last inhalation and exhalation before each apnea (breath hold) now have intensified sensory feedback:

**Sound (useBreathingTimer.ts):**
- Normal breath: 220Hz tone, 200ms, base volume, 30ms vibration
- Last **INHALE**: 150Hz tone (deep), 600ms (long), **volume ×2.5** (capped at 1.0), strong vibration pattern [150,60,150,60,200], console.log debug
- Last **EXHALE**: 120Hz tone (very deep), 800ms (very long), **volume ×2.5**, vibration pattern [120,50,120], console.log debug

**Visual (ExerciseScreen.tsx + style.css + css/style.css):**
- Hexagon gets class `last-breath` → pulsing golden glow animation (`@keyframes lastBreathGlow`)
- Hexagon background shifts to brighter amber (`#ffc107` → `#ff6b00`)
- Breath counter gets bright text-shadow (white-gold glow)

**Scope:** Only affects the breath cycle when `breathRef.current === config.breaths` (last breath of each round). Timing, transitions, retention logic, and round management are untouched.

**Files modified:**
- `src/hooks/useBreathingTimer.ts` — amplified `playTone`/`vibrate` on last breath
- `src/components/ExerciseScreen.tsx` — conditional `last-breath` CSS class
- `src/style.css` — `@keyframes lastBreathGlow`, `.hexagon.last-breath`, `.breath-counter.last-breath`
- `css/style.css` — synced with src/style.css (was missing the last-breath rules)

### Per-Minute Apnea Notification (v2026-07-21)
Added a subtle per-cue during the apnea (breath-hold) phase so the user can keep count by ear without watching the timer.

**Trigger:** Whenever `phase === 'retention' && retentionTime > 0 && retentionTime % 60 === 0`. Fires once per minute on the minute boundary (60s, 120s, 180s, ...).

**Sound:** `playTone(880, 180, config.volume)` — a clear 880 Hz sine tick, intentionally higher pitch than the lower (150/120/220 Hz) feedback used during breathing and last-breath so the user hears a distinct cue.

**Vibration:** `vibrate([100, 50, 100])` — soft double-tap, lighter than the last-breath and retention-start patterns.

**Volume semantics:**
- Sound: gated by `playTone()` itself when `config.volume === 0` (mute means silence).
- Vibration: ALWAYS requested from the app. On Android, `navigator.vibrate()` is regulated by the device's system mode — silent mode blocks it, vibrate / sound modes allow it. We deliberately do NOT gate vibration on the in-app volume slider.

**Reuse:** No new helpers — leverages the existing `playTone` and `vibrate` exports from `src/hooks/useBreathingTimer.ts`.

**Files modified:**
- `src/components/RetentionScreen.tsx` — added one `useEffect` (~10 lines)

## Code Layout
- `src/components/StatsScreen.tsx`: React component for session stats and history view.
- `src/components/ConfigScreen.tsx`: React component for app configurations and action buttons.
- `src/style.css`: Stylesheet containing premium themes, cards, list rules, and glassmorphic layouts.
- `css/style.css`: Standalone stylesheet (kept synchronized with src/style.css).

## Interface Contracts
### StatsScreen ↔ SessionContext
- Reads session stats, streaks, history list, and configuration.
- Provides option to close/dismiss stats screen and return to parent view.

### ConfigScreen ↔ Parent Container / Action Handlers
- Takes action handlers `onStart`, `onReset`, `onShowStats` as props or from context.
- Lays out the primary action buttons in the specified order: Reset (left), Stats (center), Start (right).
