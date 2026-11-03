import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Megaphone,
  User,
  UserCheck,
  LogOut,
  Globe,
  Sun,
  Moon,
  LayoutDashboard,
  ShieldCheck,
  X,
  LogIn,
  Edit3,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatList } from './Chat/ChatList';
import { MemberChat } from './Chat/MemberChat';

export const FloatingActions: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    siteSettings,
    setIsAIAssistantModalOpen,
    setIsFloatingAdsOpen,
    currentUser,
    logout,
    navigateToView,
    setIsAuthModalOpen,
    messages,
    isChatOpen,
    setIsChatOpen,
    activeChatUserId,
    setActiveChatUserId,
    ensureUserSession
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const whatsappNumber = siteSettings.whatsappNumber || "+213797152590";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '').replace(/\s+/g, '')}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        // setIsChatOpen(false); // Don't close chat on outside click to prevent accidental closure during typing
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadMessagesCount = messages.filter(m => m.receiverId === currentUser?.id && !m.isRead).length;

  const isManager = currentUser && (
    currentUser.role === 'admin' ||
    currentUser.id === 'user-admin' ||
    currentUser.email === 'bahrinho93@gmail.com' ||
    currentUser.email === 'manager@roigroupes.com'
  );

  return (
    <div className="fixed bottom-4 sm:bottom-6 ltr:right-3 sm:ltr:right-5 rtl:left-3 sm:rtl:left-5 flex flex-col items-center gap-2.5 z-50 pointer-events-none">
      {/* Floating Profile Access Popover Menu */}
      <div className="relative pointer-events-auto" ref={popoverRef}>
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-14 ltr:right-0 rtl:left-0 w-72 sm:w-80 bg-white dark:bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-5 shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
            >
              {/* Header Close */}
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'fr' ? 'Mon Compte' : 'حسابي الشخصي'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {currentUser ? (
                <div className="space-y-4">
                  {/* User Profile Summary Card */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <img
                      src={currentUser.avatar || 'https://ui-avatars.com/api/?name=User'}
                      alt={currentUser.name}
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-500/40 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                        {currentUser.email}
                      </p>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        isManager
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{isManager ? (lang === 'fr' ? 'Manager' : 'مدير الإدارة') : (lang === 'fr' ? 'Membre' : 'عضو موثق')}</span>
                      </span>
                    </div>
                  </div>

                  {/* Profile Edit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      navigateToView('profile_settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-slate-950 font-black text-xs rounded-xl border border-amber-500/30 transition-all flex items-center justify-between cursor-pointer group shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-500 group-hover:text-slate-950" />
                      <span>{lang === 'fr' ? 'Modifier mon profil' : 'تعديل البروفيل الشخصي'}</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-60">←</span>
                  </button>

                  {/* Manager Dashboard Shortcut */}
                  {isManager && (
                    <button
                      type="button"
                      onClick={() => {
                        navigateToView('admin');
                        setIsProfileOpen(false);
                      }}
                      className="w-full py-2.5 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-amber-500 text-white hover:text-slate-950 font-black text-xs rounded-xl border border-amber-500/30 transition-all flex items-center justify-between cursor-pointer group shadow-xs"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-amber-500 group-hover:text-slate-950" />
                        <span>{lang === 'fr' ? 'Espace de Gestion' : 'لوحة إدارة المنصة'}</span>
                      </span>
                      <span className="text-[10px] font-mono opacity-60">←</span>
                    </button>
                  )}

                  {/* Preferences: Language + Theme Controls */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {lang === 'fr' ? 'Préférences' : 'تفضيلات الواجهة'}
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Theme Toggle Button */}
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            <span>{lang === 'fr' ? 'Jour' : 'نهاري'}</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{lang === 'fr' ? 'Nuit' : 'ليلي'}</span>
                          </>
                        )}
                      </button>

                      {/* Language Switcher */}
                      <button
                        type="button"
                        onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
                        className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        <Globe className="w-3.5 h-3.5 text-amber-500" />
                        <span>{lang === 'ar' ? 'Français' : 'العربية'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white font-black text-xs rounded-xl border border-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{lang === 'fr' ? 'Se déconnecter' : 'تسجيل الخروج من الحساب'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest View inside Profile Popover */
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {lang === 'fr' ? 'Bienvenue Visiteur' : 'مرحباً بك زائرنا العزيز'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {lang === 'fr' ? 'Connectez-vous pour profiter de toutes les fonctionnalités.' : 'سجل الدخول لإدارة حسابك وتحميل التطبيقات المباشرة.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{lang === 'fr' ? 'Se connecter / S\'inscrire' : 'تسجيل الدخول / حساب جديد'}</span>
                  </button>

                  {/* Preferences for Guests */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="py-2 px-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                      <span>{theme === 'dark' ? (lang === 'fr' ? 'Jour' : 'نهاري') : (lang === 'fr' ? 'Nuit' : 'ليلي')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
                      className="py-2 px-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === 'ar' ? 'FR' : 'AR'}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Account Button Toggle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="mb-1"
        >
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-500 bg-white dark:bg-slate-900 shadow-xl overflow-hidden hover:scale-110 active:scale-95 transition-all cursor-pointer group flex items-center justify-center"
            title={lang === 'fr' ? 'Mon Compte' : 'حسابي والإعدادات'}
          >
            {currentUser ? (
              <img
                src={currentUser.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt={currentUser.name}
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            )}

            {/* Status Live Indicator Dot */}
            <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-slate-900"></span>
            </span>
          </button>
        </motion.div>
      </div>

      {/* Member & Support Chat Floating Button */}
      <div className="relative pointer-events-auto" ref={chatRef}>
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-16 sm:bottom-20 ltr:right-2 sm:ltr:right-5 rtl:left-2 sm:rtl:left-5 w-[calc(100vw-1.25rem)] sm:w-80 max-w-[350px] h-[440px] max-h-[68vh] bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col pointer-events-auto"
            >
              {activeChatUserId ? (
                <MemberChat 
                  receiverId={activeChatUserId} 
                  onBack={() => setActiveChatUserId(null)} 
                  onClose={() => setIsChatOpen(false)} 
                />
              ) : (
                <ChatList 
                  onSelectUser={(uid) => setActiveChatUserId(uid)} 
                  onClose={() => setIsChatOpen(false)} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <button
            type="button"
            onClick={() => {
              if (!currentUser) {
                ensureUserSession();
              }
              setIsChatOpen(!isChatOpen);
            }}
            className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] ${
              isChatOpen
                ? 'bg-amber-500 border-amber-400 text-slate-950 scale-110' 
                : 'bg-slate-900 dark:bg-slate-800 border-amber-500/40 text-amber-500 hover:scale-110'
            }`}
            title={lang === 'fr' ? 'Messagerie Directe' : 'الدردشة والرسائل المباشرة'}
          >
            <MessageSquare className="w-5 h-5" />
              {currentUser && unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-rose-600 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-slate-900 animate-bounce">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </motion.div>
        </div>

      {/* Floating Ads Trigger Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
          default: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        className="pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => setIsFloatingAdsOpen(true)}
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 dark:bg-slate-800 text-amber-400 shadow-lg border border-amber-500/40 hover:scale-110 active:scale-90 transition-transform flex items-center justify-center cursor-pointer group"
          title={lang === 'fr' ? 'Bannières & Offres Spéciales' : 'عروض وإعلانات عائمة مميزة'}
        >
          <Megaphone className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </button>
      </motion.div>

      {/* AI Assistant Floating Button */}
      {siteSettings.appFeatures?.enableAIStoreAssistant !== false && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.2 },
            default: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          className="pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setIsAIAssistantModalOpen(true)}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/30 flex items-center justify-center cursor-pointer border border-amber-300 dark:border-amber-600 hover:scale-110 active:scale-90 transition-transform group"
            title={lang === 'fr' ? 'Assistant IA' : 'المساعد الذكي'}
          >
            <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
            </span>
          </button>
        </motion.div>
      )}

      {/* WhatsApp Support Button - Branded SVG */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2.0, ease: 'easeInOut' },
          default: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        className="pointer-events-auto"
      >
        <motion.a
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#25D366] shadow-lg shadow-emerald-500/40 flex items-center justify-center text-white cursor-pointer overflow-hidden border border-white/80 dark:border-slate-800 transition-all duration-300 group"
          title="WhatsApp Support"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute top-0 right-0 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
          </span>
        </motion.a>
      </motion.div>

    </div>
  );
};
