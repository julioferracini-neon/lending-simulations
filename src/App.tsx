/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { MobileFrame } from './components/MobileFrame';
import { PortalScreen } from './components/PortalScreen';
import {
  LoanHubScreen,
  InputValueScreen,
  BaselineInputValueScreen,
  BaselineLoanSimulationScreen,
  BaselineLoanHubScreen,
  BaselineSummaryScreen,
  LoanSimulationScreen,
  type LoanSimulationData,
  ProposalLoadingScreen,
  SummaryScreen,
  SuccessScreen,
  BaselineSuccessScreen,
  ProductsScreen,
  GlobalHomeScreen,
  SurfacePlaceholderScreen,
  type SurfaceTab,
} from './journeys/emprestimo-neon';
import { hapticLight, hapticMedium, hapticSuccess } from './utils/haptics';

import { FlowStep } from './router/steps';
import { getInitialFlowState, useUrlSyncedFlow } from './router/useUrlSyncedFlow';
import { EntrySource } from './router/types';

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
  const initial = getInitialFlowState();
  const [currentStep, setCurrentStep] = useState<FlowStep>(() => initial.step);
  const [sessionAmount, setSessionAmount] = useState<number | null>(() => initial.sessionAmount);
  const [loanAmount, setLoanAmount] = useState<number>(() => initial.loanAmount);
  const [simulationData, setSimulationData] = useState<LoanSimulationData | null>(() => initial.simulationData);
  const [direction, setDirection] = useState<number>(() => initial.direction);
  const [source, setSource] = useState<EntrySource>(() => initial.source);

  useUrlSyncedFlow({
    step: currentStep,
    setStep: setCurrentStep,
    source,
    setSource,
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

  const handleSelectSurfaceTab = (tab: SurfaceTab) => {
    hapticMedium();
    setDirection(1);
    if (tab === 'cartao') setCurrentStep('surface_cartao');
    else if (tab === 'pix') setCurrentStep('surface_pix');
    else if (tab === 'investir') setCurrentStep('surface_investir');
  };

  const handleSelectLoansFromProducts = () => {
    hapticMedium();
    setSource('products');
    setDirection(1);
    setCurrentStep('loan_hub');
  };

  const handleSelectLoansFromHome = () => {
    hapticMedium();
    setSource('home');
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
    if (source === 'home') {
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
    setCurrentStep('summary');
  };

  const handleContractFromSummary = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('proposal_loading');
  };

  const handleLoadingComplete = () => {
    hapticSuccess();
    setDirection(1);
    setCurrentStep('success');
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
    setCurrentStep('global_home');
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

  const handleBaselineSelectSurfaceTab = (tab: SurfaceTab) => {
    hapticMedium();
    setDirection(1);
    if (tab === 'cartao') setCurrentStep('baseline_surface_cartao');
    else if (tab === 'pix') setCurrentStep('baseline_surface_pix');
    else if (tab === 'investir') setCurrentStep('baseline_surface_investir');
  };

  const handleBaselineSelectLoansFromProducts = () => {
    hapticMedium();
    setSource('products');
    setDirection(1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineSelectLoansFromHome = () => {
    hapticMedium();
    setSource('home');
    setDirection(1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineBackToSource = () => {
    hapticLight();
    setDirection(-1);
    if (source === 'home') {
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
    setCurrentStep('baseline_summary');
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
    setCurrentStep('baseline_summary');
  };

  const handleBaselineContractFromSummary = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('baseline_proposal_loading');
  };

  const handleBaselineLoadingComplete = () => {
    hapticSuccess();
    setDirection(1);
    setCurrentStep('baseline_success');
  };

  const handleBaselineBackFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineEditAmountFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineEditSimulationFromSummary = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_input_value');
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
    setCurrentStep('baseline_global_home');
  };

  const handleBaselineRestart = () => {
    hapticLight();
    setDirection(-1);
    if (source === 'home') {
      setCurrentStep('baseline_global_home');
    } else {
      setCurrentStep('baseline_products');
    }
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
                onSelectTab={handleSelectSurfaceTab}
              />
            </motion.div>
          )}

          {(currentStep === 'surface_cartao' || currentStep === 'surface_pix' || currentStep === 'surface_investir') && (
            <motion.div
              key={currentStep}
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <SurfacePlaceholderScreen
                tab={currentStep === 'surface_cartao' ? 'cartao' : currentStep === 'surface_pix' ? 'pix' : 'investir'}
                onSelectHome={handleSelectHome}
                onSelectProducts={handleSelectProducts}
                onSelectTab={handleSelectSurfaceTab}
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
              <ProductsScreen 
                onSelectLoans={handleSelectLoansFromProducts} 
                onSelectHome={handleSelectHome} 
                onSelectTab={handleSelectSurfaceTab}
              />
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
                onContract={handleContractFromSummary}
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
                onSelectTab={handleBaselineSelectSurfaceTab}
              />
            </motion.div>
          )}

          {(currentStep === 'baseline_surface_cartao' || currentStep === 'baseline_surface_pix' || currentStep === 'baseline_surface_investir') && (
            <motion.div
              key={currentStep}
              custom={direction}
              variants={screenPushVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 z-0 bg-white"
            >
              <SurfacePlaceholderScreen
                tab={currentStep === 'baseline_surface_cartao' ? 'cartao' : currentStep === 'baseline_surface_pix' ? 'pix' : 'investir'}
                onSelectHome={handleBaselineSelectHome}
                onSelectProducts={handleBaselineSelectProducts}
                onSelectTab={handleBaselineSelectSurfaceTab}
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
              <ProductsScreen 
                onSelectLoans={handleBaselineSelectLoansFromProducts} 
                onSelectHome={handleBaselineSelectHome} 
                onSelectTab={handleBaselineSelectSurfaceTab}
              />
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
                onSelectPersonalLoan={handleBaselineSelectLoansFromProducts}
                onBack={handleBaselineBackToSource}
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
                onContract={handleBaselineContractFromSummary}
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

