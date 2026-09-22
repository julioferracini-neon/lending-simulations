import { useEffect, useRef } from 'react';
import { FlowStep, pathToStep, stepToPath } from './steps';
import { LoanSimulationData } from '../components/LoanSimulationScreen';
import { fallbackSimulationData } from './mockFixtures';

export interface FlowState {
  step: FlowStep;
  sessionAmount: number | null;
  loanAmount: number;
  simulationData: LoanSimulationData | null;
  direction: number;
}

export function getInitialFlowState(): FlowState {
  const pathname = window.location.pathname;
  // Se for a raiz, redirecionamos internamente para global_home, ou se bater, usamos.
  const step = pathname === '/' ? 'global_home' : (pathToStep[pathname] || 'global_home');

  const state = window.history.state as Partial<FlowState> | null;

  let sessionAmount: number | null = null;
  let loanAmount = 2000;
  let simulationData: LoanSimulationData | null = null;

  if (state) {
    sessionAmount = state.sessionAmount ?? null;
    loanAmount = state.loanAmount ?? 2000;
    
    if (state.simulationData) {
      simulationData = {
        ...state.simulationData,
        firstDueDate: new Date(state.simulationData.firstDueDate)
      };
    }
  } else {
    // Deep-link a frio
    if (step === 'simulation' || step === 'proposal_loading' || step === 'summary' || step === 'success') {
      simulationData = fallbackSimulationData;
    }
  }

  return {
    step,
    sessionAmount,
    loanAmount,
    simulationData,
    direction: 1,
  };
}

interface UseUrlSyncedFlowProps {
  step: FlowStep;
  setStep: (s: FlowStep) => void;
  sessionAmount: number | null;
  setSessionAmount: (s: number | null) => void;
  loanAmount: number;
  setLoanAmount: (a: number) => void;
  simulationData: LoanSimulationData | null;
  setSimulationData: (d: LoanSimulationData | null) => void;
  direction: number;
  setDirection: (d: number) => void;
}

export function useUrlSyncedFlow({
  step,
  setStep,
  sessionAmount,
  setSessionAmount,
  loanAmount,
  setLoanAmount,
  simulationData,
  setSimulationData,
  direction,
  setDirection,
}: UseUrlSyncedFlowProps) {
  const isPopState = useRef(false);

  useEffect(() => {
    if (isPopState.current) {
      isPopState.current = false;
      return;
    }

    const stateToSave = {
      step,
      sessionAmount,
      loanAmount,
      simulationData,
    };

    const targetPath = stepToPath[step];
    
    if (window.location.pathname !== targetPath) {
      window.history.pushState(stateToSave, '', targetPath);
    } else {
      window.history.replaceState(stateToSave, '', targetPath);
    }
  }, [step, sessionAmount, loanAmount, simulationData]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      isPopState.current = true;
      
      const pathname = window.location.pathname;
      const newStep = pathname === '/' ? 'global_home' : (pathToStep[pathname] || 'global_home');
      
      setDirection(-1);
      setStep(newStep);

      if (event.state) {
        if (event.state.sessionAmount !== undefined) setSessionAmount(event.state.sessionAmount);
        if (event.state.loanAmount !== undefined) setLoanAmount(event.state.loanAmount);
        
        if (event.state.simulationData) {
          setSimulationData({
            ...event.state.simulationData,
            firstDueDate: new Date(event.state.simulationData.firstDueDate)
          });
        } else {
          setSimulationData(null);
        }
      } else {
        if (newStep === 'simulation' || newStep === 'proposal_loading' || newStep === 'summary' || newStep === 'success') {
          setSimulationData(fallbackSimulationData);
        } else {
          setSimulationData(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setStep, setSessionAmount, setLoanAmount, setSimulationData, setDirection]);
}

