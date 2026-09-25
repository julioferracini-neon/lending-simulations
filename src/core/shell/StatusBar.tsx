import React from 'react';
import { Wifi, Signal, BatteryMedium } from 'lucide-react';

interface StatusBarProps {
  time?: string;
  showPunchHole?: boolean;
  textColor?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  time = '9:30',
  showPunchHole = true,
  textColor = 'text-slate-800',
}) => {
  return (
    <div
      className={`w-full px-6 pt-3 pb-1 flex items-center justify-between select-none pointer-events-none bg-transparent opacity-0 ${textColor}`}
      id="mobile-status-bar"
      aria-hidden="true"
    >
      {/* Time */}
      <span className="text-[13px] font-bold tracking-tight">{time}</span>

      {/* Center Camera Punch Hole (Android style) */}
      {showPunchHole ? (
        <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner" />
      ) : (
        <div className="w-3.5 h-3.5" />
      )}

      {/* Right Icons: Wifi, Signal, Battery */}
      <div className="flex items-center gap-1.5 opacity-90">
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <Signal className="w-3.5 h-3.5 stroke-[2.2]" />
        <BatteryMedium className="w-4 h-4 stroke-[2.2]" />
      </div>
    </div>
  );
};
