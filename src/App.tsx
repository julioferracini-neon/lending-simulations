/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { MobileFrame } from './components/MobileFrame';
import { LoanHubScreen } from './components/LoanHubScreen';
import { InputValueScreen } from './components/InputValueScreen';
import { BaselineInputValueScreen } from './components/BaselineInputValueScreen';
import { BaselineLoanSimulationScreen } from './components/BaselineLoanSimulationScreen';
import { BaselineLoanHubScreen } from './components/BaselineLoanHubScreen';
import { BaselineSummaryScreen } from './components/BaselineSummaryScreen';
import { LoanSimulationScreen, type LoanSimulationData } from './components/LoanSimulationScreen';
import { ProposalLoadingScreen } from './components/ProposalLoadingScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { BaselineSuccessScreen } from './components/BaselineSuccessScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { GlobalHomeScreen } from './components/GlobalHomeScreen';
import { PortalScreen } from './components/PortalScreen';
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
  
  const [baselineInputSource, setBaselineInputSource] = useState<'home' | 'products'>('products');
  const [inputSource, setInputSource] = useState<'home' | 'products'>('products');

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

  const handleSelectGlobalHomeFromPortal = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('global_home');
  };

  const handleSelectProducts = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('products');
  };

  const handleSelectHome = () => {
    hapticMedium();
    setDirection(-1);
    setCurrentStep('global_home');
  };

  const handleSelectLoansFromProducts = () => {
    hapticMedium();
    setInputSource('products');
    setDirection(1);
    setCurrentStep('loan_hub');
  };

  const handleSelectLoansFromHome = () => {
    hapticMedium();
    setInputSource('home');
    setDirection(1);
    setCurrentStep('loan_hub');
  };

  const handleSelectPersonalLoan = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('input_value');
  };

  const handleBackToSource = () => {
    hapticLight();
    setDirection(-1);
    if (inputSource === 'home') {
      setCurrentStep('global_home');
    } else {
      setCurrentStep('products');
    }
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

  
  // --- BASELINE HANDLERS ---
  const handleSelectBaselineGlobalHome = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('baseline_global_home');
  };

  const handleBaselineSelectProducts = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('baseline_products');
  };

  const handleBaselineSelectHome = () => {
    hapticMedium();
    setDirection(-1);
    setCurrentStep('baseline_global_home');
  };

  const handleBaselineSelectLoansFromProducts = () => {
    hapticMedium();
    setBaselineInputSource('products');
    setDirection(1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineSelectLoansFromHome = () => {
    hapticMedium();
    setBaselineInputSource('home');
    setDirection(1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineBackToSource = () => {
    hapticLight();
    setDirection(-1);
    if (baselineInputSource === 'home') {
      setCurrentStep('baseline_global_home');
    } else {
      setCurrentStep('baseline_products');
    }
  };

  const handleBaselineContinueFromInputValue = (data: LoanSimulationData) => {
    hapticMedium();
    setSessionAmount(data.loanAmount);
    setLoanAmount(data.loanAmount);
    setSimulationData(data);
    setDirection(1);
    setCurrentStep('baseline_proposal_loading');
  };

  const handleBaselineBackToInputValue = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineContinueProposal = (data: LoanSimulationData) => {
    hapticMedium();
    setSimulationData(data);
    setDirection(1);
    setCurrentStep('baseline_proposal_loading');
  };

  const handleBaselineLoadingComplete = () => {
    hapticSuccess();
    setDirection(1);
    setCurrentStep('baseline_summary');
  };

  const handleBaselineBackFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_simulation');
  };

  const handleBaselineEditAmountFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineEditSimulationFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_simulation');
  };

  const handleBaselineSuccess = () => {
    hapticSuccess();
    setDirection(1);
    setCurrentStep('baseline_success');
  };

  const handleBaselineFinishSuccess = () => {
    hapticMedium();
    setSessionAmount(null);
    setLoanAmount(2000);
    setSimulationData(null);
    setDirection(-1);
    setCurrentStep('baseline_products');
  };

  const handleBaselineRestart = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_products');
  };

  return (
    <MobileFrame statusBarBg="bg-transparent">
      <div className="w-full flex-1 min-h-0 flex flex-col relative overflow-hidden bg-[#f0f6fc]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {currentStep === 'portal' && (
            <motion.div
              key="portal"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <PortalScreen 
                onNavigateHome={handleSelectGlobalHomeFromPortal} 
                onNavigateBaseline={handleSelectBaselineGlobalHome}
              />
            </motion.div>
          )}

          {currentStep === 'global_home' && (
            <motion.div
              key="global_home"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <GlobalHomeScreen 
                onSelectProducts={handleSelectProducts} 
                onSelectLoan={handleSelectLoansFromHome} 
              />
            </motion.div>
          )}

          {currentStep === 'products' && (
            <motion.div
              key="products"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <ProductsScreen onSelectLoans={handleSelectLoansFromProducts} onSelectHome={handleSelectHome} />
            </motion.div>
          )}

          {currentStep === 'loan_hub' && (
            <motion.div
              key="loan_hub"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <LoanHubScreen
                maxPersonalLimit={10000}
                onSelectPersonalLoan={handleSelectPersonalLoan}
                onBack={handleBackToSource}
              />
            </motion.div>
          )}
          
          {currentStep === 'input_value' && (
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
          )}

          {currentStep === 'simulation' && (
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
          )}

          {currentStep === 'proposal_loading' && (
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
          )}

          {currentStep === 'summary' && (
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
          )}

          {currentStep === 'success' && (
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
        
          {/* --- BASELINE FLOW --- */}
          {currentStep === 'baseline_global_home' && (
            <motion.div
              key="baseline_global_home"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <GlobalHomeScreen 
                onSelectProducts={handleBaselineSelectProducts} 
                onSelectLoan={handleBaselineSelectLoansFromHome} 
              />
            </motion.div>
          )}

          {currentStep === 'baseline_products' && (
            <motion.div
              key="baseline_products"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <ProductsScreen onSelectLoans={handleBaselineSelectLoansFromProducts} onSelectHome={handleBaselineSelectHome} />
            </motion.div>
          )}

          {currentStep === 'baseline_loan_hub' && (
            <motion.div
              key="baseline_loan_hub"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <BaselineLoanHubScreen
                maxPersonalLimit={10000}
                onSelectPersonalLoan={handleBaselineSelectPersonalLoan}
                onBack={handleBaselineBackToProducts}
              />
            </motion.div>
          )}
          
          {currentStep === 'baseline_input_value' && (
            <motion.div
              key="baseline_input_value"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <BaselineInputValueScreen
                initialAmount={sessionAmount}
                availableLimit={10000}
                onContinue={handleBaselineContinueFromInputValue}
                onBack={handleBaselineBackToSource}
              />
            </motion.div>
          )}

          {currentStep === 'baseline_simulation' && (
            <motion.div
              key="baseline_simulation"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <BaselineLoanSimulationScreen
                initialLoanAmount={loanAmount}
                initialInstallments={simulationData?.installments}
                initialFirstDueDate={simulationData?.firstDueDate}
                onAmountChange={(newAmt) => {
                  setLoanAmount(newAmt);
                  setSessionAmount(newAmt);
                }}
                onBack={handleBaselineBackToInputValue}
                onContinueProposal={handleBaselineContinueProposal}
              />
            </motion.div>
          )}

          {currentStep === 'baseline_proposal_loading' && (
            <motion.div
              key="baseline_proposal_loading"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <ProposalLoadingScreen onComplete={handleBaselineLoadingComplete} />
            </motion.div>
          )}

          {currentStep === 'baseline_summary' && (
            <motion.div
              key="baseline_summary"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <BaselineSummaryScreen
                loanAmount={loanAmount}
                simulationData={simulationData}
                onBack={handleBaselineBackFromSummary}
                onRestart={handleBaselineRestart}
                onEditAmount={handleBaselineEditAmountFromSummary}
                onEditInstallments={handleBaselineEditSimulationFromSummary}
                onEditDueDate={handleBaselineEditSimulationFromSummary}
                onContract={handleBaselineSuccess}
              />
            </motion.div>
          )}

          {currentStep === 'baseline_success' && (
            <motion.div
              key="baseline_success"
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col flex-1 min-h-0 overflow-hidden"
            >
              <BaselineSuccessScreen 
                loanAmount={loanAmount}
                simulationData={simulationData}
                onFinish={handleBaselineFinishSuccess} 
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}

