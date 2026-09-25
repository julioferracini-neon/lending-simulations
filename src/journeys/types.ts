import React from 'react';

export interface JourneyStepConfig {
  id: string;
  path: string;
  title?: string;
}

export interface JourneyDefinition<TState = any> {
  id: string;
  name: string;
  initialStep: string;
  steps: Record<string, JourneyStepConfig>;
  getCanonicalBackStep: (currentStep: string, state?: TState) => string | null;
  renderStep: (step: string, context: {
    state: TState;
    setState: (updater: Partial<TState> | ((prev: TState) => TState)) => void;
    onNavigate: (toStep: string, direction?: number) => void;
    onBack: () => void;
  }) => React.ReactNode;
}

