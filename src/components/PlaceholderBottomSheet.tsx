import React from 'react';
import { Sparkles, Layers, Info, CheckCircle2 } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { hapticLight, hapticMedium } from '../utils/haptics';

export interface PlaceholderContextData {
  title: string;
  description: string;
  category?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
}

interface PlaceholderBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  data: PlaceholderContextData | null;
}

export const PlaceholderBottomSheet: React.FC<PlaceholderBottomSheetProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!data) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {
        hapticLight();
        onClose();
      }}
      title={data.title}
      subtitle={data.category ?? 'Protótipo em validação'}
      icon={
        data.icon ?? (
          <div className="w-10 h-10 rounded-2xl bg-[#EBF5FF] flex items-center justify-center text-[#0078D9]">
            <Sparkles className="w-5 h-5 text-[#0078D9]" />
          </div>
        )
      }
      maxHeightClass="max-h-[85vh]"
    >
      <div className="flex flex-col gap-5 pt-2 pb-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F7FF] border border-[#D0E5FF] w-fit">
          <span className="w-2 h-2 rounded-full bg-[#0078D9] animate-pulse" />
          <span className="text-[12px] font-bold text-[#005CAD] uppercase tracking-wider">
            Segunda Camada (Second Layer)
          </span>
        </div>

        {/* Description Text */}
        <div className="flex flex-col gap-2">
          <p className="text-[15px] text-[#3D4759] leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Informational Callout */}
        <div className="bg-[#F8FAFD] border border-[#E2EDF7] rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#0078D9] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-bold text-[#142742]">
              Preservação da navegação
            </span>
            <span className="text-[12px] text-[#556982] leading-normal">
              Esta sessão é exibida em bottom sheet para não interromper nem desempilhar a jornada em andamento.
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            hapticMedium();
            onClose();
          }}
          className="w-full bg-[#0078D9] hover:bg-[#0062c4] active:scale-[0.98] text-white font-bold py-3.5 rounded-full transition-all cursor-pointer text-[15px] mt-2 shadow-xs"
        >
          {data.actionLabel ?? 'Entendi'}
        </button>
      </div>
    </BottomSheet>
  );
};
