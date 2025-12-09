
import React, { useState } from 'react';

const AboutDeadlock: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      
      {/* University Branding Header */}
      <div className="bg-[#050810] border-b border-white/5 py-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-50"></div>
        <h1 className="text-sm md:text-base font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 uppercase font-sans">
          Lovely Professional University
        </h1>
        <p className="text-[10px] text-neon-blue tracking-widest mt-1 uppercase opacity-80">
          Department of Computer Science & Engineering
        </p>
      </div>

      {/* 1. Hero Section */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-xs font-bold tracking-widest uppercase">
            Operating Systems Module
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Understanding <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-cyan">Deadlocks</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            A visual guide to one of the most critical problems in computing. 
            When processes freeze because they are waiting for each other indefinitely.
          </p>

          {/* Hero Animation: Circular Wait */}
          <div className="w-full max-w-md mx-auto h-64 relative">
             <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,200,255,0.3)]">
                <defs>
                   <marker id="head-red" markerWidth="3" markerHeight="3" refX="2.5" refY="1.5" orient="auto">
                      <path d="M0,0 L3,1.5 L0,3 Z" fill="#ef4444" />
                   </marker>
                   <filter id="glow-hero">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                      <feMerge>
                         <feMergeNode in="coloredBlur"/>
                         <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                   </filter>
                </defs>
                
                {/* Connecting Lines (Cycle) */}
                <path d="M100 20 L180 100" stroke="#ef4444" strokeWidth="2" markerEnd="url(#head-red)" className="animate-[dash_3s_linear_infinite]" strokeDasharray="5,5" />
                <path d="M180 100 L100 180" stroke="#ef4444" strokeWidth="2" markerEnd="url(#head-red)" className="animate-[dash_3s_linear_infinite]" strokeDasharray="5,5" />
                <path d="M100 180 L20 100" stroke="#ef4444" strokeWidth="2" markerEnd="url(#head-red)" className="animate-[dash_3s_linear_infinite]" strokeDasharray="5,5" />
                <path d="M20 100 L100 20" stroke="#ef4444" strokeWidth="2" markerEnd="url(#head-red)" className="animate-[dash_3s_linear_infinite]" strokeDasharray="5,5" />

                {/* Nodes */}
                <circle cx="100" cy="20" r="15" fill="#0A0F1F" stroke="#32F5FF" strokeWidth="2" filter="url(#glow-hero)" />
                <text x="100" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">P1</text>
                
                <rect x="165" y="85" width="30" height="30" rx="4" fill="#0A0F1F" stroke="#00FF9D" strokeWidth="2" filter="url(#glow-hero)" />
                <text x="180" y="104" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">R1</text>
                
                <circle cx="100" cy="180" r="15" fill="#0A0F1F" stroke="#32F5FF" strokeWidth="2" filter="url(#glow-hero)" />
                <text x="100" y="184" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">P2</text>

                <rect x="5" y="85" width="30" height="30" rx="4" fill="#0A0F1F" stroke="#00FF9D" strokeWidth="2" filter="url(#glow-hero)" />
                <text x="20" y="104" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">R2</text>
             </svg>
             <div className="absolute -bottom-4 w-full text-center text-xs text-red-400 font-mono animate-pulse">
                System Halted: Circular Dependency Detected
             </div>
          </div>
        </div>
      </div>

      {/* 2. What is Deadlock */}
      <div className="max-w-6xl mx-auto px-4 py-16">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl font-bold mb-6 border-l-4 border-neon-blue pl-4">What is a Deadlock?</h2>
               <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                  Imagine four cars approaching a narrow intersection from four different directions at the same time. 
                  Each car blocks the other, and no one can back up. This is a deadlock.
               </p>
               <p className="text-slate-400 mb-8">
                  In Operating Systems, a deadlock occurs when a set of processes are blocked because each process 
                  is holding a resource and waiting for another resource acquired by some other process.
               </p>
               
               <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                  <h4 className="text-neon-cyan font-bold mb-2 text-sm uppercase">Real Life Analogy</h4>
                  <p className="text-sm text-slate-300">
                     "You have the key to my house, and I have the key to your house. 
                     We both want to enter our own houses, but neither of us is willing to give up the key we hold."
                  </p>
               </div>
            </div>

            {/* Visual Comparison */}
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl border-l-4 border-green-500">
                   <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Safe State
                   </h3>
                   <div className="h-20 flex items-center justify-center gap-4 relative">
                       <div className="px-4 py-2 bg-slate-800 rounded border border-green-500/30 text-white">P1</div>
                       <div className="text-slate-500">→</div>
                       <div className="w-12 h-12 border border-green-500 rounded flex items-center justify-center text-green-500 text-xs">RES</div>
                       <div className="text-slate-500">→</div>
                       <div className="text-xs text-slate-400">P1 Finishes</div>
                   </div>
                   <p className="text-xs text-slate-400 text-center mt-2">Resources flow freely. Processes complete one by one.</p>
                </div>

                <div className="glass-panel p-6 rounded-xl border-l-4 border-red-500 relative overflow-hidden">
                   <div className="absolute inset-0 bg-red-900/10 z-0"></div>
                   <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2 relative z-10">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Deadlock State
                   </h3>
                   <div className="h-24 flex items-center justify-center relative z-10">
                      <svg width="200" height="80" viewBox="0 0 200 80">
                         <circle cx="40" cy="40" r="15" fill="#1e293b" stroke="#ef4444" strokeWidth="2"/>
                         <text x="40" y="44" textAnchor="middle" fill="white" fontSize="10">P1</text>
                         
                         <circle cx="160" cy="40" r="15" fill="#1e293b" stroke="#ef4444" strokeWidth="2"/>
                         <text x="160" y="44" textAnchor="middle" fill="white" fontSize="10">P2</text>

                         <rect x="90" y="10" width="20" height="20" fill="none" stroke="#ef4444" />
                         <rect x="90" y="50" width="20" height="20" fill="none" stroke="#ef4444" />
                         
                         {/* Arrows showing holding and waiting */}
                         <path d="M55 40 L90 20" stroke="#ef4444" markerEnd="url(#head-red)" strokeDasharray="3,3" className="animate-[dash_1s_linear_infinite]" />
                         <path d="M145 40 L110 60" stroke="#ef4444" markerEnd="url(#head-red)" strokeDasharray="3,3" className="animate-[dash_1s_linear_infinite]" />
                         
                         <path d="M100 30 L145 40" stroke="#00ff9d" strokeWidth="2" opacity="0.5" />
                         <path d="M100 50 L55 40" stroke="#00ff9d" strokeWidth="2" opacity="0.5" />
                      </svg>
                   </div>
                   <p className="text-xs text-slate-400 text-center mt-2 relative z-10">P1 holds R2, waits for R1. P2 holds R1, waits for R2.</p>
                </div>
            </div>
         </div>
      </div>

      {/* 3. Coffman Conditions */}
      <div className="bg-[#050810] py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-4">The Four Coffman Conditions</h2>
           <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
             For a deadlock to occur, these four conditions must hold simultaneously. 
             If we break even one, deadlock is impossible.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CoffmanCard 
                title="Mutual Exclusion" 
                desc="Resources cannot be shared. Only one process can use a resource at a time."
                icon="🔒"
                color="neon-blue"
              />
              <CoffmanCard 
                title="Hold & Wait" 
                desc="A process holding at least one resource is waiting to acquire additional resources held by others."
                icon="✋"
                color="neon-purple"
              />
              <CoffmanCard 
                title="No Preemption" 
                desc="A resource cannot be taken from a process forcibly. It must be released voluntarily."
                icon="🚫"
                color="neon-pink"
              />
              <CoffmanCard 
                title="Circular Wait" 
                desc="A set of processes exists such that each process is waiting for the next process in the chain."
                icon="⭕"
                color="neon-green"
              />
           </div>
        </div>
      </div>

      {/* 4. Deadlock Formation Animation */}
      <FormationSection />

      {/* 5. Single vs Multi Instance */}
      <div className="max-w-6xl mx-auto px-4 py-16">
         <h2 className="text-3xl font-bold text-center mb-12">Resource Instances Matter</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="glass-panel p-6 rounded-xl">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                    Single Instance
                    <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/30">Cycle = Deadlock</span>
                 </h3>
                 <div className="h-48 bg-[#050810] rounded-lg border border-white/5 flex items-center justify-center relative">
                    <svg width="200" height="150" viewBox="0 0 200 150">
                        {/* Cycle Logic */}
                        <circle cx="100" cy="30" r="15" fill="#1e293b" stroke="#ef4444" />
                        <text x="100" y="35" textAnchor="middle" fill="white" fontSize="10">P1</text>
                        <rect x="90" y="110" width="20" height="20" fill="none" stroke="#ef4444" />
                        <circle cx="100" cy="120" r="3" fill="#fff" />
                        
                        <path d="M100 45 L100 110" stroke="#32F5FF" strokeDasharray="4,2" markerEnd="url(#head-red)" />
                        <path d="M110 120 L130 120 C160 120 160 30 115 30" stroke="#00FF9D" fill="none" markerEnd="url(#head-red)" />
                        <text x="140" y="80" fill="#ef4444" fontSize="10">Cycle</text>
                    </svg>
                 </div>
                 <p className="mt-4 text-sm text-slate-400">
                    If each resource has only 1 instance, a cycle in the Resource Allocation Graph <strong>always</strong> implies a deadlock.
                 </p>
             </div>

             <div className="glass-panel p-6 rounded-xl">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                    Multi Instance
                    <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">Cycle ≠ Deadlock</span>
                 </h3>
                 <div className="h-48 bg-[#050810] rounded-lg border border-white/5 flex items-center justify-center relative">
                    <svg width="200" height="150" viewBox="0 0 200 150">
                         {/* Multi Logic */}
                        <circle cx="60" cy="40" r="15" fill="#1e293b" stroke="#fff" />
                        <text x="60" y="45" textAnchor="middle" fill="white" fontSize="10">P1</text>
                        
                        <circle cx="140" cy="40" r="15" fill="#1e293b" stroke="#fff" />
                        <text x="140" y="45" textAnchor="middle" fill="white" fontSize="10">P2</text>

                        <rect x="85" y="100" width="30" height="30" fill="none" stroke="#00FF9D" />
                        {/* Two dots */}
                        <circle cx="95" cy="115" r="3" fill="#fff" />
                        <circle cx="105" cy="115" r="3" fill="#fff" />

                        {/* P1 holds one */}
                        <path d="M95 115 L60 55" stroke="#00FF9D" />
                        {/* P2 waits for one */}
                        <path d="M140 55 L105 100" stroke="#32F5FF" strokeDasharray="4,2" />
                        
                        {/* Even if P2 waits, if another instance is free (or held by non-cyclic P3), no deadlock */}
                        <text x="100" y="90" textAnchor="middle" fill="#00FF9D" fontSize="10">2 Instances</text>
                    </svg>
                 </div>
                 <p className="mt-4 text-sm text-slate-400">
                    With multiple instances, a cycle is <strong>necessary</strong> but not sufficient for deadlock. Another process might release a resource instance to break the cycle.
                 </p>
             </div>
         </div>
      </div>

      {/* 6. Safe Sequence & Solutions */}
      <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Handling Deadlocks</h2>
          
          <div className="space-y-4">
              <Accordion 
                title="Deadlock Avoidance (Banker's Algorithm)" 
                icon="🛡️"
                content={
                   <div className="space-y-4">
                      <p>
                        We analyze the state of the system <strong>before</strong> granting a resource request. 
                        If granting the request leads to an unsafe state (where deadlock is possible), we deny/delay it.
                      </p>
                      <div className="p-4 bg-slate-900 rounded border border-neon-blue/20">
                         <div className="flex items-center gap-2 mb-2 text-neon-blue font-bold text-xs uppercase">Visual Logic</div>
                         <div className="flex items-center justify-between text-sm font-mono text-slate-400">
                            <div>Available: [3, 2]</div>
                            <div className="text-white">→</div>
                            <div>Check Need ≤ Available</div>
                            <div className="text-white">→</div>
                            <div className="text-neon-green">Simulate Run</div>
                         </div>
                      </div>
                   </div>
                }
              />
              <Accordion 
                title="Deadlock Detection" 
                icon="🔍"
                content={
                   <div className="space-y-4">
                      <p>
                        We let the system run freely but periodically check for deadlocks. 
                        If a deadlock is found, we recover from it.
                      </p>
                      <ul className="list-disc pl-5 text-slate-400 text-sm space-y-2">
                         <li><strong>Single Instance:</strong> Use Wait-For Graph (Cycle Detection).</li>
                         <li><strong>Multi Instance:</strong> Look for a safety sequence (similar to Banker's). If none exists, the unfinished processes are deadlocked.</li>
                      </ul>
                   </div>
                }
              />
              <Accordion 
                title="Deadlock Recovery" 
                icon="🚑"
                content={
                   <div className="space-y-4">
                      <p>Once detected, we must break the deadlock. Common methods include:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="bg-red-900/20 border border-red-500/30 p-3 rounded text-center">
                            <div className="font-bold text-red-400 mb-1">Process Termination</div>
                            <div className="text-xs text-slate-400">Kill one or all deadlocked processes.</div>
                         </div>
                         <div className="bg-orange-900/20 border border-orange-500/30 p-3 rounded text-center">
                            <div className="font-bold text-orange-400 mb-1">Resource Preemption</div>
                            <div className="text-xs text-slate-400">Take resources away from some processes.</div>
                         </div>
                         <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded text-center">
                            <div className="font-bold text-blue-400 mb-1">Rollback</div>
                            <div className="text-xs text-slate-400">Return process to a safe checkpoint.</div>
                         </div>
                      </div>
                   </div>
                }
              />
          </div>
      </div>

      {/* Footer Note */}
      <div className="mt-20 text-center border-t border-white/5 pt-12 pb-8">
         <div className="inline-block p-1 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple mb-4">
            <div className="bg-slate-900 rounded-full px-6 py-2">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 font-bold">
                 Visual Learning Module
               </span>
            </div>
         </div>
         <p className="text-slate-500 text-sm">
            Created for <strong className="text-white">Lovely Professional University</strong> students for better understanding of Operating Systems.
         </p>
      </div>

    </div>
  );
};

