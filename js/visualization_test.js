/**
 * AI Ethics Toolkit - D3.js Visualization
 * Modernized interactive visualization for AI ethics concepts
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
    
    // Add filter for glow effect
    const defs = svg.append('defs');
    const glowFilter = defs.append('filter')
        .attr('id', 'glow')
        .attr('height', '150%')
        .attr('width', '150%');
    
    glowFilter.append('feGaussianBlur')
        .attr('stdDeviation', '3.5')
        .attr('result', 'coloredBlur');
    
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
    
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
        .scaleExtent([0.3, 5])
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
     */
    function initPlaceholderVisualization() {
        // ... (existing code remains the same)
    }
    
    /**
     * Assign colors to nodes based on hierarchy
     * @param {Array} concepts - Array of concept objects
     * @returns {Object} Color mapping and root color
     */
    function assignHierarchicalColors(concepts) {
        const colorMap = {};
        const rootColor = '#4e79a7'; // Base blue
        const depthColors = {
            0: rootColor,
            1: '#f28e2c', // Orange
            2: '#e15759', // Red
            3: '#76b7b2', // Teal
            4: '#59a14f', // Green
            5: '#edc949', // Yellow
        };
        
        // Find root nodes (nodes with no incoming links)
        const allTargets = new Set();
        concepts.forEach(concept => {
            concept.connections.forEach(targetId => {
                allTargets.add(targetId);
            });
        });
        
        const rootNodes = concepts.filter(
            concept => !allTargets.has(concept.id)
        );
        
        // Traverse from root nodes to assign depths
        const assignDepth = (node, depth) => {
            colorMap[node.id] = depthColors[Math.min(depth, 5)] || '#bab0ac';
            
            const children = concepts.filter(concept => 
                node.connections.includes(concept.id)
            );
            
            children.forEach(child => {
                if (colorMap[child.id] === undefined) {
                    assignDepth(child, depth + 1);
                }
            });
        };
        
        rootNodes.forEach(root => assignDepth(root, 0));
        return { colorMap, rootColor };
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
        
        // Assign hierarchical colors
        const { colorMap, rootColor } = assignHierarchicalColors(concepts);
        
        // Clear the placeholder and any existing elements
        // ... (existing code remains the same)
        
        // Process the concepts data to create nodes and links
        const nodes = concepts.map(concept => ({
            id: concept.id,
            name: concept.name,
            description: concept.description,
            radius: 40,  // Size of the node
            color: colorMap[concept.id] || '#bab0ac', // Default color
            depth: concept.depth || 0,
            x: width / 2 + (Math.random() - 0.5) * 100,
            y: height / 2 + (Math.random() - 0.5) * 100
        }));
        
        // Create links from the connections between concepts
        const links = [];
        concepts.forEach(concept => {
            concept.connections.forEach(connectionId => {
                const sourceColor = colorMap[concept.id];
                const targetColor = colorMap[connectionId];
                
                links.push({
                    source: concept.id,
                    target: connectionId,
                    // Use gradient when colors are different
                    gradient: sourceColor !== targetColor,
                    sourceColor,
                    targetColor
                });
            });
        });
        
        // Create gradient definitions for links
        defs.selectAll('.link-gradient').remove();
        links.forEach((link, i) => {
            if (link.gradient) {
                const gradient = defs.append('linearGradient')
                    .attr('id', `link-gradient-${i}`)
                    .attr('class', 'link-gradient')
                    .attr('gradientUnits', 'userSpaceOnUse');
                
                gradient.append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', link.sourceColor);
                
                gradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', link.targetColor);
            }
        });
        
        // Create a force simulation with improved parameters
        if (simulation) {
            simulation.stop();
        }
        
        simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(d => 100 + (d.depth * 30)))
            .force('charge', d3.forceManyBody().strength(d => -300 + (d.depth * 50)))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => d.radius + 5))
            .force('radial', d3.forceRadial(
                d => 150 + (d.depth * 80), 
                width / 2, 
                height / 2
            ).strength(0.1));
        
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
            .style('stroke-width', 2)
            .style('opacity', 0);
        
        // Style links based on gradient or single color
        linkEnter.style('stroke', (d, i) => {
            if (d.gradient) {
                return `url(#link-gradient-${i})`;
            }
            return d.sourceColor || rootColor;
        });
        
        // Merge and animate all links
        const linkMerge = linkEnter.merge(link)
            .transition()
            .duration(800)
            .delay((d, i) => i * 30)
            .style('opacity', 0.8);
        
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
        
        // Add circle to each node with glow effect
        nodeEnter.append('circle')
            .attr('r', d => d.radius)
            .style('fill', d => d.color)
            .style('stroke', '#ffffff')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .style('filter', 'url(#glow)')
            .on('mouseover', handleNodeMouseOver)
            .on('mouseout', handleNodeMouseOut)
            .on('click', handleNodeClick);
        
        // Add text to each node with improved styling
        nodeEnter.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.3em')
            .text(d => d.name.split(' ')[0])
            .style('fill', '#ffffff')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('text-shadow', '0 1px 2px rgba(0,0,0,0.5)')
            .style('pointer-events', 'none');
        
        // Add depth indicator
        nodeEnter.append('circle')
            .attr('r', 5)
            .attr('cx', d => d.radius - 10)
            .attr('cy', d => -d.radius + 10)
            .style('fill', d => d.color)
            .style('stroke', '#ffffff')
            .style('stroke-width', 1);
        
        // Merge and animate all nodes
        const nodeMerge = nodeEnter.merge(node)
            .transition()
            .duration(800)
            .delay((d, i) => i * 80)
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
        
        // Add subtle floating animation
        simulation.alphaTarget(0.1).restart();
        setTimeout(() => simulation.alphaTarget(0), 2000);
    }
    
    /**
     * Handle node mouseover event with modern effects
     */
    function handleNodeMouseOver(event, d) {
        // Highlight the node
        d3.select(this)
            .transition()
            .duration(200)
            .attr('r', d.radius * 1.15);
        
        // Highlight connected links
        linksGroup.selectAll('.link')
            .style('opacity', 0.2)
            .filter(link => 
                link.source.id === d.id || 
                link.target.id === d.id
            )
            .transition()
            .duration(300)
            .style('opacity', 1)
            .style('stroke-width', 3);
        
        // Show modern tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'concept-tooltip modern-tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(255, 255, 255, 0.95)')
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
                <h4 style="margin: 0; color: #2c3e50; font-size: 18px;">${d.name}</h4>
            </div>
            <p style="margin: 0; color: #34495e; line-height: 1.5;">${d.description}</p>
            <div style="margin-top: 10px; font-size: 12px; color: #7f8c8d;">
                Click for details
            </div>
        `);
        
        // Position the tooltip
        const tooltipWidth = 300;
        const tooltipHeight = tooltip.node().getBoundingClientRect().height;
        const x = event.pageX - tooltipWidth / 2;
        const y = event.pageY - tooltipHeight - 20;
        
        tooltip
            .style('left', `${Math.max(10, Math.min(window.innerWidth - tooltipWidth - 10, x))}px`)
            .style('top', `${Math.max(10, y)}px`)
            .style('opacity', 1)
            .style('transform', 'translateY(0)');
    }
    
    /**
     * Handle node mouseout event
     */
    function handleNodeMouseOut(event, d) {
        // Reset node appearance
        d3.select(this)
            .transition()
            .duration(300)
            .attr('r', d.radius);
        
        // Reset links
        linksGroup.selectAll('.link')
            .transition()
            .duration(500)
            .style('opacity', 0.8)
            .style('stroke-width', 2);
        
        // Remove tooltip
        d3.selectAll('.concept-tooltip')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .style('transform', 'translateY(10px)')
            .remove();
    }
    
    /**
     * Handle node click event with modern effects
     */
    function handleNodeClick(event, d) {
        // Pulse animation for the clicked node
        d3.select(this)
            .transition()
            .duration(100)
            .attr('r', d.radius * 1.3)
            .style('filter', 'url(#glow) brightness(1.2)')
            .transition()
            .duration(300)
            .attr('r', d.radius)
            .style('filter', 'url(#glow)');
        
        // Update visualization info with modern animation
        const visualizationInfo = document.getElementById('visualization-info');
        
        visualizationInfo.style.transform = 'scale(0.95)';
        visualizationInfo.style.opacity = '0';
        
        setTimeout(() => {
            visualizationInfo.innerHTML = `
                <div class="concept-header" style="border-left: 4px solid ${d.color}; padding-left: 12px;">
                    <h3 style="margin: 0 0 8px 0; color: #2c3e50;">${d.name}</h3>
                    <div style="display: flex; align-items: center;">
                        <div style="width: 10px; height: 10px; border-radius: 50%; background: ${d.color}; margin-right: 8px;"></div>
                        <span style="font-size: 14px; color: #7f8c8d;">Depth: ${d.depth}</span>
                    </div>
                </div>
                <p style="margin-top: 16px; color: #34495e; line-height: 1.6;">${d.description}</p>
            `;
            
            visualizationInfo.style.transform = 'scale(1)';
            visualizationInfo.style.opacity = '1';
            visualizationInfo.style.transition = 'transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.3s';
        }, 300);
        
        // Find connected nodes and highlight them
        const connectedNodeIds = new Set();
        linksGroup.selectAll('.link').each(function(linkData) {
            if (linkData.source.id === d.id || linkData.target.id === d.id) {
                connectedNodeIds.add(linkData.source.id === d.id ? linkData.target.id : linkData.source.id);
                
                // Highlight the connection
                d3.select(this)
                    .style('stroke-width', 3)
                    .style('opacity', 1)
                    .transition()
                    .duration(3000)
                    .style('stroke-width', 2)
                    .style('opacity', 0.8);
            }
        });
        
        // Highlight connected nodes
        nodesGroup.selectAll('.node').each(function(nodeData) {
            if (connectedNodeIds.has(nodeData.id)) {
                d3.select(this).select('circle')
                    .style('filter', 'url(#glow) brightness(1.1)')
                    .transition()
                    .duration(3000)
                    .style('filter', 'url(#glow)');
            }
        });
        
        // Center the clicked node
        const scale = svg.node().getBoundingClientRect().width / width;
        const transform = d3.zoomTransform(svg.node());
        
        svg.transition()
            .duration(1000)
            .call(zoom.transform, d3.zoomIdentity
                .translate(width/2, height/2)
                .scale(1.5)
                .translate(-d.x, -d.y)
            );
    }
    
    // ... (drag functions remain the same)
    
    /**
     * Handle window resize to make visualization responsive
     */
    function handleVisualizationResize() {
        // ... (existing code remains the same)
    }
    
    // Listen for window resize events
    window.addEventListener('resize', handleVisualizationResize);
    
    // Expose functions to be called from app.js
    window.updateVisualization = updateVisualization;
    window.handleVisualizationResize = handleVisualizationResize;
});