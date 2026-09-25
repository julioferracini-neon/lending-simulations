import React, { useState } from 'react';
import { Smartphone, Monitor, RotateCcw, Sparkles } from 'lucide-react';
import { StatusBar } from './StatusBar';

interface MobileFrameProps {
  children: React.ReactNode;
  statusBarBg?: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, statusBarBg = 'bg-transparent' }) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start sm:py-6 p-0">
      {/* Top Device Bar for Desktop Preview */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-4 px-4 py-2 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200">Figma Live Preview</span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Celular</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('responsive')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'responsive'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Fluido</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          viewMode === 'mobile'
            ? 'max-w-[412px] sm:h-[844px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl sm:shadow-black/70 overflow-hidden'
            : 'max-w-xl sm:h-[844px] sm:rounded-3xl sm:border sm:border-slate-800 shadow-xl overflow-hidden'
        } bg-white flex flex-col relative h-[100dvh]`}
      >
        {/* Native Android Status Bar */}
        <div className={`absolute top-0 inset-x-0 z-50 ${statusBarBg} transition-colors duration-300 pointer-events-none`}>
          <StatusBar time="9:30" showPunchHole={viewMode === 'mobile'} />
        </div>

        {/* Screen Content with min-h-0 so internal overflow-y-auto functions correctly */}
        <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
          {children}
        </div>

        {/* Bottom Home Indicator Bar (Android/iOS style) */}
        <div className="w-full py-2 bg-white flex justify-center items-center shrink-0">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
