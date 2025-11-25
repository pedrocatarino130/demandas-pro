/**
 * TASK-016: Timer Pomodoro Integrado
 * 
 * Cronômetro para sessões de estudo com:
 * - Timer configurável (25min padrão)
 * - Pausa/Resume
 * - Som ao finalizar
 * - Auto-save progresso
 * - Modo foco
 */

class PomodoroTimer {
    constructor(options = {}) {
        this.duration = options.duration || 25 * 60; // 25 minutos em segundos
        this.shortBreak = options.shortBreak || 5 * 60; // 5 minutos
        this.longBreak = options.longBreak || 15 * 60; // 15 minutos
        this.autoSaveInterval = options.autoSaveInterval || 5 * 60; // 5 minutos
        
        this.timeRemaining = this.duration;
        this.isRunning = false;
        this.isPaused = false;
        this.mode = 'work'; // 'work', 'shortBreak', 'longBreak'
        this.pomodorosCompleted = 0;
        
        this.intervalId = null;
        this.autoSaveId = null;
        this.startTime = null;
        this.pausedTime = 0;
        
        this.onTick = options.onTick || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onAutoSave = options.onAutoSave || (() => {});
        
        this._createUI();
        this._attachEvents();
    }

    /**
     * Cria interface do timer
     */
    _createUI() {
        this.container = document.createElement('div');
        this.container.className = 'pomodoro-timer';
        this.container.innerHTML = `
            <div class="pomodoro-container">
                <div class="pomodoro-display">
                    <div class="pomodoro-time" id="pomodoroTime">25:00</div>
                    <div class="pomodoro-mode" id="pomodoroMode">Trabalho</div>
                </div>
                
                <div class="pomodoro-controls">
                    <button class="pomodoro-btn" id="pomodoroStart">▶️ Iniciar</button>
                    <button class="pomodoro-btn" id="pomodoroPause" style="display:none">⏸️ Pausar</button>
                    <button class="pomodoro-btn" id="pomodoroReset">🔄 Resetar</button>
                    <button class="pomodoro-btn" id="pomodoroSkip">⏭️ Pular</button>
                </div>
                
                <div class="pomodoro-settings">
                    <label>
                        Duração (min):
                        <input type="number" id="pomodoroDuration" value="25" min="1" max="60">
                    </label>
                    <button class="pomodoro-btn-small" id="pomodoroFocusMode">🎯 Modo Foco</button>
                </div>
                
                <div class="pomodoro-stats">
                    <div class="pomodoro-stat">
                        <span class="pomodoro-stat-label">Pomodoros:</span>
                        <span class="pomodoro-stat-value" id="pomodoroCount">0</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Anexa eventos
     */
    _attachEvents() {
        const startBtn = this.container.querySelector('#pomodoroStart');
        const pauseBtn = this.container.querySelector('#pomodoroPause');
        const resetBtn = this.container.querySelector('#pomodoroReset');
        const skipBtn = this.container.querySelector('#pomodoroSkip');
        const focusBtn = this.container.querySelector('#pomodoroFocusMode');
        const durationInput = this.container.querySelector('#pomodoroDuration');

        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.pause());
        resetBtn.addEventListener('click', () => this.reset());
        skipBtn.addEventListener('click', () => this.skip());
        focusBtn.addEventListener('click', () => this.toggleFocusMode());
        
        durationInput.addEventListener('change', (e) => {
            const minutes = parseInt(e.target.value);
            if (minutes > 0 && minutes <= 60) {
                this.setDuration(minutes * 60);
            }
        });
    }

    /**
     * Inicia o timer
     */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now() - this.pausedTime;
        
        this.intervalId = setInterval(() => {
            this._tick();
        }, 1000);

        // Auto-save
        this.autoSaveId = setInterval(() => {
            this._autoSave();
        }, this.autoSaveInterval * 1000);

        this._updateUI();
        this._tick(); // Primeiro tick imediato
    }

    /**
     * Pausa o timer
     */
    pause() {
        if (!this.isRunning || this.isPaused) return;

        this.isPaused = true;
        this.pausedTime = Date.now() - this.startTime;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this._updateUI();
    }

    /**
     * Resume o timer
     */
    resume() {
        if (!this.isPaused) return;

        this.isPaused = false;
        this.startTime = Date.now() - this.pausedTime;
        
        this.intervalId = setInterval(() => {
            this._tick();
        }, 1000);

        this._updateUI();
    }

    /**
     * Reseta o timer
     */
    reset() {
        this.stop();
        this.timeRemaining = this.duration;
        this.pausedTime = 0;
        this._updateUI();
    }

    /**
     * Para o timer
     */
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        if (this.autoSaveId) {
            clearInterval(this.autoSaveId);
            this.autoSaveId = null;
        }
        
        this.startTime = null;
        this.pausedTime = 0;
    }

    /**
     * Pula para o próximo modo
     */
    skip() {
        this.stop();
        
        if (this.mode === 'work') {
            this.pomodorosCompleted++;
            // Alternar entre short e long break
            if (this.pomodorosCompleted % 4 === 0) {
                this.mode = 'longBreak';
                this.timeRemaining = this.longBreak;
            } else {
                this.mode = 'shortBreak';
                this.timeRemaining = this.shortBreak;
            }
        } else {
            this.mode = 'work';
            this.timeRemaining = this.duration;
        }
        
        this._updateUI();
    }

    /**
     * Tick do timer
     */
    _tick() {
        if (!this.isRunning || this.isPaused) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.timeRemaining = Math.max(0, this.duration - elapsed);

        this._updateUI();
        this.onTick(this.timeRemaining, this.mode);

        if (this.timeRemaining <= 0) {
            this._complete();
        }
    }

    /**
     * Completa o timer
     */
    _complete() {
        this.stop();
        
        if (this.mode === 'work') {
            this.pomodorosCompleted++;
        }
        
        this._playSound();
        this.onComplete(this.mode, this.pomodorosCompleted);
        
        // Auto-iniciar break se configurado
        // Por enquanto, apenas notifica
        this._updateUI();
    }

    /**
     * Auto-save do progresso
     */
    _autoSave() {
        if (!this.isRunning || this.isPaused) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const progress = {
            timeRemaining: this.timeRemaining,
            elapsed: elapsed,
            mode: this.mode,
            timestamp: new Date().toISOString()
        };

        this.onAutoSave(progress);
    }

    /**
     * Atualiza UI
     */
    _updateUI() {
        const timeEl = this.container.querySelector('#pomodoroTime');
        const modeEl = this.container.querySelector('#pomodoroMode');
        const startBtn = this.container.querySelector('#pomodoroStart');
        const pauseBtn = this.container.querySelector('#pomodoroPause');
        const countEl = this.container.querySelector('#pomodoroCount');

        // Atualizar tempo
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        timeEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Atualizar modo
        const modeText = {
            'work': 'Trabalho',
            'shortBreak': 'Pausa Curta',
            'longBreak': 'Pausa Longa'
        };
        modeEl.textContent = modeText[this.mode] || 'Trabalho';

        // Atualizar botões
        if (this.isRunning && !this.isPaused) {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        } else {
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
        }

        // Atualizar contador
        countEl.textContent = this.pomodorosCompleted;

        // Adicionar classe de warning quando < 1 minuto
        timeEl.classList.toggle('warning', this.timeRemaining < 60);
    }

    /**
     * Toggle modo foco
     */
    toggleFocusMode() {
        const isFocus = document.body.classList.toggle('focus-mode');
        const btn = this.container.querySelector('#pomodoroFocusMode');
        btn.textContent = isFocus ? '👁️ Sair do Foco' : '🎯 Modo Foco';
    }

    /**
     * Define duração
     */
    setDuration(seconds) {
        if (this.isRunning) {
            console.warn('Não é possível alterar duração enquanto o timer está rodando');
            return;
        }
        
        this.duration = seconds;
        this.timeRemaining = seconds;
        this._updateUI();
    }

    /**
     * Toca som de conclusão
     */
    _playSound() {
        // Criar audio context para tocar som
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.warn('Não foi possível tocar som', e);
        }
    }

    /**
     * Obtém elemento do container
     */
    getElement() {
        return this.container;
    }

    /**
     * Destrói o timer
     */
    destroy() {
        this.stop();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Export ES6
export { PomodoroTimer };
export default PomodoroTimer;

// Export para uso global (compatibilidade)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PomodoroTimer;
}


