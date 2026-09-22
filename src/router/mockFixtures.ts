import { LoanSimulationData } from '../components/LoanSimulationScreen';

export const fallbackSimulationData: LoanSimulationData = {
  loanAmount: 2000,
  installments: 12,
  firstDueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  monthlyInstallment: 243.16,
  totalCost: 2917.92,
};

