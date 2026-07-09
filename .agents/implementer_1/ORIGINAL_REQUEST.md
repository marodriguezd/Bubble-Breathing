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

## 2026-07-09T23:10:22Z
Objective: Refactor `src/hooks/useBreathingTimer.ts` and `src/components/RecoveryScreen.tsx` to eliminate all side-effects (like timeouts, audio, vibration, and state updates) from inside state updater functions, making them fully compatible with React's Strict Mode.

Tasks:
1. In `src/hooks/useBreathingTimer.ts`:
   - Replace the `setCurrentBreath((prev) => { ... })` updater wrapper with a ref-based tracking system or a clean synchronous check.
   - Specifically: use a React Ref `const breathRef = useRef(0);` inside `useBreathingTimer`.
   - Update `runBreathingCycle` so it increments `breathRef.current`. If `breathRef.current > config.breaths`, transition to `'retention'` phase and stop.
   - Otherwise, update the state `setCurrentBreath(breathRef.current)` and schedule the nested timeouts (`timings.inhale` and `timings.exhale`) and play tone / vibration outside any state updaters.
   - Reset `breathRef.current = 0` inside `startSession` and `stopSession`.

2. In `src/components/RecoveryScreen.tsx`:
   - Refactor the countdown interval and transitions so that no side-effects (like `playTone`, `vibrate`, `setRecoverySubPhase`, `setPhase`, `setCurrentRound`) are executed inside the `setTimeLeft((prev) => { ... })` updater callback.
   - Keep the `setTimeLeft` updater extremely simple (e.g. `setTimeLeft(prev => prev - 1)` or returning `0` if `prev <= 1`).
   - Use a `useEffect` that listens to `timeLeft` and handles transition logic (changing `recoverySubPhase`, scheduling next `timeLeft` duration, playing beep tones, and vibrating) when `timeLeft === 0`.
   - Ensure `timeLeft` is safely initialized to `3` when `phase` changes to `'recovery'`.

3. Run `npx tsc --noEmit` to verify type safety.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## 2026-07-09T23:12:37Z
You are the UI Implementation Worker. Your mission is to implement the layout adjustments, premium glassmorphism styling, and translation additions for the Bubble Breathing app.

Here are the specific instructions:
1. **ConfigScreen Button Alignment**:
   In `src/components/ConfigScreen.tsx`, locate the `<div className="config-buttons">` row:
   - Remove the inline `style={{ marginLeft: '10px' }}` from the middle button (Stats).
   - Ensure the buttons are aligned in the order: Reset (left), Stats (center), Start (right). (This order is already correct in markup, but needs the margin removed).

2. **StatsScreen Premium Glassmorphism Redesign**:
   In `src/components/StatsScreen.tsx`, refactor the markup to replace inline style attributes with CSS classes.
   Use the following component markup:
   ```tsx
   import React from 'react';
   import { useSession } from '../contexts/SessionContext';
   import { useHistory } from '../contexts/HistoryContext';
   import { useTranslation } from '../hooks/useTranslation';

   export const StatsScreen = () => {
     const { phase, setPhase } = useSession();
     const { history, currentStreak, longestStreak } = useHistory();
     const { t } = useTranslation();

     if (phase !== 'stats') return null;

     const totalSessions = history.length;
     const totalRetentionTime = history.reduce((acc, curr) => acc + curr.retentionSeconds, 0);
     const averageRetention = totalSessions > 0 ? Math.round(totalRetentionTime / totalSessions) : 0;

     return (
       <div id="statsScreen" className="screen active stats-screen">
         <h2 className="stats-title">{t('statsTitle', { defaultValue: 'Your Statistics' })}</h2>
         
         <div className="stats-grid">
           <div className="stats-card">
             <div className="stats-value primary">{currentStreak}</div>
             <div className="stats-label">{t('currentStreak', { defaultValue: 'Current Streak' })}</div>
           </div>
           <div className="stats-card">
             <div className="stats-value primary">{longestStreak}</div>
             <div className="stats-label">{t('bestStreak', { defaultValue: 'Best Streak' })}</div>
           </div>
           <div className="stats-card">
             <div className="stats-value small">{totalSessions}</div>
             <div className="stats-label">{t('totalSessions', { defaultValue: 'Total Sessions' })}</div>
           </div>
           <div className="stats-card">
             <div className="stats-value small">{averageRetention}s</div>
             <div className="stats-label">{t('averageRetention', { defaultValue: 'Avg Retention' })}</div>
           </div>
         </div>

         <div className="history-section">
           <h3 className="history-title">{t('recentSessions', { defaultValue: 'Recent Sessions' })}</h3>
           {history.length === 0 ? (
             <p style={{ color: 'var(--color-text)', textAlign: 'center', opacity: 0.7 }}>
               {t('noSessionsYet', { defaultValue: 'No sessions recorded yet.' })}
             </p>
           ) : (
             <div className="history-list">
               {history.slice(0, 10).map((session, idx) => {
                 let statusIcon = '🧘';
                 let statusDotColor = 'var(--color-primary)';
                 if (session.retentionSeconds >= 60) {
                   statusIcon = '⚡';
                   statusDotColor = 'var(--color-success)';
                 } else if (session.retentionSeconds >= 30) {
                   statusIcon = '🌬️';
                   statusDotColor = 'var(--color-secondary)';
                 } else {
                   statusIcon = '⏱️';
                   statusDotColor = 'var(--color-accent)';
                 }

                 return (
                   <div key={idx} className="history-item">
                     <div className="history-item-left">
                       <span className="history-status-dot" style={{ backgroundColor: statusDotColor, color: statusDotColor }}></span>
                       <span className="history-icon">{statusIcon}</span>
                       <span className="history-date">{new Date(session.date).toLocaleDateString()}</span>
                     </div>
                     <strong className="history-detail">
                       {session.retentionSeconds}s ({session.rounds} {session.rounds === 1 ? t('roundSingular', { defaultValue: 'rnd' }) : t('roundsPlural', { defaultValue: 'rnds' })})
                     </strong>
                   </div>
                 );
               })}
             </div>
           )}
         </div>

         <button className="reset-config-btn back-btn" onClick={() => setPhase('idle')}>
           {t('backBtn', { defaultValue: 'Back' })}
         </button>
       </div>
     );
   };
   ```

