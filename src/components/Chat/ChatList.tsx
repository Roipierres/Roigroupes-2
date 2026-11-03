import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Search, 
  X, 
  User, 
  ShieldCheck, 
  Phone, 
  Clock, 
  CheckCheck, 
  Check, 
  UserPlus, 
  Users, 
  UserCheck, 
  BellRing,
  Sparkles
} from 'lucide-react';
import { UserAccount, FriendRequest } from '../../types';

interface ChatListProps {
  onSelectUser: (userId: string) => void;
  onClose: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectUser, onClose }) => {
  const { 
    users, 
    currentUser, 
    lang, 
    messages, 
    setIsAuthModalOpen, 
    friendRequests, 
    sendFriendRequest, 
    acceptFriendRequest, 
    declineFriendRequest,
    isFriend 
  } = useApp();

  const [search, setSearch] = useState('');

  const isGuest = currentUser?.id?.startsWith('guest-');
  const isAdmin = currentUser && (
    currentUser.role === 'admin' ||
    currentUser.id === 'user-admin' ||
    currentUser.id === 'user-manager' ||
    currentUser.email === 'bahrinho93@gmail.com' ||
    currentUser.email === 'manager@roigroupes.com'
  );

  // Tabs
  // For Admin: 'recent' | 'all'
  // For Regular members: 'friends' | 'requests' | 'discover'
  const [activeTab, setActiveTab] = useState<'recent' | 'all' | 'friends' | 'requests' | 'discover'>(
    isAdmin ? 'all' : 'friends'
  );

  // Unread count calculator
  const getUnreadCount = (userId: string) => {
    if (!currentUser) return 0;
    return messages.filter(
      m => m.senderId === userId && 
      (m.receiverId === currentUser.id || (isAdmin && m.receiverId === 'user-admin')) && 
      !m.isRead
    ).length;
  };

  const supportUnread = getUnreadCount('user-admin');

  // Pending incoming requests for current user
  const incomingRequests = useMemo(() => {
    if (!currentUser) return [];
    return friendRequests.filter(r => r.receiverId === currentUser.id && r.status === 'pending');
  }, [friendRequests, currentUser?.id]);

  // Outgoing pending requests sent by current user
  const outgoingPendingIds = useMemo(() => {
    if (!currentUser) return new Set<string>();
    return new Set(
      friendRequests
        .filter(r => r.senderId === currentUser.id && r.status === 'pending')
        .map(r => r.receiverId)
    );
  }, [friendRequests, currentUser?.id]);

  // Recent chat conversations
  const recentPartners = useMemo(() => {
    if (!currentUser) return [];
    const partnerMap = new Map<string, { lastMsg: any; partnerUser: UserAccount }>();
    const sorted = [...messages].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    for (const msg of sorted) {
      const partnerId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
      if (!partnerId || partnerId === currentUser.id) continue;

      if (!partnerMap.has(partnerId)) {
        const existing: UserAccount | undefined = users.find(u => u.id === partnerId);
        const existingAvatar = existing ? existing.avatar : '';
        const partnerName = partnerId === 'user-admin' 
          ? (lang === 'fr' ? 'Support RoiGroupeS' : 'الدعم الفني وإدارة RoiGroupeS')
          : (existing?.name || (msg.senderId !== currentUser.id ? msg.senderName : (lang === 'fr' ? 'Membre' : 'عضو المنصة')));

        const partnerUser: UserAccount = existing ? existing : {
          id: partnerId,
          name: partnerName,
          email: `${partnerId}@member.roigroupes.com`,
          avatar: partnerId === 'user-admin'
            ? '/assets/aistudio/1793173133604_a080e212.jpg'
            : (existingAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=f59e0b&color=020617`),
          role: partnerId === 'user-admin' ? 'admin' : 'user',
          provider: 'email',
          status: 'active',
          joinedDate: msg.timestamp
        };

        partnerMap.set(partnerId, { lastMsg: msg, partnerUser });
      }
    }

    return Array.from(partnerMap.values());
  }, [messages, currentUser?.id, users, lang]);

  // Accepted friends list for members
  const friendsList = useMemo(() => {
    if (!currentUser) return [];
    return users.filter(u => u.id !== currentUser.id && isFriend(u.id));
  }, [users, currentUser, isFriend]);

  // All users (for admin or discover)
  const allOtherUsers = useMemo(() => {
    return users.filter(u => 
      u.id !== currentUser?.id && 
      (u.name.toLowerCase().includes(search.toLowerCase()) || 
       (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
       (u.phone && u.phone.includes(search)))
    ).sort((a, b) => {
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (b.role === 'admin' && a.role !== 'admin') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [users, currentUser?.id, search]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden select-none text-slate-900 dark:text-white">
      {/* Top Header */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-xs sm:text-sm truncate flex items-center gap-1.5">
              <span>{lang === 'fr' ? 'Messagerie' : 'دردشة المنصة'}</span>
              {isAdmin && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black shrink-0">
                  {lang === 'fr' ? 'Admin' : 'مدير الموقع'}
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 truncate">
              {isAdmin 
                ? (lang === 'fr' ? 'Accès direct à tous les membres' : 'مراسلة جميع المسجلين والزوار مباشرة')
                : (lang === 'fr' ? 'Amis & Support officiel' : 'التواصل مع الأصدقاء وإدارة المنصة')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer rounded-lg shrink-0"
          title={lang === 'fr' ? 'Fermer' : 'إغلاق'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Guest Mode Banner */}
      {isGuest && (
        <div className="mx-2.5 mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[10px] font-bold text-amber-900 dark:text-amber-300 shrink-0">
          <span>{lang === 'fr' ? 'Mode Visiteur actif' : 'أنت متصل كزائر'}</span>
          <button 
            type="button" 
            onClick={() => setIsAuthModalOpen(true)}
            className="underline hover:text-amber-500 cursor-pointer font-black"
          >
            {lang === 'fr' ? 'Connexion' : 'تسجيل الدخول'}
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-2.5 pb-1 shrink-0">
        <div className="relative">
          <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isAdmin 
                ? (lang === 'fr' ? 'Chercher parmi tous les utilisateurs...' : 'بحث في كل المسجلين والزوار...')
                : (lang === 'fr' ? 'Chercher un ami ou un membre...' : 'بحث عن صديق أو عضو بالاسم أو الهاتف...')
            }
            className="w-full ltr:pl-8 rtl:pr-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/40 outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-2.5 pt-1 pb-1.5 flex gap-1 border-b border-slate-100 dark:border-slate-800 shrink-0">
        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 px-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? `Tous (${allOtherUsers.length})` : `كل المسجلين (${allOtherUsers.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('recent')}
              className={`flex-1 py-1.5 px-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'recent'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'fr' ? `Récentes (${recentPartners.length})` : `المحادثات (${recentPartners.length})`}</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-1.5 px-1.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'friends'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>{lang === 'fr' ? `Amis (${friendsList.length})` : `الأصدقاء (${friendsList.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`relative flex-1 py-1.5 px-1.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'requests'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BellRing className="w-3 h-3" />
              <span>{lang === 'fr' ? 'Demandes' : 'الطلبات'}</span>
              {incomingRequests.length > 0 && (
                <span className="w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {incomingRequests.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={`flex-1 py-1.5 px-1.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'discover'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3 h-3" />
              <span>{lang === 'fr' ? 'Ajouter' : 'إضافة صديق'}</span>
            </button>
          </>
        )}
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {/* Pinned Support/Admin Row (Always visible for non-admin to ensure anyone can message admin) */}
        {!isAdmin && !search && (
          <div 
            onClick={() => onSelectUser('user-admin')}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent hover:from-amber-500/30 border-2 border-amber-500/40 cursor-pointer transition-all flex items-center justify-between gap-2.5 shadow-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/assets/aistudio/1793173133604_a080e212.jpg"
                  className="w-10 h-10 rounded-xl object-cover border-2 border-amber-500 shadow-xs"
                  alt="RoiGroupeS"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1 truncate">
                  <span>{lang === 'fr' ? 'Direction & Support RoiGroupeS' : 'الدعم الفني وإدارة RoiGroupeS'}</span>
                  <span title="Officiel">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  </span>
                </h4>
                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold truncate">
                  {lang === 'fr' ? 'Disponible 24/7 pour tous les membres' : 'متاح دائماً لمراسلة الجميع والاستفسارات'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {supportUnread > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full animate-bounce">
                  {supportUnread}
                </span>
              )}
              <span className="p-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-black font-mono">
                ←
              </span>
            </div>
          </div>
        )}

        {/* ---------------- ADMIN VIEW: ALL REGISTERED USERS ---------------- */}
        {isAdmin && activeTab === 'all' && (
          <div className="space-y-1.5">
            <div className="px-1 py-0.5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{lang === 'fr' ? 'Tous les membres enregistrés' : 'كل الأعضاء والزوار المسجلين'}</span>
              <span>{allOtherUsers.length}</span>
            </div>

            {allOtherUsers.length === 0 ? (
              <div className="text-center py-8 opacity-50">
                <User className="w-8 h-8 mx-auto mb-1 text-slate-400" />
                <p className="text-xs">{lang === 'fr' ? 'Aucun membre' : 'لا يوجد مسجلين مطابقين للبحث'}</p>
              </div>
            ) : (
              allOtherUsers.map(user => {
                const unread = getUnreadCount(user.id);
                const isGuestUser = user.id.startsWith('guest-');
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all border border-transparent hover:border-amber-500/20"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectUser(user.id)}
                      className="flex flex-1 items-center gap-2.5 text-start cursor-pointer min-w-0"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar || 'https://ui-avatars.com/api/?name=User'}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          alt={user.name}
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-black truncate">{user.name}</h4>
                          {unread > 0 && (
                            <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full">
                              {unread}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                          {isGuestUser ? (
                            <span className="text-amber-500 font-bold">{lang === 'fr' ? 'Visiteur' : 'زائر'}</span>
                          ) : (
                            <span>{user.email || 'عضو مسجل'}</span>
                          )}
                          {user.phone && <span className="text-emerald-500 font-mono">• {user.phone}</span>}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      {user.phone && (
                        <a
                          href={`tel:${user.phone}`}
                          className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectUser(user.id)}
                        className="px-2.5 py-1.5 bg-amber-500 text-slate-950 font-black text-[11px] rounded-xl hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{lang === 'fr' ? 'Contacter' : 'مراسلة'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ---------------- ADMIN & REGULAR: RECENT CHATS TAB ---------------- */}
        {((isAdmin && activeTab === 'recent') || (!isAdmin && activeTab === 'friends' && search)) && (
          <div className="space-y-1">
            {recentPartners.length === 0 ? (
              <div className="text-center py-8 opacity-50">
                <Clock className="w-8 h-8 mx-auto mb-1 text-slate-400" />
                <p className="text-xs">{lang === 'fr' ? 'Aucune conversation récente' : 'لا توجد محادثات حديثة'}</p>
              </div>
            ) : (
              recentPartners.map(({ partnerUser, lastMsg }) => {
                const unread = getUnreadCount(partnerUser.id);
                const isMe = lastMsg.senderId === currentUser?.id;
                return (
                  <button
                    key={partnerUser.id}
                    type="button"
                    onClick={() => onSelectUser(partnerUser.id)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all text-start cursor-pointer border border-transparent hover:border-amber-500/20"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={partnerUser.avatar || 'https://ui-avatars.com/api/?name=User'}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        alt={partnerUser.name}
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-black truncate">{partnerUser.name}</h4>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                          {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                          {isMe && (
                            <span className="shrink-0 text-slate-400">
                              {lastMsg.isRead ? <CheckCheck className="w-3 h-3 text-blue-500 inline" /> : <Check className="w-3 h-3 inline" />}
                            </span>
                          )}
                          <span className="truncate">{lastMsg.text}</span>
                        </p>
                        {unread > 0 && (
                          <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full shrink-0 shadow-xs">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* ---------------- REGULAR MEMBER TAB 1: FRIENDS ONLY ---------------- */}
        {!isAdmin && activeTab === 'friends' && !search && (
          <div className="space-y-1">
            <div className="px-1 py-0.5 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{lang === 'fr' ? 'Vos amis acceptés' : 'الأصدقاء المعتمدون'}</span>
              <span>{friendsList.length}</span>
            </div>

            {friendsList.length === 0 ? (
              <div className="text-center py-6 px-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Users className="w-8 h-8 mx-auto text-amber-500/70" />
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Aucun ami pour le moment' : 'لم تقم بإضافة أصدقاء بعد'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {lang === 'fr' 
                    ? 'Vous pouvez discuter directement avec le Support RoiGroupeS en haut, ou ajouter des membres en amis.'
                    : 'يمكنك دائماً مراسلة إدارة ودعم المنصة بالأعلى، أو إرسال طلبات صداقة للأعضاء للتواصل معهم.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('discover')}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? 'Rechercher des membres' : 'البحث عن أعضاء وإضافتهم'}</span>
                </button>
              </div>
            ) : (
              friendsList.map(friend => {
                const unread = getUnreadCount(friend.id);
                return (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => onSelectUser(friend.id)}
                    className="w-full flex items-center justify-between gap-2.5 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all text-start cursor-pointer border border-transparent hover:border-amber-500/20"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={friend.avatar || 'https://ui-avatars.com/api/?name=User'}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        alt={friend.name}
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-black truncate">{friend.name}</h4>
                        {unread > 0 && (
                          <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full shadow-xs">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        <span>{lang === 'fr' ? 'Ami vérifié' : 'صديق مؤكد • متاح للمراسلة'}</span>
                      </p>
                    </div>

                    <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500 text-xs font-black shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* ---------------- REGULAR MEMBER TAB 2: FRIEND REQUESTS ---------------- */}
        {!isAdmin && activeTab === 'requests' && (
          <div className="space-y-3">
            {/* Incoming Requests */}
            <div>
              <div className="px-1 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'fr' ? 'Demandes reçues' : 'طلبات الصداقة الواردة'} ({incomingRequests.length})
              </div>

              {incomingRequests.length === 0 ? (
                <div className="text-center py-4 opacity-50 text-[11px]">
                  {lang === 'fr' ? 'Aucune nouvelle demande' : 'لا توجد طلبات صداقة واردة معلقة'}
                </div>
              ) : (
                <div className="space-y-2">
                  {incomingRequests.map(req => (
                    <div 
                      key={req.id}
                      className="p-2.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={req.senderAvatar || 'https://ui-avatars.com/api/?name=User'}
                          className="w-9 h-9 rounded-xl object-cover border border-amber-500/40"
                          alt={req.senderName}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-black truncate">{req.senderName}</h4>
                          <span className="text-[9px] text-slate-400">
                            {new Date(req.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => acceptFriendRequest(req.id)}
                          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] rounded-lg transition-all cursor-pointer shadow-xs"
                        >
                          {lang === 'fr' ? 'Accepter' : 'قبول'}
                        </button>
                        <button
                          type="button"
                          onClick={() => declineFriendRequest(req.id)}
                          className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                        >
                          {lang === 'fr' ? 'Refuser' : 'رفض'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing pending requests */}
            <div>
              <div className="px-1 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {lang === 'fr' ? 'Demandes envoyées (en attente)' : 'طلبات أرسلتها (بانتظار الموافقة)'}
              </div>
              {outgoingPendingIds.size === 0 ? (
                <div className="text-center py-2 opacity-40 text-[10px]">
                  {lang === 'fr' ? 'Aucune demande en attente' : 'لا توجد طلبات معلقة مرسلة'}
                </div>
              ) : (
                <div className="space-y-1">
                  {users.filter(u => outgoingPendingIds.has(u.id)).map(u => (
                    <div key={u.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <img src={u.avatar} className="w-7 h-7 rounded-lg object-cover" alt={u.name} />
                        <span className="font-bold truncate">{u.name}</span>
                      </div>
                      <span className="text-[10px] text-amber-500 font-bold shrink-0">
                        {lang === 'fr' ? 'En attente...' : 'قيد الانتظار...'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- REGULAR MEMBER TAB 3: DISCOVER & ADD FRIENDS ---------------- */}
        {!isAdmin && activeTab === 'discover' && (
          <div className="space-y-1.5">
            <div className="px-1 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'fr' ? 'Membres de la plateforme' : 'أعضاء المنصة المسجلين'} ({allOtherUsers.length})
            </div>

            {allOtherUsers.length === 0 ? (
              <div className="text-center py-6 opacity-50">
                <User className="w-8 h-8 mx-auto mb-1 text-slate-400" />
                <p className="text-xs">{lang === 'fr' ? 'Aucun membre' : 'لم يتم العثور على أعضاء'}</p>
              </div>
            ) : (
              allOtherUsers.map(user => {
                const alreadyFriend = isFriend(user.id);
                const isPending = outgoingPendingIds.has(user.id);

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all border border-transparent hover:border-amber-500/20"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar || 'https://ui-avatars.com/api/?name=User'}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        alt={user.name}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black truncate">{user.name}</h4>
                        <p className="text-[9px] text-slate-400 truncate">
                          {user.role === 'admin' ? 'إدارة' : 'عضو مسجل'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {alreadyFriend ? (
                        <button
                          type="button"
                          onClick={() => onSelectUser(user.id)}
                          className="px-2.5 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>{lang === 'fr' ? 'Discuter' : 'صديق • دردش'}</span>
                        </button>
                      ) : isPending ? (
                        <span className="px-2 py-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[10px] rounded-lg">
                          {lang === 'fr' ? 'En attente' : 'طلب معلق'}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => sendFriendRequest(user.id)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>{lang === 'fr' ? 'Ajouter' : 'إضافة صديق'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
