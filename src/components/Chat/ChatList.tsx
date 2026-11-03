import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Search, X, User, ShieldCheck, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatListProps {
  onSelectUser: (userId: string) => void;
  onClose: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectUser, onClose }) => {
  const { users, currentUser, lang, messages } = useApp();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const getUnreadCount = (userId: string) => {
    return messages.filter(m => m.senderId === userId && m.receiverId === currentUser?.id && !m.isRead).length;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          <span>{lang === 'fr' ? 'Membres' : 'الأعضاء'}</span>
        </h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher un membre...' : 'ابحث عن عضو...'}
            className="w-full ltr:pl-9 rtl:pr-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-amber-500/50 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 opacity-50">
            <User className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-xs">{lang === 'fr' ? 'Aucun membre trouvé' : 'لم يتم العثور على أعضاء'}</p>
          </div>
        ) : (
          filteredUsers.map(user => {
            const unread = getUnreadCount(user.id);
            return (
              <div
                key={user.id}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group border border-transparent hover:border-amber-500/20"
              >
                <button 
                  onClick={() => onSelectUser(user.id)}
                  className="flex flex-1 items-center gap-3 text-left rtl:text-right cursor-pointer min-w-0"
                >
                  <div className="relative shrink-0">
                    <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-amber-500/50 transition-colors" alt="" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</h4>
                      {unread > 0 && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full animate-pulse shadow-sm shadow-rose-500/20">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
                      {user.role === 'admin' ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-amber-500" />
                          <span className="text-amber-600 dark:text-amber-400">{lang === 'fr' ? 'Admin' : 'مدير'}</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" />
                          <span>{lang === 'fr' ? 'Membre' : 'عضو'}</span>
                        </>
                      )}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  {user.phone && (
                    <a 
                      href={`tel:${user.phone}`}
                      className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      title={lang === 'fr' ? 'Appeler' : 'اتصال مباشر'}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => onSelectUser(user.id)}
                    className="p-2 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 transform translate-x-1 group-hover:translate-x-0 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
