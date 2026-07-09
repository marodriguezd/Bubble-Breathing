# Handoff Report: Bubble Breathing Hexagon Animation & State Transitions

This report provides a read-only investigation and analysis of the Bubble Breathing application, contrasting the legacy JavaScript implementation (`script.js`) against the React v2.0 refactor. It maps out all necessary styling class declarations, exact timing/scaling parameters, and details the declarative React updates required to repair animations, recovery sequences, and header functionality.

---

## 1. Observation

### A. CSS Class & Style Declarations for the Hexagon
In `src/style.css` (lines 370–381) and `css/style.css` (lines 370–381):
```css
.hexagon {
  width: 9.375rem;
  height: 8.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  position: relative;
  overflow: hidden;
}
```
*   `.phase-breathing` (lines 405–408): Accent color gradient (orange-ish).
*   `.phase-retention` (lines 410–414): Danger color gradient (red) and pointer cursor.
*   `.phase-recovery` (lines 416–419): Success color gradient (green).
*   `.hexagon:active` (lines 401–403): Applies `transform: scale(0.96);`.

### B. Legacy Timings and Animation Parameter Details
In the legacy `script.js` (lines 35–39, 703–719, 1075–1085):
*   **Slow Speed Settings**: Inhale: 2500ms, Exhale: 1500ms.
*   **Standard Speed Settings**: Inhale: 2000ms, Exhale: 1000ms.
*   **Fast Speed Settings**: Inhale: 1000ms, Exhale: 1000ms.
*   **Custom Speed Range**: 1.0s to 8.0s cycle time. Formula used:
    ```javascript
    getBreathTiming(totalMs) {
      let inhale;
      if (totalMs <= 2000) {
        inhale = totalMs / 2;
      } else if (totalMs <= 3000) {
        inhale = 1000 + (totalMs - 2000); 
      } else {
        inhale = 2000 + (totalMs - 3000) * 0.5;
      }
      return { inhale: Math.round(inhale), exhale: Math.round(totalMs - inhale) };
    }
    ```
*   **Visual Scale Transformations**:
    *   **Inhale State**: `scale(1.3)` transition.
    *   **Exhale State**: `scale(0.9)` transition.
    *   **Reset / Stopped State**: `scale(1.0)` transition.
*   **Audio and Vibration Feedback**:
    *   `playTone(frequency, duration)`: Generates sine waves dynamically via the Web Audio API. Play at 220Hz for 200ms during inhale/exhale cycles, and 150Hz for 800ms when starting retention.
    *   `vibrate(30)`: Triggers a 30ms hardware vibration on supported mobile devices.

### C. Legacy Recovery Sequence Timing
In the legacy `script.js` (lines 797–841):
1.  **Inhaling Phase (`inhaling`)**: 3 seconds countdown, plays breath tone, triggers vibration, and transitions the green (`phase-recovery`) hexagon scale to `1.3` over 3000ms.
2.  **Recovery Hold Phase (`recovery`)**: 15 seconds countdown, hexagon remains static at `scale(1.3)`.
3.  **Exhaling Phase (`exhaling`)**: 3 seconds countdown, plays breath tone, triggers vibration, and transitions the green hexagon scale back to `scale(1.0)` or `scale(0.9)` over 3000ms.

---

## 2. Logic Chain

1.  **Issue (Breathing Animation)**:
    *   *Observation*: In `ExerciseScreen.tsx`, the class name is statically `.hexagon.phase-breathing`. No inline transitions/transforms exist, resulting in a completely static hexagon during breathing.
    *   *Observation*: In `useBreathingTimer.ts`, the loop sets a single timeout for `inhale + exhale` duration and increments `currentBreath` once. It has no concept of inhale vs exhale sub-phases.
    *   *Conclusion*: We need to split the breathing cycle in `useBreathingTimer.ts` into distinct inhale and exhale timeout stages and update a new `subPhase` context state so that `ExerciseScreen.tsx` can render dynamic inline style transforms (`scale(1.3)` during inhale and `scale(0.9)` during exhale) with matching transition times.

2.  **Issue (Config Screen Preview)**:
    *   *Observation*: In `ConfigScreen.tsx` (lines 23–27), the preview hexagon and counter are hardcoded to a static breath count of `1` with no active loop.
    *   *Conclusion*: We must add local React state (`previewBreathCount`, `previewSubPhase`) and a `useEffect` timer loop within `ConfigScreen.tsx` to cycle the scale styles and increment the preview breath count matching the active speed settings.

