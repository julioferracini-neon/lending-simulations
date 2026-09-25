import React from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowLeft, HelpCircle, X } from 'lucide-react';
import { hapticLight } from '../utils/haptics';

interface TopNavBarProps {
  title: string;
  showBack?: boolean;
  leftIcon?: 'back' | 'close';
  onBack?: () => void;
  rightAction?: 'help' | 'info' | 'none';
  onRightAction?: () => void;
  // Variants for initial animation
  variants?: Variants;
  // Different styling variants based on screen needs
  variant?: 'default' | 'products' | 'summary';
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  title,
  showBack = false,
  leftIcon = 'back',
  onBack,
  rightAction = 'none',
  onRightAction,
  variants,
  variant = 'default',
}) => {
  // Products variant uses pt-[72px] pb-4 and larger title (originally pt-8 which is 32px + 40px = 72px)
  const isProducts = variant === 'products';
  // Summary variant uses smaller gap and tighter button styling
  const isSummary = variant === 'summary';

  const LeftIconComponent = leftIcon === 'close' ? X : ArrowLeft;

  return (
    <motion.header
      variants={variants}
      style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
      className={`w-full px-5 ${isProducts ? 'pt-[72px] pb-4' : 'pt-[52px] pb-3'} flex items-center justify-between shrink-0 sticky top-0 bg-transparent backdrop-blur-md z-30`}
    >
      <div className={`flex items-center ${isSummary ? 'gap-3.5' : 'gap-2'}`}>
        {showBack && (
          <button
            type="button"
            onClick={() => {
              hapticLight();
              onBack?.();
            }}
            aria-label={leftIcon === 'close' ? "Fechar" : "Voltar"}
            className={
              isSummary
                ? 'text-[#0073ea] active:opacity-70 transition-opacity flex items-center justify-center cursor-pointer'
                : 'w-10 h-10 rounded-full flex items-center justify-center text-[#0072e6] hover:bg-blue-50 active:scale-90 transition-all cursor-pointer -ml-1'
            }
          >
            <LeftIconComponent className="w-6 h-6" strokeWidth={isSummary ? 2.5 : 2} />
          </button>
        )}
        <h1
          className={`${
            isProducts ? 'text-[22px]' : 'text-[17px] sm:text-lg'
          } font-bold text-[#142742] tracking-tight`}
        >
          {title}
        </h1>
      </div>

      {rightAction !== 'none' && (
        <button
          type="button"
          onClick={() => {
            hapticLight();
            onRightAction?.();
          }}
          aria-label={rightAction === 'help' ? 'Ajuda' : 'Informações'}
          className={
            isProducts
              ? 'w-[34px] h-[34px] rounded-full border-[1.5px] border-white/60 bg-white/40 text-[#0073ea] flex items-center justify-center hover:bg-white/60 active:scale-95 transition-all shadow-sm'
              : isSummary
              ? 'text-[#0073ea] active:opacity-70 transition-opacity flex items-center justify-center cursor-pointer'
              : 'w-10 h-10 rounded-full flex items-center justify-center text-[#0073e6] hover:bg-blue-50 active:scale-90 transition-all cursor-pointer -mr-1'
          }
        >
          {rightAction === 'help' && (
            <HelpCircle
              className={isProducts ? 'w-[18px] h-[18px]' : isSummary ? 'w-[22px] h-[22px]' : 'w-6 h-6'}
              strokeWidth={isProducts || isSummary ? 2.5 : 2}
            />
          )}
          {rightAction === 'info' && (
            <div className="w-[22px] h-[22px] rounded-full border-[2px] border-[#0073ea] flex items-center justify-center">
              <span className="font-bold text-[13px] leading-none mb-[1px] text-[#0073ea]">i</span>
            </div>
          )}
        </button>
      )}
    </motion.header>
  );
};

