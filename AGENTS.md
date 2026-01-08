# AGENTS.md

This document provides guidelines for AI agents working on the Bubble Breathing project.

## Project Overview

Bubble Breathing is a Progressive Web Application (PWA) for breathing exercises. It is a pure frontend application with no backend server, build system, or dependencies.

## Build & Testing Commands

This project uses vanilla HTML/CSS/JavaScript with no build tools.

### Local Development
- Open `index.html` directly in a browser for quick testing
- For PWA features, serve via HTTP server: `python -m http.server 8000` or `npx serve .`
- Test PWA installability by serving over HTTPS or localhost

### Browser Testing Checklist
- Verify responsive layout (mobile-first, desktop up to 480px)
- Test dark/light theme switching
- Test all 7 language options
- Test breathing exercise flow (config → exercise → retention → results)
- Test audio (Web Audio API) and vibration (Vibration API)
- Test localStorage persistence (settings survive page reload)
- Test PWA manifest and installability

### JavaScript Validation
```bash
# Check JavaScript syntax
node -c js/script.js
node -c js/translations.js

# Run Playwright for automated testing
npx playwright install chromium
npx playwright test  # Run all tests
npx playwright test --reporter=line  # Quick output
```

## Code Style Guidelines

### JavaScript Conventions

**Class Structure**
```javascript
class BubbleBreathingApp {
  constructor() { /* init */ }
  init() { /* setup */ }
  // Methods follow alphabetical or logical grouping
}
```

**Naming Conventions**
- Classes: PascalCase (`BubbleBreathingApp`)
- Methods/properties: camelCase (`currentLanguage`, `startSession`)
- Constants: camelCase for config objects, UPPER_Snake for true constants
- Private methods: Prefix with `_` (internal use only)
- DOM element references: Descriptive names with `elements.` prefix

**Imports/Exports**
- No module system; scripts load via `<script>` tags in order
- translations.js must load before script.js
- Global `window.translations` object shares translations

**Formatting**
- 2-space indentation
- Semicolons required
- Line length: 100 characters max
- One var/const/let per line
- Use arrow functions for callbacks and event handlers

**Types (JSDoc)**
```javascript
/**
 * Description of the method.
 * @param {string} paramName - Description
 * @param {number} [optionalParam] - Optional parameter
 * @returns {boolean} Description
 */
methodName(paramName, optionalParam) { }
```

**Error Handling**
- Use `try/catch` for localStorage and JSON operations
- Log warnings with `console.warn` for non-critical failures
- Never throw errors for missing UI elements; check existence first
- Wrap audio and vibration APIs in feature detection checks

**Code Patterns**
- Cache DOM elements in `this.elements` object during `initElements()`
- Use arrow functions for event handlers when `this` binding needed
- Chain DOM operations where possible
- Use early returns for guard clauses
- Centralize timer management in `this.timers` object
- Replace magic numbers with named constants

### CSS Conventions

**Custom Properties**
- Define all colors in `:root` at top of `style.css`
- Use semantic naming (`--color-primary`, `--color-muted`)
- Support both `data-theme="dark"` and `data-theme="light"`

**Styling Rules**
- Use CSS variables for all values that may change per theme
- Mobile-first media queries (`min-width: 768px`)
- Use `clamp()` for fluid typography
- Prefer `rem` over `px` for accessibility
- Glassmorphism: `backdrop-filter: blur()` with semi-transparent backgrounds

### HTML Conventions

- Semantic elements (`<button>`, `<label>`, `<header>`)
- Data attributes for JavaScript hooks (`data-lang`, `data-speed`)
- Accessibility: proper `aria-*` attributes where needed
- Load scripts with `defer` attribute

## File Structure

```
/assets       - Static assets (icons, images)
/css/         - Stylesheets (style.css)
/js/          - Application logic (script.js, translations.js)
index.html    - Main entry point
manifest.json - PWA configuration
AGENTS.md     - Agent guidelines
```

## Working with This Codebase

- Always preserve existing code style and patterns
- Update `js/translations.js` when adding new UI text
- Test localStorage operations with invalid JSON scenarios
- Web Audio API requires user interaction before playing
- Vibration API only works on supported devices
- Do not modify UI unless explicitly requested (UI is complete)

## Constants Reference

When modifying timing or configuration values, use these constants from `script.js`:
- `APNEA_ESTIMATE_SECONDS` - 90 seconds for apnea time calculation
- `RECOVERY_COUNTDOWN_SECONDS` - 15 seconds for recovery countdown
- `COUNTDOWN_DURATION_SECONDS` - 3 seconds for countdown phases
- `PREVIEW_START_DELAY_MS` - 500ms delay before animations
- `SECRET_MODE_TAP_COUNT` - 7 taps to unlock secret mode
