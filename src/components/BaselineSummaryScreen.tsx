import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { ChevronRight, HelpCircle, Edit2 } from 'lucide-react';
import { TopNavBar } from './TopNavBar';
import { BottomSheet } from './BottomSheet';
import { PinBottomSheet } from './PinBottomSheet';
import { formatCurrency, formatDatePtBR } from '../utils/finance';
import { hapticLight, hapticMedium, hapticSuccess } from '../utils/haptics';
import type { LoanSimulationData } from './LoanSimulationScreen';

import iconEditorMonetizationOnSvg from '../assets/icon-editor-monetization-on.svg';
import iconNeonLoanSvg from '../assets/icon-neon-loan.svg';

interface BaselineSummaryScreenProps {
  loanAmount: number;
  simulationData: LoanSimulationData | null;
  onBack: () => void;
  onRestart?: () => void;
  onEditAmount?: () => void;
  onEditInstallments?: () => void;
  onEditDueDate?: () => void;
  onContract?: () => void;
}

const BASE_MONTHLY_RATE = 0.0467; // Updated to match the screenshot (4.67%)

const screenEntranceVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const BaselineSummaryScreen: React.FC<BaselineSummaryScreenProps> = ({
  loanAmount,
  simulationData,
  onBack,
  onEditAmount,
  onEditInstallments,
  onEditDueDate,
  onContract,
}) => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'juros' | 'cet' | 'protecao' | null>(null);

  const getDayOrFallback = () => {
    if (simulationData?.firstDueDate) {
      return simulationData.firstDueDate.getDate();
    }
    return 16;
  };

  const getFirstDueDateFormatted = () => {
    if (simulationData?.firstDueDate) {
      return formatDatePtBR(simulationData.firstDueDate);
    }
    return `16/12/${new Date().getFullYear()}`;
  };

  const installmentsCount = simulationData?.installments || 7;
  const monthlyValue = simulationData?.monthlyInstallment || 423.16;
  const totalValue = simulationData?.totalCost || 2962.12;

  return (
    <motion.div 
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col bg-white overflow-hidden select-none"
      id="baseline-summary-screen"
    >
      <TopNavBar 
        title="Detalhes da proposta" 
        showBack={true} 
        onBack={onBack} 
        rightAction="help"
      />

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-48 flex flex-col gap-4">
        
        {/* Card 1: Detalhes do empréstimo */}
        <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden shrink-0">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <img src={iconNeonLoanSvg} alt="Loan Icon" className="w-[18px] h-[18px] opacity-70" />
            <h3 className="text-[15px] font-bold text-[#2D3342]">Detalhes do empréstimo</h3>
          </div>

          <div className="flex flex-col">
            <div 
              className="px-5 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => { hapticLight(); onEditAmount?.(); }}
            >
              <div>
                <p className="text-[14px] font-bold text-[#2D3342] mb-1">Valor solicitado</p>
                <p className="text-[14px] font-medium text-[#545B6F]">{formatCurrency(loanAmount)}</p>
              </div>
              <Edit2 className="w-[18px] h-[18px] text-[#0078D9]" />
            </div>

            <div 
              className="px-5 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => { hapticLight(); onEditInstallments?.(); }}
            >
              <div>
                <p className="text-[14px] font-bold text-[#2D3342] mb-1">Parcelamento escolhido</p>
                <p className="text-[14px] font-medium text-[#545B6F]">{installmentsCount} de {formatCurrency(monthlyValue)}</p>
              </div>
              <Edit2 className="w-[18px] h-[18px] text-[#0078D9]" />
            </div>

            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-[#2D3342] mb-1">Valor total a pagar</p>
                <p className="text-[14px] font-medium text-[#545B6F]">{formatCurrency(totalValue)}</p>
              </div>
            </div>

            <div 
              className="px-5 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => { hapticLight(); onEditDueDate?.(); }}
            >
              <div>
                <p className="text-[14px] font-bold text-[#2D3342] mb-1">Primeiro vencimento</p>
                <p className="text-[14px] font-medium text-[#545B6F]">{getFirstDueDateFormatted()}</p>
              </div>
              <Edit2 className="w-[18px] h-[18px] text-[#0078D9]" />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold text-[#2D3342] mb-1">Demais vencimentos</p>
                <p className="text-[14px] font-medium text-[#545B6F]">Todo dia {getDayOrFallback()} de cada mês</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Resumo dos custos */}
        <div className="bg-white rounded-[16px] border border-slate-200 overflow-hidden shrink-0">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <img src={iconEditorMonetizationOnSvg} alt="Cost Icon" className="w-[18px] h-[18px] opacity-70" />
            <h3 className="text-[15px] font-bold text-[#2D3342]">Resumo dos custos</h3>
          </div>

          <div className="flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-[14px] font-bold text-[#2D3342]">Juros ao mês</p>
              </div>
              <p className="text-[14px] font-medium text-[#545B6F]">{(BASE_MONTHLY_RATE * 100).toFixed(2).replace('.', ',')}%</p>
            </div>

            <div className="px-5 py-4 border-b border-slate-100 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-[14px] font-bold text-[#2D3342]">CET ao ano</p>
              </div>
              <p className="text-[14px] font-medium text-[#545B6F]">2,93%</p>
            </div>

            <div className="px-5 py-4 flex flex-col justify-between border-b border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-[14px] font-bold text-[#2D3342]">Proteção do empréstimo</p>
              </div>
              <p className="text-[14px] font-medium text-[#545B6F]">7,9% do valor do empréstimo</p>
            </div>
            
            <button className="w-full py-4 text-[14px] font-bold text-[#0078D9] flex items-center justify-between px-5 active:bg-slate-50 transition-colors">
              Detalhes dos custos
              <ChevronRight className="w-4 h-4 text-[#0078D9]" />
            </button>
          </div>
        </div>

      </div>

      <div className="absolute bottom-0 inset-x-0 bg-[#F5FAFF] pt-4 pb-5 px-5 z-20 flex flex-col items-center">
        <p className="text-[12px] text-[#545B6F] text-center mb-4 leading-relaxed px-2">
          Ao contratar, você aceita os <a href="#" className="text-[#0078D9] font-bold underline underline-offset-2">Termos de Uso</a> e <a href="#" className="text-[#0078D9] font-bold underline underline-offset-2">autoriza a cobrança da proteção</a> e débito na conta Neo do valor total ou parcial das parcelas no dia do vencimento ou após
        </p>
        <button
          type="button"
          onClick={() => {
            hapticMedium();
            setIsPinModalOpen(true);
          }}
          className="w-full bg-[#0078D9] hover:bg-[#0062c4] active:scale-[0.98] text-white font-bold py-[14px] rounded-full transition-all duration-200 cursor-pointer text-[15px]"
        >
          Contratar empréstimo
        </button>
      </div>

      {/* Info Modal */}
      <BottomSheet
        isOpen={infoModalType !== null}
        onClose={() => setInfoModalType(null)}
        title={
          infoModalType === 'juros' ? 'Juros ao mês' :
          infoModalType === 'cet' ? 'CET ao ano' :
          infoModalType === 'protecao' ? 'Proteção do empréstimo' : ''
        }
      >
        <div className="flex flex-col mb-4">
          {infoModalType === 'juros' && (
            <p className="text-[14px] text-[#475569] leading-relaxed">
              A taxa de juros ao mês é o percentual cobrado sobre o valor que você pegou emprestado.
            </p>
          )}
          {infoModalType === 'cet' && (
            <p className="text-[14px] text-[#475569] leading-relaxed">
              O Custo Efetivo Total (CET) demonstra o custo real e total do seu empréstimo por ano.
            </p>
          )}
          {infoModalType === 'protecao' && (
            <p className="text-[14px] text-[#475569] leading-relaxed">
              O custo da proteção é calculado como um percentual único de 7,9% sobre o valor total emprestado.
            </p>
          )}
          <button
            onClick={() => { hapticLight(); setInfoModalType(null); }}
            className="w-full mt-6 bg-[#0078D9] active:scale-[0.98] text-white font-bold py-3.5 rounded-full transition-all text-[15px]"
          >
            Entendi
          </button>
        </div>
      </BottomSheet>

      {/* PIN Confirmation Modal */}
      <PinBottomSheet
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setTimeout(() => {
            onContract?.();
          }, 300);
        }}
      />
    </motion.div>
  );
};
