/**
 * Modulo Drawer.js - Gestione Drawer Laterale e Controlli
 * Gestisce il drawer laterale sempre visibile con controlli per il grafo interattivo
 * e interfaccia utente per modificare parametri di visualizzazione
 */

class DrawerManager {
    constructor() {
        this.drawer = null;
        this.controls = {
            resetGraph: null,
            centerGraph: null,
            forceStrength: null,
            showPrimary: null,
            showSecondary: null
        };
        
        this.isInitialized = false;
        this.graphInstance = null;
        
        this.init();
    }
    
    /**
     * Inizializza il drawer e i controlli
     */
    init() {
        this.drawer = document.getElementById('drawer');
        if (!this.drawer) {
            console.error('Drawer non trovato nel DOM');
            return;
        }
        
        this.setupControls();
        this.bindEvents();
        this.setupGraphIntegration();
        
        this.isInitialized = true;
        console.log('DrawerManager inizializzato con successo');
    }
    
    /**
     * Configura i riferimenti ai controlli
     */
    setupControls() {
        // Controlli principali del grafo
        this.controls.resetGraph = document.getElementById('resetGraph');
        this.controls.centerGraph = document.getElementById('centerGraph');
        this.controls.forceStrength = document.getElementById('forceStrength');
        
        // Controlli filtri nodi
        this.controls.showPrimary = document.getElementById('showPrimary');
        this.controls.showSecondary = document.getElementById('showSecondary');
        
        // Verifica che tutti i controlli siano presenti
        const missingControls = Object.entries(this.controls)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
        
        if (missingControls.length > 0) {
            console.warn('Controlli mancanti nel drawer:', missingControls);
        }
        
        // Inizializza i valori dei controlli
        this.initializeControlValues();
    }
    
    /**
     * Inizializza i valori predefiniti dei controlli
     */
    initializeControlValues() {
        // Slider forza collegamenti
        if (this.controls.forceStrength) {
            this.controls.forceStrength.value = 1.0;
            this.updateForceStrengthDisplay(1.0);
        }
        
        // Checkbox filtri nodi (entrambi attivi di default)
        if (this.controls.showPrimary) {
            this.controls.showPrimary.checked = true;
        }
        
        if (this.controls.showSecondary) {
            this.controls.showSecondary.checked = true;
        }
    }
    
    /**
     * Collega gli eventi ai controlli
     */
    bindEvents() {
        // Pulsante Reset Vista
        if (this.controls.resetGraph) {
            this.controls.resetGraph.addEventListener('click', () => {
                this.handleResetGraph();
            });
        }
        
        // Pulsante Centra Grafo
        if (this.controls.centerGraph) {
            this.controls.centerGraph.addEventListener('click', () => {
                this.handleCenterGraph();
            });
        }
        
        // Slider Forza Collegamenti
        if (this.controls.forceStrength) {
            this.controls.forceStrength.addEventListener('input', (event) => {
                this.handleForceStrengthChange(parseFloat(event.target.value));
            });
        }
        
        // Checkbox Nodi Primari
        if (this.controls.showPrimary) {
            this.controls.showPrimary.addEventListener('change', () => {
                this.handleNodeFilterChange();
            });
        }
        
        // Checkbox Nodi Secondari
        if (this.controls.showSecondary) {
            this.controls.showSecondary.addEventListener('change', () => {
                this.handleNodeFilterChange();
            });
        }
        
        // Ascolta eventi personalizzati dal grafo
        document.addEventListener('nodeSelected', (event) => {
            this.handleNodeSelection(event.detail.node);
        });
    }
    
    /**
     * Configura l'integrazione con il grafo
     */
    setupGraphIntegration() {
        // Attende che il grafo sia inizializzato
        const checkGraphReady = () => {
            if (window.interactiveGraph) {
                this.graphInstance = window.interactiveGraph;
                console.log('Integrazione drawer-grafo completata');
                this.enableControls();
            } else {
                // Riprova dopo 100ms
                setTimeout(checkGraphReady, 100);
            }
        };
        
        checkGraphReady();
    }
    
    /**
     * Abilita i controlli quando il grafo è pronto
     */
    enableControls() {
        // Rimuove eventuali stati disabilitati
        Object.values(this.controls).forEach(control => {
            if (control && control.disabled) {
                control.disabled = false;
            }
        });
        
        // Aggiunge indicatori visivi di stato attivo
        this.drawer.classList.add('graph-ready');
    }
    
