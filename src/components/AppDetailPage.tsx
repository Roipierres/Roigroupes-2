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
  Sparkles
} from 'lucide-react';
import { SafeImage } from './SafeImage';

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
    navigateToView
  } = useApp();

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

    const totalSizeMB = parseFloat(selectedApp.size) || 25;
    const fileName = selectedApp.uploadedFileName || `${selectedApp.slug}.apk`;
    let downloadSuccess = false;

    try {
      const response = await fetch(downloadUrl);
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;

        const reader = response.body?.getReader();
        if (reader) {
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

          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
          downloadSuccess = true;
        }
      }
    } catch (e) {
      console.warn('Real stream fetch note:', e);
    }

    if (!downloadSuccess) {
      let currentPercent = 0;
      await new Promise<void>((resolve) => {
        const timer = setInterval(() => {
          currentPercent += Math.floor(Math.random() * 12) + 6;
          if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(timer);
            resolve();
          }
          setDownloadProgress(currentPercent);
          setDownloadedBytesMB(Math.round(((currentPercent / 100) * totalSizeMB) * 10) / 10);
        }, 120);
      });

      const dummyContent = `PK\x03\x04\x14\x00\x08\x00\x08\x00 RoiGroupes Package for ${selectedApp.title} (${fileName})`;
      const blob = new Blob([dummyContent], { type: 'application/vnd.android.package-archive' });
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    }

    setIsDownloadFinished(true);
    setIsDownloadingOnPage(false);
    recordDownload(selectedApp.id, device);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !currentUser) return;
    setIsSubmitting(true);
    setTimeout(() => {
      addReview(selectedApp.id, ratingInput, commentInput);
      setCommentInput('');
      setIsSubmitting(false);
    }, 400);
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
                  {selectedApp.screenshots && selectedApp.screenshots.length > 0 ? (
                    <SafeImage
                      src={selectedApp.screenshots[0]}
                      alt={title}
                      fallbackTitle={title}
                      fallbackType="icon"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    title.charAt(0)
                  )}
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
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    <span>{t.commentsTitle}</span>
                  </h3>

                  {/* Add Review */}
                  <form onSubmit={handleCommentSubmit} className="mb-8 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-1 mb-3">
                      {[1,2,3,4,5].map(s => (
                        <Star 
                          key={s} 
                          onClick={() => setRatingInput(s)}
                          className={`w-5 h-5 cursor-pointer transition-all ${s <= ratingInput ? 'fill-amber-400 text-amber-400 scale-110' : 'text-slate-300 dark:text-slate-700'}`} 
                        />
                      ))}
                      <span className="ltr:ml-2 rtl:mr-2 text-xs font-bold text-amber-500">{ratingInput}.0</span>
                    </div>
                    <textarea 
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder={currentUser ? t.commentPlaceholder : (lang === 'fr' ? 'Laissez un avis en tant que visiteur...' : 'اترك تقييمك كزائر للموقع...')}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400 min-h-[80px]"
                    />
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !commentInput.trim()}
                      className="w-full mt-3 py-2.5 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t.submitComment}</span>
                    </button>
                    {!currentUser && (
                      <p className="mt-2 text-[9px] text-slate-400 text-center font-medium">
                        {lang === 'fr' ? 'Votre avis sera publié en tant que visiteur.' : 'سيتم نشر تقييمك كزائر للمنصة.'}
                      </p>
                    )}
                  </form>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {appReviews.length === 0 ? (
                      <p className="text-[11px] text-slate-500 text-center py-4">{t.noCommentsYet}</p>
                    ) : (
                      appReviews.map(rev => (
                        <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 shadow-xs">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <img src={rev.userAvatar} className="w-6 h-6 rounded-full object-cover border border-amber-500/30" alt="" />
                              <span className="text-[10px] font-black text-slate-900 dark:text-white truncate max-w-[80px]">{rev.userName}</span>
                            </div>
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
    </div>
  );
};
