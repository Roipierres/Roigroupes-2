import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDownloadCount } from '../utils/helpers';
import {
  Search,
  ShieldCheck,
  Download,
  Users,
  Smartphone,
  Crown,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Shield,
  Sparkles,
  Layers,
  Star,
  CheckCircle2,
  Zap,
  Eye
} from 'lucide-react';
import { CategoryItem } from '../types';
import { SafeImage } from './SafeImage';

// Radiant Glowing Shield with Radiation Light Beam Sweeping Across its Lines
const RadiantShieldIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9 sm:w-12 sm:h-12" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-emerald-500 overflow-visible drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]"
      >
        <defs>
          {/* Animated Radiation Beam Gradient Sweep */}
          <linearGradient id="shieldRadiationSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="65%" stopColor="#34d399" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.8" />
            <animate
              attributeName="x1"
              values="-100%; 200%"
              dur="2.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%; 300%"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Intense Laser Line Glow Filter */}
          <filter id="laserLineGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Shield Outline Path with Radiation Light Sweep */}
        <path
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
          stroke="url(#shieldRadiationSweep)"
          strokeWidth="2.3"
          filter="url(#laserLineGlow)"
        />

        {/* Inner Checkmark Path with Radiation Light Sweep */}
        <path
          d="m9 12 2 2 4-4"
          stroke="url(#shieldRadiationSweep)"
          strokeWidth="2.6"
          filter="url(#laserLineGlow)"
        />
      </svg>
    </div>
  );
};

