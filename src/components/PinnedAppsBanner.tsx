import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppItem } from '../types';
import { formatDownloadCount } from '../utils/helpers';
import { 
  Zap, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Star,
  Trophy,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { SafeImage } from './SafeImage';

export const PinnedAppsBanner: React.FC = () => {
  const { apps, lang, t, navigateToView, recordDownload } = useApp();
  
  // Filter apps that are pinned and not expired
  const now = Date.now();
  const allPinned = apps
    .filter(app => app.pinnedExpiry && app.pinnedExpiry > now)
    .sort((a, b) => (a.pinnedPosition || 0) - (b.pinnedPosition || 0));

  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (allPinned.length <= 3) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % allPinned.length);
    }, 8000); // Rotate every 8s
    return () => clearInterval(interval);
  }, [allPinned.length]);

  const pinnedApps = allPinned.length <= 3 
    ? allPinned 
    : [...allPinned, ...allPinned].slice(startIndex, startIndex + 3);

  if (allPinned.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 mb-6 sm:mb-8 w-full">
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl transition-colors">
        {/* Animated Background Decoration */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {lang === 'fr' ? 'Applications à l\'Affiche' : 'تطبيقات مثبتة في الصدارة'}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {lang === 'fr' ? 'Sélection Premium' : 'اختيارات النخبة الموثوقة'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-400">
                {lang === 'fr' ? 'Mises à jour' : 'تحديث دوري'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            {pinnedApps.map((app, index) => (
              <SinglePinnedCard key={app.id} app={app} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SinglePinnedCard: React.FC<{ app: AppItem; index: number }> = ({ app, index }) => {
  const { lang, t, navigateToView, recordDownload } = useApp();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = (app.pinnedExpiry || 0) - now;
      
      if (diff <= 0) {
        setTimeLeft('00:00');
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [app.pinnedExpiry]);

  const title = lang === 'fr' ? app.titleFr : app.title;
  const desc = lang === 'fr' ? app.shortDescFr : app.shortDesc;

  return (
    <div className="group relative bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:border-amber-500/40">
      {/* Position Badge */}
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-black text-xs shadow-md z-20">
        #{index + 1}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 dark:from-slate-950 dark:to-slate-900 border border-amber-500/30 flex items-center justify-center text-slate-950 dark:text-amber-400 font-black text-2xl shadow-md shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
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
            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
              {title}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {formatDownloadCount(app.downloadsCount, lang, 333)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 min-h-[32px] font-medium">
          {desc}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">
            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-mono font-black text-amber-700 dark:text-amber-400">
              {timeLeft}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
             <button
              onClick={() => navigateToView('app_detail', app)}
              className="p-2 bg-white dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              title={t.viewDetails}
            >
              {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => recordDownload(app.id)}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg shadow-md shadow-amber-500/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" />
              <span>{t.downloadNow}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
