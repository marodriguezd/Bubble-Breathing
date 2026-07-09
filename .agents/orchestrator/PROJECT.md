# Project: Bubble Breathing Hexagon Animation & State Transitions Repair

## Architecture
The application is structured as a Vite + React + TypeScript single-page application.
- **SessionContext**: Central state provider tracking the current phase, rounds, breaths, and other playback states.
- **useBreathingTimer**: Custom hook driving the timing loop of the breathing cycle.
- **ConfigScreen**: Renders the settings form and a breathing preview hexagon.
- **ExerciseScreen**: Renders the active round, breath count, instructions, and the breathing hexagon.
- **RecoveryScreen**: Handles the post-retention recovery breath and its sequence.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Exploration | Identify legacy styling, transitions, and detail current React code | None | DONE |
| M2 | Context & Hook Update | Update `SessionContext` & `useBreathingTimer` with sub-phases and cues | M1 | IN_PROGRESS |
| M3 | Hexagon Styling & Animations | Update `ConfigScreen` & `ExerciseScreen` with dynamic scaling inline style | M2 | IN_PROGRESS |
| M4 | Recovery Sequence Update | Support `inhaling` (3s) -> `recovery` (15s) -> `exhaling` (3s) in `RecoveryScreen` | M3 | IN_PROGRESS |
| M5 | Build & Verify | Compile the application and verify with reviews/challengers/audits | M4 | PLANNED |

## Interface Contracts
### SessionContext ↔ useBreathingTimer & Screens
- `SessionPhase`: Add `'inhaling' | 'exhaling'` to existing `'idle' | 'breathing' | 'retention' | 'recovery' | 'finished'`.
- Sub-phase state for breathing: `breathSubPhase` ('inhale' | 'exhale' | 'idle') or similar exposed state to sync animations.
