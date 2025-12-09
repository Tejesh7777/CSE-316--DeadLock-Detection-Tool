
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white min-h-[calc(100vh-64px)]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] -translate-y-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[100px] translate-y-1/2 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-[float_6s_ease-in-out_infinite]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
              Deadlock
            </span>
            <br />
            <span className="text-4xl md:text-5xl text-slate-300">Detection Suite</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            A premium educational tool for Operating Systems. Visualize the 
            <span className="text-neon-blue font-mono mx-1">Banker's Algorithm</span>, 
            detect cycles in <span className="text-neon-pink font-mono mx-1">Wait-For Graphs</span>, 
            and analyze <span className="text-neon-green font-mono mx-1">Resource Allocation</span> in real-time.
          </p>
          
          {/* Main Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            <Link to="/detector" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full bg-slate-900 border border-slate-700 hover:border-neon-blue rounded-xl p-6 flex flex-col items-center text-center transition-transform transform group-hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-neon-blue/20 text-neon-blue flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
                <h3 className="text-lg font-bold text-white mb-2">Deadlock Detector</h3>
                <p className="text-sm text-slate-400">Run Banker's Algorithm with detailed matrices and safety checks.</p>
              </div>
            </Link>

            <Link to="/rag" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-blue rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full bg-slate-900 border border-slate-700 hover:border-neon-green rounded-xl p-6 flex flex-col items-center text-center transition-transform transform group-hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-neon-green/20 text-neon-green flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🕸️</div>
                <h3 className="text-lg font-bold text-white mb-2">RAG Visualization</h3>
                <p className="text-sm text-slate-400">View Resource Allocation Graphs with Request & Allocation edges.</p>
              </div>
            </Link>

            <Link to="/wag" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-pink to-neon-purple rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full bg-slate-900 border border-slate-700 hover:border-neon-pink rounded-xl p-6 flex flex-col items-center text-center transition-transform transform group-hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-neon-pink/20 text-neon-pink flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🔄</div>
                <h3 className="text-lg font-bold text-white mb-2">WFG Visualization</h3>
                <p className="text-sm text-slate-400">Detect circular waits and deadlocks in Wait-For Graphs.</p>
              </div>
            </Link>

            <Link to="/about" className="group relative">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-500 to-slate-300 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
               <div className="relative h-full bg-slate-900 border border-slate-700 hover:border-white rounded-xl p-6 flex flex-col items-center text-center transition-transform transform group-hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📚</div>
                <h3 className="text-lg font-bold text-white mb-2">About Deadlocks</h3>
                <p className="text-sm text-slate-400">Learn about Coffman conditions and deadlock handling.</p>
              </div>
            </Link>
          
          </div>
        </div>

        {/* Visual Comparisons Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
          
          {/* Safe State */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-neon-green relative overflow-hidden group hover:bg-slate-800/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-32 h-32 text-neon-green" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-neon-green transition-colors">Safe State</h2>
            <div className="h-48 flex items-center justify-center relative my-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
               {/* Animation of flow */}
               <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded bg-slate-800 border border-slate-600 flex items-center justify-center font-mono text-slate-400">P1</div>
                  <div className="flex space-x-1 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                      <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                      <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                  </div>
                  <div className="w-16 h-16 rounded bg-slate-800 border border-slate-600 flex items-center justify-center font-mono text-neon-green border-neon-green shadow-[0_0_15px_rgba(34,197,94,0.3)]">Res</div>
               </div>
               <div className="absolute bottom-2 text-xs text-slate-500 font-mono">Simulated Execution Flow</div>
            </div>
            <p className="text-slate-300">
              In a safe state, the system can allocate resources to each process in some order (Safe Sequence) and avoid deadlock.
            </p>
          </div>

          {/* Deadlock State */}
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-neon-pink relative overflow-hidden group hover:bg-slate-800/50 transition-colors">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-32 h-32 text-neon-pink" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-neon-pink transition-colors">Deadlock</h2>
            <div className="h-48 flex items-center justify-center relative my-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
               {/* Locked Cycle */}
               <svg className="w-40 h-40" viewBox="0 0 100 100">
                  <defs>
                    <marker id="arrow-head" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                       <path d="M0,0 L4,2 L0,4 Z" fill="#ef4444" />
                    </marker>
                  </defs>
                  <circle cx="50" cy="20" r="10" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="80" cy="70" r="10" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <circle cx="20" cy="70" r="10" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <path d="M55 28 L75 62" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-head)" className="animate-pulse" />
                  <path d="M75 75 L25 75" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-head)" className="animate-pulse" />
                  <path d="M25 62 L45 28" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-head)" className="animate-pulse" />
               </svg>
            </div>
            <p className="text-slate-300">
              A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;
