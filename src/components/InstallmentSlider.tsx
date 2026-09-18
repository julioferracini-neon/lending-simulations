import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

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
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator && bounded !== lastHapticVal) {
          try {
            navigator.vibrate(6);
          } catch {
            // Ignore if vibration is restricted
          }
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
    <div className="w-full select-none pt-2 pb-1" id="installment-slider-container">
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
        className="relative h-14 flex items-center cursor-pointer touch-none focus:outline-none"
      >
        {/* Background Track Line */}
        <div className="absolute inset-x-0 h-1 bg-[#e2e8f0] rounded-full" />

        {/* Active Filled Track Line with ease-in-out curve */}
        <div
          className="absolute left-0 h-1 bg-[#0066cc] rounded-full"
          style={{
            width: `${percentage}%`,
            transition: isDragging ? 'none' : 'width 180ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        />

        {/* Equidistant Proportional Tick Dots (0%, 20%, 40%, 60%, 80%, 100%) */}
        {DOT_PERCENTAGES.map((dotPercent, index) => {
          // A dot is active/filled if the slider percentage is at or beyond it
          const isPassed = percentage >= dotPercent;
          const isCloseToThumb = Math.abs(percentage - dotPercent) < 4;

          return (
            <div
              key={index}
              className="absolute -translate-x-1/2 flex items-center justify-center pointer-events-none"
              style={{ left: `${dotPercent}%` }}
            >
              <div
                className={`w-2 h-2 rounded-full border transition-colors duration-150 ${
                  isPassed
                    ? 'bg-[#0066cc] border-[#0066cc]'
                    : 'bg-white border-[#cbd5e1]'
                } ${isCloseToThumb ? 'opacity-30' : 'opacity-100'}`}
              />
            </div>
          );
        })}

        {/* Draggable Thumb Knob with Fixed Floating Droplet */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
          style={{
            left: `${percentage}%`,
            transition: isDragging ? 'none' : 'left 180ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        >
          {/* Thumb Outer White Circle */}
          <motion.div
            animate={{
              scale: isDragging ? 1.12 : 1,
            }}
            transition={{
              duration: 0.16,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="w-7 h-7 rounded-full bg-white border-2 border-slate-200 shadow-md flex items-center justify-center relative"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-blue-50/40" />
          </motion.div>

          {/* Hanging Droplet Badge beneath the thumb */}
          <div className="relative mt-1 flex flex-col items-center">
            {/* Top pointer triangle */}
            <div className="w-0 h-0 border-x-4 border-x-transparent border-b-[5px] border-b-[#223953]" />
            
            {/* Dark Navy Droplet Pill with strictly fixed geometry & tabular numbers */}
            <div className="bg-[#223953] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md w-11 h-6 flex items-center justify-center text-center">
              <span className="tabular-nums tracking-normal inline-block text-center leading-none">
                {value}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Labels Row (1x and 24x) with Fixed Widths & Tabular Nums */}
      <div className="flex justify-between items-center text-sm font-medium text-slate-700 mt-4 px-0.5">
        <button
          type="button"
          onClick={() => onChange(min)}
          className="w-8 text-left hover:text-blue-600 transition-colors cursor-pointer tabular-nums"
        >
          {min}x
        </button>
        <button
          type="button"
          onClick={() => onChange(max)}
          className="w-8 text-right hover:text-blue-600 transition-colors cursor-pointer tabular-nums"
        >
          {max}x
        </button>
      </div>

      {/* Explanatory Indicators (Menor custo vs Menor parcela) */}
      <div className="flex justify-between items-center text-xs font-semibold text-[#325272] mt-1.5 px-0.5">
        <span className="flex items-center gap-1 select-none">
          Menor custo
        </span>
        <span className="flex items-center gap-1 select-none">
          Menor parcela
        </span>
      </div>
    </div>
  );
};