// --- Sub-Components ---

const CoffmanCard: React.FC<{title: string, desc: string, icon: string, color: string}> = ({title, desc, icon, color}) => {
    // Map string color name to tailwind classes roughly
    const borderColor = 
        color === 'neon-blue' ? 'group-hover:border-neon-blue' : 
        color === 'neon-purple' ? 'group-hover:border-neon-purple' :
        color === 'neon-pink' ? 'group-hover:border-neon-pink' :
        'group-hover:border-neon-green';

    const textColor = 
        color === 'neon-blue' ? 'group-hover:text-neon-blue' : 
        color === 'neon-purple' ? 'group-hover:text-neon-purple' :
        color === 'neon-pink' ? 'group-hover:text-neon-pink' :
        'group-hover:text-neon-green';

    return (
        <div className={`glass-panel p-6 rounded-xl border border-transparent transition-all duration-300 group hover:-translate-y-2 ${borderColor}`}>
             <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">{icon}</div>
             <h3 className={`text-lg font-bold text-white mb-2 transition-colors ${textColor}`}>{title}</h3>
             <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}

const FormationSection: React.FC = () => {
    const [step, setStep] = useState(0);
    
    const steps = [
        "System Start: Resources are free.",
        "P1 requests and acquires R1.",
        "P2 requests and acquires R2.",
        "P1 needs R2 (Blocked).",
        "P2 needs R1 (Blocked).",
        "Deadlock! Circular Wait Established."
    ];

    return (
        <div className="bg-slate-800/30 py-16 border-y border-white/5">
           <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">How Deadlock Forms</h2>
              
              <div className="glass-panel p-8 rounded-2xl relative min-h-[400px] flex flex-col items-center">
                  {/* Visualization Area */}
                  <div className="w-full h-64 relative mb-8 border border-white/5 rounded-xl bg-[#050810] overflow-hidden">
                      <svg viewBox="0 0 400 200" className="w-full h-full">
                          <defs>
                              <marker id="arrow-anim" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                                  <path d="M0,0 L4,2 L0,4 Z" fill="#94a3b8" />
                              </marker>
                          </defs>

                          {/* Static Elements */}
                          <circle cx="100" cy="100" r="20" fill="#1e293b" stroke="white" strokeWidth="2" />
                          <text x="100" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">P1</text>
                          
                          <circle cx="300" cy="100" r="20" fill="#1e293b" stroke="white" strokeWidth="2" />
                          <text x="300" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">P2</text>

                          <rect x="180" y="40" width="40" height="40" rx="4" fill="#0f172a" stroke="#00FF9D" />
                          <text x="200" y="65" textAnchor="middle" fill="#00FF9D" fontSize="12">R1</text>
                          
                          <rect x="180" y="120" width="40" height="40" rx="4" fill="#0f172a" stroke="#00FF9D" />
                          <text x="200" y="145" textAnchor="middle" fill="#00FF9D" fontSize="12">R2</text>

                          {/* Dynamic Elements based on step */}
                          
                          {/* Step 1: P1 -> R1 (Acquire) */}
                          {step >= 1 && (
                              <line x1="120" y1="90" x2="180" y2="60" stroke="#00FF9D" strokeWidth="2" className="animate-[grow_0.5s_ease-out]" />
                          )}
                          
                          {/* Step 2: P2 -> R2 (Acquire) */}
                          {step >= 2 && (
                              <line x1="280" y1="110" x2="220" y2="140" stroke="#00FF9D" strokeWidth="2" className="animate-[grow_0.5s_ease-out]" />
                          )}

                          {/* Step 3: P1 -> R2 (Request/Wait) */}
                          {step >= 3 && (
                              <line x1="120" y1="110" x2="180" y2="140" stroke="#32F5FF" strokeWidth="2" strokeDasharray="5,5" className={step >= 5 ? "opacity-100" : "animate-pulse"} />
                          )}

                          {/* Step 4: P2 -> R1 (Request/Wait) */}
                          {step >= 4 && (
                              <line x1="280" y1="90" x2="220" y2="60" stroke="#32F5FF" strokeWidth="2" strokeDasharray="5,5" className={step >= 5 ? "opacity-100" : "animate-pulse"} />
                          )}

                          {/* Step 5: Deadlock Highlight */}
                          {step >= 5 && (
                              <circle cx="200" cy="100" r="90" fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.5" className="animate-pulse" />
                          )}

                      </svg>
                  </div>

                  {/* Controls */}
                  <div className="w-full flex flex-col items-center">
                      <div className="text-xl font-bold text-white mb-2 h-8 text-center">{steps[step]}</div>
                      <div className="flex gap-2 mb-4">
                          {steps.map((_, i) => (
                              <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === step ? 'bg-neon-blue scale-125' : i < step ? 'bg-neon-blue/50' : 'bg-slate-700'}`}></div>
                          ))}
                      </div>
                      <div className="flex gap-4">
                          <button 
                            disabled={step === 0}
                            onClick={() => setStep(s => Math.max(0, s - 1))}
                            className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm"
                          >
                            Previous
                          </button>
                          <button 
                            disabled={step === steps.length - 1}
                            onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                            className="px-6 py-2 rounded bg-btn-gradient text-white font-bold hover:shadow-[0_0_15px_rgba(0,200,255,0.5)] disabled:opacity-50 text-sm"
                          >
                            {step === steps.length - 1 ? 'Simulation Complete' : 'Next Step'}
                          </button>
                      </div>
                  </div>
              </div>
           </div>
        </div>
    );
}

const Accordion: React.FC<{title: string, icon: string, content: React.ReactNode}> = ({title, icon, content}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900/50">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-bold text-white">{title}</span>
                </div>
                <span className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-white/10 bg-[#050810] text-slate-300">
                    {content}
                </div>
            )}
        </div>
    );
}

export default AboutDeadlock;
