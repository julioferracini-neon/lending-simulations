import React, { useState, useEffect, useRef } from 'react';
import { BottomSheet } from '@/src/components/BottomSheet';
import { ArrowLeft, X, Eye, EyeOff } from 'lucide-react';
import { hapticLight, hapticMedium, hapticSelection } from '@/src/utils/haptics';

interface PinBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinBottomSheet: React.FC<PinBottomSheetProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [isPinVisible, setIsPinVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setIsPinVisible(false);
      // Small delay to allow bottom sheet to animate in before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length > pin.length) {
        hapticSelection();
      } else if (value.length < pin.length) {
        hapticLight();
      }
      setPin(value);
    }
  };

  const handleConfirm = () => {
    if (pin.length === 4) {
      hapticMedium();
      onSuccess();
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} id="pin-bottom-sheet" noPadding={true}>
      <div className="flex flex-col w-full h-full bg-white select-none min-h-[500px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                hapticLight();
                onClose();
              }}
              className="text-[#0073ea] active:opacity-70 transition-opacity cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <h2 className="text-[17px] font-bold text-[#233549]">Senha</h2>
          </div>
          <button
            onClick={() => {
              hapticLight();
              onClose();
            }}
            className="text-[#0073ea] active:opacity-70 transition-opacity cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pt-6 flex-1 flex flex-col relative">
          <h3 className="text-[22px] font-extrabold text-[#233549] tracking-tight mb-2">
            Informe a senha de 4 digitos
          </h3>
          <p className="text-[14px] text-[#5a738e] leading-relaxed mb-8 pr-4">
            Usada para transferências, Pix, compras no cartão e movimentações no aplicativo.
          </p>

          <div className="flex items-center gap-3 relative mb-auto">
            {/* Hidden Input for mobile keyboard */}
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={handleInputChange}
              className="absolute inset-0 w-[80%] h-full opacity-0 cursor-pointer z-10"
              autoComplete="off"
            />
            
            {/* Visual PIN Indicators */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-[48px] h-[48px] rounded-[16px] border-2 flex items-center justify-center text-[20px] font-medium transition-colors ${
                  pin.length > index ? 'border-[#233549] text-[#233549]' : 'border-[#233549] text-transparent'
                }`}
              >
                {pin.length > index ? (isPinVisible ? pin[index] : '•') : ''}
              </div>
            ))}
            
            {/* Toggle Visibility */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // prevent input focus steal
                hapticLight();
                setIsPinVisible(!isPinVisible);
              }}
              className="ml-2 p-2 text-[#233549] hover:bg-slate-100 rounded-full active:opacity-70 transition-all z-20 relative cursor-pointer"
            >
              {isPinVisible ? (
                <EyeOff className="w-[22px] h-[22px]" strokeWidth={2.5} />
              ) : (
                <Eye className="w-[22px] h-[22px]" strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* Confirm Button */}
          <div className="pt-8 pb-6 w-full">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={pin.length !== 4}
              className="w-full bg-[#0073ea] disabled:bg-[#0073ea]/60 disabled:cursor-not-allowed hover:bg-[#0062c4] active:scale-[0.98] text-white font-bold py-4 rounded-full transition-all flex items-center justify-center text-[15px] cursor-pointer"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

