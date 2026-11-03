import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, ArrowLeft, X, Phone, MessageSquare, Check, CheckCheck, Sparkles, ShieldCheck, UserPlus, Lock } from 'lucide-react';
import { FriendRequest } from '../../types';

interface MemberChatProps {
  receiverId: string;
  onBack: () => void;
  onClose: () => void;
}

export const MemberChat: React.FC<MemberChatProps> = ({ receiverId, onBack, onClose }) => {
  const { 
    messages, 
    sendChatMessage, 
    markMessagesRead, 
    users, 
    currentUser, 
    lang, 
    siteSettings,
    isFriend,
    friendRequests,
    sendFriendRequest
  } = useApp();

  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Match receiver or provide fail-proof fallback
  const foundUser = users.find(u => 
    u.id === receiverId || 
    (receiverId === 'user-admin' && (u.role === 'admin' || u.id === 'user-admin'))
  );

  const isAdminUser = currentUser && (
    currentUser.role === 'admin' ||
    currentUser.id === 'user-admin' ||
    currentUser.id === 'user-manager' ||
    currentUser.email === 'bahrinho93@gmail.com' ||
    currentUser.email === 'manager@roigroupes.com'
  );

  const isAdminReceiver = receiverId === 'user-admin' || receiverId === 'user-manager' || foundUser?.role === 'admin';

  // Can the current user chat with this receiver?
  // 1. Admin can chat with anyone
  // 2. Anyone can chat with Admin / Support
  // 3. Regular users can chat if they are accepted friends
  const canChat = isAdminUser || isAdminReceiver || isFriend(receiverId);

  // Check pending request status
  const isRequestPending = friendRequests.some(r => 
    r.status === 'pending' && 
    r.senderId === currentUser?.id && 
    r.receiverId === receiverId
  );

  const receiver = foundUser || {
    id: receiverId,
    name: isAdminReceiver
      ? (lang === 'fr' ? 'Direction & Support RoiGroupeS' : 'الدعم الفني وإدارة RoiGroupeS')
      : (lang === 'fr' ? 'Membre RoiGroupeS' : 'عضو المنصة'),
    email: isAdminReceiver ? 'support@roigroupes.com' : 'user@roigroupes.com',
    avatar: isAdminReceiver ? '/assets/aistudio/1793173133604_a080e212.jpg' : 'https://ui-avatars.com/api/?name=User&background=f59e0b&color=020617',
    role: isAdminReceiver ? ('admin' as const) : ('user' as const),
    provider: 'email' as const,
    phone: isAdminReceiver ? siteSettings.whatsappNumber || '+213797152590' : undefined,
    joinedDate: new Date().toISOString(),
    status: 'active' as const
  };

  // Conversation messages
  const conversation = messages.filter(m => {
    if (!currentUser) return false;
    if (isAdminReceiver) {
      const isSupportMsg = 
        (m.senderId === currentUser.id && (m.receiverId === 'user-admin' || m.receiverId === 'user-manager' || m.receiverId === receiverId)) ||
        ((m.senderId === 'user-admin' || m.senderId === 'user-manager' || m.senderId === receiverId) && m.receiverId === currentUser.id);
      return isSupportMsg;
    }
    return (
      (m.senderId === currentUser.id && m.receiverId === receiverId) ||
      (m.senderId === receiverId && m.receiverId === currentUser.id)
    );
  }).sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (receiverId) {
      markMessagesRead(receiverId);
    }
  }, [conversation.length, receiverId]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isSending || !canChat) return;
    const msg = text.trim();
    setText('');
    setIsSending(true);
    try {
      await sendChatMessage(receiverId, msg);
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleQuickQuestion = async (q: string) => {
    if (!canChat) return;
    setText('');
    setIsSending(true);
    try {
      await sendChatMessage(receiverId, q);
    } finally {
      setIsSending(false);
    }
  };

  const quickQuestionsAr = [
    '💡 أريد استشارة حول برمجة وتطوير فكرة تطبيق',
    '📦 ما هي تكلفة ومدة إنجاز تطبيق المنصة؟',
    '🧾 هل يمكنكم عمل فاتورة تفصيلية للمشروع؟',
    '🛡️ ما هي أفضل الحلول للتطبيقات الأمنية والعائلية؟'
  ];

  const quickQuestionsFr = [
    '💡 Consultation pour développer une application',
    '📦 Quel est le devis et délai pour une application ?',
    '🧾 Pouvez-vous établir une facture proforma ?',
    '🛡️ Solutions pour applications familiales et sécurité'
  ];

  const quickQuestions = lang === 'fr' ? quickQuestionsFr : quickQuestionsAr;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-2.5 sm:p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950/70 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
            title={lang === 'fr' ? 'Retour' : 'رجوع للقائمة'}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          
          <div className="relative shrink-0">
            <img
              src={receiver.avatar || 'https://ui-avatars.com/api/?name=User'}
              className="w-9 h-9 rounded-xl object-cover border-2 border-amber-500/40 shadow-xs"
              alt={receiver.name}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate flex items-center gap-1">
              <span>{receiver.name}</span>
              {isAdminReceiver && (
                <span title="RoiGroupeS Official">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                </span>
              )}
            </h4>
            <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>{lang === 'fr' ? 'En ligne' : 'متصل الآن'}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {receiver.phone && (
            <a 
              href={`tel:${receiver.phone}`}
              className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
              title={lang === 'fr' ? 'Appeler' : 'اتصال هاتفي'}
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title={lang === 'fr' ? 'Fermer' : 'إغلاق'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/60 dark:bg-slate-950/30">
        {!canChat ? (
          /* Privacy Lock notice when user is not a friend and neither party is admin */
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-3 text-amber-500 border border-amber-500/30 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
              {lang === 'fr' ? 'Ajout d\'ami requis pour discuter' : 'طلب الصداقة مطلوب للمراسلة'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mb-4">
              {lang === 'fr'
                ? 'Pour protéger la vie privée des membres, vous devez vous ajouter en amis et accepter la demande pour activer la messagerie directe.'
                : 'لحماية خصوصية الأعضاء، يسمح بالتواصل فقط بين الأعضاء بعد إرسال وقبول طلب الصداقة. (مدير الموقع يمكنه مراسلة الجميع).'}
            </p>

            {isRequestPending ? (
              <div className="px-4 py-2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold border border-amber-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{lang === 'fr' ? 'Demande envoyée • En attente d\'acceptation' : 'تم إرسال طلب الصداقة • بانتظار قبول العضو'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => sendFriendRequest(receiverId)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Envoyer une demande d\'ami' : 'إرسال طلب صداقة للبدء'}</span>
              </button>
            )}
          </div>
        ) : conversation.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-2.5 text-amber-500 border border-amber-500/30 shadow-inner">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
              {lang === 'fr' ? 'Commencez la conversation' : `ابدأ المحادثة مع ${receiver.name}`}
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-xs mb-3">
              {isAdminReceiver 
                ? (lang === 'fr' 
                  ? 'Posez vos questions sur la programmation de votre application ou le support technique.' 
                  : 'اطرح استفساراتك حول برمجة فكرة تطبيقك، التكلفة، الفاتورة أو الدعم الفني.')
                : (lang === 'fr'
                  ? 'Vous êtes amis et pouvez échanger des messages librement.'
                  : 'أنتما أصدقاء ويمكنكما تبادل الرسائل في أي وقت.')}
            </p>

            {/* Quick action buttons for official support */}
            {isAdminReceiver && (
              <div className="w-full space-y-1.5">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === 'fr' ? 'Questions fréquentes' : 'استفسارات سريعة مقترحة'}</span>
                </span>
                <div className="grid grid-cols-1 gap-1 text-right rtl:text-right ltr:text-left">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickQuestion(q)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-500/10 dark:hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 text-[10px] font-bold text-slate-800 dark:text-slate-200 transition-all text-start cursor-pointer shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {conversation.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 shadow-xs ${
                      isMe 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-medium rounded-tr-none' 
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700/80'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[9px] font-black text-amber-600 dark:text-amber-400 mb-0.5">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                    <div className={`text-[8px] mt-1 flex items-center gap-1 ${isMe ? 'justify-end text-slate-900/70' : 'justify-start text-slate-400'}`}>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && (
                        <span>
                          {msg.isRead ? (
                            <CheckCheck className="w-3 h-3 text-blue-800 inline" />
                          ) : (
                            <Check className="w-3 h-3 inline text-slate-900/60" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        {canChat ? (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={lang === 'fr' ? 'Écrivez votre message...' : 'اكتب رسالتك هنا...'}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 outline-none"
            />
            <button
              type="submit"
              disabled={!text.trim() || isSending}
              className="p-2.5 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer shadow-sm shadow-amber-500/20 shrink-0"
              title={lang === 'fr' ? 'Envoyer' : 'إرسال'}
            >
              <Send className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </form>
        ) : (
          <div className="text-center py-1 text-[11px] text-slate-400 font-bold">
            {lang === 'fr' ? 'Messagerie restreinte aux amis acceptés' : 'المحادثة متاحة بعد قبول طلب الصداقة'}
          </div>
        )}
      </div>
    </div>
  );
};
