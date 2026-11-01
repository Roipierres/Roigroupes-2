import React from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, Megaphone } from 'lucide-react';

interface AdBannerProps {
  placement?: 'header' | 'sidebar' | 'in_feed' | 'detail';
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement = 'header' }) => {
  const { lang, ads } = useApp();

  const activeAd = ads.find((a) => a.isActive && (a.placement === placement || placement === 'header'));

  if (!activeAd) return null;

  const title = lang === 'fr' ? activeAd.titleFr : activeAd.title;

  return (
    <div className="my-6 w-full">
      <div className="relative overflow-hidden bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl transition-all">
        {activeAd.type === 'image' ? (
          <a
            href={activeAd.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <img
              src={activeAd.imageUrl}
              alt={title}
              referrerPolicy="no-referrer"
              className="w-full h-auto min-h-[120px] sm:min-h-[160px] max-h-[400px] object-cover"
            />
          </a>
        ) : (
          <div className="p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 w-full relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
            
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left w-full relative z-10">
              {activeAd.imageUrl && (
                <img
                  src={activeAd.imageUrl}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-32 sm:h-32 rounded-[2rem] object-cover border-4 border-amber-500/20 shadow-2xl shrink-0 transform -rotate-3"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                  <span className="text-[10px] font-black text-slate-950 bg-amber-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>{activeAd.sponsorBadge || (lang === 'fr' ? 'Sponsorisé' : 'إعلان موثق')}</span>
                  </span>
                  {activeAd.sponsorName && (
                    <span className="text-xs text-amber-500 dark:text-amber-400 font-black uppercase tracking-[0.2em]">
                      {activeAd.sponsorName}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  {title}
                </h3>
              </div>
            </div>

            <a
              href={activeAd.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto px-10 py-4 bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 font-black text-sm rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 shrink-0 relative z-10 active:scale-95 group"
            >
              <span>{lang === 'fr' ? 'Découvrir maintenant' : 'استكشف العرض الآن'}</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