export const Hero: React.FC = () => {
  const {
    lang,
    t,
    searchQuery,
    setSearchQuery,
    navigateToView,
    navigateToCategoryPage,
    setSelectedCategoryFilter,
    apps,
    selectedApp,
    setSelectedApp,
    siteSettings,
    recordDownload,
    downloadLogs,
    users,
    categories,
    setIsAllAppsModalOpen
  } = useApp();

  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const categoryRef = React.useRef<HTMLDivElement>(null);

  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';
  const totalDownloadsSum = apps.reduce((acc, a) => acc + a.downloadsCount, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAllAppsModalOpen(true);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-100 dark:bg-slate-950 pt-8 pb-10 sm:pt-10 sm:pb-12 border-b border-amber-500/20 transition-colors">
      {/* Background Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo Crest Showcase */}
          <div className="inline-flex items-center gap-3 p-2 pr-4 rtl:pl-4 rtl:pr-2 rounded-full bg-white dark:bg-slate-900/90 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold mb-6 shadow-md">
            <img
              src={logoPath}
              alt="RoiGroupes Holding Emblem"
              className="w-8 h-8 rounded-full object-cover border border-amber-500/50 shadow-sm"
            />
            <span className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.heroBadge}</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 shrink-0">
              {lang === 'fr' ? 'Officielles' : 'رسمية'}
            </span>
            <RadiantShieldIcon className="w-9 h-9 sm:w-14 sm:h-14 shrink-0" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-400 shrink-0">
              {lang === 'fr' ? 'Protégées' : 'محمية'}
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto font-bold px-2">
            {lang === 'ar' ? 'تطبيقات مشفرة لأمان بياناتكم وخصوصيتكم' : 'Applications cryptées pour la sécurité de vos données'}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-6 relative max-w-xl mx-auto px-1 sm:px-0">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-amber-600 dark:text-amber-400/70 absolute ltr:left-4 rtl:right-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher une application...' : 'ابحث في تطبيقات ومواقع RoiGroupes...'}
                className="w-full bg-white dark:bg-slate-900 border border-amber-500/30 focus:border-amber-500 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm rounded-2xl py-3 sm:py-3.5 ltr:pl-11 ltr:pr-24 rtl:pr-11 rtl:pl-24 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 transition-all shadow-md"
              />
              <button
                type="submit"
                className="absolute ltr:right-2 rtl:left-2 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {lang === 'fr' ? 'Rechercher' : 'بحث'}
              </button>
            </div>
          </form>

          {/* ========================================================================= */}
          {/* SELECTED APP PROFESSIONAL SHOWCASE CARD (عرض التطبيق المختار المعتمد من لوحة الإدارة) */}
          {/* ========================================================================= */}
          {(() => {
            const activeApp = (siteSettings?.featuredAppId && apps.find(a => a.id === siteSettings.featuredAppId)) 
              || selectedApp 
              || apps.find(a => a.isFeatured) 
              || apps[0];

            if (!activeApp) return null;

            const appTitle = lang === 'fr' ? activeApp.titleFr : activeApp.title;
            const appDesc = lang === 'fr' 
              ? (activeApp.fullDescFr || activeApp.shortDescFr) 
              : (activeApp.fullDesc || activeApp.shortDesc);
            
            const categoryLabel = lang === 'fr'
              ? (activeApp.category === 'commercial' ? 'Commercial & Affaires' : activeApp.category === 'family' ? 'Enfants & Famille' : 'Sécurité & Protection')
              : (activeApp.category === 'commercial' ? 'تطبيقات تجارية وأعمال' : activeApp.category === 'family' ? 'تطبيقات عائلية وللأطفال' : 'تطبيقات أمن وحماية');

            return (
              <div className="mt-6 sm:mt-8 text-right rtl:text-right ltr:text-left bg-white dark:bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-md transition-all">
                {/* Background Ambient Glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

                {/* Header Badge */}
                <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-full shadow-md flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'fr' ? 'Application Sélectionnée' : '✨ التطبيق المختار'}</span>
                  </span>
                </div>

                {/* Main App Header Section: Squircle Icon + Specs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    {/* Squircle High-Res Icon */}
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-xl overflow-hidden flex items-center justify-center text-amber-500 font-black text-3xl">
                        {activeApp.screenshots && activeApp.screenshots.length > 0 ? (
                          <SafeImage
                            src={activeApp.screenshots[0]}
                            alt={appTitle}
                            fallbackTitle={appTitle}
                            fallbackType="icon"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          appTitle.charAt(0)
                        )}
                      </div>
                      <span className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white dark:border-slate-900">
                        <Star className="w-3 h-3 fill-slate-950 inline" />
                        {activeApp.rating || '4.9'}
                      </span>
                    </div>

                    {/* App Title & Specifications Summary */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                          {categoryLabel}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          v{activeApp.version || '2.4.0'}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {appTitle}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {activeApp.developer || 'RoiGroupes Dev Team'}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {formatDownloadCount(activeApp.downloadsCount, lang)} {lang === 'fr' ? 'Téléchargements' : 'تحميل موثق'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions Area: Primary Glowing Download Button */}
                  <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2 shrink-0">
                    <button
                      onClick={() => recordDownload(activeApp.id)}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2.5 relative overflow-hidden group"
                    >
                      <Download className="w-5 h-5 group-hover:bounce" />
                      <span>{lang === 'fr' ? 'Télécharger l\'Application' : 'تحميل التطبيق الآن'}</span>
                    </button>

                    <button
                      onClick={() => navigateToView('app_detail', activeApp)}
                      className="w-full sm:w-auto text-center sm:text-right text-xs font-extrabold text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-center sm:justify-end gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'fr' ? 'Voir tous les détails & avis' : 'عرض كافة التفاصيل والتقييمات'}</span>
                    </button>
                  </div>
                </div>

                {/* App Description & Feature Tags */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {appDesc}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{lang === 'fr' ? '100% Crypté & Sécurisé' : 'مشفر ومحمي بنسبة 100%'}</span>
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === 'fr' ? 'Mise à jour rapide' : 'تحديث فوري ومباشر'}</span>
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                      <span>{lang === 'fr' ? 'Compatible Android & Web' : 'متوافق مع الهواتف والحاسوب'}</span>
                    </span>
                  </div>
                </div>

                {/* Screenshots Preview Gallery */}
                {activeApp.screenshots && activeApp.screenshots.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                      {lang === 'fr' ? 'Aperçu des écrans' : 'معاينة شاشات التطبيق'}
                    </span>
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                      {activeApp.screenshots.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => navigateToView('app_detail', activeApp)}
                          className="w-28 sm:w-36 h-20 sm:h-24 rounded-2xl bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 shadow-md hover:border-amber-500 transition-all cursor-pointer group relative"
                        >
                          <SafeImage
                            src={imgUrl}
                            alt={appTitle}
                            fallbackTitle={appTitle}
                            fallbackType="screenshot"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Key Metrics Counter Strip */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 bg-white dark:bg-slate-900/80 border border-amber-500/30 rounded-2xl p-3 sm:p-5 backdrop-blur-sm shadow-lg max-w-xl mx-auto">
            <div className="text-center p-1 sm:p-2">
              <span className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight block font-mono">
                {apps.length}+
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5 block truncate">
                {t.statApps}
              </span>
            </div>

            <div className="text-center p-1 sm:p-2 border-x border-slate-200 dark:border-slate-800">
              <span className="text-xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight block font-mono">
                {formatDownloadCount(totalDownloadsSum, lang)}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5 block truncate">
                {t.statDownloads}
              </span>
            </div>

            <div className="text-center p-1 sm:p-2">
              <span className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight block font-mono">
                {(users.length > 0 ? users.length * 50 : 600)}+
              </span>
              <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold mt-0.5 block truncate">
                {t.statUsers}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
