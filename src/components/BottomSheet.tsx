import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxHeightClass?: string;
  id?: string;
  noPadding?: boolean;
}

const SHEET_EASING = [0.32, 0.72, 0, 1] as const;

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxHeightClass = 'max-h-[88vh]',
  id,
  noPadding = false,
}) => {
  // Prevent body scrolling when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop with smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Bottom Sheet Panel */}
          <motion.div
            id={id}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.32,
              ease: SHEET_EASING,
            }}
            className={`relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl z-10 flex flex-col border-t border-slate-100/80 overflow-hidden ${maxHeightClass}`}
          >
            {/* Top Handle Drag Pill */}
            <div className="pt-3 pb-1 flex justify-center shrink-0 cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full hover:bg-slate-300 transition-colors" />
            </div>

            {/* Optional Header */}
            {(title || icon) && (
              <div className="px-6 py-3.5 flex items-center justify-between border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      {icon}
                    </div>
                  )}
                  <div>
                    {title && <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>}
                    {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Scrollable Sheet Body */}
            <div className={`flex-1 overflow-y-auto ${noPadding ? '' : 'px-6 py-4'}`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
