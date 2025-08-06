// Aplicación de Respiración Bubble optimizada
class BubbleBreathingApp {
  constructor() {
    this.translations = {
      es: {
        appTitle: "Bubble Breathing",
        finishBtn: "Finalizar",
        previewLabel: "Previsualización de respiración",
        speedSlow: "Lento",
        speedStandard: "Estándar",
        speedFast: "Rápido",
        roundsLabel: "Rondas:",
        breathsLabel: "Respiraciones:",
        volumeLabel: "Volumen:",
        startBtn: "Comenzar",
        roundInfo: "Ronda {current} / {total}",
        exerciseInstruction: "Toma {count} respiraciones profundas",
        skipToRetentionBtn: "Saltar a apnea",
        skipRecoveryBtn: "Saltar recuperación",
        retentionInstruction: "Contén la respiración",
        tapInstruction: "Toca cuando necesites respirar",
        resultsTitle: "Resultados de la sesión",
        roundLabel: "Ronda {round}",
        averageLabel: "Promedio",
        newSessionBtn: "Nueva sesión",
        inhaleInstruction: "Inhala",
        holdAirInstruction: "Retén el aire",
        releaseAirInstruction: "Suelta el aire",
        timeToInhale: "Tiempo para inhalar",
        timeToExhale: "Tiempo para exhalar",
        langIndicator: "Cambiar idioma"
      },
      en: {
        appTitle: "Bubble Breathing",
        finishBtn: "Finish",
        previewLabel: "Breathing Preview",
        speedSlow: "Slow",
        speedStandard: "Standard",
        speedFast: "Fast",
        roundsLabel: "Rounds:",
        breathsLabel: "Breaths:",
        volumeLabel: "Volume:",
        startBtn: "Start",
        roundInfo: "Round {current} / {total}",
        exerciseInstruction: "Take {count} deep breaths",
        skipToRetentionBtn: "Skip to breath hold",
        skipRecoveryBtn: "Skip recovery",
        retentionInstruction: "Hold your breath",
        tapInstruction: "Tap when you need to breathe",
        resultsTitle: "Session Results",
        roundLabel: "Round {round}",
        averageLabel: "Average",
        newSessionBtn: "New Session",
        inhaleInstruction: "Inhale",
        holdAirInstruction: "Hold the air",
        releaseAirInstruction: "Release the air",
        timeToInhale: "Time to inhale",
        timeToExhale: "Time to exhale",
        langIndicator: "Change language"
      }
    };
    
    this.currentLanguage = localStorage.getItem('bubbleBreathingLanguage') || 'en';
    this.config = { speed: 'standard', rounds: 3, breaths: 30, volume: 0.25 };
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
  
  init() {
    this.initElements();
    this.initEventListeners();
    this.updateLanguage();
    this.startPreviewAnimation();
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
  }

  updateLanguage() {
    const elements = this.elements;
    
    // Header y navegación
    elements.langToggle.textContent = this.currentLanguage.toUpperCase();
    elements.langIndicator.textContent = this.t('langIndicator');
    elements.headerTitle.textContent = this.t('appTitle');
    elements.finishBtn.textContent = this.t('finishBtn');
    
    // Pantalla de configuración
    elements.previewLabel.textContent = this.t('previewLabel');
    elements.speedBtns[0].textContent = this.t('speedSlow');
    elements.speedBtns[1].textContent = this.t('speedStandard');
    elements.speedBtns[2].textContent = this.t('speedFast');
    document.querySelector('#roundsSlider').parentElement.querySelector('.slider-label').textContent = this.t('roundsLabel');
    document.querySelector('#breathsSlider').parentElement.querySelector('.slider-label').textContent = this.t('breathsLabel');
    document.querySelector('#volumeSlider').parentElement.querySelector('.slider-label').textContent = this.t('volumeLabel');
    elements.startButton.textContent = this.t('startBtn');
    
    // Pantalla de ejercicio
    this.updateRoundInfo();
    this.updateExerciseInstruction();
    elements.skipToRetentionBtn.textContent = this.t('skipToRetentionBtn');
    elements.skipRecoveryBtn.textContent = this.t('skipRecoveryBtn');
    
    // Pantalla de retención
    elements.retentionInstruction.textContent = this.t('retentionInstruction');
    elements.retentionTapInstruction.textContent = this.t('tapInstruction');
    
    // Pantalla de resultados
    elements.resultsScreen.querySelector('.results-title').textContent = this.t('resultsTitle');
    elements.newSessionBtn.textContent = this.t('newSessionBtn');
    
    if (elements.screens.results.classList.contains('active') && this.session.results.length > 0) {
      this.updateResultsContent();
    }
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
      langToggle: document.getElementById('langToggle'),
      langIndicator: document.getElementById('langIndicator'),
      
      // Config screen
      previewHexagon: document.getElementById('previewHexagon'),
      previewCounter: document.getElementById('previewCounter'),
      previewLabel: document.querySelector('.preview-label'),
      speedBtns: document.querySelectorAll('.speed-btn'),
      roundsSlider: document.getElementById('roundsSlider'),
      roundsValue: document.getElementById('roundsValue'),
      breathsSlider: document.getElementById('breathsSlider'),
      breathsValue: document.getElementById('breathsValue'),
      volumeSlider: document.getElementById('volumeSlider'),
      volumeValue: document.getElementById('volumeValue'),
      startButton: document.getElementById('startButton'),
      
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
      resultsScreen: document.getElementById('resultsScreen')
    };
  }
  
