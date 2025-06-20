/**
 * Modulo Graph.js - Grafo Interattivo D3.js
 * Implementa un grafo force-directed per visualizzare le connessioni
 * tra creatività umana, AI generativa e diritto d'autore musicale
 */

class InteractiveGraph {
    constructor(containerId, data) {
        this.containerId = containerId;
        this.data = data;
        this.width = 0;
        this.height = 0;
        this.svg = null;
        this.simulation = null;
        this.nodes = null;
        this.links = null;
        this.nodeElements = null;
        this.linkElements = null;
        this.labelElements = null;
        this.tooltip = null;
        this.selectedNode = null;
        
        // Parametri configurabili
        this.config = {
            nodeRadius: {
                primary: 15,
                secondary: 10
            },
            forces: {
                charge: -300,
                linkDistance: 100,
                centerStrength: 0.1,
                collisionRadius: 30
            },
            colors: {
                primary: '#52AE77',
                secondary: '#AE528E',
                link: '#666666',
                linkHighlight: '#AEA652',
                text: '#ffffff'
            },
            animation: {
                duration: 300
            }
        };
        
        this.init();
    }
    
    /**
     * Inizializza il grafo
     */
    init() {
        this.setupContainer();
        this.createTooltip();
        this.processData();
        this.createSVG();
        this.setupForces();
        this.createElements();
        this.setupInteractions();
        this.startSimulation();
        
        // Gestione resize della finestra
        window.addEventListener('resize', () => this.handleResize());
    }
    
    /**
     * Configura il container del grafo
     */
    setupContainer() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container ${this.containerId} non trovato`);
            return;
        }
        
        const rect = container.getBoundingClientRect();
        this.width = rect.width || 800;
        this.height = rect.height || 600;
    }
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
    

    
    /**
     * Crea il tooltip per i nodi
     */
    createTooltip() {
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'graph-tooltip')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background', 'rgba(26, 26, 26, 0.95)')
            .style('color', '#ffffff')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('border', '1px solid #00d4ff')
            .style('font-size', '14px')
            .style('max-width', '300px')
            .style('z-index', '10000')
            .style('pointer-events', 'none')
            .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)');
    }
    
    /**
     * Processa i dati per la visualizzazione
     */
    processData() {
        // Clona i dati per evitare modifiche all'originale
        this.nodes = this.data.nodes.map(d => ({...d}));
        this.links = this.data.links.map(d => ({...d}));
        
        // Aggiunge proprietà per la visualizzazione
        this.nodes.forEach(node => {
            node.radius = this.config.nodeRadius[node.type] || this.config.nodeRadius.secondary;
            node.color = this.config.colors[node.type] || this.config.colors.secondary;
            node.visible = true;
        });
    }
    
    /**
     * Crea l'elemento SVG principale
     */
    createSVG() {
        const container = d3.select(`#${this.containerId}`);
        
        // Rimuove SVG esistente se presente
        container.select('svg').remove();
        
        this.svg = container
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('background', 'transparent');
        
        // Gruppo principale per zoom e pan
        this.mainGroup = this.svg.append('g')
            .attr('class', 'main-group');
        
