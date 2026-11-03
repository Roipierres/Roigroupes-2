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
  X,
  Bell
} from 'lucide-react';
import { NotificationDropdown } from './ToastContainer';
import { PWAInstallButton } from './PWAInstallButton';

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
    categories,
    siteSettings
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

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
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-amber-500/20 shadow-sm transition-colors">
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

          {/* Social Links & Switchers */}
          <div className="flex items-center gap-3 shrink-0 ltr:ml-auto rtl:mr-auto">
            {/* Social Icons in Header */}
            <div className="hidden sm:flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-3 rtl:border-r-0 rtl:border-l rtl:pr-0 rtl:pl-3">
              {siteSettings.facebookLink && (
                <a href={siteSettings.facebookLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title="Facebook">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {siteSettings.instagramLink && (
                <a href={siteSettings.instagramLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors" title="Instagram">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {siteSettings.tiktokLink && (
                <a href={siteSettings.tiktokLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="TikTok">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.46-.35-.24-.68-.51-1-.81l-.01 7.15c.03 3.25-1.47 6.47-4.48 7.82-3.23 1.48-7.34.82-9.75-1.78-2.61-2.73-2.69-7.4-.18-10.23 1.71-1.95 4.34-2.88 6.91-2.48v4.11c-.74-.16-1.54-.15-2.25.18-.9.41-1.52 1.27-1.68 2.24-.26 1.34.56 2.8 1.89 3.19.89.26 1.93.07 2.67-.53.7-.55 1.05-1.46 1.04-2.35l.02-12.16z"/></svg>
                </a>
              )}
            </div>

            <PWAInstallButton />

            {/* Language Switcher AND Light/Dark Mode Switcher at top extreme right */}
            <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1 bg-slate-200/90 dark:bg-amber-500/20 hover:bg-amber-500/30 text-slate-800 dark:text-amber-300 rounded-full border border-slate-300 dark:border-amber-500/40 font-bold text-xs transition-all shadow-xs cursor-pointer group"
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
    </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3 md:gap-8">
          {/* Brand Logo & Official Image Emblem */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => navigateToView('home')}
              className="flex items-center gap-2 sm:gap-3 group text-left rtl:text-right cursor-pointer relative"
            >
              {/* Decorative dots removed as per user request */}
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-amber-500/40 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform bg-slate-900 flex items-center justify-center shrink-0">
                <img src={logoPath} alt="RG" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black text-slate-900 dark:text-white flex items-center" dir="ltr">
                  RG<span className="text-red-500">S</span>
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
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
            {/* Management Workspace Button */}
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
                {/* Notification Bell */}
                {siteSettings.appFeatures?.enableNotifications !== false && (
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isNotificationOpen ? 'bg-amber-500/20 text-amber-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <Bell className="w-5 h-5" />
                      {useApp().notifications.length > 0 && (
                        <span className="absolute top-1.5 ltr:right-1.5 rtl:left-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-950 animate-pulse" />
                      )}
                    </button>
                    <NotificationDropdown isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                  </div>
                )}

                <button
                  onClick={() => navigateToView('profile_settings')}
                  className={`flex items-center gap-2 p-1 pr-3 rtl:pl-3 rtl:pr-1 rounded-full bg-slate-100 dark:bg-slate-900 border transition-all cursor-pointer ${
                    currentView === 'profile_settings' ? 'border-amber-500' : 'border-amber-500/20 hover:border-amber-500/50'
                  }`}
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
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={closeMobileMenu}>
          <div 
            ref={mobileMenuRef} 
            className="absolute ltr:right-0 rtl:left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col p-6 animate-slide-in-rtl rtl:animate-slide-in-ltr overflow-y-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-black text-slate-900 dark:text-white" dir="ltr">RG<span className="text-red-500">S</span></span>
              <button onClick={closeMobileMenu} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => { navigateToView('home'); closeMobileMenu(); }} className={`flex items-center gap-3 p-4 rounded-2xl font-black transition-colors ${currentView === 'home' ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-600'}`}><Home className="w-5 h-5" /><span>{t.navHome}</span></button>
              
              {/* Management Dashboard Link */}
              {currentUser && (
                isAdmin(currentUser) && (
                  <button
                    onClick={() => {
                      navigateToView('admin');
                      closeMobileMenu();
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
                )
              )}

              {categories.map((cat) => (
                <button key={cat.id} onClick={() => { navigateToCategoryPage(cat.id); closeMobileMenu(); }} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-colors"><Layers className="w-5 h-5 text-amber-500" /><span>{lang === 'fr' ? cat.nameFr : cat.nameAr}</span></button>
              ))}
              <button onClick={() => { setIsAllAppsModalOpen(true); closeMobileMenu(); }} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold transition-colors"><Grid className="w-5 h-5 text-amber-500" /><span>{t.navAllApps}</span></button>
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              {currentUser && (
                <button 
                  onClick={() => { navigateToView('profile_settings'); closeMobileMenu(); }} 
                  className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${currentView === 'profile_settings' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'}`}
                >
                  <User className="w-5 h-5 text-amber-500" />
                  <span>{lang === 'fr' ? 'Mon Profil' : 'ملفي الشخصي'}</span>
                </button>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white transition-all flex-1 flex items-center justify-between px-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {theme === 'dark' ? (
                      <><Sun className="w-5 h-5 text-amber-500" /><span>{lang === 'fr' ? 'Jour' : 'نهاري'}</span></>
                    ) : (
                      <><Moon className="w-5 h-5 text-indigo-500" /><span>{lang === 'fr' ? 'Nuit' : 'ليلي'}</span></>
                    )}
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

const isAdmin = (user: any) => {
  return user.role === 'admin' || user.id === 'user-admin' || user.email === 'bahrinho93@gmail.com' || user.email === 'manager@roigroupes.com';
};

