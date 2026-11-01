import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Download, CheckCircle2, ShieldCheck, X, FileText, ArrowDown, ExternalLink } from 'lucide-react';

export const DownloadModal: React.FC = () => {
  const {
    lang,
    t,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    activeDownloadApp
  } = useApp();

  const [progress, setProgress] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (!isDownloadModalOpen || !activeDownloadApp) {
      setProgress(0);
      setIsComplete(false);
      return;
    }

    const startDownload = async () => {
      const downloadUrl = activeDownloadApp.uploadedFileBlobUrl || activeDownloadApp.downloadLinks.androidUrl;
      if (!downloadUrl) return;

      const fileName = activeDownloadApp.uploadedFileName || `${activeDownloadApp.slug}.apk`;

      // Animate progress bar to 100%
      let currentPercent = 0;
      await new Promise<void>((resolve) => {
        const timer = setInterval(() => {
          currentPercent += Math.floor(Math.random() * 20) + 12;
          if (currentPercent >= 100) {
            currentPercent = 100;
            clearInterval(timer);
            resolve();
          }
          setProgress(currentPercent);
        }, 120);
      });

      setIsComplete(true);

      // Trigger native direct file download (preserves exact 30MB+ size from server or URL)
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    startDownload();
  }, [isDownloadModalOpen, activeDownloadApp]);

  if (!isDownloadModalOpen || !activeDownloadApp) return null;

  const title = lang === 'fr' ? activeDownloadApp.titleFr : activeDownloadApp.title;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={() => setIsDownloadModalOpen(false)}
          className="absolute top-5 ltr:right-5 rtl:left-5 p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-lg shadow-amber-500/20">
            {title.charAt(0)}
          </div>

          <h2 className="text-lg font-bold text-white leading-snug">
            {title}
          </h2>
          <span className="text-xs font-mono text-amber-300/80 block mt-0.5">
            v{activeDownloadApp.version} ({activeDownloadApp.size})
          </span>
          {activeDownloadApp.uploadedFileName && (
            <span className="text-[10px] text-slate-400 block font-mono mt-1">
              📦 {activeDownloadApp.uploadedFileName}
            </span>
          )}
        </div>

        {/* Progress Bar & Status */}
        {!isComplete ? (
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>{t.downloadingTitle}</span>
              <span className="font-mono text-amber-400">{progress}%</span>
            </div>

            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Fichier sécurisé & certifié RG' : 'ملف مفحوص ومحمي من خوادم RoiGroupes'}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-emerald-300">
                {t.downloadCompleteTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'fr'
                  ? 'Le téléchargement du fichier de l\'application a été lancé sur votre appareil.'
                  : 'بدأ تحميل ملف التطبيق على جهازك بنجاح وتم تسجيل العملية.'}
              </p>
            </div>

            {/* Quick Installation Guide */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-xs text-slate-300 space-y-2">
              <span className="font-bold text-white block mb-2">
                {t.installationSteps}
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
                <li>{t.step1}</li>
                <li>{t.step2}</li>
                <li>{t.step3}</li>
              </ol>
            </div>

            <button
              onClick={() => setIsDownloadModalOpen(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {t.closeBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
