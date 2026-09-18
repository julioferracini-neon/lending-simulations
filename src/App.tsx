/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { MobileFrame } from './components/MobileFrame';
import { InputValueScreen } from './components/InputValueScreen';
import { LoanSimulationScreen } from './components/LoanSimulationScreen';

// Smooth ease-out curve for native mobile push transition
const SILKY_EASE_OUT = [0.16, 1, 0.3, 1] as const;

const screenPushVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-30%',
    opacity: 0.85,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.42,
      ease: SILKY_EASE_OUT,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-30%' : '100%',
    opacity: 0,
    transition: {
      duration: 0.36,
      ease: SILKY_EASE_OUT,
    },
  }),
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<'input_value' | 'simulation'>('input_value');
  const [loanAmount, setLoanAmount] = useState<number>(2000);
  const [direction, setDirection] = useState<number>(1);

  const handleContinueToSimulation = (amount: number) => {
    setLoanAmount(amount);
    setDirection(1);
    setCurrentStep('simulation');
  };

  const handleBackToInputValue = () => {
    setDirection(-1);
    setCurrentStep('input_value');
  };

  return (
    <MobileFrame>
      <div className="w-full flex-1 flex flex-col relative overflow-hidden bg-white">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          {currentStep === 'input_value' ? (
            <motion.div
              key="input_value"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1"
            >
              <InputValueScreen
                initialAmount={loanAmount}
                availableLimit={10000}
                onContinue={handleContinueToSimulation}
                onBack={handleBackToInputValue}
              />
            </motion.div>
          ) : (
            <motion.div
              key="simulation"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1"
            >
              <LoanSimulationScreen
                initialLoanAmount={loanAmount}
                onAmountChange={(newAmt) => setLoanAmount(newAmt)}
                onBack={handleBackToInputValue}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}

