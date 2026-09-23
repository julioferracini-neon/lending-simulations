export type FlowStep = 
  | 'portal' 
  // DO-01
  | 'global_home' 
  | 'products' 
  | 'loan_hub' 
  | 'input_value' 
  | 'simulation' 
  | 'proposal_loading' 
  | 'summary' 
  | 'success'
  // BASELINE
  | 'baseline_global_home'
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
  products: '/do-01/products',
  loan_hub: '/do-01/loan-hub',
  input_value: '/do-01/input-value',
  simulation: '/do-01/simulation',
  proposal_loading: '/do-01/proposal-loading',
  summary: '/do-01/summary',
  success: '/do-01/success',
  // BASELINE
  baseline_global_home: '/baseline/home',
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
