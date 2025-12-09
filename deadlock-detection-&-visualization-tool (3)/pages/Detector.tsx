
import React, { useState, useEffect, useMemo } from 'react';
import MatrixInput from '../components/MatrixInput';
import { detectDeadlock } from '../services/logic';
import { DetectionResult } from '../types';

const SafeSequenceAnimator: React.FC<{ sequence: number[] }> = ({ sequence }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  
  useEffect(() => {
    setActiveIndex(0);
  }, [sequence]);

  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < sequence.length) {
      const timer = setTimeout(() => {
        setActiveIndex((prev) => prev + 1);
      }, 800); // 800ms per step
      return () => clearTimeout(timer);
    }
  }, [activeIndex, sequence.length]);

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2 mb-2 min-h-[48px]">
        {sequence.map((p, i) => {
          const isActive = i === activeIndex;
          const isCompleted = i < activeIndex;
          
          let className = "w-10 h-10 rounded flex items-center justify-center border transition-all duration-500 ";
          
          if (isActive) {
            className += "bg-neon-blue/20 border-neon-blue text-white scale-125 shadow-[0_0_15px_rgba(0,243,255,0.6)] font-bold z-10 ring-2 ring-neon-blue/50";
          } else if (isCompleted) {
            className += "bg-green-900/20 border-green-500 text-green-400";
          } else {
            className += "bg-[#050810] border-white/10 text-slate-500 opacity-50 scale-90";
          }

          return (
            <React.Fragment key={i}>
              <div className={className}>
                P{p}
              </div>
              {i < sequence.length - 1 && (
                <span className={`transition-colors duration-500 text-lg ${isCompleted ? 'text-green-500' : 'text-slate-700'}`}>
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex justify-between items-center text-xs h-6">
          <span className="text-neon-cyan font-mono animate-pulse">
              {activeIndex < sequence.length 
                ? `▶ Executing Process P${sequence[activeIndex]}...` 
                : '✓ Sequence Execution Complete'}
          </span>
          <button 
            onClick={() => setActiveIndex(0)}
            className={`text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-2 transition-opacity ${activeIndex < sequence.length ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            Replay Animation
          </button>
      </div>
    </div>
  );
};

const AlgorithmExplainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 border border-white/10 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#050810]/50 hover:bg-[#050810] transition-colors text-left"
      >
        <span className="text-sm font-bold text-neon-blue flex items-center gap-2">
          <span className="text-lg">ℹ️</span> Algorithm Logic & Theory
        </span>
        <span className={`text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="p-6 bg-slate-900/50 text-sm text-slate-300 border-t border-white/5 space-y-4">
          <div>
            <h4 className="font-bold text-white mb-1">What is Banker's Algorithm?</h4>
            <p>
              The Banker's Algorithm is a resource allocation and deadlock avoidance algorithm. 
              It tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources, 
              then makes an "s-state" check to test for possible activities, before deciding whether allocation should be allowed to continue.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">How We Determine the Safe Sequence</h4>
            <p className="mb-2">
              To ensure this tool produces results consistent with manual classroom calculations, we use a 
              <strong className="text-neon-green mx-1">Deterministic Rule:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>
                We iterate through processes from <strong>P0 to Pn</strong>.
              </li>
              <li>
                The <strong>first</strong> process that satisfies the condition <code className="bg-slate-800 px-1 rounded text-neon-cyan">Need ≤ Available</code> is chosen to run.
              </li>
              <li>
                Once a process finishes, its allocated resources are returned to the pool (<code className="bg-slate-800 px-1 rounded text-neon-green">Available += Allocation</code>), and we restart the scan from P0.
              </li>
            </ul>
            <p className="mt-2 text-xs italic text-slate-500">
              Note: While multiple valid safe sequences may exist (all are listed in the Intelligence Report), 
              the primary sequence shown follows this strict lowest-index logic.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Detector: React.FC = () => {
  // --- State Initialization with Persistence ---
  
  const getSavedState = () => {
    try {
        const saved = localStorage.getItem('detectorFormState');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
  };

  const savedState = getSavedState();

  // Config State
  const [numProcesses, setNumProcesses] = useState(savedState?.numProcesses ?? 5);
  const [numResources, setNumResources] = useState(savedState?.numResources ?? 3);
  const [resourcesInput, setResourcesInput] = useState(savedState?.resourcesInput ?? "3 3 2");
  
  // User Input State
  const [availableResources, setAvailableResources] = useState<number[]>(savedState?.availableResources ?? [3, 3, 2]);
  
  // Matrices (Initialize with saved or empty based on dimensions)
  const [allocation, setAllocation] = useState<number[][]>(() => {
      if (savedState?.allocation && savedState.allocation.length === numProcesses && savedState.allocation[0]?.length === numResources) {
          return savedState.allocation;
      }
      return Array(numProcesses).fill(0).map(() => Array(numResources).fill(0));
  });

  const [maxMatrix, setMaxMatrix] = useState<number[][]>(() => {
      if (savedState?.maxMatrix && savedState.maxMatrix.length === numProcesses && savedState.maxMatrix[0]?.length === numResources) {
          return savedState.maxMatrix;
      }
      return Array(numProcesses).fill(0).map(() => Array(numResources).fill(0));
  });
  
  const [result, setResult] = useState<DetectionResult | null>(savedState?.result ?? null);

  // --- Persistence Effect ---
  // Save form state whenever inputs change
  useEffect(() => {
    const stateToSave = {
        numProcesses,
        numResources,
        resourcesInput,
        availableResources,
        allocation,
        maxMatrix,
        result
    };
    localStorage.setItem('detectorFormState', JSON.stringify(stateToSave));
  }, [numProcesses, numResources, resourcesInput, availableResources, allocation, maxMatrix, result]);

  // --- Matrix Resizing Logic ---
  // Ensure matrices resize if numProcesses/numResources change
  useEffect(() => {
    setAllocation(prev => {
        if(prev.length === numProcesses && prev[0]?.length === numResources) return prev;
        // Create new matrix
        const newMat = Array(numProcesses).fill(0).map(() => Array(numResources).fill(0));
        // Copy existing values if possible
        for(let r=0; r<Math.min(prev.length, numProcesses); r++){
            for(let c=0; c<Math.min(prev[0].length, numResources); c++){
                newMat[r][c] = prev[r][c];
            }
        }
        return newMat;
    });
    setMaxMatrix(prev => {
        if(prev.length === numProcesses && prev[0]?.length === numResources) return prev;
        const newMat = Array(numProcesses).fill(0).map(() => Array(numResources).fill(0));
        for(let r=0; r<Math.min(prev.length, numProcesses); r++){
            for(let c=0; c<Math.min(prev[0].length, numResources); c++){
                newMat[r][c] = prev[r][c];
            }
        }
        return newMat;
    });
  }, [numProcesses, numResources]);

  // Derived Need
  const needMatrix = useMemo(() => {
    if (allocation.length !== numProcesses || maxMatrix.length !== numProcesses) return [];
    return allocation.map((row, i) => 
      row.map((allocVal, j) => {
        const maxVal = maxMatrix[i]?.[j] || 0;
        return Math.max(0, maxVal - allocVal);
      })
    );
  }, [allocation, maxMatrix, numProcesses, numResources]);

  // Derived Totals (for Display and RAG passing)
  const totalAllocatedVector = useMemo(() => {
    const totals = new Array(numResources).fill(0);
    allocation.forEach(row => {
      row.forEach((val, i) => totals[i] += (val || 0));
    });
    return totals;
  }, [allocation, numResources]);

  const derivedTotalVector = useMemo(() => {
    return availableResources.map((avail, i) => avail + (totalAllocatedVector[i] || 0));
  }, [availableResources, totalAllocatedVector]);

  const handleResourceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setResourcesInput(val);
    const parsed = val.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      setAvailableResources(parsed.slice(0, numResources)); 
    }
  };

  const handleMatrixChange = (matrixSetter: React.Dispatch<React.SetStateAction<number[][]>>) => (r: number, c: number, val: number) => {
    matrixSetter(prev => {
      const copy = prev.map(row => [...row]);
      copy[r][c] = val;
      return copy;
    });
  };

  // Exam Problem Preset
  const loadExamProblem = () => {
      setNumProcesses(5);
      setNumResources(3);
      setResourcesInput("3 3 2");
      setAvailableResources([3,3,2]);

      setTimeout(() => {
        setAllocation([
            [0,1,0],
            [2,0,0],
            [3,0,2],
            [2,1,1],
            [0,0,2]
        ]);
        setMaxMatrix([
            [7,5,3],
            [3,2,2],
            [9,0,2],
            [2,2,2],
            [4,3,3]
        ]);
        setResult(null); 
      }, 50);
  };

  const loadDeadlockExample = () => {
      setNumProcesses(3);
      setNumResources(3);
      setResourcesInput("0 0 0");
      setAvailableResources([0,0,0]);
      setTimeout(() => {
          setAllocation([[1,0,0],[0,1,0],[0,0,1]]);
          setMaxMatrix([[1,1,0],[0,1,1],[1,0,1]]); 
          setResult(null);
      }, 50);
  }

  const handleRunDetection = () => {
    const parsedResources = resourcesInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    const finalAvailable = [...parsedResources];
    while(finalAvailable.length < numResources) finalAvailable.push(0);
    
    const res = detectDeadlock(
      numProcesses, 
      numResources, 
      finalAvailable.slice(0, numResources), 
      allocation, 
      needMatrix
    );
    setResult(res);

    const currentTotalAlloc = new Array(numResources).fill(0);
    allocation.forEach(row => row.forEach((v, i) => currentTotalAlloc[i] += v));
    const calculatedTotal = finalAvailable.slice(0, numResources).map((av, i) => av + currentTotalAlloc[i]);

    localStorage.setItem('deadlockData', JSON.stringify({
      numProcesses,
      numResources,
      totalResources: calculatedTotal,
      allocation,
      request: needMatrix 
    }));
  };

  const processLabels = Array.from({length: numProcesses}, (_, i) => `P${i}`);
  const resourceLabels = Array.from({length: numResources}, (_, i) => `R${i}`);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-neon-cyan to-white">
            Deadlock Intelligence Engine
            </h1>
            <p className="text-slate-400 max-w-2xl">
            Strict Banker's Algorithm. Processes are checked by lowest index (P0...Pn). 
            Available updates as <span className="font-mono text-neon-green">Avail = Avail + Alloc</span> when a process finishes.
            </p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={loadExamProblem}
                className="text-xs sm:text-sm px-4 py-2 border border-neon-green/50 text-neon-green rounded-lg hover:bg-neon-green/10 transition-colors bg-[#050810]"
            >
                Load Exam Problem (Safe)
            </button>
            <button 
                onClick={loadDeadlockExample}
                className="text-xs sm:text-sm px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors bg-[#050810]"
            >
                Load Deadlock (Unsafe)
            </button>
        </div>
      </div>

      <AlgorithmExplainer />

      {/* Config */}
      <div className="glass-panel p-6 rounded-xl mb-6 border-l-4 border-neon-blue shadow-[0_0_20px_rgba(0,200,255,0.05)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Number of Processes</label>
            <input 
              type="number" min="1" max="10" 
              value={numProcesses} 
              onChange={(e) => setNumProcesses(parseInt(e.target.value) || 1)}
              className="w-full bg-[#050810] border border-white/10 rounded-lg p-2.5 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,200,255,0.2)] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Number of Resources</label>
            <input 
              type="number" min="1" max="10" 
              value={numResources} 
              onChange={(e) => setNumResources(parseInt(e.target.value) || 1)}
              className="w-full bg-[#050810] border border-white/10 rounded-lg p-2.5 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,200,255,0.2)] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neon-blue mb-2 font-bold tracking-wide">Initial Available Vector</label>
            <input 
              type="text" 
              value={resourcesInput}
              onChange={handleResourceInputChange}
              placeholder="e.g. 3 3 2"
              className="w-full bg-[#050810] border border-neon-blue/50 rounded-lg p-2.5 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,200,255,0.3)] outline-none font-mono tracking-widest"
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-8 glass-panel p-4 rounded-xl flex flex-wrap gap-4 items-center justify-center font-mono text-sm border-t border-neon-cyan/20">
          <div className="flex items-center gap-2">
            <span className="text-neon-blue font-bold">Available (In)</span>
            <span className="text-slate-500">+</span>
            <span className="text-neon-purple font-bold">Allocated</span>
            <span className="text-slate-500">=</span>
            <span className="text-white font-bold">Total (Implicit)</span>
          </div>
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="bg-[#050810] px-3 py-1.5 rounded border border-neon-blue/30 text-neon-blue shadow-[0_0_5px_rgba(0,200,255,0.1)]">
                [{availableResources.join(', ')}]
            </span>
            <span>+</span>
            <span className="bg-[#050810] px-3 py-1.5 rounded border border-neon-purple/30 text-neon-purple shadow-[0_0_5px_rgba(164,92,255,0.1)]">
                [{totalAllocatedVector.join(', ')}]
            </span>
            <span>=</span>
            <span className="bg-[#050810] px-3 py-1.5 rounded border border-white/20 text-white">
                [{derivedTotalVector.join(', ')}]
            </span>
          </div>
      </div>

      {/* Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <MatrixInput 
          title="Allocation Matrix"
          rows={numProcesses}
          cols={numResources}
          data={allocation}
          onChange={handleMatrixChange(setAllocation)}
          rowLabels={processLabels}
          colLabels={resourceLabels}
          color="purple"
        />
        <MatrixInput 
          title="Max Matrix"
          rows={numProcesses}
          cols={numResources}
          data={maxMatrix}
          onChange={handleMatrixChange(setMaxMatrix)}
          rowLabels={processLabels}
          colLabels={resourceLabels}
          color="blue"
        />
        <MatrixInput 
          title="Need (Max - Alloc)"
          rows={numProcesses}
          cols={numResources}
          data={needMatrix}
          rowLabels={processLabels}
          colLabels={resourceLabels}
          color="green"
          readOnly={true}
        />
      </div>

      <div className="flex justify-center mb-12">
        <button 
          onClick={handleRunDetection}
          className="px-12 py-4 bg-btn-gradient rounded-full font-bold text-lg text-white tracking-widest shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:shadow-[0_0_50px_rgba(164,92,255,0.6)] hover:scale-105 transition-all active:scale-95"
        >
          DETECT STATE
        </button>
      </div>

      {result && (
        <div className="space-y-8 animate-[float_0.5s_ease-out]">
          
          {/* Banner */}
          <div className={`p-6 rounded-xl border flex items-center justify-between backdrop-blur-md ${result.isDeadlocked ? 'bg-red-900/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-green-900/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]'}`}>
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${result.isDeadlocked ? 'text-red-400' : 'text-green-400'}`}>
                {result.isDeadlocked ? 'DEADLOCK DETECTED' : 'SYSTEM SAFE'}
              </h2>
              <p className="text-slate-300">
                {result.isDeadlocked 
                  ? "Unsafe state. No process can satisfy Need ≤ Available."
                  : "Safe state. All processes can complete successfully."
                }
              </p>
            </div>
            <div className="text-5xl animate-pulse">
              {result.isDeadlocked ? '🛑' : '✅'}
            </div>
          </div>

          {/* Intelligence Panel */}
          <div className="glass-panel p-0 rounded-xl overflow-hidden border border-white/10">
             <div className="bg-[#050810]/80 p-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-neon-cyan">🧠</span> Intelligence Report
                </h3>
             </div>
             
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Coffman Conditions</h4>
                   <div className="flex flex-wrap gap-2 mb-6">
                      <ConditionBadge label="Mutual Exclusion" active={true} safe={false} />
                      <ConditionBadge label="Hold & Wait" active={result.analysis.coffmanStatus.holdAndWait} safe={!result.analysis.coffmanStatus.holdAndWait} />
                      <ConditionBadge label="No Preemption" active={true} safe={false} />
                      <ConditionBadge label="Circular Wait" active={result.analysis.coffmanStatus.circularWait} safe={!result.analysis.coffmanStatus.circularWait} />
                   </div>

                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Narrative</h4>
                   <ul className="space-y-2 mb-4">
                      {result.analysis.narrative.map((line, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-300">
                              <span className="text-neon-blue mt-1">●</span>
                              <span>{line}</span>
                          </li>
                      ))}
                   </ul>

                   {/* All Safe Sequences List */}
                   {!result.isDeadlocked && result.allSafeSequences.length > 0 && (
                       <div className="mt-4 p-4 bg-[#050810] rounded border border-white/10">
                           <h4 className="text-xs font-bold text-neon-green uppercase tracking-wider mb-2">
                               Possible Safe Sequences (Found {result.allSafeSequences.length})
                           </h4>
                           <div className="max-h-32 overflow-y-auto space-y-1 font-mono text-xs text-slate-400">
                               {result.allSafeSequences.map((seq, idx) => (
                                   <div key={idx} className="hover:text-neon-cyan transition-colors cursor-default">
                                       {idx + 1}. {'<'} {seq.map(p => `P${p}`).join(', ')} {'>'}
                                   </div>
                               ))}
                               {result.allSafeSequences.length === 10 && <div className="text-slate-600 italic">...more may exist (limited to 10)</div>}
                           </div>
                       </div>
                   )}
                </div>

                <div className="bg-[#050810] rounded-lg p-4 border border-white/10 h-full shadow-inner">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        {result.isDeadlocked ? 'Stuck Processes' : 'Primary Safe Sequence (Lowest Index Rule)'}
                    </h4>
                    
                    {result.isDeadlocked ? (
                        <div className="flex flex-wrap gap-2">
                             {result.deadlockedProcesses.map(p => (
                                 <div key={p} className="w-10 h-10 rounded bg-red-900/40 border border-red-500 flex items-center justify-center text-red-200 font-bold shadow-lg animate-pulse">
                                     P{p}
                                 </div>
                             ))}
                        </div>
                    ) : (
                        <SafeSequenceAnimator sequence={result.safeSequence} />
                    )}
                </div>
             </div>
          </div>

          {/* Simulation Log */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Simulation Log</h3>
            <div className="space-y-4 font-mono text-sm max-h-[400px] overflow-y-auto pr-2">
              {result.steps.map((step) => (
                <div key={step.stepId} className="flex gap-4 p-3 rounded bg-[#050810]/50 border border-white/5 hover:border-neon-blue/20 transition-colors">
                  <div className="text-slate-500 min-w-[24px]">{step.stepId}.</div>
                  <div className="flex-1">
                    <p className="text-slate-300 mb-1">{step.description}</p>
                    <div className="text-xs text-slate-500">
                      Available: [{step.currentAvailable.join(', ')}]
                    </div>
                  </div>
                  <div className="flex items-start">
                     {step.status === 'safe' && <span className="text-neon-green font-bold drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">OK</span>}
                     {step.status === 'unsafe' && <span className="text-neon-pink font-bold drop-shadow-[0_0_5px_rgba(255,0,153,0.5)]">FAIL</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ConditionBadge: React.FC<{label: string, active: boolean, safe: boolean}> = ({label, active, safe}) => {
    let colorClass = "bg-slate-800 text-slate-500 border-slate-700";
    let icon = "";

    if (safe) {
        colorClass = "bg-green-900/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]";
        icon = "✓";
    } else if (active) {
        colorClass = "bg-red-900/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
        icon = "!";
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${colorClass}`}>
            {label} {icon && <span>{icon}</span>}
        </span>
    );
};

export default Detector;
