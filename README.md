# Bubble Breathing

This README is available in English and Spanish. / Este README está disponible en Inglés y Español.

Available languages in the web app:
- English
- Spanish
- French
- Italian
- German
- Portuguese
- Simplified Chinese

**[🇬🇧 English](#english-version)   •   [🇪🇸 Español](#version-en-espanol)**

---

<a name="english-version"></a>

## 🇬🇧 English Version

An immersive, app-like web application for guided rhythmic breathing exercises. This tool helps you maintain focus and control your pace through a clean, full-screen interface designed to work flawlessly on any device, from desktop to mobile, without installation.

### ✨ [Live Demo Here](https://marodriguezd.github.io/Bubble-Breathing/)

<p align="center">
  <img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/assets/demo-screenshot.png" alt="Bubble Breathing Screenshot" width="350">
</p>

### ✨ Features

- **Personalized Breathing Experience:**
    - **Guided Cycles:** Visual "breathing bubble" and optional audio cues guide your inhalation and exhalation.
    - **Full Customization:** Tailor sessions with adjustable rounds (1-10 or infinite), breaths per round, and audio volume.
    - **Flexible Pace:** Choose between Slow, Standard, and Fast speeds with a live preview to demonstrate the rhythm.

- **Intelligent Session Management:**
    - **Automated Timers:** Automatically tracks breath-hold (retention) and guides you through a structured recovery breath.
    - **Dynamic Control:** Skip breathing or recovery phases at any time for full session control.
    - **Comprehensive Summary:** Review retention times for each round and your overall average at the session's end.

- **Seamless User Experience:**
    - **Persistent Settings:** Your preferences are automatically saved for future visits.
    - **Multilingual Support:** Easily switch between English, Spanish, French, Italian, German, Portuguese, and Simplified Chinese.
    - **Adaptive Design:** Immersive, app-like interface that scales perfectly across all devices and maintains zoom levels when installed as a web app.

### 📱 How to Install as a Web App

You can install Bubble Breathing directly on your device for quick access, just like a native app. Follow these simple steps:

1. Open the app in your browser (Chrome recommended for Android, Safari for iOS)
2. Tap the menu button (⋮) on Android or the share button (⎙) on iOS
3. Select "Add to Home Screen" or "Install app"
4. Confirm the installation

The app will appear on your home screen with the custom icon and can be used offline!

<p align="center">
  <img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/assets/how_to_install_web_app.gif" alt="Bubble Breathing Installation" width="350">
</p>

### 🛠️ Technologies Used

- **HTML5:** For the semantic structure of the application, including `viewport-fit=cover` for edge-to-edge mobile experiences.
- **CSS3:** For all styling, animations, and the fully adaptive layout.
  - **Modern CSS Layouts:** Utilizes Flexbox, `clamp()` for fluid typography, and dynamic viewport units (`dvh`, `vmin`) to create a robust, full-screen interface that solves common mobile viewport challenges.
  - **CSS Variables:** For easy theming and maintenance.
- **JavaScript (ES6+):** For all application logic, state management, and user interactions, structured within an object-oriented `BubbleBreathingApp` class for clean, manageable code.

### 📄 License

This project is under the MIT License.

[Go to Spanish version 🇪🇸](#version-en-espanol)   •   [Back to top ⬆️](#bubble-breathing)

---

<a name="version-en-espanol"></a>

## 🇪🇸 Versión en Español

Una aplicación web inmersiva de tipo nativo para ejercicios de respiración rítmica guiada. Esta herramienta te ayuda a mantener la concentración y controlar tu ritmo a través de una interfaz limpia a pantalla completa, diseñada para funcionar perfectamente en cualquier dispositivo, desde ordenadores de escritorio a móviles, sin necesidad de instalación.

### ✨ [Demo en vivo aquí](https://marodriguezd.github.io/Bubble-Breathing/)

<p align="center">
  <img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/assets/demo-screenshot_es.png" alt="Bubble Breathing Screenshot" width="350">
</p>

### ✨ Características

- **Experiencia de Respiración Personalizada:**
    - **Ciclos Guiados:** Una "burbuja de respiración" visual y señales auditivas opcionales te guían en cada inhalación y exhalación.
    - **Personalización Completa:** Adapta las sesiones con rondas ajustables (de 1 a 10 o infinito), respiraciones por ronda y volumen de audio.
    - **Ritmo Flexible:** Elige entre velocidades Lenta, Estándar y Rápida con una previsualización en vivo para demostrar el ritmo.

- **Gestión Inteligente de Sesiones:**
    - **Temporizadores Automatizados:** Registra automáticamente la apnea (retención) y te guía a través de una respiración de recuperación estructurada.
    - **Control Dinámico:** Salta las fases de respiración o recuperación en cualquier momento para un control total de la sesión.
    - **Resumen Completo:** Revisa los tiempos de retención de cada ronda y tu promedio general al final de la sesión.

- **Experiencia de Usuario Fluida:**
    - **Configuración Persistente:** Tus preferencias se guardan automáticamente para futuras visitas.
    - **Soporte Multilingüe:** Cambia fácilmente entre inglés, español, francés, italiano, alemán, portugués y chino simplificado.
    - **Diseño Adaptativo:** Interfaz inmersiva tipo aplicación que se adapta perfectamente a todos los dispositivos y mantiene los niveles de zoom al instalarse como web app.

### 📱 Cómo Instalar como Web App

Puedes instalar Bubble Breathing directamente en tu dispositivo para un acceso rápido, igual que una aplicación nativa. Sigue estos sencillos pasos:

1. Abre la aplicación en tu navegador (se recomienda Chrome para Android, Safari para iOS)
2. Toca el botón de menú (⋮) en Android o el botón de compartir (⎙) en iOS
3. Selecciona "Añadir a pantalla de inicio" o "Instalar aplicación"
4. Confirma la instalación

¡La aplicación aparecerá en tu pantalla de inicio con el icono personalizado y podrás usarla sin conexión!

<p align="center">
  <img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/assets/how_to_install_web_app.gif" alt="Bubble Breathing Installation" width="350">
</p>

### 🛠️ Tecnologías Utilizadas

- **HTML5:** Para la estructura semántica de la aplicación, incluyendo `viewport-fit=cover` para una experiencia inmersiva de borde a borde en móviles.
- **CSS3:** Para los estilos, animaciones y el diseño completamente adaptativo.
  - **Layouts Modernos de CSS:** Utiliza Flexbox, `clamp()` para tipografía fluida y unidades de viewport dinámicas (`dvh`, `vmin`) para crear una interfaz robusta a pantalla completa que soluciona los desafíos habituales de los viewports móviles.
  - **Variables CSS:** Para un fácil mantenimiento del tema.
- **JavaScript (ES6+):** Para toda la lógica de la aplicación, manejo de estado e interacciones del usuario, estructurado en una clase `BubbleBreathingApp` orientada a objetos para un código limpio y manejable.

<a name="zoom-examples"></a>

## 📸 Zoom Adaptability Examples / Ejemplos de Adaptabilidad al Zoom

<table align="center">
  <thead>
    <tr>
      <th align="center">Normal Zoom (100%) / Zoom Normal (100%)</th>
      <th align="center">Increased Zoom (150%) / Zoom Aumentado (150%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/assets/normal-zoom-example.png" alt="Normal Zoom Example" width="420"></td>
      <td align="center"><img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/assets/increased-zoom-example.png" alt="Increased Zoom Example" width="420"></td>
    </tr>
  </tbody>
</table>

[Back to English version 🇬🇧](#english-version)   •   [Volver a la versión en español 🇪🇸](#version-en-espanol)   •   [Back to top ⬆️](#bubble-breathing)