  initEventListeners() {
    // Idioma
    this.elements.langToggle.addEventListener('click', () => {
      this.setLanguage(this.currentLanguage === 'es' ? 'en' : 'es');
    });
    
    // Configuración
    this.elements.roundsSlider.addEventListener('input', e => {
      this.config.rounds = +e.target.value;
      this.elements.roundsValue.textContent = e.target.value;
    });
    
    this.elements.breathsSlider.addEventListener('input', e => {
      this.config.breaths = +e.target.value;
      this.elements.breathsValue.textContent = e.target.value;
      this.updateExerciseInstruction();
    });
    
    this.elements.volumeSlider.addEventListener('input', e => {
      this.config.volume = +e.target.value;
      this.elements.volumeValue.textContent = Math.round(e.target.value * 100);
      // Previsualización del sonido
      this.playTone(220, 200);
    });
    
    this.elements.speedBtns.forEach(btn => btn.addEventListener('click', () => {
      this.elements.speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.config.speed = btn.dataset.speed;
      this.restartPreviewAnimation();
    }));
    
    // Navegación
    this.elements.startButton.addEventListener('click', () => this.startSession());
    this.elements.finishBtn.addEventListener('click', () => this.finishSession());
    this.elements.newSessionBtn.addEventListener('click', () => this.resetToConfig());
    
    // Ejercicio
    this.elements.retentionHexagon.addEventListener('click', () => this.endRetention());
    this.elements.skipToRetentionBtn.addEventListener('click', () => this.skipToRetention());
    this.elements.skipRecoveryBtn.addEventListener('click', () => this.skipRecovery());
  }
  
  showScreen(name) {
    Object.values(this.elements.screens).forEach(s => s.classList.remove('active'));
    this.elements.screens[name].classList.add('active');
    
    // Mostrar/ocultar botón finish
    const showFinish = name !== 'config' && name !== 'results';
    this.elements.finishBtn.classList.toggle('hidden', !showFinish);
    
    // Manejar botones de skip
    if (name === 'exercise') {
      this.updateSkipButtons();
    } else {
      this.elements.skipToRetentionBtn.style.display = 'none';
      this.elements.skipRecoveryBtn.style.display = 'none';
    }
    
    // Manejar animación de preview
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
  
  // Métodos de sesión
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
    
    // Resetear la escala del hexágono para cada nueva ronda
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
    this.playTone(220, 200);
    this.vibrate();
    
    // Animación de inhalación
    this.elements.exerciseHexagon.style.transition = `transform ${inhale}ms ease-in-out`;
    this.elements.exerciseHexagon.style.transform = 'scale(1.3)';
    
    const inhaleTimer = setTimeout(() => {
      // Animación de exhalación
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
    setTimeout(() => this.startRetentionPhase(), 500);
  }
  
  startRetentionPhase() {
    this.session.phase = 'retention';
    this.session.retentionStart = Date.now();
    this.showScreen('retention');
    this.updateRoundInfo();
    this.updateProgress();
    
    this.retentionInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.session.retentionStart) / 1000);
      this.elements.retentionTimer.textContent = this.formatTime(elapsed);
    }, 100);
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
  
  // Métodos de utilidad
  clearTimers() {
    if (this.retentionInterval) clearInterval(this.retentionInterval);
    this.session.timers.forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.session.timers = [];
  }
  
  playTone(frequency, duration) {
    try {
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = this.config.volume; // Usa el volumen configurado
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(this.audioCtx.currentTime + duration / 1000);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }
  
  vibrate(duration = 30) {
    if (navigator.vibrate) navigator.vibrate(duration);
  }
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Animación de preview
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
      
      // Inhalación
      this.elements.previewHexagon.style.transition = `transform ${inhale}ms ease-in-out`;
      this.elements.previewHexagon.style.transform = 'scale(1.3)';
      
      this.previewTimers.inhale = setTimeout(() => {
        // Exhalación
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

// Inicializar la aplicación
new BubbleBreathingApp();