
export interface Process {
  id: number;
  name: string;
}

export interface Resource {
  id: number;
  name: string;
  totalInstances: number;
}

export type Matrix = number[][];

export interface SimulationStep {
  stepId: number;
  description: string;
  processIndex?: number;
  action?: 'ALLOCATE' | 'RELEASE' | 'WAIT' | 'CHECK';
  currentAvailable: number[];
  status: 'safe' | 'unsafe' | 'neutral';
}

export interface AnalysisReport {
  coffmanStatus: {
    mutualExclusion: boolean;
    holdAndWait: boolean;
    noPreemption: boolean;
    circularWait: boolean;
  };
  narrative: string[];
  cycleVisual?: string;
  stuckProcesses: number[];
}

export interface DetectionResult {
  isDeadlocked: boolean;
  safeSequence: number[]; // The deterministic one (lowest index first)
  allSafeSequences: number[][]; // List of all possible valid sequences
  deadlockedProcesses: number[];
  steps: SimulationStep[];
  finalAvailable: number[];
  analysis: AnalysisReport;
}

export interface GraphNode {
  id: string;
  type: 'PROCESS' | 'RESOURCE';
  label: string;
  subLabel?: string; // e.g. instances
  highlight?: boolean;
  totalInstances?: number;
  allocatedCount?: number;
  availableCount?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'REQUEST' | 'ALLOCATION' | 'WAIT';
  label?: string;
  highlight?: boolean;
}
