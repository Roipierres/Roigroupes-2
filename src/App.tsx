import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { AppGrid } from './components/AppGrid';
import { CategoryViewPage } from './components/CategoryViewPage';
import { AppDetailPage } from './components/AppDetailPage';
import { AIAppAssistant, AIAppAssistantModal, AIAppAssistantButton } from './components/AIAppAssistant';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdBanner } from './components/AdBanner';
import { AuthModal } from './components/AuthModal';
import { DownloadModal } from './components/DownloadModal';
import { AllAppsModal } from './components/AllAppsModal';
import { PinnedAppsBanner } from './components/PinnedAppsBanner';
import { ProfilePage } from './components/ProfilePage';
import { FloatingAdsModal } from './components/FloatingAdsModal';
import { FeaturedAppModal } from './components/FeaturedAppModal';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { SelectedAppCard } from './components/SelectedAppCard';
import { ArrowLeft, Grid } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, lang, setIsAllAppsModalOpen, isLoading, siteSettings } = useApp();

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
        {/* Background Radial Glow removed as per user request */}

        {/* Logo Container with Orbiting Colorful Particles */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-indigo-500 blur-md opacity-40 animate-pulse" />

          {/* Outer Ring 1: Clockwise Spinning Gradient Arc */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-transparent border-t-amber-500 border-r-emerald-400 border-b-cyan-400 border-l-purple-500 animate-spin-slow p-1 shadow-lg shadow-amber-500/10" />

          {/* Particles removed as per user request */}

          {/* Central Logo Emblem Showcase */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border-2 border-amber-500/60 p-1.5 shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all overflow-hidden group">
              <img
                src={logoPath}
                alt="RGS"
                className="w-full h-full object-cover animate-pulse"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <span className="text-3xl font-black text-white tracking-widest flex items-center" dir="ltr">
            RG<span className="text-red-500">S</span>
          </span>
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
          <div className="w-full flex flex-col gap-2 sm:gap-4 pb-12">
            <Hero />

            {/* Smart Software Development AI Assistant */}
            {siteSettings.appFeatures?.enableAIStoreAssistant !== false && <AIAppAssistantButton />}

            {/* Selected / Featured Application under AI Assistant */}
            <SelectedAppCard />
          </div>
        )}

        {/* Standalone Category Page */}
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

        {/* Standalone Profile Settings Page */}
        {currentView === 'profile_settings' && (
          <ProfilePage />
        )}
      </main>

      <Footer />
      <BottomNav />

      {/* Global Modals */}
      <AuthModal />
      <DownloadModal />
      <AllAppsModal />
      <FloatingAdsModal />
      <FeaturedAppModal />
      {siteSettings.appFeatures?.enableAIStoreAssistant !== false && <AIAppAssistantModal />}
      
      {/* Floating Action Buttons */}
      <FloatingActions />
      
      {/* Toast Notifications */}
      <ToastContainer />
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
