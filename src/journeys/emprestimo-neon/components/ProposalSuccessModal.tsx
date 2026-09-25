import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BottomSheet } from '@/src/components/BottomSheet';
import { formatCurrency, formatDatePtBR } from '../utils/finance';
import { Button } from '@/src/design-system';

interface ProposalSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  installments: number;
  monthlyInstallment: number;
  totalCost: number;
  firstDueDate: Date;
}

export const ProposalSuccessModal: React.FC<ProposalSuccessModalProps> = ({
  isOpen,
  onClose,
  loanAmount,
  installments,
  monthlyInstallment,
  totalCost,
  firstDueDate,
}) => {
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSigned(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0072e6', '#00b0ff', '#10b981', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  const handleSign = () => {
    setIsSigned(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      id="proposal-success-modal"
    >
      <div className="text-center py-2 space-y-4">
        {/* Icon with animated ring */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.45 }}
            className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner"
          >
            <CheckCircle2 className="w-9 h-9" />
          </motion.div>
          <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Proposta Selecionada!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Pré-aprovação verificada com condições personalizadas.
          </p>
        </div>

        {/* Proposal Summary Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Valor aprovado:</span>
            <span className="font-bold text-slate-900 text-sm tabular-nums">{formatCurrency(loanAmount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Plano de pagamento:</span>
            <span className="font-bold text-blue-600 text-sm tabular-nums">{installments}x de {formatCurrency(monthlyInstallment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Primeiro vencimento:</span>
            <span className="font-medium text-slate-800">{formatDatePtBR(firstDueDate)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-slate-200/80 pt-2">
            <span className="text-slate-500">Custo total estimado:</span>
            <span className="font-extrabold text-slate-900 tabular-nums">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Contratação 100% digital com segurança criptografada</span>
        </div>

        {isSigned ? (
          <div className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 text-sm">
            <Check className="w-5 h-5" />
            Contrato Assinado com Sucesso!
          </div>
        ) : (
          <Button
            type="button"
            size="md"
            onClick={handleSign}
            className="flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <span>Confirmar e assinar contrato</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </BottomSheet>
  );
};
