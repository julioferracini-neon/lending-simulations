export type FlowStep = 'portal' | 'global_home' | 'products' | 'loan_hub' | 'input_value' | 'simulation' | 'proposal_loading' | 'summary' | 'success';

export const stepToPath: Record<FlowStep, string> = {
  portal: '/',
  global_home: '/do-01/home',
  products: '/do-01/products',
  loan_hub: '/do-01/loan-hub',
  input_value: '/do-01/input-value',
  simulation: '/do-01/simulation',
  proposal_loading: '/do-01/proposal-loading',
  summary: '/do-01/summary',
  success: '/do-01/success',
};

export const pathToStep: Record<string, FlowStep> = Object.entries(stepToPath).reduce(
  (acc, [step, path]) => {
    acc[path] = step as FlowStep;
    return acc;
  },
  {} as Record<string, FlowStep>
);

