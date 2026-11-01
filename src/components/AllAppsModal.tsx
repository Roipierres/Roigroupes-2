import React from 'react';
import { useApp } from '../context/AppContext';
import { AppGrid } from './AppGrid';
import { X, Grid } from 'lucide-react';

export const AllAppsModal: React.FC = () => {
  const { lang, t, isAllAppsModalOpen, setIsAllAppsModalOpen } = useApp();

  if (!isAllAppsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={() => setIsAllAppsModalOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[94vh] sm:max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {t.navAllApps}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {lang === 'fr' ? 'Toutes les applications disponibles' : 'جميع التطبيقات المتاحة في المتجر'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAllAppsModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
          <AppGrid isModal={true} />
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex justify-center shrink-0">
          <button
            onClick={() => setIsAllAppsModalOpen(false)}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
