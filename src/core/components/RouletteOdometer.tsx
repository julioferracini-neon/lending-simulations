import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

interface RouletteOdometerProps {
  value: number;
  prefix?: string;
  className?: string;
  motionDuration?: number;
}

// 5 complete cycles of 0-9 (50 items) for sustained mechanical rolling and continuous spins
const DIGIT_CYCLE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const DRUM_DIGITS = [
  ...DIGIT_CYCLE,
  ...DIGIT_CYCLE,
  ...DIGIT_CYCLE,
  ...DIGIT_CYCLE,
  ...DIGIT_CYCLE,
];
const TOTAL_DRUM_ITEMS = DRUM_DIGITS.length; // 50 items
const DIGIT_HEIGHT_EM = 1.16;

interface RouletteDigitColumnProps {
  targetDigit: number;
  columnId: string;
  staggerIndex: number;
}

const RouletteDigitColumn: React.FC<RouletteDigitColumnProps> = ({
  targetDigit,
  columnId,
  staggerIndex,
}) => {
  // Start at cycle index 20 + targetDigit
  const [drumIndex, setDrumIndex] = useState<number>(20 + targetDigit);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinConfig, setSpinConfig] = useState({
    blurAmount: 1.8,
    moveDuration: 0.30,
    blurDuration: 0.16,
  });

  const prevDigitRef = useRef<number>(targetDigit);
  const isMountedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      setDrumIndex(20 + targetDigit);
      prevDigitRef.current = targetDigit;
      return;
    }

    if (prevDigitRef.current !== targetDigit) {
      const prev = prevDigitRef.current;
      prevDigitRef.current = targetDigit;

      // Directional delta: shortest rotational path around 10-digit drum
      let diff = targetDigit - (prev % 10);
      if (diff > 5) diff -= 10;
      if (diff < -5) diff += 10;
      if (diff === 0) diff = 1;

      const absDiff = Math.abs(diff);

      // Blur intensity and duration strictly proportional to movement velocity:
      const blurAmount = absDiff <= 1 ? 1.1 : absDiff <= 3 ? 1.8 : 2.4;
      // Increased durations for a much softer and silkier ease-out
      const moveDuration = absDiff <= 1 ? 0.40 : 0.55;
      const blurDuration = absDiff <= 1 ? 0.20 : absDiff <= 3 ? 0.25 : 0.30;

      setSpinConfig({
        blurAmount,
        moveDuration,
        blurDuration,
      });

      setDrumIndex((prevIndex) => {
        let nextIndex = prevIndex + diff;
        // Keep within safe middle cycles (10..39) of 50-item drum
        if (nextIndex < 10) nextIndex += 20;
        if (nextIndex >= 40) nextIndex -= 20;
        return nextIndex;
      });

      setIsSpinning(true);

      // Rapid cleanup timeout to reset spinning state right after the blur clears
      const timer = setTimeout(() => {
        setIsSpinning(false);
      }, blurDuration * 1000 + (staggerIndex * 15) + 30);

      return () => clearTimeout(timer);
    }
  }, [targetDigit, staggerIndex]);

  return (
    <span
      className="inline-block relative overflow-hidden align-middle text-center select-none"
      style={{
        height: `${DIGIT_HEIGHT_EM}em`,
        width: '0.62em',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 15%, black 35%, black 65%, rgba(0,0,0,0.85) 85%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 15%, black 35%, black 65%, rgba(0,0,0,0.85) 85%, transparent 100%)',
      }}
    >
      {/* Moving Roulette Drum Tape with Velocity-Tracked Fast Motion Blur */}
      <motion.span
        key={columnId}
        animate={{
          y: `-${drumIndex * (100 / TOTAL_DRUM_ITEMS)}%`,
          // Fast blur that peaks at motion onset and dissipates to 0px rapidly while moving
          filter: isSpinning ? [`blur(${spinConfig.blurAmount}px)`, 'blur(0px)'] : 'blur(0px)',
          opacity: isSpinning ? [0.85, 1] : 1,
        }}
        transition={{
          y: {
            duration: spinConfig.moveDuration,
            delay: (staggerIndex * 15) / 1000,
            ease: [0.16, 1, 0.3, 1], // softer, prolonged silky ease out
          },
          filter: {
            duration: spinConfig.blurDuration, 
            delay: (staggerIndex * 15) / 1000,
            ease: 'easeOut',
          },
          opacity: {
            duration: spinConfig.blurDuration,
            delay: (staggerIndex * 15) / 1000,
          },
        }}
        className="flex flex-col select-none will-change-transform"
        style={{
          height: `${TOTAL_DRUM_ITEMS * 100}%`,
        }}
      >
        {DRUM_DIGITS.map((num, idx) => (
          <span
            key={`drum-item-${idx}-${num}`}
            className="flex items-center justify-center tabular-nums leading-none font-black"
            style={{
              height: `${100 / TOTAL_DRUM_ITEMS}%`,
            }}
          >
            {num}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

export const RouletteOdometer: React.FC<RouletteOdometerProps> = ({
  value,
  prefix = 'R$ ',
  className = '',
}) => {
  // Format standard pt-BR currency number (e.g. 423,16 or 1.058,23)
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  const [intPart, decPart] = formatted.split(',');
  const rawIntDigits = intPart.replace(/\./g, '').split('').map(Number);
  const decDigits = (decPart || '00').split('').map(Number);

  // Build items with stable right-anchored keys so DOM elements persist across updates
  const items: Array<{
    key: string;
    type: 'digit' | 'symbol';
    value: number | string;
    staggerIndex: number;
  }> = [];

  const totalInt = rawIntDigits.length;

  for (let i = 0; i < totalInt; i++) {
    const power = totalInt - 1 - i;
    const digitVal = rawIntDigits[i];
    // Left-to-right or right-to-left stagger index
    const stagger = totalInt - 1 - i;

    items.push({
      key: `drum-pow-${power}`,
      type: 'digit',
      value: digitVal,
      staggerIndex: stagger,
    });

    if (power > 0 && power % 3 === 0) {
      items.push({
        key: `drum-dot-${power}`,
        type: 'symbol',
        value: '.',
        staggerIndex: 0,
      });
    }
  }

  // Comma separator
  items.push({
    key: 'drum-comma',
    type: 'symbol',
    value: ',',
    staggerIndex: 0,
  });

  // Decimals (cents)
  items.push({
    key: 'drum-cent-1',
    type: 'digit',
    value: decDigits[0] ?? 0,
    staggerIndex: 1,
  });
  items.push({
    key: 'drum-cent-2',
    type: 'digit',
    value: decDigits[1] ?? 0,
    staggerIndex: 0,
  });

  return (
    <span
      className={`inline-flex items-center tabular-nums select-none tracking-tight leading-none ${className}`}
      aria-label={`${prefix}${formatted}`}
    >
      {prefix && (
        <span className="mr-1.5 select-none font-black leading-none inline-flex items-center">
          {prefix.trim()}
        </span>
      )}

      <span className="inline-flex items-center overflow-hidden leading-none">
        {items.map((item) => {
          if (item.type === 'symbol') {
            return (
              <span
                key={item.key}
                className="inline-flex items-center justify-center leading-none select-none font-black"
                style={{
                  width: item.value === ',' ? '0.28em' : '0.22em',
                  height: `${DIGIT_HEIGHT_EM}em`,
                }}
              >
                {item.value}
              </span>
            );
          }

          return (
            <RouletteDigitColumn
              key={item.key}
              columnId={item.key}
              targetDigit={item.value as number}
              staggerIndex={item.staggerIndex}
            />
          );
        })}
      </span>
    </span>
  );
};
