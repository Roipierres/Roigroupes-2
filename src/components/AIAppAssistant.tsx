import React, { useState, useRef, useEffect } from 'react';
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
  X,
  Volume2,
  VolumeX
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
              <span className="text-[9px] sm:text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shrink-0" dir="ltr">
                RG<span className="text-red-500">S</span> Dev AI
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
 * Full Interactive Modal: AI Software & Web Development Consultant (Chat Mode)
 */
export const AIAppAssistantModal: React.FC = () => {
  const {
    lang,
    currentUser,
    submitProjectRequest,
    isAIAssistantModalOpen,
    setIsAIAssistantModalOpen
  } = useApp();

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const initialGreeting = lang === 'fr' 
    ? "Bonjour ! Je suis l'Ingénieur Principal de RoiGroupeS. Pour une étude de faisability technique rigoureuse, j'ai besoin des spécifications suivantes :\n\n1. L'architecture système (Micro-services, Cloud Native, Monolithe) ?\n2. Les protocoles de sécurité requis (Chiffrement AES-256, OAuth2, SSL) ?\n3. Le volume de requêtes concurrentes et la scalabilité horizontale ?\n4. Intégrations API tierces ou ERP spécifiques ?\n\nDécrivez votre cahier des charges technique." 
    : "مرحباً بك! أنا المهندس الأول في RoiGroupeS المسؤول عن التخطيط التقني. لتقديم دراسة هندسية دقيقة لمشروعك، أحتاج منك تفاصيل تقنية :\n\n1. ما هي بنية النظام المطلوبة (Micro-services، Cloud Native، أو Monolithe)؟\n2. ما هي معايير الأمان والتشفير (AES-256، SSL، أو توثيق ثنائي)؟\n3. حجم الزيارات المتوقعة وقابلية التوسع (Scalability)؟\n4. هل هناك ربط برمجي مع أنظمة خارجية (APIs) أو قواعد بيانات ضخمة؟\n\nتفضل بشرح المتطلبات التقنية، وسأقوم بتحليل المعمارية فوراً.";

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: initialGreeting
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const speakMessage = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Function to actually perform the speech
    const doSpeak = () => {
      try {
        window.speechSynthesis.cancel();
        if (!isVoiceEnabled || !text) {
          setIsSpeaking(false);
          return;
        }

        const clean = text
          .replace(/\[LEAD_DATA\][\s\S]*?\[\/LEAD_DATA\]/g, '')
          .replace(/[*#_~`•]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (!clean) return;

        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = lang === 'fr' ? 'fr-FR' : 'ar-SA';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const matchingVoice = voices.find(v => 
            lang === 'fr' ? v.lang.startsWith('fr') : (v.lang.startsWith('ar') || v.lang.includes('Arabic'))
          );
          if (matchingVoice) utterance.voice = matchingVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis notice:', err);
        setIsSpeaking(false);
      }
    };

    // If voices are already loaded, speak immediately
    if (window.speechSynthesis.getVoices().length > 0) {
      doSpeak();
    } else {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = () => {
        doSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  };

  // Speak initial greeting once modal opens
  useEffect(() => {
    if (isAIAssistantModalOpen && isVoiceEnabled) {
      const timer = setTimeout(() => {
        speakMessage(messages[0]?.content || initialGreeting);
      }, 400);
      return () => {
        clearTimeout(timer);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isAIAssistantModalOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isTyping || isFinalized) return;

    const userMsg = userInput.trim();
    setUserInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-dev-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          lang,
          userInfo: currentUser ? { name: currentUser.name, email: currentUser.email } : undefined
        })
      });

      if (!response.ok) throw new Error('AI request failed');
      const data = await response.json();
      const aiText = data.text;

      // Extract lead data if present
      const leadMatch = aiText.match(/\[LEAD_DATA\]([\s\S]*?)\[\/LEAD_DATA\]/);
      let cleanAiText = aiText.replace(/\[LEAD_DATA\][\s\S]*?\[\/LEAD_DATA\]/, '').trim();

      setMessages(prev => [...prev, { role: 'assistant', content: cleanAiText }]);

      // Speak AI response out loud if voice is enabled
      if (isVoiceEnabled) {
        speakMessage(cleanAiText);
      }

      if (leadMatch) {
        try {
          const leadData = JSON.parse(leadMatch[1].trim());
          const ip = await getClientIP();
          
          const res = await submitProjectRequest({
            projectType: leadData.projectType || 'custom',
            projectTitle: leadData.projectTitle || 'مشروع جديد من المساعد الذكي',
            userIdea: leadData.userIdea || userMsg,
            aiSummary: cleanAiText,
            suggestedTech: leadData.suggestedTech || 'React Native, Node.js',
            estimatedTimeline: leadData.estimatedTimeline || '3-4 أسابيع',
            userName: leadData.userName || currentUser?.name || 'عميل محترم',
            userEmail: currentUser?.email || 'contact@client.com',
            userPhone: leadData.userPhone || '',
            userId: currentUser?.id,
            ipAddress: ip
          });

          if (res.success) {
            setLeadId(res.id);
            setIsFinalized(true);
          }
        } catch (err) {
          console.error('Error parsing lead data:', err);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = lang === 'fr' 
        ? "Je suis à votre écoute ! Dites-moi ce que vous souhaitez développer et laissez-moi votre nom et numéro WhatsApp pour une étude technique approfondie." 
        : "أنا معك خطوة بخطوة! تفضل بشرح المتطلبات التقنية لتطبيقك ورقم هاتفك (الواتساب) وسنتكفل بدراسته وبرمجته باحترافية فوراً.";
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMsg
      }]);
      if (isVoiceEnabled) speakMessage(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isAIAssistantModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
        <div 
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
          onClick={() => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            setIsAIAssistantModalOpen(false);
          }} 
        />

        <div className="relative w-full max-w-lg h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-500/40 overflow-hidden flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{lang === 'fr' ? 'Consultant Expert' : 'المهندس الأول'}</span>
                  <bdo dir="ltr" className="inline-block font-black text-xs bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    RoiGroupe<span className="text-red-500">S</span>
                  </bdo>
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {lang === 'fr' ? 'Interrogation technique vocale en direct' : 'استنطاق ودراسة فنية فورية بالصوت والكتابة'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  }
                  setIsVoiceEnabled(!isVoiceEnabled);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold border ${
                  isVoiceEnabled 
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-xs' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title={isVoiceEnabled ? (lang === 'fr' ? 'Désactiver la voix' : 'كتم الصوت') : (lang === 'fr' ? 'Activer la voix' : 'تشغيل الصوت')}
              >
                {isVoiceEnabled ? (
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-amber-500' : ''}`} />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <span className="text-[10px] hidden sm:inline">
                  {isVoiceEnabled 
                    ? (isSpeaking ? (lang === 'fr' ? 'En train de parler...' : 'يتكلم الآن...') : (lang === 'fr' ? 'Voix activée' : 'الصوت مفعل')) 
                    : (lang === 'fr' ? 'Muet' : 'صامت')}
                </span>
              </button>

              <button 
                onClick={() => {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsAIAssistantModalOpen(false);
                }} 
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-amber-500 text-slate-950 rounded-tr-none font-bold' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}>
                  {msg.content}
                </div>

                {msg.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => speakMessage(msg.content)}
                    className="mt-1 px-2 py-0.5 text-slate-400 hover:text-amber-500 transition-colors flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                    title={lang === 'fr' ? 'Écouter cette réponse' : 'استمع لهذا الرد'}
                  >
                    <Volume2 className="w-3 h-3 text-amber-500" />
                    <span>{lang === 'fr' ? 'Réécouter' : 'استماع صوتي'}</span>
                  </button>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  <span className="text-[11px] text-slate-500 font-bold">{lang === 'fr' ? 'L\'ingénieur prépare l\'étude...' : 'المهندس يدرس المتطلبات...'}</span>
                </div>
              </div>
            )}
            {isFinalized && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center animate-bounce-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-black text-emerald-700 dark:text-emerald-400 mb-1">
                  {lang === 'fr' ? 'Dossier transmis !' : 'تم استلام وتوجيه ملفك بنجاح!'}
                </h3>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {lang === 'fr' 
                    ? `Votre demande #${leadId} est entre les mains de nos ingénieurs. Nous vous contacterons via WhatsApp.` 
                    : `طلبك برقم #${leadId} تم تسجيله في لوحة الإدارة وسيتواصل معكم فريق الهندسة عبر الواتساب.`}
                </p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isTyping || isFinalized}
                placeholder={lang === 'fr' ? 'Décrivez votre projet (nom, idée, numéro WhatsApp)...' : 'اشرح فكرة تطبيقك، اسمك ورقم هاتفك (الواتساب)...'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl ltr:pl-4 ltr:pr-12 rtl:pr-4 rtl:pl-12 py-3 text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isTyping || isFinalized}
                className="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 p-2 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 disabled:opacity-50 transition-all cursor-pointer shadow-md"
              >
                <Send className="w-5 h-5 rtl:rotate-180" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2 px-1 font-medium">
              <span>{lang === 'fr' ? 'Étude technique & Développement Native' : 'دراسة فنية متكاملة وتطوير برمجي أصيل'}</span>
              <span className="flex items-center gap-1">
                <bdo dir="ltr">RoiGroupe<span className="text-red-500">S</span></bdo>
              </span>
            </div>
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
