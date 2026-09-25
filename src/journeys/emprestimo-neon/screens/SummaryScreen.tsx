import React, { useState, useMemo } from 'react';
import { ArrowLeft, HelpCircle, Shield, ChevronRight, Info, AlertTriangle, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { type LoanSimulationData } from './LoanSimulationScreen';
import { formatCurrency, formatDatePtBR, getDefaultFirstDueDate, calculateLoanSimulation, BASE_MONTHLY_RATE } from '../utils/finance';
import { hapticLight, hapticMedium, hapticSelection } from '@/src/utils/haptics';
import { PinBottomSheet } from '../components/PinBottomSheet';
import { BottomSheet } from '@/src/components/BottomSheet';
import { RouletteOdometer } from '../components/RouletteOdometer';
import { LoanDetailsModal } from '../components/LoanDetailsModal';
import { TopNavBar } from '@/src/components/TopNavBar';
import { PlaceholderBottomSheet, type PlaceholderContextData } from '../components/PlaceholderBottomSheet';
import { Button } from '@/src/design-system';

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
  const [isInsuranceEnabled, setIsInsuranceEnabled] = useState(true);
  const [showInsuranceAlert, setShowInsuranceAlert] = useState(false);

  const [infoModalType, setInfoModalType] = useState<'juros' | 'cet' | 'protecao' | null>(null);
  const [isLoanDetailsModalOpen, setIsLoanDetailsModalOpen] = useState(false);
  const [isInsuranceDetailsOpen, setIsInsuranceDetailsOpen] = useState(false);
  const [placeholderData, setPlaceholderData] = useState<PlaceholderContextData | null>(null);

  const effectiveSimulation = useMemo(() => {
    if (!simulationData) return null;
    return calculateLoanSimulation(
      loanAmount,
      simulationData.installments,
      BASE_MONTHLY_RATE,
      simulationData.firstDueDate,
      isInsuranceEnabled
    );
  }, [simulationData, loanAmount, isInsuranceEnabled]);

  const fallbackData = useMemo(() => {
    return calculateLoanSimulation(loanAmount, 7, BASE_MONTHLY_RATE, getDefaultFirstDueDate(), isInsuranceEnabled);
  }, [loanAmount, isInsuranceEnabled]);

  const displaySim = effectiveSimulation || fallbackData;
  
  // Calculate difference for alert
  const diffSimWithoutInsurance = useMemo(() => {
    if (!simulationData) return calculateLoanSimulation(loanAmount, 7, BASE_MONTHLY_RATE, getDefaultFirstDueDate(), false);
    return calculateLoanSimulation(loanAmount, simulationData.installments, BASE_MONTHLY_RATE, simulationData.firstDueDate, false);
  }, [simulationData, loanAmount]);

  const handleToggleInsurance = () => {
    if (isInsuranceEnabled) {
      setShowInsuranceAlert(true);
    } else {
      const scrollContainer = document.getElementById('summary-scroll-container');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setTimeout(() => {
        setIsInsuranceEnabled(true);
      }, 500); // Wait for scroll
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col bg-white overflow-hidden select-none"
      id="summary-screen"
    >
      {/* Scrollable Content */}
      <div 
        id="summary-scroll-container"
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-white pb-6 relative"
      >
        <TopNavBar 
          title="Resumo da proposta" 
          showBack={true} 
          onBack={onBack} 
          rightAction="help" 
          variant="summary"
        />

        {/* Subtle background gradient behind hero */}
        <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#f2f8ff] to-white pointer-events-none" />

        {/* Hero Section */}
        <div className="flex flex-col items-center pt-5 pb-6 px-6 relative z-10">
          <div className="w-[130px] h-[100px] mb-3 flex items-center justify-center relative">
            <img 
              src={`${import.meta.env.BASE_URL}assets/summary-illustration.png`}
              alt="Ilustração do calendário" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <p className="text-[13px] text-[#5a738e] mb-1 font-medium">Seu empréstimo</p>
          <motion.h2 
            key={displaySim.monthlyInstallment}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeInOut" }}
            className="text-[26px] font-extrabold text-[#142742] tracking-tight mb-3 flex items-center gap-1.5"
          >
            <RouletteOdometer value={displaySim.monthlyInstallment} prefix="R$ " motionDuration={0.6} className="text-[26px]" />
            <span className="font-bold text-[22px]">por mês</span>
          </motion.h2>
          
          <div className={`px-3.5 py-1 rounded-full mb-4 transition-colors ${isInsuranceEnabled ? 'bg-[#d0ff57]' : 'bg-transparent border border-slate-300'}`}>
            <p className={`text-[12px] font-semibold ${isInsuranceEnabled ? 'text-[#142742]' : 'text-slate-600'}`}>
              Serão {simulationData?.installments || 7} parcelas de {formatCurrency(displaySim.monthlyInstallment)} {isInsuranceEnabled ? '' : '(sem seguro)'}
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
              onClick={() => {
                hapticLight();
                onEditAmount?.();
              }}
              className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">Valor solicitado</p>
                <p className="text-[15px] font-bold text-[#142742]">
                  {formatCurrency(loanAmount)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  hapticLight();
                  onEditAmount?.();
                }}
                className="text-[#0073ea] p-1 -mr-1 hover:opacity-80 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Editar valor solicitado"
              >
                <EditFilledIcon className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Parcelamento escolhido */}
            <div
              onClick={() => {
                hapticLight();
                onEditInstallments?.();
              }}
              className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">Parcelamento escolhido</p>
                <p className="text-[15px] font-bold text-[#142742]">
                  {simulationData?.installments || 7}x de {formatCurrency(displaySim.monthlyInstallment)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  hapticLight();
                  onEditInstallments?.();
                }}
                className="text-[#0073ea] p-1 -mr-1 hover:opacity-80 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Editar parcelamento escolhido"
              >
                <EditFilledIcon className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Primeiro vencimento */}
            <div
              onClick={() => {
                hapticLight();
                onEditDueDate?.();
              }}
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
                  hapticLight();
                  onEditDueDate?.();
                }}
                className="text-[#0073ea] p-1 -mr-1 hover:opacity-80 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Editar primeiro vencimento"
              >
                <EditFilledIcon className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <p className="text-[13px] text-[#5a738e] mb-0.5">Valor total a pagar</p>
              <p className="text-[15px] font-bold text-[#142742]">
                {formatCurrency(displaySim.totalEstimatedCost)}
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
              {/* Toggle Switch */}
              <div 
                className={`w-[42px] h-[24px] rounded-full relative flex items-center px-[2px] cursor-pointer transition-colors ${isInsuranceEnabled ? 'bg-[#142742]' : 'bg-[#cbd5e1]'}`}
                onClick={handleToggleInsurance}
              >
                <div 
                  className={`w-[20px] h-[20px] bg-white rounded-full absolute shadow-sm transition-all ${isInsuranceEnabled ? 'right-[2px]' : 'left-[2px]'}`} 
                />
              </div>
            </div>
            
            {isInsuranceEnabled ? (
              <div className="px-5 py-4 border-b border-[#e2e8f0]">
                <p className="text-[13px] text-[#5a738e] leading-[1.45]">
                  Proteja as parcelas em caso de desemprego involuntário, doenças e outros imprevistos.
                </p>
              </div>
            ) : (
              <div className="px-5 py-4 border-b border-[#e2e8f0] bg-red-50/50 flex items-start gap-2.5">
                <AlertTriangle className="w-[18px] h-[18px] text-red-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-[13px] text-red-700 font-medium leading-[1.45]">
                  Seu empréstimo está desprotegido contra imprevistos.
                </p>
              </div>
            )}

            <button 
              type="button"
              onClick={() => setIsInsuranceDetailsOpen(true)}
              className="w-full px-5 py-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
            >
              <span className="text-[14px] font-bold text-[#0073ea]">Saber mais sobre a proteção</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#0073ea]" strokeWidth={2.5} />
            </button>
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
              <button 
                type="button"
                onClick={() => setInfoModalType('juros')}
                className="p-1 -mr-1 text-[#8ca3b8] hover:text-[#5a738e] active:scale-95 transition-all"
                aria-label="Mais informações sobre Juros ao mês"
              >
                <Info className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">CET ao ano</p>
                <p className="text-[15px] font-bold text-[#142742]">2,93%</p>
              </div>
              <button 
                type="button"
                onClick={() => setInfoModalType('cet')}
                className="p-1 -mr-1 text-[#8ca3b8] hover:text-[#5a738e] active:scale-95 transition-all"
                aria-label="Mais informações sobre CET ao ano"
              >
                <Info className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <p className="text-[13px] text-[#5a738e] mb-0.5">Proteção do empréstimo</p>
                <p className="text-[15px] font-bold text-[#142742]">
                  {isInsuranceEnabled ? '7,9% do valor do empréstimo' : '0,00 (Desativado)'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setInfoModalType('protecao')}
                className="p-1 -mr-1 text-[#8ca3b8] hover:text-[#5a738e] active:scale-95 transition-all"
                aria-label="Mais informações sobre Proteção do empréstimo"
              >
                <Info className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            <button
              onClick={() => {
                hapticLight();
                setIsLoanDetailsModalOpen(true);
              }}
              className="w-full px-5 py-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
            >
              <span className="text-[14px] font-bold text-[#0073ea]">Detalhes dos custos</span>
              <ChevronRight className="w-[18px] h-[18px] text-[#0073ea]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className="w-full shrink-0 bg-[#f8f9fc] px-5 pt-4 pb-8 relative z-20 border-t border-[#e2e8f0]/50 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
        <p className="text-[11px] text-[#5a738e] leading-[1.45] text-center mb-4 px-2">
          Ao contratar, você aceita os{' '}
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setPlaceholderData({
                title: 'Termos de Uso',
                category: 'Contrato e Condições Gerais',
                description: 'Os Termos de Uso detalham as cláusulas contratuais, obrigações, condições de parcelamento, taxas de juros, regras de liquidação e direitos do cliente para operações de crédito pessoal na Neon.',
                actionLabel: 'Entendi',
              });
            }}
            className="text-[#0073ea] font-bold underline underline-offset-2 hover:opacity-80 cursor-pointer inline p-0 m-0 bg-transparent border-0"
          >
            Termos de Uso
          </button>{' '}
          e{' '}
          <button
            type="button"
            onClick={() => {
              hapticLight();
              setPlaceholderData({
                title: 'Autorização de Cobrança da Proteção',
                category: 'Seguros e Débito Automático',
                description: 'Autorização expressa para contratação da proteção financeira facultativa inclusa nas parcelas e o respectivo débito programado em sua conta digital Neon no vencimento do contrato.',
                actionLabel: 'Entendi',
              });
            }}
            className="text-[#0073ea] font-bold underline underline-offset-2 hover:opacity-80 cursor-pointer inline p-0 m-0 bg-transparent border-0"
          >
            autoriza a cobrança da proteção
          </button>{' '}
          e débito na conta Neo do valor total ou parcial das parcelas no dia do vencimento ou após
        </p>
        <Button
          size="lg"
          onClick={() => {
            hapticMedium();
            setIsPinModalOpen(true);
          }}
        >
          Contratar empréstimo
        </Button>
      </footer>

      {/* Insurance Alert BottomSheet */}
      <BottomSheet
        isOpen={showInsuranceAlert}
        onClose={() => setShowInsuranceAlert(false)}
        title="Empréstimo ficará desprotegido"
      >
        <div className="flex flex-col">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 flex flex-col gap-1.5">
            <span className="text-sm text-slate-600 font-medium">Nova parcela sem proteção</span>
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-medium text-slate-400 line-through decoration-slate-300">
                {formatCurrency(displaySim.monthlyInstallment)}
              </span>
              <span className="text-xl font-extrabold text-[#142742]">
                {formatCurrency(diffSimWithoutInsurance.monthlyInstallment)}
              </span>
            </div>
          </div>

          <p className="text-[14px] text-slate-700 leading-relaxed mb-4">
            As parcelas do seu empréstimo não ficarão protegidas em caso de:
          </p>
          <ul className="text-[14px] text-slate-600 space-y-2.5 mb-6 ml-1">
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-800">1.</span>
              <span>Desemprego involuntário</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-800">2.</span>
              <span>Doenças que possam lhe impedir de manter o contrato</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-slate-800">3.</span>
              <span>Outros imprevistos (leia a nossa ajuda).</span>
            </li>
          </ul>

          <p className="text-[15px] font-bold text-[#142742] text-center mb-6">
            Deseja mesmo desativar o seguro?
          </p>

          <div className="flex flex-col gap-3">
            <Button
              size="md"
              onClick={() => setShowInsuranceAlert(false)}
            >
              Continuar com seguro
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                setShowInsuranceAlert(false);
                setTimeout(() => {
                  const scrollContainer = document.getElementById('summary-scroll-container');
                  if (scrollContainer) {
                    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  setTimeout(() => {
                    setIsInsuranceEnabled(false);
                  }, 500); // Wait for scroll
                }, 150); // Wait for bottom sheet to start closing
              }}
            >
              Desproteger empréstimo
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Info Modal */}
      <BottomSheet
        isOpen={infoModalType !== null}
        onClose={() => setInfoModalType(null)}
        title={
          infoModalType === 'juros' ? 'Juros ao mês' :
          infoModalType === 'cet' ? 'CET ao ano' :
          infoModalType === 'protecao' ? 'Proteção do empréstimo' : ''
        }
      >
        <div className="flex flex-col mb-4">
          {infoModalType === 'juros' && (
            <p className="text-[14px] text-slate-700 leading-relaxed">
              A taxa de juros ao mês é o percentual cobrado sobre o valor que você pegou emprestado. Ela é definida com base na sua análise de crédito e compõe a maior parte do custo do seu empréstimo.
            </p>
          )}
          {infoModalType === 'cet' && (
            <p className="text-[14px] text-slate-700 leading-relaxed">
              O Custo Efetivo Total (CET) demonstra o custo real e total do seu empréstimo por ano. Diferente da taxa de juros, o CET inclui impostos obrigatórios (como o IOF), seguros (se contratado) e eventuais tarifas, sendo a melhor métrica para comparar propostas.
            </p>
          )}
          {infoModalType === 'protecao' && (
            <p className="text-[14px] text-slate-700 leading-relaxed">
              O custo da proteção é calculado como um percentual único de 7,9% sobre o valor total emprestado. Esse valor é diluído e já está incluso nas suas parcelas mensais, garantindo a cobertura contra imprevistos durante todo o contrato.
            </p>
          )}
          <Button
            size="md"
            className="mt-6"
            onClick={() => setInfoModalType(null)}
          >
            Entendi
          </Button>
        </div>
      </BottomSheet>

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
      {/* Insurance Details (Sales Pitch) Modal */}
      <BottomSheet
        isOpen={isInsuranceDetailsOpen}
        onClose={() => setIsInsuranceDetailsOpen(false)}
        title="Por que proteger seu empréstimo?"
        maxHeightClass="max-h-[90vh]"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Imprevistos acontecem. Com a proteção, você garante tranquilidade para você e sua família. Veja as vantagens:
          </p>

          <div className="border border-slate-200 rounded-xl overflow-hidden mt-1">
            {/* Table Header */}
            <div className="flex bg-slate-50 border-b border-slate-200">
              <div className="flex-1 p-3 text-xs font-semibold text-slate-500 border-r border-slate-200">Situação</div>
              <div className="w-[76px] p-3 text-xs font-bold text-[#142742] text-center border-r border-slate-200 bg-[#d0ff57]/20 leading-tight flex items-center justify-center">Com Proteção</div>
              <div className="w-[76px] p-3 text-[11px] font-medium text-slate-400 text-center leading-tight flex items-center justify-center">Sem Proteção</div>
            </div>
            
            {/* Rows */}
            {[
              { label: 'Desemprego involuntário (CLT)', withText: 'Quita até 4 parcelas', withoutText: 'Você paga' },
              { label: 'Invalidez temporária', withText: 'Quita até 4 parcelas', withoutText: 'Você paga' },
              { label: 'Invalidez permanente ou morte', withText: 'Quitação total da dívida', withoutText: 'Dívida fica ativa' },
              { label: 'Sorteios mensais', withText: 'R$ 10.000 todo mês', withoutText: 'Não participa' },
            ].map((row, idx) => (
              <div key={idx} className="flex border-b border-slate-200 last:border-b-0">
                <div className="flex-1 p-3 text-xs text-slate-700 font-medium border-r border-slate-200 flex items-center">
                  {row.label}
                </div>
                <div className="w-[76px] p-2 border-r border-slate-200 flex flex-col items-center justify-center bg-[#d0ff57]/10 gap-1">
                  <Check className="w-[18px] h-[18px] text-emerald-600" strokeWidth={3} />
                  <span className="text-[10px] text-emerald-700 font-bold text-center leading-tight">{row.withText}</span>
                </div>
                <div className="w-[76px] p-2 flex flex-col items-center justify-center bg-slate-50/50 gap-1">
                  <X className="w-[18px] h-[18px] text-slate-300" strokeWidth={3} />
                  <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">{row.withoutText}</span>
                </div>
              </div>
            ))}
          </div>

          <Button
            size="md"
            className="mt-2"
            onClick={() => setIsInsuranceDetailsOpen(false)}
          >
            Entendi
          </Button>
        </div>
      </BottomSheet>

      {/* Loan Details Modal */}
      <LoanDetailsModal
        isOpen={isLoanDetailsModalOpen}
        onClose={() => setIsLoanDetailsModalOpen(false)}
        loanAmount={loanAmount}
        installments={simulationData?.installments || 7}
        rateMonthly={BASE_MONTHLY_RATE}
        result={displaySim}
      />

      {/* Second Layer: Placeholder Bottom Sheet for Terms & Authorization */}
      <PlaceholderBottomSheet
        isOpen={!!placeholderData}
        onClose={() => setPlaceholderData(null)}
        data={placeholderData}
      />
    </div>
  );
};
