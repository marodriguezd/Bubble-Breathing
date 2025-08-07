# Bubble Breathing

This README is available in English and Spanish. / Este README está disponible en Inglés y Español.

**[🇬🇧 English](#english-version)   •   [🇪🇸 Español](#version-en-espanol)**

---

<a name="english-version"></a>

## 🇬🇧 English Version

An immersive, app-like web application for guided rhythmic breathing exercises. This tool helps you maintain focus and control your pace through a clean, full-screen interface designed to work flawlessly on any device, from desktop to mobile, without installation.

### ✨ [Live Demo Here](https://marodriguezd.github.io/Bubble-Breathing/)

![Bubble Breathing Screenshot](https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/demo-screenshot.png)

### ✨ Features

- **Guided Breathing Cycles:** A visual "breathing bubble" and optional audio cues guide you through each inhalation and exhalation.
- **Customizable Sessions:** Fully tailor your exercise by choosing the number of rounds, breaths per round, and the volume of the audio cues.
- **Adjustable Speed & Live Preview:** Select between Slow, Standard, and Fast speeds. A live preview on the setup screen demonstrates the selected pace before you begin.
- **Automatic Breath-Hold Timer:** After the breathing cycles, the app automatically times your breath-hold (retention) phase.
- **Structured Recovery Breath:** Following each breath-hold, the app guides you through a controlled 15-second recovery breath to help you normalize before the next round.
- **Flexible Control:** Skip the main breathing phase or the recovery breath at any time with dedicated buttons, giving you full control over your session.
- **Session Summary:** At the end of your session, review your retention times for each round and your overall average time.
- **Multilingual Support:** Seamlessly switch between English, Spanish, French, Italian, German, Portuguese and Simplified Chinese
  using an intuitive dropdown menu. Your language preference is saved for your next visit.
- **Zoom-Responsive Width:** The app's width adjusts dynamically with your browser's zoom level, allowing you to customize the viewing experience to your preference. [See zoom examples 📸](#zoom-examples)
- **Immersive, App-Like Interface:** A fully fluid and adaptive design that provides a native app feel. The layout intelligently scales and distributes itself to perfectly fit any screen size, from wide desktop monitors to tall mobile screens, completely avoiding scrollbars and common mobile viewport issues.

### 🚀 How to Use

As this is a pure (vanilla) HTML, CSS, and JavaScript project, no installation is needed.

1.  Clone this repository:
    ```bash
    git clone https://github.com/marodriguezd/Bubble-Breathing.git
    ```
2.  Navigate to the project folder:
    ```bash
    cd Bubble-Breathing
    ```
3.  Open the `index.html` file in your web browser. That's it!

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

![Bubble Breathing Screenshot](https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/demo-screenshot_es.png)

### ✨ Características

- **Ciclos de Respiración Guiados:** Una "burbuja de respiración" visual y señales auditivas opcionales te guían en cada inhalación y exhalación.
- **Sesiones Personalizables:** Adapta completamente tu ejercicio eligiendo el número de rondas, la cantidad de respiraciones por ronda y el volumen de las guías auditivas.
- **Velocidad Ajustable y Previsualización en Vivo:** Selecciona entre velocidades Lenta, Estándar y Rápida. Una previsualización en la pantalla de configuración te muestra el ritmo seleccionado antes de empezar.
- **Temporizador Automático de Apnea:** Después de los ciclos de respiración, la aplicación cronometra automáticamente tu fase de apnea (retención de la respiración).
- **Respiración de Recuperación Estructurada:** Tras cada apnea, la aplicación te guía a través de una respiración de recuperación controlada de 15 segundos para ayudarte a normalizarte antes de la siguiente ronda.
- **Control Flexible:** Salta la fase principal de respiración o la respiración de recuperación en cualquier momento con botones dedicados, dándote control total sobre tu sesión.
- **Resumen de la Sesión:** Al final de tu sesión, revisa tus tiempos de retención para cada ronda y tu tiempo promedio general.
- **Soporte Multilingüe:** Cambia fácilmente entre inglés, español, francés, italiano, alemán, portugués y chino simplificado usando un menú desplegable intuitivo. Tu preferencia de idioma se guarda para tu próxima visita.
- **Ancho Adaptable con Zoom:** El ancho de la aplicación se ajusta dinámicamente con el nivel de zoom del navegador, permitiéndote personalizar la experiencia de visualización a tu gusto. [Ver ejemplos de zoom 📸](#zoom-examples)
- **Interfaz Inmersiva tipo App:** Un diseño totalmente fluido y adaptativo que proporciona una sensación de aplicación nativa. El layout se escala y distribuye de forma inteligente para ajustarse perfectamente a cualquier tamaño de pantalla, desde monitores anchos de escritorio hasta pantallas altas de móviles, evitando por completo las barras de scroll y los problemas comunes de los viewports móviles.

### 🚀 Cómo Usarlo

Como es un proyecto de HTML, CSS y JavaScript puros (vanilla), no necesitas ninguna instalación.

1.  Clona este repositorio:
    ```bash
    git clone https://github.com/marodriguezd/Bubble-Breathing.git
    ```
2.  Navega a la carpeta del proyecto:
    ```bash
    cd Bubble-Breathing
    ```
3.  Abre el fichero `index.html` en tu navegador web. ¡Y listo!

### 🛠️ Tecnologías Utilizadas

- **HTML5:** Para la estructura semántica de la aplicación, incluyendo `viewport-fit=cover` para una experiencia inmersiva de borde a borde en móviles.
- **CSS3:** Para los estilos, animaciones y el diseño completamente adaptativo.
  - **Layouts Modernos de CSS:** Utiliza Flexbox, `clamp()` para tipografía fluida y unidades de viewport dinámicas (`dvh`, `vmin`) para crear una interfaz robusta a pantalla completa que soluciona los desafíos habituales de los viewports móviles.
  - **Variables CSS:** Para un fácil mantenimiento del tema.
- **JavaScript (ES6+):** Para toda la lógica de la aplicación, manejo de estado e interacciones del usuario, estructurado en una clase `BubbleBreathingApp` orientada a objetos para un código limpio y manejable.

<a name="zoom-examples"></a>
## 📸 Zoom Adaptability Examples / Ejemplos de Adaptabilidad al Zoom

**Normal Zoom (100%) / Zoom Normal (100%)**
![Normal Zoom Example](https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/normal-zoom-example.png)

**Increased Zoom (150%) / Zoom Aumentado (150%)**
![Increased Zoom Example](https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/increased-zoom-example.png)

[Back to English version 🇬🇧](#english-version)   •   [Volver a la versión en español 🇪🇸](#version-en-espanol)   •   [Back to top ⬆️](#bubble-breathing)

### 📄 License

This project is under the MIT License.

[Ir a la versión en Inglés 🇬🇧](#english-version)   •   [Volver arriba ⬆️](#bubble-breathing)