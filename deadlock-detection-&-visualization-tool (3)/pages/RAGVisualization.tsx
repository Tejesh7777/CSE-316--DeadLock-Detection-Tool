import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { generateGraphData } from '../services/logic';

const RAGVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('deadlockData');
    if (!savedData) {
      setError('No data found. Please run the Detector first.');
      return;
    }

    const { numProcesses, numResources, totalResources, allocation, request } = JSON.parse(savedData);
    const resources = totalResources.map((t:number, i:number) => ({id:i, name:`R${i}`, totalInstances: t}));
    const { ragNodes, ragLinks } = generateGraphData(numProcesses, numResources, resources, allocation, request);

    // Calculate details for tooltip
    ragNodes.forEach((node: any) => {
      if (node.type === 'RESOURCE') {
        const rIndex = parseInt(node.id.replace('R', ''));
        node.totalInstances = totalResources[rIndex];
        node.allocatedCount = 0;
        for (let p = 0; p < numProcesses; p++) {
          node.allocatedCount += allocation[p][rIndex];
        }
        node.availableCount = node.totalInstances - node.allocatedCount;
      }
    });

    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 650; // Increased height for better spacing
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("*").remove();

    // --- 1. DEFINITIONS (Filters, Patterns, Markers) ---
    const defs = svg.append('defs');
    
    // Grid Pattern for Background
    const pattern = defs.append('pattern')
        .attr('id', 'grid')
        .attr('width', 40)
        .attr('height', 40)
        .attr('patternUnits', 'userSpaceOnUse');
    pattern.append('path')
        .attr('d', 'M 40 0 L 0 0 0 40')
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.03)')
        .attr('stroke-width', 1);

    // Glow Filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Markers
    const createMarker = (id: string, color: string) => {
        defs.append('marker')
            .attr('id', id)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 28) // Pushed back slightly to avoid overlap
            .attr('refY', 0)
            .attr('markerWidth', 5)
            .attr('markerHeight', 5)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', color);
    };

    createMarker('arrow-req', '#32F5FF');  // Cyan for Request
    createMarker('arrow-alloc', '#00FF9D'); // Green for Alloc

    // --- 2. BACKGROUND ---
    svg.append('rect')
       .attr('width', '100%')
       .attr('height', '100%')
       .attr('fill', 'url(#grid)');

    // --- 3. SIMULATION SETUP ---
    // Create a map to check connections quickly for highlighting
    const linkedByIndex: any = {};
    ragLinks.forEach((d: any) => {
        linkedByIndex[`${d.source.id || d.source},${d.target.id || d.target}`] = 1;
    });

    const isConnected = (a: any, b: any) => {
        return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
    };

    const simulation = d3.forceSimulation(ragNodes as any)
      .force('link', d3.forceLink(ragLinks).id((d: any) => d.id).distance(220)) // More distance
      .force('charge', d3.forceManyBody().strength(-1000)) // Stronger repulsion for clearer layout
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(60));

    // --- 4. LINKS ---
    const linkGroup = svg.append('g').attr('class', 'links');
    
    const link = linkGroup
      .selectAll('line')
      .data(ragLinks)
      .enter().append('line')
      .attr('class', (d: any) => d.type === 'REQUEST' ? 'edge-flow transition-opacity duration-300' : 'transition-opacity duration-300') 
      .attr('stroke', (d: any) => d.type === 'REQUEST' ? '#32F5FF' : '#00FF9D') 
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', (d: any) => d.type === 'REQUEST' ? '6,4' : '0') 
      .attr('marker-end', (d: any) => d.type === 'REQUEST' ? 'url(#arrow-req)' : 'url(#arrow-alloc)')
      .attr('opacity', 0.8);

    // Link Labels (Subtle)
    const linkLabel = svg.append('g')
      .selectAll('text')
      .data(ragLinks)
      .enter().append('text')
      .text((d: any) => d.label)
      .attr('fill', (d: any) => d.type === 'REQUEST' ? '#32F5FF' : '#00FF9D')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('text-anchor', 'middle')
      .attr('dy', -6)
      .style('opacity', 0) // Hidden by default, shown on highlight
      .style('pointer-events', 'none');

    // --- 5. NODES ---
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    const node = nodeGroup
      .selectAll('g')
      .data(ragNodes)
      .enter().append('g')
      .style('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Hover Interaction Logic
    node
      .on('mouseover', function(event, d: any) {
         // Dim all non-connected nodes and links
         node.transition().duration(200).style('opacity', (o: any) => 
            isConnected(d, o) ? 1 : 0.1
         );
         link.transition().duration(200).style('opacity', (o: any) => 
            (o.source.id === d.id || o.target.id === d.id) ? 1 : 0.05
         );
         // Show labels for connected links
         linkLabel.transition().duration(200).style('opacity', (o: any) => 
            (o.source.id === d.id || o.target.id === d.id) ? 1 : 0
         );
         
         // Tooltip
         if (tooltipRef.current) {
            const t = d3.select(tooltipRef.current);
            t.transition().duration(200).style('opacity', 1);
            
            let content = '';
            if (d.type === 'PROCESS') {
                content = `
                  <div class="font-bold border-b border-neon-blue/30 pb-1 mb-1 text-neon-blue">Process ${d.label}</div>
                  <div class="text-xs text-slate-300">Click to focus</div>
                `;
            } else {
                 content = `
                  <div class="font-bold border-b border-neon-green/30 pb-1 mb-1 text-neon-green">Resource ${d.label}</div>
                  <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span class="text-slate-400">Total:</span> <span class="text-white text-right font-mono">${d.totalInstances}</span>
                    <span class="text-slate-400">Allocated:</span> <span class="text-white text-right font-mono">${d.allocatedCount}</span>
                    <span class="text-slate-400">Available:</span> <span class="text-white text-right font-mono">${d.availableCount}</span>
                  </div>
                `;
            }

            t.html(content)
             .style('left', (event.pageX + 15) + 'px')
             .style('top', (event.pageY - 10) + 'px');
          }
      })
      .on('mouseout', function() {
          // Reset opacity
          node.transition().duration(200).style('opacity', 1);
          link.transition().duration(200).style('opacity', 0.8);
          linkLabel.transition().duration(200).style('opacity', 0);
          
          if (tooltipRef.current) {
            d3.select(tooltipRef.current).transition().duration(200).style('opacity', 0);
          }
      });

    // --- DRAW PROCESSES ---
    const processes = node.filter((d: any) => d.type === 'PROCESS');
    
    // Outer glow ring
    processes.append('circle')
        .attr('r', 24)
        .attr('fill', 'none')
        .attr('stroke', '#32F5FF')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.5)
        .attr('class', 'animate-pulse-slow');

    // Main circle
    processes.append('circle')
      .attr('r', 20)
      .attr('fill', '#0A0F1F')
      .attr('stroke', '#32F5FF')
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)');

    // --- DRAW RESOURCES ---
    const resourceNodes = node.filter((d: any) => d.type === 'RESOURCE');
    
    // Outer box
    resourceNodes.append('rect')
      .attr('width', 54)
      .attr('height', 54)
      .attr('x', -27)
      .attr('y', -27)
      .attr('rx', 8)
      .attr('fill', '#0A0F1F')
      .attr('stroke', '#00FF9D')
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)');

    // Instance Dots
    resourceNodes.each(function(d: any) {
        const g = d3.select(this);
        const count = d.totalInstances || 0;
        
        // Draw up to 9 dots in a 3x3 grid
        if (count > 0 && count <= 9) {
            const size = 3;
            const gap = 12; // Spacing
            const gridWidth = (Math.min(count, 3) - 1) * gap;
            
            // Center the grid
            const startX = -gridWidth / 2;
            const rows = Math.ceil(count / 3);
            const gridHeight = (rows - 1) * gap;
            const startY = -gridHeight / 2;
            
            for(let i=0; i<count; i++) {
                const row = Math.floor(i / 3);
                const col = i % 3;
                
                // If last row has fewer items, center them
                const itemsInRow = (row === rows - 1 && count % 3 !== 0) ? count % 3 : 3;
                const rowWidth = (itemsInRow - 1) * gap;
                const rowStartX = -rowWidth / 2;

                g.append('circle')
                 .attr('cx', rowStartX + (col * gap) ) // Use row-specific center if simpler centering desired, else strictly grid
                 .attr('cy', startY + (row * gap))
                 .attr('r', size)
                 .attr('fill', i < d.allocatedCount ? '#00FF9D' : '#334155'); // Green if alloc, grey if free? (Simplified here to all green as RAG logic usually just shows instances)
            }
            // Re-coloring strictly based on visual aesthetics:
             g.selectAll('circle').attr('fill', '#00FF9D');

        } else if (count > 9) {
            g.append('text')
             .text(count)
             .attr('y', 5)
             .attr('text-anchor', 'middle')
             .attr('fill', '#00FF9D')
             .attr('font-size', '16px')
             .attr('font-weight', 'bold');
        }
    });

    // Labels
    node.append('text')
      .text((d: any) => d.label)
      .attr('dy', (d: any) => d.type === 'PROCESS' ? 5 : 40) // Inside for P, Below for R
      .attr('dx', (d: any) => d.type === 'PROCESS' ? 0 : 0)
      .attr('text-anchor', 'middle')
      .attr('fill', (d: any) => d.type === 'PROCESS' ? 'white' : '#00FF9D')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,1)');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
       {/* Tooltip Portal */}
       <div ref={tooltipRef} className="fixed pointer-events-none opacity-0 bg-slate-900/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50 transition-opacity min-w-[150px]"></div>

      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             Resource Allocation Graph
             <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded border border-white/5">Interactive View</span>
           </h1>
           <p className="text-slate-400 mt-1">
             <span className="text-neon-cyan font-bold">● Process (Circle)</span> requests resources. 
             <span className="text-neon-green font-bold ml-4">■ Resource (Square)</span> allocates instances.
           </p>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-900/30 border border-red-500 text-red-300 rounded-lg">
          {error} <br/> <a href="/#/detector" className="underline">Go to Detector</a>
        </div>
      ) : (
        <div className="relative glass-panel rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 h-[700px]">
          <svg ref={svgRef} className="w-full h-full"></svg>
          
          {/* Controls / Hints */}
          <div className="absolute bottom-6 left-6 flex gap-4">
              <div className="bg-slate-900/80 backdrop-blur border border-white/10 px-4 py-2 rounded-full text-xs text-slate-400 shadow-lg flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
                 Hover nodes to focus dependencies
              </div>
              <div className="bg-slate-900/80 backdrop-blur border border-white/10 px-4 py-2 rounded-full text-xs text-slate-400 shadow-lg flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-white/50"></span>
                 Drag to rearrange layout
              </div>
          </div>

          <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-white/10 text-xs text-slate-300 shadow-xl w-48">
             <h4 className="font-bold text-white mb-3 uppercase tracking-wider border-b border-white/10 pb-2">Graph Legend</h4>
             
             <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span>Process</span>
                    <div className="w-4 h-4 rounded-full border border-neon-cyan bg-slate-800"></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span>Resource</span>
                    <div className="w-4 h-4 rounded border border-neon-green bg-slate-800 flex justify-center items-center gap-0.5">
                        <div className="w-0.5 h-0.5 bg-neon-green rounded-full"></div>
                        <div className="w-0.5 h-0.5 bg-neon-green rounded-full"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span>Allocation</span>
                    <div className="w-8 h-0.5 bg-neon-green relative">
                         <div className="absolute right-0 -top-1 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-neon-green"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span>Request</span>
                    <div className="w-8 h-0.5 bg-neon-cyan border-b border-dashed border-neon-cyan relative">
                         <div className="absolute right-0 -top-1 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-neon-cyan"></div>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RAGVisualization;