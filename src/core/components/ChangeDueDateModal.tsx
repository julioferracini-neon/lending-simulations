import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { BottomSheet } from '@/src/components/BottomSheet';
import { Button } from '@/src/design-system';
import { calculateLoanSimulation, formatCurrency, formatDatePtBR, BASE_MONTHLY_RATE, getDefaultFirstDueDate } from '../utils/finance';

interface ChangeDueDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  currentDate: Date;
  onSelectDate: (day: number, newDate: Date) => void;
  loanAmount?: number;
  installments?: number;
}

export const ChangeDueDateModal: React.FC<ChangeDueDateModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  onSelectDate,
  loanAmount = 2000,
  installments = 7,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  // Calculate next 5 business days starting from the default first due date (1 month ahead)
  useEffect(() => {
    if (isOpen) {
      const dates: Date[] = [];
      let current = getDefaultFirstDueDate();
      current.setHours(0, 0, 0, 0);
      
      while (dates.length < 5) {
        const dayOfWeek = current.getDay();
        // 0 is Sunday, 6 is Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          dates.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      }
      setAvailableDates(dates);
      
      // Try to find the exact current date in the options, otherwise default to the first one
      const found = dates.find(d => d.getTime() === currentDate.getTime());
      setSelectedDate(found || dates[0]);
    }
  }, [isOpen, currentDate]);

  const currentPreviewSim = calculateLoanSimulation(loanAmount, installments, BASE_MONTHLY_RATE, selectedDate);

  const handleConfirm = () => {
    onSelectDate(selectedDate.getDate(), selectedDate);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Data de vencimento"
      subtitle="Escolha a data do seu primeiro pagamento"
      id="due-date-modal"
    >
      <div className="space-y-4">
        {/* Simple Horizontal Calendar for next 5 business days */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dias úteis disponíveis
            </label>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableDates.map((date) => {
              const isSelected = selectedDate.getTime() === date.getTime();
              const day = date.getDate();
              const weekDay = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center min-w-[70px] py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0073ea] bg-blue-50/70 text-[#0073ea]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-medium uppercase mb-1">{weekDay}</span>
                  <span className="text-xl font-bold">{day}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Preview & Financial Explanation */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700">Primeiro pagamento</span>
            <span className="text-[15px] font-bold text-slate-800">{formatDatePtBR(selectedDate)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-slate-700">
            <span>Valor da parcela</span>
            <span className="text-[#0073ea] font-bold text-lg">
              {formatCurrency(currentPreviewSim.monthlyInstallment)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-tight">
            As datas influenciam os juros aplicados (pró-rata).
          </p>
        </div>

        {/* Action button */}
        <Button
          type="button"
          size="md"
          onClick={handleConfirm}
        >
          Confirmar
        </Button>
      </div>
    </BottomSheet>
  );
};