        // Setup zoom
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.mainGroup.attr('transform', event.transform);
            });
        
        this.svg.call(zoom);
    }
    
    /**
     * Configura le forze della simulazione
     */
    setupForces() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links)
                .id(d => d.id)
                .distance(this.config.forces.linkDistance)
                .strength(0.8))
            .force('charge', d3.forceManyBody()
                .strength(this.config.forces.charge))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2)
                .strength(this.config.forces.centerStrength))
            .force('collision', d3.forceCollide()
                .radius(d => d.radius + this.config.forces.collisionRadius)
                .strength(0.7));
    }
    
    /**
     * Crea gli elementi grafici (link, nodi, etichette)
     */
    createElements() {
        // Crea i collegamenti
        this.linkElements = this.mainGroup
            .selectAll('.link')
            .data(this.links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', this.config.colors.link)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.6);
        
        // Crea i nodi
        this.nodeElements = this.mainGroup
            .selectAll('.node')
            .data(this.nodes)
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('r', d => d.radius)
            .attr('fill', d => d.color)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))');
        
        // Crea le etichette
        this.labelElements = this.mainGroup
            .selectAll('.label')
            .data(this.nodes)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', this.config.colors.text)
            .attr('font-size', d => d.type === 'primary' ? '12px' : '10px')
            .attr('font-weight', d => d.type === 'primary' ? 'bold' : 'normal')
            .style('pointer-events', 'none')
            .style('user-select', 'none')
            .text(d => this.truncateText(d.name, d.type === 'primary' ? 15 : 12));
    }
    
    /**
     * Configura le interazioni (hover, click, drag)
     */
    setupInteractions() {
        // Drag behavior
        const drag = d3.drag()
            .on('start', (event, d) => this.dragStarted(event, d))
            .on('drag', (event, d) => this.dragged(event, d))
            .on('end', (event, d) => this.dragEnded(event, d));
        
        this.nodeElements.call(drag);
        
        // Hover events
        this.nodeElements
            .on('mouseover', (event, d) => this.handleMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleMouseOut(event, d))
            .on('click', (event, d) => this.handleClick(event, d));
    }
    
    /**
     * Avvia la simulazione
     */
    startSimulation() {
        this.simulation.on('tick', () => {
            // Aggiorna posizioni dei collegamenti
            this.linkElements
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            // Aggiorna posizioni dei nodi
            this.nodeElements
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
            
            // Aggiorna posizioni delle etichette
            this.labelElements
                .attr('x', d => d.x)
                .attr('y', d => d.y + d.radius + 15);
        });
    }
    
    /**
     * Gestisce l'inizio del drag
     */
    dragStarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    /**
     * Gestisce il drag
     */
    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    /**
     * Gestisce la fine del drag
     */
    dragEnded(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    /**
     * Gestisce il mouse over sui nodi
     */
    handleMouseOver(event, d) {
        // Evidenzia il nodo
        d3.select(event.currentTarget)
            .transition()
            .duration(this.config.animation.duration)
            .attr('r', d.radius * 1.2)
            .attr('stroke-width', 3);
        
        // Evidenzia i collegamenti connessi
        this.highlightConnections(d, true);
        
        // Mostra tooltip
        this.showTooltip(event, d);
    }
    
    /**
     * Gestisce il mouse out sui nodi
     */
    handleMouseOut(event, d) {
        // Ripristina il nodo
        d3.select(event.currentTarget)
            .transition()
            .duration(this.config.animation.duration)
            .attr('r', d.radius)
            .attr('stroke-width', 2);
        
        // Rimuove evidenziazione collegamenti
        this.highlightConnections(d, false);
        
        // Nasconde tooltip
        this.hideTooltip();
    }
    
    /**
     * Gestisce il click sui nodi
     */
    handleClick(event, d) {
        // Deseleziona nodo precedente
        if (this.selectedNode) {
            this.deselectNode(this.selectedNode);
        }
        
        // Seleziona nuovo nodo
        this.selectedNode = d;
        this.selectNode(d);
        
        // Emette evento personalizzato
        document.dispatchEvent(new CustomEvent('nodeSelected', {
            detail: { node: d }
        }));
    }
    
    /**
     * Evidenzia le connessioni di un nodo
     */
    highlightConnections(node, highlight) {
        const connectedLinks = this.links.filter(link => 
            link.source.id === node.id || link.target.id === node.id
        );
        
        this.linkElements
            .filter(d => connectedLinks.includes(d))
            .transition()
            .duration(this.config.animation.duration)
            .attr('stroke', highlight ? this.config.colors.linkHighlight : this.config.colors.link)
            .attr('stroke-width', highlight ? 3 : 2)
            .attr('stroke-opacity', highlight ? 1 : 0.6);
    }
    
    /**
     * Seleziona un nodo
     */
    selectNode(node) {
        this.nodeElements
            .filter(d => d.id === node.id)
            .attr('stroke', this.config.colors.linkHighlight)
            .attr('stroke-width', 4);
    }
    
    /**
     * Deseleziona un nodo
     */
    deselectNode(node) {
        this.nodeElements
            .filter(d => d.id === node.id)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2);
    }
    
    /**
     * Mostra il tooltip
     */
    showTooltip(event, d) {
        const tooltipContent = `
            <strong>${d.name}</strong><br>
            <em>Tipo: ${d.type === 'primary' ? 'Tema Centrale' : 'Concetto Correlato'}</em><br><br>
            ${d.description}
        `;
        
        this.tooltip
            .html(tooltipContent)
            .style('visibility', 'visible')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
    }
    
    /**
     * Nasconde il tooltip
     */
    hideTooltip() {
        this.tooltip.style('visibility', 'hidden');
    }
    
    /**
     * Tronca il testo per le etichette
     */
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    /**
     * Gestisce il resize della finestra
     */
    handleResize() {
        const container = document.getElementById(this.containerId);
        const rect = container.getBoundingClientRect();
        
        this.width = rect.width;
        this.height = rect.height;
        
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
        
        this.simulation
            .force('center', d3.forceCenter(this.width / 2, this.height / 2));
        
        this.simulation.alpha(0.3).restart();
    }
    
    /**
     * Metodi pubblici per il controllo del grafo
     */
    
    /**
     * Resetta la vista del grafo
     */
    resetView() {
        this.svg.transition()
            .duration(750)
            .call(d3.zoom().transform, d3.zoomIdentity);
        
        this.simulation.alpha(0.3).restart();
    }
    
    /**
     * Centra il grafo
     */
    centerGraph() {
        const bounds = this.mainGroup.node().getBBox();
        const fullWidth = this.width;
        const fullHeight = this.height;
        const width = bounds.width;
        const height = bounds.height;
        const midX = bounds.x + width / 2;
        const midY = bounds.y + height / 2;
        
        if (width === 0 || height === 0) return;
        
        const scale = Math.min(fullWidth / width, fullHeight / height) * 0.8;
        const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
        
        this.svg.transition()
            .duration(750)
            .call(d3.zoom().transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }
    
    /**
     * Aggiorna la forza dei collegamenti
     */
    updateForceStrength(strength) {
        this.simulation
            .force('link')
            .strength(strength);
        
        this.simulation.alpha(0.3).restart();
    }
    
    /**
     * Filtra i nodi per tipo
     */
    filterNodes(showPrimary, showSecondary) {
        this.nodeElements
            .style('display', d => {
                const show = (d.type === 'primary' && showPrimary) || 
                             (d.type === 'secondary' && showSecondary);
                return show ? 'block' : 'none';
            });
        
        this.labelElements
            .style('display', d => {
                const show = (d.type === 'primary' && showPrimary) || 
                             (d.type === 'secondary' && showSecondary);
                return show ? 'block' : 'none';
            });
        
        // Aggiorna anche i collegamenti
        this.linkElements
            .style('display', d => {
                const sourceVisible = (d.source.type === 'primary' && showPrimary) || 
                                     (d.source.type === 'secondary' && showSecondary);
                const targetVisible = (d.target.type === 'primary' && showPrimary) || 
                                     (d.target.type === 'secondary' && showSecondary);
                return sourceVisible && targetVisible ? 'block' : 'none';
            });
    }
}

// Inizializzazione del grafo quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verifica che i dati siano disponibili
    if (typeof graphData !== 'undefined') {
        // Crea l'istanza del grafo interattivo
        window.interactiveGraph = new InteractiveGraph('graph-canvas', graphData);
        
        console.log('Grafo interattivo inizializzato con successo');
        console.log(`Nodi caricati: ${graphData.nodes.length}`);
        console.log(`Collegamenti caricati: ${graphData.links.length}`);
    } else {
        console.error('Dati del grafo non disponibili. Assicurati che graphData.js sia caricato.');
    }
});



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