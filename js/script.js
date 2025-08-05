// Nombre de la clase actualizado
class BubbleBreathingApp {
  constructor() {
    this.translations = {
      es: {
        // Título actualizado
        appTitle: "Bubble Breathing",
        finishBtn: "Finalizar",
        previewLabel: "Previsualización de respiración",
        speedSlow: "Lento",
        speedStandard: "Estándar",
        speedFast: "Rápido",
        roundsLabel: "Rondas:",
        breathsLabel: "Respiraciones:",
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
        // Título actualizado
        appTitle: "Bubble Breathing",
        finishBtn: "Finish",
        previewLabel: "Breathing Preview",
        speedSlow: "Slow",
        speedStandard: "Standard",
        speedFast: "Fast",
        roundsLabel: "Rounds:",
        breathsLabel: "Breaths:",
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
    
    // Clave de localStorage actualizada
    this.currentLanguage = localStorage.getItem('bubbleBreathingLanguage') || 'en';
    
    this.config = { speed: 'standard', rounds: 3, breaths: 30 };
    this.session = { currentRound: 1, currentBreath: 0, isRunning: false, phase: 'config', results: [], timers: [] };
    this.speedSettings = {
      slow:    { inhale: 2500, exhale: 1500 },
      standard:{ inhale: 2000, exhale: 1000 },
      fast:    { inhale: 1000, exhale: 1000 }
    };
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.previewAnimation = null;
    this.previewInhaleTimer = null;
    this.previewExhaleTimer = null;
    this.previewBreathCount = 1;
    this.previewActive = false;
    this.previewFirstCycle = true;
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
    // Clave de localStorage actualizada
    localStorage.setItem('bubbleBreathingLanguage', lang);
    this.updateLanguage();
  }
  
  // A partir de aquí, el resto del código JS es idéntico al anterior,
  // pero lo incluyo completo para que solo tengas que copiar y pegar.

  updateLanguage() {
    this.elements.langToggle.textContent = this.currentLanguage.toUpperCase();
    this.elements.langIndicator.textContent = this.t('langIndicator');
    this.elements.headerTitle.textContent = this.t('appTitle');
    this.elements.finishBtn.textContent = this.t('finishBtn');
    this.elements.previewLabel.textContent = this.t('previewLabel');
    this.elements.speedBtns[0].textContent = this.t('speedSlow');
    this.elements.speedBtns[1].textContent = this.t('speedStandard');
    this.elements.speedBtns[2].textContent = this.t('speedFast');
    document.querySelector('#roundsSlider').parentElement.querySelector('.slider-label').textContent = this.t('roundsLabel');
    document.querySelector('#breathsSlider').parentElement.querySelector('.slider-label').textContent = this.t('breathsLabel');
    this.elements.startButton.textContent = this.t('startBtn');
    this.updateRoundInfo();
    this.updateExerciseInstruction();
    this.elements.skipToRetentionBtn.textContent = this.t('skipToRetentionBtn');
    this.elements.skipRecoveryBtn.textContent = this.t('skipRecoveryBtn');
    this.elements.retentionInstruction.textContent = this.t('retentionInstruction');
    this.elements.retentionTapInstruction.textContent = this.t('tapInstruction');
    this.elements.resultsScreen.querySelector('.results-title').textContent = this.t('resultsTitle');
    this.elements.newSessionBtn.textContent = this.t('newSessionBtn');
    if (this.elements.screens.results.classList.contains('active') && this.session.results.length > 0) {
      this.updateResultsContent();
    }
  }
  
  updateRoundInfo() {
    if (this.elements.roundInfo) {
      this.elements.roundInfo.textContent = this.t('roundInfo', { 
        current: this.session.currentRound, 
        total: this.config.rounds 
      });
    }
    if (this.elements.retentionRoundInfo) {
      this.elements.retentionRoundInfo.textContent = this.t('roundInfo', { 
        current: this.session.currentRound, 
        total: this.config.rounds 
      });
    }
  }
  
  updateExerciseInstruction() {
    if (this.elements.exerciseInstruction) {
      this.elements.exerciseInstruction.textContent = this.t('exerciseInstruction', { 
        count: this.config.breaths 
      });
    }
  }
  
  updateResultsContent() {
    if (this.session.results.length === 0) return;
    const avg = Math.floor(this.session.results.reduce((a, r) => a + r.retentionTime, 0) / this.session.results.length);
    this.elements.resultsContent.innerHTML = this.session.results.map(r => 
      `<div class="result-item"><span>${this.t('roundLabel', { round: r.round })}</span><span>${this.formatTime(r.retentionTime)}</span></div>`
    ).join('') + 
    `<div class="result-item highlight"><span><strong>${this.t('averageLabel')}</strong></span><span><strong>${this.formatTime(avg)}</strong></span></div>`;
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
      roundsSlider: document.getElementById('roundsSlider'),
      roundsValue: document.getElementById('roundsValue'),
      breathsSlider: document.getElementById('breathsSlider'),
      breathsValue: document.getElementById('breathsValue'),
      speedBtns: document.querySelectorAll('.speed-btn'),
      startButton: document.getElementById('startButton'),
      roundInfo: document.getElementById('roundInfo'),
      exerciseInstruction: document.getElementById('exerciseInstruction'),
      exerciseHexagon: document.getElementById('exerciseHexagon'),
      breathCounter: document.getElementById('breathCounter'),
      retentionRoundInfo: document.getElementById('retentionRoundInfo'),
      retentionTimer: document.getElementById('retentionTimer'),
      retentionHexagon: document.getElementById('retentionHexagon'),
      retentionInstruction: document.getElementById('retentionInstruction'),
      retentionTapInstruction: document.getElementById('retentionTapInstruction'),
      resultsContent: document.getElementById('resultsContent'),
      newSessionBtn: document.getElementById('newSessionBtn'),
      previewHexagon: document.getElementById('previewHexagon'),
      previewCounter: document.getElementById('previewCounter'),
      recoverySubtitle: document.getElementById('recoverySubtitle'),
      skipToRetentionBtn: document.getElementById('skipToRetentionBtn'),
      skipRecoveryBtn: document.getElementById('skipRecoveryBtn'),
      langToggle: document.getElementById('langToggle'),
      langIndicator: document.getElementById('langIndicator'),
      previewLabel: document.querySelector('.preview-label')
    };
  }
  
  initEventListeners() {
    this.elements.langToggle.addEventListener('click', () => {
      const newLang = this.currentLanguage === 'es' ? 'en' : 'es';
      this.setLanguage(newLang);
    });
    this.elements.roundsSlider.addEventListener('input', e => { 
      this.config.rounds = +e.target.value; 
      this.elements.roundsValue.textContent = e.target.value; 
    });
    this.elements.breathsSlider.addEventListener('input', e => { 
      this.config.breaths = +e.target.value; 
      this.elements.breathsValue.textContent = e.target.value; 
      this.updateExerciseInstruction();
    });
    this.elements.speedBtns.forEach(btn => btn.addEventListener('click', () => { 
      this.elements.speedBtns.forEach(b => b.classList.remove('active')); 
      btn.classList.add('active'); 
      this.config.speed = btn.dataset.speed;
      this.restartPreviewAnimation();
    }));
    this.elements.startButton.addEventListener('click', () => this.startSession());
    this.elements.finishBtn.addEventListener('click', () => this.finishSession());
    this.elements.newSessionBtn.addEventListener('click', () => this.resetToConfig());
    this.elements.retentionHexagon.addEventListener('click', () => this.endRetention());
    this.elements.skipToRetentionBtn.addEventListener('click', () => this.skipToRetention());
    this.elements.skipRecoveryBtn.addEventListener('click', () => this.skipRecovery());
  }
  
  showScreen(name) { 
    Object.values(this.elements.screens).forEach(s => s.classList.remove('active')); 
    this.elements.screens[name].classList.add('active');
    if (name === 'config' || name === 'results') {
      this.elements.finishBtn.classList.add('hidden');
    } else {
      this.elements.finishBtn.classList.remove('hidden');
    }
    if (name === 'exercise') {
      if (this.session.phase === 'breathing') {
        this.elements.skipToRetentionBtn.style.display = 'block';
        this.elements.skipRecoveryBtn.style.display = 'none';
      } else if (this.session.phase === 'inhaling' || this.session.phase === 'recovery' || this.session.phase === 'exhaling') {
        this.elements.skipToRetentionBtn.style.display = 'none';
        this.elements.skipRecoveryBtn.style.display = 'block';
      } else {
        this.elements.skipToRetentionBtn.style.display = 'none';
        this.elements.skipRecoveryBtn.style.display = 'none';
      }
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
  
  updateProgress() { 
    const total = this.config.rounds * (this.config.breaths + 2); 
    const step = (this.session.currentRound - 1) * (this.config.breaths + 2) + (this.session.phase === 'breathing' ? this.session.currentBreath : this.session.phase === 'retention' ? this.config.breaths + 1 : this.session.phase === 'inhaling' ? this.config.breaths + 1.25 : this.session.phase === 'recovery' ? this.config.breaths + 1.5 : this.session.phase === 'exhaling' ? this.config.breaths + 1.75 : this.config.breaths + 2); 
    this.elements.progressFill.style.width = `${Math.min(100, (step / total) * 100)}%`; 
  }
  
  startSession() { 
    this.session = { currentRound: 1, currentBreath: 0, isRunning: true, phase: 'breathing', results: [], timers: [] }; 
    this.stopPreviewAnimation();
    this.showScreen('exercise'); 
    this.startBreathingPhase(); 
  }
  
  startBreathingPhase() { 
    this.session.phase = 'breathing'; 
    this.showScreen('exercise');
    this.session.currentBreath = 0; 
    this.updateRoundInfo();
    this.updateExerciseInstruction();
    this.elements.exerciseHexagon.className = 'hexagon phase-breathing'; 
    this.elements.recoverySubtitle.style.display = 'none';
    this.updateProgress(); 
    setTimeout(() => this.breathingCycle(), 500); 
  }
  
  playTone(freq, dur) { 
    const osc = this.audioCtx.createOscillator(); 
    const gain = this.audioCtx.createGain(); 
    osc.type = 'sine'; 
    osc.frequency.value = freq; 
    gain.gain.value = 0.05; 
    osc.connect(gain); 
    gain.connect(this.audioCtx.destination); 
    osc.start(); 
    osc.stop(this.audioCtx.currentTime + dur / 1000); 
  }
  
  vibrate(ms = 30) { if (navigator.vibrate) navigator.vibrate(ms); }
  
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
    setTimeout(() => {
      this.startRetentionPhase();
    }, 500);
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
    this.startInhalingPhase(); 
  }
  
  startInhalingPhase() { 
    this.session.phase = 'inhaling'; 
    this.showScreen('exercise'); 
    this.elements.exerciseInstruction.textContent = this.t('inhaleInstruction'); 
    this.elements.exerciseHexagon.className = 'hexagon phase-recovery'; 
    this.elements.breathCounter.textContent = '3'; 
    this.elements.recoverySubtitle.style.display = 'block';
    this.elements.recoverySubtitle.textContent = this.t('timeToInhale');
    this.updateProgress(); 
    let countdown = 3; 
    const inhalingInterval = setInterval(() => { 
      countdown--; 
      this.elements.breathCounter.textContent = countdown; 
      if (countdown <= 0) { 
        clearInterval(inhalingInterval); 
        this.startRecoveryPhase(); 
      } 
    }, 1000); 
    this.session.timers.push(inhalingInterval);
  }
  
  startRecoveryPhase() { 
    this.session.phase = 'recovery'; 
    this.showScreen('exercise'); 
    this.elements.exerciseInstruction.textContent = this.t('holdAirInstruction'); 
    this.elements.breathCounter.textContent = '15'; 
    this.elements.recoverySubtitle.style.display = 'none';
    this.updateProgress(); 
    let countdown = 15; 
    const recoveryInterval = setInterval(() => { 
      countdown--; 
      this.elements.breathCounter.textContent = countdown; 
      if (countdown <= 0) { 
        clearInterval(recoveryInterval); 
        this.startExhalingPhase(); 
      } 
    }, 1000); 
    this.session.timers.push(recoveryInterval);
  }
  
  skipRecovery() {
    if (!this.session.isRunning || (this.session.phase !== 'inhaling' && this.session.phase !== 'recovery' && this.session.phase !== 'exhaling')) return;
    this.clearTimers();
    this.elements.recoverySubtitle.style.display = 'none';
    this.elements.skipRecoveryBtn.style.display = 'none';
    this.completeRound();
  }
  
  startExhalingPhase() { 
    this.session.phase = 'exhaling'; 
    this.showScreen('exercise'); 
    this.elements.exerciseInstruction.textContent = this.t('releaseAirInstruction'); 
    this.elements.breathCounter.textContent = '3'; 
    this.elements.recoverySubtitle.style.display = 'block';
    this.elements.recoverySubtitle.textContent = this.t('timeToExhale');
    this.updateProgress(); 
    let countdown = 3; 
    const exhalingInterval = setInterval(() => { 
      countdown--; 
      this.elements.breathCounter.textContent = countdown; 
      if (countdown <= 0) { 
        clearInterval(exhalingInterval); 
        this.elements.recoverySubtitle.style.display = 'none';
        this.completeRound(); 
      } 
    }, 1000); 
    this.session.timers.push(exhalingInterval);
  }
  
  completeRound() { 
    if (this.session.currentRound >= this.config.rounds) this.showResults(); 
    else { 
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
    this.session = { currentRound: 1, currentBreath: 0, isRunning: false, phase: 'config', results: [], timers: [] }; 
    this.clearTimers(); 
    this.showScreen('config'); 
    this.elements.headerTitle.textContent = this.t('appTitle');
    this.elements.progressFill.style.width = '0%'; 
  }
  
  clearTimers() { 
    if (this.retentionInterval) clearInterval(this.retentionInterval); 
    this.session.timers.forEach(t => clearTimeout(t)); 
    this.session.timers = []; 
  }
  
  formatTime(sec) { 
    const m = Math.floor(sec / 60); 
    const s = sec % 60; 
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`; 
  }
  
  startPreviewAnimation() {
    if (this.previewActive) return;
    this.stopPreviewAnimation();
    this.previewBreathCount = 1;
    this.elements.previewCounter.textContent = this.previewBreathCount;
    this.previewActive = true;
    this.previewFirstCycle = true;
    const animatePreview = () => {
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
      if (this.previewInhaleTimer) {
        clearTimeout(this.previewInhaleTimer);
      }
      this.previewInhaleTimer = setTimeout(() => {
        this.elements.previewHexagon.style.transition = `transform ${exhale}ms ease-in-out`;
        this.elements.previewHexagon.style.transform = 'scale(0.9)';
        if (this.previewExhaleTimer) {
          clearTimeout(this.previewExhaleTimer);
        }
        this.previewExhaleTimer = setTimeout(animatePreview, exhale);
      }, inhale);
    };
    this.previewAnimation = setTimeout(animatePreview, 500);
  }
  
  stopPreviewAnimation() {
    this.previewActive = false;
    if (this.previewAnimation) {
      clearTimeout(this.previewAnimation);
      this.previewAnimation = null;
    }
    if (this.previewInhaleTimer) {
      clearTimeout(this.previewInhaleTimer);
      this.previewInhaleTimer = null;
    }
    if (this.previewExhaleTimer) {
      clearTimeout(this.previewExhaleTimer);
      this.previewExhaleTimer = null;
    }
    this.elements.previewHexagon.style.transition = 'transform 0.3s';
    this.elements.previewHexagon.style.transform = 'scale(1)';
  }
  
  restartPreviewAnimation() {
    this.stopPreviewAnimation();
    setTimeout(() => this.startPreviewAnimation(), 100);
  }
}

// Inicializamos la nueva clase
new BubbleBreathingApp();