import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SafeImage } from './SafeImage';
import { 
  Crown, 
  Star, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Eye,
  Layers,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';

export const SelectedAppCard: React.FC = () => {
  const { 
    lang, 
    apps, 
    selectedApp, 
    siteSettings, 
    recordDownload,
    categories,
    navigateToView 
  } = useApp();

  // Find the selected app (prioritizing current selection, then featured settings, then isFeatured, then first app)
  const app = selectedApp
    || (siteSettings?.featuredAppId ? apps.find(a => a.id === siteSettings.featuredAppId) : null)
    || apps.find(a => a.isFeatured)
    || apps[0];

  const [activeScreenshotModal, setActiveScreenshotModal] = useState<string | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  if (!app) return null;

  const title = lang === 'fr' ? app.titleFr : app.title;
  const shortDesc = lang === 'fr' ? app.shortDescFr : app.shortDesc;
  const fullDesc = lang === 'fr' ? (app.fullDescFr || app.shortDescFr) : (app.fullDesc || app.shortDesc);
  const features = lang === 'fr' ? (app.featuresFr || app.features) : (app.features || []);
  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';

  const categoryItem = categories.find(c => c.id === app.category);
  const categoryName = categoryItem 
    ? (lang === 'fr' ? categoryItem.nameFr : categoryItem.nameAr)
    : (app.category === 'commercial' ? (lang === 'fr' ? 'Commercial' : 'تجاري') : (lang === 'fr' ? 'Général' : 'عام'));

  const screenshots = (app.screenshots && app.screenshots.length > 0)
    ? app.screenshots
    : [
        'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80'
      ];

  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(15);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setIsDownloading(false);
      recordDownload(app.id);
    }, 1200);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-3 sm:px-6 my-4 sm:my-6">
      {/* Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-amber-500/40 shadow-2xl overflow-hidden transition-all">
        
        {/* Top Header Label Bar */}
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-100 dark:via-slate-900 to-amber-500/15 px-5 sm:px-8 py-3.5 border-b border-amber-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs">
              <Crown className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{lang === 'fr' ? 'Détails de l\'Application Sélectionnée' : 'نافذة التطبيق المختار'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                  {lang === 'fr' ? 'Direct & Complet' : 'عرض مباشر وشامل'}
                </span>
              </span>
            </div>
          </div>

          <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            {categoryName} • v{app.version}
          </span>
        </div>

        {/* 1. Main Header & Identity Info Block */}
        <div className="p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            {/* Large Squircle Icon */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-500 font-black text-3xl shadow-lg shrink-0 overflow-hidden">
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

            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                {shortDesc}
              </p>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{app.rating}</span>
                  <span className="text-slate-400 text-[10px]">({app.reviewsCount || 120})</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{app.size}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lang === 'fr' ? 'Certifié Sécurisé' : 'فحص أمني معتمد'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Download Action Button & Progress */}
          <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>{isDownloading ? (lang === 'fr' ? 'Téléchargement...' : 'جاري التحميل...') : (lang === 'fr' ? 'Installer l\'application (APK)' : 'تثبيت التطبيق مباشرة (APK)')}</span>
            </button>

            {isDownloading && (
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300" 
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            )}

            <span className="text-[10px] text-slate-400 font-medium">
              {lang === 'fr' ? 'Téléchargement direct et gratuit du fichier APK' : 'تحميل مجاني ومباشر لحزمة APK'}
            </span>
          </div>
        </div>

        {/* 2. Video Player Section (If Available) */}
        {app.videoUrl && (
          <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-500" />
                <span>{lang === 'fr' ? 'Démonstration Vidéo Officielle' : 'فيديو توضيحي رسمي للتطبيق'}</span>
              </span>

              <button
                type="button"
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="p-1.5 rounded-xl bg-slate-800 text-amber-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-[10px]">{isVideoMuted ? (lang === 'fr' ? 'Son coupé' : 'الصوت مكتوم') : (lang === 'fr' ? 'Son activé' : 'الصوت مفعل')}</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl bg-black aspect-video max-h-80 w-full mx-auto">
              <video 
                src={app.videoUrl} 
                className="w-full h-full object-cover" 
                autoPlay 
                loop 
                playsInline 
                muted={isVideoMuted}
                controls
              />
            </div>
          </div>
        )}

        {/* 3. Screenshots Carousel / Gallery Section */}
        <div className="p-5 sm:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-500" />
              <span>{lang === 'fr' ? 'Captures d\'écran de l\'application' : 'معرض صور وواجهات التطبيق'}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {lang === 'fr' ? 'Cliquez pour agrandir' : 'اضغط على الصورة للتكبير'}
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-amber-500/20">
            {screenshots.map((imgUrl, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveScreenshotModal(imgUrl)}
                className="relative shrink-0 w-44 sm:w-56 aspect-[9/16] rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700/80 shadow-md hover:border-amber-500/80 hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <SafeImage
                  src={imgUrl}
                  alt={`${title} screenshot ${idx + 1}`}
                  fallbackTitle={title}
                  fallbackType="screenshot"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                  <span className="p-2 rounded-full bg-amber-500 text-slate-950 shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Full Technical Description & Features */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Full Description */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{lang === 'fr' ? 'À propos de l\'application' : 'نبذة تفصيلية عن التطبيق ومميزاته'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
              {fullDesc}
            </p>
          </div>

          {/* Right Column: Key Features */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'fr' ? 'Fonctionnalités clés incluses' : 'الوظائف والخصائص المتضمنة'}</span>
            </h4>

            {features.length > 0 ? (
              <ul className="space-y-2.5">
                {features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                    <span className="p-1 rounded-full bg-emerald-500/15 text-emerald-500 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">
                {lang === 'fr' ? 'Toutes les fonctionnalités sont disponibles dans la version complète.' : 'كافة الميزات متوفرة في الإصدار الكامل عند التثبيت.'}
              </p>
            )}
          </div>
        </div>

        {/* 5. Technical Specifications Footer Strip */}
        <div className="bg-slate-50 dark:bg-slate-950/80 px-5 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === 'fr' ? 'Développeur' : 'المطور'}</span>
            <span className="text-xs font-black text-slate-900 dark:text-white truncate block">{app.developer}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === 'fr' ? 'Version' : 'الإصدار'}</span>
            <span className="text-xs font-black text-slate-900 dark:text-white font-mono block">v{app.version}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === 'fr' ? 'Taille du fichier' : 'حجم الحزمة'}</span>
            <span className="text-xs font-black text-slate-900 dark:text-white font-mono block">{app.size}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{lang === 'fr' ? 'Catégorie' : 'فئة التطبيق'}</span>
            <span className="text-xs font-black text-amber-500 font-bold block">{categoryName}</span>
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Screenshots */}
      {activeScreenshotModal && (
        <div 
          onClick={() => setActiveScreenshotModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-amber-500/40 shadow-2xl">
            <button
              onClick={() => setActiveScreenshotModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-500 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={activeScreenshotModal} 
              alt="Screenshot preview" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};
