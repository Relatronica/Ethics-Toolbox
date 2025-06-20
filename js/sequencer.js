/**
 * Modulo Step Sequencer con Tone.js
 * Implementa un sequencer ritmico a 16 step con 4 tracce audio
 * Integrato con il design geometrico dark mode del progetto
 */

class StepSequencer {
    constructor() {
        // Configurazione sequencer
        this.steps = 16;
        this.tracks = 4;
        this.currentStep = 0;
        this.isPlaying = false;
        this.bpm = 120;
        
        // Pattern per ogni traccia (16 step per traccia)
        this.pattern = {
            kick: new Array(16).fill(false),
            snare: new Array(16).fill(false),
            hihat: new Array(16).fill(false),
            openhat: new Array(16).fill(false)
        };
        
        // Nomi delle tracce per l'interfaccia
        this.trackNames = ['kick', 'snare', 'hihat', 'openhat'];
        
        // Inizializza Tone.js
        this.initializeToneJS();
        
        // Crea l'interfaccia
        this.createInterface();
        
        // Configura event listeners
        this.setupEventListeners();
        
        // Pattern predefinito per demo
        this.loadDefaultPattern();
    }
    
    /**
     * Inizializza Tone.js e crea i sintetizzatori per i suoni
     */
    initializeToneJS() {
        // Imposta il tempo iniziale
        Tone.Transport.bpm.value = this.bpm;
        
        // Crea sintetizzatori per ogni traccia
        this.synths = {
            // Kick drum - suono grave e potente
            kick: new Tone.MembraneSynth({
                pitchDecay: 0.05,
                octaves: 10,
                oscillator: {
                    type: 'sine'
                },
                envelope: {
                    attack: 0.001,
                    decay: 0.4,
                    sustain: 0.01,
                    release: 1.4,
                    attackCurve: 'exponential'
                }
            }).toDestination(),
            
            // Snare drum - suono secco e incisivo
            snare: new Tone.NoiseSynth({
                noise: {
                    type: 'white'
                },
                envelope: {
                    attack: 0.005,
                    decay: 0.1,
                    sustain: 0.0,
                    release: 0.4
                }
            }).toDestination(),
            
            // Hi-hat chiuso - suono metallico breve
            hihat: new Tone.MetalSynth({
                frequency: 200,
                envelope: {
                    attack: 0.001,
                    decay: 0.1,
                    release: 0.01
                },
                harmonicity: 5.1,
                modulationIndex: 32,
                resonance: 4000,
                octaves: 1.5
            }).toDestination(),
            
            // Hi-hat aperto - suono metallico prolungato
            openhat: new Tone.MetalSynth({
                frequency: 200,
                envelope: {
                    attack: 0.001,
                    decay: 0.3,
                    release: 0.3
                },
                harmonicity: 5.1,
                modulationIndex: 32,
                resonance: 4000,
                octaves: 1.5
            }).toDestination()
        };
        
        // Crea il sequencer principale
        this.sequence = new Tone.Sequence((time, step) => {
            this.playStep(time, step);
        }, Array.from({length: 16}, (_, i) => i), '16n');
    }
    
    /**
     * Crea l'interfaccia grafica del sequencer
     */
    createInterface() {
        const container = document.getElementById('sequencer-grid');
        if (!container) {
            console.error('Container sequencer-grid non trovato');
            return;
        }
        
        // Pulisce il container
        container.innerHTML = '';
        
        // Crea la griglia di step
        for (let track = 0; track < this.tracks; track++) {
            for (let step = 0; step < this.steps; step++) {
                const stepElement = document.createElement('div');
                stepElement.className = 'sequencer-step';
                stepElement.dataset.track = track;
                stepElement.dataset.step = step;
                
                // Aggiunge tooltip con nome della traccia
                stepElement.title = `${this.trackNames[track].toUpperCase()} - Step ${step + 1}`;
                
                // Event listener per toggle step
                stepElement.addEventListener('click', () => {
                    this.toggleStep(track, step);
                });
                
                container.appendChild(stepElement);
            }
        }
        
        // Aggiorna la visualizzazione
        this.updateInterface();
    }
    
