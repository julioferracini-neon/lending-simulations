export type FlowStep = 'global_home' | 'products' | 'loan_hub' | 'input_value' | 'simulation' | 'proposal_loading' | 'summary' | 'success';

export const stepToPath: Record<FlowStep, string> = {
  global_home: '/',
  products: '/products',
  loan_hub: '/loan-hub',
  input_value: '/input-value',
  simulation: '/simulation',
  proposal_loading: '/proposal-loading',
  summary: '/summary',
  success: '/success',
};

export const pathToStep: Record<string, FlowStep> = Object.entries(stepToPath).reduce(
  (acc, [step, path]) => {
    acc[path] = step as FlowStep;
    return acc;
  },
  {} as Record<string, FlowStep>
);

