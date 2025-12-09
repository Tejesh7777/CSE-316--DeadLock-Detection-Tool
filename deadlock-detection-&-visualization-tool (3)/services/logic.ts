
import { DetectionResult, SimulationStep, AnalysisReport } from '../types';

/**
 * Helper to find all safe sequences using backtracking
 */
const findAllSafeSequences = (
  numProcesses: number,
  numResources: number,
  initialWork: number[],
  allocation: number[][],
  need: number[][]
): number[][] => {
  const results: number[][] = [];
  const visited = new Array(numProcesses).fill(false);
  
  // Use a string set to avoid duplicate sequences if multiple paths lead to same result order
  const distinctSequences = new Set<string>();

  const backtrack = (currentSeq: number[], currentWork: number[]) => {
    // Stop if we found enough examples (prevent UI lag for large N)
    if (results.length >= 10) return;

    if (currentSeq.length === numProcesses) {
      const key = currentSeq.join(',');
      if (!distinctSequences.has(key)) {
        distinctSequences.add(key);
        results.push([...currentSeq]);
      }
      return;
    }

    for (let i = 0; i < numProcesses; i++) {
      if (!visited[i]) {
        // Check if Process i can run
        let canRun = true;
        for (let r = 0; r < numResources; r++) {
          if (need[i][r] > currentWork[r]) {
            canRun = false;
            break;
          }
        }

        if (canRun) {
          visited[i] = true;
          // Simulate release
          const newWork = [...currentWork];
          for (let r = 0; r < numResources; r++) {
            newWork[r] += allocation[i][r];
          }
          
          currentSeq.push(i);
          backtrack(currentSeq, newWork);
          currentSeq.pop();
          visited[i] = false;
        }
      }
    }
  };

  backtrack([], [...initialWork]);
  return results;
};

/**
 * Advanced Deadlock Intelligence Engine
 */
