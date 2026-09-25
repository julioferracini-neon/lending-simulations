import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { hapticLight, hapticMedium } from '@/src/utils/haptics';
import { BottomNavBar } from '../components/BottomNavBar';
import { PlaceholderBottomSheet, type PlaceholderContextData } from '../components/PlaceholderBottomSheet';

// Top Cards SVGs
import consignadoSvg from '@/src/assets/menu/Consignado.svg';
import orientacaoSvg from '@/src/assets/menu/Orientacao-Financeira.svg';

// List Items SVGs
import meiSvg from '@/src/assets/menu/Mei.svg';
import extratoSvg from '@/src/assets/menu/Extrato.svg';
import segurosSvg from '@/src/assets/menu/Seguros.svg';
import emprestimosSvg from '@/src/assets/menu/Emprestimos.svg';
import trazerDinheiroSvg from '@/src/assets/menu/Trazer-dinheiro.svg';
import recargaSvg from '@/src/assets/menu/Recarga.svg';
import transferenciaSvg from '@/src/assets/menu/Transferencia.svg';
import pagamentosSvg from '@/src/assets/menu/Pagamentos.svg';
import fgtsSvg from '@/src/assets/menu/Antecipação-FGTS.svg';
import convidarSvg from '@/src/assets/menu/Convidar-pessoas.svg';
import openFinanceSvg from '@/src/assets/menu/Open-finance.svg';

import { TopNavBar } from '@/src/components/TopNavBar';

