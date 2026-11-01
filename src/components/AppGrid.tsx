import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryType, AppItem } from '../types';
import { filterApps, formatDownloadCount } from '../utils/helpers';
import {
  Briefcase,
  Users,
  Shield,
  Star,
  Download,
  Search,
  Filter,
  Grid,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { SafeImage } from './SafeImage';

export const AppGrid: React.FC<{ isModal?: boolean }> = ({ isModal }) => {
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

  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'newest'>('downloads');

  const filtered = filterApps(apps, selectedCategoryFilter, searchQuery, lang);

  const sortedApps = [...filtered].sort((a, b) => {
    if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
  });

  return (
    <section className={`${isModal ? 'py-6 px-4' : 'py-12 px-4 sm:px-6 lg:px-8'} max-w-7xl mx-auto`}>
      {/* Title and Controls Header */}
      {!isModal && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Grid className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <span>{t.navAllApps}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {lang === 'fr'
                ? 'Parcourez toutes nos applications par catégorie et fonctionnalités'
                : 'تصفح جميع التطبيقات المتاحة حسب الفئات المميزة والوظائف'}
            </p>
          </div>

          {/* Category Tabs Filter */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedCategoryFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'fr' ? 'Toutes' : 'الكل'} ({apps.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? cat.nameFr : cat.nameAr}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isModal && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                selectedCategoryFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {lang === 'fr' ? 'Toutes' : 'الكل'}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-500 hover:text-amber-600'
                }`}
              >
                {lang === 'fr' ? cat.nameFr : cat.nameAr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sorting Selector */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <span>
          {lang === 'fr' ? 'Résultats :' : 'عدد النتائج:'} <strong className="text-slate-900 dark:text-white font-mono">{sortedApps.length}</strong> {lang === 'fr' ? 'application(s)' : 'تطبيق'}
        </span>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>{lang === 'fr' ? 'Trier par :' : 'ترتيب حسب:'}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-amber-500 cursor-pointer font-bold"
          >
            <option value="downloads">{lang === 'fr' ? 'Plus Téléchargés' : 'الأكثر تحميلاً'}</option>
            <option value="rating">{lang === 'fr' ? 'Mieux Notés' : 'الأعلى تقييماً'}</option>
            <option value="newest">{lang === 'fr' ? 'Plus Récents' : 'الأحدث'}</option>
          </select>
        </div>
      </div>

      {/* App Cards Grid */}
      {sortedApps.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Search className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Aucune application trouvée' : 'لم يتم العثور على نتائج'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {lang === 'fr'
              ? 'Essayez de modifier vos mots-clés ou de changer la catégorie sélectionnée.'
              : 'جرب البحث بكلمات أخرى أو اختر فئة مختلفة لمشاهدة التطبيقات المتاحة.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer"
          >
            {lang === 'fr' ? 'Réinitialiser la recherche' : 'إعادة ضبط البحث'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedApps.map((app) => (
            <SingleAppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </section>
  );
};

const SingleAppCard: React.FC<{ app: AppItem }> = ({ app }) => {
  const { lang, t, navigateToView, recordDownload } = useApp();

  const title = lang === 'fr' ? app.titleFr : app.title;
  const desc = lang === 'fr' ? app.shortDescFr : app.shortDesc;
  const badge = lang === 'fr' ? app.badgeFr : app.badge;

  const categoryBadgeColor =
    app.category === 'commercial'
      ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
      : app.category === 'family'
      ? 'bg-pink-100 dark:bg-pink-500/10 text-pink-800 dark:text-pink-400 border-pink-300 dark:border-pink-500/30'
      : 'bg-amber-100 dark:bg-amber-500/10 text-amber-900 dark:text-amber-400 border-amber-300 dark:border-amber-500/30';

  return (
    <div className="bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl group">
      <div>
        {/* Top bar with icon and category badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 dark:from-slate-950 dark:to-slate-900 border border-amber-500/30 flex items-center justify-center text-slate-950 dark:text-amber-400 font-extrabold text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              {app.screenshots && app.screenshots.length > 0 ? (
                <SafeImage
                  src={app.screenshots[0]}
                  alt={title}
                  fallbackTitle={title}
                  fallbackType="icon"
                  className="w-full h-full object-cover"
                />
              ) : (
                title.charAt(0)
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                {title}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono font-semibold">
                {app.developer}
              </span>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${categoryBadgeColor}`}>
            {badge}
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4 font-medium">
          {desc}
        </p>
      </div>

      {/* Footer Metrics and Buttons */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 py-3 border-t border-slate-200 dark:border-slate-800/80 mb-4 font-medium">
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{app.rating}</span>
            <span className="text-[10px] text-slate-400">({app.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-1 text-slate-800 dark:text-slate-300 font-bold">
            <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{formatDownloadCount(app.downloadsCount, lang, 333)}</span>
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
  );
};
