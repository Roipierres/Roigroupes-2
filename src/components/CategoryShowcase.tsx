import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AppItem, CategoryItem } from '../types';
import { initialApps } from '../data/initialData';
import { formatDownloadCount } from '../utils/helpers';
import {
  Search,
  MoreVertical,
  Star,
  Download,
  CheckCircle2,
  Briefcase,
  Users,
  Shield,
  Sparkles,
  Gamepad2,
  Smartphone,
  User,
  SlidersHorizontal,
  Check,
  Crown,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafeImage } from './SafeImage';

export const CategoryShowcase: React.FC = () => {
  const {
    lang,
    t,
    apps,
    categories,
    navigateToView,
    recordDownload,
    setSelectedCategoryFilter,
    setIsAllAppsModalOpen,
    setIsAuthModalOpen,
    currentUser,
    searchQuery,
    setSearchQuery
  } = useApp();

  const showcaseRef = useRef<HTMLDivElement>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  
  // Selected app for top featured card
  const [featuredApp, setFeaturedApp] = useState<AppItem>(() => {
    const list = (apps && apps.length > 0) ? apps : initialApps;
    return list.find(a => a.isFeatured) || list[0];
  });

  // Keep featuredApp synced if apps update
  React.useEffect(() => {
    if (!featuredApp && apps && apps.length > 0) {
      setFeaturedApp(apps[0]);
    }
  }, [apps, featuredApp]);

  const handleSelectFeatured = (app: AppItem) => {
    setFeaturedApp(app);
    if (showcaseRef.current) {
      showcaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAllAppsModalOpen(true);
  };

  // Filter apps list based on chip selected
  const allAppsList = (apps && apps.length > 0) ? apps : initialApps;
  const filteredApps = activeCategoryFilter === 'all'
    ? allAppsList
    : allAppsList.filter(a => a.category === activeCategoryFilter);

  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';
  const featuredTitle = lang === 'fr' ? featuredApp.titleFr : featuredApp.title;
  const featuredCategoryName = lang === 'fr' 
    ? (featuredApp.category === 'commercial' ? 'Commercial' : featuredApp.category === 'family' ? 'Famille' : 'Sécurité')
    : (featuredApp.category === 'commercial' ? 'تجاري' : featuredApp.category === 'family' ? 'عائلي' : 'أمني');

  return (
    <div ref={showcaseRef} className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-24 scroll-mt-16">
      {/* ========================================================================= */}
      {/* 1. TOP SEARCH BAR (اطار البحث في الأعلى) */}
      {/* ========================================================================= */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute ltr:left-4 rtl:right-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher des applications ou jeux...' : 'ابحث في تطبيقات ومواقع RoiGroupes...'}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm rounded-full py-3.5 ltr:pl-12 ltr:pr-24 rtl:pr-12 rtl:pl-24 focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-sm transition-all"
          />
          <button
            type="submit"
            className="absolute ltr:right-2 rtl:left-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            {lang === 'fr' ? 'Rechercher' : 'بحث'}
          </button>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* 2. TOP FEATURED SHOWCASE HERO CARD (بطاقة العرض الكبيرة كالمثال المرفق) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Cover Graphic / Header Illustration */}
        <div className="relative h-44 sm:h-56 w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 overflow-hidden">
          {featuredApp.screenshots && featuredApp.screenshots.length > 0 ? (
            <SafeImage 
              src={featuredApp.screenshots[0]} 
              alt={featuredTitle}
              fallbackTitle={featuredTitle}
              fallbackType="screenshot"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay scale-105"
            />
          ) : (
            <SafeImage 
              src={logoPath} 
              alt="RoiGroupes Logo" 
              fallbackTitle="RoiGroupes"
              fallbackType="icon"
              className="w-full h-full object-cover opacity-30 blur-sm"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Cover Overlay Text */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 font-extrabold text-[10px] sm:text-xs rounded-full flex items-center gap-1.5 shadow-md">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'fr' ? 'Application RG En Vedette' : 'تطبيق RG المميز للمناسبة'}</span>
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                {lang === 'fr' ? 'Découvre les créations RoiGroupes !' : 'اكتشف أحدث وأقوى تطبيقات RoiGroupes !'}
              </h2>
            </div>
          </div>
        </div>

        {/* Embedded Featured App Header Bar Directly Attached Below Banner */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Squircle App Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-500 font-black text-2xl shadow-md shrink-0 overflow-hidden">
              {featuredApp.screenshots && featuredApp.screenshots.length > 0 ? (
                <SafeImage
                  src={featuredApp.screenshots[0]}
                  alt={featuredTitle}
                  fallbackTitle={featuredTitle}
                  fallbackType="icon"
                  className="w-full h-full object-cover"
                />
              ) : (
                featuredTitle.charAt(0)
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                {featuredTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1.5 mt-0.5">
                <span>{featuredApp.developer}</span>
                <span>•</span>
                <span className="font-bold text-amber-500 flex items-center gap-0.5">
                  {featuredApp.rating} <Star className="w-3 h-3 fill-amber-500 inline" />
                </span>
                <span>•</span>
                <span>{featuredCategoryName}</span>
              </p>
            </div>
          </div>

          {/* Installer Pill Action Button */}
          <div className="text-center shrink-0">
            <button
              onClick={() => recordDownload(featuredApp.id)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-full shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer block"
            >
              {lang === 'fr' ? 'Installer' : 'تثبيت التطبيق'}
            </button>
            <span className="text-[9px] text-slate-400 font-medium block mt-1">
              {lang === 'fr' ? 'Gratuit & Direct' : 'تحميل مجاني ومباشر'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. HORIZONTAL CATEGORY CHIPS CAROUSEL (أزرار الفلترة الأفقية) */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategoryFilter === 'all'
              ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>{lang === 'fr' ? 'Meilleurs classements' : 'أفضل التصنيفات'}</span>
        </button>

        <button
          onClick={() => setActiveCategoryFilter('family')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategoryFilter === 'family'
              ? 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-400/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-pink-500" />
          <span>{lang === 'fr' ? 'Enfants & Famille' : 'العائلية والأطفال'}</span>
        </button>

        <button
          onClick={() => setActiveCategoryFilter('commercial')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategoryFilter === 'commercial'
              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
          <span>{lang === 'fr' ? 'Commercial' : 'التجارية والأعمال'}</span>
        </button>

        <button
          onClick={() => setActiveCategoryFilter('security')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategoryFilter === 'security'
              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'fr' ? 'Sécurité' : 'الأمنية والحماية'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. "Sponsorisé • Recommandations" LIST SECTION (قائمة التطبيقات الموصى بها) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Section Title Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase font-mono">
              {lang === 'fr' ? 'Sponsorisé • Recommandations' : 'موصى به • توصيات تطبيقات RoiGroupes'}
            </span>
          </div>

          <button
            onClick={() => setIsAllAppsModalOpen(true)}
            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Apps List Rows (Play Store Rows) */}
        <div className="space-y-3">
          {filteredApps.map((app) => {
            const appTitle = lang === 'fr' ? app.titleFr : app.title;
            const appShort = lang === 'fr' ? app.shortDescFr : app.shortDesc;
            const isFeaturedSelected = featuredApp.id === app.id;

            return (
              <div
                key={app.id}
                onClick={() => handleSelectFeatured(app)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isFeaturedSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800/80 hover:border-amber-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Large Squircle Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black text-xl shadow-sm shrink-0 overflow-hidden">
                    {app.screenshots && app.screenshots.length > 0 ? (
                      <SafeImage
                        src={app.screenshots[0]}
                        alt={appTitle}
                        fallbackTitle={appTitle}
                        fallbackType="icon"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      appTitle.charAt(0)
                    )}
                  </div>

                  {/* App Text Info */}
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                      {appTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                      {appShort}
                    </p>

                    {/* Status Badge & Rating */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-amber-500 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 inline" />
                        <span>{app.rating}</span>
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {app.size}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[9px] font-black border border-emerald-500/30">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{lang === 'fr' ? 'Installée' : 'تحميل مباشر'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Trigger Icon */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      recordDownload(app.id);
                    }}
                    className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer shadow-xs"
                    title={lang === 'fr' ? 'Télécharger' : 'تحميل التطبيق'}
                  >
                    <Download className="w-4 h-4 text-amber-500 group-hover:text-slate-950" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM PLAY STORE STYLE NAVIGATION DOCK BAR (شريط أسفل الشاشة المنسق) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Tab 1: Commercial / Games */}
          <button
            onClick={() => setActiveCategoryFilter('commercial')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              activeCategoryFilter === 'commercial' ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeCategoryFilter === 'commercial' ? 'bg-blue-100 dark:bg-blue-500/20' : ''}`}>
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">{lang === 'fr' ? 'Jeux' : 'التجاري'}</span>
          </button>

          {/* Tab 2: Apps (Active highlighted capsule) */}
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
              activeCategoryFilter === 'all' ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className={`p-1.5 px-4 rounded-full ${activeCategoryFilter === 'all' ? 'bg-blue-100 dark:bg-blue-500/20' : ''}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">{lang === 'fr' ? 'Applis' : 'التطبيقات'}</span>
          </button>

          {/* Tab 3: Search */}
          <button
            onClick={() => setIsAllAppsModalOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-xl">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">{lang === 'fr' ? 'Rechercher' : 'البحث'}</span>
          </button>

          {/* Tab 4: Account / Profile */}
          <button
            onClick={() => {
              if (currentUser) {
                navigateToView('admin');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">{lang === 'fr' ? 'Vous' : 'حسابي'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
