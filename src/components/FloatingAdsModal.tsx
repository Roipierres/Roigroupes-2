import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Megaphone, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  Download
} from 'lucide-react';
import { SafeImage } from './SafeImage';

export const FloatingAdsModal: React.FC = () => {
  const { 
    floatingAds, 
    ads,
    isFloatingAdsOpen, 
    currentFloatingAdIndex, 
    setCurrentFloatingAdIndex,
    nextFloatingAd, 
    prevFloatingAd, 
    closeFloatingAds,
    lang,
    apps,
    navigateToView,
    recordDownload
  } = useApp();

  const activeFloating = floatingAds.filter(ad => ad.isActive);

  const floatingPlacementAds = (ads || [])
    .filter(a => a.placement === 'floating' && a.isActive)
    .map(a => ({
      id: a.id,
      titleAr: a.title,
      titleFr: a.titleFr || a.title,
      subtitleAr: a.sponsorName ? `إعلان مميز برعاية ${a.sponsorName}` : 'عرض ترويجي خاص وتطبيق معتمد من مجموعة RoiGroupes',
      subtitleFr: a.sponsorName ? `Sponsorisé par ${a.sponsorName}` : 'Offre promotionnelle certifiée RoiGroupes',
      imageUrl: a.imageUrl,
      badgeAr: a.sponsorBadge || 'إعلان عائم مميز',
      badgeFr: a.sponsorBadge || 'Annonce Flottante',
      buttonTextAr: 'تصفح الإعلان والتحميل الفوري',
      buttonTextFr: 'Découvrir L\'Application',
      targetUrl: a.targetUrl,
      appId: a.appId,
      isActive: true
    }));

  const activeAds = [...activeFloating, ...floatingPlacementAds];

  if (!isFloatingAdsOpen || activeAds.length === 0) return null;

  const currentAd = activeAds[currentFloatingAdIndex] || activeAds[0];
  if (!currentAd) return null;

  const title = lang === 'fr' ? currentAd.titleFr : currentAd.titleAr;
  const subtitle = lang === 'fr' ? currentAd.subtitleFr : currentAd.subtitleAr;
  const badge = lang === 'fr' ? (currentAd.badgeFr || `Publicité ${currentFloatingAdIndex + 1} sur ${activeAds.length}`) : (currentAd.badgeAr || `إعلان ترويجي ${currentFloatingAdIndex + 1} من ${activeAds.length}`);
  const buttonText = lang === 'fr' ? currentAd.buttonTextFr : currentAd.buttonTextAr;

  // Handle action click
  const handleActionClick = () => {
    if (currentAd.appId) {
      const linkedApp = apps.find(a => a.id === currentAd.appId);
      if (linkedApp) {
        navigateToView('app_detail', linkedApp);
        closeFloatingAds();
        return;
      }
    }

    if (currentAd.targetUrl && currentAd.targetUrl !== '#') {
      window.open(currentAd.targetUrl, '_blank');
    }

    // Move to next ad in sequence or close if at end
    nextFloatingAd();
  };

  return (
    <AnimatePresence>
      {isFloatingAdsOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Main Floating Banner Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-lg w-full bg-slate-900 border-2 border-amber-500/40 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(245,158,11,0.3)] overflow-hidden my-auto"
          >
            {/* Top Control Bar & Prominent Close Button (X) */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-extrabold text-[10px] sm:text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-amber-500" />
                  <span>{badge}</span>
                </span>
              </div>

              {/* Prominent Close Button (X في الأعلى) */}
              <button
                onClick={closeFloatingAds}
                className="p-2.5 sm:p-3 bg-slate-800 hover:bg-rose-500 text-slate-300 hover:text-white rounded-full border border-slate-700 transition-all cursor-pointer group shadow-lg"
                title={lang === 'fr' ? 'Fermer l\'annonce' : 'إغلاق الإعلان'}
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Banner Image / Media */}
            <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden group">
              <SafeImage
                src={currentAd.imageUrl}
                alt={title}
                fallbackTitle={title}
                fallbackType="screenshot"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
              
              {/* Floating Counter Badge */}
              <div className="absolute top-3 ltr:left-3 rtl:right-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-white/20 text-white font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{currentFloatingAdIndex + 1} / {activeAds.length}</span>
              </div>
            </div>

            {/* Banner Body Content */}
            <div className="p-6 sm:p-8 space-y-4">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                {title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {subtitle}
              </p>

              {/* Step Navigation Dots (يعرض الإعلانات الثلاثة) */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {activeAds.map((ad, idx) => (
                  <button
                    key={ad.id}
                    onClick={() => setCurrentFloatingAdIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentFloatingAdIndex
                        ? 'w-8 bg-amber-500 shadow-md shadow-amber-500/50'
                        : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`إعلان ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                {/* Main Action Button */}
                <button
                  onClick={handleActionClick}
                  className="w-full flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{buttonText}</span>
                </button>

                {/* Next Ad or Dismiss */}
                {activeAds.length > 1 && (
                  <button
                    onClick={nextFloatingAd}
                    className="w-full sm:w-auto py-3.5 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{lang === 'fr' ? 'Annonce suivante' : 'الإعلان التالي'}</span>
                    {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Dismiss All Prompt */}
              <div className="text-center pt-2">
                <button
                  onClick={closeFloatingAds}
                  className="text-[11px] text-slate-500 hover:text-amber-400 transition-colors font-medium cursor-pointer"
                >
                  {lang === 'fr' ? 'Masquer toutes les bannières' : 'إغلاق ومتابعة تصفح الموقع'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
