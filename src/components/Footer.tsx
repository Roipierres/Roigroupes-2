import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck } from 'lucide-react';


export const Footer: React.FC = () => {
  const { t, siteSettings, lang } = useApp();
  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-amber-500/20 text-slate-500 dark:text-slate-400 text-xs py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Brand Info with Official Logo */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={logoPath}
              alt="RoiGroupes Logo"
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shadow-sm"
            />
            <div className="text-center" dir="ltr">
              <bdo dir="ltr" className="text-lg font-black text-slate-900 dark:text-white inline-block leading-tight">
                RoiGroupe<span className="text-red-500">S</span><span className="text-amber-600 dark:text-amber-400">.com</span>
              </bdo>
            </div>
          </div>

          <div className="text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed font-medium flex flex-col items-center">
            {lang === 'ar' ? (
              <>
                <span className="text-xs">المنصة الرائدة الرسمية التابعة لمجموعة</span>
                <div className="py-1 text-center" dir="ltr">
                  <bdo dir="ltr" className="inline-block font-black text-sm text-slate-900 dark:text-white">
                    RoiGroupe<span className="text-red-500 font-black">S</span>
                  </bdo>
                </div>
                <span className="text-xs">لبرمجة و عرض تطبيقات تجارية وعائلية وأمنية.</span>
              </>
            ) : (
              <p>
                {t.footerDesc.split('RoiGroupeS').map((part, index, array) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <bdo dir="ltr" className="inline-block font-bold">RoiGroupe<span className="text-red-500">S</span></bdo>
                    )}
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-5">
            {siteSettings.facebookLink && (
              <a 
                href={siteSettings.facebookLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:scale-110 active:scale-95"
                title="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
            {siteSettings.instagramLink && (
              <a 
                href={siteSettings.instagramLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-pink-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm hover:scale-110 active:scale-95"
                title="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {siteSettings.tiktokLink && (
              <a 
                href={siteSettings.tiktokLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-black hover:text-white transition-all shadow-sm hover:scale-110 active:scale-95"
                title="TikTok"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.46-.35-.24-.68-.51-1-.81l-.01 7.15c.03 3.25-1.47 6.47-4.48 7.82-3.23 1.48-7.34.82-9.75-1.78-2.61-2.73-2.69-7.4-.18-10.23 1.71-1.95 4.34-2.88 6.91-2.48v4.11c-.74-.16-1.54-.15-2.25.18-.9.41-1.52 1.27-1.68 2.24-.26 1.34.56 2.8 1.89 3.19.89.26 1.93.07 2.67-.53.7-.55 1.05-1.46 1.04-2.35l.02-12.16z"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500 text-[11px] font-medium">
          <span>
            {t.copyright.split('RoiGroupeS').map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && (
                  <bdo dir="ltr" className="inline-block font-bold">RoiGroupe<span className="text-red-500">S</span></bdo>
                )}
              </React.Fragment>
            ))}
          </span>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'fr' ? 'Plateforme Officielle Certifiée' : 'منصة رسمية آمنة ومفحوصة'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
