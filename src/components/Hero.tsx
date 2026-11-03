import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDownloadCount } from '../utils/helpers';
import {
  Search,
  ShieldCheck,
  Download,
  Users,
  Smartphone,
  Crown,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Shield,
  Sparkles,
  Layers,
  Star,
  CheckCircle2,
  Zap,
  Eye
} from 'lucide-react';
import { CategoryItem } from '../types';
import { SafeImage } from './SafeImage';

// Radiant Glowing Shield with Radiation Light Beam Sweeping Across its Lines
const RadiantShieldIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9 sm:w-12 sm:h-12" }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-emerald-500 overflow-visible drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]"
      >
        <defs>
          {/* Animated Radiation Beam Gradient Sweep */}
          <linearGradient id="shieldRadiationSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="65%" stopColor="#34d399" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.8" />
            <animate
              attributeName="x1"
              values="-100%; 200%"
              dur="2.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%; 300%"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Intense Laser Line Glow Filter */}
          <filter id="laserLineGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Shield Outline Path with Radiation Light Sweep */}
        <path
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
          stroke="url(#shieldRadiationSweep)"
          strokeWidth="2.3"
          filter="url(#laserLineGlow)"
        />

        {/* Inner Checkmark Path with Radiation Light Sweep */}
        <path
          d="m9 12 2 2 4-4"
          stroke="url(#shieldRadiationSweep)"
          strokeWidth="2.6"
          filter="url(#laserLineGlow)"
        />
      </svg>
    </div>
  );
};

export const Hero: React.FC = () => {
  const {
    lang,
    t,
    searchQuery,
    setSearchQuery,
    navigateToView,
    navigateToCategoryPage,
    setSelectedCategoryFilter,
    apps,
    selectedApp,
    setSelectedApp,
    siteSettings,
    recordDownload,
    downloadLogs,
    users,
    categories,
    setIsAllAppsModalOpen
  } = useApp();

  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);
  const categoryRef = React.useRef<HTMLDivElement>(null);

  const logoPath = '/assets/aistudio/1793173133604_a080e212.jpg';
  const totalDownloadsSum = apps.reduce((acc, a) => acc + a.downloadsCount, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAllAppsModalOpen(true);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-100 dark:bg-slate-950 pt-8 pb-10 sm:pt-10 sm:pb-12 border-b border-amber-500/20 transition-colors">
      {/* Background Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo Crest Showcase */}
          <div className="inline-flex items-center gap-3 p-2 pr-4 rtl:pl-4 rtl:pr-2 rounded-full bg-white dark:bg-slate-900/90 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold mb-6 shadow-md">
            <img
              src={logoPath}
              alt="RoiGroupes Emblem"
              className="w-8 h-8 rounded-full object-cover border border-amber-500/50 shadow-sm"
            />
            <span className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.heroBadge}</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500 shrink-0">
              {lang === 'fr' ? 'Officielles' : 'رسمية'}
            </span>
            <RadiantShieldIcon className="w-9 h-9 sm:w-14 sm:h-14 shrink-0" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-400 shrink-0">
              {lang === 'fr' ? 'Protégées' : 'محمية'}
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto font-bold px-2">
            {lang === 'ar' ? 'تطبيقات مشفرة لأمان بياناتكم وخصوصيتكم' : 'Applications cryptées pour la sécurité de vos données'}
          </p>

          {/* Content below title removed as per user request to simplify homepage */}
        </div>
      </div>
    </section>
  );
};
