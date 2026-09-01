import React from 'react';
import {
  Smartphone,
  X,
  AlertOctagon,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast, parentPhone, setActiveTab } = useApp();

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-950/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-blue-400/40 ring-4 ring-blue-500/10">
        {/* iOS/Android Style SMS Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                Incoming Parent SMS Alert
              </span>
              <span className="text-xs font-semibold text-slate-200">
                To: {parentPhone}
              </span>
            </div>
          </div>
          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Body */}
        <div className="py-3 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 border border-rose-500/30">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              Screen Time Limit Exceeded!
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeToast.message}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-blue-300">
              <span className="bg-blue-900/60 px-2 py-0.5 rounded-md border border-blue-700/50">
                App: {activeToast.platform}
              </span>
              <span className="bg-rose-900/60 px-2 py-0.5 rounded-md border border-rose-700/50 text-rose-200 font-medium">
                {activeToast.timeSpentMinutes}m spent / {activeToast.limitMinutes}m limit
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              dismissToast();
              setActiveTab('timelimits');
            }}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Adjust Limits & Lock Device
          </button>
          <button
            onClick={() => {
              dismissToast();
              setActiveTab('history');
            }}
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            View History <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
