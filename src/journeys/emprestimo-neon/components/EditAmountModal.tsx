import React, { useState, useEffect } from 'react';
import { DollarSign, Check, Plus, Minus } from 'lucide-react';
import { BottomSheet } from '@/src/components/BottomSheet';
import { formatCurrency } from '../utils/finance';
import { Button } from '@/src/design-system';

interface EditAmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAmount: number;
  onConfirmAmount: (amount: number) => void;
}

const PRESET_AMOUNTS = [1000, 2000, 3000, 5000, 7500, 10000];

export const EditAmountModal: React.FC<EditAmountModalProps> = ({
  isOpen,
  onClose,
  currentAmount,
  onConfirmAmount,
}) => {
  const [amount, setAmount] = useState<number>(currentAmount);

  // Keep bottom sheet amount strictly in sync with the first layer
  useEffect(() => {
    if (isOpen) {
      setAmount(currentAmount);
    }
  }, [isOpen, currentAmount]);

  const handleStep = (delta: number) => {
    setAmount((prev) => Math.max(500, Math.min(10000, prev + delta)));
  };

  const handleSave = () => {
    onConfirmAmount(amount);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Valor do empréstimo"
      subtitle="Escolha o valor que deseja simular"
      id="edit-amount-modal"
    >
      <div className="space-y-6">
        {/* Value Display with Stepper */}
        <div className="text-center">
          <div className="text-4xl font-black text-slate-900 tracking-tight my-2 tabular-nums">
            {formatCurrency(amount)}
          </div>
          <p className="text-xs text-slate-400 font-medium">Disponível de R$ 500 a R$ 10.000</p>

          {/* Stepper Controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={() => handleStep(-500)}
              disabled={amount <= 500}
              aria-label="Diminuir R$ 500"
              className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-700 font-bold transition-all cursor-pointer active:scale-90"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Passo de R$ 500
            </span>
            <button
              type="button"
              onClick={() => handleStep(500)}
              disabled={amount >= 10000}
              aria-label="Aumentar R$ 500"
              className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-700 font-bold transition-all cursor-pointer active:scale-90"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick preset chips */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
            Valores sugeridos:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((val) => {
              const isSelected = amount === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer tabular-nums ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {formatCurrency(val)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <Button
          type="button"
          size="md"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
        >
          <Check className="w-5 h-5" />
          Confirmar {formatCurrency(amount)}
        </Button>
      </div>
    </BottomSheet>
  );
};
