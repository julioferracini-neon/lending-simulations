import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { hapticSelection } from '@/src/utils/haptics';

interface InstallmentSliderProps {
  value: number; // 1 to 24
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

// Exactly 6 dots distributed with strictly proportional, equidistant spacing:
// 0%, 20%, 40%, 60%, 80%, 100% across the slider track
const DOT_PERCENTAGES = [0, 20, 40, 60, 80, 100];

export const InstallmentSlider: React.FC<InstallmentSliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 24,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastHapticVal, setLastHapticVal] = useState(value);

  // Calculate percentage (0% to 100%)
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const calculateValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const clampedX = Math.max(0, Math.min(rawX, rect.width));
      const ratio = clampedX / rect.width;
      const calculated = Math.round(min + ratio * (max - min));
      const bounded = Math.max(min, Math.min(max, calculated));
      
      if (bounded !== value) {
        onChange(bounded);
        // Haptic feedback if available in mobile browser
        if (bounded !== lastHapticVal) {
          hapticSelection();
          setLastHapticVal(bounded);
        }
      }
    },
    [min, max, value, onChange, lastHapticVal]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    calculateValueFromPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    calculateValueFromPosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
  };

  // Keyboard navigation support for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(max, value + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(min, value - 1));
    }
  };

  return (
    <div className="w-full select-none pt-1 pb-1" id="installment-slider-container">
      {/* Slider Interactive Track Area */}
      <div
        ref={trackRef}
        id="installment-track"
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label="Ajuste do número de parcelas"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-[72px] cursor-pointer touch-none focus:outline-none"
      >
        {/* Background Track Line */}
        <div className="absolute left-0 right-0 top-[16px] -translate-y-1/2 h-[2px] bg-[#dbe4ee] rounded-full" />

        {/* Active Filled Track Line with ease-in-out curve */}
        <div
          className="absolute left-0 top-[16px] -translate-y-1/2 h-[2px] bg-[#0060ad] rounded-full"
          style={{
            width: `${percentage}%`,
            transition: isDragging ? 'none' : 'width 180ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        />

        {/* Equidistant Proportional Tick Dots (0%, 20%, 40%, 60%, 80%, 100%) */}
        {DOT_PERCENTAGES.map((dotPercent, index) => {
          // A dot is active/filled if the slider percentage is at or beyond it
          const isPassed = percentage >= dotPercent;
          const isCloseToThumb = Math.abs(percentage - dotPercent) < 3.5;

          return (
            <div
              key={index}
              className="absolute -translate-x-1/2 top-[16px] -translate-y-1/2 flex items-center justify-center pointer-events-none"
              style={{ left: `${dotPercent}%` }}
            >
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-150 ${
                  isPassed
                    ? 'bg-[#0060ad]'
                    : 'bg-white border-[1.5px] border-[#cfd9e5]'
                } ${isCloseToThumb ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>
          );
        })}

        {/* Draggable Thumb Knob Anchor at Track Line Center (X: percentage, Y: 16px) */}
        <div
          className="absolute top-[16px] pointer-events-none z-20"
          style={{
            left: `${percentage}%`,
            transition: isDragging ? 'none' : 'left 180ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        >
          {/* Thumb Outer White Circle - precisely centered on the track line */}
          <div className="absolute top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{
                scale: isDragging ? 1.08 : 1,
              }}
              transition={{
                duration: 0.16,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              className="w-[26px] h-[26px] rounded-full bg-white border-[1.5px] border-[#e2eaf2] shadow-[0_2px_7px_rgba(20,40,75,0.18)] flex items-center justify-center relative"
            />
          </div>

          {/* Droplet Pin Badge - positioned beneath the white circle with 3px gap */}
          <div className="absolute top-[16px] -translate-x-1/2 flex flex-col items-center pointer-events-none">
            <div className="relative w-[48px] h-[34px]">
              <svg
                width="48"
                height="34"
                viewBox="0 0 48 34"
                fill="none"
                className="filter drop-shadow-[0_2px_5px_rgba(20,40,75,0.2)]"
              >
                <path
                  d="M 21.5 3 C 21.5 1.3 22.8 0 24 0 C 25.2 0 26.5 1.3 26.5 3 L 26.5 6 C 26.5 8.5 28.5 10 31.5 10 L 36 10 C 42.6 10 48 15.4 48 22 C 48 28.6 42.6 34 36 34 L 12 34 C 5.4 34 0 28.6 0 22 C 0 15.4 5.4 10 12 10 L 16.5 10 C 19.5 10 21.5 8.5 21.5 6 Z"
                  fill="#2c4155"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 h-[24px] flex items-center justify-center pointer-events-none">
                <span className="text-white text-[13.5px] font-semibold tabular-nums tracking-tight leading-none">
                  {value}x
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Numerical Labels Row (1x and 24x) beneath endpoints */}
        <button
          type="button"
          onClick={() => onChange(min)}
          className="absolute left-0 top-[28px] text-[17px] font-medium text-[#384c61] hover:text-[#0060ad] transition-colors cursor-pointer tabular-nums select-none focus:outline-none"
        >
          {min}x
        </button>
        <button
          type="button"
          onClick={() => onChange(max)}
          className="absolute right-0 top-[28px] text-[17px] font-medium text-[#384c61] hover:text-[#0060ad] transition-colors cursor-pointer tabular-nums select-none focus:outline-none"
        >
          {max}x
        </button>
      </div>

      {/* Explanatory Indicators (Menor custo vs Menor parcela) */}
      <div className="flex justify-between items-center text-[13px] font-medium text-[#41607e] mt-2 px-0.5 select-none">
        <span>Menor custo</span>
        <span>Menor parcela</span>
      </div>
    </div>
  );
};
