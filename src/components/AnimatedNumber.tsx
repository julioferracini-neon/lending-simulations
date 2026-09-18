import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  className?: string;
  decimals?: number;
  duration?: number; // in ms
}

/**
 * Smooth cubic bezier ease-in-out curve
 * Controls acceleration and deceleration gracefully
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = 'R$ ',
  className = '',
  decimals = 2,
  duration = 240,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const prevValueRef = useRef<number>(value);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    const startTime = performance.now();

    if (startValue === endValue) return;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Controlled ease-in ease-out acceleration/deceleration
      const ease = easeInOutCubic(progress);
      const current = startValue + (endValue - startValue) * ease;
      
      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, duration]);

  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue);

  return (
    <span className={`tabular-nums inline-block select-none whitespace-nowrap ${className}`}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      {formatted}
    </span>
  );
};