    /**
     * Gestisce il reset della vista del grafo
     */
    handleResetGraph() {
        if (!this.graphInstance) {
            console.warn('Grafo non ancora inizializzato');
            return;
        }
        
        try {
            this.graphInstance.resetView();
            this.showFeedback('Vista del grafo ripristinata', 'success');
            
            // Reset anche dei controlli ai valori predefiniti
            this.resetControlsToDefault();
            
        } catch (error) {
            console.error('Errore durante il reset del grafo:', error);
            this.showFeedback('Errore durante il reset', 'error');
        }
    }
    
    /**
     * Gestisce il centraggio del grafo
     */
    handleCenterGraph() {
        if (!this.graphInstance) {
            console.warn('Grafo non ancora inizializzato');
            return;
        }
        
        try {
            this.graphInstance.centerGraph();
            this.showFeedback('Grafo centrato', 'success');
            
        } catch (error) {
            console.error('Errore durante il centraggio del grafo:', error);
            this.showFeedback('Errore durante il centraggio', 'error');
        }
    }
    
    /**
     * Gestisce il cambio della forza dei collegamenti
     */
    handleForceStrengthChange(value) {
        if (!this.graphInstance) {
            console.warn('Grafo non ancora inizializzato');
            return;
        }
        
        try {
            this.graphInstance.updateForceStrength(value);
            this.updateForceStrengthDisplay(value);
            
        } catch (error) {
            console.error('Errore durante l\'aggiornamento della forza:', error);
        }
    }
    
    /**
     * Aggiorna la visualizzazione del valore della forza
     */
    updateForceStrengthDisplay(value) {
        // Cerca un elemento per mostrare il valore corrente
        let displayElement = document.querySelector('.force-strength-value');
        
        if (!displayElement) {
            // Crea l'elemento se non esiste
            displayElement = document.createElement('span');
            displayElement.className = 'force-strength-value';
            displayElement.style.marginLeft = '8px';
            displayElement.style.color = '#00d4ff';
            displayElement.style.fontWeight = 'bold';
            
            // Inserisce dopo lo slider
            if (this.controls.forceStrength && this.controls.forceStrength.parentNode) {
                this.controls.forceStrength.parentNode.appendChild(displayElement);
            }
        }
        
        displayElement.textContent = value.toFixed(1);
    }
    
    /**
     * Gestisce il cambio dei filtri dei nodi
     */
    handleNodeFilterChange() {
        if (!this.graphInstance) {
            console.warn('Grafo non ancora inizializzato');
            return;
        }
        
        const showPrimary = this.controls.showPrimary ? this.controls.showPrimary.checked : true;
        const showSecondary = this.controls.showSecondary ? this.controls.showSecondary.checked : true;
        
        try {
            this.graphInstance.filterNodes(showPrimary, showSecondary);
            
            // Feedback visivo
            const activeFilters = [];
            if (showPrimary) activeFilters.push('Primari');
            if (showSecondary) activeFilters.push('Secondari');
            
            const message = activeFilters.length > 0 
                ? `Visualizzando temi: ${activeFilters.join(', ')}`
                : 'Tutti i temi nascosti';
                
            this.showFeedback(message, 'info');
            
        } catch (error) {
            console.error('Errore durante il filtraggio dei temi:', error);
        }
    }
    
    /**
     * Gestisce la selezione di un nodo dal grafo
     */
    handleNodeSelection(node) {
        // Aggiorna l'interfaccia per mostrare informazioni sul nodo selezionato
        this.updateSelectedNodeInfo(node);
    }
    
    /**
     * Aggiorna le informazioni del nodo selezionato nel drawer
     */
    updateSelectedNodeInfo(node) {
        // Cerca o crea una sezione per le informazioni del nodo selezionato
        let infoSection = this.drawer.querySelector('.selected-node-info');
        
        if (!infoSection) {
            infoSection = document.createElement('div');
            infoSection.className = 'section selected-node-info';
            infoSection.innerHTML = `
                <h3>Concetto Selezionato</h3>
                <div class="selected-node-content">
                    <h4 class="node-name"></h4>
                    <p class="node-type"></p>
                    <p class="node-description"></p>
                </div>
            `;
            
            // Inserisce dopo la sezione informazioni
            const firstSection = this.drawer.querySelector('.section');
            if (firstSection) {
                firstSection.parentNode.insertBefore(infoSection, firstSection); // inserisce PRIMA della prima sezione
            } else {
                this.drawer.appendChild(infoSection); // se non ci sono sezioni, lo aggiunge alla fine
            }
        }
        
        // Aggiorna il contenuto
        const nameElement = infoSection.querySelector('.node-name');
        const typeElement = infoSection.querySelector('.node-type');
        const descriptionElement = infoSection.querySelector('.node-description');
        
        if (nameElement) nameElement.textContent = node.name;
        if (typeElement) {
            typeElement.textContent = `Tipo: ${node.type === 'primary' ? 'Tema Centrale' : 'Concetto Correlato'}`;
        }
        if (descriptionElement) descriptionElement.textContent = node.description;
        
        // Evidenzia visivamente la sezione
        infoSection.style.border = '2px solid #00d4ff';
        infoSection.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
        
        // Rimuove l'evidenziazione dopo qualche secondo
        setTimeout(() => {
            infoSection.style.border = '';
            infoSection.style.backgroundColor = '';
        }, 3000);
    }
    
