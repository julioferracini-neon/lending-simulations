/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { MobileFrame } from './components/MobileFrame';
import { LoanHubScreen } from './components/LoanHubScreen';
import { InputValueScreen } from './components/InputValueScreen';
import { LoanSimulationScreen, type LoanSimulationData } from './components/LoanSimulationScreen';
import { ProposalLoadingScreen } from './components/ProposalLoadingScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { hapticLight, hapticMedium, hapticSuccess } from './utils/haptics';

import { FlowStep } from './router/steps';
import { getInitialFlowState, useUrlSyncedFlow } from './router/useUrlSyncedFlow';

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
  const [currentStep, setCurrentStep] = useState<FlowStep>(() => getInitialFlowState().step);
  const [sessionAmount, setSessionAmount] = useState<number | null>(() => getInitialFlowState().sessionAmount);
  const [loanAmount, setLoanAmount] = useState<number>(() => getInitialFlowState().loanAmount);
  const [simulationData, setSimulationData] = useState<LoanSimulationData | null>(() => getInitialFlowState().simulationData);
  const [direction, setDirection] = useState<number>(() => getInitialFlowState().direction);

  useUrlSyncedFlow({
    step: currentStep,
    setStep: setCurrentStep,
    sessionAmount,
    setSessionAmount,
    loanAmount,
    setLoanAmount,
    simulationData,
    setSimulationData,
    direction,
    setDirection,
  });

  const handleSelectLoansFromProducts = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('loan_hub');
  };

  const handleSelectPersonalLoan = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('input_value');
  };

  const handleBackToProducts = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('products');
  };

  const handleContinueToSimulation = (amount: number) => {
    hapticMedium();
    setSessionAmount(amount);
    setLoanAmount(amount);
    setDirection(1);
    setCurrentStep('simulation');
  };

  const handleBackToInputValue = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('input_value');
  };

  const handleContinueProposal = (data: LoanSimulationData) => {
    hapticMedium();
    setSimulationData(data);
    setDirection(1);
    setCurrentStep('proposal_loading');
  };

  const handleLoadingComplete = () => {
    hapticSuccess();
    setDirection(1);
    setCurrentStep('summary');
  };

  const handleBackFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('simulation');
  };

  const handleEditAmountFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('input_value');
  };

  const handleEditSimulationFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('simulation');
  };

  const handleSuccess = () => {
    hapticSuccess();
    setDirection(1);
    setCurrentStep('success');
  };

  const handleFinishSuccess = () => {
    hapticMedium();
    // Reset the full flow
    setSessionAmount(null);
    setLoanAmount(2000);
    setSimulationData(null);
    setDirection(-1);
    setCurrentStep('products');
  };

  const handleRestart = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('products');
  };

  return (
    <MobileFrame statusBarBg="bg-transparent">
      <div className="w-full flex-1 min-h-0 flex flex-col relative overflow-hidden bg-[#f0f6fc]">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          {currentStep === 'products' ? (
            <motion.div
              key="products"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <ProductsScreen onSelectLoans={handleSelectLoansFromProducts} />
            </motion.div>
          ) : currentStep === 'loan_hub' ? (
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
                onBack={handleBackToProducts}
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
                onBack={() => {
                  setDirection(-1);
                  setCurrentStep('loan_hub');
                }}
              />
            </motion.div>
          ) : currentStep === 'simulation' ? (
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
                initialInstallments={simulationData?.installments}
                initialFirstDueDate={simulationData?.firstDueDate}
                onAmountChange={(newAmt) => {
                  setLoanAmount(newAmt);
                  setSessionAmount(newAmt);
                }}
                onBack={handleBackToInputValue}
                onContinueProposal={handleContinueProposal}
              />
            </motion.div>
          ) : currentStep === 'proposal_loading' ? (
            <motion.div
              key="proposal_loading"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <ProposalLoadingScreen onComplete={handleLoadingComplete} />
            </motion.div>
          ) : currentStep === 'summary' ? (
            <motion.div
              key="summary"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <SummaryScreen
                loanAmount={loanAmount}
                simulationData={simulationData}
                onBack={handleBackFromSummary}
                onRestart={handleRestart}
                onEditAmount={handleEditAmountFromSummary}
                onEditInstallments={handleEditSimulationFromSummary}
                onEditDueDate={handleEditSimulationFromSummary}
                onContract={handleSuccess}
              />
            </motion.div>
          ) : (
            <motion.div
              key="success"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <SuccessScreen onFinish={handleFinishSuccess} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}

