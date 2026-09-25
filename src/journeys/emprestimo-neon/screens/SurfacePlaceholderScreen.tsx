import React from 'react';
import { motion, type Variants } from 'motion/react';
import { CreditCard, QrCode, TrendingUp, Sparkles } from 'lucide-react';
import { TopNavBar } from '@/src/components/TopNavBar';
import { BottomNavBar } from '../components/BottomNavBar';

export type SurfaceTab = 'cartao' | 'pix' | 'investir';

interface SurfacePlaceholderScreenProps {
  tab: SurfaceTab;
  onSelectHome: () => void;
  onSelectProducts: () => void;
  onSelectTab: (tab: SurfaceTab) => void;
}

const TAB_CONFIG: Record<
  SurfaceTab,
  {
    title: string;
    headline: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
  }
> = {
  cartao: {
    title: 'Cartão',
    headline: 'Seus cartões de crédito e débito',
    description:
      'Acompanhe limites disponíveis, faturas em aberto e crie cartões virtuais para compras seguras online.',
    icon: <CreditCard className="w-8 h-8 text-[#0078D9]" />,
    features: ['Limite ajustável na hora', 'Cartão virtual dinâmico', 'Cashback e pontos turbinados'],
  },
  pix: {
    title: 'Pix',
    headline: 'Área Pix instantânea',
    description:
      'Transfira, receba, copie e cole ou escaneie QR Codes com liquidação 24 horas por dia.',
    icon: <QrCode className="w-8 h-8 text-[#0078D9]" />,
    features: ['Pix no crédito com parcelamento', 'Chaves Pix seguras', 'Comprovantes instantâneos'],
  },
  investir: {
    title: 'Investir',
    headline: 'Multiplique seu dinheiro na Neon',
    description:
      'CDBs com rentabilidade diária de até 113% do CDI, liquidez imediata e garantia do FGC.',
    icon: <TrendingUp className="w-8 h-8 text-[#0078D9]" />,
    features: ['Rentabilidade diária', 'Resgate imediato quando quiser', 'Protegido pelo FGC'],
  },
};

const SILKY_EASE = [0.22, 1, 0.36, 1] as const;

const screenEntranceVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
      duration: 0.5,
      ease: SILKY_EASE,
    },
  },
};

const itemEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: SILKY_EASE },
  },
};

export const SurfacePlaceholderScreen: React.FC<SurfacePlaceholderScreenProps> = ({
  tab,
  onSelectHome,
  onSelectProducts,
  onSelectTab,
}) => {
  const current = TAB_CONFIG[tab];

  return (
    <motion.div
      key={tab}
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col flex-1 min-h-0 bg-gradient-to-b from-[#f2f7fd] via-[#f7fafd] to-[#e4f2fe] relative select-none overflow-hidden"
    >
      {/* Scrollable Surface Body */}
      <div className="flex-1 overflow-y-auto pb-32">
        <TopNavBar
          title={current.title}
          variant="products"
          rightAction="help"
          onBack={onSelectHome}
          variants={itemEntranceVariants}
        />

        <div className="px-5 flex flex-col gap-5 pt-2">
          {/* Main Surface Card */}
          <motion.div
            variants={itemEntranceVariants}
            className="bg-white rounded-[28px] p-6 border border-[#E1EAF2] shadow-sm flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Top Icon + Badge */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F7FF] border border-[#D5E7FA] flex items-center justify-center">
                {current.icon}
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5FF] text-[#0066BE] text-[11px] font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Camada 1 • Surface
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[20px] font-extrabold text-[#142742] tracking-tight leading-snug">
                {current.headline}
              </h2>
              <p className="text-[14px] text-[#556982] leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Features preview */}
            <div className="pt-2 flex flex-col gap-2 border-t border-[#EEF4F9]">
              {current.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 text-[13px] font-medium text-[#2E3C4E]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0078D9]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Surface Bottom Bar */}
      <BottomNavBar
        activeTab={tab}
        onSelectHome={onSelectHome}
        onSelectProducts={onSelectProducts}
        onSelectTab={onSelectTab}
      />
    </motion.div>
  );
};

