import React, { useState, useMemo, useEffect } from 'react';
import { motion, type Variants } from 'motion/react';
import { ArrowLeft, Info, Calendar as CalendarIcon, Edit2 } from 'lucide-react';
import { calculateLoanSimulation, formatCurrency, formatDatePtBR, BASE_MONTHLY_RATE, getDefaultFirstDueDate } from '../utils/finance';
import { hapticLight, hapticMedium, hapticSelection } from '../utils/haptics';
import { AnimatedNumber } from './AnimatedNumber';
import { RouletteOdometer } from './RouletteOdometer';
import { InstallmentSlider } from './InstallmentSlider';
import { ChangeDueDateModal } from './ChangeDueDateModal';
import { LoanDetailsModal } from './LoanDetailsModal';
import { EditAmountModal } from './EditAmountModal';
import { EditMonthlyInstallmentModal } from './EditMonthlyInstallmentModal';
import { ProposalSuccessModal } from './ProposalSuccessModal';
import { TopNavBar } from './TopNavBar';

export interface LoanSimulationData {
  loanAmount: number;
  installments: number;
  firstDueDate: Date;
  monthlyInstallment: number;
  totalCost: number;
}

interface LoanSimulationScreenProps {
  initialLoanAmount?: number;
  initialInstallments?: number;
  initialFirstDueDate?: Date;
  onBack?: () => void;
  onAmountChange?: (amount: number) => void;
  onContinueProposal?: (data: LoanSimulationData) => void;
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
  initialInstallments = 7,
  initialFirstDueDate,
  onBack,
  onAmountChange,
  onContinueProposal,
}) => {
  // State variables corresponding to user controls
  const [loanAmount, setLoanAmount] = useState<number>(initialLoanAmount);
  const [installments, setInstallments] = useState<number>(initialInstallments); // Real-time 0ms
  const [selectedDueDay, setSelectedDueDay] = useState<number>(initialFirstDueDate ? initialFirstDueDate.getDate() : 10);
  const [firstDueDate, setFirstDueDate] = useState<Date>(initialFirstDueDate || getDefaultFirstDueDate());

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
  const [delayedInstallmentsPrimary, setDelayedInstallmentsPrimary] = useState<number>(initialInstallments);
  const [delayedInstallmentsTotal, setDelayedInstallmentsTotal] = useState<number>(initialInstallments);

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
    setFirstDueDate(getDefaultFirstDueDate());
  };

  return (
    <motion.div
      variants={screenEntranceVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col flex-1 min-h-0 bg-white relative select-none overflow-hidden"
      id="loan-simulation-screen"
    >
      {/* Scrollable Container with sticky TopNavBar */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <TopNavBar 
          title="Plano de Pagamento" 
          showBack={true} 
          onBack={() => {
            hapticLight();
            if (onBack) onBack();
            else resetToDefault();
          }} 
          rightAction="info"
          onRightAction={() => {
            hapticLight();
            setIsDetailsModalOpen(true);
          }}
          variants={itemEntranceVariants} 
        />

        {/* Main Scrollable Content */}
        <main className="px-5 pt-2 pb-28 space-y-4">
        {/* Subtitle / Metadata Summary Row with Tabular Numbers */}
        <motion.div
          variants={itemEntranceVariants}
          className="flex items-center justify-between text-[15px] py-1"
        >
          {/* Requested Amount (Interactive Bottom Sheet Trigger) */}
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setIsAmountModalOpen(true);
            }}
            className="group flex items-center gap-1.5 text-left cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-[#4b6076] font-normal">Solicitado:</span>
            <span className="font-semibold text-[#1b3248] transition-colors tabular-nums">
              {formatCurrency(loanAmount)}
            </span>
          </button>

          {/* Interest Rate (Interactive Bottom Sheet Trigger) */}
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setIsDetailsModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-right cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-[#4b6076] font-normal">Taxa:</span>
            <span className="font-semibold text-[#1b3248] tabular-nums">
              3,49% a.m.
            </span>
          </button>
        </motion.div>

        {/* Highlight Card: Valor da Parcela e Custo Total */}
        <motion.div
          variants={itemEntranceVariants}
          className="bg-[#f8fafd] rounded-[24px] p-5 sm:p-6 border border-[#e2edf7] relative overflow-hidden"
        >
          {/* Top Row: Label + Installments Pill */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMonthlyModalOpen(true)}
              className="group flex items-center gap-1 text-[15px] font-normal text-[#4b6076] hover:text-[#1b3248] transition-colors cursor-pointer"
            >
              <span>Valor da parcela mensal</span>
            </button>

            {/* Pill matching prototype: vibrant cyan-blue background with dark navy text */}
            <motion.button
              type="button"
              onClick={() => setIsMonthlyModalOpen(true)}
              key={delayedInstallmentsPrimary}
              initial={{ scale: 1 }}
              animate={{
                scale: [1, 1.05, 0.99, 1],
              }}
              transition={{
                duration: 0.46,
                delay: 0.12, // 120ms de delay no pulse
                ease: [0.25, 1, 0.5, 1], // curva de aceleração e desaceleração suave
              }}
              className="hidden bg-[#00b2fe] hover:bg-[#00a2ea] active:scale-95 text-[#083863] text-[13px] font-semibold px-3.5 py-1 rounded-full shadow-xs text-center tabular-nums cursor-pointer transition-colors select-none"
            >
              {delayedInstallmentsPrimary} parcelas
            </motion.button>
          </div>

          {/* Huge Installment Amount */}
          <button
            type="button"
            onClick={() => setIsMonthlyModalOpen(true)}
            className="group w-full text-left h-12 flex items-center my-3 cursor-pointer focus:outline-none"
            aria-label="Editar valor da parcela mensal"
          >
            <RouletteOdometer
              value={primarySimulation.monthlyInstallment}
              prefix="R$ "
              motionDuration={400}
              className="text-[38px] sm:text-[42px] font-black text-[#173049] group-hover:text-[#007fe8] transition-colors tracking-tight leading-none"
            />
            {/* HIDDEN: Tag 'Editar' escondida para limpeza visual */}
            <span className="hidden ml-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-blue-600 bg-white/90 px-2 py-0.5 rounded-md border border-blue-100 shadow-xs">
              Editar
            </span>
          </button>

          {/* Delicate separator inside card */}
          <div className="h-[1px] bg-[#e2edf7] my-4" />

          {/* Bottom Row: Custo Total Estimado */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsDetailsModalOpen(true)}
              className="text-[15px] font-normal text-[#4b6076] hover:text-[#1b3248] transition-colors cursor-pointer text-left"
            >
              Custo total estimado
            </button>
            <div className="min-w-[120px] text-right flex justify-end">
              <AnimatedNumber
                value={totalSimulation.totalEstimatedCost}
                prefix="R$ "
                duration={240}
                className="text-[16px] sm:text-[17px] font-bold text-[#516e8b] tabular-nums"
              />
            </div>
          </div>
        </motion.div>

        {/* Card 2: Due Date with Alterar Action */}
        <motion.div
          variants={itemEntranceVariants}
          className="bg-white border border-[#e2edf7] rounded-[24px] px-4 py-3.5 flex items-center justify-between shadow-xs hover:border-[#ccdff1] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-5 h-5 text-[#0072e6] stroke-[2]" />
            <span className="text-[14px] font-medium text-[#253e57]">
              Vencimento: todo dia {firstDueDate.getDate()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              hapticLight();
              setIsDueDateModalOpen(true);
            }}
            className="text-[14px] font-semibold text-[#007fe8] hover:text-[#0066c0] active:scale-95 transition-all cursor-pointer px-1 py-0.5"
          >
            Alterar
          </button>
        </motion.div>

        {/* Subtle Dotted Separator matching Figma */}
        <div className="border-b border-dotted border-slate-300 my-5" />

        {/* Section: "Ajuste o prazo" matching prototype */}
        <motion.div variants={itemEntranceVariants} className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-[19px] sm:text-[20px] font-bold text-[#142840] tracking-tight">
              Ajuste o prazo
            </h2>
            {/* Real-time counter matching prototype: 7 Parcelas */}
            <button
              type="button"
              onClick={() => {
                hapticLight();
                setIsMonthlyModalOpen(true);
              }}
              className="text-right cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Selecionar prazo de parcelas"
            >
              <span className="text-[16px] sm:text-[17px] font-bold text-[#355272] hover:text-[#1e3a5f] tabular-nums inline-block text-right transition-colors">
                {installments} {installments === 1 ? 'Parcela' : 'Parcelas'}
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
      </div>

      {/* Sticky Bottom Action Bar with Solid Background */}
      <motion.footer
        variants={itemEntranceVariants}
        className="fixed sm:absolute bottom-0 inset-x-0 p-5 pb-8 sm:pb-6 bg-white z-20"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.12, ease: EASE_IN_OUT }}
          onClick={() => {
            hapticMedium();
            if (onContinueProposal) {
              onContinueProposal({
                loanAmount,
                installments,
                firstDueDate,
                monthlyInstallment: primarySimulation.monthlyInstallment,
                totalCost: totalSimulation.totalEstimatedCost,
              });
            } else {
              setIsSuccessModalOpen(true);
            }
          }}
          className="w-full bg-[#0072e6] hover:bg-[#0062c4] active:bg-[#0055aa] text-white font-bold py-4 px-6 rounded-full transition-all flex items-center justify-center text-base cursor-pointer"
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
