/**
 * File principale JavaScript per il progetto Musica AI
 * Coordina tutti i moduli e gestisce l'inizializzazione dell'applicazione
 */

class MusicAIApp {
    constructor() {
        // Riferimenti ai moduli
        this.graph = null;
        this.sequencer = null;
        this.infoBox = null;
        this.drawer = null;
        
        // Stato dell'applicazione
        this.isInitialized = false;
        this.modules = {
            graph: false,
            sequencer: false,
            infoBox: false,
            drawer: false
        };
        
        // Inizializza l'applicazione
        this.init();
    }
    
    /**
     * Inizializza l'applicazione
     */
    async init() {
        console.log('Inizializzazione Progetto Musica AI...');
        
        try {
            // PRIMA verifica la disponibilità dei DATI CRITICI
            await this.waitForCriticalData();
            
            // POI attende che tutti i moduli siano caricati
            await this.waitForModules();
            
            // Configura l'integrazione tra moduli
            this.setupModuleIntegration();
            
            // Configura event listeners globali
            this.setupGlobalEventListeners();
            
            // Mostra messaggio di benvenuto
            this.showWelcomeMessage();
            
            this.isInitialized = true;
            console.log('Progetto Musica AI inizializzato con successo!');
            
        } catch (error) {
            console.error('Errore durante l\'inizializzazione:', error);
            this.showCriticalError(`
                Errore di caricamento: ${error.message}
                <br><br>
                <button onclick="location.reload()">Ricarica la pagina</button>
            `);
        }
    }
    
    /**
     * Attende il caricamento dei dati CRITICI prima di tutto
     */
    async waitForCriticalData() {
        const requiredData = ['graphData', 'musicFacts'];
        const maxAttempts = 150;  // 15 secondi
        let attempts = 0;
        
        return new Promise((resolve, reject) => {
            const checkData = () => {
                attempts++;
                const missingData = requiredData.filter(data => !window[data]);
                
                if (missingData.length === 0) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error(`Dati mancanti: ${missingData.join(', ')}`));
                } else {
                    setTimeout(checkData, 100);
                }
            };
            
            checkData();
        });
    }
    


