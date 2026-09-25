import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, type Variants } from 'motion/react';
import { ArrowLeft, X, Square, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { BottomSheet } from '@/src/components/BottomSheet';
import { formatCurrency } from '../utils/finance';
import { Button } from '@/src/design-system';
import { hapticLight, hapticMedium, hapticWarning } from '@/src/utils/haptics';
import type { LoanSimulationData } from './BaselineLoanSimulationScreen';

interface BaselineInputValueScreenProps {
  initialAmount?: number | null;
  availableLimit?: number;
  onContinue: (data: LoanSimulationData) => void;
  onBack: () => void;
}

const SILKY_EASE = [0.16, 1, 0.3, 1] as const;

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

const defaultInterestRate = 0.0529; // 5,29% a.m.

export const BaselineInputValueScreen: React.FC<BaselineInputValueScreenProps> = ({
  initialAmount = null,
  availableLimit = 10000,
  onContinue,
  onBack,
}) => {

  const [isDataprevChecked, setIsDataprevChecked] = useState(true);
  
  const [installments, setInstallments] = useState(12);
  const [isSimulating, setIsSimulating] = useState(false);

  const controls = useAnimation();
  
  const [cents, setCents] = useState<number>(() => {
    if (initialAmount && initialAmount > 0) {
      return Math.round(initialAmount * 100);
    }
    return 0;
  });
  
  const [debouncedCents, setDebouncedCents] = useState<number>(cents);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync initial
  useEffect(() => {
    if (initialAmount !== undefined && initialAmount !== null && initialAmount > 0) {
      const amt = Math.round(initialAmount * 100);
      setCents(amt);
      setDebouncedCents(amt);
    } else if (initialAmount === null) {
      setCents(0);
      setDebouncedCents(0);
    }
  }, [initialAmount]);

  // Auto-focus
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Debounce logic for fake API request
  useEffect(() => {
    if (cents === debouncedCents) return;
    
    setIsSimulating(true);
    const timer = setTimeout(() => {
      setDebouncedCents(cents);
      setIsSimulating(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [cents, debouncedCents]);

  const currentAmount = cents / 100;
  const simulatedAmount = debouncedCents / 100;
  const isOverLimit = currentAmount > availableLimit;
  const isBelowMin = currentAmount > 0 && currentAmount < 50; 
  
  const hasValidAmount = currentAmount >= 50 && currentAmount <= availableLimit;
  const isValidToProceed = hasValidAmount && isDataprevChecked && !isSimulating;

  const getMonthlyInstallment = () => {
    const monthlyRate = defaultInterestRate;
    return (simulatedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -installments));
  };
  
  const monthlyValue = getMonthlyInstallment();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const newCents = parseInt(rawValue || '0', 10);
    setCents(newCents);
  };

  const handleClear = () => {
    hapticLight();
    setCents(0);
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const cycleInstallments = (direction: 'next' | 'prev') => {
    hapticLight();
    setInstallments((prev) => {
      if (direction === 'next') return Math.min(prev + 1, 24);
      return Math.max(prev - 1, 1);
    });
  };

  const handleContinue = () => {
    if (isValidToProceed) {
      hapticMedium();
      
      const firstDueDate = new Date();
      firstDueDate.setDate(22);
      if (firstDueDate <= new Date()) {
        firstDueDate.setMonth(firstDueDate.getMonth() + 1);
      }

      onContinue({
        loanAmount: simulatedAmount,
        installments: installments,
        firstDueDate: firstDueDate,
        monthlyInstallment: monthlyValue,
        totalCost: monthlyValue * installments,
      });
    } else {
      hapticWarning();
    }
  };

  return (
    <>
      <motion.div
        variants={screenEntranceVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-full flex flex-col flex-1 min-h-0 bg-white relative select-none overflow-hidden"
        id="baseline-input-value-screen"
      >
        <header className="w-full px-5 pt-[52px] pb-4 flex items-center gap-3 border-b border-slate-200 bg-white z-30 shrink-0">
          <button
            type="button"
            onClick={() => {
              hapticLight();
              onBack();
            }}
            className="text-[#3d70e0] p-1 -ml-1 rounded-full transition-colors active:opacity-70"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[19px] font-bold text-[#142742] tracking-tight">
            Simular empréstimo
          </h1>
        </header>

        <div className={`flex-1 min-h-0 overflow-y-auto overscroll-contain transition-colors duration-500 ${hasValidAmount ? 'bg-[#f4f7fb]' : 'bg-white'}`}>
          <main className="pb-40">
            <div className="bg-white px-5 pt-8 pb-6">
              <motion.div variants={itemEntranceVariants} className="space-y-1 mb-6">
                <h2 className="text-[19px] font-bold text-[#142742] tracking-tight">
                  Quanto você quer receber?
                </h2>
                <p className="text-[15px] text-[#475569]">
                  Escolha um valor entre R$ 50,00 e {formatCurrency(availableLimit)}
                </p>
              </motion.div>

              <motion.div variants={itemEntranceVariants} className="space-y-2">
                <motion.div
                  onClick={handleContainerClick}
                  className={`w-full rounded-[24px] border-[1.5px] transition-colors bg-white px-4 py-3.5 flex items-center justify-between cursor-text ${
                    isOverLimit || isBelowMin
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-[#5c6b8f] focus-within:border-[#3d70e0]'
                  }`}
                >
                  <div className="flex-1 relative h-[26px] overflow-hidden flex items-center">
                    <motion.input
                      animate={controls}
                      ref={inputRef}
                      id="loan-amount-input"
                      type="text"
                      inputMode="numeric"
                      value={cents > 0 ? formatCurrency(currentAmount) : ''}
                      onChange={handleInputChange}
                      placeholder="R$ 0,00"
                      className="absolute inset-0 w-full h-full bg-transparent outline-hidden text-[#142742] text-[18px] font-bold placeholder:text-[#94a3b8] placeholder:font-normal leading-[26px]"
                    />
                  </div>

                  {cents > 0 && (
                    <button
                      type="button"
                      onClick={handleClear}
                      aria-label="Limpar valor"
                      className="text-[#5c6b8f] p-1 -mr-1 cursor-pointer shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {hasValidAmount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4, ease: SILKY_EASE }}
                className="px-5 pt-8 overflow-hidden"
              >
                {isSimulating ? (
                  <div className="space-y-4">
                    <h3 className="text-[17px] font-bold text-[#142742] tracking-tight">
                      Em quantas parcelas gostaria de pagar?
                    </h3>
                    <div className="flex items-center justify-between px-1">
                      <div className="w-11 h-11 rounded-2xl bg-slate-200/60 animate-pulse" />
                      <div className="w-32 h-8 rounded-lg bg-slate-200/60 animate-pulse" />
                      <div className="w-11 h-11 rounded-2xl bg-slate-200/60 animate-pulse" />
                    </div>
                    <div className="h-[130px] w-full bg-slate-200/60 animate-pulse rounded-[24px] mt-6" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-[17px] font-bold text-[#142742] tracking-tight">
                      Em quantas parcelas gostaria de pagar?
                    </h3>
                    
                    <div className="flex items-center justify-between px-1">
                      <button
                        onClick={() => cycleInstallments('prev')}
                        disabled={installments <= 1}
                        className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm disabled:opacity-50 active:scale-95 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-[#3d70e0]" />
                      </button>
                      
                      <span className="text-[22px] font-bold text-[#3d70e0]">
                        {installments} parcelas
                      </span>
                      
                      <button
                        onClick={() => cycleInstallments('next')}
                        disabled={installments >= 24}
                        className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm disabled:opacity-50 active:scale-95 transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-[#3d70e0]" />
                      </button>
                    </div>

                    <div className="bg-white rounded-[24px] p-5 mt-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
                      <h4 className="text-[24px] font-bold text-[#142742]">
                        {installments}x de <span className="text-[#3d70e0]">{formatCurrency(monthlyValue)}</span>
                      </h4>
                      <div className="h-[1px] w-full bg-slate-100 my-4" />
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-[#5c6b8f]">Juros de 5,29% a.m</span>
                        <span className="font-bold text-[#142742]">Vence todo dia 22</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </main>
        </div>

        <motion.footer
          variants={itemEntranceVariants}
          className={`absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col gap-5 transition-colors duration-500 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] ${hasValidAmount ? 'bg-[#f4f7fb]' : 'bg-white border-t border-slate-100'}`}
        >
          <div className="flex items-start gap-3 px-1">
            <button
              type="button"
              onClick={() => {
                hapticLight();
                setIsDataprevChecked(!isDataprevChecked);
              }}
              className="mt-[3px] text-[#3d70e0] shrink-0 hover:opacity-80 transition-opacity focus:outline-hidden"
              aria-label="Aceitar termos Dataprev"
            >
              {isDataprevChecked ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <p className="text-[14px] leading-[20px] text-[#475569]">
              NEW LOAN Eu autorizo a Neon a consultar meus dados na Dataprev, saiba sobre os{' '}
              <a href="#" className="text-[#3d70e0] underline decoration-1 underline-offset-2">
                Termos do Crédito do Trabalhador
              </a>
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={handleContinue}
            disabled={!isValidToProceed}
          >
            {isSimulating ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : hasValidAmount ? (
              'Revisar detalhes'
            ) : (
              'Continuar'
            )}
          </Button>
        </motion.footer>
      </motion.div>

    </>
  );
};
