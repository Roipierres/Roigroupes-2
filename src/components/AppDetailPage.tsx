import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatDownloadCount } from '../utils/helpers';
import {
  Star,
  Download,
  ShieldCheck,
  Calendar,
  Layers,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  Send,
  ThumbsUp,
  ArrowRight,
  ArrowLeft,
  X,
  Share2,
  Info,
  Clock,
  Loader2,
  Zap,
  Check,
  RotateCcw,
  Sparkles,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import { UserPublicProfileModal } from './UserPublicProfileModal';
import { UserAccount } from '../types';

export const AppDetailPage: React.FC = () => {
  const {
    lang,
    t,
    selectedApp,
    reviews,
    currentUser,
    loginSocial,
    addReview,
    recordDownload,
    navigateToView,
    addToast,
    siteSettings,
    setIsAuthModalOpen,
    users
  } = useApp();

  const [selectedProfileUser, setSelectedProfileUser] = useState<UserAccount | null>(null);

  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- ON-PAGE LIVE DOWNLOAD PROGRESS STATE ---
  const [isDownloadingOnPage, setIsDownloadingOnPage] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadedBytesMB, setDownloadedBytesMB] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<string>('2.4 MB/s');
  const [isDownloadFinished, setIsDownloadFinished] = useState<boolean>(false);

  useEffect(() => {
    setIsDownloadingOnPage(false);
    setDownloadProgress(0);
    setDownloadedBytesMB(0);
    setIsDownloadFinished(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedApp]);

  if (!selectedApp) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-4">
            {lang === 'fr' ? 'Aucune application sélectionnée.' : 'لم يتم اختيار أي تطبيق.'}
          </p>
          <button
            onClick={() => navigateToView('home')}
            className="px-6 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
          >
            {lang === 'fr' ? 'Retour à l\'accueil' : 'العودة للرئيسية'}
          </button>
        </div>
      </div>
    );
  }

  const title = lang === 'fr' ? selectedApp.titleFr : selectedApp.title;
  const fullDesc = lang === 'fr' ? selectedApp.fullDescFr : selectedApp.fullDesc;
  const badge = lang === 'fr' ? selectedApp.badgeFr : selectedApp.badge;
  const features = lang === 'fr' ? selectedApp.featuresFr : selectedApp.features;
  const totalSizeMB = parseFloat(selectedApp.size) || 25;

  const appReviews = reviews.filter(
    (r) => r.appId === selectedApp.id && r.status === 'approved'
  );

  const handleStartOnPageDownload = async (device: 'Android' | 'iOS' = 'Android') => {
    if (isDownloadingOnPage) return;

    const downloadUrl = selectedApp.uploadedFileBlobUrl || selectedApp.downloadLinks.androidUrl;
    if (!downloadUrl) return;

    setIsDownloadingOnPage(true);
    setDownloadProgress(0);
    setDownloadedBytesMB(0);
    setIsDownloadFinished(false);
    
    addToast(
      lang === 'fr' ? `Démarrage du téléchargement : ${selectedApp.titleFr}` : `بدأ تحميل تطبيق: ${selectedApp.title}`,
      'info'
    );

    const totalSizeMB = parseFloat(selectedApp.size) || 25;
    const fileName = selectedApp.uploadedFileName || `${selectedApp.slug}.apk`;
    let downloadSuccess = false;

    try {
      const response = await fetch(downloadUrl);
      
      // Check if the response is valid and not an HTML error page
      const contentType = response.headers.get('content-type');
      if (!response.ok || (contentType && contentType.includes('text/html'))) {
        throw new Error(`Invalid response type: ${contentType}. Likely an error page or expired link.`);
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Body reader not available');

      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        if (total > 0) {
          const progress = Math.min(100, Math.round((loaded / total) * 100));
          setDownloadProgress(progress);
          setDownloadedBytesMB(Math.round((loaded / (1024 * 1024)) * 10) / 10);
        } else {
          // If no content-length, just show bytes
          setDownloadedBytesMB(Math.round((loaded / (1024 * 1024)) * 10) / 10);
        }
      }

      const blob = new Blob(chunks, { type: 'application/vnd.android.package-archive' });
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      downloadSuccess = true;
      
      addToast(
        lang === 'fr' ? `Téléchargement terminé : ${selectedApp.titleFr}` : `اكتمل تحميل تطبيق: ${selectedApp.title} بنجاح`,
        'success'
      );
    } catch (e: any) {
      console.error('Download error:', e.message);
      
      // If it's a validation error (e.g. we know it's HTML), don't fallback to direct window.location
      if (e.message.includes('Invalid response type')) {
        addToast(
          lang === 'fr' ? `Lien expiré ou erreur serveur (HTML)` : `الرابط منتهي الصلاحية أو حدث خطأ في الخادم`,
          'error'
        );
      } else {
        // Attempt fallback direct download for network issues
        try {
          window.location.href = downloadUrl;
          downloadSuccess = true;
          addToast(
            lang === 'fr' ? `Démarrage du téléchargement direct : ${selectedApp.titleFr}` : `بدأ التحميل المباشر لتطبيق: ${selectedApp.title}`,
            'success'
          );
        } catch (err) {
          addToast(
            lang === 'fr' ? `Échec du téléchargement` : `فشل تحميل التطبيق، يرجى المحاولة لاحقاً`,
            'error'
          );
        }
      }
    }

    setIsDownloadFinished(true);
    setIsDownloadingOnPage(false);
    recordDownload(selectedApp.id, device);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      addReview(selectedApp.id, ratingInput, commentInput);
      setCommentInput('');
      setIsSubmitting(false);
    }, 400);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareText = lang === 'fr' 
      ? `Découvrez ${selectedApp.titleFr} sur RoiGroupes !` 
      : `اكتشف تطبيق ${selectedApp.title} على منصة RoiGroupes!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        addToast(
          lang === 'fr' ? 'Lien copié dans le presse-papiers !' : 'تم نسخ رابط الصفحة بنجاح!',
          'success'
        );
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Immersive Sticky Header with Basic Stats */}
      <div className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-amber-500/20 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigateToView('home')}
            className="p-2 text-slate-500 hover:text-amber-500 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
          </button>
          
          <div className="flex-1 px-4 hidden sm:block">
            <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">{title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="font-bold text-amber-500">{selectedApp.rating} <Star className="inline-block w-2.5 h-2.5 fill-amber-500" /></span>
              <span>•</span>
              <span>{selectedApp.size}</span>
            </div>
          </div>

          <button
            onClick={() => handleStartOnPageDownload('Android')}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_35px_rgba(245,158,11,0.9)] border border-amber-300/80 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Download className="w-4 h-4 animate-bounce" />
              <span>{isDownloadingOnPage ? `${downloadProgress}%` : t.downloadNow}</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Presentation Window */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-amber-500/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden mb-10 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left/Top Content Area */}
            <div className="lg:col-span-8 p-8 sm:p-12 border-b lg:border-b-0 lg:ltr:border-r lg:rtl:border-l border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row items-start gap-8 mb-10">
                {/* Large App Icon */}
                <div className="w-28 h-24 sm:w-36 sm:h-36 rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-amber-600 dark:from-slate-950 dark:to-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl flex items-center justify-center text-white dark:text-amber-500 font-black text-5xl sm:text-6xl shrink-0 transform -rotate-2 overflow-hidden">
                  <SafeImage
                    src={selectedApp.screenshots?.[0] || (selectedApp.icon?.startsWith('http') ? selectedApp.icon : undefined)}
                    iconName={!selectedApp.screenshots?.[0] && !selectedApp.icon?.startsWith('http') ? selectedApp.icon : undefined}
                    alt={title}
                    fallbackTitle={title}
                    fallbackType="icon"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">{badge}</span>
                    <span className="px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold border border-slate-100 dark:border-slate-700/50">{selectedApp.developer}</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white leading-tight mb-6 tracking-tight">{title}</h1>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-8 max-w-2xl">{fullDesc}</p>
                  
                  {/* Action Row */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <button
                      onClick={() => handleStartOnPageDownload('Android')}
                      disabled={isDownloadingOnPage}
                      className="group relative px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:shadow-[0_0_45px_rgba(245,158,11,0.9)] border-2 border-amber-300/80 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden flex items-center justify-center gap-3 shrink-0"
                    >
                      <Download className="w-6 h-6 animate-bounce text-slate-950" />
                      <span className="relative z-10">{isDownloadingOnPage ? `${downloadProgress}%` : t.downloadNow}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>

                    <div className="flex items-center gap-2 text-amber-500 font-black text-2xl">
                      <Star className="w-6 h-6 fill-amber-500" />
                      <span>{selectedApp.rating}</span>
                      <span className="text-sm text-slate-400 font-normal">/ 5.0</span>
                    </div>
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-extrabold text-base">
                      <Download className="w-5 h-5 text-amber-500" />
                      <span>{formatDownloadCount(selectedApp.downloadsCount, lang, 333)} {lang === 'fr' ? 'Installs' : 'عملية تثبيت'}</span>
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleShare}
                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm border border-slate-200 dark:border-slate-700"
                      >
                        <Share2 className="w-4 h-4 text-amber-500" />
                        <span>{t.shareApp}</span>
                      </button>

                      {/* Social Media Icons */}
                      <div className="flex items-center gap-4 justify-center sm:justify-start">
                        {siteSettings.facebookLink && (
                          <a 
                            href={siteSettings.facebookLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                            title="Facebook"
                          >
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {siteSettings.instagramLink && (
                          <a 
                            href={siteSettings.instagramLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-pink-600/10 text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-xs"
                            title="Instagram"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {siteSettings.tiktokLink && (
                          <a 
                            href={siteSettings.tiktokLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 transition-all shadow-xs"
                            title="TikTok"
                          >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.46-.35-.24-.68-.51-1-.81l-.01 7.15c.03 3.25-1.47 6.47-4.48 7.82-3.23 1.48-7.34.82-9.75-1.78-2.61-2.73-2.69-7.4-.18-10.23 1.71-1.95 4.34-2.88 6.91-2.48v4.11c-.74-.16-1.54-.15-2.25.18-.9.41-1.52 1.27-1.68 2.24-.26 1.34.56 2.8 1.89 3.19.89.26 1.93.07 2.67-.53.7-.55 1.05-1.46 1.04-2.35l.02-12.16z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshots Gallery - Horizontal Scroll */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    <span>{t.screenshotsTitle}</span>
                  </h3>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none">
                  {selectedApp.screenshots?.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveScreenshot(img)}
                      className="min-w-[300px] sm:min-w-[420px] aspect-video rounded-[2rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 cursor-pointer hover:scale-[1.03] transition-all duration-500 bg-slate-50 dark:bg-slate-800 group relative shadow-xl"
                    >
                      <SafeImage
                        src={img}
                        alt={`Screenshot ${i + 1}`}
                        fallbackTitle={title}
                        fallbackType="screenshot"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
                          {lang === 'fr' ? 'Agrandir' : 'تكبير الصورة'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Grid */}
              <div className="pt-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span>{t.featuresTitle}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 group hover:border-emerald-500/30 transition-colors">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Info & Community Area */}
            <div className="lg:col-span-4 bg-slate-50/50 dark:bg-slate-950/30 p-6 sm:p-10">
              <div className="space-y-8">
                {/* Download Progress Card */}
                {(isDownloadingOnPage || isDownloadFinished) && (
                  <div className="bg-slate-900 rounded-3xl border border-amber-500/30 p-5 shadow-xl animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{isDownloadFinished ? 'Fichier Prêt' : 'Téléchargement...'}</span>
                      <span className="text-lg font-black text-white font-mono">{downloadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-3 p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono italic">
                      <Loader2 className={`w-3 h-3 ${!isDownloadFinished && 'animate-spin'}`} />
                      <span>{downloadedBytesMB}MB / {totalSizeMB}MB</span>
                    </div>
                  </div>
                )}

                {/* Tech Specs List */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'fr' ? 'Fiche Technique' : 'المعلومات التقنية'}</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-500">{lang === 'fr' ? 'Version' : 'الإصدار'}</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{selectedApp.version}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-500">{lang === 'fr' ? 'Taille' : 'الحجم'}</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{selectedApp.size}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-500">{lang === 'fr' ? 'Mise à jour' : 'تاريخ التحديث'}</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white font-mono">{selectedApp.updatedDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-500">{lang === 'fr' ? 'Sécurité' : 'حالة الأمان'}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">{lang === 'fr' ? 'Vérifié' : 'محمي'}</span>
                    </div>
                  </div>
                </div>

                {/* Community Reviews Section */}
                {siteSettings.appFeatures?.enableAppReviews !== false && (
                  <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-amber-500" />
                      <span>{t.commentsTitle}</span>
                    </h3>

                    {/* Add Review */}
                    <div className="mb-8 p-6 rounded-[2rem] bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden relative">
                      <div className="absolute top-0 ltr:right-0 rtl:left-0 p-4 opacity-10">
                        <Star className="w-16 h-16 fill-amber-500 text-amber-500" />
                      </div>
                      
                      <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>{lang === 'fr' ? 'Évaluer ce produit' : 'تقييم هذا التطبيق'}</span>
                      </h4>

                      {currentUser ? (
                        isDownloadFinished ? (
                          <form onSubmit={handleCommentSubmit} className="relative z-10">
                            <div className="flex items-center gap-1.5 mb-5 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 w-fit">
                              {[1,2,3,4,5].map(s => (
                                <Star 
                                  key={s} 
                                  onClick={() => setRatingInput(s)}
                                  className={`w-6 h-6 cursor-pointer transition-all duration-300 ${s <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700 hover:text-amber-300'}`} 
                                />
                              ))}
                              <span className="ltr:ml-3 rtl:mr-3 text-lg font-black text-amber-500 font-mono">{ratingInput}.0</span>
                            </div>
                            
                            <div className="relative">
                              <textarea 
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder={t.commentPlaceholder}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400 min-h-[100px] transition-all resize-none shadow-inner"
                              />
                              <div className="absolute bottom-3 ltr:right-3 rtl:left-3 text-[10px] text-slate-400 font-bold">
                                {commentInput.length}/500
                              </div>
                            </div>

                            <button 
                              type="submit" 
                              disabled={isSubmitting || !commentInput.trim()}
                              className="w-full mt-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-amber-400 dark:to-amber-500 text-white dark:text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale cursor-pointer group"
                            >
                              {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                                  <span>{t.submitComment}</span>
                                </>
                              )}
                            </button>
                          </form>
                        ) : (
                          <div className="text-center py-6 bg-amber-500/5 border-2 border-dashed border-amber-500/20 rounded-2xl">
                            <Download className="w-8 h-8 text-amber-500 mx-auto mb-3 animate-bounce" />
                            <p className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 px-4">
                              {lang === 'fr' 
                                ? 'Veuillez télécharger l\'application pour pouvoir l\'évaluer.' 
                                : 'يرجى تحميل التطبيق وتجربته أولاً لتتمكن من إضافة تقييمك الخاص.'}
                            </p>
                            <button 
                              onClick={() => handleStartOnPageDownload('Android')}
                              className="mt-4 text-[10px] font-black text-amber-500 underline uppercase tracking-widest cursor-pointer hover:text-amber-400"
                            >
                              {lang === 'fr' ? 'Télécharger maintenant' : 'التحميل الآن'}
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                          <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 px-4 mb-4">
                            {lang === 'fr' 
                              ? 'Seuls les membres inscrits peuvent évaluer les applications.' 
                              : 'نظام التقييم مخصص فقط للأعضاء المسجلين بالمنصة لضمان جودة المراجعات.'}
                          </p>
                          <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-black text-[10px] rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-md"
                          >
                            {lang === 'fr' ? 'Se connecter / S\'inscrire' : 'تسجيل الدخول / إنشاء حساب'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {appReviews.length === 0 ? (
                        <p className="text-[11px] text-slate-500 text-center py-4">{t.noCommentsYet}</p>
                      ) : (
                        appReviews.map(rev => (
                          <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 shadow-xs">
                            <div className="flex items-center justify-between mb-2">
                              <button 
                                onClick={() => {
                                  const user = users.find(u => u.email === rev.userEmail);
                                  if (user) setSelectedProfileUser(user);
                                }}
                                className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer group"
                              >
                                <img src={rev.userAvatar} className="w-6 h-6 rounded-full object-cover border border-amber-500/30 group-hover:border-amber-500" alt="" />
                                <span className="text-[10px] font-black text-slate-900 dark:text-white truncate max-w-[80px] group-hover:text-amber-500">{rev.userName}</span>
                              </button>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => <Star key={s} className={`w-2.5 h-2.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />)}
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Screenshot */}
      {activeScreenshot && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setActiveScreenshot(null)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveScreenshot(null)} className="absolute -top-12 ltr:right-0 rtl:left-0 p-3 text-white hover:text-amber-500 transition-colors">
              <X className="w-8 h-8" />
            </button>
            <SafeImage
              src={activeScreenshot}
              alt="Screenshot"
              fallbackTitle={title}
              fallbackType="screenshot"
              className="w-full h-auto max-h-[85vh] object-contain rounded-3xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
      {/* Public Profile Modal */}
      <UserPublicProfileModal 
        user={selectedProfileUser} 
        onClose={() => setSelectedProfileUser(null)} 
      />
    </div>
  );
};