interface ProductsScreenProps {
  onSelectLoans: () => void;
  onSelectHome: () => void;
  onSelectTab?: (tab: 'cartao' | 'pix' | 'investir') => void;
}

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

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  onSelectLoans,
  onSelectHome,
  onSelectTab,
}) => {
  const [placeholderData, setPlaceholderData] = useState<PlaceholderContextData | null>(null);

  return (
    <motion.div
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col flex-1 min-h-0 bg-gradient-to-b from-[#f2f7fd] to-[#d6efff] relative select-none overflow-hidden"
      id="products-screen"
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <TopNavBar 
          title="Produtos" 
          variant="products" 
          rightAction="help" 
          variants={itemEntranceVariants} 
        />

        {/* Top Cards */}
        <div className="px-5 grid grid-cols-2 gap-3 mb-6">
          <motion.div
            variants={itemEntranceVariants}
            onClick={() => {
              hapticLight();
              setPlaceholderData({
                title: 'Consignado',
                description: 'Empréstimo consignado com parcelas descontadas direto da folha de pagamento e taxas diferenciadas.',
                category: 'Empréstimos',
              });
            }}
            className="bg-gradient-to-br from-white to-[#f0f8ff] rounded-[24px] p-4 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white/60 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="flex justify-between items-start mb-4">
              <img src={consignadoSvg} alt="Consignado" className="w-[56px] h-[56px] -ml-1 -mt-1" />
              <ChevronRight className="w-5 h-5 text-[#0073ea] mt-1" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#142742] mb-1">Consignado</h3>
              <p className="text-[12px] text-[#5a738e] leading-tight">Empréstimo consignado com as melhores taxas</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemEntranceVariants}
            onClick={() => {
              hapticLight();
              setPlaceholderData({
                title: 'Orientação Financeira',
                description: 'Conteúdos, ferramentas e diagnósticos para ajudar a organizar suas contas e planejar o futuro.',
                category: 'Serviços',
              });
            }}
            className="bg-gradient-to-br from-white to-[#f0f8ff] rounded-[24px] p-4 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-white/60 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="flex justify-between items-start mb-4">
              <img src={orientacaoSvg} alt="Orientação financeira" className="w-[56px] h-[56px] -ml-1 -mt-1" />
              <ChevronRight className="w-5 h-5 text-[#0073ea] mt-1" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#142742] mb-1">Orientação financeira</h3>
              <p className="text-[12px] text-[#5a738e] leading-tight">Te ajudamos a ter um futuro brilhante</p>
            </div>
          </motion.div>
        </div>

        {/* List Block */}
        <motion.div variants={itemEntranceVariants} className="bg-white rounded-[32px] mx-5 mb-5 px-1 py-2 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <ListItem 
            iconSrc={meiSvg} 
            title="Área MEI" 
            hasNovo 
            onClick={() => {
              setPlaceholderData({
                title: 'Área MEI',
                description: 'Conta PJ, emissão de nota fiscal, pagamento de DAS e suporte especializado para sua empresa.',
                category: 'Empresas',
              });
            }}
          />
          <ListItem 
            iconSrc={extratoSvg} 
            title="Extrato" 
            onClick={() => {
              setPlaceholderData({
                title: 'Extrato Consolidado',
                description: 'Consulte o histórico mensal de entradas, saídas, rendimentos e comprovantes.',
                category: 'Conta Digital',
              });
            }}
          />
          <ListItem 
            iconSrc={segurosSvg} 
            title="Seguros" 
            onClick={() => {
              setPlaceholderData({
                title: 'Seguros Neon',
                description: 'Proteja seu dinheiro, seus cartões e quem você ama com planos que cabem no seu bolso.',
                category: 'Seguros',
              });
            }}
          />
          <ListItem 
            iconSrc={emprestimosSvg} 
            title="Empréstimos" 
            onClick={onSelectLoans} 
          />
          <ListItem 
            iconSrc={trazerDinheiroSvg} 
            title="Trazer dinheiro" 
            onClick={() => {
              setPlaceholderData({
                title: 'Trazer Dinheiro',
                description: 'Traga seu salário para a Neon e tenha benefícios exclusivos de taxa e limite.',
                category: 'Conta Digital',
              });
            }}
          />
          <ListItem 
            iconSrc={recargaSvg} 
            title="Recarga" 
            onClick={() => {
              setPlaceholderData({
                title: 'Recarga de Celular',
                description: 'Recarregue celulares de todas as operadoras de forma simples e rápida.',
                category: 'Serviços',
              });
            }}
          />
          <ListItem 
            iconSrc={transferenciaSvg} 
            title="Transferências" 
            onClick={() => {
              setPlaceholderData({
                title: 'Transferências',
                description: 'Envie dinheiro via Pix ou TED para qualquer instituição bancária sem pagar tarifas.',
                category: 'Transferências',
              });
            }}
          />
          <ListItem 
            iconSrc={pagamentosSvg} 
            title="Pagamentos" 
            onClick={() => {
              setPlaceholderData({
                title: 'Pagamentos',
                description: 'Pague boletos bancários, faturas e contas de consumo com débito direto em conta.',
                category: 'Pagamentos',
              });
            }}
          />
          <ListItem 
            iconSrc={fgtsSvg} 
            title="Antecipação FGTS" 
            onClick={() => {
              setPlaceholderData({
                title: 'Antecipação do Saque-Aniversário FGTS',
                description: 'Antecipe parcelas do seu saldo do FGTS com taxa reduzida e dinheiro na conta em minutos.',
                category: 'Empréstimos',
              });
            }}
          />
          <ListItem 
            iconSrc={convidarSvg} 
            title="Convidar pessoas" 
            onClick={() => {
              setPlaceholderData({
                title: 'Convidar Amigos',
                description: 'Indique a conta Neon para familiares e amigos e compartilhe as vantagens de ser cliente.',
                category: 'Indicação',
              });
            }}
          />
          <ListItem 
            iconSrc={openFinanceSvg} 
            title="Open Finance" 
            onClick={() => {
              setPlaceholderData({
                title: 'Open Finance',
                description: 'Conecte seus bancos para conseguir ofertas personalizadas e limites melhores na Neon.',
                category: 'Open Finance',
              });
            }}
          />
        </motion.div>
      </div>

      {/* Surface Bottom Bar */}
      <BottomNavBar
        activeTab="produtos"
        onSelectHome={onSelectHome}
        onSelectProducts={() => {}}
        onSelectTab={(tab) => onSelectTab?.(tab)}
      />

      {/* Second Layer: Placeholder Bottom Sheet */}
      <PlaceholderBottomSheet
        isOpen={!!placeholderData}
        onClose={() => setPlaceholderData(null)}
        data={placeholderData}
      />
    </motion.div>
  );
};

// Helper component for list items
const ListItem = ({ iconSrc, title, onClick, hasNovo }: { iconSrc: string, title: string, onClick?: () => void, hasNovo?: boolean }) => {
  return (
    <div 
      onClick={() => {
        if (onClick) {
          hapticMedium();
          onClick();
        } else {
          hapticLight();
        }
      }}
      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 rounded-2xl transition-colors"
    >
      <div className="flex items-center gap-4">
        <img src={iconSrc} alt={title} className="w-[48px] h-[48px] -ml-1" />
        <span className="text-[15px] font-bold text-[#142742]">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        {hasNovo && (
          <div className="bg-[#c2f1f5] text-[#005c99] px-2 py-0.5 rounded-full text-[11px] font-bold">
            Novo
          </div>
        )}
        <ChevronRight className="w-5 h-5 text-[#0073ea]" strokeWidth={2.5} />
      </div>
    </div>
  );
};

