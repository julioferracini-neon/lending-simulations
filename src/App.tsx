/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { MobileFrame } from './components/MobileFrame';
import { LoanHubScreen } from './components/LoanHubScreen';
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
  const [currentStep, setCurrentStep] = useState<'loan_hub' | 'input_value' | 'simulation'>('loan_hub');
  // Starts empty (null) on first visit; persists once the user enters an amount in this session
  const [sessionAmount, setSessionAmount] = useState<number | null>(null);
  const [loanAmount, setLoanAmount] = useState<number>(2000);
  const [direction, setDirection] = useState<number>(1);

  const handleSelectPersonalLoan = () => {
    setDirection(1);
    setCurrentStep('input_value');
  };

  const handleBackToLoanHub = () => {
    setDirection(-1);
    setCurrentStep('loan_hub');
  };

  const handleContinueToSimulation = (amount: number) => {
    setSessionAmount(amount);
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
      <div className="w-full flex-1 min-h-0 flex flex-col relative overflow-hidden bg-white">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          {currentStep === 'loan_hub' ? (
            <motion.div
              key="loan_hub"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <LoanHubScreen
                maxPersonalLimit={10000}
                onSelectPersonalLoan={handleSelectPersonalLoan}
                onBack={handleBackToLoanHub}
              />
            </motion.div>
          ) : currentStep === 'input_value' ? (
            <motion.div
              key="input_value"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <InputValueScreen
                initialAmount={sessionAmount}
                availableLimit={10000}
                onContinue={handleContinueToSimulation}
                onBack={handleBackToLoanHub}
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
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <LoanSimulationScreen
                initialLoanAmount={loanAmount}
                onAmountChange={(newAmt) => {
                  setLoanAmount(newAmt);
                  setSessionAmount(newAmt);
                }}
                onBack={handleBackToInputValue}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}

