import React, { useEffect } from 'react';
import { motion, type Variants } from 'motion/react';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hapticLight, hapticSuccess } from '@/src/utils/haptics';
import { formatCurrency } from '../utils/finance';
import { Button } from '@/src/design-system';
import type { LoanSimulationData } from './LoanSimulationScreen';

interface BaselineSuccessScreenProps {
  loanAmount: number;
  simulationData: LoanSimulationData | null;
  onFinish: () => void;
}

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

export const BaselineSuccessScreen: React.FC<BaselineSuccessScreenProps> = ({ 
  loanAmount, 
  simulationData,
  onFinish 
}) => {
  useEffect(() => {
    hapticSuccess();
    try {
      const count = 130;
      const colors = ['#e4a853', '#d99738', '#ffffff', '#f4ce90'];
      
      const defaults = {
        origin: { y: 0.4 },
        zIndex: 50,
        colors: colors,
      };

      const fire = (particleRatio: number, opts: any) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.20, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.10, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.10, { spread: 120, startVelocity: 45 });
    } catch {
      // Safe fallback if confetti fails
    }
  }, []);

  const installmentsCount = simulationData?.installments || 7;
  const monthlyValue = simulationData?.monthlyInstallment || 423.16;

  // Format first due date: '22 de outubro'
  const formatFirstDueDate = () => {
    if (simulationData?.firstDueDate) {
      return simulationData.firstDueDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    }
    return '16 de dezembro'; // fallback
  };

  return (
    <motion.div 
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col bg-white overflow-hidden select-none relative z-10" 
      id="baseline-success-screen"
    >
      {/* Top Section (Green) */}
      <div className="w-full bg-[#EBF7EB] pt-10 pb-8 px-5 relative shrink-0">
        <div className="w-full flex justify-end mb-10 relative z-20">
          <button
            onClick={() => {
              hapticLight();
              onFinish();
            }}
            className="w-9 h-9 rounded-full bg-white text-[#0078D9] flex items-center justify-center active:scale-95 transition-transform shadow-[0_2px_12px_rgba(0,0,0,0.06)] cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="pr-6 relative z-20"
        >
          <h2 className="text-[26px] font-extrabold text-[#38763B] leading-tight tracking-tight">
            Parabéns!
          </h2>
          <h2 className="text-[26px] font-extrabold text-[#2D3342] leading-tight tracking-tight mt-1">
            Você conquistou seu empréstimo!
          </h2>
        </motion.div>
      </div>

      {/* Middle Section (White, Details) */}
      <div className="flex-1 flex flex-col px-5 pt-8 bg-white relative z-20">
        
        <div className="border-b border-slate-200 pb-4 mb-4">
          <p className="text-[13px] text-[#545B6F] mb-1">Valor a receber em até 2 horas</p>
          <p className="text-[16px] font-bold text-[#2D3342]">{formatCurrency(loanAmount)}</p>
        </div>

        <div className="border-b border-slate-200 pb-4 mb-4">
          <p className="text-[13px] text-[#545B6F] mb-1">Parcelamento</p>
          <p className="text-[16px] font-bold text-[#2D3342]">{installmentsCount}x de {formatCurrency(monthlyValue)}</p>
        </div>

        <div className="border-b border-slate-200 pb-4 mb-4">
          <p className="text-[13px] text-[#545B6F] mb-1">Data da primeira parcela</p>
          <p className="text-[16px] font-bold text-[#2D3342] capitalize">{formatFirstDueDate()}</p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 inset-x-0 p-5 bg-white z-20 pb-8 shrink-0">
        <Button
          size="lg"
          onClick={() => {
            hapticLight();
            onFinish();
          }}
        >
          Fechar
        </Button>
      </div>

    </motion.div>
  );
};
