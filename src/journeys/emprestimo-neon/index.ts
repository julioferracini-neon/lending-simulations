export const JOURNEY_ID = 'emprestimo-neon';
export const JOURNEY_NAME = 'Hipóteses para Empréstimo (Neon)';

// Export utilities
export * from './utils/finance';

// Export screens
export * from './screens/GlobalHomeScreen';
export * from './screens/ProductsScreen';
export * from './screens/SurfacePlaceholderScreen';
export * from './screens/LoanHubScreen';
export * from './screens/InputValueScreen';
export * from './screens/LoanSimulationScreen';
export * from './screens/ProposalLoadingScreen';
export * from './screens/SummaryScreen';
export * from './screens/SuccessScreen';

// Export Baseline screens
export * from './screens/BaselineLoanHubScreen';
export * from './screens/BaselineInputValueScreen';
export {
  BaselineLoanSimulationScreen
} from './screens/BaselineLoanSimulationScreen';
export * from './screens/BaselineSummaryScreen';
export * from './screens/BaselineSuccessScreen';
