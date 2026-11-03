import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, X, ArrowLeft, MoreVertical, MessageSquare, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemberChatProps {
  receiverId: string;
  onBack: () => void;
  onClose: () => void;
}

export const MemberChat: React.FC<MemberChatProps> = ({ receiverId, onBack, onClose }) => {
  const { messages, sendChatMessage, markMessagesRead, users, currentUser, lang } = useApp();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const receiver = users.find(u => u.id === receiverId);
  
  const conversation = messages.filter(m => 
    (m.senderId === currentUser?.id && m.receiverId === receiverId) ||
    (m.senderId === receiverId && m.receiverId === currentUser?.id)
  ).sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (receiverId) {
      markMessagesRead(receiverId);
    }
  }, [conversation.length, receiverId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = text.trim();
    setText('');
    await sendChatMessage(receiverId, msg);
  };

  if (!receiver) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50">
        <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>
        
        <div className="flex-1 flex items-center gap-3 overflow-hidden">
          <div className="relative shrink-0">
            <img src={receiver.avatar} className="w-10 h-10 rounded-xl object-cover border border-amber-500/30" alt="" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{receiver.name}</h4>
            <p className="text-[10px] text-emerald-500 font-bold">{lang === 'fr' ? 'En ligne' : 'متصل الآن'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {receiver.phone && (
            <a 
              href={`tel:${receiver.phone}`}
              className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors"
              title={lang === 'fr' ? 'Appeler' : 'اتصال مباشر'}
            >
              <Phone className="w-5 h-5" />
            </a>
          )}
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/20">
        {conversation.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-xs font-bold">{lang === 'fr' ? 'Commencez la conversation' : 'ابدأ الدردشة مع ' + receiver.name}</p>
          </div>
        ) : (
          conversation.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 shadow-xs ${
                  isMe 
                    ? 'bg-amber-500 text-slate-950 rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-700'
                }`}>
                  <p className="text-xs leading-relaxed font-medium">{msg.text}</p>
                  <div className={`text-[9px] mt-1 opacity-60 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && (
                      <span className={msg.isRead ? 'text-blue-600' : ''}>
                        {msg.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={lang === 'fr' ? 'Écrivez votre message...' : 'اكتب رسالتك هنا...'}
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-amber-500/50 outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3 bg-amber-500 text-slate-950 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