    /**
     * Ripristina i controlli ai valori predefiniti
     */
    resetControlsToDefault() {
        // Reset slider forza
        if (this.controls.forceStrength) {
            this.controls.forceStrength.value = 1.0;
            this.updateForceStrengthDisplay(1.0);
        }
        
        // Reset checkbox filtri
        if (this.controls.showPrimary) {
            this.controls.showPrimary.checked = true;
        }
        
        if (this.controls.showSecondary) {
            this.controls.showSecondary.checked = true;
        }
        
        // Applica i filtri
        this.handleNodeFilterChange();
    }
    
    /**
     * Mostra feedback visivo all'utente
     */
    showFeedback(message, type = 'info') {
        // Cerca o crea un elemento per il feedback
        let feedbackElement = document.querySelector('.drawer-feedback');
        
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'drawer-feedback';
            feedbackElement.style.position = 'fixed';
            feedbackElement.style.top = '20px';
            feedbackElement.style.left = '340px'; // Dopo il drawer
            feedbackElement.style.padding = '8px 16px';
            feedbackElement.style.borderRadius = '4px';
            feedbackElement.style.fontSize = '14px';
            feedbackElement.style.fontWeight = 'bold';
            feedbackElement.style.zIndex = '10001';
            feedbackElement.style.transition = 'all 0.3s ease';
            feedbackElement.style.opacity = '0';
            feedbackElement.style.transform = 'translateY(-10px)';
            
            document.body.appendChild(feedbackElement);
        }
        
        // Configura lo stile in base al tipo
        const styles = {
            success: { background: '#00ff88', color: '#000000' },
            error: { background: '#ff4444', color: '#ffffff' },
            info: { background: '#00d4ff', color: '#000000' },
            warning: { background: '#ffaa00', color: '#000000' }
        };
        
        const style = styles[type] || styles.info;
        feedbackElement.style.backgroundColor = style.background;
        feedbackElement.style.color = style.color;
        feedbackElement.textContent = message;
        
        // Mostra il feedback
        feedbackElement.style.opacity = '1';
        feedbackElement.style.transform = 'translateY(0)';
        
        // Nasconde dopo 3 secondi
        setTimeout(() => {
            feedbackElement.style.opacity = '0';
            feedbackElement.style.transform = 'translateY(-10px)';
        }, 3000);
    }
    
    /**
     * Metodi pubblici per l'integrazione esterna
     */
    
    /**
     * Aggiorna lo stato del drawer
     */
    updateDrawerState(state) {
        if (state.graphReady !== undefined) {
            if (state.graphReady) {
                this.enableControls();
            }
        }
    }
    
    /**
     * Ottiene lo stato corrente dei controlli
     */
    getControlsState() {
        return {
            forceStrength: this.controls.forceStrength ? parseFloat(this.controls.forceStrength.value) : 1.0,
            showPrimary: this.controls.showPrimary ? this.controls.showPrimary.checked : true,
            showSecondary: this.controls.showSecondary ? this.controls.showSecondary.checked : true
        };
    }
    
    /**
     * Imposta lo stato dei controlli
     */
    setControlsState(state) {
        if (state.forceStrength !== undefined && this.controls.forceStrength) {
            this.controls.forceStrength.value = state.forceStrength;
            this.handleForceStrengthChange(state.forceStrength);
        }
        
        if (state.showPrimary !== undefined && this.controls.showPrimary) {
            this.controls.showPrimary.checked = state.showPrimary;
        }
        
        if (state.showSecondary !== undefined && this.controls.showSecondary) {
            this.controls.showSecondary.checked = state.showSecondary;
        }
        
        this.handleNodeFilterChange();
    }
}

// Inizializzazione del drawer quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    // Crea l'istanza del gestore del drawer
    window.drawerManager = new DrawerManager();
    
    console.log('DrawerManager inizializzato e pronto');
});