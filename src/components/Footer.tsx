import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Crown } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setLang, t, navigateToView, setSelectedCategoryFilter, setIsAllAppsModalOpen, currentUser } = useApp();
  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-amber-500/20 text-slate-500 dark:text-slate-400 text-xs py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          {/* Brand Info with Official Logo */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={logoPath}
                alt="RoiGroupes Logo"
                className="w-10 h-10 rounded-xl object-cover border border-amber-500/40 shadow-sm"
              />
              <div>
                <span className="text-base font-black text-slate-900 dark:text-white block leading-tight">
                  RoiGroupes<span className="text-amber-600 dark:text-amber-400">.com</span>
                </span>
                <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300/80 block font-semibold">
                  ROI GROUPES HOLDING
                </span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
              {t.footerDesc}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setLang('ar')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  lang === 'ar' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                العربية (AR)
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  lang === 'fr' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Français (FR)
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              {t.categoriesTitle}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setSelectedCategoryFilter('commercial'); setIsAllAppsModalOpen(true); }}
                  className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-pointer font-medium"
                >
                  {t.commercialTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategoryFilter('family'); setIsAllAppsModalOpen(true); }}
                  className="hover:text-pink-600 dark:hover:text-pink-300 transition-colors cursor-pointer font-medium"
                >
                  {t.familyTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategoryFilter('security'); setIsAllAppsModalOpen(true); }}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer font-medium"
                >
                  {t.securityTitle}
                </button>
              </li>
            </ul>
          </div>

          {/* Site Navigation */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  onClick={() => navigateToView('home')}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAllAppsModalOpen(true)}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.navAllApps}
                </button>
              </li>
              {currentUser?.role === 'admin' && (
                <li>
                  <button
                    onClick={() => navigateToView('admin')}
                    className="hover:text-amber-600 dark:hover:text-amber-400 font-bold transition-colors cursor-pointer"
                  >
                    {t.navAdminDashboard}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500 text-[11px] font-medium">
          <span>{t.copyright}</span>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'fr' ? 'Plateforme Officielle Certifiée' : 'منصة رسمية آمنة ومفحوصة'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
