import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Sun,
  Moon,
  User,
  LayoutDashboard,
  Briefcase,
  Users,
  Shield,
  Home,
  Grid,
  LogOut,
  Crown,
  ChevronDown,
  Layers,
  Lock,
  Settings,
  X
} from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    t,
    currentView,
    navigateToView,
    navigateToCategoryPage,
    currentUser,
    setIsAuthModalOpen,
    isAllAppsModalOpen,
    setIsAllAppsModalOpen,
    logout,
    apps,
    categories
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'fr' : 'ar');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-amber-500/20 shadow-sm transition-colors">
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      
      {/* Top Banner Notice & Language & Theme Switchers at Extreme Top Right */}
      <div className="bg-gradient-to-r from-amber-100 via-slate-100 to-slate-100 dark:from-amber-950/80 dark:via-slate-950 dark:to-slate-950 px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold whitespace-nowrap">
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              {t.heroBadge}
            </span>
            <span className="hidden md:inline text-slate-400 dark:text-slate-600">|</span>
            <span className="hidden md:inline text-slate-600 dark:text-slate-400 truncate text-[11px]">
              {t.heroSubtitle}
            </span>
          </div>

          {/* Language Switcher AND Light/Dark Mode Switcher at top extreme right */}
          <div className="flex items-center gap-2 shrink-0 ltr:ml-auto rtl:mr-auto">
            {/* Interactive Light/Dark Theme Switcher Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1 bg-slate-200/90 dark:bg-amber-500/20 hover:bg-amber-500/30 text-slate-800 dark:text-amber-300 rounded-full border border-slate-300 dark:border-amber-500/40 font-bold text-xs transition-all shadow-xs cursor-pointer group"
              title={theme === 'dark' ? (lang === 'fr' ? 'Passer au Mode Jour' : 'التحويل للوضع النهاري') : (lang === 'fr' ? 'Passer au Mode Nuit' : 'التحويل للوضع الليلي')}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[11px] font-bold">{lang === 'fr' ? 'Mode Jour' : 'الوضع النهاري'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[11px] font-bold">{lang === 'fr' ? 'Mode Nuit' : 'الوضع الليلي'}</span>
                </>
              )}
              <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors relative ${theme === 'dark' ? 'bg-amber-500' : 'bg-slate-400'}`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-slate-950 dark:bg-white shadow-xs transform transition-transform duration-200 ${theme === 'dark' ? 'ltr:translate-x-3.5 rtl:-translate-x-3.5' : 'translate-x-0'}`} />
              </div>
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-full border border-amber-500/30 font-medium text-xs transition-all shadow-xs cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'ar' ? 'FR' : 'AR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3 md:gap-8">
          {/* Brand Logo & Official Image Emblem */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => navigateToView('home')}
              className="flex items-center gap-2 sm:gap-3 group text-left rtl:text-right cursor-pointer"
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-amber-500/40 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform bg-slate-900 flex items-center justify-center shrink-0">
                <img src={logoPath} alt="RG" className="w-full h-full object-cover" />
              </div>
              <div className="block">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white block leading-none group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  RoiGroupes<span className="text-amber-500">.com</span>
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links with Category Dropdown Menu */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            <button
              onClick={() => navigateToView('home')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${currentView === 'home' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
            >
              <Home className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsAllAppsModalOpen(true)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${isAllAppsModalOpen ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-900'}`}
              title={t.navAllApps}
            >
              <Grid className="w-5 h-5" />
            </button>
          </nav>

          {/* User Auth & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Show Management Workspace Button ONLY if logged in as Manager/Admin */}
            {currentUser && (
              currentUser.role === 'admin' ||
              currentUser.id === 'user-admin' ||
              currentUser.email === 'bahrinho93@gmail.com' ||
              currentUser.email === 'manager@roigroupes.com'
            ) && (
              <button
                onClick={() => navigateToView('admin')}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-amber-500/10 dark:bg-slate-900 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
                }`}
                title={t.navAdminDashboard}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-[11px] sm:text-xs font-black whitespace-nowrap">{lang === 'fr' ? 'Gestion' : 'إدارة المنصة'}</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 p-1 pr-3 rtl:pl-3 rtl:pr-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-amber-500/30" />
                  <span className="text-xs font-black text-slate-900 dark:text-white hidden md:block max-w-[80px] truncate">{currentUser.name}</span>
                </button>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                {t.loginBtn}
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 rounded-xl cursor-pointer"
            >
              <Grid className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div ref={mobileMenuRef} className="absolute ltr:right-0 rtl:left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col p-6 animate-slide-in-rtl rtl:animate-slide-in-ltr" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-black text-slate-900 dark:text-white">RoiGroupes<span className="text-amber-500">.com</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => { navigateToView('home'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 text-amber-600 font-black"><Home className="w-5 h-5" /><span>{t.navHome}</span></button>
              
              {/* Management Dashboard Link in Mobile Drawer - Only for Managers */}
              {currentUser && (
                currentUser.role === 'admin' ||
                currentUser.id === 'user-admin' ||
                currentUser.email === 'bahrinho93@gmail.com' ||
                currentUser.email === 'manager@roigroupes.com'
              ) && (
                <button
                  onClick={() => {
                    navigateToView('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-colors ${
                    currentView === 'admin'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 text-amber-500" />
                  <span>{lang === 'fr' ? 'Espace de Gestion' : 'لوحة إدارة المنصة'}</span>
                </button>
              )}

              {categories.map((cat) => (
                <button key={cat.id} onClick={() => { navigateToCategoryPage(cat.id); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-colors"><Layers className="w-5 h-5 text-amber-500" /><span>{lang === 'fr' ? cat.nameFr : cat.nameAr}</span></button>
              ))}
              <button onClick={() => { setIsAllAppsModalOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-colors"><Grid className="w-5 h-5 text-amber-500" /><span>{t.navAllApps}</span></button>
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              {currentUser && (
                <button onClick={() => { setIsProfileModalOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"><User className="w-5 h-5 text-amber-500" /><span>{lang === 'fr' ? 'Mon Profil' : 'ملفي الشخصي'}</span></button>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white transition-all flex-1 flex items-center justify-between px-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-5 h-5 text-amber-500" />
                        <span>{lang === 'fr' ? 'Mode Jour' : 'الوضع النهاري'}</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5 text-indigo-500" />
                        <span>{lang === 'fr' ? 'Mode Nuit' : 'الوضع الليلي'}</span>
                      </>
                    )}
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative ${theme === 'dark' ? 'bg-amber-500' : 'bg-slate-400'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-200 ${theme === 'dark' ? 'ltr:translate-x-4 rtl:-translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
                <button onClick={toggleLanguage} className="flex-[2] py-4 bg-amber-500 text-slate-950 rounded-2xl font-black">{lang === 'ar' ? 'Français' : 'العربية'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
