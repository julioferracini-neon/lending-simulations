import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Shield, ChevronRight, Info } from 'lucide-react';
import { type LoanSimulationData } from './LoanSimulationScreen';
import { formatCurrency, formatDatePtBR, getDefaultFirstDueDate } from '../utils/finance';
import { PinBottomSheet } from './PinBottomSheet';

// Solid filled Material edit icon matching Figma
const EditFilledIcon: React.FC<{ className?: string }> = ({ className = "w-[18px] h-[18px]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

interface SummaryScreenProps {
  loanAmount?: number;
  simulationData?: LoanSimulationData | null;
  onRestart?: () => void;
  onBack?: () => void;
  onEditAmount?: () => void;
  onEditInstallments?: () => void;
  onEditDueDate?: () => void;
  onContract?: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  loanAmount = 2000,
  simulationData,
  onBack,
  onEditAmount,
  onEditInstallments,
  onEditDueDate,
  onContract,
}) => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <div
      className="w-full h-full flex flex-col bg-white overflow-hidden select-none"
      id="summary-screen"
    >
      {/* App Bar */}
      <header className="w-full px-5 pt-3 pb-3 flex items-center justify-between shrink-0 bg-transparent z-20 relative">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="text-[#0073ea] active:opacity-70 transition-opacity flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>

          <h1 className="text-[17px] font-bold text-[#142742] tracking-tight">
            Resumo da proposta
          </h1>
        </div>

        <button
          type="button"
          className="text-[#0073ea] active:opacity-70 transition-opacity flex items-center justify-center"
          aria-label="Ajuda"
        >
          <HelpCircle className="w-[22px] h-[22px]" strokeWidth={2.5} />
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-white pb-6 relative">
        
        {/* Subtle background gradient behind hero */}
        <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#f2f8ff] to-white pointer-events-none" />

        {/* Hero Section */}
        <div className="flex flex-col items-center pt-5 pb-6 px-6 relative z-10">
          <div className="w-[130px] h-[100px] mb-3 flex items-center justify-center relative">
            <img 
              src="/assets/summary-illustration.png" 
              alt="Ilustração do calendário" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <p className="text-[13px] text-[#5a738e] mb-1 font-medium">Seu empréstimo</p>
          <h2 className="text-[26px] font-extrabold text-[#142742] tracking-tight mb-3">
            {simulationData ? formatCurrency(simulationData.monthlyInstallment) : 'R$ 423,16'} <span className="font-bold text-[22px]">por mês</span>
          </h2>
          
          <div className="px-3.5 py-1 bg-[#d0ff57] rounded-full mb-4">
            <p className="text-[12px] font-semibold text-[#142742]">
              Serão {simulationData?.installments || 7} parcelas de {simulationData ? formatCurrency(simulationData.monthlyInstallment) : 'R$ 423,16'}
            </p>
          </div>
          
          <p className="text-[13px] font-medium text-[#142742]">
            Seu primeiro pagamento será em {(() => {
              const date = simulationData?.firstDueDate || getDefaultFirstDueDate();
              return `${date.getDate()} de ${date.toLocaleString('pt-BR', { month: 'long' }).charAt(0).toUpperCase() + date.toLocaleString('pt-BR', { month: 'long' }).slice(1)}`;
            })()}
          </p>
        </div>

        {/* Cards Container */}
        <div className="px-5 flex flex-col gap-4 relative z-10">
          
          {/* Card 1: Detalhes do empréstimo */}
          <div className="border border-[#e2e8f0] rounded-[16px] overflow-hidden bg-white">
            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <h3 className="text-[15px] font-medium text-[#5a738e]">Detalhes do empréstimo</h3>
            </div>
            
            {/* Valor solicitado */}
            <div
              onClick={onEditAmount}
              className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">Valor solicitado</p>
                <p className="text-[15px] font-bold text-[#142742]">
                  {loanAmount ? loanAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 2.000,00'}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditAmount?.();
                }}
                className="text-[#0073ea] p-1 -mr-1 hover:opacity-80 active:scale-95 transition-all flex items-center justify-center"
                aria-label="Editar valor solicitado"
              >
                <EditFilledIcon className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Parcelamento escolhido */}
            <div
              onClick={onEditInstallments}
              className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">Parcelamento escolhido</p>
                <p className="text-[15px] font-bold text-[#142742]">
                  {simulationData?.installments || 7}x de {simulationData ? formatCurrency(simulationData.monthlyInstallment) : 'R$ 423,16'}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditInstallments?.();
                }}
                className="text-[#0073ea] p-1 -mr-1 hover:opacity-80 active:scale-95 transition-all flex items-center justify-center"
                aria-label="Editar parcelamento escolhido"
              >
                <EditFilledIcon className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Primeiro vencimento */}
            <div
              onClick={onEditDueDate}
              className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">Primeiro vencimento</p>
                <p className="text-[15px] font-bold text-[#142742]">
                  {simulationData?.firstDueDate ? formatDatePtBR(simulationData.firstDueDate) : formatDatePtBR(getDefaultFirstDueDate())}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditDueDate?.();
                }}
                className="text-[#0073ea] p-1 -mr-1 hover:opacity-80 active:scale-95 transition-all flex items-center justify-center"
                aria-label="Editar primeiro vencimento"
              >
                <EditFilledIcon className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <p className="text-[13px] text-[#5a738e] mb-0.5">Valor total a pagar</p>
              <p className="text-[15px] font-bold text-[#142742]">
                {simulationData ? formatCurrency(simulationData.totalCost) : 'R$ 2.962,12'}
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-[13px] text-[#5a738e] mb-0.5">Demais vencimentos</p>
              <p className="text-[15px] font-bold text-[#142742]">
                Todo dia {simulationData?.firstDueDate ? simulationData.firstDueDate.getDate() : getDefaultFirstDueDate().getDate()} de cada mês
              </p>
            </div>
          </div>

          {/* Card 2: Proteção do empréstimo */}
          <div className="border border-[#e2e8f0] rounded-[16px] overflow-hidden bg-white">
            <div className="px-5 py-4 flex items-center justify-between border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#142742]" fill="currentColor" strokeWidth={1} />
                <h3 className="text-[15px] font-bold text-[#142742]">Proteção do empréstimo</h3>
              </div>
              {/* Toggle Switch (Checked) */}
              <div className="w-[42px] h-[24px] bg-[#142742] rounded-full relative flex items-center px-[2px] cursor-pointer">
                <div className="w-[20px] h-[20px] bg-white rounded-full absolute right-[2px] shadow-sm" />
              </div>
            </div>
            
            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <p className="text-[13px] text-[#5a738e] leading-[1.45]">
                Proteja as parcelas em caso de desemprego involuntário, doenças e outros imprevistos.
              </p>
            </div>

            <div className="px-5 py-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors">
              <span className="text-[14px] font-bold text-[#0073ea]">Saber mais sobre a proteção</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#0073ea]" strokeWidth={2.5} />
            </div>
          </div>

          {/* Card 3: Resumo dos custos */}
          <div className="border border-[#e2e8f0] rounded-[16px] overflow-hidden bg-white">
            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <h3 className="text-[15px] font-medium text-[#5a738e]">Resumo dos custos</h3>
            </div>

            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">Juros ao mês</p>
                <p className="text-[15px] font-bold text-[#142742]">4,67%</p>
              </div>
              <Info className="w-5 h-5 text-[#8ca3b8]" strokeWidth={2} />
            </div>

            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">CET ao ano</p>
                <p className="text-[15px] font-bold text-[#142742]">2,93%</p>
              </div>
              <Info className="w-5 h-5 text-[#8ca3b8]" strokeWidth={2} />
            </div>

            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">Proteção do empréstimo</p>
                <p className="text-[15px] font-bold text-[#142742]">7,9% do valor do empréstimo</p>
              </div>
              <Info className="w-5 h-5 text-[#8ca3b8]" strokeWidth={2} />
            </div>

            <div className="px-5 py-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors">
              <span className="text-[14px] font-bold text-[#0073ea]">Detalhes dos custos</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#0073ea]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="w-full shrink-0 bg-[#f8f9fc] px-5 pt-4 pb-8 relative z-20 border-t border-[#e2e8f0]/50 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        <p className="text-[11px] text-[#5a738e] leading-[1.45] text-center mb-4 px-2">
          Ao contratar, você aceita os <a href="#" className="text-[#0073ea] font-bold underline-offset-2 hover:underline">Termos de Uso</a> e <a href="#" className="text-[#0073ea] font-bold underline-offset-2 hover:underline">autoriza a cobrança da proteção</a> e débito na conta Neo do valor total ou parcial das parcelas no dia do vencimento ou após
        </p>
        <button
          onClick={() => setIsPinModalOpen(true)}
          className="w-full h-[52px] bg-[#0073ea] text-white font-bold text-[16px] rounded-full active:scale-[0.98] transition-transform shadow-sm"
        >
          Contratar empréstimo
        </button>
      </footer>

      {/* PIN Confirmation Modal */}
      <PinBottomSheet
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          // Wait for bottom sheet exit animation before advancing
          setTimeout(() => {
            onContract?.();
          }, 300);
        }}
      />
    </div>
  );
};
