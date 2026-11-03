import React from 'react';
import { useApp } from '../context/AppContext';
import { UserAccount } from '../types';
import { 
  X, 
  MessageSquare, 
  ShieldCheck, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserPublicProfileModalProps {
  user: UserAccount | null;
  onClose: () => void;
}

export const UserPublicProfileModal: React.FC<UserPublicProfileModalProps> = ({ user, onClose }) => {
  const { lang, openChatWithUser, currentUser } = useApp();

  if (!user) return null;

  const handleStartChat = () => {
    openChatWithUser(user.id);
    onClose();
  };

  const isSelf = currentUser?.id === user.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-amber-500/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Background Pattern */}
        <div className="relative h-24 bg-gradient-to-r from-amber-400 to-amber-600 dark:from-slate-800 dark:to-slate-950">
          <button 
            onClick={onClose}
            className="absolute top-4 ltr:right-4 rtl:left-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 -mt-12 relative text-center">
          <div className="inline-block relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-xl"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">{user.name}</h2>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 ${
              user.role === 'admin'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user.role === 'admin' ? (lang === 'fr' ? 'Administrateur' : 'مدير المنصة') : (lang === 'fr' ? 'Membre vérifié' : 'عضو موثق')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left rtl:text-right mt-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'fr' ? 'Membre depuis' : 'تاريخ الانضمام'}</p>
                <p className="text-xs font-black text-slate-700 dark:text-slate-300">{user.joinedDate}</p>
              </div>
            </div>

            {user.bio && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'fr' ? 'À propos' : 'نبذة تعريفية'}</p>
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {!isSelf && currentUser && (
              <button
                onClick={handleStartChat}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{lang === 'fr' ? 'Démarrer une discussion' : 'بدء محادثة فورية'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-black rounded-2xl transition-all cursor-pointer"
            >
              {lang === 'fr' ? 'Fermer' : 'إغلاق'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