export const detectDeadlock = (
  numProcesses: number,
  numResources: number,
  initialAvailable: number[], 
  allocation: number[][],
  need: number[][] 
): DetectionResult => {
  const steps: SimulationStep[] = [];
  
  // --- 1. PREPARATION ---
  
  // We use a copy of available for the deterministic simulation
  let work = [...initialAvailable]; 
  const finish = new Array(numProcesses).fill(false);
  const safeSequence: number[] = [];
  
  steps.push({
    stepId: 0,
    description: `INITIALIZATION: Simulation starts with Initial Available Vector [${work.join(', ')}].`,
    currentAvailable: [...work],
    status: 'neutral'
  });

  // --- 2. BANKER'S SAFETY ALGORITHM (Lowest Index Rule) ---

  // We repeatedly scan from P0 to Pn to find the FIRST process that can run.
  // This ensures a deterministic "lowest index" result.
  let count = 0;
  // We loop at most numProcesses times because each successful finding adds one process.
  // We use an outer infinite-like loop that breaks when no progress is made.
  while (count < numProcesses) {
    let foundProcess = false;
    
    for (let p = 0; p < numProcesses; p++) {
      if (!finish[p]) {
        // Condition: Need[p] <= Work
        let canProceed = true;
        for (let r = 0; r < numResources; r++) {
          if (need[p][r] > work[r]) {
            canProceed = false;
            break;
          }
        }

        if (canProceed) {
          // Process can execute
          // Work = Work + Allocation[p]
          const oldWork = [...work];
          for (let r = 0; r < numResources; r++) {
            work[r] += allocation[p][r];
          }
          
          finish[p] = true;
          safeSequence.push(p);
          count++;
          foundProcess = true;

          steps.push({
            stepId: steps.length + 1,
            description: `STEP ${count}: P${p} Need [${need[p].join(', ')}] ≤ Available [${oldWork.join(', ')}]. P${p} runs and releases [${allocation[p].join(', ')}]. New Available: [${work.join(', ')}].`,
            processIndex: p,
            action: 'RELEASE',
            currentAvailable: [...work],
            status: 'safe'
          });
          
          // Restart search from lowest index (P0) after a successful run 
          // to strictly follow "lowest index eligible" rule.
          break; 
        }
      }
    }

    if (!foundProcess) {
      // No process could proceed, and we haven't finished all. Deadlock.
      break;
    }
  }

  // --- 3. RESULT DETERMINATION ---

  const deadlockedProcesses: number[] = [];
  for (let p = 0; p < numProcesses; p++) {
    if (!finish[p]) {
      deadlockedProcesses.push(p);
    }
  }

  const isDeadlocked = deadlockedProcesses.length > 0;

  if (isDeadlocked) {
    // Generate detail for why specifically they are stuck
    deadlockedProcesses.forEach(p => {
        // Find first resource causing wait
        let stuckResource = -1;
        let neededAmt = 0;
        let availAmt = 0;
        for(let r=0; r<numResources; r++) {
            if(need[p][r] > work[r]) {
                stuckResource = r;
                neededAmt = need[p][r];
                availAmt = work[r];
                break;
            }
        }
        steps.push({
            stepId: steps.length + 1,
            description: `FAILURE: P${p} cannot proceed. Need for R${stuckResource} (${neededAmt}) > Available (${availAmt}).`,
            processIndex: p,
            action: 'WAIT',
            currentAvailable: [...work],
            status: 'unsafe'
        });
    });

    steps.push({
        stepId: steps.length + 1,
        description: `DEADLOCK CONFIRMED: Processes { ${deadlockedProcesses.map(id => `P${id}`).join(', ')} } are stuck.`,
        currentAvailable: [...work],
        status: 'unsafe'
      });
  } else {
    steps.push({
        stepId: steps.length + 1,
        description: `SUCCESS: System is SAFE. Safe Sequence: < ${safeSequence.map(id => `P${id}`).join(', ')} >.`,
        currentAvailable: [...work],
        status: 'safe'
      });
  }

  // --- 4. FIND ALL SEQUENCES (If Safe) ---
  let allSafeSequences: number[][] = [];
  if (!isDeadlocked) {
      allSafeSequences = findAllSafeSequences(numProcesses, numResources, initialAvailable, allocation, need);
  }

  // --- 5. INTELLIGENCE ANALYSIS ---
  
  const narrative: string[] = [];
  let cycleVisual = undefined;
  let circularWaitDetected = false;
  let holdAndWaitDetected = false;

  if (!isDeadlocked) {
    narrative.push(`State is SAFE. Need ≤ Available satisfied for all processes.`);
    narrative.push(`Primary Safe Sequence (Lowest Index Rule): ${safeSequence.map(p => `P${p}`).join(' → ')}.`);
    if (allSafeSequences.length > 1) {
        narrative.push(`Total valid sequences found: ${allSafeSequences.length}. (See list below)`);
    }
  } else {
    narrative.push(`State is UNSAFE / DEADLOCKED.`);
    
    // Check Hold and Wait
    const holdAndWaitProcesses = deadlockedProcesses.filter(p => {
        const holds = allocation[p].some(v => v > 0);
        const waits = need[p].some(v => v > 0);
        return holds && waits;
    });

    if (holdAndWaitProcesses.length > 0) {
        holdAndWaitDetected = true;
        narrative.push(`"Hold and Wait" condition violated by: ${holdAndWaitProcesses.map(p => `P${p}`).join(', ')}.`);
    } else {
        narrative.push(`"Hold and Wait" not explicitly violated (stuck processes might not hold anything, just waiting).`);
    }

    // Check Circular Wait (Build Internal WAG)
    // Edge P -> Q exists if P needs R, R is not available, and Q holds R.
    const adj = new Map<number, Set<number>>();
    deadlockedProcesses.forEach(p => adj.set(p, new Set()));

    // We use the initial available state for the WAG construction if in deadlock start, 
    // but correctly we should check against current 'work' if partial execution happened.
    // However, for typical deadlock check, we often check from start state.
    // Let's use 'work' (current available after any partial execution) to be precise about *remaining* deadlock.
    
    for (const p of deadlockedProcesses) {
        for (let r = 0; r < numResources; r++) {
            // Check if P is actually waiting for R
            if (need[p][r] > work[r]) {
                // Who holds R?
                for (let q = 0; q < numProcesses; q++) {
                    if (p !== q && allocation[q][r] > 0) {
                        // Edge P -> Q
                        adj.get(p)?.add(q);
                    }
                }
            }
        }
    }

    // DFS for Cycle
    const visited = new Set<number>();
    const recStack = new Set<number>();
    const pathStack: number[] = [];
    let cyclePath: number[] = [];

    const dfs = (u: number): boolean => {
        visited.add(u);
        recStack.add(u);
        pathStack.push(u);

        const neighbors = adj.get(u) || new Set();
        for (const v of neighbors) {
            if (!visited.has(v)) {
                if (dfs(v)) return true;
            } else if (recStack.has(v)) {
                const startIdx = pathStack.indexOf(v);
                cyclePath = pathStack.slice(startIdx);
                return true;
            }
        }

        recStack.delete(u);
        pathStack.pop();
        return false;
    };

    for (const p of deadlockedProcesses) {
        if (!visited.has(p)) {
            if (dfs(p)) {
                circularWaitDetected = true;
                break;
            }
        }
    }

    if (circularWaitDetected) {
        narrative.push(`"Circular Wait" detected.`);
        const cycleStr = cyclePath.map(p => `P${p}`).join(' → ') + ' → ' + `P${cyclePath[0]}`;
        cycleVisual = cycleStr;
        narrative.push(`Cycle chain: ${cycleStr}`);
    } else {
        narrative.push(`Deadlock exists due to resource scarcity, but no simple single-resource P->Q cycle detected (possibly complex multi-instance dependency).`);
    }
  }

  const analysis: AnalysisReport = {
      coffmanStatus: {
          mutualExclusion: true, // Always true for non-sharable resources in this model
          holdAndWait: holdAndWaitDetected,
          noPreemption: true, // Assumption of model
          circularWait: circularWaitDetected
      },
      narrative,
      cycleVisual,
      stuckProcesses: deadlockedProcesses
  };

  return {
    isDeadlocked,
    safeSequence,
    allSafeSequences,
    deadlockedProcesses,
    steps,
    finalAvailable: work,
    analysis
  };
};

