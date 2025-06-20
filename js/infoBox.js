/**
 * Modulo Info Box per Curiosità Musicali
 * Gestisce la visualizzazione randomica delle curiosità musicali verificate
 * Integrato con il design geometrico dark mode del progetto
 */

class InfoBox {
    constructor() {
        // Verifica che i dati musicFacts siano disponibili
        if (typeof musicFacts === 'undefined') {
            console.error('musicFacts non è disponibile. Assicurati che musicFacts.js sia caricato.');
            return;
        }
        
        // Configurazione
        this.facts = musicFacts;
        this.currentFactIndex = 0;
        this.autoRotateInterval = null;
        this.autoRotateDelay = 12000; // 12 secondi
        this.isAutoRotating = true;
        
        // Elementi DOM
        this.infoBox = null;
        this.factTitle = null;
        this.factDescription = null;
        this.nextButton = null;
        
        // Inizializza il modulo
        this.init();
    }
    
    /**
     * Inizializza il modulo Info Box
     */
    init() {
        // Trova gli elementi DOM
        this.findDOMElements();
        
        if (!this.validateDOMElements()) {
            console.error('Elementi DOM del Info Box non trovati');
            return;
        }
        
        // Configura event listeners
        this.setupEventListeners();
        
        // Mescola i fatti per ordine casuale
        this.shuffleFacts();
        
        // Mostra il primo fatto
        this.showCurrentFact();
        
        // Avvia la rotazione automatica
        this.startAutoRotation();
        
        console.log('Info Box inizializzato con', this.facts.length, 'curiosità musicali');
    }
    
    /**
     * Trova gli elementi DOM necessari
     */
    findDOMElements() {
        this.infoBox = document.getElementById('infoBox');
        this.factTitle = document.getElementById('factTitle');
        this.factDescription = document.getElementById('factDescription');
        this.nextButton = document.getElementById('nextFact');
    }
    
    /**
     * Valida che tutti gli elementi DOM siano presenti
     */
    validateDOMElements() {
        return this.infoBox && this.factTitle && this.factDescription && this.nextButton;
    }
    
