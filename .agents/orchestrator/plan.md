# Plan - Restore Hexagon Animations & State Transitions in React v2.0

## Objective
Restore the smooth, fluid CSS scaling animations and state transitions of the breathing hexagon in the React v2.0 codebase of Bubble Breathing, matching the original legacy behavior without losing the clean React architecture.

## Design Decisions
1. **Breathing Cycle Sub-Phases (Inhale/Exhale)**:
   - Introduce declarative states or context properties in `SessionContext` or hooks to track when the user is inhaling vs. exhaling during the `'breathing'` phase.
   - Use these sub-phase states to drive CSS transitions/transforms on the hexagon.
2. **Animation Parameters**:
   - Inhale: Scale from `0.9` to `1.3` over the dynamic `inhale` duration.
   - Exhale: Scale from `1.3` to `0.9` over the dynamic `exhale` duration.
   - Rest/Idle: Scale of `1.0` with `300ms` default transition.
3. **Breathing Preview Animation**:
   - Restore the preview animation on the configuration screen (`ConfigScreen`) by implementing a React-based preview loop that toggles between inhale and exhale sub-phases, applying the correct dynamic timing and scales to `#previewHexagon`.
4. **Recovery Sequence Reconstruction**:
   - Restore the legacy recovery sequence: `inhaling` (3s) -> `recovery` (15s) -> `exhaling` (3s).
   - Add `'inhaling'` and `'exhaling'` to `SessionPhase` in `SessionContext`.
   - Update `RecoveryScreen` to handle the transition between these sub-phases automatically, updating the hexagon style, counter, and instructions accordingly.
5. **No Direct DOM Manipulation**:
   - Ensure all styles and attributes are applied via React states, bindings, and inline style configurations (`transform`, `transition`).

## Milestone / Tasks
- [ ] **Milestone 1: Exploration & Setup** (Investigate legacy files, timings, and verify current React structure details)
- [ ] **Milestone 2: Implementing Context and Hook Support** (Extend `SessionContext` with sub-phases, update `useBreathingTimer` to trigger sub-phase changes and sound/vibration cues)
- [ ] **Milestone 3: Implementing Component Styling & Animations** (Apply dynamic inline style transitions to `ExerciseScreen` and `ConfigScreen` hexagons)
- [ ] **Milestone 4: Recovery Sequence Support** (Implement `inhaling` -> `recovery` -> `exhaling` sequence in `RecoveryScreen` with proper countdowns, texts, and scaling)
- [ ] **Milestone 5: Verification & Quality Assurance** (Run builds, tests, and perform a Forensic Integrity Audit)

## Validation Plan
1. **Compilation Check**: Run `npm run build` to verify there are no TypeScript or compilation errors.
2. **Behavioral Check**:
   - Preview hexagon: expands/contracts over the exact timing selected (slow/standard/fast/custom).
   - Exercise hexagon: expands/contracts over the exact inhale/exhale timing, breath counter updates correctly.
   - Recovery sequence: inhaling for 3s (green hexagon expands), recovery/hold for 15s (stays expanded), exhaling for 3s (green hexagon contracts).
3. **Integrity Audit**: Run Forensic Auditor to confirm clean, non-cheating code implementation.
