import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface SummaryScreenProps {
  onRestart?: () => void;
  onBack?: () => void;
}

/**
 * SummaryScreen: Tela de Summary / Resumo da Proposta.
 * Mantida em branco conforme solicitado ("deixar em branco por enquanto").
 */
export const SummaryScreen: React.FC<SummaryScreenProps> = ({ onRestart, onBack }) => {
  return (
    <div
      className="w-full h-full flex flex-col bg-white overflow-hidden select-none"
      id="summary-screen"
    >
      {/* Minimal App Bar with Back and Restart Controls */}
      <header className="w-full px-4 pt-3 pb-2 flex items-center justify-between border-b border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-full text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-sm font-semibold text-slate-700">Resumo da Proposta</span>

        <button
          type="button"
          onClick={onRestart}
          className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
          title="Recomeçar simulação"
          aria-label="Recomeçar fluxo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </header>

      {/* Blank Canvas Area (Aguardando definições futuras do Figma) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
          <span className="w-3 h-3 rounded-full bg-[#00b2fe] animate-ping" />
        </div>
        <p className="text-sm text-slate-400 font-medium">
          Tela de Summary
        </p>
        <p className="text-xs text-slate-400 mt-1">
          (Aguardando especificações dos próximos passos)
        </p>
      </main>
    </div>
  );
};
