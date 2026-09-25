import React, { useState } from 'react';
import { Info, ShieldCheck } from 'lucide-react';
import { BottomSheet } from '@/src/components/BottomSheet';
import { SimulationResult } from '@/src/types';
import { formatCurrency } from '../utils/finance';
import { Button } from '@/src/design-system';

interface LoanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanAmount: number;
  installments: number;
  rateMonthly: number;
  result: SimulationResult;
}

export const LoanDetailsModal: React.FC<LoanDetailsModalProps> = ({
  isOpen,
  onClose,
  loanAmount,
  installments,
  rateMonthly,
  result,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'schedule'>('summary');

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Composição do plano"
      subtitle="Entenda valores, amortização, taxas e cobranças do seu plano."
      maxHeightClass="max-h-[90vh]"
      id="loan-details-modal"
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resumo do Contrato
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cronograma ({installments}x)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' ? (
          <div className="space-y-4">
            {/* Cost breakdown cards */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Valor líquido liberado:</span>
                <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Prazo escolhido:</span>
                <span className="font-semibold text-slate-800 tabular-nums">{installments} parcelas mensais</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Valor de cada parcela:</span>
                <span className="font-bold text-blue-600 tabular-nums">{formatCurrency(result.monthlyInstallment)}</span>
              </div>
              <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
                <span className="text-slate-500">Taxa de juros mensal:</span>
                <span className="font-bold text-slate-900 tabular-nums">{(rateMonthly * 100).toFixed(2).replace('.', ',')}% a.m.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Taxa de juros anual:</span>
                <span className="font-medium text-slate-700 tabular-nums">{(Math.pow(1 + rateMonthly, 12) - 1 * 100).toFixed(2).replace('.', ',')}% a.a.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">CET (Custo Efetivo Total):</span>
                <span className="font-bold text-emerald-700 tabular-nums">{result.effectiveAnnualRate.toFixed(1).replace('.', ',')}% a.a.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">IOF aproximado:</span>
                <span className="font-medium text-slate-700 tabular-nums">{formatCurrency(result.iofAmount)}</span>
              </div>
              <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center text-base">
                <span className="font-bold text-slate-900">Total a pagar:</span>
                <span className="font-black text-slate-900 tabular-nums">{formatCurrency(result.totalEstimatedCost)}</span>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                Sem taxas ocultas. Você pode amortizar ou quitar o financiamento antecipadamente a qualquer momento com desconto proporcional dos juros.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 mb-2">
              Detalhamento mês a mês com juros decrescentes e amortização do saldo devedor:
            </p>
            {result.schedule.map((item) => (
              <div
                key={item.installmentNumber}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px] tabular-nums">
                    {item.installmentNumber}º
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{item.dueDate}</p>
                    <p className="text-slate-400 text-[10px] tabular-nums">
                      Amortização: {formatCurrency(item.principalAmount)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-sm tabular-nums">
                    {formatCurrency(item.installmentAmount)}
                  </p>
                  <p className="text-slate-500 text-[10px] tabular-nums">
                    Saldo: {formatCurrency(item.balanceRemaining)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer button */}
        <Button
          type="button"
          size="md"
          className="mt-3"
          onClick={onClose}
        >
          Entendi
        </Button>
      </div>
    </BottomSheet>
  );
};
