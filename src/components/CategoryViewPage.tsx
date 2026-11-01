import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppItem, CategoryType } from '../types';
import { filterApps, formatDownloadCount } from '../utils/helpers';
import {
  Briefcase,
  Users,
  Shield,
  Star,
  Download,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Crown,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export const CategoryViewPage: React.FC = () => {
  const {
    lang,
    t,
    apps,
    searchQuery,
    setSearchQuery,
    navigateToView,
    recordDownload,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter
  } = useApp();

  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'newest'>('downloads');

  // Determine current active category config
  const currentCategoryId: string = selectedCategoryFilter === 'all' ? 'commercial' : selectedCategoryFilter;

  const getCategoryDetails = (catId: string) => {
    const foundCat = categories.find(c => c.id === catId);
    
    const defaults: any = {
      commercial: {
        title: lang === 'fr' ? 'Catégorie Commerciale' : 'واجهة الفئة التجارية',
        desc: lang === 'fr' ? 'Solutions de gestion d\'entreprise, comptabilité SmartPOS, CRM et facturation.' : 'تطبيقات إدارة الأعمال، المحاسبة المتقدمة SmartPOS، مسيّر المبيعات CRM، وتنظيم الفواتير للشركات والمتاجر.',
        icon: <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
        badgeBg: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
        gradientBg: 'from-emerald-950/20 via-slate-900 to-slate-950'
      },
      family: {
        title: lang === 'fr' ? 'Catégorie Familiale' : 'واجهة الفئة العائلية',
        desc: lang === 'fr' ? 'Budget du foyer, suivi parental KidGuard, organisation des repas et activités.' : 'تطبيقات تنظيم شؤون الأسرة، ميزانية المنزل، مراقبة الأطفال KidGuard، وجدولة الرحلات والوجبات العائلية.',
        icon: <Users className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
        badgeBg: 'bg-pink-100 dark:bg-pink-500/10 text-pink-800 dark:text-pink-400 border-pink-300 dark:border-pink-500/30',
        gradientBg: 'from-pink-950/20 via-slate-900 to-slate-950'
      },
      security: {
        title: lang === 'fr' ? 'Catégorie Sécurité' : 'واجهة الفئة الأمنية',
        desc: lang === 'fr' ? 'Protection de la vie privée ShieldVPN, coffre-fort d\'empreinte AppLock et alarme anti-vol.' : 'تطبيقات الحماية القصوى، VPN المشفر ShieldVPN، قفل التطبيقات بالبصمة AppLock، وإنذار الحماية ضد السرقة.',
        icon: <Shield className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
        badgeBg: 'bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
        gradientBg: 'from-amber-950/20 via-slate-900 to-slate-950'
      }
    };

    if (defaults[catId]) return defaults[catId];
    
    return {
      title: foundCat ? (lang === 'fr' ? foundCat.nameFr : foundCat.nameAr) : (lang === 'fr' ? 'Catégorie' : 'فئة'),
      desc: lang === 'fr' ? 'Explorez nos applications certifiées dans cette catégorie.' : 'استكشف التطبيقات الموثوقة والمعتمدة ضمن هذه الفئة الجديدة.',
      icon: <Layers className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      badgeBg: 'bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
      gradientBg: 'from-amber-950/20 via-slate-900 to-slate-950'
    };
  };

  const catDetails = getCategoryDetails(currentCategoryId);

  // Filter apps strictly in this standalone category view
  const categoryApps = apps.filter((a) => a.category === currentCategoryId && a.status === 'published');
  
  const searchedCategoryApps = categoryApps.filter((app) => {
    if (!categorySearchQuery.trim()) return true;
    const q = categorySearchQuery.toLowerCase();
    const title = lang === 'fr' ? app.titleFr : app.title;
    const desc = lang === 'fr' ? app.shortDescFr : app.shortDesc;
    return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || app.developer.toLowerCase().includes(q);
  });

  const sortedApps = [...searchedCategoryApps].sort((a, b) => {
    if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
  });

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 max-w-6xl mx-auto w-full">
      {/* Back to Home Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigateToView('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          {lang === 'ar' ? <ArrowRight className="w-4 h-4 text-amber-500" /> : <ArrowLeft className="w-4 h-4 text-amber-500" />}
          <span>{lang === 'fr' ? 'Retour à l\'accueil' : 'العودة للرئيسية'}</span>
        </button>

        {/* Quick Category Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors cursor-pointer ${
                currentCategoryId === cat.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📁 {lang === 'fr' ? cat.nameFr : cat.nameAr}
            </button>
          ))}
        </div>
      </div>

      {/* Standalone Category Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-500/30 p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-amber-500/30 shadow-md shrink-0">
              {catDetails.icon}
            </div>

            <div>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full border inline-block mb-2 ${catDetails.badgeBg}`}>
                RoiGroupes Category View
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {catDetails.title}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
                {catDetails.desc}
              </p>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shrink-0">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono block">
              {categoryApps.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {lang === 'fr' ? 'Applications disponibles' : 'تطبيقات معتمدة في هذه الفئة'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Search & Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        {/* Category Specific Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={categorySearchQuery}
            onChange={(e) => setCategorySearchQuery(e.target.value)}
            placeholder={lang === 'fr' ? 'Filtrer dans cette catégorie...' : 'ابحث داخل هذه الفئة...'}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-2 text-xs text-slate-900 dark:text-white ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium self-end sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'fr' ? 'Trier :' : 'ترتيب حسب:'}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-amber-500 font-bold cursor-pointer"
          >
            <option value="downloads">{lang === 'fr' ? 'Plus Téléchargés' : 'الأكثر تحميلاً'}</option>
            <option value="rating">{lang === 'fr' ? 'Mieux Notés' : 'الأعلى تقييماً'}</option>
            <option value="newest">{lang === 'fr' ? 'Plus Récents' : 'الأحدث'}</option>
          </select>
        </div>
      </div>

      {/* App Grid inside this Category */}
      {sortedApps.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Aucune application dans cette catégorie' : 'لا توجد نتائج مطابقة في هذه الفئة'}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedApps.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 dark:from-slate-950 dark:to-slate-900 border border-amber-500/30 flex items-center justify-center text-slate-950 dark:text-amber-400 font-black text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform">
                      {(lang === 'fr' ? app.titleFr : app.title).charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                        {lang === 'fr' ? app.titleFr : app.title}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono font-semibold">
                        {app.developer}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-400 border-amber-300 dark:border-amber-500/30">
                    {lang === 'fr' ? app.badgeFr : app.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4 font-medium">
                  {lang === 'fr' ? app.shortDescFr : app.shortDesc}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 py-3 border-t border-slate-200 dark:border-slate-800/80 mb-4 font-medium">
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{app.rating}</span>
                    <span className="text-[10px] text-slate-400">({app.reviewsCount})</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-800 dark:text-slate-300 font-bold">
                    <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{formatDownloadCount(app.downloadsCount, lang)}</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {app.size}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateToView('app_detail', app)}
                    className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{t.viewDetails}</span>
                    {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5 text-amber-500" /> : <ArrowRight className="w-3.5 h-3.5 text-amber-500" />}
                  </button>

                  <button
                    onClick={() => recordDownload(app.id)}
                    title={t.downloadNow}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
