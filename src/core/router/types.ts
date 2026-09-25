import { LoanSimulationData } from '../baseline/BaselineLoanSimulationScreen';
import { FlowStep } from './steps';

export type FlowPrototype = 'portal' | 'do-01' | 'baseline';

export type EntrySource = 'home' | 'products';

export interface FlowState {
  step: FlowStep;
  source: EntrySource;
  sessionAmount: number | null;
  loanAmount: number;
  simulationData: LoanSimulationData | null;
  direction: number;
}