    /**
     * Configura gli event listeners
     */
    setupEventListeners() {
        // Pulsante next per navigazione manuale
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextFact();
            });
        }
        
        // Pausa auto-rotazione quando si passa il mouse sopra
        if (this.infoBox) {
            this.infoBox.addEventListener('mouseenter', () => {
                this.pauseAutoRotation();
            });
            
            this.infoBox.addEventListener('mouseleave', () => {
                this.resumeAutoRotation();
            });
        }
        
        // Supporto per navigazione da tastiera
        document.addEventListener('keydown', (e) => {
            // Freccia destra o spazio per prossimo fatto
            if (e.key === 'ArrowRight' || e.key === ' ') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.nextFact();
                }
            }
            // Freccia sinistra per fatto precedente
            else if (e.key === 'ArrowLeft') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.previousFact();
                }
            }
        });
    }
    
    /**
     * Mescola l'array dei fatti per ordine casuale
     */
    shuffleFacts() {
        // Algoritmo Fisher-Yates per mescolamento casuale
        for (let i = this.facts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.facts[i], this.facts[j]] = [this.facts[j], this.facts[i]];
        }
    }
    
    /**
     * Mostra il fatto corrente
     */
    showCurrentFact() {
        if (!this.facts || this.facts.length === 0) {
            this.showError('Nessuna curiosità disponibile');
            return;
        }
        
        const currentFact = this.facts[this.currentFactIndex];
        
        if (!currentFact) {
            this.showError('Curiosità non trovata');
            return;
        }
        
        // Animazione di fade out
        this.fadeOut(() => {
            // Aggiorna il contenuto
            if (this.factTitle) {
                this.factTitle.textContent = currentFact.titolo;
            }
            
            if (this.factDescription) {
                this.factDescription.textContent = currentFact.descrizione;
            }
            
            // Animazione di fade in
            this.fadeIn();
        });
    }
    
    /**
     * Mostra un messaggio di errore
     */
    showError(message) {
        if (this.factTitle) {
            this.factTitle.textContent = 'Errore';
        }
        
        if (this.factDescription) {
            this.factDescription.textContent = message;
        }
    }
    
    /**
     * Passa al prossimo fatto
     */
    nextFact() {
        this.currentFactIndex = (this.currentFactIndex + 1) % this.facts.length;
        this.showCurrentFact();
        
        // Riavvia il timer di auto-rotazione
        this.restartAutoRotation();
    }
    
    /**
     * Passa al fatto precedente
     */
    previousFact() {
        this.currentFactIndex = this.currentFactIndex === 0 
            ? this.facts.length - 1 
            : this.currentFactIndex - 1;
        this.showCurrentFact();
        
        // Riavvia il timer di auto-rotazione
        this.restartAutoRotation();
    }
    
    /**
     * Avvia la rotazione automatica
     */
    startAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
        }
        
        this.autoRotateInterval = setInterval(() => {
            if (this.isAutoRotating) {
                this.nextFact();
            }
        }, this.autoRotateDelay);
    }
    
    /**
     * Ferma la rotazione automatica
     */
    stopAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
    
    /**
     * Mette in pausa la rotazione automatica
     */
    pauseAutoRotation() {
        this.isAutoRotating = false;
    }
    
    /**
     * Riprende la rotazione automatica
     */
    resumeAutoRotation() {
        this.isAutoRotating = true;
    }
    
    /**
     * Riavvia il timer di rotazione automatica
     */
    restartAutoRotation() {
        this.stopAutoRotation();
        this.startAutoRotation();
    }
    
    /**
     * Animazione fade out
     */
    fadeOut(callback) {
        if (!this.infoBox) return;
        
        this.infoBox.style.transition = 'opacity 0.3s ease';
        this.infoBox.style.opacity = '0.7';
        
        setTimeout(() => {
            if (callback) callback();
        }, 150);
    }
    
    /**
     * Animazione fade in
     */
    fadeIn() {
        if (!this.infoBox) return;
        
        setTimeout(() => {
            this.infoBox.style.opacity = '1';
        }, 150);
    }
    
    /**
     * Ottiene statistiche sui fatti
     */
    getStats() {
        return {
            totalFacts: this.facts.length,
            currentIndex: this.currentFactIndex,
            isAutoRotating: this.isAutoRotating,
            autoRotateDelay: this.autoRotateDelay
        };
    }
    
    /**
     * Cambia la velocità di auto-rotazione
     */
    setAutoRotateDelay(delay) {
        this.autoRotateDelay = Math.max(3000, delay); // Minimo 3 secondi
        this.restartAutoRotation();
    }
    
    /**
     * Va a un fatto specifico per indice
     */
    goToFact(index) {
        if (index >= 0 && index < this.facts.length) {
            this.currentFactIndex = index;
            this.showCurrentFact();
            this.restartAutoRotation();
        }
    }
    
    /**
     * Cerca fatti per parola chiave
     */
    searchFacts(keyword) {
        if (!keyword) return [];
        
        const searchTerm = keyword.toLowerCase();
        return this.facts.filter(fact => 
            fact.titolo.toLowerCase().includes(searchTerm) ||
            fact.descrizione.toLowerCase().includes(searchTerm)
        ).map((fact, index) => ({
            ...fact,
            originalIndex: this.facts.indexOf(fact)
        }));
    }
    
    /**
     * Distrugge l'istanza e pulisce i timer
     */
    destroy() {
        this.stopAutoRotation();
        
        // Rimuove event listeners se necessario
        if (this.nextButton) {
            this.nextButton.removeEventListener('click', this.nextFact);
        }
        
        console.log('Info Box distrutto');
    }
}

// Inizializza l'Info Box quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verifica che musicFacts sia disponibile
    if (typeof musicFacts === 'undefined') {
        console.error('musicFacts non è disponibile per l\'Info Box');
        return;
    }
    
    // Crea l'istanza dell'Info Box
    window.infoBox = new InfoBox();
    
    console.log('Info Box inizializzato con successo');
});