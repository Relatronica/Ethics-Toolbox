/**
 * AI Ethics Toolkit - D3.js Visualization
 * Creates interactive visualizations for AI ethics concepts
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const visualizationContainer = document.getElementById('visualization');
    
    // Visualization state
    let currentConcepts = null;
    let simulation = null;
    let width = visualizationContainer.clientWidth;
    let height = visualizationContainer.clientHeight;
    
    // Set up the SVG container with responsive dimensions
    const svg = d3.select('#visualization')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('class', 'visualization-svg');

    
    
    // Add a group for all visualization elements
    const vizGroup = svg.append('g')
        .attr('class', 'viz-group');
    
    // Add a group for links (connections between concepts)
    const linksGroup = vizGroup.append('g')
        .attr('class', 'links-group');
    
    // Add a group for nodes (concepts)
    const nodesGroup = vizGroup.append('g')
        .attr('class', 'nodes-group');
    
    // Add zoom and pan behavior with smooth transitions
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
            vizGroup.attr('transform', event.transform);
        });
    
    svg.call(zoom)
       .call(zoom.transform, d3.zoomIdentity);
    
    // Double-click to reset zoom with animation
    svg.on('dblclick', () => {
        svg.transition()
           .duration(750)
           .call(zoom.transform, d3.zoomIdentity);
    });
    
    // Initialize with a placeholder visualization
    initPlaceholderVisualization();
    
    /**
     * Initialize a placeholder visualization
     * This shows a simple message until real data is loaded
     */
    function initPlaceholderVisualization() {
        // Clear any existing elements
        linksGroup.selectAll('*').remove();
        nodesGroup.selectAll('*').remove();
        
        // Remove any existing placeholder
        svg.selectAll('.placeholder-text').remove();
        
        // Add a text element as a placeholder with fade-in animation
        const placeholderText = svg.append('text')
            .attr('x', '50%')
            .attr('y', '50%')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('class', 'placeholder-text')
            .text('Select a chapter to visualize AI ethics concepts')
            .style('font-size', '16px')
            .style('fill', 'var(--text-secondary)')
            .style('opacity', 0);
        
        // Animate the placeholder text
        placeholderText.transition()
            .duration(800)
            .style('opacity', 1);
    }
    
    /**
     * Update the visualization with new data
     * @param {Array} concepts - Array of concept objects with connections
     */
    function updateVisualization(concepts) {
        // Store current concepts for resize handling
        currentConcepts = concepts;
        
        if (!concepts || concepts.length === 0) {
            initPlaceholderVisualization();
            return;
        }
        
        // Clear the placeholder and any existing elements with fade-out animation
        svg.selectAll('.placeholder-text')
           .transition()
           .duration(300)
           .style('opacity', 0)
           .remove();
        
        // Update dimensions
        width = visualizationContainer.clientWidth;
        height = visualizationContainer.clientHeight;
        
        // Process the concepts data to create nodes and links
        const nodes = concepts.map(concept => ({
            id: concept.id,
            name: concept.name,
            description: concept.description,
            radius: 40,  // Size of the node
            x: width / 2 + (Math.random() - 0.5) * 100,  // Initial position
            y: height / 2 + (Math.random() - 0.5) * 100
        }));
        
        // Create links from the connections between concepts
        const links = [];
        concepts.forEach(concept => {
            concept.connections.forEach(connectionId => {
                links.push({
                    source: concept.id,
                    target: connectionId,
                    value: 1
                });
            });
        });
        
        // Create a force simulation
        if (simulation) {
            simulation.stop();
        }
        
        simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => d.radius + 10));
        
        // Create links with animated transitions
        const link = linksGroup.selectAll('.link')
            .data(links, d => `${d.source.id || d.source}-${d.target.id || d.target}`);
        
        // Remove old links with animation
        link.exit()
            .transition()
            .duration(500)
            .style('opacity', 0)
            .remove();
        
        // Add new links with animation
        const linkEnter = link.enter()
            .append('line')
            .attr('class', 'link')
            .style('stroke', 'var(--border-color)')
            .style('stroke-width', 2)
            .style('opacity', 0);
        
        // Merge and animate all links
        const linkMerge = linkEnter.merge(link)
            .transition()
            .duration(800)
            .delay((d, i) => i * 50)
            .style('opacity', 0.6);
        
        // Create nodes with animated transitions
        const node = nodesGroup.selectAll('.node')
            .data(nodes, d => d.id);
        
        // Remove old nodes with animation
        node.exit()
            .transition()
            .duration(500)
            .style('opacity', 0)
            .remove();
        
        // Add new nodes with animation
        const nodeEnter = node.enter()
            .append('g')
            .attr('class', 'node')
            .style('opacity', 0)
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
        
        // Add circle to each node
        nodeEnter.append('circle')
            .attr('r', d => d.radius)
            .style('fill', 'var(--primary-color)')
            .style('stroke', 'var(--border-color)')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', handleNodeMouseOver)
            .on('mouseout', handleNodeMouseOut)
            .on('click', handleNodeClick);
        
        // Add text to each node
        nodeEnter.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.3em')
            .text(d => d.name.split(' ')[0])  // First word only for clarity
            .style('fill', 'var(--text-primary)')
            .style('font-size', '12px')
            .style('pointer-events', 'none');
        
        // Merge and animate all nodes
        const nodeMerge = nodeEnter.merge(node)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .style('opacity', 1);
        
        // Update positions on each simulation tick
        simulation.on('tick', () => {
            // Update link positions
            linksGroup.selectAll('.link')
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            
            // Update node positions
            nodesGroup.selectAll('.node')
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });
        
        // Restart simulation
        simulation.alpha(1).restart();
    }
    
    /**
     * Handle node mouseover event
     */
    function handleNodeMouseOver(event, d) {
        // Highlight the node
        d3.select(this)
            .transition()
            .duration(300)
            .attr('r', d.radius * 1.2)
            .style('fill', 'var(--secondary-color)');

        
        // Show modern tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'concept-tooltip modern-tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(105, 105, 105, 0.26)')
            .style('backdrop-filter', 'blur(4px)')
            .style('border-radius', '12px')
            .style('padding', '16px')
            .style('box-shadow', '0 10px 30px rgba(0,0,0,0.15)')
            .style('border', `2px solid ${d.color}`)
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('z-index', 1000)
            .style('max-width', '300px')
            .style('transform', 'translateY(10px)')
            .style('transition', 'opacity 0.3s, transform 0.3s');
        
             tooltip.html(`
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${d.color}; margin-right: 10px;"></div>
                <h3 style="margin: 0; font-size: 18px;">${d.name}</h3>
            </div>
            <p style="margin: 0; line-height: 1.5;">${d.description}</p>
            <div style="margin-top: 10px; font-size: 12px;">
                Click for details
            </div>
        `);
        
        
        // Position the tooltip near the node
        const tooltipWidth = 250;
        const tooltipHeight = 100;  // Approximate height
        const xPosition = event.pageX > window.innerWidth - tooltipWidth ? 
            event.pageX - tooltipWidth - 10 : 
            event.pageX + 10;
        
        const yPosition = event.pageY > window.innerHeight - tooltipHeight ? 
            event.pageY - tooltipHeight - 10 : 
            event.pageY + 10;
        
        tooltip
            .style('left', `${xPosition}px`)
            .style('top', `${yPosition}px`)
            .transition()
            .duration(300)
            .style('opacity', 1);
    }
    
    /**
     * Handle node mouseout event
     */
    function handleNodeMouseOut(event, d) {
        // Reset node appearance
        d3.select(this)
            .transition()
            .duration(300)
            .attr('r', d.radius)
            .style('fill', 'var(--primary-color)');
        
        // Remove tooltip with fade-out animation
        d3.selectAll('.concept-tooltip')
            .transition()
            .duration(300)
            .style('opacity', 0)
            .remove();
    }
    
    /**
     * Handle node click event
     */
    function handleNodeClick(event, d) {
        // Pulse animation for the clicked node
        d3.select(this)
            .transition()
            .duration(150)
            .attr('r', d.radius * 1.3)
            .transition()
            .duration(150)
            .attr('r', d.radius);
        
        // Update visualization info with the selected concept
        const visualizationInfo = document.getElementById('visualization-info');
        
        visualizationInfo.classList.add('fade-out');
        
        setTimeout(() => {
            visualizationInfo.innerHTML = `
                <h3>${d.name}</h3>
                <p>${d.description}</p>
            `;
            visualizationInfo.classList.remove('fade-out');
            visualizationInfo.classList.add('fade-in');
            
            setTimeout(() => {
                visualizationInfo.classList.remove('fade-in');
            }, 500);
        }, 300);
        
        // Find connected nodes and highlight them
        const connectedNodeIds = new Set();
        linksGroup.selectAll('.link').each(function(linkData) {
            if (linkData.source.id === d.id || linkData.target.id === d.id) {
                connectedNodeIds.add(linkData.source.id === d.id ? linkData.target.id : linkData.source.id);
                
                // Highlight the connection
                d3.select(this)
                    .transition()
                    .duration(300)
                    .style('stroke', 'var(--primary-color)')
                    .style('stroke-width', 3)
                    .style('opacity', 1)
                    .transition()
                    .delay(2000)
                    .duration(500)
                    .style('stroke', 'var(--border-color)')
                    .style('stroke-width', 2)
                    .style('opacity', 0.6);
            }
        });
        
        // Highlight connected nodes
        nodesGroup.selectAll('.node').each(function(nodeData) {
            if (connectedNodeIds.has(nodeData.id)) {
                d3.select(this).select('circle')
                    .transition()
                    .duration(300)
                    .style('fill', 'var(--secondary-color)')
                    .transition()
                    .delay(2000)
                    .duration(500)
                    .style('fill', 'var(--primary-color)');
            }
        });
    }
    
    /**
     * Handle drag start event
     */
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    /**
     * Handle drag event
     */
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    /**
     * Handle drag end event
     */
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    /**
     * Handle window resize to make visualization responsive
     */
    function handleVisualizationResize() {
        // Update dimensions
        width = visualizationContainer.clientWidth;
        height = visualizationContainer.clientHeight;
        
        // Update force center
        if (simulation) {
            simulation.force('center', d3.forceCenter(width / 2, height / 2));
            simulation.alpha(0.3).restart();
        }
        
        // If we have current concepts, redraw the visualization
        if (currentConcepts && currentConcepts.length > 0) {
            updateVisualization(currentConcepts);
        }
    }
    
    // Listen for window resize events
    window.addEventListener('resize', handleVisualizationResize);
    
    // Expose functions to be called from app.js
    window.updateVisualization = updateVisualization;
    window.handleVisualizationResize = handleVisualizationResize;
});