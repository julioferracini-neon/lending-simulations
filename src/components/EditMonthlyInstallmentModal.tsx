import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { calculateLoanSimulation, formatCurrency, BASE_MONTHLY_RATE } from '../utils/finance';
import { RouletteOdometer } from './RouletteOdometer';

interface EditMonthlyInstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  currentInstallments: number;
  onSelectInstallments: (installments: number) => void;
  firstDueDate?: Date;
}

export const EditMonthlyInstallmentModal: React.FC<EditMonthlyInstallmentModalProps> = ({
  isOpen,
  onClose,
  loanAmount,
  currentInstallments,
  onSelectInstallments,
  firstDueDate,
}) => {
  // All 24 plans (1x to 24x, exactly 12 rows x 2 columns)
  const availablePlans = useMemo(() => {
    const plans = [];
    for (let i = 1; i <= 24; i++) {
      const sim = calculateLoanSimulation(loanAmount, i, BASE_MONTHLY_RATE, firstDueDate);
      plans.push({
        installments: i,
        monthlyPmt: sim.monthlyInstallment,
        totalCost: sim.totalEstimatedCost,
      });
    }
    return plans;
  }, [loanAmount, firstDueDate]);

  // Synchronize state with current selection from first layer whenever modal opens or currentInstallments changes
  const [selectedPlanInstallments, setSelectedPlanInstallments] = useState<number>(currentInstallments);
  const selectedItemRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlanInstallments(currentInstallments);
      // Ensure smooth scroll to the selected option in the grid
      const timer = setTimeout(() => {
        if (selectedItemRef.current) {
          selectedItemRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentInstallments]);

  const handleConfirm = () => {
    onSelectInstallments(selectedPlanInstallments);
    onClose();
  };

  const currentSelected = availablePlans.find((p) => p.installments === selectedPlanInstallments) || availablePlans[0];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Escolha o prazo e valor"
      subtitle="Selecione uma das opções de parcelamento"
      icon={<CreditCard className="w-5 h-5" />}
      maxHeightClass="max-h-[90vh]"
      id="edit-monthly-installment-sheet"
    >
      <div className="space-y-4">
        {/* Main Selection Tile matching Figma blue banner theme */}
        <div className="bg-[#eef7fe] border border-blue-100/80 rounded-2xl p-4 text-center">
          <span className="text-xs font-semibold text-[#5c7086] uppercase tracking-wider block mb-0.5">
            Opção selecionada:
          </span>
          <div className="text-3xl font-black text-[#142742] tracking-tight my-0.5">
            <RouletteOdometer
              value={currentSelected.monthlyPmt}
              prefix="R$ "
              motionDuration={380}
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0072e6] text-white text-xs font-bold mt-1">
            <span>{currentSelected.installments}x mensais</span>
            <span className="opacity-60">•</span>
            <span>Total: {formatCurrency(currentSelected.totalCost)}</span>
          </div>
        </div>

        {/* 2 Columns x 12 Rows Grid with All 24 Options */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 px-0.5">
            Todas as 24 opções de prazo (1x a 24x):
          </label>

          <div className="grid grid-cols-2 gap-2 pb-2">
            {availablePlans.map((plan) => {
              const isSelected = selectedPlanInstallments === plan.installments;

              return (
                <button
                  key={plan.installments}
                  ref={isSelected ? selectedItemRef : null}
                  type="button"
                  onClick={() => setSelectedPlanInstallments(plan.installments)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-[#0072e6] bg-blue-50/80 shadow-xs ring-1 ring-[#0072e6]'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#0066cc]' : 'text-slate-800'
                      }`}
                    >
                      {plan.installments}x parcelas
                    </span>

                    {plan.installments === 7 ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 leading-none">
                        <Sparkles className="w-2.5 h-2.5" />
                        Ideal
                      </span>
                    ) : plan.installments === 1 ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-sm leading-none">
                        Menor custo
                      </span>
                    ) : plan.installments === 24 ? (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded-sm leading-none">
                        Menor parcela
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2">
                    <span className="text-base font-extrabold text-slate-900 tabular-nums block leading-tight">
                      {formatCurrency(plan.monthlyPmt)}
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums mt-0.5 block">
                      Total: {formatCurrency(plan.totalCost)}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#0072e6] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Confirm Action Button */}
        <div className="sticky bottom-0 pt-2 pb-1 bg-white border-t border-slate-100">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full bg-[#0072e6] hover:bg-[#0062c4] active:scale-[0.98] text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-base cursor-pointer"
          >
            <Check className="w-5 h-5" />
            Confirmar {selectedPlanInstallments}x de {formatCurrency(currentSelected.monthlyPmt)}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
