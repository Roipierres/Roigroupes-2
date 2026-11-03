import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Download, X, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const { siteSettings, lang } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Dynamic Manifest Update
  useEffect(() => {
    if (siteSettings.pwaTitle) {
      const params = new URLSearchParams({
        name: siteSettings.pwaTitle,
        short_name: siteSettings.pwaShortName || 'RoiGroupes',
        start_url: siteSettings.pwaStartUrl || '/',
        icon: siteSettings.pwaIcon || '/assets/aistudio/1793173133604_a080e212.jpg'
      });
      const manifestUrl = `/api/manifest?${params.toString()}`;
      document.getElementById('pwa-manifest')?.setAttribute('href', manifestUrl);
      document.getElementById('pwa-apple-icon')?.setAttribute('href', siteSettings.pwaIcon || '/assets/aistudio/1793173133604_a080e212.jpg');
    }
  }, [siteSettings]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] sm:text-xs rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300/50 overflow-hidden"
      >
        <Smartphone className="w-3.5 h-3.5 animate-pulse" />
        <span>{lang === 'fr' ? 'Installer l\'App Officielle' : 'تثبيت التطبيق الرسمي'}</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowGuide(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 border-2 border-amber-500/50 p-2 mx-auto shadow-xl">
                <img src={siteSettings.pwaIcon || '/assets/aistudio/1793173133604_a080e212.jpg'} alt="App Icon" className="w-full h-full object-cover rounded-2xl" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {siteSettings.pwaTitle || (lang === 'fr' ? 'Application RoiGroupes' : 'تطبيق RoiGroupes')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {lang === 'fr' 
                    ? 'Ajoutez l\'application à votre écran d\'accueil pour un accès rapide et sécurisé.' 
                    : 'قم بإضافة المنصة لشاشة هاتفك الرئيسية للوصول السريع والآمن بضغطة واحدة.'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left rtl:text-right space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[10px] shrink-0">1</div>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'fr' ? 'Appuyez sur le bouton Partager (iOS) ou Menu (Android).' : 'اضغط على زر المشاركة (iOS) أو خيارات المتصفح (Android).'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[10px] shrink-0">2</div>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'fr' ? 'Choisissez "Sur l\'écran d\'accueil".' : 'اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowGuide(false)}
                className="w-full py-4 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all"
              >
                {lang === 'fr' ? 'J\'ai compris' : 'فهمت، شكراً'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
