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
