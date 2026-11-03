import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, Bell, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, lang } = useApp();

  return (
    <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-[60] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: lang === 'ar' ? -40 : 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                : toast.type === 'error'
                ? 'bg-rose-500/90 text-white border-rose-400/50'
                : toast.type === 'warning'
                ? 'bg-amber-500/90 text-slate-950 border-amber-400/50'
                : 'bg-slate-900/90 text-white border-slate-700/50'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-bold leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const NotificationDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, lang, navigateToView, setSelectedApp, apps } = useApp();

  if (!isOpen) return null;

  return (
    <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <span>{lang === 'fr' ? 'Notifications' : 'التنبيهات والأخبار'}</span>
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">{lang === 'fr' ? 'Aucune notification' : 'لا توجد تنبيهات حالياً'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => {
                  if (notif.targetAppId) {
                    const app = apps.find(a => a.id === notif.targetAppId);
                    if (app) navigateToView('app_detail', app);
                  }
                  onClose();
                }}
                className="w-full p-4 text-left rtl:text-right hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 group"
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  notif.type === 'update' ? 'bg-blue-500/10 text-blue-500' :
                  notif.type === 'alert' ? 'bg-rose-500/10 text-rose-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {notif.type === 'update' ? <Zap className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mb-0.5 line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {lang === 'fr' ? notif.titleFr : notif.titleAr}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {lang === 'fr' ? notif.messageFr : notif.messageAr}
                  </p>
                  <span className="text-[9px] text-slate-400 mt-1 block font-mono">
                    {new Date(notif.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'fr-FR')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lang === 'fr' ? 'Fin des notifications' : 'نهاية التنبيهات'}</p>
        </div>
      )}
    </div>
  );
};