    /**
     * Configura gli event listeners per i controlli
     */
    setupEventListeners() {
        // Pulsante Play/Pause
        const playBtn = document.getElementById('playSequencer');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.togglePlayback();
            });
        }
        
        // Pulsante Stop
        const stopBtn = document.getElementById('stopSequencer');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stop();
            });
        }
        
        // Pulsante Clear
        const clearBtn = document.getElementById('clearSequencer');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearPattern();
            });
        }
        
        // Slider tempo
        const tempoSlider = document.getElementById('tempoSlider');
        const tempoValue = document.getElementById('tempoValue');
        if (tempoSlider && tempoValue) {
            tempoSlider.addEventListener('input', (e) => {
                this.bpm = parseInt(e.target.value);
                Tone.Transport.bpm.value = this.bpm;
                tempoValue.textContent = this.bpm;
            });
        }
    }
    
    /**
     * Toggle di uno step specifico
     */
    toggleStep(track, step) {
        const trackName = this.trackNames[track];
        this.pattern[trackName][step] = !this.pattern[trackName][step];
        this.updateInterface();
    }
    
    /**
     * Riproduce i suoni per lo step corrente
     */
    playStep(time, step) {
        // Aggiorna l'indicatore visuale dello step corrente
        this.currentStep = step;
        this.updateStepIndicator();
        
        // Riproduce i suoni attivi per questo step
        this.trackNames.forEach((trackName, trackIndex) => {
            if (this.pattern[trackName][step]) {
                this.triggerSound(trackName, time);
            }
        });
    }
    
    /**
     * Attiva il suono per una traccia specifica
     */
    triggerSound(trackName, time) {
        switch (trackName) {
            case 'kick':
                this.synths.kick.triggerAttackRelease('C2', '8n', time);
                break;
            case 'snare':
                this.synths.snare.triggerAttackRelease('8n', time);
                break;
            case 'hihat':
                this.synths.hihat.triggerAttackRelease('C4', '32n', time);
                break;
            case 'openhat':
                this.synths.openhat.triggerAttackRelease('C4', '8n', time);
                break;
        }
    }
    
    /**
     * Toggle playback del sequencer
     */
    async togglePlayback() {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }
    
    /**
     * Avvia la riproduzione
     */
    async play() {
        // Assicura che il contesto audio sia attivo
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        
        this.isPlaying = true;
        this.sequence.start();
        Tone.Transport.start();
        
        // Aggiorna il pulsante
        const playBtn = document.getElementById('playSequencer');
        if (playBtn) {
            playBtn.textContent = 'Pause';
            playBtn.classList.remove('btn-play');
            playBtn.classList.add('btn-pause');
        }
    }
    
    /**
     * Mette in pausa la riproduzione
     */
    pause() {
        this.isPlaying = false;
        Tone.Transport.pause();
        
        // Aggiorna il pulsante
        const playBtn = document.getElementById('playSequencer');
        if (playBtn) {
            playBtn.textContent = '▶ Play';
            playBtn.classList.remove('btn-pause');
            playBtn.classList.add('btn-play');
        }
        
        // Rimuove l'indicatore di step corrente
        this.clearStepIndicator();
    }
    
    /**
     * Ferma completamente la riproduzione
     */
    stop() {
        this.isPlaying = false;
        this.currentStep = 0;
        Tone.Transport.stop();
        
        // Aggiorna il pulsante
        const playBtn = document.getElementById('playSequencer');
        if (playBtn) {
            playBtn.textContent = '▶ Play';
            playBtn.classList.remove('btn-pause');
            playBtn.classList.add('btn-play');
        }
        
        // Rimuove l'indicatore di step corrente
        this.clearStepIndicator();
    }
    
    /**
     * Pulisce tutto il pattern
     */
    clearPattern() {
        this.trackNames.forEach(trackName => {
            this.pattern[trackName].fill(false);
        });
        this.updateInterface();
    }
    
    /**
     * Carica un pattern predefinito per demo
     */
    loadDefaultPattern() {
        // Pattern di esempio - ritmo house basic
        this.pattern.kick = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false];
        this.pattern.snare = [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false];
        this.pattern.hihat = [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false];
        this.pattern.openhat = [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true];
        
        this.updateInterface();
    }
    
    /**
     * Aggiorna l'interfaccia grafica
     */
    updateInterface() {
        const steps = document.querySelectorAll('.sequencer-step');
        steps.forEach(step => {
            const track = parseInt(step.dataset.track);
            const stepIndex = parseInt(step.dataset.step);
            const trackName = this.trackNames[track];
            
            if (this.pattern[trackName][stepIndex]) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    /**
     * Aggiorna l'indicatore dello step corrente
     */
    updateStepIndicator() {
        // Rimuove l'indicatore precedente
        this.clearStepIndicator();
        
        // Aggiunge l'indicatore al step corrente
        const currentSteps = document.querySelectorAll(`[data-step="${this.currentStep}"]`);
        currentSteps.forEach(step => {
            step.classList.add('playing');
        });
    }
    
    /**
     * Rimuove tutti gli indicatori di step corrente
     */
    clearStepIndicator() {
        const playingSteps = document.querySelectorAll('.sequencer-step.playing');
        playingSteps.forEach(step => {
            step.classList.remove('playing');
        });
    }
}

// Inizializza il sequencer quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verifica che Tone.js sia caricato
    if (typeof Tone === 'undefined') {
        console.error('Tone.js non è stato caricato correttamente');
        return;
    }
    
    // Crea l'istanza del sequencer
    window.stepSequencer = new StepSequencer();
    
    console.log('Step Sequencer inizializzato con successo');
});