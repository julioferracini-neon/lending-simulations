/**
 * Utility for haptic vibration feedback using the Web Navigator Vibrate API.
 * Provides tactile native-like responses on mobile devices for navigation and interaction.
 */

export const isVibrationSupported = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    typeof navigator.vibrate === 'function'
  );
};

/**
 * Triggers a custom vibration pattern safely.
 * Returns true if vibration was triggered, false otherwise.
 */
export const triggerHaptic = (pattern: number | number[] = 15): boolean => {
  if (!isVibrationSupported()) {
    return false;
  }

  try {
    return navigator.vibrate(pattern);
  } catch {
    // Graceful fallback if vibration permission is restricted or blocked
    return false;
  }
};

/**
 * Light haptic tap (~10ms)
 * Ideal for secondary actions, back buttons, close buttons, modal dismissals, and subtle controls.
 */
export const hapticLight = (): boolean => triggerHaptic(10);

/**
 * Medium haptic tap (~18ms)
 * Ideal for primary navigation buttons (e.g. "Continuar", "Simular", "Avançar", step transitions).
 */
export const hapticMedium = (): boolean => triggerHaptic(18);

/**
 * Heavy/firm haptic tap (~30ms)
 * Ideal for critical navigation and commitment actions (e.g. "Contratar empréstimo", "Concluir").
 */
export const hapticHeavy = (): boolean => triggerHaptic(30);

/**
 * Selection tick (~8ms)
 * Ideal for sliders, segment pickers, and option selection.
 */
export const hapticSelection = (): boolean => triggerHaptic(8);

/**
 * Success celebratory pulse sequence [15ms, 50ms pause, 25ms]
 * Ideal for flow completion, PIN verification success, and confirmation screens.
 */
export const hapticSuccess = (): boolean => triggerHaptic([15, 50, 25]);

/**
 * Warning/Alert pulse sequence [25ms, 40ms pause, 25ms]
 * Ideal for limit warnings, error alerts, and destructive confirmation prompts.
 */
export const hapticWarning = (): boolean => triggerHaptic([25, 40, 25]);
