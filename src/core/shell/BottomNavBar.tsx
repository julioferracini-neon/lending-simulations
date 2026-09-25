import React from 'react';
import bottomNavSvg from '@/src/assets/BottomNav.svg';
import { hapticLight, hapticMedium } from '@/src/utils/haptics';

export type MainTab = 'home' | 'cartao' | 'pix' | 'investir' | 'produtos';

interface BottomNavBarProps {
  activeTab?: MainTab;
  onSelectHome: () => void;
  onSelectProducts: () => void;
  onSelectTab: (tab: 'cartao' | 'pix' | 'investir') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  onSelectHome,
  onSelectProducts,
  onSelectTab,
}) => {
  return (
    <div className="absolute bottom-6 inset-x-0 flex justify-center z-40 pointer-events-none select-none">
      <div className="w-[336px] relative">
        {/* Fundo de vidro translúcido com blur sutil */}
        <div className="absolute top-[2px] left-[4px] right-[4px] h-[68px] bg-white/40 backdrop-blur-md rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/60 pointer-events-none z-0" />

        <img
          src={bottomNavSvg}
          alt="Menu de Navegação"
          className="w-full pointer-events-auto relative z-10"
        />

        {/* Áreas de toque correspondentes aos 5 ícones: Início, Cartão, Pix, Investir, Produtos */}
        <div className="absolute inset-0 z-20 pointer-events-auto flex items-end">
          <div className="w-full h-[68px] flex">
            {/* 1. Início */}
            <button
              type="button"
              onClick={() => {
                hapticMedium();
                onSelectHome();
              }}
              className="flex-1 h-full cursor-pointer focus:outline-none"
              aria-label="Início"
            />

            {/* 2. Cartão (Surface) */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                onSelectTab('cartao');
              }}
              className="flex-1 h-full cursor-pointer focus:outline-none"
              aria-label="Cartão"
            />

            {/* 3. Pix (Surface) */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                onSelectTab('pix');
              }}
              className="flex-1 h-full cursor-pointer focus:outline-none"
              aria-label="Pix"
            />

            {/* 4. Investir (Surface) */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                onSelectTab('investir');
              }}
              className="flex-1 h-full cursor-pointer focus:outline-none"
              aria-label="Investir"
            />

            {/* 5. Produtos */}
            <button
              type="button"
              onClick={() => {
                hapticMedium();
                onSelectProducts();
              }}
              className="flex-1 h-full cursor-pointer focus:outline-none"
              aria-label="Produtos"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

