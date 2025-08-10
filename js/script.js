// Aplicación de Respiración Bubble optimizada
class BubbleBreathingApp {
  constructor() {
    // Verificar que las traducciones estén cargadas
    if (!window.translations) {
      console.error('Translations not loaded! Make sure translations.js is loaded before script.js');
      return;
    }
    
    this.translations = window.translations;
    
    // Configuración mejorada de idiomas
    this.currentLanguage = localStorage.getItem('bubbleBreathingLanguage') || 'en';
    this.availableLanguages = ['en', 'es', 'fr', 'it', 'de', 'pt', 'zh'];
    this.languageConfig = {
      en: { flag: '🇬🇧', name: 'English' },
      es: { flag: '🇪🇸', name: 'Español' },
      fr: { flag: '🇫🇷', name: 'Français' },
      it: { flag: '🇮🇹', name: 'Italiano' },      
      de: { flag: '🇩🇪', name: 'Deutsch' },       
      pt: { flag: '🇵🇹', name: 'Português' },     
      zh: { flag: '🇨🇳', name: '简体中文' }       
    };
    
    // Configuración por defecto
    this.defaultConfig = { speed: 'standard', rounds: 3, breaths: 30, volume: 0.25 };
    
    // Cargar configuración guardada o usar por defecto
    this.config = this.loadConfig();
    
    this.session = { currentRound: 1, currentBreath: 0, isRunning: false, phase: 'config', results: [], timers: [] };
    this.speedSettings = {
      slow: { inhale: 2500, exhale: 1500 },
      standard: { inhale: 2000, exhale: 1000 },
      fast: { inhale: 1000, exhale: 1000 }
    };
    
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.previewAnimation = null;
    this.previewTimers = { inhale: null, exhale: null };
    this.previewBreathCount = 1;
    this.previewActive = false;
    this.previewFirstCycle = true;
    
    this.init();
  }
  
