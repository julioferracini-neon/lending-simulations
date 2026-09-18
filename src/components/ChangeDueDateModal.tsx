import React, { useState } from 'react';
import { Calendar as CalendarIcon, Check, Clock, TrendingUp } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { calculateLoanSimulation, formatCurrency, formatDatePtBR, BASE_MONTHLY_RATE } from '../utils/finance';

interface ChangeDueDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  currentDate: Date;
  onSelectDate: (day: number, newDate: Date) => void;
  loanAmount?: number;
  installments?: number;
}

const AVAILABLE_DAYS = [5, 10, 15, 20, 25, 28];

export const ChangeDueDateModal: React.FC<ChangeDueDateModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  onSelectDate,
  loanAmount = 2000,
  installments = 7,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);

  const getCalculatedDate = (day: number): Date => {
    return new Date(2026, 8, day); // Month 8 is September
  };

  const previewDate = getCalculatedDate(selectedDay);
  const currentPreviewSim = calculateLoanSimulation(loanAmount, installments, BASE_MONTHLY_RATE, previewDate);
  const baselineSim = calculateLoanSimulation(loanAmount, installments, BASE_MONTHLY_RATE, new Date(2026, 8, 10));

  const handleConfirm = () => {
    onSelectDate(selectedDay, previewDate);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Dia de vencimento"
      subtitle="Juros compostos diários influenciam o valor da parcela"
      icon={<CalendarIcon className="w-5 h-5" />}
      id="due-date-modal"
    >
      <div className="space-y-4">
        {/* Days Grid with Real-time Recalculated Values */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dias disponíveis todo mês:
            </label>
            <span className="text-[11px] text-slate-400">
              {installments}x de empréstimo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {AVAILABLE_DAYS.map((day) => {
              const isSelected = selectedDay === day;
              const dateForDay = getCalculatedDate(day);
              const simForDay = calculateLoanSimulation(loanAmount, installments, BASE_MONTHLY_RATE, dateForDay);
              const diffFromBaseline = Math.round((simForDay.monthlyInstallment - baselineSim.monthlyInstallment) * 100) / 100;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`flex flex-col p-3 rounded-xl border-2 transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? 'border-[#0072e6] bg-blue-50/70 text-slate-900 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold tabular-nums">
                      Todo dia {day}
                    </span>
                    {day === 10 ? (
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded-sm">
                        Padrão
                      </span>
                    ) : day < 10 ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-sm">
                        Menos juros
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-800 font-semibold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                        <TrendingUp className="w-2.5 h-2.5 text-amber-600" />
                        Mais prazo
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5">
                    <span className="text-lg font-black text-slate-900 tabular-nums block">
                      {formatCurrency(simForDay.monthlyInstallment)}
                    </span>
                    <span className="text-[11px] text-slate-500 tabular-nums">
                      {diffFromBaseline === 0
                        ? 'Referência padrão'
                        : diffFromBaseline > 0
                        ? `+${formatCurrency(diffFromBaseline)}/mês (+ juros diários)`
                        : `${formatCurrency(diffFromBaseline)}/mês (economia)`}
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

        {/* Dynamic Preview & Financial Explanation */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600">
            <p className="font-bold text-slate-900 text-sm mb-0.5">
              Primeiro vencimento: {formatDatePtBR(previewDate)}
            </p>
            <p className="text-slate-600 mt-1 leading-relaxed">
              O valor da parcela é recalculado com base no número de dias de carência. Datas mais distantes acumulam juros compostos diários proporcionais (pró-rata die).
            </p>
            <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-xs font-semibold text-slate-800">
              <span>Nova parcela estimada:</span>
              <span className="text-blue-700 font-black tabular-nums">
                {formatCurrency(currentPreviewSim.monthlyInstallment)}
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full bg-[#0072e6] hover:bg-[#0062c4] active:scale-[0.98] text-white font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-base cursor-pointer"
        >
          <Check className="w-5 h-5" />
          Confirmar vencimento dia {selectedDay}
        </button>
      </div>
    </BottomSheet>
  );
};
