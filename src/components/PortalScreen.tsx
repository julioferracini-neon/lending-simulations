import React from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { hapticMedium } from '../utils/haptics';

const SILKY_EASE = [0.16, 1, 0.3, 1] as const;

const itemEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: SILKY_EASE,
    },
  },
};

interface PortalScreenProps {
  onNavigateHome: () => void;
}

export const PortalScreen: React.FC<PortalScreenProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full h-full bg-[#f3f6fa] flex flex-col p-6 pt-16 overflow-y-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemEntranceVariants}
        className="flex flex-col gap-2 mb-10"
      >
        <h1 className="text-3xl font-extrabold text-[#142742] tracking-tight">
          Lending – User Test Hub
        </h1>
        <p className="text-slate-500 text-sm">
          Selecione a jornada que deseja navegar:
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemEntranceVariants}
        className="flex flex-col gap-4"
      >
        <button
          type="button"
          onClick={() => {
            hapticMedium();
            onNavigateHome();
          }}
          className="group w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left flex flex-col gap-2 cursor-pointer active:scale-95"
        >
          <div className="w-full flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#142742]">Dynamic Offer</h2>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed pr-8">
            Product Vision de Personal Loan com "Encontre seu Produto" e nova proposta de "Simulador".
          </p>
        </button>
      </motion.div>
    </div>
  );
};
