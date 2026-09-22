import React from 'react';
import { motion, type Variants } from 'motion/react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import bottomNavSvg from '../assets/BottomNav.svg';
import { hapticLight, hapticMedium } from '../utils/haptics';

// Top Cards SVGs
import consignadoSvg from '../assets/menu/Consignado.svg';
import orientacaoSvg from '../assets/menu/Orientacao-Financeira.svg';

// List Items SVGs
import meiSvg from '../assets/menu/Mei.svg';
import extratoSvg from '../assets/menu/Extrato.svg';
import segurosSvg from '../assets/menu/Seguros.svg';
import emprestimosSvg from '../assets/menu/Emprestimos.svg';
import trazerDinheiroSvg from '../assets/menu/Trazer-dinheiro.svg';
import recargaSvg from '../assets/menu/Recarga.svg';
import transferenciaSvg from '../assets/menu/Transferencia.svg';
import pagamentosSvg from '../assets/menu/Pagamentos.svg';
import fgtsSvg from '../assets/menu/Antecipação-FGTS.svg';
import convidarSvg from '../assets/menu/Convidar-pessoas.svg';
import openFinanceSvg from '../assets/menu/Open-finance.svg';

import { TopNavBar } from './TopNavBar';

interface ProductsScreenProps {
  onSelectLoans: () => void;
  onSelectHome: () => void;
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
}) => {
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
            onClick={() => hapticLight()}
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
            onClick={() => hapticLight()}
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
          
          <ListItem iconSrc={meiSvg} title="Área MEI" hasNovo />
          <ListItem iconSrc={extratoSvg} title="Extrato" />
          <ListItem iconSrc={segurosSvg} title="Seguros" />
          <ListItem 
            iconSrc={emprestimosSvg} 
            title="Empréstimos" 
            onClick={onSelectLoans} 
          />
          <ListItem iconSrc={trazerDinheiroSvg} title="Trazer dinheiro" />
          <ListItem iconSrc={recargaSvg} title="Recarga" />
          <ListItem iconSrc={transferenciaSvg} title="Transferências" />
          <ListItem iconSrc={pagamentosSvg} title="Pagamentos" />
          <ListItem iconSrc={fgtsSvg} title="Antecipação FGTS" />
          <ListItem iconSrc={convidarSvg} title="Convidar pessoas" />
          <ListItem iconSrc={openFinanceSvg} title="Open Finance" />

        </motion.div>
      </div>

      {/* Floating Bottom Nav */}
      <div className="absolute bottom-6 left-5 right-5 pointer-events-none flex justify-center z-30">
        <div className="relative w-full max-w-[360px] flex justify-center">
          {/* We place a blurry pill exactly where the nav bar sits within the SVG to create the glass effect */}
          <div className="absolute top-[38px] left-[43px] right-[43px] h-[68px] bg-white/50 backdrop-blur-md rounded-[16px] pointer-events-none"></div>
          <img src={bottomNavSvg} alt="Bottom Navigation" className="w-full pointer-events-auto relative z-10" />

          {/* Clickable Overlay Hotspots */}
          {/* Menu layout: Início, Cartão, Pix, Investir, Produtos */}
          <div className="absolute inset-0 z-20 pointer-events-auto flex items-end">
            <div className="w-full h-[68px] flex">
              <button 
                onClick={() => {
                  hapticMedium();
                  onSelectHome();
                }} 
                className="flex-1 h-full cursor-pointer focus:outline-none" 
                aria-label="Início" 
              />
              <button className="flex-1 h-full cursor-default focus:outline-none" />
              <button className="flex-1 h-full cursor-default focus:outline-none" />
              <button className="flex-1 h-full cursor-default focus:outline-none" />
              <button 
                onClick={() => hapticLight()} 
                className="flex-1 h-full cursor-pointer focus:outline-none" 
                aria-label="Produtos" 
              />
            </div>
          </div>
        </div>
      </div>
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