  // Métodos para memoria de configuración
  loadConfig() {
    try {
      const savedConfig = localStorage.getItem('bubbleBreathingConfig');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        // Validar que la configuración guardada sea válida
        return {
          speed: ['slow', 'standard', 'fast'].includes(parsed.speed) ? parsed.speed : this.defaultConfig.speed,
          rounds: (parsed.rounds >= 1 && parsed.rounds <= 5) ? parsed.rounds : this.defaultConfig.rounds,
          breaths: (parsed.breaths >= 5 && parsed.breaths <= 60) ? parsed.breaths : this.defaultConfig.breaths,
          volume: (parsed.volume >= 0 && parsed.volume <= 0.5) ? parsed.volume : this.defaultConfig.volume
        };
      }
    } catch (e) {
      console.warn('Error loading saved config:', e);
    }
    return { ...this.defaultConfig };
  }
  
  saveConfig() {
    try {
      localStorage.setItem('bubbleBreathingConfig', JSON.stringify(this.config));
    } catch (e) {
      console.warn('Error saving config:', e);
    }
  }
  
  resetConfig() {
    this.config = { ...this.defaultConfig };
    this.saveConfig();
    this.updateConfigUI();
    this.updateEstimatedTime();
    // Reiniciar preview con nueva configuración
    this.restartPreviewAnimation();
  }
  
  updateConfigUI() {
    // Actualizar sliders
    this.elements.roundsSlider.value = this.config.rounds;
    this.elements.roundsValue.textContent = this.config.rounds;
    this.elements.breathsSlider.value = this.config.breaths;
    this.elements.breathsValue.textContent = this.config.breaths;
    this.elements.volumeSlider.value = this.config.volume;
    this.elements.volumeValue.textContent = Math.round(this.config.volume * 100);
    
    // Actualizar botones de velocidad
    this.elements.speedBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.speed === this.config.speed);
    });
    
    // Actualizar instrucción del ejercicio
    this.updateExerciseInstruction();
  }
  
  init() {
    this.initElements();
    this.applyInitialTheme(); // <<< AÑADIDO: Aplicar tema al iniciar
    this.initEventListeners();
    this.updateLanguage();
    this.updateLanguageDisplay();
    this.updateConfigUI(); // Aplicar configuración guardada a la UI
    this.startPreviewAnimation();
    this.updateEstimatedTime(); // <<< AÑADIDO: Calcular tiempo estimado inicial
  }
  
  t(key, params = {}) {
    let text = this.translations[this.currentLanguage][key] || key;
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  }
  
  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('bubbleBreathingLanguage', lang);
    this.updateLanguage();
    this.updateLanguageDisplay();
    this.closeLanguageDropdown();
  }

  updateLanguage() {
    const elements = this.elements;
    
    // Header y navegación
    elements.headerTitle.textContent = this.t('appTitle');
    elements.finishBtn.textContent = this.t('finishBtn');
    
    // Pantalla de configuración
    elements.previewLabel.textContent = this.t('previewLabel');
    elements.speedSlow.textContent = this.t('speedSlow');
    elements.speedStandard.textContent = this.t('speedStandard');
    elements.speedFast.textContent = this.t('speedFast');
    elements.roundsLabel.textContent = this.t('roundsLabel');
    elements.breathsLabel.textContent = this.t('breathsLabel');
    elements.volumeLabel.textContent = this.t('volumeLabel');
    elements.startButton.textContent = this.t('startBtn');
    elements.resetConfigBtn.textContent = this.t('resetConfigBtn');
    elements.estimatedTimeLabel.textContent = this.t('estimated_time');
    
    // Pantalla de ejercicio
    this.updateRoundInfo();
    this.updateExerciseInstruction();
    elements.skipToRetentionBtn.textContent = this.t('skipToRetentionBtn');
    elements.skipRecoveryBtn.textContent = this.t('skipRecoveryBtn');
    
    // Pantalla de retención
    elements.retentionInstruction.textContent = this.t('retentionInstruction');
    elements.retentionTapInstruction.textContent = this.t('tapInstruction');
    
    // Pantalla de resultados
    elements.resultsTitle.textContent = this.t('resultsTitle');
    elements.newSessionBtn.textContent = this.t('newSessionBtn');
    
    if (elements.screens.results.classList.contains('active') && this.session.results.length > 0) {
      this.updateResultsContent();
    }
  }

  updateLanguageDisplay() {
    const langFlag = document.getElementById('langFlag');
    const langCode = document.getElementById('langCode');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Actualizar el botón principal
    const currentLang = this.languageConfig[this.currentLanguage];
    if (langFlag && langCode) {
      langFlag.textContent = currentLang.flag;
      langCode.textContent = this.currentLanguage.toUpperCase();
    }
    
    // Actualizar opciones activas en el dropdown
    langOptions.forEach(option => {
      const lang = option.dataset.lang;
      option.classList.toggle('active', lang === this.currentLanguage);
    });
  }

  toggleLanguageDropdown() {
    const dropdown = document.getElementById('langDropdown');
    const toggle = document.getElementById('langToggle');
    const overlay = document.getElementById('langOverlay');
    
    if (!dropdown || !toggle || !overlay) return;
    
    const isOpen = dropdown.classList.contains('open');
    
    if (isOpen) {
      this.closeLanguageDropdown();
    } else {
      dropdown.classList.add('open');
      toggle.classList.add('open');
      overlay.classList.add('active');
    }
  }

  closeLanguageDropdown() {
    const dropdown = document.getElementById('langDropdown');
    const toggle = document.getElementById('langToggle');
    const overlay = document.getElementById('langOverlay');
    
    if (dropdown) dropdown.classList.remove('open');
    if (toggle) toggle.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  }
  
  updateRoundInfo() {
    const current = this.session.currentRound;
    const total = this.config.rounds;
    const text = this.t('roundInfo', { current, total });
    
    if (this.elements.roundInfo) this.elements.roundInfo.textContent = text;
    if (this.elements.retentionRoundInfo) this.elements.retentionRoundInfo.textContent = text;
  }
  
  updateExerciseInstruction() {
    if (this.elements.exerciseInstruction) {
      this.elements.exerciseInstruction.textContent = this.t('exerciseInstruction', { count: this.config.breaths });
    }
  }
  
  updateResultsContent() {
    if (this.session.results.length === 0) return;
    
    const avg = Math.floor(this.session.results.reduce((a, r) => a + r.retentionTime, 0) / this.session.results.length);
    const resultsHTML = this.session.results.map(r => 
      `<div class="result-item">
        <span>${this.t('roundLabel', { round: r.round })}</span>
        <span>${this.formatTime(r.retentionTime)}</span>
      </div>`
    ).join('');
    
    const avgHTML = `<div class="result-item highlight">
      <span><strong>${this.t('averageLabel')}</strong></span>
      <span><strong>${this.formatTime(avg)}</strong></span>
    </div>`;
    
    this.elements.resultsContent.innerHTML = resultsHTML + avgHTML;
  }

  updateEstimatedTime() {
    const { rounds, breaths, speed } = this.config;
    const speedSetting = this.speedSettings[speed];
    const breathDuration = (speedSetting.inhale + speedSetting.exhale) / 1000;
    
    // Estimated apnea time based on user's example.
    // This is a simplified model and doesn't include the post-apnea recovery breath.
    const estimatedApnea = 90; 
    
    const totalSeconds = rounds * (breaths * breathDuration + estimatedApnea);
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    
    if (this.elements.estimatedTime) {
        this.elements.estimatedTime.textContent = `~${minutes}m ${seconds}s`;
    }
  }
  
  initElements() {
    this.elements = {
      screens: {
        config: document.getElementById('configScreen'),
        exercise: document.getElementById('exerciseScreen'),
        retention: document.getElementById('retentionScreen'),
        results: document.getElementById('resultsScreen')
      },
      headerTitle: document.getElementById('headerTitle'),
      progressFill: document.getElementById('progressFill'),
      finishBtn: document.getElementById('finishBtn'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      
      // Config screen
      previewHexagon: document.getElementById('previewHexagon'),
      previewCounter: document.getElementById('previewCounter'),
      previewLabel: document.getElementById('previewLabel'),
      speedSlow: document.getElementById('speedSlow'),
      speedStandard: document.getElementById('speedStandard'),
      speedFast: document.getElementById('speedFast'),
      speedBtns: document.querySelectorAll('.speed-btn'),
      roundsSlider: document.getElementById('roundsSlider'),
      roundsValue: document.getElementById('roundsValue'),
      roundsLabel: document.getElementById('roundsLabel'),
      breathsSlider: document.getElementById('breathsSlider'),
      breathsValue: document.getElementById('breathsValue'),
      breathsLabel: document.getElementById('breathsLabel'),
      volumeSlider: document.getElementById('volumeSlider'),
      volumeValue: document.getElementById('volumeValue'),
      volumeLabel: document.getElementById('volumeLabel'),
      startButton: document.getElementById('startButton'),
      resetConfigBtn: document.getElementById('resetConfigBtn'),
      estimatedTime: document.getElementById('estimated-time'),
      estimatedTimeLabel: document.querySelector('[data-translate="estimated_time"]'),
      
      // Exercise screen
      roundInfo: document.getElementById('roundInfo'),
      exerciseInstruction: document.getElementById('exerciseInstruction'),
      exerciseHexagon: document.getElementById('exerciseHexagon'),
      breathCounter: document.getElementById('breathCounter'),
      recoverySubtitle: document.getElementById('recoverySubtitle'),
      skipToRetentionBtn: document.getElementById('skipToRetentionBtn'),
      skipRecoveryBtn: document.getElementById('skipRecoveryBtn'),
      
      // Retention screen
      retentionRoundInfo: document.getElementById('retentionRoundInfo'),
      retentionTimer: document.getElementById('retentionTimer'),
      retentionHexagon: document.getElementById('retentionHexagon'),
      retentionInstruction: document.getElementById('retentionInstruction'),
      retentionTapInstruction: document.getElementById('retentionTapInstruction'),
      
      // Results screen
      resultsContent: document.getElementById('resultsContent'),
      newSessionBtn: document.getElementById('newSessionBtn'),
      resultsTitle: document.getElementById('resultsTitle')
    };
  }
  
  initEventListeners() {
    this.elements.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    const langToggle = document.getElementById('langToggle');
    const langOverlay = document.getElementById('langOverlay');
    const langOptions = document.querySelectorAll('.lang-option');

    if (langToggle) {
      langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLanguageDropdown();
      });
    }

    if (langOverlay) {
      langOverlay.addEventListener('click', () => {
        this.closeLanguageDropdown();
      });
    }

    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.dataset.lang;
        if (lang && this.availableLanguages.includes(lang)) {
          this.setLanguage(lang);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLanguageDropdown();
      }
    });
    
    this.elements.roundsSlider.addEventListener('input', e => {
      this.config.rounds = +e.target.value;
      this.elements.roundsValue.textContent = e.target.value;
      this.saveConfig();
      this.updateEstimatedTime();
    });
    
    this.elements.breathsSlider.addEventListener('input', e => {
      this.config.breaths = +e.target.value;
      this.elements.breathsValue.textContent = e.target.value;
      this.updateExerciseInstruction();
      this.saveConfig();
      this.updateEstimatedTime();
    });
    
    this.elements.volumeSlider.addEventListener('input', e => {
      this.config.volume = +e.target.value;
      this.elements.volumeValue.textContent = Math.round(e.target.value * 100);
      this.playTone(220, 200);
      this.saveConfig();
    });
    
    this.elements.speedBtns.forEach(btn => btn.addEventListener('click', () => {
      this.elements.speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.config.speed = btn.dataset.speed;
      this.saveConfig();
      this.restartPreviewAnimation();
      this.updateEstimatedTime();
    }));
    
    if (this.elements.resetConfigBtn) {
      this.elements.resetConfigBtn.addEventListener('click', () => {
        this.resetConfig();
      });
    }
    
    this.elements.startButton.addEventListener('click', () => this.startSession());
    this.elements.finishBtn.addEventListener('click', () => this.finishSession());
    this.elements.newSessionBtn.addEventListener('click', () => this.resetToConfig());
    
    this.elements.retentionHexagon.addEventListener('click', () => this.endRetention());
    this.elements.skipToRetentionBtn.addEventListener('click', () => this.skipToRetention());
    this.elements.skipRecoveryBtn.addEventListener('click', () => this.skipRecovery());
  }

  applyInitialTheme() {
    const savedTheme = localStorage.getItem('bubbleBreathingTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonIcon(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('bubbleBreathingTheme', newTheme);
    this.updateThemeButtonIcon(newTheme);
  }
  
  updateThemeButtonIcon(theme) {
    if (this.elements.themeToggleBtn) {
        this.elements.themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        this.elements.themeToggleBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }

  showScreen(name) {
    Object.values(this.elements.screens).forEach(s => s.classList.remove('active'));
    this.elements.screens[name].classList.add('active');
    
    const isConfigScreen = name === 'config';
    const showFinish = !isConfigScreen && name !== 'results';
    
    this.elements.finishBtn.classList.toggle('hidden', !showFinish);
    this.elements.themeToggleBtn.classList.toggle('hidden', !isConfigScreen);
    
    this.closeLanguageDropdown();
    
    if (name === 'exercise') {
      this.updateSkipButtons();
    } else {
      this.elements.skipToRetentionBtn.style.display = 'none';
      this.elements.skipRecoveryBtn.style.display = 'none';
    }
    
    if (name === 'config') {
      this.startPreviewAnimation();
    } else {
      this.stopPreviewAnimation();
    }
  }
  
  updateSkipButtons() {
    const phase = this.session.phase;
    this.elements.skipToRetentionBtn.style.display = phase === 'breathing' ? 'block' : 'none';
    this.elements.skipRecoveryBtn.style.display = 
      ['inhaling', 'recovery', 'exhaling'].includes(phase) ? 'block' : 'none';
  }
  
  updateProgress() {
    const total = this.config.rounds * (this.config.breaths + 2);
    let step = (this.session.currentRound - 1) * (this.config.breaths + 2);
    
    switch (this.session.phase) {
      case 'breathing':
        step += this.session.currentBreath;
        break;
      case 'retention':
        step += this.config.breaths + 1;
        break;
      case 'inhaling':
        step += this.config.breaths + 1.25;
        break;
      case 'recovery':
        step += this.config.breaths + 1.5;
        break;
      case 'exhaling':
        step += this.config.breaths + 1.75;
        break;
      default:
        step += this.config.breaths + 2;
    }
    
    this.elements.progressFill.style.width = `${Math.min(100, (step / total) * 100)}%`;
  }
  
  startSession() {
    this.session = {
      currentRound: 1,
      currentBreath: 0,
      isRunning: true,
      phase: 'breathing',
      results: [],
      timers: []
    };
    this.stopPreviewAnimation();
    this.showScreen('exercise');
    this.startBreathingPhase();
  }
  
  startBreathingPhase() {
    this.session.phase = 'breathing';
    this.session.currentBreath = 0;
    this.showScreen('exercise');
    this.updateRoundInfo();
    this.updateExerciseInstruction();
    this.elements.exerciseHexagon.className = 'hexagon phase-breathing';
    this.elements.recoverySubtitle.style.display = 'none';
    
    this.elements.exerciseHexagon.style.transition = 'transform 0.3s';
    this.elements.exerciseHexagon.style.transform = 'scale(1)';
    
    this.updateProgress();
    setTimeout(() => this.breathingCycle(), 500);
  }
  
  breathingCycle() {
    if (!this.session.isRunning || this.session.currentBreath >= this.config.breaths) {
      if (this.session.isRunning) this.startRetentionPhase();
      return;
    }
    
    this.session.currentBreath++;
    this.elements.breathCounter.textContent = this.session.currentBreath;
    this.updateProgress();
    
    const { inhale, exhale } = this.speedSettings[this.config.speed];
    
    this.playBreathTone();
    this.vibrate();
    
    this.elements.exerciseHexagon.style.transition = `transform ${inhale}ms ease-in-out`;
    this.elements.exerciseHexagon.style.transform = 'scale(1.3)';
    
    const inhaleTimer = setTimeout(() => {
      this.elements.exerciseHexagon.style.transition = `transform ${exhale}ms ease-in-out`;
      this.elements.exerciseHexagon.style.transform = 'scale(0.9)';
      
      const exhaleTimer = setTimeout(() => this.breathingCycle(), exhale);
      this.session.timers.push(exhaleTimer);
    }, inhale);
    
    this.session.timers.push(inhaleTimer);
  }
  
  skipToRetention() {
    if (!this.session.isRunning || this.session.phase !== 'breathing') return;
    this.clearTimers();
    this.session.currentBreath = this.config.breaths;
    this.elements.breathCounter.textContent = this.session.currentBreath;
    this.updateProgress();
    
    this.playRetentionStartSignal();
    
    setTimeout(() => this.startRetentionPhase(), 500);
  }
  
  startRetentionPhase() {
    this.session.phase = 'retention';
    this.session.retentionStart = Date.now();
    this.showScreen('retention');
    this.updateRoundInfo();
    this.updateProgress();
    
    this.playRetentionStartSignal();
    
    this.retentionInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.session.retentionStart) / 1000);
      this.elements.retentionTimer.textContent = this.formatTime(elapsed);
    }, 100);
  }
  
  playBreathTone() {
    if (this.config.volume > 0) {
      this.playTone(220, 200);
    }
  }
  
  playRetentionStartSignal() {
    if (this.config.volume > 0) {
      this.playTone(150, 800);
    }
    
    if (this.config.volume > 0 && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  }
  
  endRetention() {
    clearInterval(this.retentionInterval);
    const retentionTime = Math.floor((Date.now() - this.session.retentionStart) / 1000);
    this.session.results.push({ round: this.session.currentRound, retentionTime });
    this.startRecoverySequence();
  }
  
  startRecoverySequence() {
    this.startInhalingPhase();
  }
  
  startInhalingPhase() {
    this.session.phase = 'inhaling';
    this.showScreen('exercise');
    this.elements.exerciseInstruction.textContent = this.t('inhaleInstruction');
    this.elements.exerciseHexagon.className = 'hexagon phase-recovery';
    this.elements.recoverySubtitle.style.display = 'block';
    this.elements.recoverySubtitle.textContent = this.t('timeToInhale');
    this.updateProgress();
    
    this.playBreathTone();
    this.vibrate();
    
    this.startCountdown(3, () => this.startRecoveryPhase());
  }
  
  startRecoveryPhase() {
    this.session.phase = 'recovery';
    this.elements.exerciseInstruction.textContent = this.t('holdAirInstruction');
    this.elements.recoverySubtitle.style.display = 'none';
    this.updateProgress();
    
    this.startCountdown(15, () => this.startExhalingPhase());
  }
  
  startExhalingPhase() {
    this.session.phase = 'exhaling';
    this.elements.exerciseInstruction.textContent = this.t('releaseAirInstruction');
    this.elements.recoverySubtitle.style.display = 'block';
    this.elements.recoverySubtitle.textContent = this.t('timeToExhale');
    this.updateProgress();
    
    this.playBreathTone();
    this.vibrate();
    
    this.startCountdown(3, () => {
      this.elements.recoverySubtitle.style.display = 'none';
      this.completeRound();
    });
  }
  
  startCountdown(seconds, onComplete) {
    this.elements.breathCounter.textContent = seconds;
    let countdown = seconds;
    
    const interval = setInterval(() => {
      countdown--;
      this.elements.breathCounter.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);
    
    this.session.timers.push(interval);
  }
  
  skipRecovery() {
    if (!this.session.isRunning || !['inhaling', 'recovery', 'exhaling'].includes(this.session.phase)) return;
    this.clearTimers();
    this.elements.recoverySubtitle.style.display = 'none';
    this.elements.skipRecoveryBtn.style.display = 'none';
    this.completeRound();
  }
  
  completeRound() {
    if (this.session.currentRound >= this.config.rounds) {
      this.showResults();
    } else {
      this.session.currentRound++;
      setTimeout(() => this.startBreathingPhase(), 1000);
    }
  }
  
  showResults() {
    this.session.isRunning = false;
    this.showScreen('results');
    this.updateResultsContent();
  }
  
  finishSession() {
    this.session.isRunning = false;
    this.clearTimers();
    this.session.results.length ? this.showResults() : this.resetToConfig();
  }
  
  resetToConfig() {
    this.session = {
      currentRound: 1,
      currentBreath: 0,
      isRunning: false,
      phase: 'config',
      results: [],
      timers: []
    };
    this.clearTimers();
    this.showScreen('config');
    this.elements.progressFill.style.width = '0%';
  }
  
  clearTimers() {
    if (this.retentionInterval) clearInterval(this.retentionInterval);
    this.session.timers.forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.session.timers = [];
  }
  
  playTone(frequency, duration) {
    if (this.config.volume === 0) return;
    
    try {
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = this.config.volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + duration / 1000);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }
  
  vibrate(duration = 30) {
    if (this.config.volume > 0 && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  }
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  startPreviewAnimation() {
    if (this.previewActive) return;
    
    this.stopPreviewAnimation();
    this.previewBreathCount = 1;
    this.elements.previewCounter.textContent = this.previewBreathCount;
    this.previewActive = true;
    this.previewFirstCycle = true;
    
    const animate = () => {
      if (!this.previewActive || !this.elements.screens.config.classList.contains('active')) {
        this.stopPreviewAnimation();
        return;
      }
      
      const { inhale, exhale } = this.speedSettings[this.config.speed];
      
      if (!this.previewFirstCycle) {
        this.previewBreathCount++;
        this.elements.previewCounter.textContent = this.previewBreathCount;
      }
      this.previewFirstCycle = false;
      
      this.elements.previewHexagon.style.transition = `transform ${inhale}ms ease-in-out`;
      this.elements.previewHexagon.style.transform = 'scale(1.3)';
      
      this.previewTimers.inhale = setTimeout(() => {
        this.elements.previewHexagon.style.transition = `transform ${exhale}ms ease-in-out`;
        this.elements.previewHexagon.style.transform = 'scale(0.9)';
        
        this.previewTimers.exhale = setTimeout(animate, exhale);
      }, inhale);
    };
    
    this.previewAnimation = setTimeout(animate, 500);
  }
  
  stopPreviewAnimation() {
    this.previewActive = false;
    
    if (this.previewAnimation) {
      clearTimeout(this.previewAnimation);
      this.previewAnimation = null;
    }
    
    Object.values(this.previewTimers).forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    this.previewTimers = { inhale: null, exhale: null };
    
    this.elements.previewHexagon.style.transition = 'transform 0.3s';
    this.elements.previewHexagon.style.transform = 'scale(1)';
  }
  
  restartPreviewAnimation() {
    this.stopPreviewAnimation();
    setTimeout(() => this.startPreviewAnimation(), 100);
  }
}

new BubbleBreathingApp();