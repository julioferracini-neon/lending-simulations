import React, { useState, useEffect, useRef } from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowLeft, AlertCircle, X } from 'lucide-react';
import { formatCurrency } from '../utils/finance';
import { hapticLight, hapticMedium, hapticSelection, hapticWarning } from '../utils/haptics';

interface InputValueScreenProps {
  initialAmount?: number | null;
  availableLimit?: number;
  onContinue: (amount: number) => void;
  onBack?: () => void;
}

// Smooth easing curves matching the simulation screen
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
      duration: 0.65,
      ease: SILKY_EASE,
    },
  },
};

export const InputValueScreen: React.FC<InputValueScreenProps> = ({
  initialAmount = null,
  availableLimit = 10000,
  onContinue,
  onBack,
}) => {
  // Amount represented in cents for precision currency input (starts empty at 0 if no initial amount)
  const [cents, setCents] = useState<number>(() => {
    if (initialAmount && initialAmount > 0) {
      return Math.round(initialAmount * 100);
    }
    return 0;
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync if initialAmount is updated externally
  useEffect(() => {
    if (initialAmount !== undefined && initialAmount !== null && initialAmount > 0) {
      setCents(Math.round(initialAmount * 100));
    } else if (initialAmount === null) {
      setCents(0);
    }
  }, [initialAmount]);

  // Auto-focus input on mount for seamless user input
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const currentAmount = cents / 100;
  const isOverLimit = currentAmount > availableLimit;
  const isBelowMin = currentAmount > 0 && currentAmount < 100;
  const isValid = currentAmount >= 100 && currentAmount <= availableLimit;

  // Handle typing numbers (Brazilian currency mask)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    if (!rawDigits) {
      setCents(0);
      return;
    }
    const parsed = parseInt(rawDigits, 10);
    // Cap at reasonable maximum to prevent integer overflow
    if (parsed <= 99999999) {
      setCents(parsed);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticLight();
    setCents(0);
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onContinue(currentAmount);
    }
  };

  return (
    <motion.div
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col flex-1 min-h-0 bg-white relative select-none overflow-hidden"
      id="input-value-screen"
    >
      {/* Top Navigation Bar */}
      <motion.header
        variants={itemEntranceVariants}
        className="px-5 pt-3 pb-3 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-md z-20 shrink-0"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              hapticLight();
              onBack?.();
            }}
            aria-label="Voltar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#0073e6] hover:bg-blue-50 active:scale-90 transition-all cursor-pointer -ml-1"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-[17px] sm:text-lg font-bold text-[#142742] tracking-tight">
            Empréstimos
          </h1>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 px-5 pt-4 pb-28 overflow-y-auto overscroll-contain">
        {/* Screen Headline */}
        <motion.h2
          variants={itemEntranceVariants}
          className="text-2xl sm:text-[27px] font-bold text-[#142742] tracking-tight leading-snug mb-8"
        >
          Quanto você precisa?
        </motion.h2>

        {/* Input Section */}
        <motion.div variants={itemEntranceVariants} className="space-y-2">
          <label
            htmlFor="loan-amount-input"
            className="block text-[15px] font-bold text-[#142742]"
          >
            Valor do empréstimo
          </label>

          {/* Pill Input Container matching Figma */}
          <div
            onClick={handleContainerClick}
            className={`w-full rounded-full border transition-all bg-white px-5 py-3.5 flex items-center justify-between cursor-text ${
              isOverLimit || isBelowMin
                ? 'border-red-400 ring-2 ring-red-100'
                : 'border-[#c5d5e8] hover:border-blue-400 focus-within:border-[#0073e6] focus-within:ring-2 focus-within:ring-blue-100'
            }`}
          >
            <div className="flex-1 flex items-center">
              {/* Hidden native input maintaining focus and accessibility */}
              <input
                ref={inputRef}
                id="loan-amount-input"
                type="text"
                inputMode="numeric"
                value={cents > 0 ? formatCurrency(currentAmount) : ''}
                onChange={handleInputChange}
                placeholder="Ex.: R$ 3.000,00"
                className="w-full bg-transparent outline-hidden text-[#142742] text-[17px] sm:text-lg font-semibold placeholder:text-[#94a3b8] placeholder:font-normal"
              />
            </div>

            {/* Clear Button when user has entered content */}
            {cents > 0 && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Limpar valor"
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Helper / Limit info row directly below input */}
          <div className="flex items-center gap-1.5 pt-1 px-1">
            {isOverLimit ? (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Valor máximo disponível é {formatCurrency(availableLimit)}
              </p>
            ) : isBelowMin ? (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Valor mínimo para simulação é R$ 100,00
              </p>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#334e68] font-medium">
                {/* Circle badge with exclamation mark matching Figma */}
                <div className="w-4 h-4 rounded-full bg-[#334e68] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  !
                </div>
                <span>Total disponível {formatCurrency(availableLimit)}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Informational Card matching Figma */}
        <motion.div
          variants={itemEntranceVariants}
          className="bg-[#f3f6fa] rounded-2xl p-5 mt-7 border border-slate-100/90 space-y-1.5"
        >
          <h3 className="text-[14px] font-bold text-[#142742] tracking-tight">
            Importante lembrar
          </h3>
          <p className="text-[13px] text-[#475569] leading-relaxed">
            A liberação de crédito depende de de análise que realizamos todos os meses
          </p>
        </motion.div>
      </main>

      {/* Sticky Bottom Action Bar with Smooth Gradient Backdrop */}
      <motion.footer
        variants={itemEntranceVariants}
        className="fixed sm:absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-white via-white/95 to-transparent pt-6 z-20"
      >
        <motion.button
          type="button"
          onClick={() => {
            if (isValid) {
              hapticMedium();
              onContinue(currentAmount);
            } else {
              hapticWarning();
            }
          }}
          disabled={!isValid}
          whileTap={{ scale: isValid ? 0.98 : 1 }}
          className="w-full bg-[#0073e6] hover:bg-[#0062c4] active:bg-[#0055aa] text-white font-semibold py-4 rounded-full shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed text-base"
        >
          Continuar
        </motion.button>
      </motion.footer>
    </motion.div>
  );
};