3.  **Issue (Recovery Phase)**:
    *   *Observation*: The React `SessionPhase` types in `SessionContext.tsx` only define `'recovery'`, and the `RecoveryScreen.tsx` (lines 8–29) implements only a single 15-second timer saying "Hold".
    *   *Conclusion*: We must refactor `RecoveryScreen.tsx` to locally cycle through three sub-phases: `inhaling` (3s), `hold` (15s), and `exhaling` (3s), applying corresponding instructions, inline scale transitions (1.0 -> 1.3 -> 1.0), and triggering Web Audio tones and device vibrations at transition points.

4.  **Issue (Broken UI Header & Global Controls)**:
    *   *Observation*: `Header.tsx` is completely static. The language dropdown dropdown, theme toggle button, and finish session button do not have React state, click handlers, or i18n translations.
    *   *Conclusion*: We must wire up `Header.tsx` with React state for language/theme, bind its event listeners, apply i18n lookups from `window.translations` (loaded from `translations.js`), and compute the width of `#progressFill` dynamically.

---

## 3. Caveats

*   **Audio Assets vs. Generated Sound**: `SoundscapeManager.tsx` loads environmental track files (e.g. `rain.mp3`), whereas the legacy beep/breath sound is a synthesised sine-wave tone. This proposal continues to use dynamic Web Audio oscillators for the beep tones, keeping them independent of audio tracks.
*   **Vibration API support**: Hardware vibration requires PWA support and user interaction permissions on modern browsers; fallback checks must be included.

---

## 4. Conclusion

To achieve complete feature parity with the legacy version, the following React files must be updated to apply state-driven inline styles and sequence timers.

### Precise List of Files to Modify & Changes Needed:

1.  **`src/contexts/SessionContext.tsx`**:
    *   Add `subPhase` state: `'idle' | 'inhale' | 'exhale' | 'hold'`.
    *   Add `results` array state to store `{ round: number, retentionTime: number }` per-round, enabling average calculation.
2.  **`src/hooks/useBreathingTimer.ts`**:
    *   Refactor `runBreathingCycle` to use two nested timeouts (inhale duration followed by exhale duration) and update the session's `subPhase` context.
    *   Integrate synth tone generation (`AudioContext`) and vibration (`navigator.vibrate`) triggers.
3.  **`src/components/ExerciseScreen.tsx`**:
    *   Retrieve `subPhase` and current speed timings.
    *   Apply inline style: `style={{ transition: 'transform ' + duration + 'ms ease-in-out', transform: 'scale(' + (subPhase === 'inhale' ? 1.3 : 0.9) + ')' }}`.
4.  **`src/components/ConfigScreen.tsx`**:
    *   Implement a local preview animation loop using `useEffect` and local state for preview breath count and preview sub-phase.
    *   Replace hardcoded estimated time with the legacy timing logic (taking speed, custom cycle time, and 90s apnea estimate into account).
5.  **`src/components/RecoveryScreen.tsx`**:
    *   Refactor the 15-second timer into three consecutive countdown periods: `inhaling` (3s, scaling to 1.3), `hold` (15s, staying at 1.3), and `exhaling` (3s, scaling to 1.0), playing tones/vibrations at transitions.
6.  **`src/components/Header.tsx`**:
    *   Fully wire language selector, theme toggle, and finish session buttons to React handlers and settings context.
    *   Compute the width of `#progressFill` dynamically.

---

## 5. Verification Method

1.  **TypeScript Verification**:
    Run the TypeScript compiler to verify there are no compilation or type errors:
    ```bash
    npx tsc --noEmit
    ```
2.  **Visual and Interactive Check**:
    Build and preview the Vite application:
    ```bash
    npm run build
    npm run preview
    ```
    *   Verify the config screen preview hexagon smoothly scales up and down.
    *   Verify the active exercise screen hexagon matches the breathing speed (inhaling expand vs exhaling contract).
    *   Verify the recovery screen transitions from inhale (3s) to hold (15s) and then exhale (3s) with corresponding visual scaling.
    *   Confirm header settings (language selector, theme toggle) update the DOM and save values to `localStorage`.
