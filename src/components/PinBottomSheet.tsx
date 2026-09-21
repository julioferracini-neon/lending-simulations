import React, { useState, useEffect, useRef } from 'react';
import { BottomSheet } from './BottomSheet';
import { ArrowLeft, X, Eye, EyeOff } from 'lucide-react';

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

  useEffect(() => {
    if (pin.length === 4) {
      // Auto advance on 4 digits
      const timer = setTimeout(() => {
        onSuccess();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pin, onSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} id="pin-bottom-sheet">
      <div className="flex flex-col w-full bg-white select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-[#0073ea] active:opacity-70 transition-opacity">
              <ArrowLeft className="w-[22px] h-[22px]" strokeWidth={2.5} />
            </button>
            <h2 className="text-[17px] font-bold text-[#142742]">Senha</h2>
          </div>
          <button onClick={onClose} className="text-[#0073ea] active:opacity-70 transition-opacity">
            <X className="w-[22px] h-[22px]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pt-6 pb-[300px] relative">
          <h3 className="text-[22px] font-extrabold text-[#142742] tracking-tight mb-2">
            Informe a senha de 4 digitos
          </h3>
          <p className="text-[14px] text-[#5a738e] leading-relaxed mb-8 pr-4">
            Usada para transferências, Pix, compras no cartão e movimentações no aplicativo.
          </p>

          <div className="flex items-center gap-3 relative">
            {/* Hidden Input for mobile keyboard */}
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              autoComplete="off"
            />
            
            {/* Visual PIN Indicators */}
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-[48px] h-[48px] rounded-full border-[1.5px] flex items-center justify-center text-[20px] font-medium transition-colors ${
                  pin.length > index ? 'border-[#142742] text-[#142742]' : 'border-[#142742] text-transparent'
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
                setIsPinVisible(!isPinVisible);
              }}
              className="ml-2 p-2 text-[#5a738e] active:opacity-70 transition-opacity z-20 relative"
            >
              {isPinVisible ? (
                <EyeOff className="w-6 h-6" strokeWidth={2.5} />
              ) : (
                <Eye className="w-6 h-6" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