/**
     * Mostra errore CRITICO con opzioni di ripristino
     */
    showCriticalError(message) {
        // Rimuovi eventuali notifiche precedenti
        const oldNotification = document.getElementById('critical-error');
        if (oldNotification) oldNotification.remove();
        
        const errorNotification = document.createElement('div');
        errorNotification.id = 'critical-error';
        errorNotification.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.85);
                color: white;
                z-index: 10000;
                padding: 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                font-family: Arial, sans-serif;
            ">
                <h2 style="color: #ff4444; margin-bottom: 1.5rem;">ERRORE CRITICO</h2>
                <div style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 12px; max-width: 600px;">
                    ${message}
                </div>
                <div style="margin-top: 2rem;">
                    <button onclick="location.reload()" style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        font-size: 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                        margin: 0 10px;
                    ">Ricarica l'applicazione</button>
                    
                    <button onclick="localStorage.clear(); location.reload()" style="
                        background: #2196F3;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        font-size: 1rem;
                        border-radius: 6px;
                        cursor: pointer;
                        margin: 0 10px;
                    ">Ripristina e Ricarica</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorNotification);
    }

    /**
     * Attende che tutti i moduli siano disponibili
     */
    async waitForModules() {
        const requiredModules = {
            graph: 'graphVisualization',
            sequencer: 'stepSequencer',
            infoBox: 'infoBox',
            drawer: 'drawerManager'
        };
        
        const maxAttempts = 100;  // 10 secondi
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
        const checkModules = () => {
            attempts++;
            
            // Verifica disponibilità moduli
                let allReady = true;
                let missingModules = [];
                
                for (const [key, globalVar] of Object.entries(requiredModules)) {
                    const isReady = typeof window[globalVar] !== 'undefined';
                    this.modules[key] = isReady;
                    
                    if (!isReady) {
                        allReady = false;
                        missingModules.push(key);
                    }
                }
                
                if (allReady) {
                // Assegna riferimenti ai moduli
                this.graph = window.graphVisualization;
                this.sequencer = window.stepSequencer;
                this.infoBox = window.infoBox;
                this.drawer = window.drawerManager;
                
                resolve();
            } else if (attempts >= maxAttempts) {
                    reject(new Error(`Moduli mancanti: ${missingModules.join(', ')}`));
            } else {
                setTimeout(checkModules, 100);
            }
        };
        
        checkModules();
    });
}
    /**
     * Configura l'integrazione tra moduli
     */
    setupModuleIntegration() {
        // Integrazione Sequencer - Graph
        if (this.sequencer && this.graph) {
            // Quando il sequencer suona, evidenzia nodi musicali nel grafo
            this.setupSequencerGraphSync();
        }
        
        // Integrazione InfoBox - Graph
        if (this.infoBox && this.graph) {
            // Sincronizza le curiosità con i nodi del grafo quando possibile
            this.setupInfoBoxGraphSync();
        }
        
        // Integrazione generale
        this.setupCrossModuleCommunication();
    }
    
    /**
     * Sincronizza sequencer e grafo
     */
    setupSequencerGraphSync() {
        // Quando il sequencer è in riproduzione, anima il grafo
        const originalPlay = this.sequencer.play.bind(this.sequencer);
        const originalStop = this.sequencer.stop.bind(this.sequencer);
        
        this.sequencer.play = async function() {
            await originalPlay();
            // Attiva animazioni del grafo durante la riproduzione
            if (window.musicAIApp.graph && window.musicAIApp.graph.setAnimationMode) {
                window.musicAIApp.graph.setAnimationMode(true);
            }
        };
        
        this.sequencer.stop = function() {
            originalStop();
            // Disattiva animazioni del grafo
            if (window.musicAIApp.graph && window.musicAIApp.graph.setAnimationMode) {
                window.musicAIApp.graph.setAnimationMode(false);
            }
        };
    }
    
    /**
     * Sincronizza info box e grafo
     */
    setupInfoBoxGraphSync() {
        // Quando cambia la curiosità, evidenzia nodi correlati se possibile
        if (this.infoBox && this.graph) {
            const originalShowFact = this.infoBox.showCurrentFact.bind(this.infoBox);
            
            this.infoBox.showCurrentFact = function() {
                originalShowFact();
                
                // Cerca correlazioni tra curiosità e nodi del grafo
                const currentFact = this.facts[this.currentFactIndex];
                if (currentFact && window.musicAIApp.graph.highlightRelatedNodes) {
                    window.musicAIApp.graph.highlightRelatedNodes(currentFact.titolo);
                }
            };
        }
    }
    
    /**
     * Configura comunicazione tra moduli
     */
    setupCrossModuleCommunication() {
        // Event bus per comunicazione tra moduli
        window.musicAIEventBus = {
            events: {},
            
            on(event, callback) {
                if (!this.events[event]) {
                    this.events[event] = [];
                }
                this.events[event].push(callback);
            },
            
            emit(event, data) {
                if (this.events[event]) {
                    this.events[event].forEach(callback => callback(data));
                }
            },
            
            off(event, callback) {
                if (this.events[event]) {
                    this.events[event] = this.events[event].filter(cb => cb !== callback);
                }
            }
        };
    }
    
    /**
     * Configura event listeners globali
     */
    setupGlobalEventListeners() {
        // Gestione errori globali
        window.addEventListener('error', (e) => {
            console.error('Errore globale:', e.error);
            this.handleGlobalError(e.error);
        });
        
        // Gestione resize finestra
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
        
        // Gestione visibilità pagina
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Shortcuts da tastiera globali
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });
    }
    
    /**
     * Gestisce errori globali
     */
    handleGlobalError(error) {
        // Log dell'errore
        console.error('Errore nell\'applicazione:', error);
        
        // Mostra notifica all'utente se necessario
        if (error.message && !error.message.includes('Script error')) {
            this.showErrorMessage('Si è verificato un errore. Ricarica la pagina se il problema persiste.');
        }
    }
    
    /**
     * Gestisce il resize della finestra
     */
    handleWindowResize() {
        // Notifica i moduli del resize
        if (this.graph && this.graph.handleResize) {
            this.graph.handleResize();
        }
        
        // Emette evento per altri moduli
        if (window.musicAIEventBus) {
            window.musicAIEventBus.emit('windowResize', {
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
    }
    
    /**
     * Gestisce il cambio di visibilità della pagina
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pagina nascosta - pausa animazioni/suoni se necessario
            if (this.sequencer && this.sequencer.isPlaying) {
                this.sequencer.pause();
            }
            if (this.infoBox) {
                this.infoBox.pauseAutoRotation();
            }
        } else {
            // Pagina visibile - riprende operazioni
            if (this.infoBox) {
                this.infoBox.resumeAutoRotation();
            }
        }
    }
    
    /**
     * Gestisce shortcuts da tastiera globali
     */
    handleGlobalKeyboard(e) {
        // Evita interferenze con input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Shortcuts globali
        switch (e.key) {
            case 'Escape':
                // Ferma tutto
                if (this.sequencer && this.sequencer.isPlaying) {
                    this.sequencer.stop();
                }
                break;
                
            case 'h':
                // Mostra/nasconde help
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleHelp();
                }
                break;
        }
    }
    
    /**
     * Mostra messaggio di benvenuto
     */
    showWelcomeMessage() {
        console.log(`
🎵 Benvenuto nel Progetto Musica AI! 🎵

Moduli caricati:
- Grafo Interattivo: ${this.modules.graph ? '✅' : '❌'}
- Step Sequencer: ${this.modules.sequencer ? '✅' : '❌'}
- Box Informativo: ${this.modules.infoBox ? '✅' : '❌'}
- Drawer Controlli: ${this.modules.drawer ? '✅' : '❌'}

Esplora le connessioni tra creatività, AI e diritto d'autore!
        `);
    }
    
    /**
     * Mostra messaggio di errore
     */
    showErrorMessage(message) {
        // Crea notifica di errore se non esiste già
        let errorNotification = document.getElementById('error-notification');
        if (!errorNotification) {
            errorNotification = document.createElement('div');
            errorNotification.id = 'error-notification';
            errorNotification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(errorNotification);
        }
        
        errorNotification.textContent = message;
        errorNotification.style.display = 'block';
        
        // Nasconde dopo 5 secondi
        setTimeout(() => {
            if (errorNotification) {
                errorNotification.style.display = 'none';
            }
        }, 5000);
    }
    
    /**
     * Toggle help/istruzioni
     */
    toggleHelp() {
        // Implementazione base per help
        const helpText = `
Controlli del Progetto Musica AI:

🎹 Step Sequencer:
- Clicca sui quadrati per attivare/disattivare i suoni
- Play/Pause per controllare la riproduzione
- Regola il tempo con lo slider BPM

🔗 Grafo Interattivo:
- Clicca e trascina i nodi per esplorarli
- Usa i controlli nel drawer laterale
- Zoom con la rotella del mouse

📖 Curiosità Musicali:
- Cambiano automaticamente ogni 12 secondi
- Clicca la freccia per passare alla prossima
- Usa le frecce della tastiera per navigare

⌨️ Shortcuts:
- Spazio/Freccia Destra: Prossima curiosità
- Freccia Sinistra: Curiosità precedente
- Esc: Ferma tutto
- Ctrl+H: Mostra/nasconde questo aiuto
        `;
        
        alert(helpText);
    }
    
    /**
     * Ottiene lo stato dell'applicazione
     */
    getAppState() {
        return {
            isInitialized: this.isInitialized,
            modules: this.modules,
            sequencerPlaying: this.sequencer ? this.sequencer.isPlaying : false,
            currentFact: this.infoBox ? this.infoBox.currentFactIndex : 0
        };
    }
}

// Modifica della strategia di inizializzazione
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => window.musicAIApp = new MusicAIApp(), 100);
} else {
    window.addEventListener('load', () => {
        window.musicAIApp = new MusicAIApp();
    });

// Esporta per uso in altri moduli se necessario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicAIApp;
}
}