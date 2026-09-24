import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { ArrowRight, Figma, Lightbulb, X, ExternalLink, Clock } from 'lucide-react';
import { hapticMedium, hapticLight } from '../utils/haptics';

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

const bottomSheetVariants: Variants = {
  hidden: { y: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
  visible: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
};

interface PortalScreenProps {
  onNavigateHome: () => void;
  onNavigateBaseline: () => void;
}

export const PortalScreen: React.FC<PortalScreenProps> = ({ onNavigateHome, onNavigateBaseline }) => {
  const [selectedHypothesis, setSelectedHypothesis] = useState<{ title: string; text: string } | null>(null);

  const prototypes = [
    {
      id: 'do-01',
      title: 'Dynamic Offer (DO-01)',
      description: 'Visão de produto: como o usuário contrata Empréstimo Pessoal através do Hub que concentra os produtos de crédito disponíveis.',
      status: 'Pronto para teste',
      lastUpdate: '23 Set 2026, 10:15',
      figmaUrl: 'https://www.figma.com/design/e8K4rLAkYXZxjO5F9MoHWp/-Main--Personal-Loan-%25E2%2580%2593-In-app-Flows?node-id=4910-5266&t=WymtrVzE9WnxNIMA-11',
      hypothesis: {
        title: 'Hipótese: Hub Dinâmico',
        text: 'Acreditamos que, ao centralizar todas as ofertas de crédito em um Hub dinâmico (com limites e taxas expostos antecipadamente), reduziremos o atrito inicial e aumentaremos a conversão. O novo simulador com valores em pílulas também deve diminuir o tempo de input de valor.',
      },
      onAction: onNavigateHome,
    },
    {
      id: 'baseline',
      title: 'Baseline (Controle)',
      description: 'O fluxo de Empréstimo Pessoal exatamente como está em produção hoje. Utilize este protótipo como Grupo de Controle.',
      status: 'Pronto para teste',
      lastUpdate: '24 Set 2026, 14:35',
      figmaUrl: 'https://www.figma.com/design/e8K4rLAkYXZxjO5F9MoHWp/-Main--Personal-Loan-%25E2%2580%2593-In-app-Flows?node-id=5219-31906&t=WymtrVzE9WnxNIMA-11',
      hypothesis: {
        title: 'Grupo de Controle',
        text: 'Este fluxo representa a jornada atual em produção. Os dados de performance e conversão gerados aqui servem de linha de base (baseline) para validar se o novo protótipo trouxe melhora estatística.',
      },
      onAction: onNavigateBaseline,
    },
    // Future prototypes can be added here
  ];

  return (
    <div className="w-full h-full bg-[#f3f6fa] flex flex-col relative select-none overflow-hidden" id="portal-screen">
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-24 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemEntranceVariants}
          className="flex flex-col gap-2 mb-8"
        >
          <h1 className="text-3xl font-extrabold text-[#142742] tracking-tight leading-tight">
            Protótipos de Empréstimo Pessoal
          </h1>
          <p className="text-slate-500 text-[15px] leading-relaxed">
            Hipóteses para Q4.2026. Selecione o protótipo que deseja avaliar.
          </p>
        </motion.div>

        <div className="flex flex-col gap-5">
          {prototypes.map((proto, index) => (
            <motion.div
              key={proto.id}
              initial="hidden"
              animate="visible"
              variants={itemEntranceVariants}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                {proto.status && (
                  <div className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full ${proto.status === 'Crafting' ? 'bg-orange-100' : 'bg-green-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${proto.status === 'Crafting' ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${proto.status === 'Crafting' ? 'text-orange-700' : 'text-green-700'}`}>
                      {proto.status}
                    </span>
                  </div>
                )}
                <h2 className="text-[19px] font-bold text-[#142742] mt-1">{proto.title}</h2>
                <p className="text-[#475569] text-[14px] leading-relaxed">
                  {proto.description}
                </p>
              </div>

              {/* Links & Metadata */}
              <div className="flex flex-col gap-3 py-3 border-y border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setSelectedHypothesis(proto.hypothesis);
                  }}
                  className="flex items-center justify-between group active:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-2 text-[#0073e6]">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <span className="text-[14px] font-semibold">Ver hipótese</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>

                <a
                  href={proto.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => hapticLight()}
                  className="flex items-center justify-between group active:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-2 text-[#0073e6]">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Figma className="w-4 h-4" />
                    </div>
                    <span className="text-[14px] font-semibold">Design no Figma</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </a>
              </div>

              {/* Action Button & Metadata */}
              <div className="flex flex-col gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    hapticMedium();
                    proto.onAction();
                  }}
                  className="w-full bg-[#0073e6] text-white font-semibold text-[15px] rounded-full py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
                >
                  Acessar Protótipo
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                {proto.lastUpdate && (
                  <div className="flex items-center justify-center gap-1.5 opacity-70">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Atualizado em: {proto.lastUpdate}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hypothesis Bottom Sheet */}
      <AnimatePresence>
        {selectedHypothesis && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-[#142742]/40 z-40"
              onClick={() => setSelectedHypothesis(null)}
            />
            <motion.div
              variants={bottomSheetVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setSelectedHypothesis(null);
                }
              }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-[28px] z-50 flex flex-col shadow-2xl"
              style={{ maxHeight: '90%' }}
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1.5 rounded-full bg-slate-200" />
              </div>

              {/* Header */}
              <div className="px-5 pb-4 flex items-center justify-between border-b border-slate-100">
                <h3 className="font-bold text-[#142742] text-[18px]">
                  {selectedHypothesis.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedHypothesis(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 overflow-y-auto">
                <p className="text-[#475569] text-[15px] leading-relaxed">
                  {selectedHypothesis.text}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
