# Bubble Breathing

<div align="center">
  <img src="public/assets/icon.svg" alt="Bubble Breathing Logo" width="128" height="128">
  <h3>Immersive Guided Breathing & Breath-Hold Trainer</h3>

  [![License](https://img.shields.io/badge/License-Apache%202.0-blue)](https://opensource.org/licenses/Apache-2.0)
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen)](https://marodriguezd.github.io/Bubble-Breathing/)
  [![Made With](https://img.shields.io/badge/Made%20With-React%20%2B%20Vite%20%2B%20TS-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

  [Features](#-features) • [Installation](#-how-to-install) • [Tech Stack](#-technologies) • [License](#-license)
  
  **[🇪🇸 Leer en Español](README.es.md)**
</div>

---

## 🌟 Overview

**Bubble Breathing** is an immersive, app-like web application designed for guided rhythmic breathing exercises and breath-hold training. It helps you maintain focus and control your pace through a clean, full-screen interface with real-time animations, audio feedback, session tracking, and gamification—without installation required.

<p align="center">
  <img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/public/assets/demo-screenshot.png" alt="Bubble Breathing Screenshot" width="400">
</p>

## ✨ Features

- **Personalized Breathing Experience**
    - **Visual Guidance:** A dynamic hexagon synchronizes its scale with your breathing rhythm in real time.
    - **Audio Cues:** Synthesized tones and haptic vibration to guide each phase without looking at the screen.
    - **Custom Cycles:** Adjustable rounds, breaths per round, and audio volume via intuitive sliders.
    - **Variable Pace:** Slow, Standard, Fast, and **Custom** speed modes—the custom mode lets you set the exact cycle time (1.0s–8.0s) with dynamically calculated inhale/exhale ratios.

- **Intelligent Session Management**
    - **Automated Timers:** Tracks breathing, retention (breath-hold), and recovery phases automatically.
    - **Recovery Phases:** Guided inhale → hold → exhale recovery sequence between rounds.
    - **Dynamic Control:** Skip any phase at any time.
    - **Session Summary:** Review retention times per round, total time, and averages at the end.

- **📊 Statistics & Gamification**
    - **Stats Dashboard:** Premium glassmorphism panel showing current streak, best streak, total sessions, and average retention time.
    - **Session History:** Scrollable list of your last 10 sessions with color-coded performance indicators (⚡ ≥60s, 🌬️ ≥30s, ⏱️ <30s).
    - **Persistent Tracking:** All data saved to localStorage — your progress follows you across sessions.

- **Premium User Experience**
    - **PWA Ready:** Install it on your home screen for an offline, app-like experience.
    - **Dark & Light Themes:** Toggle between themes with a single tap; preference is persisted.
    - **Persistence:** All settings (speed, rounds, breaths, volume, language, theme) are automatically saved.
    - **Multilingual Support:** Available in 7 languages: English, Spanish, French, Italian, German, Portuguese, and Simplified Chinese.
    - **Edge-to-Edge Design:** Fully responsive layout optimized for mobile viewports with glassmorphism aesthetics.

## 📱 How to Install

Install Bubble Breathing as a Web App (PWA) for the best experience:

1. **Open** the [live demo](https://marodriguezd.github.io/Bubble-Breathing/) in your browser (Chrome/Android, Safari/iOS).
2. **Tap** the Menu (⋮) or Share (⎙) button.
3. **Select** "Add to Home Screen" or "Install App".

*Note: The app is designed to stay responsive even at high zoom levels, as shown in the demonstration below.*

<p align="center">
  <img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/public/assets/how_to_install_web_app.gif" alt="Bubble Breathing Installation & Zoom Adaptability" width="400">
</p>

## 🛠️ Technologies

The project has been fully rebuilt from vanilla JavaScript to a modern React architecture (V2.0) while retaining its original UI/UX feel.

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI with Context API for state management |
| **TypeScript** | Strict type checking and robust logic |
| **Vite** | High-performance bundler and dev server |
| **vite-plugin-pwa** | Service Worker generation and Web App Manifest |
| **Web Audio API** | Synthesized audio cues (no external sound files) |
| **CSS3** | Glassmorphism, Flexbox, `clamp()`, dynamic viewport units (`dvh`, `vmin`) |
| **GitHub Actions** | Automated CI/CD pipeline for GitHub Pages deployment |

## 📄 License

This project is licensed under the **Apache 2.0 License**. See [LICENSE](LICENSE) for details.

---
<div align="center">
  Made with ❤️ for better breathing.
</div>
