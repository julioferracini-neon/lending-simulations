import { useEffect, useRef } from 'react';
import { FlowStep, pathToStep, stepToPath, getStepDirection } from './steps';
import { LoanSimulationData } from '../baseline/BaselineLoanSimulationScreen';
import { fallbackSimulationData } from './mockFixtures';
import { EntrySource, FlowState } from './types';

export function getNormalizedPath(pathname: string): string {
  const rawBase = import.meta.env.BASE_URL || '/';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const baseWithoutTrailingSlash = base.endsWith('/') ? base.slice(0, -1) : base;

  if (pathname === baseWithoutTrailingSlash) {
    return '/';
  }

  if (base !== '/' && pathname.startsWith(base)) {
    const stripped = pathname.slice(base.length - 1);
    return stripped || '/';
  }

  return pathname;
}

export function getPrefixedUrl(targetPath: string, queryString: string = ''): string {
  const rawBase = import.meta.env.BASE_URL || '/';
  const base = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
  const fullPath = targetPath === '/' ? (base ? `${base}/` : '/') : `${base}${targetPath}`;
  return `${fullPath}${queryString}`;
}

export function getInitialFlowState(): FlowState {
  const pathname = getNormalizedPath(window.location.pathname);
  const step = pathToStep[pathname] || 'portal';

  const searchParams = new URLSearchParams(window.location.search);
  const querySource = searchParams.get('from') || searchParams.get('source');
  const initialSource: EntrySource = querySource === 'home' ? 'home' : 'products';

  const state = window.history.state as Partial<FlowState> | null;

  let source: EntrySource = state?.source ?? initialSource;
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
    // Deep-link a frio para qualquer tela que necessite dos dados de proposta
    const isContractingStep = 
      step === 'simulation' || 
      step === 'proposal_loading' || 
      step === 'summary' || 
      step === 'success' ||
      step === 'baseline_proposal_loading' || 
      step === 'baseline_summary' || 
      step === 'baseline_success';

    if (isContractingStep) {
      simulationData = fallbackSimulationData;
    }
  }

  return {
    step,
    source,
    sessionAmount,
    loanAmount,
    simulationData,
    direction: 1,
  };
}

interface UseUrlSyncedFlowProps {
  step: FlowStep;
  setStep: (s: FlowStep) => void;
  source: EntrySource;
  setSource: (s: EntrySource) => void;
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
  source,
  setSource,
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
  const previousStep = useRef<FlowStep>(step);

  useEffect(() => {
    if (isPopState.current) {
      isPopState.current = false;
      previousStep.current = step;
      return;
    }

    const stateToSave: Partial<FlowState> = {
      step,
      source,
      sessionAmount,
      loanAmount,
      simulationData,
    };

    const targetPath = stepToPath[step];
    // Adiciona ?from=home na URL caso tenha vindo da Home para persistência pura
    const queryString = source === 'home' && (step === 'input_value' || step === 'loan_hub' || step === 'baseline_input_value')
      ? '?from=home' 
      : '';
    const fullTargetUrl = getPrefixedUrl(targetPath, queryString);
    const currentFullUrl = `${window.location.pathname}${window.location.search}`;

    if (currentFullUrl !== fullTargetUrl) {
      // Se estamos voltando (direction === -1), usamos replaceState para não criar loops no histórico do browser.
      // Se estamos avançando (direction === 1), usamos pushState.
      if (direction < 0) {
        window.history.replaceState(stateToSave, '', fullTargetUrl);
      } else {
        window.history.pushState(stateToSave, '', fullTargetUrl);
      }
    } else {
      window.history.replaceState(stateToSave, '', fullTargetUrl);
    }

    previousStep.current = step;
  }, [step, source, sessionAmount, loanAmount, simulationData, direction]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      isPopState.current = true;
      
      const pathname = getNormalizedPath(window.location.pathname);
      const newStep = pathToStep[pathname] || 'portal';
      
      // Calcula direção visual automática baseada nos passos
      const calculatedDir = getStepDirection(previousStep.current, newStep);
      setDirection(calculatedDir);
      setStep(newStep);

      const searchParams = new URLSearchParams(window.location.search);
      const querySource = searchParams.get('from') || searchParams.get('source');

      if (event.state) {
        if (event.state.source) setSource(event.state.source);
        else if (querySource) setSource(querySource === 'home' ? 'home' : 'products');

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
        if (querySource) setSource(querySource === 'home' ? 'home' : 'products');

        const isContractingStep = 
          newStep === 'simulation' || 
          newStep === 'proposal_loading' || 
          newStep === 'summary' || 
          newStep === 'success' ||
          newStep === 'baseline_proposal_loading' || 
          newStep === 'baseline_summary' || 
          newStep === 'baseline_success';

        if (isContractingStep) {
          setSimulationData(fallbackSimulationData);
        } else {
          setSimulationData(null);
        }
      }

      previousStep.current = newStep;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setStep, setSource, setSessionAmount, setLoanAmount, setSimulationData, setDirection]);
}
