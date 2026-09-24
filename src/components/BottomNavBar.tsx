import React from 'react';
import bottomNavSvg from '../assets/BottomNav.svg';
import { hapticLight, hapticMedium } from '../utils/haptics';

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
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none select-none">
      <div className="w-[336px] relative">
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

