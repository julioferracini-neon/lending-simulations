import React, { useState, useMemo, useEffect } from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowLeft, Info, Calendar as CalendarIcon, Edit2 } from 'lucide-react';
import { calculateLoanSimulation, formatCurrency, formatDatePtBR, BASE_MONTHLY_RATE } from '../utils/finance';
import { AnimatedNumber } from './AnimatedNumber';
import { RouletteOdometer } from './RouletteOdometer';
import { InstallmentSlider } from './InstallmentSlider';
import { ChangeDueDateModal } from './ChangeDueDateModal';
import { LoanDetailsModal } from './LoanDetailsModal';
import { EditAmountModal } from './EditAmountModal';
import { EditMonthlyInstallmentModal } from './EditMonthlyInstallmentModal';
import { ProposalSuccessModal } from './ProposalSuccessModal';

interface LoanSimulationScreenProps {
  initialLoanAmount?: number;
  onBack?: () => void;
  onAmountChange?: (amount: number) => void;
}

// Smooth easing curves for UI transitions
const EASE_IN_OUT = [0.4, 0.0, 0.2, 1] as const;
const SILKY_EASE = [0.22, 1, 0.36, 1] as const;

// Fluid and smooth entrance animation variants for initial screen load
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

export const LoanSimulationScreen: React.FC<LoanSimulationScreenProps> = ({
  initialLoanAmount = 2000,
  onBack,
  onAmountChange,
}) => {
  // State variables corresponding to user controls
  const [loanAmount, setLoanAmount] = useState<number>(initialLoanAmount);
  const [installments, setInstallments] = useState<number>(7); // Real-time 0ms
  const [selectedDueDay, setSelectedDueDay] = useState<number>(10);
  const [firstDueDate, setFirstDueDate] = useState<Date>(new Date(2026, 8, 10)); // 10 de setembro de 2026

  // Keep in sync with initialLoanAmount if updated externally
  useEffect(() => {
    if (initialLoanAmount && initialLoanAmount > 0) {
      setLoanAmount(initialLoanAmount);
    }
  }, [initialLoanAmount]);

  // Staggered Micro-Interactions:
  // 1st: User moves slider (0ms) -> slider thumb, badge, and section header update instantly
  // 2nd: Primary installment amount changes 100ms later
  // 3rd: Total estimated cost changes 200ms later
  const [delayedInstallmentsPrimary, setDelayedInstallmentsPrimary] = useState<number>(7);
  const [delayedInstallmentsTotal, setDelayedInstallmentsTotal] = useState<number>(7);

  useEffect(() => {
    // 100ms delay for primary monthly installment
    const primaryTimer = setTimeout(() => {
      setDelayedInstallmentsPrimary(installments);
    }, 100);

    // 200ms delay for total estimated cost
    const totalTimer = setTimeout(() => {
      setDelayedInstallmentsTotal(installments);
    }, 200);

    return () => {
      clearTimeout(primaryTimer);
      clearTimeout(totalTimer);
    };
  }, [installments]);

  // Modals state
  const [isDueDateModalOpen, setIsDueDateModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isAmountModalOpen, setIsAmountModalOpen] = useState<boolean>(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Financial simulation computation for primary installment (100ms delayed)
  const primarySimulation = useMemo(() => {
    return calculateLoanSimulation(loanAmount, delayedInstallmentsPrimary, BASE_MONTHLY_RATE, firstDueDate);
  }, [loanAmount, delayedInstallmentsPrimary, firstDueDate]);

  // Financial simulation computation for total cost (200ms delayed)
  const totalSimulation = useMemo(() => {
    return calculateLoanSimulation(loanAmount, delayedInstallmentsTotal, BASE_MONTHLY_RATE, firstDueDate);
  }, [loanAmount, delayedInstallmentsTotal, firstDueDate]);

  // Full simulation for final contract details modal
  const fullSimulation = useMemo(() => {
    return calculateLoanSimulation(loanAmount, installments, BASE_MONTHLY_RATE, firstDueDate);
  }, [loanAmount, installments, firstDueDate]);

  const resetToDefault = () => {
    setLoanAmount(2000);
    setInstallments(7);
    setSelectedDueDay(10);
    setFirstDueDate(new Date(2026, 8, 10));
  };

  return (
    <motion.div
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col flex-1 bg-white min-h-full relative select-none"
      id="loan-simulation-screen"
    >
      {/* Top App Bar */}
      <motion.header
        variants={itemEntranceVariants}
        className="px-5 pt-3 pb-3 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-20"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack || resetToDefault}
            aria-label="Voltar"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#0066cc] hover:bg-blue-50 active:scale-90 transition-all cursor-pointer -ml-1"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-[17px] sm:text-lg font-bold text-[#142742] tracking-tight">
            Plano de Pagamento
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsDetailsModalOpen(true)}
          aria-label="Informações sobre taxas e CET"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#142742] hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
        >
          <Info className="w-6 h-6 stroke-[2]" />
        </button>
      </motion.header>

      {/* Main Scrollable Content */}
      <main className="flex-1 px-5 pt-2 pb-28 overflow-y-auto space-y-4">
        {/* Subtitle / Metadata Summary Row with Tabular Numbers */}
        <motion.div
          variants={itemEntranceVariants}
          className="flex items-center justify-between text-sm py-1"
        >
          {/* Requested Amount (Interactive Bottom Sheet Trigger) */}
          <button
            type="button"
            onClick={() => setIsAmountModalOpen(true)}
            className="group flex items-center gap-1.5 text-left cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-[#586c82] font-normal">Solicitado:</span>
            <span className="font-semibold text-[#142742] group-hover:text-blue-600 transition-colors tabular-nums">
              {formatCurrency(loanAmount)}
            </span>
            <Edit2 className="w-3.5 h-3.5 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Interest Rate (Interactive Bottom Sheet Trigger) */}
          <button
            type="button"
            onClick={() => setIsDetailsModalOpen(true)}
            className="flex items-center gap-1 text-right cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-[#586c82] font-normal">Taxa:</span>
            <span className="font-semibold text-[#142742] underline decoration-dotted decoration-slate-300 underline-offset-4 tabular-nums">
              3,49% a.m.
            </span>
          </button>
        </motion.div>

        {/* Highlight Card: Valor da Parcela e Custo Total */}
        <motion.div
          variants={itemEntranceVariants}
          className="bg-[#eef7fe] rounded-3xl p-5 sm:p-6 shadow-xs border border-blue-100/60 relative overflow-hidden"
        >
          {/* Top Row: Label + Installments Pill (Fixed width to prevent jumping) */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMonthlyModalOpen(true)}
              className="group flex items-center gap-1 text-sm font-medium text-[#5c7086] hover:text-blue-700 transition-colors cursor-pointer"
            >
              <span>Valor da parcela mensal</span>
              <Edit2 className="w-3 h-3 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Fixed width pill with ease-in-out update at 100ms */}
            <motion.button
              type="button"
              onClick={() => setIsMonthlyModalOpen(true)}
              key={delayedInstallmentsPrimary}
              initial={{ scale: 0.94, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.22,
                ease: EASE_IN_OUT,
              }}
              className="bg-[#00a2ff] hover:bg-[#0092e6] active:scale-95 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-xs w-24 text-center tabular-nums cursor-pointer transition-all"
            >
              {delayedInstallmentsPrimary} parcelas
            </motion.button>
          </div>

          {/* Huge Installment Amount (Clickable to edit via Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsMonthlyModalOpen(true)}
            className="group w-full text-left h-11 sm:h-12 flex items-center my-2.5 cursor-pointer focus:outline-none"
            aria-label="Editar valor da parcela mensal"
          >
            <RouletteOdometer
              value={primarySimulation.monthlyInstallment}
              prefix="R$ "
              motionDuration={400}
              className="text-3xl sm:text-[36px] font-black text-[#142742] group-hover:text-blue-600 transition-colors tracking-tight leading-none"
            />
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-blue-600 bg-white/80 px-2 py-0.5 rounded-md border border-blue-100 shadow-xs">
              Editar
            </span>
          </button>

          {/* Subtle separator inside card */}
          <div className="h-[1px] bg-[#d8ebfa] my-3" />

          {/* Bottom Row: Custo Total Estimado (Changes 200ms after slider move with fixed tabular alignment) */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsDetailsModalOpen(true)}
              className="text-sm font-normal text-[#5c7086] hover:text-slate-800 transition-colors cursor-pointer text-left"
            >
              Custo total estimado
            </button>
            <div className="min-w-[120px] text-right flex justify-end">
              <AnimatedNumber
                value={totalSimulation.totalEstimatedCost}
                prefix="R$ "
                duration={240}
                className="text-base font-bold text-[#142742] tabular-nums"
              />
            </div>
          </div>
        </motion.div>

        {/* Card 2: Due Date with Alterar Action (Triggers Bottom Sheet) */}
        <motion.div
          variants={itemEntranceVariants}
          className="bg-white border border-[#e2e8f0] rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-xs hover:border-blue-200 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0073e6] shrink-0">
              <CalendarIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="text-sm font-medium text-[#334155]">
              Vencimento: {formatDatePtBR(firstDueDate)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDueDateModalOpen(true)}
            className="text-sm font-semibold text-[#0072e6] hover:text-[#005bb5] active:scale-95 transition-all cursor-pointer px-1 py-0.5 rounded-md hover:bg-blue-50/50"
          >
            Alterar
          </button>
        </motion.div>

        {/* Subtle Dotted Separator matching Figma */}
        <div className="border-b border-dotted border-slate-300 my-5" />

        {/* Section: "Ajuste o prazo" with Fixed Right-Aligned Counter */}
        <motion.div variants={itemEntranceVariants} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[#142742] tracking-tight">
              Ajuste o prazo
            </h2>
            {/* Real-time display with interactive click to open the installments bottom sheet, styled like Taxa */}
            <button
              type="button"
              onClick={() => setIsMonthlyModalOpen(true)}
              className="w-32 text-right cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Selecionar prazo de parcelas"
            >
              <span className="text-base font-bold text-[#1e3a5f] hover:text-blue-600 underline decoration-dotted decoration-slate-300 underline-offset-4 tabular-nums inline-block text-right transition-colors">
                {installments} Parcelas
              </span>
            </button>
          </div>

          {/* Interactive Installment Slider with Proportional Dots */}
          <InstallmentSlider
            value={installments}
            onChange={(newVal) => setInstallments(newVal)}
            min={1}
            max={24}
          />
        </motion.div>
      </main>

      {/* Sticky Bottom Action Bar with Smooth Gradient Backdrop */}
      <motion.footer
        variants={itemEntranceVariants}
        className="fixed sm:absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-white via-white/95 to-transparent pt-6 z-20"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.12, ease: EASE_IN_OUT }}
          onClick={() => setIsSuccessModalOpen(true)}
          className="w-full bg-[#0072e6] hover:bg-[#0062c4] active:bg-[#0055aa] text-white font-bold py-4 px-6 rounded-full transition-all flex items-center justify-center text-base shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          Continuar proposta
        </motion.button>
      </motion.footer>

      {/* Bottom Sheet: Editar Valor da Parcela Mensal */}
      <EditMonthlyInstallmentModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
        loanAmount={loanAmount}
        currentInstallments={installments}
        onSelectInstallments={(newInst) => setInstallments(newInst)}
        firstDueDate={firstDueDate}
      />

      {/* Bottom Sheet: Alterar Vencimento com Recálculo em Tempo Real */}
      <ChangeDueDateModal
        isOpen={isDueDateModalOpen}
        onClose={() => setIsDueDateModalOpen(false)}
        currentDay={selectedDueDay}
        currentDate={firstDueDate}
        loanAmount={loanAmount}
        installments={installments}
        onSelectDate={(day, date) => {
          setSelectedDueDay(day);
          setFirstDueDate(date);
        }}
      />

      {/* Bottom Sheet: Composição de Taxas e Amortização */}
      <LoanDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        loanAmount={loanAmount}
        installments={installments}
        rateMonthly={BASE_MONTHLY_RATE}
        result={fullSimulation}
      />

      {/* Bottom Sheet: Alterar Valor do Empréstimo */}
      <EditAmountModal
        isOpen={isAmountModalOpen}
        onClose={() => setIsAmountModalOpen(false)}
        currentAmount={loanAmount}
        onConfirmAmount={(amt) => {
          setLoanAmount(amt);
          onAmountChange?.(amt);
        }}
      />

      {/* Bottom Sheet: Proposta Concluída com Confete */}
      <ProposalSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        loanAmount={loanAmount}
        installments={installments}
        monthlyInstallment={primarySimulation.monthlyInstallment}
        totalCost={totalSimulation.totalEstimatedCost}
        firstDueDate={firstDueDate}
      />
    </motion.div>
  );
};
