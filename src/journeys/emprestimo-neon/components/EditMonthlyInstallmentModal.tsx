import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import { BottomSheet } from '@/src/components/BottomSheet';
import { calculateLoanSimulation, formatCurrency, BASE_MONTHLY_RATE } from '../utils/finance';
import { RouletteOdometer } from './RouletteOdometer';
import { Button } from '@/src/design-system';

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

  // Configuração reversível: mude para true caso queira reexibir o bloco "Opção selecionada"
  const SHOW_SELECTED_HERO = false;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Escolha o prazo e valor"
      maxHeightClass="max-h-[90vh]"
      id="edit-monthly-installment-sheet"
    >
      <div className="space-y-4 pt-1">
        {/* Bloco de resumo da opção selecionada (Reversível) */}
        {SHOW_SELECTED_HERO && (
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-[13px] font-medium text-[#5a738e] mb-1">
              Opção selecionada
            </span>
            <div className="text-[32px] font-bold text-[#142742] tracking-tight mb-2">
              <RouletteOdometer
                value={currentSelected.monthlyPmt}
                prefix="R$ "
                motionDuration={380}
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#142742] text-xs font-semibold">
              <span>{currentSelected.installments}x mensais</span>
              <span className="text-slate-300">•</span>
              <span>Total: {formatCurrency(currentSelected.totalCost)}</span>
            </div>
          </div>
        )}

        {/* 2 Columns x 12 Rows Grid with All 24 Options */}
        <div>
          <label className="text-[13px] font-medium text-[#5a738e] block mb-2.5 px-1">
            Todas as opções de prazo
          </label>

          <div className="grid grid-cols-2 gap-3 pb-4">
            {availablePlans.map((plan) => {
              const isSelected = selectedPlanInstallments === plan.installments;

              return (
                <button
                  key={plan.installments}
                  ref={isSelected ? selectedItemRef : null}
                  type="button"
                  onClick={() => setSelectedPlanInstallments(plan.installments)}
                  className={`p-3.5 rounded-[16px] border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-[#0073ea] bg-[#f0f7ff] shadow-sm ring-1 ring-[#0073ea]'
                      : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[13px] font-semibold ${
                        isSelected ? 'text-[#0073ea]' : 'text-[#142742]'
                      }`}
                    >
                      {plan.installments}x parcelas
                    </span>

                    {plan.installments === 7 ? (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 leading-none">
                        <Sparkles className="w-2.5 h-2.5" />
                        Ideal
                      </span>
                    ) : plan.installments === 1 ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded leading-none">
                        Menor custo
                      </span>
                    ) : plan.installments === 24 ? (
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded leading-none">
                        Menor parcela
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <span className="text-[16px] font-bold text-[#142742] tabular-nums block leading-tight">
                      {formatCurrency(plan.monthlyPmt)}
                    </span>
                    <span className="text-[11px] text-[#5a738e] tabular-nums mt-1 block">
                      Total: {formatCurrency(plan.totalCost)}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0073ea] text-white flex items-center justify-center border-2 border-white shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Confirm Action Button */}
        <div className="sticky bottom-0 pt-4 pb-2 bg-white/95 backdrop-blur-sm border-t border-slate-100">
          <Button
            type="button"
            size="md"
            onClick={handleConfirm}
          >
            Confirmar opção
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
