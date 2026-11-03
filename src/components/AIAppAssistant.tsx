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

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: lang === 'fr' 
        ? "Bonjour ! Je suis votre conseiller technique chez RoiGroupes. Quelle application ou projet logiciel souhaitez-vous créer aujourd'hui ?" 
        : "مرحباً بك! أنا مستشارك البرمجي من RoiGroupes. ما هو التطبيق أو المشروع البرمجي الذي تطمح لإنشائه اليوم؟"
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
            userName: leadData.userName || currentUser?.name || 'زائر',
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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: lang === 'fr' 
          ? "Désolé, j'ai rencontré un problème technique. Pouvez-vous réessayer ?" 
          : "عذراً، حدث خطأ تقني في الاتصال. هل يمكنك إعادة المحاولة؟" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isAIAssistantModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsAIAssistantModalOpen(false)} />

        <div className="relative w-full max-w-2xl h-[600px] max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-500/40 overflow-hidden flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-950/70">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Consultant Expert RoiGroupes' : 'خبير التطوير من RoiGroupes'}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {lang === 'fr' ? 'En ligne pour vous aider' : 'متصل الآن لمساعدتك'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsAIAssistantModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat History */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-amber-500 text-slate-950 rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
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
                    ? `Votre demande #${leadId} est entre les mains de nos ingénieurs.` 
                    : `طلبك برقم #${leadId} أصبح الآن بين أيدي مهندسينا، سنتصل بك قريباً.`}
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
                placeholder={lang === 'fr' ? 'Tapez votre message...' : 'اكتب رسالتك هنا...'}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isTyping || isFinalized}
                className="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 p-2 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">
              {lang === 'fr' 
                ? 'Conseil IA par RoiGroupes' 
                : 'خدمة الاستشارة الذكية من RoiGroupes'}
            </p>
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
