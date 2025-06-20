/**
 * Modulo Graph.js - Grafo Interattivo D3.js
 * Implementa un grafo force-directed per visualizzare le connessioni
 * tra creatività umana, AI generativa e diritto d'autore musicale
 */

class GraphVisualization {  // Modificato da InteractiveGraph a GraphVisualization
    constructor(containerId, data) {
        this.containerId = containerId;
        this.data = data;
        // ... (resto del codice invariato)
    }

    // ... (tutti i metodi rimangono invariati) ...

    /**
     * Metodo aggiunto per compatibilità con main.js
     */
    setAnimationMode(enabled) {
        // Implementa qui la logica per attivare/disattivare le animazioni
        console.log(`Modalità animazione: ${enabled ? 'ON' : 'OFF'}`);
        // Esempio: this.config.animation.enabled = enabled;
    }
    
    /**
     * Metodo aggiunto per compatibilità con main.js
     */
    highlightRelatedNodes(keyword) {
        // Implementa qui la logica di evidenziazione
        console.log(`Evidenzia nodi correlati a: ${keyword}`);
    }
}

// ===================================================================
// INIZIALIZZAZIONE E ESPORTAZIONE GLOBALE
// ===================================================================

// Verifica che il container esista già
function isContainerAvailable() {
    return !!document.getElementById('graph-canvas');
}

// Gestione robusta dell'inizializzazione
function initializeGraph() {
    // 1. Verifica la disponibilità dei dati
    if (typeof graphData === 'undefined') {
        console.warn('graphData non disponibile durante l\'inizializzazione');
        return null;
    }

    // 2. Verifica che il container esista
    if (!isContainerAvailable()) {
        console.error('Container #graph-canvas non trovato');
        return null;
    }

    // 3. Crea l'istanza
    try {
        const instance = new GraphVisualization('graph-canvas', graphData);
        console.log('Istanza GraphVisualization creata con successo');
        return instance;
    } catch (error) {
        console.error('Errore nella creazione del grafo:', error);
        return null;
    }
}

// Esposizione globale con gestione dello stato del DOM
if (typeof window !== 'undefined') {
    // Soluzione per DOM già caricato
    if (document.readyState === 'complete') {
        window.graphVisualization = initializeGraph();
    } 
    // Soluzione per DOM in caricamento
    else {
        window.addEventListener('load', () => {
            window.graphVisualization = initializeGraph();
        });
    }

    // Esponi la classe per uso esterno
    window.GraphVisualization = GraphVisualization;
}