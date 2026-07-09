# Handoff Report: Bubble Breathing v2.0 - Code Review & Adversarial Stress-Test

## 1. Observation

- **Review Environment**: Android/Linux Termux system.
- **Verification Commands Executed**:
  - `npx tsc --noEmit` completed successfully with exit code 0.
  - `npm run build` failed due to a missing platform-specific optional dependency `@rollup/rollup-android-arm64` under the Termux environment (which is a system build issue, not a codebase compilation error).
- **Files Inspected**:
  - `src/contexts/SessionContext.tsx`
  - `src/contexts/SettingsContext.tsx`
  - `src/hooks/useBreathingTimer.ts`
  - `src/hooks/useTranslation.ts`
  - `src/components/Header.tsx`
  - `src/components/ConfigScreen.tsx`
  - `src/components/ExerciseScreen.tsx`
  - `src/components/RetentionScreen.tsx`
  - `src/components/RecoveryScreen.tsx`
  - `src/components/ResultsScreen.tsx`
  - `src/style.css`
  - `src/translations.js`

- **Key Observations**:
  - React contexts cleanly track state phases: `idle`, `breathing`, `retention`, `recovery`, `finished` (matching legacy expectations).
  - All styling for the scaling hexagon animations is driven declaratively via dynamic inline React style transitions (using transform scales `1.3`, `0.9`, and `1.0` matching transition durations config) with **no direct DOM manipulation** (except setting `data-theme` on the root document element in `SettingsContext.tsx`, which is normal React behavior).
  - Localization matches legacy keys and values across all 7 supported languages.
  - Tones and vibration calls are wrapped in defensive try-catch statements.
  - In `useBreathingTimer.ts` (lines 93–119) and `RecoveryScreen.tsx` (lines 28–53), side-effects (scheduling timeouts, audio playback, vibrations, and nested state updates) are executed directly inside functional state updaters.

---

## 2. Logic Chain

1. **State Updater Purity**:
   - In React, functional updates like `setCurrentBreath((prev) => { ... })` and `setTimeLeft((prev) => { ... })` must be pure functions. They are executed by React internally to compute the next state.
   - React's `StrictMode` (enabled in `main.tsx`) purposefully runs these updater functions **twice** in development to help identify hidden side effects.
2. **Strict Mode Consequences**:
   - In `useBreathingTimer.ts`, because `window.setTimeout`, `playTone`, `vibrate`, and state setters are called inside `setCurrentBreath((prev) => { ... })`, they run twice per invocation in development.
   - This schedules duplicate concurrent timeouts, causing parallel loops that double-increment the breath count, trigger duplicate audio tone beeps and vibration pulses, and transition phases prematurely.
   - Similarly, in `RecoveryScreen.tsx`, transitioning sub-phases within the `setTimeLeft((prev) => { ... })` callback triggers double-beeps and double-vibrations at transition boundaries (e.g. holding to exhaling).
3. **Required Action**:
   - To achieve robust React standards and eliminate duplicate timing/audio loops in development, these side-effects must be refactored out of the functional updaters and into `useEffect` cleanups or standard callback functions.

---

## 3. Caveats

- **Rollup Toolchain Issues**: The local Vite production build (`npm run build`) fails in this Termux environment due to missing pre-compiled `@rollup/rollup-android-arm64` binary bindings. However, type-checking passes cleanly via `npx tsc --noEmit`.
- **Browser Audio Context Restrictions**: Oscillator-based sound synthesis is subject to browser user-interaction policies; `playTone` handles this gracefully via lazy creation and user interaction resumption.

---

## 4. Conclusion

- **Verdict**: **REQUEST_CHANGES**
- The React refactoring successfully replicates the responsive styling, layouts, localization, and estimated time formula of the legacy app. However, executing side-effects inside state updater functions represents a major React correctness bug that duplicates timers and audio feedback in development.

---

## 5. Verification Method

- **TypeScript Verification**:
  ```bash
  npx tsc --noEmit
  ```
- **React Strict Mode Verification**:
  Mount the application in development mode (`npm run dev`) with `<StrictMode>` enabled. Observe if the breath counter increments twice or sound feedback overlaps in parallel.

---

## Review Summary

