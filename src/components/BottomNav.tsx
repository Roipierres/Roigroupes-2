import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Grid,
  Search,
  User,
  LayoutGrid
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    lang,
    navigateToView,
    setIsAuthModalOpen,
    currentUser,
    setIsAllAppsModalOpen,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    currentView
  } = useApp();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe-area-inset-bottom pt-2 px-4 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Tab 1: Home */}
        <button
          onClick={() => navigateToView('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            currentView === 'home' ? 'text-amber-500 font-black' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${currentView === 'home' ? 'bg-amber-500/10' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">{lang === 'fr' ? 'Accueil' : 'الرئيسية'}</span>
        </button>

        {/* Tab 2: All Apps / Catalog */}
        <button
          onClick={() => {
            setSelectedCategoryFilter('all');
            navigateToView('all_apps');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
            currentView === 'all_apps' ? 'text-amber-500 font-black' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 px-4 rounded-full transition-colors ${currentView === 'all_apps' ? 'bg-amber-500/10' : ''}`}>
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">{lang === 'fr' ? 'Catalog' : 'تطبيقاتي'}</span>
        </button>

        {/* Tab 3: Search */}
        <button
          onClick={() => setIsAllAppsModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
        >
          <div className="p-1.5 rounded-xl">
            <Search className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">{lang === 'fr' ? 'Chercher' : 'البحث'}</span>
        </button>

        {/* Tab 4: Account / Profile */}
        <button
          onClick={() => {
            if (currentUser) {
              navigateToView('profile_settings');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            currentView === 'profile_settings' ? 'text-amber-500 font-black' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${currentView === 'profile_settings' ? 'bg-amber-500/10' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">{lang === 'fr' ? 'Profil' : 'حسابي'}</span>
        </button>
      </div>
    </div>
  );
};