/**
 * Builds data for WAG and RAG based on current matrices
 */
export const generateGraphData = (
    numProcesses: number,
    numResources: number,
    resources: {id: number, name: string, totalInstances: number}[],
    allocation: number[][],
    need: number[][]
) => {
    // --- RAG (Resource Allocation Graph) ---
    const ragNodes = [];
    const ragLinks = [];

    for(let i=0; i<numProcesses; i++) {
        ragNodes.push({ id: `P${i}`, type: 'PROCESS', label: `P${i}` });
    }
    for(let i=0; i<numResources; i++) {
        ragNodes.push({ id: `R${i}`, type: 'RESOURCE', label: resources[i].name, subLabel: `${resources[i].totalInstances}` });
    }

    // Allocation Edges (R -> P) Green
    for(let p=0; p<numProcesses; p++) {
        for(let r=0; r<numResources; r++) {
            if(allocation[p][r] > 0) {
                ragLinks.push({ source: `R${r}`, target: `P${p}`, type: 'ALLOCATION', label: `${allocation[p][r]}` });
            }
        }
    }

    // Request Edges (P -> R) Blue
    // In RAG, a request edge exists if Need > 0
    for(let p=0; p<numProcesses; p++) {
        for(let r=0; r<numResources; r++) {
            if(need[p][r] > 0) {
                ragLinks.push({ source: `P${p}`, target: `R${r}`, type: 'REQUEST', label: `${need[p][r]}` });
            }
        }
    }

    // --- WAG (Wait-For Graph) ---
    // Calculate Current Available for WAG Logic (Available = Total - Allocated)
    // Note: The graph generation receives Total from localStorage/state.
    const totalAllocated = new Array(numResources).fill(0);
    allocation.forEach(row => row.forEach((v, i) => totalAllocated[i] += v));
    const currentAvailable = resources.map((res, i) => res.totalInstances - totalAllocated[i]);

    const wagNodes = [];
    const wagLinks: {source: string, target: string, type: string, label: string}[] = [];
    
    for(let i=0; i<numProcesses; i++) {
        wagNodes.push({ id: `P${i}`, type: 'PROCESS', label: `P${i}` });
    }

    for(let p=0; p<numProcesses; p++) {
        for(let r=0; r<numResources; r++) {
            if (need[p][r] > 0) {
                // Strict WAG: P waits if Need > Available
                if (need[p][r] > currentAvailable[r]) {
                    // P is waiting for instances of R.
                    // Edges go to ALL processes holding R.
                    for (let holder=0; holder<numProcesses; holder++) {
                        if (holder !== p && allocation[holder][r] > 0) {
                            const exists = wagLinks.find(l => l.source === `P${p}` && l.target === `P${holder}`);
                            if(!exists) {
                                wagLinks.push({ 
                                    source: `P${p}`, 
                                    target: `P${holder}`, 
                                    type: 'WAIT', 
                                    label: resources[r].name 
                                });
                            } else {
                                // Add to label if multiple resources
                                if (exists.label && !exists.label.includes(resources[r].name)) {
                                    exists.label += `, ${resources[r].name}`;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return { ragNodes, ragLinks, wagNodes, wagLinks };
}
