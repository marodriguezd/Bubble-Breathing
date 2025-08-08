# Bubble Breathing

This README is available in English and Spanish. / Este README está disponible en Inglés y Español.

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

- **Guided Breathing Cycles:** A visual "breathing bubble" and optional audio cues guide you through each inhalation and exhalation.
- **Customizable Sessions:** Fully tailor your exercise by choosing the number of rounds, breaths per round, and the volume of the audio cues.
- **Persistent Settings:** Your session configuration (speed, rounds, breaths, and volume) is automatically saved in your browser, so you can pick up right where you left off on your next visit.
- **Adjustable Speed & Live Preview:** Select between Slow, Standard, and Fast speeds. A live preview on the setup screen demonstrates the selected pace before you begin.
- **Automatic Breath-Hold Timer:** After the breathing cycles, the app automatically times your breath-hold (retention) phase.
- **Structured Recovery Breath:** Following each breath-hold, the app guides you through a controlled 15-second recovery breath to help you normalize before the next round.
- **Flexible Control:** Skip the main breathing phase or the recovery breath at any time with dedicated buttons, giving you full control over your session.
- **Session Summary:** At the end of your session, review your retention times for each round and your overall average time.
- **Multilingual Support:** Seamlessly switch between English, Spanish, French, Italian, German, Portuguese and Simplified Chinese using an intuitive dropdown menu. Your language preference is saved for your next visit.
- **Zoom Persistence on Installation:** When installing the app as a web app (via "Add to Home Screen"), the zoom level set in your browser at the time of installation will be preserved for the installed app.
- **Zoom-Responsive Width:** The app's width adjusts dynamically with your browser's zoom level, allowing you to customize the viewing experience to your preference. [See zoom examples 📸](#zoom-examples)
- **Immersive, App-Like Interface:** A fully fluid and adaptive design that provides a native app feel. The layout uses modern CSS techniques to intelligently scale and distribute content, ensuring components fit perfectly on any screen size—from wide desktops to tall mobile displays—without scrollbars or viewport issues.

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

<p align="center">
  <img src="https://raw.githubusercontent.com/marodriguezd/Bubble-Breathing/main/assets/demo-screenshot_es.png" alt="Bubble Breathing Screenshot" width="350">
</p>

### ✨ Características

- **Ciclos de Respiración Guiados:** Una "burbuja de respiración" visual y señales auditivas opcionales te guían en cada inhalación y exhalación.
- **Sesiones Personalizables:** Adapta completamente tu ejercicio eligiendo el número de rondas, la cantidad de respiraciones por ronda y el volumen de las guías auditivas.
- **Configuración Persistente:** Los ajustes de tu sesión (velocidad, rondas, respiraciones y volumen) se guardan automáticamente en tu navegador, para que puedas continuar justo donde lo dejaste en tu próxima visita.
- **Velocidad Ajustable y Previsualización en Vivo:** Selecciona entre velocidades Lenta, Estándar y Rápida. Una previsualización en la pantalla de configuración te muestra el ritmo seleccionado antes de empezar.
- **Temporizador Automático de Apnea:** Después de los ciclos de respiración, la aplicación cronometra automáticamente tu fase de apnea (retención de la respiración).
- **Respiración de Recuperación Estructurada:** Tras cada apnea, la aplicación te guía a través de una respiración de recuperación controlada de 15 segundos para ayudarte a normalizarte antes de la siguiente ronda.
- **Control Flexible:** Salta la fase principal de respiración o la respiración de recuperación en cualquier momento con botones dedicados, dándote control total sobre tu sesión.
- **Resumen de la Sesión:** Al final de tu sesión, revisa tus tiempos de retención para cada ronda y tu tiempo promedio general.
- **Soporte Multilingüe:** Cambia fácilmente entre inglés, español, francés, italiano, alemán, portugués y chino simplificado usando un menú desplegable intuitivo. Tu preferencia de idioma se guarda para tu próxima visita.
- **Persistencia del Zoom al Instalar:** Al instalar la aplicación como web app (mediante "Añadir a pantalla de inicio"), el nivel de zoom configurado en el navegador en el momento de la instalación se mantendrá en la aplicación instalada.
- **Ancho Adaptable con Zoom:** El ancho de la aplicación se ajusta dinámicamente con el nivel de zoom del navegador, permitiéndote personalizar la experiencia de visualización a tu gusto. [Ver ejemplos de zoom 📸](#zoom-examples)
- **Interfaz Inmersiva tipo App:** Un diseño totalmente fluido y adaptativo que proporciona una sensación de aplicación nativa. El layout utiliza técnicas modernas de CSS para escalar y distribuir el contenido de forma inteligente, asegurando que los componentes se ajusten perfectamente a cualquier tamaño de pantalla —desde monitores anchos de escritorio hasta pantallas altas de móviles— sin barras de scroll ni problemas de viewport.

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