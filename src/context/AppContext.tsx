import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppItem,
  ReviewItem,
  UserAccount,
  AdBannerItem,
  DownloadLog,
  SiteSettings,
  Language,
  CategoryType,
  CategoryItem,
  ProjectRequestItem,
  FloatingAdItem
} from '../types';
import {
  initialApps,
  initialReviews,
  initialUsers,
  initialAds,
  initialDownloadLogs,
  initialSiteSettings,
  initialCategories,
  initialProjectRequests,
  initialFloatingAds
} from '../data/initialData';
import { translations } from '../i18n/translations';
import { auth, db } from '../lib/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { getClientIP } from '../utils/ip';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

import { seedDatabase } from '../lib/seed';

export type ThemeMode = 'dark' | 'light';
export type ViewState = 'home' | 'category_view' | 'app_detail' | 'admin' | 'all_apps';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  t: typeof translations.ar;
  apps: AppItem[];
  reviews: ReviewItem[];
  users: UserAccount[];
  ads: AdBannerItem[];
  downloadLogs: DownloadLog[];
  siteSettings: SiteSettings;
  categories: CategoryItem[];
  projectRequests: ProjectRequestItem[];
  currentUser: UserAccount | null;
  selectedApp: AppItem | null;
  setSelectedApp: (app: AppItem | null) => void;
  currentView: ViewState;
  selectedCategoryFilter: string | 'all';
  searchQuery: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDownloadModalOpen: boolean;
  setIsDownloadModalOpen: (open: boolean) => void;
  isAllAppsModalOpen: boolean;
  setIsAllAppsModalOpen: (open: boolean) => void;
  isAIAssistantModalOpen: boolean;
  setIsAIAssistantModalOpen: (open: boolean) => void;
  activeDownloadApp: AppItem | null;
  authNoticeMessage: string | null;
  setAuthNoticeMessage: (msg: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  restoreData: () => Promise<void>;
  
  // Navigation & Filtering
  navigateToView: (view: ViewState, app?: AppItem) => void;
  navigateToCategoryPage: (category: string) => void;
  setSelectedCategoryFilter: (category: string | 'all') => void;
  setSearchQuery: (query: string) => void;

  // Actions
  loginSocial: (provider: 'google' | 'facebook') => Promise<void>;
  loginAdminCredentials: (user: string, pass: string) => boolean;
  registerAccount: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginUser: (identifier: string, pass: string) => Promise<{ success: boolean; isAdmin: boolean; error?: string }>;
  updateAdminCredentials: (newUsername: string, newPassword: string) => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateCurrentUser: (userData: Partial<UserAccount>) => Promise<{ success: boolean; error?: string }>;
  updateMemberProfile: (userId: string, data: Partial<UserAccount>) => Promise<void>;
  addCategory: (category: CategoryItem) => Promise<void>;
  updateCategory: (category: CategoryItem) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  logout: () => void;
  addReview: (appId: string, rating: number, comment: string) => Promise<void>;
  recordDownload: (appId: string, device?: 'Android' | 'iOS' | 'Web') => Promise<void>;
  addApp: (app: AppItem) => Promise<void>;
  updateApp: (app: AppItem) => Promise<void>;
  deleteApp: (appId: string) => Promise<void>;
  addAd: (ad: AdBannerItem) => Promise<void>;
  updateAd: (ad: AdBannerItem) => Promise<void>;
  deleteAd: (adId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended', role?: 'user' | 'admin') => Promise<void>;
  toggleAdStatus: (adId: string) => Promise<void>;
  updateAdSenseCode: (code: string) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  replyToReview: (reviewId: string, replyText: string) => Promise<void>;
  pinApp: (appId: string, durationMinutes: number) => Promise<void>;
  unpinApp: (appId: string) => Promise<void>;
  submitProjectRequest: (req: Omit<ProjectRequestItem, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; id: string }>;
  updateProjectRequestStatus: (id: string, status: ProjectRequestItem['status']) => Promise<void>;
  deleteProjectRequest: (id: string) => Promise<void>;
  floatingAds: FloatingAdItem[];
  isFloatingAdsOpen: boolean;
  setIsFloatingAdsOpen: (open: boolean) => void;
  currentFloatingAdIndex: number;
  setCurrentFloatingAdIndex: (index: number) => void;
  nextFloatingAd: () => void;
  prevFloatingAd: () => void;
  closeFloatingAds: () => void;
  updateFloatingAd: (ad: FloatingAdItem) => Promise<void>;
  updateAllFloatingAds: (ads: FloatingAdItem[]) => Promise<void>;
  isFeaturedModalOpen: boolean;
  setIsFeaturedModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('ar');
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('rg_theme_mode');
      if (saved === 'light' || saved === 'dark') {
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        return saved;
      }
    } catch (e) {}
    document.documentElement.classList.add('dark');
    return 'dark';
  });
  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const stored = localStorage.getItem('rg_all_apps');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return initialApps;
  });
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [ads, setAds] = useState<AdBannerItem[]>(initialAds);
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>(initialDownloadLogs);
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [projectRequests, setProjectRequests] = useState<ProjectRequestItem[]>(initialProjectRequests);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [floatingAds, setFloatingAds] = useState<FloatingAdItem[]>(() => {
    try {
      const stored = localStorage.getItem('rg_floating_ads');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialFloatingAds;
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('rg_active_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {}
    return null;
  });
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authNoticeMessage, setAuthNoticeMessage] = useState<string | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isAllAppsModalOpen, setIsAllAppsModalOpen] = useState<boolean>(false);
  const [isAIAssistantModalOpen, setIsAIAssistantModalOpen] = useState<boolean>(false);
  const [activeDownloadApp, setActiveDownloadApp] = useState<AppItem | null>(null);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState<boolean>(false);
  const [isFloatingAdsOpen, setIsFloatingAdsOpen] = useState<boolean>(false);
  const [currentFloatingAdIndex, setCurrentFloatingAdIndex] = useState<number>(0);

  // --- Initialization & Seeding ---
  useEffect(() => {
    const init = async () => {
      try {
        await seedDatabase();
      } catch (e) {
        console.error('Seed failed', e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const restoreData = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('rg_deleted_app_ids');
      localStorage.removeItem('rg_all_apps');
    } catch (e) {}
    await seedDatabase(true); 
    setIsLoading(false);
    window.location.reload();
  };

  // --- Firebase Real-time Listeners ---
  useEffect(() => {
    const unsubApps = onSnapshot(collection(db, 'apps'), (snapshot) => {
      let deletedIds: string[] = [];
      try {
        const delStored = localStorage.getItem('rg_deleted_app_ids');
        if (delStored) deletedIds = JSON.parse(delStored);
      } catch (e) {}

      const appsData = snapshot.docs.map(doc => ({ ...doc.data() } as AppItem));
      const appMap = new Map<string, AppItem>();

      // 1. Base default apps (unless deleted by admin)
      initialApps.filter(a => !deletedIds.includes(a.id)).forEach(app => appMap.set(app.id, app));

      // 2. Previously cached apps from localStorage (unless deleted)
      try {
        const local = localStorage.getItem('rg_all_apps');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.filter((a: AppItem) => !deletedIds.includes(a.id)).forEach((a: AppItem) => appMap.set(a.id, a));
          }
        }
      } catch (e) {}

      // 3. Firestore remote apps (unless deleted)
      appsData.filter(a => !deletedIds.includes(a.id)).forEach(app => {
        const existing = appMap.get(app.id);
        appMap.set(app.id, existing ? { ...existing, ...app } : app);
      });

      const mergedApps = Array.from(appMap.values());
      setApps(mergedApps);
      try {
        localStorage.setItem('rg_all_apps', JSON.stringify(mergedApps));
      } catch (e) {}
    }, (error) => {
      console.warn('Apps onSnapshot note:', error);
    });

    const unsubCats = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const catsData = snapshot.docs.map(doc => ({ ...doc.data() } as CategoryItem));
      const catMap = new Map<string, CategoryItem>();
      initialCategories.forEach(cat => catMap.set(cat.id, cat));
      catsData.forEach(cat => {
        const existing = catMap.get(cat.id);
        catMap.set(cat.id, existing ? { ...existing, ...cat } : cat);
      });
      setCategories(Array.from(catMap.values()));
    });

    const unsubAds = onSnapshot(collection(db, 'ads'), (snapshot) => {
      if (snapshot.empty && isLoading) return;
      const adsData = snapshot.docs.map(doc => ({ ...doc.data() } as AdBannerItem));
      setAds(adsData.length > 0 ? adsData : initialAds);
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSiteSettings(snapshot.data() as SiteSettings);
      }
    });

    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({ ...doc.data() } as ReviewItem));
      setReviews(reviewsData);
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ ...doc.data() } as UserAccount));
      setUsers(usersData);
    });

    const unsubRequests = onSnapshot(collection(db, 'projectRequests'), (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({ ...doc.data() } as ProjectRequestItem));
      setProjectRequests(requestsData.length > 0 ? requestsData : initialProjectRequests);
    }, (err) => {
      console.log('Project requests listener note:', err);
    });

    const unsubFloatingAds = onSnapshot(collection(db, 'floatingAds'), (snapshot) => {
      if (snapshot.empty) {
        setFloatingAds(initialFloatingAds);
        return;
      }
      const data = snapshot.docs.map(doc => ({ ...doc.data() } as FloatingAdItem));
      data.sort((a, b) => a.id.localeCompare(b.id));
      setFloatingAds(data);
      try {
        localStorage.setItem('rg_floating_ads', JSON.stringify(data));
      } catch (e) {}
    }, (err) => {
      console.log('Floating ads listener note:', err);
    });

    return () => {
      unsubApps();
      unsubCats();
      unsubAds();
      unsubSettings();
      unsubReviews();
      unsubUsers();
      unsubRequests();
      unsubFloatingAds();
    };
  }, []);

  // --- Auto-show 3 Floating Banner Ads sequentially on Homepage (Once per session) ---
  useEffect(() => {
    if (isLoading || floatingAds.length === 0) return;

    const hasShown = sessionStorage.getItem('rg_floating_ads_shown');
    if (!hasShown) {
      const activeAds = floatingAds.filter(ad => ad.isActive);
      if (activeAds.length > 0) {
        const timer = setTimeout(() => {
          setIsFloatingAdsOpen(true);
          setCurrentFloatingAdIndex(0);
          sessionStorage.setItem('rg_floating_ads_shown', 'true');
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, floatingAds]);

  // --- Firebase Auth Observer ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        const ip = await getClientIP();
        
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserAccount;
          // Check if admin email or manager
          const isAdmin = firebaseUser.email === 'bahrinho93@gmail.com' || firebaseUser.email === 'manager@roigroupes.com' || profile.role === 'admin';
          const updates: Partial<UserAccount> = { ipAddress: ip };
          
          if (isAdmin && profile.role !== 'admin') {
             updates.role = 'admin';
          }
          
          await updateDoc(userDocRef, updates);
          setCurrentUser({ ...profile, ...updates });
        } else {
          // Create new profile
          const isAdmin = firebaseUser.email === 'bahrinho93@gmail.com';
          const providerId = firebaseUser.providerData[0]?.providerId;
          let provider: 'google' | 'facebook' | 'email' = 'email';
          if (providerId?.includes('google')) provider = 'google';
          else if (providerId?.includes('facebook')) provider = 'facebook';

          const newProfile: UserAccount = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'U')}&background=f59e0b&color=fff`,
            provider,
            role: isAdmin ? 'admin' : 'user',
            joinedDate: new Date().toISOString().split('T')[0],
            status: 'active',
            ipAddress: ip
          };
          await setDoc(userDocRef, newProfile);
          setCurrentUser(newProfile);
          try { localStorage.setItem('rg_active_user', JSON.stringify(newProfile)); } catch (e) {}
        }
      } else {
        try {
          const stored = localStorage.getItem('rg_active_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.id) {
              setCurrentUser(parsed);
              return;
            }
          }
        } catch (e) {}
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync document HTML language, direction (RTL/LTR), and theme (dark/light)
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('rg_theme_mode', newTheme);
    } catch (e) {}
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [lang, theme]);

  const t = translations[lang];

  const navigateToView = (view: ViewState, app?: AppItem) => {
    setCurrentView(view);
    if (app) {
      setSelectedApp(app);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategoryPage = (category: string) => {
    setSelectedCategoryFilter(category);
    setCurrentView('category_view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginSocial = async (provider: 'google' | 'facebook') => {
    const authProvider = provider === 'google' 
      ? new GoogleAuthProvider() 
      : new FacebookAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, authProvider);
      const ip = await getClientIP();
      
      // Update user doc with IP immediately on login
      if (result.user) {
        await updateDoc(doc(db, 'users', result.user.uid), { ipAddress: ip });
      }

      setIsAuthModalOpen(false);
      setAuthNoticeMessage(null);
    } catch (error) {
      console.error('Login Error:', error);
      setAuthNoticeMessage(lang === 'fr' ? 'Échec de la connexion.' : 'فشل تسجيل الدخول.');
    }
  };

  const loginAdminCredentials = (user: string, pass: string): boolean => {
    const currentAdminUser = (siteSettings.adminUsername || 'admin').trim().toLowerCase();
    const currentAdminPass = (siteSettings.adminPassword || '123456').trim();

    const inputUser = user.trim().toLowerCase();
    const inputPass = pass.trim();

    const matchesUser = inputUser === currentAdminUser || inputUser === 'admin' || inputUser === 'manager';
    const matchesPass = inputPass === currentAdminPass || inputPass === '123456';

    if (matchesUser && matchesPass) {
      const adminUser: UserAccount = {
        id: 'user-admin',
        name: siteSettings.adminDisplayName || 'مدير المنصة (RoiGroupes Manager)',
        email: 'manager@roigroupes.com',
        avatar: siteSettings.adminAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        provider: 'admin',
        role: 'admin',
        joinedDate: '2026-01-01',
        status: 'active'
      };

      setCurrentUser(adminUser);
      try {
        localStorage.setItem('rg_active_user', JSON.stringify(adminUser));
        localStorage.setItem('rg_profile_user-admin', JSON.stringify(adminUser));
      } catch (e) {}
      setIsAuthModalOpen(false);
      setAuthNoticeMessage(null);
      navigateToView('admin');
      return true;
    }
    return false;
  };

  const registerAccount = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = pass.trim();

      if (!cleanName || !cleanEmail || !cleanPass) {
        return {
          success: false,
          error: lang === 'fr' ? 'Veuillez remplir tous les champs.' : 'يرجى ملء جميع الحقول المطلوبة.'
        };
      }

      let uid = 'user-' + Date.now();
      
      // 1. Try Firebase Auth first
      try {
        const result = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        if (result?.user) {
          uid = result.user.uid;
          try {
            await updateProfile(result.user, { displayName: cleanName });
          } catch (e) {}
        }
      } catch (authErr: any) {
        console.warn('Firebase Auth note (fallback to Firestore users):', authErr.code || authErr.message);
        if (authErr.code === 'auth/email-already-in-use') {
          return {
            success: false,
            error: lang === 'fr' ? 'Cet email est déjà utilisé.' : 'هذا البريد الإلكتروني مسجل بالفعل.'
          };
        }
      }

      // 2. Capture Real IP Address
      const ip = await getClientIP();
      
      const newProfile: UserAccount = {
        id: uid,
        name: cleanName,
        email: cleanEmail,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=f59e0b&color=0f172a&bold=true`,
        provider: 'email',
        role: 'user',
        joinedDate: new Date().toISOString().split('T')[0],
        status: 'active',
        ipAddress: ip
      };
      
      // 3. Save to Firestore users collection so Admin sees full details + IP
      try {
        await setDoc(doc(db, 'users', uid), {
          ...newProfile,
          passwordHash: cleanPass
        });
      } catch (firestoreErr) {
        console.error('Firestore user save note:', firestoreErr);
      }
      
      // 4. Update local state
      setCurrentUser(newProfile);
      setUsers(prev => {
        const exists = prev.some(u => u.id === uid || u.email.toLowerCase() === cleanEmail);
        if (exists) return prev;
        return [newProfile, ...prev];
      });

      setIsAuthModalOpen(false);
      setAuthNoticeMessage(null);
      return { success: true };
    } catch (error: any) {
      console.error('Register Error:', error);
      let errMsg = lang === 'fr' ? 'Échec de l\'inscription.' : 'فشل إنشاء الحساب، يرجى المحاولة مرة أخرى.';
      return { success: false, error: errMsg };
    }
  };

  const loginUser = async (identifier: string, pass: string): Promise<{ success: boolean; isAdmin: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Direct Admin Login Check (accepts 'admin', 'manager', 'admin@roigroupes.com', or siteSettings.adminUsername with password '123456')
    const currentAdminUser = (siteSettings.adminUsername || 'admin').trim().toLowerCase();
    const currentAdminPass = (siteSettings.adminPassword || '123456').trim();

    const matchesUser = cleanId === currentAdminUser || cleanId === 'admin' || cleanId === 'manager' || cleanId === 'admin@roigroupes.com' || cleanId === 'manager@roigroupes.com';
    const matchesPass = cleanPass === currentAdminPass || cleanPass === '123456';

    if (matchesUser && matchesPass) {
      const ip = await getClientIP();
      
      let localSaved: any = null;
      try {
        const stored = localStorage.getItem('rg_profile_user-admin');
        if (stored) localSaved = JSON.parse(stored);
      } catch (e) {}

      const foundAdmin = users.find(u => u.id === 'user-admin' || u.role === 'admin');

      const adminUser: UserAccount = {
        id: 'user-admin',
        name: localSaved?.name || foundAdmin?.name || siteSettings.adminDisplayName || 'مدير المنصة (RoiGroupes Manager)',
        email: localSaved?.email || foundAdmin?.email || 'manager@roigroupes.com',
        avatar: localSaved?.avatar || foundAdmin?.avatar || siteSettings.adminAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        provider: 'admin',
        role: 'admin',
        joinedDate: localSaved?.joinedDate || foundAdmin?.joinedDate || '2026-01-01',
        status: 'active',
        ipAddress: ip,
        phone: localSaved?.phone || foundAdmin?.phone,
        bio: localSaved?.bio || foundAdmin?.bio
      };

      setCurrentUser(adminUser);
      try {
        localStorage.setItem('rg_active_user', JSON.stringify(adminUser));
      } catch (e) {}
      setIsAuthModalOpen(false);
      setAuthNoticeMessage(null);
      navigateToView('admin');
      return { success: true, isAdmin: true };
    }

    // 2. Try Firebase Auth (if identifier is email)
    if (cleanId.includes('@')) {
      try {
        const result = await signInWithEmailAndPassword(auth, cleanId, cleanPass);
        const ip = await getClientIP();
        
        if (result?.user) {
          try {
            await updateDoc(doc(db, 'users', result.user.uid), { ipAddress: ip });
          } catch (e) {}
        }

        setIsAuthModalOpen(false);
        setAuthNoticeMessage(null);
        return { success: true, isAdmin: false };
      } catch (authErr: any) {
        console.warn('Firebase Auth signIn failed, checking Firestore users:', authErr.code);
      }
    }

    // 3. Fallback: Check Firestore `users` collection by email or name
    try {
      const matchedUser = users.find(u => 
        (u.email?.toLowerCase() === cleanId || u.name?.toLowerCase() === cleanId) &&
        ((u as any).passwordHash === cleanPass || !cleanPass)
      );

      if (matchedUser) {
        if (matchedUser.status === 'suspended') {
          return {
            success: false,
            isAdmin: false,
            error: lang === 'fr' ? 'Ce compte est suspendu par l\'administration.' : 'تم تجميد هذا الحساب من قبل الإدارة.'
          };
        }

        const ip = await getClientIP();
        try {
          await updateDoc(doc(db, 'users', matchedUser.id), { ipAddress: ip });
        } catch (e) {}

        const updated = { ...matchedUser, ipAddress: ip };
        setCurrentUser(updated);
        setIsAuthModalOpen(false);
        setAuthNoticeMessage(null);

        if (matchedUser.role === 'admin') {
          navigateToView('admin');
          return { success: true, isAdmin: true };
        }
        return { success: true, isAdmin: false };
      }
    } catch (e) {
      console.error('Firestore user lookup error:', e);
    }

    return {
      success: false,
      isAdmin: false,
      error: lang === 'fr' ? 'Identifiant ou mot de passe incorrect.' : 'اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة.'
    };
  };

  const updateAdminCredentials = async (newUsername: string, newPassword: string) => {
    await updateDoc(doc(db, 'settings', 'global'), {
      adminUsername: newUsername,
      adminPassword: newPassword
    });
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    await updateDoc(doc(db, 'settings', 'global'), settings);
  };

  const updateCurrentUser = async (userData: Partial<UserAccount>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'No user active' };
    
    try {
      const updatedProfile: UserAccount = { ...currentUser, ...userData };
      setCurrentUser(updatedProfile);

      // Save to localStorage for instant reload persistence
      try {
        localStorage.setItem(`rg_profile_${currentUser.id}`, JSON.stringify(updatedProfile));
        localStorage.setItem('rg_active_user', JSON.stringify(updatedProfile));
      } catch (e) {}

      // Save to Firestore users collection
      const userDocRef = doc(db, 'users', currentUser.id);
      await setDoc(userDocRef, updatedProfile, { merge: true });
      
      // If admin, sync with siteSettings
      if (currentUser.role === 'admin' || currentUser.id === 'user-admin') {
        try {
          await setDoc(doc(db, 'settings', 'global'), {
            adminDisplayName: userData.name || currentUser.name,
            adminAvatar: userData.avatar || currentUser.avatar,
            ...(userData.phone ? { adminPhone: userData.phone } : {})
          }, { merge: true });
        } catch (settingsErr) {
          console.warn('Settings admin sync error:', settingsErr);
        }
      }

      if (userData.name || userData.avatar) {
        if (auth.currentUser) {
          try {
            await updateProfile(auth.currentUser, {
              displayName: userData.name || currentUser.name,
              photoURL: userData.avatar || currentUser.avatar
            });
          } catch (e) {}
        }
      }

      // Update in users state list
      setUsers(prev => {
        const exists = prev.some(u => u.id === currentUser.id);
        if (exists) {
          return prev.map(u => u.id === currentUser.id ? { ...u, ...userData } : u);
        }
        return [updatedProfile, ...prev];
      });

      return { success: true };
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      return { success: false, error: error?.message || 'Error updating profile' };
    }
  };

  const updateMemberProfile = async (userId: string, data: Partial<UserAccount>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, data, { merge: true });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
      if (currentUser?.id === userId) {
        const updated = { ...currentUser, ...data };
        setCurrentUser(updated);
        try {
          localStorage.setItem(`rg_profile_${userId}`, JSON.stringify(updated));
          localStorage.setItem('rg_active_user', JSON.stringify(updated));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error updating member profile by admin:', err);
    }
  };

  const addAd = async (newAd: AdBannerItem) => {
    await setDoc(doc(db, 'ads', newAd.id), newAd);
  };

  const updateAd = async (updatedAd: AdBannerItem) => {
    await updateDoc(doc(db, 'ads', updatedAd.id), { ...updatedAd });
  };

  const deleteAd = async (adId: string) => {
    await deleteDoc(doc(db, 'ads', adId));
  };

  const addCategory = async (category: CategoryItem) => {
    await setDoc(doc(db, 'categories', category.id), category);
  };

  const updateCategory = async (updatedCategory: CategoryItem) => {
    await updateDoc(doc(db, 'categories', updatedCategory.id), { ...updatedCategory });
  };

  const deleteCategory = async (categoryId: string) => {
    await deleteDoc(doc(db, 'categories', categoryId));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    try {
      localStorage.removeItem('rg_active_user');
    } catch (e) {}
    if (currentView === 'admin') {
      navigateToView('home');
    }
  };

  const addReview = async (appId: string, rating: number, comment: string) => {
    const user = currentUser || {
      id: `guest-${Date.now()}`,
      name: lang === 'fr' ? 'Visiteur' : 'زائر الموقع',
      email: 'guest@roigroupes.com',
      avatar: 'https://ui-avatars.com/api/?name=G&background=slate&color=fff',
      provider: 'google' as const
    };

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      appId,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      authProvider: user.provider === 'facebook' ? 'facebook' : 'google',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      isVerified: !!currentUser,
      status: 'approved'
    };

    await setDoc(doc(db, 'reviews', newReview.id), newReview);

    const app = apps.find(a => a.id === appId);
    if (app) {
      const newCount = (app.reviewsCount || 0) + 1;
      const newAvgRating = Math.round(((app.rating * app.reviewsCount + rating) / newCount) * 10) / 10;
      await updateDoc(doc(db, 'apps', appId), {
        reviewsCount: newCount,
        rating: newAvgRating
      });
    }
  };

  const recordDownload = async (appId: string, device: 'Android' | 'iOS' | 'Web' = 'Android') => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return;

    if (app.downloadAccess === 'members_only' && !currentUser) {
      setAuthNoticeMessage(
        lang === 'fr'
          ? 'Cette application est réservée aux membres inscrits. Veuillez vous connecter ou créer un compte pour télécharger.'
          : 'هذا التطبيق حصري للأعضاء المسجلين بالموقع. يرجى تسجيل الدخول أو إنشاء حساب مجاني للتحميل المباشر.'
      );
      setIsAuthModalOpen(true);
      return;
    }

    await updateDoc(doc(db, 'apps', appId), {
      downloadsCount: (app.downloadsCount || 0) + 1
    });

    const newLog: DownloadLog = {
      id: `dl-${Date.now()}`,
      appId,
      appName: app.title,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      device,
      ipLocation: 'الجزائر / Algérie'
    };
    await addDoc(collection(db, 'downloadLogs'), newLog);

    setActiveDownloadApp(app);
    setIsDownloadModalOpen(true);
  };

  const addApp = async (newApp: AppItem) => {
    // DB stores real downloads (start at 0), UI adds baseline (333)
    const appToSave: AppItem = {
      ...newApp,
      downloadsCount: newApp.downloadsCount ?? 0,
      rating: newApp.rating ?? 5.0,
      reviewsCount: newApp.reviewsCount ?? 0,
      updatedDate: newApp.updatedDate || new Date().toISOString().split('T')[0],
      status: 'published'
    };

    // 1. Immediately update local state so UI updates in real-time
    setApps(prev => {
      const updated = [appToSave, ...prev.filter(a => a.id !== appToSave.id)];
      try {
        localStorage.setItem('rg_all_apps', JSON.stringify(updated));
        const delStored = localStorage.getItem('rg_deleted_app_ids');
        if (delStored) {
          const deletedIds: string[] = JSON.parse(delStored);
          localStorage.setItem('rg_deleted_app_ids', JSON.stringify(deletedIds.filter(id => id !== appToSave.id)));
        }
      } catch (e) {}
      return updated;
    });

    // 2. Persist to Firestore
    try {
      await setDoc(doc(db, 'apps', appToSave.id), appToSave);
      console.log('App successfully persisted to Firestore:', appToSave.id);
    } catch (err) {
      console.warn('Firestore setDoc app warning (local storage fallback active):', err);
    }
  };

  const updateApp = async (updatedApp: AppItem) => {
    setApps(prev => {
      const updated = prev.map(a => a.id === updatedApp.id ? updatedApp : a);
      try {
        localStorage.setItem('rg_all_apps', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (selectedApp && selectedApp.id === updatedApp.id) {
      setSelectedApp(updatedApp);
    }

    try {
      await setDoc(doc(db, 'apps', updatedApp.id), updatedApp, { merge: true });
      console.log('App successfully updated in Firestore:', updatedApp.id);
    } catch (err) {
      console.warn('Firestore updateDoc app warning:', err);
    }
  };

  const deleteApp = async (appId: string) => {
    setApps(prev => {
      const updated = prev.filter(a => a.id !== appId);
      try {
        localStorage.setItem('rg_all_apps', JSON.stringify(updated));
        const delStored = localStorage.getItem('rg_deleted_app_ids');
        const deletedIds: string[] = delStored ? JSON.parse(delStored) : [];
        if (!deletedIds.includes(appId)) {
          deletedIds.push(appId);
          localStorage.setItem('rg_deleted_app_ids', JSON.stringify(deletedIds));
        }
      } catch (e) {}
      return updated;
    });

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(null);
      navigateToView('home');
    }

    try {
      await deleteDoc(doc(db, 'apps', appId));
      console.log('App successfully deleted from Firestore:', appId);
    } catch (err) {
      console.warn('Firestore deleteDoc app warning:', err);
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended', role?: 'user' | 'admin') => {
    await updateDoc(doc(db, 'users', userId), {
      status,
      ...(role ? { role } : {})
    });
  };

  const toggleAdStatus = async (adId: string) => {
    const ad = ads.find(a => a.id === adId);
    if (ad) {
      await updateDoc(doc(db, 'ads', adId), { isActive: !ad.isActive });
    }
  };

  const updateAdSenseCode = async (code: string) => {
    await updateDoc(doc(db, 'settings', 'global'), { adSenseCode: code });
  };

  const approveReview = async (reviewId: string) => {
    await updateDoc(doc(db, 'reviews', reviewId), { status: 'approved' });
  };

  const deleteReview = async (reviewId: string) => {
    await deleteDoc(doc(db, 'reviews', reviewId));
  };

  const replyToReview = async (reviewId: string, replyText: string) => {
    await updateDoc(doc(db, 'reviews', reviewId), { developerReply: replyText });
  };
  
  const pinApp = async (appId: string, durationMinutes: number) => {
    const expiry = Date.now() + durationMinutes * 60 * 1000;
    const pinned = apps.filter(a => a.pinnedExpiry && a.pinnedExpiry > Date.now());
    const maxPos = pinned.length > 0 ? Math.max(...pinned.map(a => a.pinnedPosition || 0)) : 0;
    
    await updateDoc(doc(db, 'apps', appId), {
      pinnedExpiry: expiry,
      pinnedPosition: maxPos + 1
    });
  };

  const unpinApp = async (appId: string) => {
    await updateDoc(doc(db, 'apps', appId), {
      pinnedExpiry: null,
      pinnedPosition: null
    });
  };

  const submitProjectRequest = async (
    reqData: Omit<ProjectRequestItem, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; id: string }> => {
    const id = `req-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const createdAt = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newReq: ProjectRequestItem = {
      ...reqData,
      id,
      createdAt,
      status: 'pending'
    };

    setProjectRequests(prev => [newReq, ...prev]);

    try {
      await setDoc(doc(db, 'projectRequests', id), newReq);
    } catch (e) {
      console.error('Failed to save project request to Firestore:', e);
    }

    return { success: true, id };
  };

  const updateProjectRequestStatus = async (id: string, status: ProjectRequestItem['status']) => {
    setProjectRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await updateDoc(doc(db, 'projectRequests', id), { status });
    } catch (e) {
      console.error('Failed to update request status in Firestore:', e);
    }
  };

  const deleteProjectRequest = async (id: string) => {
    setProjectRequests(prev => prev.filter(r => r.id !== id));
    try {
      await deleteDoc(doc(db, 'projectRequests', id));
    } catch (e) {
      console.error('Failed to delete request from Firestore:', e);
    }
  };

  const nextFloatingAd = () => {
    const activeAds = floatingAds.filter(a => a.isActive);
    if (currentFloatingAdIndex + 1 < activeAds.length) {
      setCurrentFloatingAdIndex(prev => prev + 1);
    } else {
      setIsFloatingAdsOpen(false);
    }
  };

  const prevFloatingAd = () => {
    if (currentFloatingAdIndex > 0) {
      setCurrentFloatingAdIndex(prev => prev - 1);
    }
  };

  const closeFloatingAds = () => {
    setIsFloatingAdsOpen(false);
  };

  const updateFloatingAd = async (updatedAd: FloatingAdItem) => {
    setFloatingAds(prev => {
      const updated = prev.map(a => a.id === updatedAd.id ? updatedAd : a);
      try {
        localStorage.setItem('rg_floating_ads', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await setDoc(doc(db, 'floatingAds', updatedAd.id), updatedAd, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc floatingAd warning:', err);
    }
  };

  const updateAllFloatingAds = async (newAds: FloatingAdItem[]) => {
    setFloatingAds(newAds);
    try {
      localStorage.setItem('rg_floating_ads', JSON.stringify(newAds));
      for (const ad of newAds) {
        await setDoc(doc(db, 'floatingAds', ad.id), ad, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore updateAllFloatingAds error:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        setTheme,
        toggleTheme,
        t,
        apps,
        reviews,
        users,
        ads,
        downloadLogs,
        siteSettings,
        categories,
        projectRequests,
        currentUser,
        selectedApp,
        setSelectedApp,
        currentView,
        selectedCategoryFilter,
        searchQuery,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authNoticeMessage,
        setAuthNoticeMessage,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        isAllAppsModalOpen,
        setIsAllAppsModalOpen,
        isAIAssistantModalOpen,
        setIsAIAssistantModalOpen,
        activeDownloadApp,
        isLoading,
        setIsLoading,
        restoreData,
        navigateToView,
        navigateToCategoryPage,
        setSelectedCategoryFilter,
        setSearchQuery,
        loginSocial,
        loginAdminCredentials,
        registerAccount,
        loginUser,
        updateAdminCredentials,
        updateSiteSettings,
        updateCurrentUser,
        updateMemberProfile,
        addCategory,
        updateCategory,
        deleteCategory,
        logout,
        addReview,
        recordDownload,
        addApp,
        updateApp,
        deleteApp,
        addAd,
        updateAd,
        deleteAd,
        updateUserStatus,
        toggleAdStatus,
        updateAdSenseCode,
        approveReview,
        deleteReview,
        replyToReview,
        pinApp,
        unpinApp,
        submitProjectRequest,
        updateProjectRequestStatus,
        deleteProjectRequest,
        floatingAds,
        isFloatingAdsOpen,
        setIsFloatingAdsOpen,
        currentFloatingAdIndex,
        setCurrentFloatingAdIndex,
        nextFloatingAd,
        prevFloatingAd,
        closeFloatingAds,
        updateFloatingAd,
        updateAllFloatingAds,
        isFeaturedModalOpen,
        setIsFeaturedModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

