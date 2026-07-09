## 2026-07-09T22:54:33Z
Objective: Implement CSS animations, state transitions, audio feedback, and translation system in React v2.0 of Bubble Breathing, restoring full parity with the legacy version.

Tasks:
1. Extend `src/contexts/SessionContext.tsx` to add states for:
   - `breathSubPhase`: `'inhale' | 'exhale' | 'idle'`
   - `recoverySubPhase`: `'inhaling' | 'holding' | 'exhaling' | 'idle'`
   - `roundResults`: `{ round: number; retentionTime: number }[]`
   Ensure `resetSession` clears these states.

2. Refactor `src/hooks/useBreathingTimer.ts` to:
   - Implement the breathing timer loop with nested timeouts (`timings.inhale` and `timings.exhale`) representing inhale and exhale phases, updating `breathSubPhase` accordingly.
   - Add dynamic audio synth tone generation (`AudioContext`) and dynamic vibration (`navigator.vibrate`) for the start of inhale (`playTone(220, 200)`, `vibrate(30)`), and start of retention (`playTone(150, 800)`, `vibrate([200, 100, 200, 100, 400])`).

3. Create/update a translation hook or helper `src/hooks/useTranslation.ts` that reads the current `language` from `config` (defaulting to `'en'`) and uses `window.translations` (imported in App.tsx) to provide localized text strings for the entire app.

4. Add `language` and `theme` properties to `AppConfig` interface and defaults in `src/contexts/SettingsContext.tsx` (so they are persisted in localStorage). Add document attribute synchronization for `theme`:
   `document.documentElement.setAttribute('data-theme', config.theme)`

5. Wire up the header in `src/components/Header.tsx` to support:
   - Dynamic theme toggling (cycling light/dark and setting document attributes).
   - Language selector dropdown with all 7 languages, changing translation locale on click.
   - Dynamic progress bar fill width using the legacy step-based formula:
     `totalSteps = config.rounds * (config.breaths + 2)`
     `currentStep = (currentRound - 1) * (config.breaths + 2)`
     Add corresponding steps for breathing, retention, inhaling, recovery, and exhaling.
   - Show/hide the finish button based on active phase, and make it finish the session on click.

6. Restore preview scaling animation on `src/components/ConfigScreen.tsx` using a local `useEffect` timer loop. Compute estimated session time matching legacy logic. Translate all text strings on the config screen.

7. Update `src/components/ExerciseScreen.tsx` to style `#exerciseHexagon` dynamically based on `breathSubPhase` and current speeds:
   - Inhale: scale(1.3)
   - Exhale: scale(0.9)
   - Neutral: scale(1.0)
   - Apply matching css transition durations. Translate all text.

8. Update `src/components/RetentionScreen.tsx` to translate all text and save retention time to `roundResults` when transitioning to recovery.

9. Refactor `src/components/RecoveryScreen.tsx` to handle the full recovery sequence:
   - `inhaling` (3s, scale green hexagon to 1.3, play tone/vibrate)
   - `holding` (15s, stay at 1.3)
   - `exhaling` (3s, scale down to 1.0, play tone/vibrate)
   Manage timers and countdowns, translate text, and transition to next round or finished phase when done.

10. Update `src/components/ResultsScreen.tsx` to calculate average retention time and render the list of retention times per round, using translations.

11. Compile the code using `npm run build` or `npx tsc --noEmit` to verify there are no TypeScript errors.

Scope Boundaries:
- Modify only the files listed under src/. Do not make direct DOM queries (except for the root theme attribute).
- Everything must follow the declarative React paradigm using states.
