import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Bot, Sparkles, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

export const FloatingActions: React.FC = () => {
  const { lang, siteSettings, setIsAIAssistantModalOpen, setIsFloatingAdsOpen } = useApp();

  const whatsappNumber = siteSettings.whatsappNumber || "+213797152590";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '').replace(/\s+/g, '')}`;

  return (
    <div className="fixed bottom-4 sm:bottom-6 ltr:right-3 sm:ltr:right-5 rtl:left-3 sm:rtl:left-5 flex flex-col items-center gap-2.5 z-50 pointer-events-none">
      {/* Floating Ads Trigger Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
          default: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        className="pointer-events-auto"
      >
        <button
          onClick={() => setIsFloatingAdsOpen(true)}
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 dark:bg-slate-800 text-amber-400 shadow-lg border border-amber-500/40 hover:scale-110 active:scale-90 transition-transform flex items-center justify-center cursor-pointer group"
          title={lang === 'fr' ? 'Bannières & Offres Spéciales' : 'عروض وإعلانات عائمة مميزة'}
        >
          <Megaphone className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </button>
      </motion.div>

      {/* WhatsApp Button - Ultra-compact (more than 50% smaller), always moving & floating in foreground */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2.0, ease: 'easeInOut' },
          default: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        className="pointer-events-auto"
      >
        <motion.a
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#25D366] shadow-lg shadow-emerald-500/40 flex items-center justify-center text-white cursor-pointer overflow-hidden border border-white/80 dark:border-slate-800 transition-all duration-300 group"
          title="WhatsApp Support"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          
          {/* Subtle live indicator dot */}
          <span className="absolute top-0 right-0 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
          </span>
        </motion.a>
      </motion.div>

      {/* AI Assistant Floating Icon Button - Compact & Space-saving */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
        transition={{
          y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut', delay: 0.2 },
          default: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        className="pointer-events-auto"
      >
        <button
          onClick={() => setIsAIAssistantModalOpen(true)}
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/30 flex items-center justify-center cursor-pointer border border-amber-300 dark:border-amber-600 hover:scale-110 active:scale-90 transition-transform group"
          title={lang === 'fr' ? 'Assistant IA pour créer votre application' : 'المساعد الذكي لإنشاء تطبيقك'}
        >
          <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:rotate-12 transition-transform" />
          
          {/* Subtle Sparkle Ping */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
          </span>
        </button>
      </motion.div>
    </div>
  );
};