3. **CSS Class Definitions**:
   Modify BOTH `/data/data/com.termux/files/home/Bubble-Breathing/css/style.css` and `/data/data/com.termux/files/home/Bubble-Breathing/src/style.css` to add the following style definitions (appended at the end of the files or integrated cleanly):
   ```css
   /* Styles for configuration button alignment adjustments */
   .config-buttons {
     display: flex;
     gap: 1rem;
     justify-content: space-between;
     width: 100%;
   }

   .config-buttons .reset-config-btn,
   .config-buttons .start-button {
     flex: 1;
     max-width: none;
     text-align: center;
     font-size: 0.95rem;
     padding: 1rem 0.25rem;
     border-radius: 1.25rem;
     margin: 0;
   }

   /* Stats Screen Premium Glassmorphism styling */
   .stats-screen {
     display: flex;
     flex-direction: column;
     align-items: center;
     width: 100%;
   }

   .stats-title {
     color: var(--color-text);
     font-size: 2rem;
     font-weight: 700;
     margin-bottom: 2rem;
     text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
   }

   .stats-grid {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 1rem;
     width: 100%;
     max-width: 400px;
     margin-bottom: 2rem;
   }

   .stats-card {
     background: var(--color-glass-white);
     backdrop-filter: blur(12px);
     -webkit-backdrop-filter: blur(12px);
     border: 1px solid var(--color-glass-border);
     box-shadow: 0 8px 32px 0 var(--color-glass-shadow);
     padding: 1.25rem 1rem;
     border-radius: 1.5rem;
     text-align: center;
     transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
   }

   .stats-card:hover {
     transform: translateY(-2px);
     box-shadow: 0 12px 24px var(--color-glass-shadow);
     border-color: rgba(255, 255, 255, 0.2);
   }

   .stats-value {
     font-size: 2rem;
     font-weight: 700;
     color: var(--color-text);
   }

   .stats-value.primary {
     color: var(--color-primary);
     text-shadow: 0 0 10px rgba(76, 161, 175, 0.3);
   }

   .stats-value.small {
     font-size: 1.6rem;
   }

   .stats-label {
     font-size: 0.85rem;
     font-weight: 500;
     color: var(--color-muted);
     margin-top: 0.25rem;
   }

   .history-section {
     width: 100%;
     max-width: 400px;
     text-align: left;
     margin-bottom: 2rem;
   }

   .history-title {
     color: var(--color-text);
     margin-bottom: 1rem;
     font-size: 1.25rem;
     font-weight: 600;
   }

   .history-list {
     max-height: 200px;
     overflow-y: auto;
     background: var(--color-glass-white);
     backdrop-filter: blur(12px);
     -webkit-backdrop-filter: blur(12px);
     border: 1px solid var(--color-glass-border);
     border-radius: 1.5rem;
     padding: 0.5rem;
     box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
   }

   .history-item {
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding: 0.75rem 1rem;
     border-radius: 1rem;
     transition: background 0.2s ease;
   }

   .history-item:hover {
     background: rgba(255, 255, 255, 0.04);
   }

   .history-item:not(:last-child) {
     border-bottom: 1px solid var(--color-border);
   }

   .history-item-left {
     display: flex;
     align-items: center;
     gap: 0.75rem;
   }

   .history-status-dot {
     width: 8px;
     height: 8px;
     border-radius: 50%;
     display: inline-block;
     box-shadow: 0 0 8px currentColor;
   }

   .history-icon {
     font-size: 1.1rem;
     display: inline-flex;
     align-items: center;
   }

   .history-date {
     color: var(--color-muted);
     font-size: 0.9rem;
     font-weight: 500;
   }

   .history-detail {
     color: var(--color-text);
     font-size: 0.95rem;
   }

   .stats-screen .back-btn {
     max-width: 12rem;
     width: 100%;
     margin: 1rem auto 0 auto;
     display: block;
   }
   ```

4. **Add Translations**:
   In `src/translations.js`, add translations for the new keys. Locate `es: {` and `en: {` structures and insert:
   - For `es`:
     ```js
     statsTitle: "Mis Estadísticas",
     currentStreak: "Racha Actual",
     bestStreak: "Mejor Racha",
     totalSessions: "Sesiones Totales",
     averageRetention: "Apnea Promedio",
     recentSessions: "Sesiones Recientes",
     noSessionsYet: "Aún no hay sesiones registradas.",
     backBtn: "Volver",
     statsBtn: "Estadísticas",
     roundSingular: "ron",
     roundsPlural: "rons",
     ```
   - For `en`:
     ```js
     statsTitle: "Your Statistics",
     currentStreak: "Current Streak",
     bestStreak: "Best Streak",
     totalSessions: "Total Sessions",
     averageRetention: "Avg Retention",
     recentSessions: "Recent Sessions",
     noSessionsYet: "No sessions recorded yet.",
     backBtn: "Back",
     statsBtn: "Stats",
     roundSingular: "rnd",
     roundsPlural: "rnds",
     ```

5. **Build Check**:
   Run `npm run build` to make sure TypeScript compilation passes without errors.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Please report back when you are finished, specifying the files modified and the build command results.

