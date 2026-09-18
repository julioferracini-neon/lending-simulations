export interface LoanSimulationState {
  loanAmount: number;
  installments: number;
  monthlyInterestRate: number; // e.g. 0.0349 (3.49% a.m.)
  firstDueDate: Date;
  selectedDueDay: number; // e.g. 10
}

export interface InstallmentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  installmentAmount: number;
  principalAmount: number;
  interestAmount: number;
  balanceRemaining: number;
}

export interface SimulationResult {
  monthlyInstallment: number;
  totalEstimatedCost: number;
  totalInterest: number;
  iofAmount: number;
  effectiveAnnualRate: number; // CET a.a.
  schedule: InstallmentScheduleItem[];
}
