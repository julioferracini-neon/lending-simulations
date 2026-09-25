import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowLeft, HelpCircle, ChevronRight, Check } from 'lucide-react';
import { formatCurrency } from '../utils/finance';
import { hapticLight, hapticMedium } from '@/src/utils/haptics';
import { TopNavBar } from '@/src/components/TopNavBar';
import { Button } from '@/src/design-system';

interface BaselineLoanHubScreenProps {
  maxPersonalLimit?: number;
  onSelectPersonalLoan: () => void;
  onBack?: () => void;
}

// Ultra-smooth easing curve matching simulation and input value screens
const SILKY_EASE = [0.22, 1, 0.36, 1] as const;

const screenEntranceVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
      duration: 0.7,
      ease: SILKY_EASE,
    },
  },
};

const itemEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: SILKY_EASE,
    },
  },
};

export const BaselineLoanHubScreen: React.FC<BaselineLoanHubScreenProps> = ({
  maxPersonalLimit = 10000,
  onSelectPersonalLoan,
  onBack,
}) => {
  const [isDataprevChecked, setIsDataprevChecked] = useState(true);

  return (
    <motion.div
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col flex-1 min-h-0 bg-white relative select-none overflow-hidden"
      id="loan-hub-screen"
    >
      {/* Scrollable Container with sticky TopNavBar */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <TopNavBar 
          title="Empréstimos" 
          showBack={true} 
          onBack={onBack} 
          rightAction="help" 
          variants={itemEntranceVariants} 
        />

        {/* Main Content Area */}
        <main className="px-5 pt-2 pb-16">
          {/* Screen Headline */}
          <motion.h2
            variants={itemEntranceVariants}
            className="text-2xl sm:text-[27px] font-bold text-[#142742] tracking-tight leading-snug mb-5"
          >
            Opções disponíveis
          </motion.h2>

        <div className="space-y-4">
          {/* Card 1: Empréstimo Pessoal (Fluxo testável principal) */}
          <motion.div
            variants={itemEntranceVariants}
            className="bg-[#f2f6fa] rounded-[26px] p-5 sm:p-6 border border-slate-100/80"
          >
            <div>
              <h3 className="text-[17px] font-bold text-[#142742] tracking-tight">
                Empréstimo pessoal
              </h3>
              <p className="text-[14px] text-[#475569] mt-0.5">
                Dinheiro na conta em minutos
              </p>
            </div>

            <div className="border-b border-slate-200/80 my-3.5" />

            <div>
              <div className="text-[22px] sm:text-[25px] font-black text-[#142742] tracking-tight">
                até {formatCurrency(maxPersonalLimit)}
              </div>
              <p className="text-[13px] text-[#475569] mt-0.5 mb-4">
                taxas a partir de 2.33% a.m.
              </p>
            </div>

            <Button
              size="md"
              type="button"
              onClick={() => {
                hapticMedium();
                onSelectPersonalLoan();
              }}
            >
              Simular
            </Button>
          </motion.div>

          {/* Card 2: Empréstimo Consignado */}
          <motion.div
            variants={itemEntranceVariants}
            className="bg-[#f2f6fa] rounded-[26px] p-5 sm:p-6 border border-slate-100/80"
          >
            <div>
              <h3 className="text-[17px] font-bold text-[#142742] tracking-tight">
                Empréstimo consignado
              </h3>
              <p className="text-[14px] text-[#475569] mt-0.5">
                Para CLT com desconto em folha
              </p>
            </div>

            <div className="border-b border-slate-200/80 my-3.5" />

            <div>
              <p className="text-[13px] text-[#475569] mb-4">
                taxas a partir de 2.33% a.m.
              </p>
            </div>

            <Button
              size="md"
              type="button"
              onClick={() => hapticLight()}
            >
              Conferir
            </Button>
          </motion.div>

          {/* Card 3: Compra Planejada */}
          <motion.div
            variants={itemEntranceVariants}
            className="bg-[#f2f6fa] rounded-[26px] p-5 sm:p-6 border border-slate-100/80"
          >
            <div>
              <h3 className="text-[17px] font-bold text-[#142742] tracking-tight">
                Compra planejada
              </h3>
              <p className="text-[14px] text-[#475569] mt-0.5">
                Previsibilidade no orçamento
              </p>
            </div>

            <div className="border-b border-slate-200/80 my-3.5" />

            <div>
              <div className="text-[22px] sm:text-[25px] font-black text-[#142742] tracking-tight">
                até R$ 5.000,00
              </div>
              <p className="text-[13px] text-[#475569] mt-0.5 mb-4">
                taxas a partir de 2.33% a.m.
              </p>
            </div>

            <Button
              size="md"
              type="button"
              onClick={() => hapticLight()}
            >
              Simular
            </Button>
          </motion.div>
        </div>

        {/* Seção: Conheça também */}
        <motion.div variants={itemEntranceVariants} className="mt-8">
          <h3 className="text-lg sm:text-[19px] font-bold text-[#142742] tracking-tight mb-3">
            Conheça também
          </h3>

          <div
            onClick={() => hapticLight()}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center justify-between gap-3.5 hover:border-slate-300 transition-colors cursor-pointer shadow-xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#eaf4fe] flex items-center justify-center shrink-0 text-[#0073e6]">
              {/* Asset ic_device_data_usage_outline */}
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95z" />
                <path d="M12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.04-4.09l-2.45-1.49C16.18 17.81 14.28 19 12 19z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[15px] text-[#142742] tracking-tight">
                Open Finance
              </h4>
              <p className="text-[13px] text-[#475569] leading-snug mt-0.5">
                Amplie sua oferta de crédito de forma segura e transparente.
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-[#0073e6] shrink-0 stroke-[2.5]" />
          </div>
        </motion.div>

        {/* Footer / Dataprev Notice */}
        <motion.div
          variants={itemEntranceVariants}
          className="px-3 pt-7 pb-4"
        >
          {/* Dataprev Checkbox */}
          <div 
            className="flex items-start gap-3 cursor-pointer select-none" 
            onClick={() => {
              hapticLight();
              setIsDataprevChecked(!isDataprevChecked);
            }}
          >
            <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center border transition-colors mt-0.5 ${isDataprevChecked ? 'bg-[#0073e6] border-[#0073e6]' : 'border-slate-300 bg-white'}`}>
              {isDataprevChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <p className="text-[13px] leading-tight text-[#475569] text-left">
              Autorizo a Neon a consultar meus dados na Dataprev.{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); hapticLight(); }} className="text-[#0073e6] underline decoration-1 underline-offset-2 font-medium">
                Termos do Crédito do Trabalhador
              </a>
            </p>
          </div>
        </motion.div>
      </main>
      </div>
    </motion.div>
  );
};
