import React from 'react';
import { Wifi } from 'lucide-react';

interface StatusBarProps {
  time?: string;
  showPunchHole?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  time = '9:30',
  showPunchHole = true,
}) => {
  return (
    <div
      className="w-full px-6 pt-3 pb-2 flex items-center justify-between text-slate-900 select-none text-xs font-semibold"
      id="mobile-status-bar"
    >
      {/* Time */}
      <span className="font-semibold text-[13px] tracking-tight text-slate-800">
        {time}
      </span>

      {/* Front Camera Punch Hole */}
      {showPunchHole && (
        <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner" />
      )}

      {/* System Icons (Cellular, Wifi, Battery) */}
      <div className="flex items-center gap-1.5 text-slate-800">
        {/* Cellular signal */}
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7 0 1.55-.51 2.98-1.37 4.14L12 19.34l-5.63-3.2C5.51 14.98 5 13.55 5 12c0-3.87 3.13-7 7-7z" opacity="0.3" />
          <path d="M12 6c-3.31 0-6 2.69-6 6 0 1.29.41 2.49 1.1 3.48L12 18.5l4.9-3.02C17.59 14.49 18 13.29 18 12c0-3.31-2.69-6-6-6z" opacity="0.6" />
          <path d="M12 9c-1.66 0-3 1.34-3 3 0 .64.21 1.23.56 1.72L12 15.5l2.44-1.78c.35-.49.56-1.08.56-1.72 0-1.66-1.34-3-3-3z" />
        </svg>

        {/* WiFi */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />

        {/* Battery */}
        <div className="flex items-center">
          <div className="w-5 h-2.5 rounded-[3px] border-[1.5px] border-slate-800 p-[1px] flex items-center">
            <div className="w-full h-full bg-slate-800 rounded-[1px]" />
          </div>
          <div className="w-[1.5px] h-1 bg-slate-800 rounded-r-xs -ml-[0.5px]" />
        </div>
      </div>
    </div>
  );
};
