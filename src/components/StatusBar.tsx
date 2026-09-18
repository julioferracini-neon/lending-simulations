import React from 'react';

interface StatusBarProps {
  time?: string;
  showPunchHole?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = () => {
  return (
    <div
      className="w-full px-6 pt-3 pb-2 h-10 select-none pointer-events-none"
      id="mobile-status-bar"
      aria-hidden="true"
    />
  );
};

