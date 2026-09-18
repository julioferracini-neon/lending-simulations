/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MobileFrame } from './components/MobileFrame';
import { LoanSimulationScreen } from './components/LoanSimulationScreen';

export default function App() {
  return (
    <MobileFrame>
      <LoanSimulationScreen />
    </MobileFrame>
  );
}
