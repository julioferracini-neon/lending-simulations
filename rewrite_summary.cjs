const fs = require('fs');

const content = `import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { ChevronRight, FileText, Percent, HelpCircle, Edit2 } from 'lucide-react';
import { TopNavBar } from './TopNavBar';
import { BottomSheet } from './BottomSheet';
import { PinBottomSheet } from './PinBottomSheet';
import { formatCurrency, formatDatePtBR } from '../utils/finance';
import { hapticLight, hapticMedium, hapticSuccess } from '../utils/haptics';
import type { LoanSimulationData } from './LoanSimulationScreen';

interface BaselineSummaryScreenProps {
  loanAmount: number;
  simulationData: LoanSimulationData | null;
  onBack: () => void;
  onEditAmount?: () => void;
  onEditInstallments?: () => void;
  onEditDueDate?: () => void;
  onContract?: () => void;
}

const BASE_MONTHLY_RATE = 0.0529;

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
    return \`16/12/\${new Date().getFullYear()}\`;
  };

  const installmentsCount = simulationData?.installments || 12;
  const monthlyValue = simulationData?.monthlyInstallment || (loanAmount * 1.15) / installmentsCount;
  const totalValue = simulationData?.totalCost || (monthlyValue * installmentsCount);

  return (
    <motion.div 
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col bg-[#f4f7fb] overflow-hidden select-none"
      id="baseline-summary-screen"
    >
      <TopNavBar 
        title="Resumo do empréstimo" 
        showBack={true} 
        onBack={onBack} 
        rightAction="none"
      />

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-32 flex flex-col gap-6">
        
        {/* Card 1: Resumo do empréstimo */}
        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3d70e0]">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-[16px] font-bold text-[#142742]">Resumo do empréstimo</h3>
          </div>

          <div className="flex flex-col">
            <div 
              className="px-5 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => { hapticLight(); onEditAmount?.(); }}
            >
              <div>
                <p className="text-[13px] text-[#5c6b8f] mb-0.5">Valor recebido</p>
                <p className="text-[15px] font-bold text-[#142742]">{formatCurrency(loanAmount)}</p>
              </div>
              <Edit2 className="w-[18px] h-[18px] text-[#3d70e0]" />
            </div>

            <div 
              className="px-5 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => { hapticLight(); onEditInstallments?.(); }}
            >
              <div>
                <p className="text-[13px] text-[#5c6b8f] mb-0.5">Parcelas</p>
                <p className="text-[15px] font-bold text-[#142742]">{installmentsCount}x de {formatCurrency(monthlyValue)}</p>
              </div>
              <Edit2 className="w-[18px] h-[18px] text-[#3d70e0]" />
            </div>

            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#5c6b8f] mb-0.5">Valor total pago</p>
                <p className="text-[15px] font-bold text-[#142742]">{formatCurrency(totalValue)}</p>
              </div>
            </div>

            <div 
              className="px-5 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => { hapticLight(); onEditDueDate?.(); }}
            >
              <div>
                <p className="text-[13px] text-[#5c6b8f] mb-0.5">Primeiro vencimento</p>
                <p className="text-[15px] font-bold text-[#142742]">{getFirstDueDateFormatted()}</p>
              </div>
              <Edit2 className="w-[18px] h-[18px] text-[#3d70e0]" />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#5c6b8f] mb-0.5">Vencimento</p>
                <p className="text-[15px] font-bold text-[#142742]">Todo dia {getDayOrFallback()} de cada mês</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Resumo dos custos */}
        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3d70e0]">
              <Percent className="w-4 h-4" />
            </div>
            <h3 className="text-[16px] font-bold text-[#142742]">Resumo dos custos</h3>
          </div>

          <div className="flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[14px] text-[#5c6b8f]">Juros ao mês</p>
                <button onClick={() => { hapticLight(); setInfoModalType('juros'); }}>
                  <HelpCircle className="w-[14px] h-[14px] text-[#94a3b8]" />
                </button>
              </div>
              <p className="text-[14px] font-semibold text-[#142742]">{(BASE_MONTHLY_RATE * 100).toFixed(2).replace('.', ',')}%</p>
            </div>

            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[14px] text-[#5c6b8f]">CET ao ano</p>
                <button onClick={() => { hapticLight(); setInfoModalType('cet'); }}>
                  <HelpCircle className="w-[14px] h-[14px] text-[#94a3b8]" />
                </button>
              </div>
              <p className="text-[14px] font-semibold text-[#142742]">45,82%</p>
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[14px] text-[#5c6b8f]">Proteção do empréstimo</p>
                <button onClick={() => { hapticLight(); setInfoModalType('protecao'); }}>
                  <HelpCircle className="w-[14px] h-[14px] text-[#94a3b8]" />
                </button>
              </div>
              <p className="text-[14px] font-semibold text-[#142742]">7,9% do valor solicitado</p>
            </div>
          </div>
          
          <button className="w-full py-4 bg-slate-50 text-[14px] font-bold text-[#3d70e0] flex items-center justify-center gap-2 active:bg-slate-100 transition-colors">
            🔗 MAIS DETALHES
          </button>
        </div>

      </div>

      <div className="fixed bottom-0 inset-x-0 p-5 bg-white border-t border-slate-200 z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={() => {
            hapticMedium();
            setIsPinModalOpen(true);
          }}
          className="w-full bg-[#467bed] hover:bg-[#3666d4] active:bg-[#2b54b5] text-white font-semibold py-[15px] rounded-full transition-all duration-200 cursor-pointer text-[16px]"
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
            className="w-full mt-6 bg-[#467bed] active:scale-[0.98] text-white font-bold py-3.5 rounded-full transition-all text-[15px]"
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
`;

fs.writeFileSync('src/components/BaselineSummaryScreen.tsx', content);
