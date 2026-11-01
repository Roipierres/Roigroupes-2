import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getClientIP } from '../utils/ip';
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  Smartphone,
  Globe,
  ShoppingCart,
  Briefcase,
  Layers,
  Clock,
  Cpu,
  FileText,
  User,
  Phone,
  Mail,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

type ProjectType = 'mobile_app' | 'website' | 'ecommerce' | 'erp_pos' | 'custom';

interface ConsultationResult {
  projectTitle: string;
  projectType: ProjectType;
  aiSummary: string;
  suggestedTech: string;
  estimatedTimeline: string;
  adminMessage: string;
}

/**
 * Compact Homepage Button / Card: "المساعد الذكي لإنشاء تطبيقك"
 * Highly compressed vertical footprint to save maximum screen space
 */
export const AIAppAssistantButton: React.FC = () => {
  const { lang, setIsAIAssistantModalOpen } = useApp();

  return (
    <section className="my-3 sm:my-5 max-w-6xl mx-auto px-3 sm:px-6 w-full">
      <div className="bg-gradient-to-r from-amber-500/10 via-white dark:via-slate-900 to-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 shadow-md transition-all">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                {lang === 'fr' ? 'Assistant IA pour créer votre application' : 'المساعد الذكي لإنشاء تطبيقك'}
              </h3>
              <span className="text-[9px] sm:text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shrink-0">
                RG Dev AI
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium truncate">
              {lang === 'fr'
                ? 'Exposez votre idée et obtenez une étude technique immédiate'
                : 'اشرح فكرة تطبيقك أو موقعك واستلم دراسة فنية وعرض تنفيذ فوري'}
            </p>
          </div>
        </div>

        {/* Dedicated Compact Button */}
        <button
          onClick={() => setIsAIAssistantModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Créer votre application' : 'المساعد الذكي لإنشاء تطبيقك'}</span>
          {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </section>
  );
};

/**
 * Full Interactive Modal: AI Software & Web Development Consultant
 */
export const AIAppAssistantModal: React.FC = () => {
  const {
    lang,
    currentUser,
    submitProjectRequest,
    setIsAuthModalOpen,
    isAIAssistantModalOpen,
    setIsAIAssistantModalOpen
  } = useApp();

  const [projectType, setProjectType] = useState<ProjectType>('mobile_app');
  const [prompt, setPrompt] = useState<string>('');
  const [clientName, setClientName] = useState<string>(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState<string>(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState<string>(currentUser?.ipAddress ? '' : '');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [consultation, setConsultation] = useState<ConsultationResult | null>(null);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      if (!clientName) setClientName(currentUser.name);
      if (!clientEmail) setClientEmail(currentUser.email);
    }
  }, [currentUser]);

  const projectTypesList = [
    {
      id: 'mobile_app' as ProjectType,
      labelAr: 'تطبيق هاتف (Android / iOS)',
      labelFr: 'Application Mobile (iOS / Android)',
      icon: Smartphone
    },
    {
      id: 'website' as ProjectType,
      labelAr: 'موقع ويب / منصة سحابية',
      labelFr: 'Site Web / Plateforme Cloud',
      icon: Globe
    },
    {
      id: 'ecommerce' as ProjectType,
      labelAr: 'متجر تجارة إلكترونية',
      labelFr: 'Boutique E-Commerce',
      icon: ShoppingCart
    },
    {
      id: 'erp_pos' as ProjectType,
      labelAr: 'برنامج إدارة ومحاسبة POS',
      labelFr: 'Logiciel de Gestion ERP / POS',
      icon: Briefcase
    },
    {
      id: 'custom' as ProjectType,
      labelAr: 'فكرة برمجية مخصصة',
      labelFr: 'Idée Logicielle Sur-Mesure',
      icon: Layers
    }
  ];

  const quickIdeas = [
    { ar: 'تطبيق توصيل طلبات للمطاعم والمتاجر', fr: 'App de livraison pour restaurants et commerces' },
    { ar: 'متجر إلكتروني لبيع المنتجات مع دفع إلكتروني', fr: 'Boutique en ligne avec paiement sécurisé' },
    { ar: 'نظام سحابي لإدارة حجوزات ومواعيد العيادات', fr: 'Logiciel de gestion de clinique et rendez-vous' },
    { ar: 'تطبيق خدمات حجز رحلات وفنادق وسياحة', fr: 'Plateforme de réservation voyages et tourisme' }
  ];

  const handleAnalyzeIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setConsultation(null);
    setSubmittedRequestId(null);

    try {
      const response = await fetch('/api/ai-dev-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: prompt,
          projectType,
          lang,
          userInfo: {
            name: clientName || currentUser?.name || 'العميل',
            email: clientEmail || currentUser?.email || ''
          }
        })
      });

      if (!response.ok) {
        throw new Error('Consultation request failed');
      }

      const data = await response.json();
      setConsultation(data);
    } catch (err: any) {
      console.error('Error analyzing idea:', err);
      // Fallback proposal
      setConsultation({
        projectTitle: lang === 'fr' ? 'Projet de Développement Personnalisé' : 'مشروع برمجة وتطوير مخصص - RoiGroupes',
        projectType,
        aiSummary: lang === 'fr'
          ? `Étude technique : Le projet nécessite une architecture cloud moderne avec application native/web, base de données sécurisée et panneau d'administration sur-mesure.`
          : `دراسة الجدوى الفنية: يتطلب هذا المشروع نظاماً برمجياً حديثاً يضم واجهة متجاوبة، قاعدة بيانات سحابية متزامنة، ولوحة تحكم مركزية للإدارة. الفكرة قابلة للتنفيذ بجودة عالية مع فريق RoiGroupes.`,
        suggestedTech: 'React Native / Next.js, Node.js, Firebase Cloud',
        estimatedTimeline: lang === 'fr' ? '3 à 4 semaines' : '3 إلى 4 أسابيع',
        adminMessage: `رسالة المساعد الذكي لإدارة RoiGroupes:\nيرغب العميل (${clientName || currentUser?.name || 'زائر الموقع'}) في تنفيذ مشروع (${prompt}).\nالتقنيات المقترحة: React Native / Next.js.\nيرجى التواصل معه للمناقشة وتحديد موعد البدء.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToAdmin = async () => {
    if (!consultation) return;

    const nameToUse = clientName.trim() || currentUser?.name || (lang === 'fr' ? 'Client RoiGroupes' : 'عميل RoiGroupes');
    const emailToUse = clientEmail.trim() || currentUser?.email || 'non-specifie@client.com';
    const phoneToUse = clientPhone.trim() || (currentUser as any)?.whatsapp || '';

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const ip = currentUser?.ipAddress || (await getClientIP());

      const res = await submitProjectRequest({
        projectType: consultation.projectType,
        projectTitle: consultation.projectTitle,
        userIdea: prompt,
        aiSummary: consultation.aiSummary,
        suggestedTech: consultation.suggestedTech,
        estimatedTimeline: consultation.estimatedTimeline,
        userName: nameToUse,
        userEmail: emailToUse,
        userPhone: phoneToUse,
        userId: currentUser?.id,
        ipAddress: ip
      });

      setSubmittedRequestId(res.id);
    } catch (err) {
      console.error('Failed to submit project request:', err);
      setErrorMessage(
        lang === 'fr'
          ? 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
          : 'تعذر إرسال الطلب، يرجى المحاولة مرة أخرى أو التواصل معنا عبر الواتساب.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAIAssistantModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setIsAIAssistantModalOpen(false)}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-500/40 overflow-hidden flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {lang === 'fr'
                      ? 'Assistant IA pour créer votre application'
                      : 'المساعد الذكي لإنشاء تطبيقك'}
                  </h2>
                  <span className="text-[10px] font-black bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                    RG Dev AI
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {lang === 'fr'
                    ? 'Étude technique, technologies recommandées et transmission directe à la direction'
                    : 'دراسة فنية، تحديد التقنيات المقترحة، وإرسال فوري لإدارة التطوير للتنفيذ'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAIAssistantModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title={lang === 'fr' ? 'Fermer' : 'إغلاق'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Success Banner */}
            {submittedRequestId && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-slate-900 dark:text-white animate-fade-in shadow-md">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                      {lang === 'fr'
                        ? 'Demande de projet transmise avec succès à l\'administration !'
                        : 'تم إرسال فكرة مشروعك وتقرير المساعد الذكي بنجاح إلى الإدارة!'}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {lang === 'fr'
                        ? `Votre dossier a été enregistré sous la référence #${submittedRequestId}. L'équipe technique RoiGroupes vous contactera rapidement.`
                        : `تم تسجيل طلبك برقم مرجعي رسمي #${submittedRequestId}. فريق البرمجة في RoiGroupes Holding سيراجع كافة التفاصيل ويتواصل معك قريباً.`}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedRequestId(null);
                          setConsultation(null);
                          setPrompt('');
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        {lang === 'fr' ? 'Nouveau projet' : 'تقديم فكرة مشروع أخرى'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAIAssistantModalOpen(false)}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        {lang === 'fr' ? 'Fermer' : 'تم وإغلاق'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Project Type Selector */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                {lang === 'fr' ? '1. Choisissez le type de projet :' : '1. حدد نوع المشروع البرمجي :'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {projectTypesList.map((type) => {
                  const IconComp = type.icon;
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20 font-black'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:bg-amber-500/5'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-600 dark:text-amber-400'}`} />
                      <span className="text-center text-[10px] sm:text-[11px] leading-tight">
                        {lang === 'fr' ? type.labelFr : type.labelAr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Idea Input */}
            <form onSubmit={handleAnalyzeIdea} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'fr' ? '2. Décrivez votre idée en quelques lignes :' : '2. اشرح فكرتك واحتياجاتك في المشروع :'}
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    lang === 'fr'
                      ? 'Ex: Je souhaite créer une application mobile pour gérer les commandes et livraisons de mes magasins avec paiement en ligne...'
                      : 'مثال: أريد إنشاء تطبيق هاتف لتوصيل الطلبات وتتبع المندوبين بالخريطة، مع لوحة تحكم لإدارة المتاجر وحساب الأرباح...'
                  }
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                />
              </div>

              {/* Quick Examples */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {lang === 'fr' ? 'Exemples :' : 'أمثلة سريعة :'}
                </span>
                {quickIdeas.map((idea, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(lang === 'fr' ? idea.fr : idea.ar)}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-300 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {lang === 'fr' ? idea.fr : idea.ar}
                  </button>
                ))}
              </div>

              {/* 3. User Contact Info */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{lang === 'fr' ? '3. Vos coordonnées de contact :' : '3. معلومات العضو للتواصل الرسمي :'}</span>
                  </label>

                  {currentUser ? (
                    <span className="text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {lang === 'fr' ? 'Membre connecté' : 'عضو مسجل بالموقع'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      {lang === 'fr' ? 'Connexion membre' : 'تسجيل الدخول كعضو'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={lang === 'fr' ? 'Votre nom complet' : 'الاسم الكامل'}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
                  />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder={lang === 'fr' ? 'Votre e-mail' : 'البريد الإلكتروني'}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
                  />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder={lang === 'fr' ? 'Téléphone / WhatsApp' : 'رقم الهاتف / الواتساب'}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Analyze Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{lang === 'fr' ? 'Analyse en cours...' : 'المساعد الذكي يقوم بدراسة فكرتك...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{lang === 'fr' ? 'Analyser et générer la proposition' : 'تحليل الفكرة وإعداد دراسة المشروع'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Results Block */}
            {consultation && !isLoading && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-amber-500/40 shadow-lg space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                        {lang === 'fr' ? 'Étude Préparée par l\'IA' : 'دراسة المشروع من المساعد الذكي'}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {consultation.projectTitle}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>{consultation.estimatedTimeline}</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <h5 className="font-extrabold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1 text-[11px]">
                      <Cpu className="w-3 h-3 text-amber-600" />
                      <span>{lang === 'fr' ? 'Technologies conseillées :' : 'التقنيات المقترحة للتنفيذ :'}</span>
                    </h5>
                    <p className="font-mono text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      {consultation.suggestedTech}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-slate-800 dark:text-slate-200 mb-1 text-[11px]">
                      {lang === 'fr' ? 'Étude technique :' : 'دراسة الجدوى الفنية للمشروع :'}
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed">
                      {consultation.aiSummary}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <h5 className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1 text-[11px]">
                      <Bot className="w-3.5 h-3.5 text-amber-600" />
                      <span>{lang === 'fr' ? 'Message pour l\'administration :' : 'رسالة المساعد الذكي لإدارة RoiGroupes :'}</span>
                    </h5>
                    <p className="text-slate-800 dark:text-slate-200 text-[10px] whitespace-pre-line font-medium leading-relaxed">
                      {consultation.adminMessage}
                    </p>
                  </div>
                </div>

                {/* Final Submission Button */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[10px] text-slate-500 text-center sm:text-right">
                    {lang === 'fr'
                      ? 'Ce dossier sera transmis directement au tableau de bord de la direction.'
                      : 'سيتم إرسال هذا التقرير مباشرة إلى لوحة تحكم الإدارة مع معلوماتك للتواصل.'}
                  </span>

                  <button
                    type="button"
                    onClick={handleSendToAdmin}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                        <span>{lang === 'fr' ? 'Envoi...' : 'جاري الإرسال للإدارة...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'fr' ? 'Envoyer ce projet à l\'administration' : 'إرسال دراسة المشروع إلى الإدارة'}</span>
                      </>
                    )}
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

/**
 * Default composite component: renders the compact button in place
 */
export const AIAppAssistant: React.FC = () => {
  return <AIAppAssistantButton />;
};
