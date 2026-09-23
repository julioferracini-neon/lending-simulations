const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Add imports for baseline components
appContent = appContent.replace(
  "import { InputValueScreen } from './components/InputValueScreen';",
  "import { InputValueScreen } from './components/InputValueScreen';\nimport { BaselineInputValueScreen } from './components/BaselineInputValueScreen';\nimport { BaselineLoanSimulationScreen } from './components/BaselineLoanSimulationScreen';\nimport { BaselineLoanHubScreen } from './components/BaselineLoanHubScreen';\nimport { BaselineSummaryScreen } from './components/BaselineSummaryScreen';"
);

// Add handlers
const handlersInsertion = `
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
    setDirection(1);
    setCurrentStep('baseline_loan_hub');
  };

  const handleBaselineSelectPersonalLoan = () => {
    hapticMedium();
    setDirection(1);
    setCurrentStep('baseline_input_value');
  };

  const handleBaselineBackToProducts = () => {
    hapticLight();
    setDirection(-1);
    setCurrentStep('baseline_products');
  };

  const handleBaselineContinueToSimulation = (amount: number) => {
    hapticMedium();
    setSessionAmount(amount);
    setLoanAmount(amount);
    setDirection(1);
    setCurrentStep('baseline_simulation');
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
`;

appContent = appContent.replace(
  "return (",
  handlersInsertion + "\n  return ("
);

// Add JSX views
const jsxInsertion = `
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
              <GlobalHomeScreen onSelectProducts={handleBaselineSelectProducts} />
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
                onContinue={handleBaselineContinueToSimulation}
                onBack={handleBaselineBackToInputValue}
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
              <SuccessScreen onFinish={handleBaselineFinishSuccess} />
            </motion.div>
          )}
`;

appContent = appContent.replace(
  "</AnimatePresence>",
  jsxInsertion + "\n        </AnimatePresence>"
);

appContent = appContent.replace(
  "<PortalScreen onNavigateHome={handleSelectGlobalHomeFromPortal} />",
  "<PortalScreen \n                onNavigateHome={handleSelectGlobalHomeFromPortal} \n                onNavigateBaseline={handleSelectBaselineGlobalHome}\n              />"
);

fs.writeFileSync('src/App.tsx', appContent);
