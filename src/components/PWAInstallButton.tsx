import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, Download, X, CheckCircle2, ShieldCheck, Loader2, ArrowDownCircle } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { siteSettings, lang } = useApp();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apkUrl = siteSettings.officialApkUrl || '/uploads/RoiGroupeS-Official.apk';
  const fileName = 'RoiGroupeS-Official.apk';

  const handleDownloadRealApp = () => {
    setIsModalOpen(true);
    setIsDownloading(true);
    setDownloadProgress(10);
    setIsCompleted(false);

    // Realistic progress animation
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setIsDownloading(false);
      setIsCompleted(true);

      // Trigger actual real native file download
      const a = document.createElement('a');
      a.href = apkUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 1400);
  };

  return (
    <>
      <button
        onClick={handleDownloadRealApp}
        className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-[11px] sm:text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-300/50 overflow-hidden"
        title={lang === 'fr' ? 'Télécharger l\'Application de la Plateforme (APK)' : 'تحميل تطبيق المنصة (APK)'}
      >
        <Smartphone className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
        <span className="flex items-center gap-1">
          <span>{lang === 'fr' ? 'Appli de la Plateforme' : 'تحميل تطبيق المنصة'}</span>
          <span className="text-[9px] bg-slate-950 text-amber-400 px-1.5 py-0.2 rounded font-mono font-bold">APK</span>
        </span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>

      {/* Real App Download & Installation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-slate-950 border-2 border-amber-500/50 p-2 mx-auto shadow-xl relative">
                <img 
                  src={siteSettings.pwaIcon || '/assets/aistudio/1793173133604_a080e212.jpg'} 
                  alt="App Icon" 
                  className="w-full h-full object-cover rounded-2xl" 
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                  APK
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                  <span>{siteSettings.pwaTitle || 'تطبيق RoiGroupeS الرسمي'}</span>
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                  {fileName} • 18.5 MB • Android Package
                </p>
              </div>

              {/* Progress or Completion State */}
              {isDownloading && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                      <span>{lang === 'fr' ? 'Génération et téléchargement de l\'Application de la Plateforme...' : 'جاري تنزيل ملف تطبيق المنصة (APK)...'}</span>
                    </span>
                    <span className="font-mono text-amber-500">{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {lang === 'fr' ? 'Téléchargement direct du paquet Android de la Plateforme' : 'تحميل مباشر لحزمة تطبيق المنصة (APK) بدون وسيط'}
                  </p>
                </div>
              )}

              {isCompleted && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4 text-emerald-800 dark:text-emerald-300 text-center space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h4 className="text-sm font-black">
                      {lang === 'fr' ? 'Téléchargement lancé avec succès !' : 'تم بدء تنزيل ملف التطبيق بنجاح!'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {lang === 'fr'
                        ? 'Le fichier RoiGroupeS-Official.apk a été envoyé vers vos téléchargements.'
                        : 'تم إرسال ملف تطبيق المنصة RoiGroupeS-Official.apk إلى مجلد التنزيلات على هاتفك.'}
                    </p>
                  </div>

                  {/* Real App Installation Steps */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left rtl:text-right space-y-2.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>{lang === 'fr' ? 'Comment installer l\'application :' : 'طريقة تثبيت التطبيق على هاتفك:'}</span>
                    </span>
                    <div className="space-y-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">1</span>
                        <span>{lang === 'fr' ? 'Ouvrez le fichier téléchargé depuis la barre de notifications.' : 'اسحب شريط الإشعارات في هاتفك واضغط على ملف RoiGroupeS-Official.apk.'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">2</span>
                        <span>{lang === 'fr' ? 'Autorisez l\'installation de sources connues si demandé.' : 'اضغط على "تثبيت" (Install)، ووافق على التثبيت من هذا المصدر.'}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0">3</span>
                        <span>{lang === 'fr' ? 'Profitez de l\'application complète et de toutes ses fonctions !' : 'سيظهر التطبيق كأيقونة رسمية على شاشة هاتفك مع كامل الميزات.'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={handleDownloadRealApp}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ArrowDownCircle className="w-4 h-4" />
                      <span>{lang === 'fr' ? 'Retélécharger l\'APK' : 'إعادة تحميل ملف APK'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      {lang === 'fr' ? 'Fermer' : 'تم، إغلاق'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
