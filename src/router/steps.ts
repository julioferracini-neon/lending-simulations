import { EntrySource, FlowPrototype } from './types';

export type FlowStep = 
  | 'portal' 
  // DO-01
  | 'global_home' 
  | 'surface_cartao'
  | 'surface_pix'
  | 'surface_investir'
  | 'products' 
  | 'loan_hub' 
  | 'input_value' 
  | 'simulation' 
  | 'proposal_loading' 
  | 'summary' 
  | 'success'
  // BASELINE
  | 'baseline_global_home'
  | 'baseline_surface_cartao'
  | 'baseline_surface_pix'
  | 'baseline_surface_investir'
  | 'baseline_products'
  | 'baseline_loan_hub'
  | 'baseline_input_value'
  | 'baseline_simulation'
  | 'baseline_proposal_loading'
  | 'baseline_summary'
  | 'baseline_success';

export const stepToPath: Record<FlowStep, string> = {
  portal: '/',
  // DO-01
  global_home: '/do-01/home',
  surface_cartao: '/do-01/cartao',
  surface_pix: '/do-01/pix',
  surface_investir: '/do-01/investir',
  products: '/do-01/products',
  loan_hub: '/do-01/loan-hub',
  input_value: '/do-01/input-value',
  simulation: '/do-01/simulation',
  proposal_loading: '/do-01/proposal-loading',
  summary: '/do-01/summary',
  success: '/do-01/success',
  // BASELINE
  baseline_global_home: '/baseline/home',
  baseline_surface_cartao: '/baseline/cartao',
  baseline_surface_pix: '/baseline/pix',
  baseline_surface_investir: '/baseline/investir',
  baseline_products: '/baseline/products',
  baseline_loan_hub: '/baseline/loan-hub',
  baseline_input_value: '/baseline/input-value',
  baseline_simulation: '/baseline/simulation',
  baseline_proposal_loading: '/baseline/proposal-loading',
  baseline_summary: '/baseline/summary',
  baseline_success: '/baseline/success',
};

export const pathToStep: Record<string, FlowStep> = Object.entries(stepToPath).reduce(
  (acc, [step, path]) => {
    acc[path] = step as FlowStep;
    return acc;
  },
  {} as Record<string, FlowStep>
);

// Fallback seguro: se alguém entrar em /baseline/simulation, redireciona para baseline_input_value
pathToStep['/baseline/simulation'] = 'baseline_input_value';

export function getPrototypeFromStep(step: FlowStep): FlowPrototype {
  if (step === 'portal') return 'portal';
  if (step.startsWith('baseline_')) return 'baseline';
  return 'do-01';
}

export function getPrototypeFromPath(pathname: string): FlowPrototype {
  if (pathname.startsWith('/baseline')) return 'baseline';
  if (pathname.startsWith('/do-01')) return 'do-01';
  return 'portal';
}

const DO01_STEP_INDEX: Record<string, number> = {
  global_home: 0,
  surface_cartao: 0.5,
  surface_pix: 0.5,
  surface_investir: 0.5,
  products: 1,
  loan_hub: 2,
  input_value: 3,
  simulation: 4,
  summary: 5,
  proposal_loading: 6,
  success: 7,
};

const BASELINE_STEP_INDEX: Record<string, number> = {
  baseline_global_home: 0,
  baseline_surface_cartao: 0.5,
  baseline_surface_pix: 0.5,
  baseline_surface_investir: 0.5,
  baseline_products: 1,
  baseline_loan_hub: 1.5,
  baseline_input_value: 2,
  baseline_summary: 3,
  baseline_proposal_loading: 4,
  baseline_success: 5,
};

export function getStepDirection(fromStep: FlowStep, toStep: FlowStep): number {
  const protoFrom = getPrototypeFromStep(fromStep);
  const protoTo = getPrototypeFromStep(toStep);

  if (protoFrom !== protoTo) return 1;

  const indexMap = protoFrom === 'baseline' ? BASELINE_STEP_INDEX : DO01_STEP_INDEX;
  const fromIndex = indexMap[fromStep] ?? 0;
  const toIndex = indexMap[toStep] ?? 0;

  return toIndex >= fromIndex ? 1 : -1;
}

export function getCanonicalBackStep(
  currentStep: FlowStep, 
  source: EntrySource = 'products'
): FlowStep | null {
  switch (currentStep) {
    // --- DO-01 ---
    case 'surface_cartao':
    case 'surface_pix':
    case 'surface_investir':
    case 'products':
      return 'global_home';
    case 'loan_hub':
      return source === 'home' ? 'global_home' : 'products';
    case 'input_value':
      return 'loan_hub';
    case 'simulation':
      return 'input_value';
    case 'summary':
      return 'simulation';
    case 'proposal_loading':
      return 'summary';
    case 'success':
      return 'global_home';

    // --- BASELINE ---
    // No Baseline a tela de simulation NÃO existe.
    // summary volta direto para input_value!
    case 'baseline_surface_cartao':
    case 'baseline_surface_pix':
    case 'baseline_surface_investir':
    case 'baseline_products':
      return 'baseline_global_home';
    case 'baseline_loan_hub':
      return source === 'home' ? 'baseline_global_home' : 'baseline_products';
    case 'baseline_input_value':
      return source === 'home' ? 'baseline_global_home' : 'baseline_products';
    case 'baseline_summary':
      return 'baseline_input_value';
    case 'baseline_proposal_loading':
      return 'baseline_summary';
    case 'baseline_simulation':
      return 'baseline_input_value';
    case 'baseline_success':
      return 'baseline_global_home';

    default:
      return null;
  }
}
