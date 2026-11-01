import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { AppGrid } from './components/AppGrid';
import { CategoryViewPage } from './components/CategoryViewPage';
import { AppDetailPage } from './components/AppDetailPage';
import { AIAppAssistant, AIAppAssistantModal } from './components/AIAppAssistant';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdBanner } from './components/AdBanner';
import { AuthModal } from './components/AuthModal';
import { DownloadModal } from './components/DownloadModal';
import { AllAppsModal } from './components/AllAppsModal';
import { PinnedAppsBanner } from './components/PinnedAppsBanner';
import { FloatingAdsModal } from './components/FloatingAdsModal';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ArrowLeft, Grid } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, lang, setIsAllAppsModalOpen, isLoading } = useApp();

  React.useEffect(() => {
    // Ensure viewport meta tag is standard and not zoomed or restricted
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover');
    }
  }, []);

  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Background Radial Glow */}
        <div className="absolute w-96 h-96 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />

        {/* Logo Container with Orbiting Colorful Particles */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-indigo-500 blur-md opacity-40 animate-pulse" />

          {/* Outer Ring 1: Clockwise Spinning Gradient Arc */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-transparent border-t-amber-500 border-r-emerald-400 border-b-cyan-400 border-l-purple-500 animate-spin-slow p-1 shadow-lg shadow-amber-500/10" />

          {/* Orbiting Particle Ring 1 (Clockwise Orbit) */}
          <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full animate-spin-slow pointer-events-none">
            {/* Top Dot - Gold */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_12px_#f59e0b] animate-ping" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_12px_#f59e0b]" />

            {/* Right Dot - Emerald Green */}
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-emerald-400 rounded-full shadow-[0_0_12px_#10b981]" />

            {/* Bottom Dot - Purple/Indigo */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 bg-purple-400 rounded-full shadow-[0_0_12px_#a855f7]" />

            {/* Left Dot - Cyan/Blue */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#06b6d4]" />
          </div>

          {/* Orbiting Particle Ring 2 (Counter-Clockwise Orbit with Diagonal Dots) */}
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full animate-spin-reverse-fast pointer-events-none">
            {/* Top-Right Dot - Pink */}
            <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]" />

            {/* Bottom-Right Dot - Yellow */}
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_10px_#fde047]" />

            {/* Bottom-Left Dot - Teal */}
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_10px_#2dd4bf]" />

            {/* Top-Left Dot - Red/Orange */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-rose-400 rounded-full shadow-[0_0_10px_#fb7185]" />
          </div>

          {/* Central Logo Emblem Showcase */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border-2 border-amber-500/60 p-1.5 shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all overflow-hidden group">
              <img
                src={logoPath}
                alt="RoiGroupes Holding Logo"
                className="w-full h-full object-cover rounded-2xl animate-pulse"
              />
            </div>
          </div>
        </div>

        {/* Loading Text & Branding */}
        <div className="mt-8 text-center relative" dir="ltr" style={{ direction: 'ltr' }}>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider flex items-center justify-center">
            <span>RoiGroupe</span>
            <span className="text-red-500 font-black animate-pulse-glow-s inline-block ml-0.5">S</span>
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors">
      <Header />

      <main className="flex-1 w-full overflow-x-hidden">
        {/* Concise Streamlined Homepage */}
        {currentView === 'home' && (
          <div className="w-full flex flex-col gap-2 sm:gap-4">
            <Hero />
            <PinnedAppsBanner />
            <CategoryShowcase />

            {/* Smart Software Development AI Assistant (المساعد الذكي لبرمجة التطبيقات والمواقع - في الأعلى) */}
            <AIAppAssistant />

            {/* Professional Button to Show All Apps (دليل التطبيقات - في الأسفل) */}
            <div className="py-8 sm:py-12 px-4 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800 my-4 sm:my-6">
              <div className="mb-4 sm:mb-6 max-w-lg">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
                  {lang === 'fr' ? 'Découvrir tout le catalogue' : 'اكتشف كامل دليل تطبيقات RoiGroupes'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {lang === 'fr' 
                    ? 'Accédez à plus de 980 applications officielles et sécurisées dans toutes les catégories.'
                    : 'تصفح أكثر من 980 تطبيقاً رسمياً وموثوقاً في مختلف الفئات التجارية والعائلية والأمنية.'}
                </p>
              </div>

              <button
                onClick={() => setIsAllAppsModalOpen(true)}
                className="group relative flex items-center gap-3 px-6 sm:px-10 py-3.5 sm:py-4 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity dark:hidden" />
                <Grid className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                <span className="relative z-10">{lang === 'fr' ? 'Afficher toutes les applications' : 'عرض جميع التطبيقات'}</span>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Standalone Category Page (الصفحة المستقلة للفئة المختارة) */}
        {currentView === 'category_view' && (
          <>
            <CategoryViewPage />
            <AdBanner placement="in_feed" />
          </>
        )}

        {/* All Apps View */}
        {currentView === 'all_apps' && (
          <>
            <AppGrid />
            <AdBanner placement="in_feed" />
          </>
        )}

        {/* Standalone Single App Page */}
        {currentView === 'app_detail' && (
          <>
            <AppDetailPage />
            <AdBanner placement="detail" />
          </>
        )}

        {/* Admin Dashboard Page */}
        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <DownloadModal />
      <AllAppsModal />
      <FloatingAdsModal />
      <AIAppAssistantModal />
      
      {/* Floating Action Buttons (WhatsApp & AI Assistant) */}
      <FloatingActions />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