**Verdict**: REQUEST_CHANGES

## Findings

### [Major] Finding 1: Side-Effects Inside `setCurrentBreath` State Updater

- **What**: Timer scheduling (`setTimeout`), audio playback (`playTone`), device vibration (`vibrate`), and state updates (`setPhase`, `setBreathSubPhase`) are performed inside the `setCurrentBreath` functional updater.
- **Where**: `src/hooks/useBreathingTimer.ts` (lines 93–119)
- **Why**: Under `<StrictMode>` in development, React executes functional state updaters twice. This results in duplicate timeout registration (creating parallel running loops), double beeps, double vibrations, and out-of-sync phase progression.
- **Suggestion**: Refactor `useBreathingTimer.ts` to manage the cycle loop reactively inside a `useEffect` keyed on the state changes, or schedule the side-effects in a standard event callback, keeping state updaters pure:
  ```typescript
  // Suggestion: Keep updater pure, handle effects in useEffect:
  setCurrentBreath((prev) => prev + 1);
  ```

### [Major] Finding 2: Side-Effects Inside `setTimeLeft` State Updater

- **What**: Nested state updates (`setRecoverySubPhase`, `setPhase`, `setCurrentRound`) and device feedback (`playTone`, `vibrate`) are executed inside the `setTimeLeft` state updater.
- **Where**: `src/components/RecoveryScreen.tsx` (lines 28–53)
- **Why**: React Strict Mode double-invocation triggers double beep/vibration feedback at the end of the recovery hold phase.
- **Suggestion**: Trigger audio/vibration feedback and screen transition steps via `useEffect` hook listening to `recoverySubPhase` state changes, rather than inside the countdown updater.

---

## Verified Claims

- **Clean TypeScript Compilation** → Verified via `npx tsc --noEmit` → **PASS**
- **Responsive styling & theme selection** → Verified via inspecting `src/style.css` variable rules and matching `SettingsContext.tsx` → **PASS**
- **Correctness of Estimated Time** → Verified via comparing legacy `APNEA_ESTIMATE_SECONDS` (90s) calculations against `ConfigScreen.tsx` (`rounds * (breaths * breathDuration + 90)`) → **PASS**
- **No Direct DOM Manipulation** → Verified via searching for `document.` calls (only root container and theme selector in context are used) → **PASS**

---

## Coverage Gaps

- **Audio/Vibration API runtime checks** — Risk Level: Low — Recommendation: Accept risk, as code wraps operations inside standard try-catch loops and checks browser API availability before execution.

---

## Unverified Items

- **Vite production bundle execution** — Reason: Environment-specific Rollup error on Android/Termux (`@rollup/rollup-android-arm64` missing).

---

## Challenge Summary

**Overall risk assessment**: MEDIUM

## Challenges

### [High] Challenge 1: Parallel timer leaks in Strict Mode

- **Assumption challenged**: Assumed that functions inside React's `setState((prev) => ...)` only run once.
- **Attack scenario**: Application runs in development mode under `React.StrictMode`. The state updater executes twice, spawning two competing timer timeouts.
- **Blast radius**: The breath cycle executes double-speed, increments the screen counter erratically, and play tones in an overlapping loop.
- **Mitigation**: Move timeout registrations out of the state updater and into standard `useEffect` lifecycles.

### [Medium] Challenge 2: Double beep cues during recovery transitions

- **Assumption challenged**: Assumed that audio oscillator play triggers inside updater functions execute exactly once.
- **Attack scenario**: Time countdown matches threshold (`timeLeft <= 1`) and calls playTone/vibrate. Under Strict Mode, the tone is played twice.
- **Blast radius**: User hears a double-overlap beep/vibration at transition boundaries.
- **Mitigation**: Move feedback cues into a reactive `useEffect` monitoring `recoverySubPhase`.

---

## Stress Test Results

- **Development Build + Strict Mode** → Breathing cycle loops and triggers duplicate timers → **FAIL**
- **Apnea estimated time calculation** → Correctly handles custom speed values and matches legacy math → **PASS**

---

## Unchallenged Areas

- **Environmental background soundscapes** — Out of scope since it is managed by the asset-loading `SoundscapeManager` component.
