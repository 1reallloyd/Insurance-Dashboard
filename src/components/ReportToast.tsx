import React from 'react';
import { Check, X } from 'lucide-react';

interface ReportToastProps {
  message: string;
  subtext?: string;
  onClose: () => void;
}

export const ReportToast: React.FC<ReportToastProps> = ({ message, subtext, onClose }) => {
  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 glass-panel p-3.5 sm:p-4 rounded-xl border border-white/90 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
        <Check className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="text-xs font-bold text-slate-900 truncate">{message}</h5>
        {subtext && <p className="text-[10.5px] text-slate-500 truncate">{subtext}</p>}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
