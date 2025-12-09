
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { generateGraphData } from '../services/logic';

const WAGVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState('');
  const [hasCycle, setHasCycle] = useState(false);
  const [cyclePath, setCyclePath] = useState<string[]>([]);
  
  // We use a ref for D3 updates to avoid stale closures in event handlers
  const cycleDataRef = useRef<{ nodes: Set<string>, links: Set<string> }>({ nodes: new Set(), links: new Set() });
  const wagLinksRef = useRef<any[]>([]); // Store current links data for lookup in render

  const highlightNodes = (active: boolean) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const { nodes: cycleNodes } = cycleDataRef.current;

    if (active) {
       svg.selectAll('.wag-link').transition().duration(200).style('opacity', 0.1);
       svg.selectAll('.wag-label').transition().duration(200).style('opacity', 0);
       svg.selectAll('.wag-node circle')
          .transition().duration(200)
          .attr('r', 25)
          .attr('stroke', '#fff')
          .attr('fill', '#0f172a');
    } else {
       // Restore opacity. For labels, only show if they are part of cycle (based on default state logic below)
       svg.selectAll('.wag-link').transition().duration(200).style('opacity', 1);
       
       // Re-apply label visibility logic
       const { links: cycleLinks } = cycleDataRef.current;
       svg.selectAll('.wag-label').transition().duration(200).style('opacity', (d: any) => {
             const id = `${d.source.id || d.source}-${d.target.id || d.target}`;
             return cycleLinks.has(id) ? 1 : 0;
       });

       svg.selectAll('.wag-node circle')
          .transition().duration(200)
          .attr('r', 20)
          .attr('stroke', (d: any) => cycleNodes.has(d.id) ? '#ef4444' : '#00f3ff')
          .attr('fill', '#1e293b');
    }
  };

  const highlightLinks = (active: boolean) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const { links: cycleLinks } = cycleDataRef.current;

    if (active) {
       svg.selectAll('.wag-node').transition().duration(200).style('opacity', 0.2);
       svg.selectAll('.wag-link')
          .transition().duration(200)
          .attr('stroke', '#ff00ff')
          .attr('stroke-width', 3)
          .attr('marker-end', 'url(#arrowhead-highlight)');
    } else {
       svg.selectAll('.wag-node').transition().duration(200).style('opacity', 1);
       svg.selectAll('.wag-link')
          .transition().duration(200)
          .attr('stroke', (d: any) => {
               const id = `${d.source.id || d.source}-${d.target.id || d.target}`;
               return cycleLinks.has(id) ? '#ef4444' : '#94a3b8';
          })
          .attr('stroke-width', (d: any) => {
               const id = `${d.source.id || d.source}-${d.target.id || d.target}`;
               return cycleLinks.has(id) ? 3 : 2;
          })
          .attr('marker-end', (d: any) => {
               const id = `${d.source.id || d.source}-${d.target.id || d.target}`;
               return cycleLinks.has(id) ? 'url(#arrowhead-cycle)' : 'url(#arrowhead)';
          });
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('deadlockData');
    if (!savedData) {
      setError('No data found. Please run the Detector first.');
      return;
    }

    const { numProcesses, numResources, totalResources, allocation, request } = JSON.parse(savedData);
    const resources = totalResources.map((t:number, i:number) => ({id:i, name:`R${i}`, totalInstances: t}));
    
    // Generate graph using updated logic from service
    const { wagNodes, wagLinks } = generateGraphData(numProcesses, numResources, resources, allocation, request);
    wagLinksRef.current = wagLinks;

    const cycleNodes = new Set<string>();
    const cycleLinks = new Set<string>();
    let detectedPath: string[] = [];
    
    // DFS for cycle visualization
    const adj = new Map<string, string[]>();
    wagNodes.forEach(n => adj.set(n.id, []));
    wagLinks.forEach(l => {
        const s = l.source as string;
        const t = l.target as string;
        if(!adj.has(s)) adj.set(s, []);
        adj.get(s)?.push(t);
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];

    function dfs(u: string): boolean {
        visited.add(u);
        recStack.add(u);
        path.push(u);

        const neighbors = adj.get(u) || [];
        for(const v of neighbors) {
            if(!visited.has(v)) {
                if(dfs(v)) return true;
            } else if(recStack.has(v)) {
                // Cycle found
                const startIdx = path.indexOf(v);
                if (startIdx !== -1) {
                    const cycleSegment = path.slice(startIdx);
                    cycleSegment.forEach(nodeId => cycleNodes.add(nodeId));
                    for(let i=0; i<cycleSegment.length; i++) {
                        const from = cycleSegment[i];
                        const to = cycleSegment[(i+1)%cycleSegment.length];
                        cycleLinks.add(`${from}-${to}`);
                    }
                    if (detectedPath.length === 0) {
                        detectedPath = [...cycleSegment];
                    }
                }
                return true;
            }
        }
        recStack.delete(u);
        path.pop();
        return false;
    }

    for(const n of wagNodes) {
        if(!visited.has(n.id)) {
            dfs(n.id);
        }
    }

    setHasCycle(cycleNodes.size > 0);
    setCyclePath(detectedPath);
    cycleDataRef.current = { nodes: cycleNodes, links: cycleLinks };

    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append('defs');
    
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28) 
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#94a3b8');
    
    defs.append('marker')
      .attr('id', 'arrowhead-highlight')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28) 
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#ff00ff');

    defs.append('marker')
      .attr('id', 'arrowhead-cycle')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28) 
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#ef4444');

    const simulation = d3.forceSimulation(wagNodes as any)
      .force('link', d3.forceLink(wagLinks).id((d: any) => d.id).distance(180))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(45));

    // Links with Animation
    const link = svg.append('g')
      .selectAll('line')
      .data(wagLinks)
      .enter().append('line')
      .attr('class', 'wag-link edge-flow') 
      .attr('stroke', (d: any) => {
         const id = `${d.source.id || d.source}-${d.target.id || d.target}`;
         return cycleLinks.has(id) ? '#ef4444' : '#94a3b8';
      })
      .attr('stroke-width', (d: any) => {
         const id = `${d.source.id || d.source}-${d.target.id || d.target}`;
         return cycleLinks.has(id) ? 3 : 2;
      })
      .attr('stroke-dasharray', '5,5')
      .attr('marker-end', (d: any) => {
         const id = `${d.source.id || d.source}-${d.target.id || d.target}`;
         return cycleLinks.has(id) ? 'url(#arrowhead-cycle)' : 'url(#arrowhead)';
      });

    // Link Labels (Resource Names) - Only show for Cycle
    const linkLabel = svg.append('g')
      .selectAll('text')
      .data(wagLinks)
      .enter().append('text')
      .attr('class', 'wag-label')
      .text((d: any) => `Waiting for ${d.label}`)
      .attr('fill', '#ef4444')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .attr('dy', -8)
      .attr('opacity', (d: any) => {
          const id = `${d.source.id || d.source}-${d.target.id || d.target}`;
          return cycleLinks.has(id) ? 1 : 0; // Default: show only if in cycle
      })
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,1)');

    const node = svg.append('g')
      .selectAll('g')
      .data(wagNodes)
      .enter().append('g')
      .attr('class', 'wag-node') 
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    node.append('circle')
      .attr('r', 20)
      .attr('fill', '#1e293b') 
      .attr('stroke', (d: any) => cycleNodes.has(d.id) ? '#ef4444' : '#00f3ff') 
      .attr('stroke-width', 2)
      .attr('class', 'filter drop-shadow-[0_0_5px_rgba(0,243,255,0.5)] cursor-pointer transition-all duration-200');

    node.append('text')
      .text(d => d.label)
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

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

  // Helper to format cycle string with resources
  const renderCycleChain = () => {
    if (cyclePath.length === 0) return null;
    
    return (
        <span className="font-mono text-red-300 font-bold">
            {cyclePath.map((pId, i) => {
                const nextId = cyclePath[(i + 1) % cyclePath.length];
                // Find link label
                const link = wagLinksRef.current.find((l: any) => 
                    (l.source.id === pId || l.source === pId) && 
                    (l.target.id === nextId || l.target === nextId)
                );
                const resourceLabel = link ? link.label : '?';
                
                return (
                    <span key={i}>
                        {pId} <span className="text-slate-500 mx-1">→</span> 
                        <span className="text-xs bg-red-900/50 text-red-200 px-1 rounded mx-1 whitespace-nowrap">
                            (Waiting: {resourceLabel})
                        </span> 
                        <span className="text-slate-500 mx-1">→</span>
                    </span>
                );
            })}
            {cyclePath[0]}
        </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-white">Wait-For Graph (WFG)</h1>
           <p className="text-slate-400">
             Nodes represent processes. <span className="text-neon-pink">Animated arrows</span> show dependencies.
           </p>
        </div>
        {hasCycle && (
            <div className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse">
                <span className="text-3xl">⚠️</span>
                <div>
                    <h3 className="font-bold text-red-500 text-base uppercase tracking-wider">Cycle Detected</h3>
                    <p className="text-red-400 text-sm">Deadlock confirmed</p>
                </div>
            </div>
        )}
      </div>

      {error ? (
        <div className="p-4 bg-red-900/30 border border-red-500 text-red-300 rounded-lg">
          {error} <br/> <a href="/#/detector" className="underline">Go to Detector</a>
        </div>
      ) : (
        <>
          <div className={`relative glass-panel rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] h-[500px] ${hasCycle ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : ''}`}>
            <svg ref={svgRef} className="w-full h-full"></svg>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-lg shadow-xl z-10 w-64">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Interactive Legend</h3>
              
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer group p-2 rounded hover:bg-white/5 transition-all"
                onMouseEnter={() => highlightNodes(true)}
                onMouseLeave={() => highlightNodes(false)}
              >
                <div className="w-6 h-6 rounded-full border-2 border-neon-blue bg-slate-800 shadow-[0_0_10px_rgba(0,243,255,0.5)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-[8px] text-white">Px</span>
                </div>
                <div>
                  <span className="text-sm text-white font-medium block group-hover:text-neon-blue transition-colors">Process Node</span>
                  <span className="text-xs text-slate-500">Hover to highlight</span>
                </div>
              </div>

              <div 
                className="flex items-center gap-3 cursor-pointer group p-2 rounded hover:bg-white/5 transition-all"
                onMouseEnter={() => highlightLinks(true)}
                onMouseLeave={() => highlightLinks(false)}
              >
                <div className="w-8 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-slate-400 group-hover:bg-neon-pink group-hover:h-1 transition-all relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-slate-400 group-hover:border-l-neon-pink border-b-[3px] border-b-transparent"></div>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-white font-medium block group-hover:text-neon-pink transition-colors">Wait-For Edge</span>
                  <span className="text-xs text-slate-500">Hover to highlight</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Cycle Explanation */}
          {hasCycle && cyclePath.length > 0 && (
            <div className="mt-6 p-6 bg-slate-800/50 border border-red-500/30 rounded-xl animate-[float_0.5s_ease-out]">
                <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span> Circular Wait Analysis
                </h3>
                <p className="text-slate-300 mb-4">
                  Cycle detected: {renderCycleChain()}.
                </p>
                <p className="text-sm text-slate-400">
                    Processes in this loop are indefinitely waiting for specific resource instances held by the next process in the chain.
                </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WAGVisualization;
