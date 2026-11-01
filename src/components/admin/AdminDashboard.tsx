import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AppItem, CategoryType, AdBannerItem, ProjectRequestItem, UserAccount } from '../../types';
import { formatDownloadCount } from '../../utils/helpers';
import { processImageFile } from '../../utils/imageUpload';
import {
  LayoutDashboard,
  Grid,
  Users,
  Megaphone,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Ban,
  Shield,
  Download,
  Eye,
  MousePointerClick,
  Save,
  Briefcase,
  UserCheck,
  Star,
  X,
  Code,
  UploadCloud,
  FileCode,
  ImageIcon,
  Check,
  Loader2,
  AlertCircle,
  Lock,
  Key,
  Globe,
  User,
  Layers,
  Smartphone,
  Zap,
  RotateCcw,
  Bot,
  Clock,
  Cpu,
  Phone,
  Mail,
  FileText,
  Camera,
  Video,
  Sparkles
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard component executing render...');
  const {
    lang,
    t,
    apps,
    users,
    reviews,
    ads,
    downloadLogs,
    siteSettings,
    categories,
    projectRequests,
    addApp,
    updateApp,
    deleteApp,
    updateUserStatus,
    toggleAdStatus,
    updateAdSenseCode,
    updateAdminCredentials,
    approveReview,
    deleteReview,
    replyToReview,
    navigateToView,
    currentUser,
    updateCurrentUser,
    addAd,
    updateAd,
    deleteAd,
    pinApp,
    unpinApp,
    restoreData,
    updateSiteSettings,
    addCategory,
    updateCategory,
    deleteCategory,
    updateProjectRequestStatus,
    deleteProjectRequest,
    updateMemberProfile,
    loginUser,
    floatingAds,
    updateFloatingAd,
    updateAllFloatingAds,
    setIsFloatingAdsOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'apps' | 'members' | 'ads' | 'comments' | 'settings' | 'categories' | 'project_requests'
  >('overview');

  // App Modal / Form State for Add / Edit
  const [isAppModalOpen, setIsAppModalOpen] = useState<boolean>(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  const [formTitleAr, setFormTitleAr] = useState('');
  const [formTitleFr, setFormTitleFr] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('commercial');
  const [formShortDescAr, setFormShortDescAr] = useState('');
  const [formShortDescFr, setFormShortDescFr] = useState('');
  const [formFullDescAr, setFormFullDescAr] = useState('');
  const [formFullDescFr, setFormFullDescFr] = useState('');
  const [formSize, setFormSize] = useState('25 MB');
  const [formVersion, setFormVersion] = useState('1.0.0');
  const [formDev, setFormDev] = useState('RoiGroupes Holding');
  const [formBadgeAr, setFormBadgeAr] = useState('تطبيق جديد');
  const [formBadgeFr, setFormBadgeFr] = useState('Nouvelle App');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formDownloadAccess, setFormDownloadAccess] = useState<'public' | 'members_only'>('public');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedBlobUrl, setUploadedBlobUrl] = useState<string>('');
  const [formUploadedFileName, setFormUploadedFileName] = useState<string>('');
  const [formScreenshots, setFormScreenshots] = useState<string[]>([]);
  const [screenshotUrlInput, setScreenshotUrlInput] = useState<string>('');
  const [isUploadingScreenshots, setIsUploadingScreenshots] = useState<boolean>(false);
  const [screenshotsProgress, setScreenshotsProgress] = useState<number>(0);

  const handleAddScreenshotUrl = () => {
    if (screenshotUrlInput.trim()) {
      setFormScreenshots(prev => [...prev, screenshotUrlInput.trim()]);
      setScreenshotUrlInput('');
    }
  };

  // Developer reply state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Management Credentials Update State
  const [newAdminUser, setNewAdminUser] = useState<string>(siteSettings.adminUsername || 'manager');
  const [newAdminPass, setNewAdminPass] = useState<string>(siteSettings.adminPassword || '123456');
  const [credentialsSavedNotice, setCredentialsSavedNotice] = useState<boolean>(false);

  // AdSense Code State
  const [adSenseInput, setAdSenseInput] = useState(siteSettings.adSenseCode);

  // WhatsApp Number State
  const [whatsappInput, setWhatsappInput] = useState(siteSettings.whatsappNumber || '+213797152590');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catNameAr, setCatNameAr] = useState('');
  const [catNameFr, setCatNameFr] = useState('');
  const [catIcon, setCatIcon] = useState('Briefcase');

  // Ad Modal State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [adFormTitleAr, setAdFormTitleAr] = useState('');
  const [adFormTitleFr, setAdFormTitleFr] = useState('');
  const [adFormPlacement, setAdFormPlacement] = useState<'header' | 'sidebar' | 'in_feed' | 'detail'>('header');
  const [adFormImageUrl, setAdFormImageUrl] = useState('');
  const [adFormTargetUrl, setAdFormTargetUrl] = useState('');
  const [adFormType, setAdFormType] = useState<'image' | 'sponsored_app'>('image');
  const [adFormSponsorName, setAdFormSponsorName] = useState('');
  const [adFormSponsorBadge, setAdFormSponsorBadge] = useState('');
  const [isUploadingAdImage, setIsUploadingAdImage] = useState(false);

  // Admin Profile State
  const [adminProfileName, setAdminProfileName] = useState(currentUser?.name || '');
  const [adminProfileAvatar, setAdminProfileAvatar] = useState(currentUser?.avatar || '');
  const [adminProfileEmail, setAdminProfileEmail] = useState(currentUser?.email || '');
  const [isProcessingAdminImg, setIsProcessingAdminImg] = useState(false);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

  // Member Edit State (Admin editing any member)
  const [editingMember, setEditingMember] = useState<UserAccount | null>(null);
  const [memberFormName, setMemberFormName] = useState('');
  const [memberFormAvatar, setMemberFormAvatar] = useState('');
  const [memberFormPhone, setMemberFormPhone] = useState('');
  const [memberFormRole, setMemberFormRole] = useState<'user' | 'admin'>('user');
  const [memberFormStatus, setMemberFormStatus] = useState<'active' | 'suspended'>('active');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isProcessingMemberImg, setIsProcessingMemberImg] = useState(false);
  const memberFileInputRef = useRef<HTMLInputElement>(null);

  // Featured View Customization State
  const [isFeaturedConfigModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [featuredConfigApp, setFeaturedConfigApp] = useState<AppItem | null>(null);
  const [featuredInfoAr, setFeaturedInfoAr] = useState('');
  const [featuredInfoFr, setFeaturedInfoFr] = useState('');
  const [selectedFeaturedReviewIds, setSelectedFeaturedReviewIds] = useState<string[]>([]);
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState('');
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (currentUser && activeTab === 'settings') {
      setAdminProfileName(currentUser.name);
      setAdminProfileAvatar(currentUser.avatar);
      setAdminProfileEmail(currentUser.email);
    }
  }, [currentUser, activeTab]);

  const handleAdminAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingAdminImg(true);
      const optimizedBase64 = await processImageFile(file, 280, 0.85);
      setAdminProfileAvatar(optimizedBase64);
    } catch (err) {
      console.error('Admin avatar upload error:', err);
    } finally {
      setIsProcessingAdminImg(false);
      if (adminFileInputRef.current) adminFileInputRef.current.value = '';
    }
  };

  const handleMemberAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingMemberImg(true);
      const optimizedBase64 = await processImageFile(file, 280, 0.85);
      setMemberFormAvatar(optimizedBase64);
    } catch (err) {
      console.error('Member avatar upload error:', err);
    } finally {
      setIsProcessingMemberImg(false);
      if (memberFileInputRef.current) memberFileInputRef.current.value = '';
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    await updateMemberProfile(editingMember.id, {
      name: memberFormName.trim(),
      avatar: memberFormAvatar || editingMember.avatar,
      phone: memberFormPhone.trim(),
      role: memberFormRole,
      status: memberFormStatus
    });
    setIsMemberModalOpen(false);
  };

  const openAddAppModal = () => {
    setEditingApp(null);
    setFormTitleAr('');
    setFormTitleFr('');
    setFormCategory('commercial');
    setFormShortDescAr('');
    setFormShortDescFr('');
    setFormFullDescAr('');
    setFormFullDescFr('');
    setFormSize('25 MB');
    setFormVersion('1.0.0');
    setFormDev('RoiGroupes Holding');
    setFormBadgeAr('تطبيق جديد');
    setFormBadgeFr('Nouvelle App');
    setFormIsFeatured(false);
    setFormDownloadAccess('public');
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadedBlobUrl('');
    setFormUploadedFileName('');
    setFormScreenshots([]);
    setIsAppModalOpen(true);
  };

  const openEditAppModal = (app: AppItem) => {
    setEditingApp(app);
    setFormTitleAr(app.title);
    setFormTitleFr(app.titleFr);
    setFormCategory(app.category);
    setFormShortDescAr(app.shortDesc);
    setFormShortDescFr(app.shortDescFr);
    setFormFullDescAr(app.fullDesc);
    setFormFullDescFr(app.fullDescFr);
    setFormSize(app.size);
    setFormVersion(app.version);
    setFormDev(app.developer);
    setFormBadgeAr(app.badge);
    setFormBadgeFr(app.badgeFr);
    setFormIsFeatured(!!app.isFeatured);
    setFormDownloadAccess(app.downloadAccess || 'public');
    setUploadedFile(null);
    setUploadProgress(100);
    setIsUploading(false);
    setUploadedBlobUrl(app.uploadedFileBlobUrl || app.downloadLinks.androidUrl);
    setFormUploadedFileName(app.uploadedFileName || '');
    setFormScreenshots(app.screenshots || []);
    setIsAppModalOpen(true);
  };

  const openFeaturedConfigModal = (app: AppItem) => {
    setFeaturedConfigApp(app);
    setFeaturedInfoAr(app.featuredCustomInfoAr || '');
    setFeaturedInfoFr(app.featuredCustomInfoFr || '');
    setSelectedFeaturedReviewIds(app.featuredReviewIds || []);
    setFeaturedVideoUrl(app.videoUrl || '');
    setVideoUploadProgress(app.videoUrl ? 100 : 0);
    setIsFeaturedModalOpen(true);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsVideoUploading(true);
      setVideoUploadProgress(10);

      const progressTimer = setInterval(() => {
        setVideoUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 300);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressTimer);

        if (response.ok) {
          const data = await response.json();
          setFeaturedVideoUrl(data.url);
        } else {
          setFeaturedVideoUrl(URL.createObjectURL(file));
        }
      } catch (error) {
        clearInterval(progressTimer);
        setFeaturedVideoUrl(URL.createObjectURL(file));
      } finally {
        setVideoUploadProgress(100);
        setIsVideoUploading(false);
      }
    }
  };

  const handleSaveFeaturedConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featuredConfigApp) return;

    await updateApp({
      ...featuredConfigApp,
      featuredCustomInfoAr: featuredInfoAr,
      featuredCustomInfoFr: featuredInfoFr,
      featuredReviewIds: selectedFeaturedReviewIds,
      videoUrl: featuredVideoUrl
    });

    setIsFeaturedModalOpen(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // Suggest the original filename if the user hasn't typed one yet
      if (!formUploadedFileName) {
        setFormUploadedFileName(file.name);
      }

      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFormSize(`${sizeMB} MB`);

      setIsUploading(true);
      setUploadProgress(15);

      const progressTimer = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 150);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressTimer);

        if (response.ok) {
          const data = await response.json();
          setUploadedBlobUrl(data.url);
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Server upload failed');
        }
      } catch (error: any) {
        clearInterval(progressTimer);
        console.error('Upload API Error:', error);
        alert(lang === 'fr' 
          ? `Échec du téléversement du fichier (${error.message || 'Erreur réseau'}). Veuillez réessayer.` 
          : `فشل رفع الملف إلى خادم الموقع (${error.message || 'خطأ في الاتصال'}). يرجى المحاولة مجدداً.`);
        setUploadedBlobUrl('');
      } finally {
        setUploadProgress(100);
        setIsUploading(false);
      }
    }
  };

  const handleScreenshotsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsUploadingScreenshots(true);
      setScreenshotsProgress(0);

      const newUrls: string[] = [];
      let completedCount = 0;

      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            newUrls.push(data.url);
          } else {
            newUrls.push(URL.createObjectURL(file));
          }
        } catch (error) {
          console.warn('Screenshot Upload Fallback:', error);
          newUrls.push(URL.createObjectURL(file));
        }

        completedCount++;
        setScreenshotsProgress(Math.round((completedCount / files.length) * 100));
      }

      setFormScreenshots(prev => [...prev, ...newUrls]);
      setIsUploadingScreenshots(false);
    }
  };

  const removeScreenshot = (index: number) => {
    setFormScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();

    const appData: AppItem = {
      id: editingApp ? editingApp.id : `app-rg-${Date.now()}`,
      title: formTitleAr || 'تطبيق RoiGroupes جديد',
      titleFr: formTitleFr || 'Nouvelle App RoiGroupes',
      slug: (formTitleAr || 'rg-app').toLowerCase().replace(/\s+/g, '-'),
      category: formCategory,
      shortDesc: formShortDescAr || 'تطبيق مميز من مجموعة RoiGroupes',
      shortDescFr: formShortDescFr || 'Application certifiée RoiGroupes Holding',
      fullDesc: formFullDescAr || 'تطبيق رسمي معتمد من مجموعة RoiGroupes يوفر حلولاً متكاملة مع إمكانية التحميل المباشر.',
      fullDescFr: formFullDescFr || 'Application officielle certifiée par RoiGroupes Holding offrant des fonctionnalités avancées.',
      icon: 'Briefcase',
      badge: formBadgeAr || (formCategory === 'commercial' ? 'تجاري' : formCategory === 'family' ? 'عائلي' : 'أمني'),
      badgeFr: formBadgeFr || (formCategory === 'commercial' ? 'Commercial' : formCategory === 'family' ? 'Familial' : 'Sécurité'),
      downloadsCount: editingApp ? (editingApp.downloadsCount ?? 0) : 0,
      rating: editingApp ? (editingApp.rating ?? 5.0) : 5.0,
      reviewsCount: editingApp ? (editingApp.reviewsCount ?? 0) : 0,
      size: formSize || '25 MB',
      version: formVersion || '1.0.0',
      updatedDate: new Date().toISOString().split('T')[0],
      developer: formDev || 'RoiGroupes Holding',
      screenshots: formScreenshots.length > 0 
        ? formScreenshots 
        : [`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="#0f172a"/><rect x="20" y="20" width="760" height="460" rx="24" fill="#1e293b" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.3"/><circle cx="400" cy="200" r="60" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="3"/><text x="400" y="210" font-family="sans-serif" font-size="40" font-weight="bold" fill="#f59e0b" text-anchor="middle">RG</text><text x="400" y="320" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${(formTitleAr || 'RoiGroupes App').replace(/["'<>&]/g, '')}</text><text x="400" y="360" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">RoiGroupes Certified Application</text></svg>`)}`],
      features: ['تحميل مباشر وسريع', 'مفحوص وآمن 100%', 'دعم فني معتمد من RG'],
      featuresFr: ['Téléchargement direct', 'Sécurité 100% vérifiée', 'Support certifié RG'],
      downloadLinks: {
        androidUrl: uploadedBlobUrl || 'https://example.com/app.apk',
        iosUrl: 'https://apple.com/app',
        apkSize: formSize || '25 MB'
      },
      uploadedFileName: formUploadedFileName || (uploadedFile ? uploadedFile.name : (editingApp?.uploadedFileName || 'app-package.apk')),
      uploadedFileBlobUrl: uploadedBlobUrl,
      downloadAccess: formDownloadAccess,
      isFeatured: formIsFeatured,
      status: 'published'
    };

    if (editingApp) {
      await updateApp(appData);
    } else {
      await addApp(appData);
    }

    setIsAppModalOpen(false);
  };

  const handleSaveAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser.trim() || !newAdminPass.trim()) return;

    updateAdminCredentials(newAdminUser, newAdminPass);
    setCredentialsSavedNotice(true);
    setTimeout(() => setCredentialsSavedNotice(false), 3000);
  };

  const safeApps = apps || [];
  const safeUsers = users || [];
  const safeReviews = reviews || [];
  const safeAds = ads || [];
  const safeLogs = downloadLogs || [];
  const safeCategories = categories || [];
  const safeRequests = projectRequests || [];

  const totalDownloads = safeApps.reduce((acc, a) => acc + (a?.downloadsCount || 0), 0);
  const totalAdClicks = safeAds.reduce((acc, a) => acc + (a?.clicks || 0), 0);

  const openAddAdModal = () => {
    setEditingAd(null);
    setAdFormTitleAr('');
    setAdFormTitleFr('');
    setAdFormPlacement('header');
    setAdFormImageUrl('');
    setAdFormTargetUrl('');
    setAdFormType('image');
    setAdFormSponsorName('');
    setAdFormSponsorBadge('');
    setIsAdModalOpen(true);
  };

  const openEditAdModal = (ad: any) => {
    setEditingAd(ad);
    setAdFormTitleAr(ad.title);
    setAdFormTitleFr(ad.titleFr);
    setAdFormPlacement(ad.placement);
    setAdFormImageUrl(ad.imageUrl);
    setAdFormTargetUrl(ad.targetUrl);
    setAdFormType(ad.type);
    setAdFormSponsorName(ad.sponsorName || '');
    setAdFormSponsorBadge(ad.sponsorBadge || '');
    setIsAdModalOpen(true);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adFormTitleAr.trim() || !adFormImageUrl.trim()) return;

    const adData: AdBannerItem = {
      id: editingAd ? editingAd.id : `ad-${Date.now()}`,
      title: adFormTitleAr,
      titleFr: adFormTitleFr || adFormTitleAr,
      placement: adFormPlacement,
      imageUrl: adFormImageUrl,
      targetUrl: adFormTargetUrl || '#',
      isActive: editingAd ? editingAd.isActive : true,
      impressions: editingAd ? editingAd.impressions : 0,
      clicks: editingAd ? editingAd.clicks : 0,
      type: adFormType,
      sponsorName: adFormSponsorName,
      sponsorBadge: adFormSponsorBadge
    };

    if (editingAd) {
      updateAd(adData);
    } else {
      addAd(adData);
    }
    setIsAdModalOpen(false);
  };

  const handleAdImageUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingAdImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setAdFormImageUrl(data.url);
      } else {
        const optimized = await processImageFile(file, 800, 0.85);
        setAdFormImageUrl(optimized);
      }
    } catch (err) {
      console.warn('Ad image upload fallback:', err);
      const localUrl = URL.createObjectURL(file);
      setAdFormImageUrl(localUrl);
    } finally {
      setIsUploadingAdImage(false);
    }
  };

  const handleFloatingAdImageUpload = async (index: number, file: File) => {
    const fad = floatingAds[index];
    if (!fad || !file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        await updateFloatingAd({ ...fad, imageUrl: data.url });
      } else {
        const optimized = await processImageFile(file, 800, 0.85);
        await updateFloatingAd({ ...fad, imageUrl: optimized });
      }
    } catch (err) {
      console.warn('Floating ad image upload fallback:', err);
      const localUrl = URL.createObjectURL(file);
      await updateFloatingAd({ ...fad, imageUrl: localUrl });
    }
  };

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: adminProfileName,
      avatar: adminProfileAvatar,
      email: adminProfileEmail
    });
    setCredentialsSavedNotice(true);
    setTimeout(() => setCredentialsSavedNotice(false), 3000);
  };

  const isManager = !!(currentUser && (
    currentUser.role === 'admin' ||
    currentUser.id === 'user-admin' ||
    currentUser.email === 'bahrinho93@gmail.com' ||
    currentUser.email === 'manager@roigroupes.com'
  ));

  const [loginInputUser, setLoginInputUser] = useState('admin');
  const [loginInputPass, setLoginInputPass] = useState('123456');
  const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);

  if (!isManager) {
    return (
      <div className="py-12 px-4 max-w-md mx-auto my-8 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20 font-black text-xl">
            RG
          </div>
          
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
            RoiGroupes<span className="text-amber-500">.com</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-bold">
            {lang === 'fr'
              ? 'Connectez-vous pour accéder au panneau de gestion.'
              : 'تسجيل الدخول المباشر للوحة العمليات وإدارة التطبيقات'}
          </p>

          {loginErrorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginErrorMsg}</span>
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoginErrorMsg(null);
              const res = await loginUser(loginInputUser, loginInputPass);
              if (!res.success) {
                setLoginErrorMsg(res.error || (lang === 'fr' ? 'Identifiants incorrects' : 'بيانات الدخول غير صحيحة'));
              }
            }}
            className="space-y-4 text-xs font-medium text-left rtl:text-right"
          >
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                {lang === 'fr' ? 'Nom d\'utilisateur :' : 'اسم المستخدم :'}
              </label>
              <input
                type="text"
                required
                value={loginInputUser}
                onChange={(e) => setLoginInputUser(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500/20 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                {lang === 'fr' ? 'Mot de passe :' : 'كلمة المرور :'}
              </label>
              <input
                type="password"
                required
                value={loginInputPass}
                onChange={(e) => setLoginInputPass(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500/20 outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition-all cursor-pointer text-sm"
            >
              {lang === 'fr' ? 'Se connecter' : 'دخول واجهة الإدارة الآن'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigateToView('home')}
              className="text-xs text-slate-400 hover:text-amber-500 transition-colors font-bold cursor-pointer"
            >
              ← {lang === 'fr' ? 'Retour à l\'accueil' : 'العودة للواجهة الرئيسية'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-amber-500/20">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-amber-500" />
            <span>{lang === 'fr' ? 'Tableau de Gestion' : 'لوحة تحكم RoiGroupes'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {lang === 'fr'
              ? 'Gérez les applications, les membres et les paramètres de la plateforme'
              : 'إدارة وتحديد وصول الأعضاء والزوار، رفع ملفات التطبيقات، وإدارة بيانات المنصة'}
          </p>
        </div>

        <button
          onClick={() => navigateToView('home')}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-900 dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-colors self-start sm:self-auto cursor-pointer"
        >
          {lang === 'fr' ? 'Quitter la gestion' : 'العودة للواجهة الرئيسية'}
        </button>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-8 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>{t.adminTabOverview}</span>
        </button>

        <button
          onClick={() => setActiveTab('apps')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'apps'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{t.adminTabApps} ({safeApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'members'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.adminTabMembers} ({safeUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'ads'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>{t.adminTabAds}</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'comments'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.adminTabComments} ({safeReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.adminTabSettings}</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Catégories' : 'إدارة الفئات'}</span>
        </button>

        <button
          onClick={() => setActiveTab('project_requests')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'project_requests'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Projets & Messages IA' : 'طلبات البرمجة (المساعد الذكي)'} ({safeRequests.length})</span>
        </button>
      </div>

      {/* --- TAB 1: OVERVIEW & STATISTICS --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">{t.metricTotalDownloads}</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block">
                {formatDownloadCount(totalDownloads, lang)}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 block">
                ↑ +14.2% {lang === 'fr' ? 'ce mois' : 'هذا الشهر'}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">{t.metricActiveApps}</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono block">
                {safeApps.length}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-2 block">
                3 {lang === 'fr' ? 'catégories RoiGroupes' : 'فئات مفعلة بالموقع'}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">{t.metricTotalMembers}</span>
              <span className="text-2xl font-black text-pink-600 dark:text-pink-400 font-mono block">
                {safeUsers.length}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 block">
                Google & Facebook
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-semibold">{t.metricAdRevenue}</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                {totalAdClicks}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-2 block">
                {lang === 'fr' ? 'impressions :' : 'إجمالي الظهور:'} 24.3k
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              {t.downloadsChartTitle}
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <div className="flex justify-between mb-1">
                   <span className="text-emerald-600 dark:text-emerald-400">{t.commercialTitle}</span>
                   <span className="font-mono text-slate-700 dark:text-slate-300">450 (46%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full w-[46%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                   <span className="text-pink-600 dark:text-pink-400">{t.familyTitle}</span>
                   <span className="font-mono text-slate-700 dark:text-slate-300">320 (33%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden">
                   <div className="bg-pink-500 h-full w-[33%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                   <span className="text-amber-600 dark:text-amber-400">{t.securityTitle}</span>
                   <span className="font-mono text-slate-700 dark:text-slate-300">210 (21%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden">
                   <div className="bg-amber-500 h-full w-[21%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-x-auto shadow-md">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              {t.recentActivity}
            </h3>

            <table className="w-full text-xs text-slate-700 dark:text-slate-300 text-left rtl:text-right font-medium">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <th className="p-3">التطبيق</th>
                  <th className="p-3">الوقت والتاريخ</th>
                  <th className="p-3">الجهاز</th>
                  <th className="p-3">الموقع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {safeLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{log.appName}</td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-mono text-amber-600 dark:text-amber-400 font-bold">{log.device}</td>
                    <td className="p-3">{log.ipLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: APPS MANAGEMENT & FILE UPLOAD --- */}
      {activeTab === 'apps' && (
        <div className="space-y-6">
          {/* Selected App Configuration Card (بطاقة حفظ وإعداد التطبيق المختار للواجهة الرئيسية) */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {lang === 'fr' ? 'Configuration de l\'Application Sélectionnée' : 'إعداد وحفظ التطبيق المختار (الواجهة الرئيسية)'}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {lang === 'fr'
                    ? 'Choisissez l\'application officielle affichée en haut de la page d\'accueil pour tous les visiteurs.'
                    : 'اختر التطبيق الرسمي الذي يظهر في أعلى الواجهة الرئيسية لجميع الزوار مع إمكانية حفظ الاختيار بضغطة زر.'}
                </p>
              </div>

              {/* Selector and Save Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <select
                  value={siteSettings?.featuredAppId || (safeApps.find(a => a.isFeatured)?.id || safeApps[0]?.id || '')}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    updateSiteSettings({ featuredAppId: chosenId });
                  }}
                  className="bg-slate-950 border-2 border-amber-500/50 text-amber-300 font-black text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer shadow-md"
                >
                  {safeApps.map((a) => (
                    <option key={a.id} value={a.id}>
                      {lang === 'fr' ? a.titleFr : a.title} ({a.category})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={async () => {
                    const currentId = siteSettings?.featuredAppId || (safeApps.find(a => a.isFeatured)?.id || safeApps[0]?.id || '');
                    if (currentId) {
                      await updateSiteSettings({ featuredAppId: currentId });
                      alert(lang === 'fr' 
                        ? 'L\'application sélectionnée a été enregistrée avec succès pour la page d\'accueil !' 
                        : 'تم حفظ التطبيق المختار بنجاح للواجهة الرئيسية للموقع !');
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Enregistrer L\'Application Sélectionnée' : 'حفظ إعدادات التطبيق المختار'}</span>
                </button>
              </div>
            </div>

            {/* Currently Selected App Preview Bar */}
            {(() => {
              const currentFeatured = safeApps.find(a => a.id === siteSettings?.featuredAppId) || safeApps.find(a => a.isFeatured) || safeApps[0];
              if (!currentFeatured) return null;
              return (
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] border border-amber-500/30">
                      {lang === 'fr' ? 'Actuellement Sélectionné :' : 'التطبيق المعتمد حالياً:'}
                    </span>
                    <strong className="text-white font-extrabold">{lang === 'fr' ? currentFeatured.titleFr : currentFeatured.title}</strong>
                    <span className="text-slate-400 font-mono">({currentFeatured.version || 'v1.0'})</span>
                  </div>

                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'fr' ? 'Affiché sur la page d\'accueil' : 'نشط ومعروض بالصفحة الرئيسية'}</span>
                  </span>
                </div>
              );
            })()}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Gestion & Téléversement des Applications' : 'إدارة ورفع ملفات التطبيقات بالموقع'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {lang === 'fr' ? 'Définissez la permission de téléchargement (Public ou Membres)' : 'حدد ما إذا كان التطبيق متاحاً للزوار أو حبر الأعضاء المسجلين فقط.'}
              </p>
            </div>

            <button
              onClick={openAddAppModal}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{lang === 'fr' ? '+ Téléverser une Application' : '+ رفع تطبيق جديد'}</span>
            </button>
          </div>

          {/* Apps Table */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xl">
            <table className="w-full text-xs text-slate-700 dark:text-slate-300 text-left rtl:text-right font-medium">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <th className="p-3.5">اسم التطبيق</th>
                  <th className="p-3.5">الفئة</th>
                  <th className="p-3.5">إمكانية التحميل</th>
                  <th className="p-3.5">التحميلات</th>
                  <th className="p-3.5">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {safeApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-amber-500 shrink-0" />
                        <div>
                          <span>{lang === 'fr' ? app.titleFr : app.title}</span>
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">
                            {app.uploadedFileName || 'apk-package.apk'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 capitalize font-mono text-amber-600 dark:text-amber-300 font-bold">{app.category}</td>
                    <td className="p-3.5">
                      {app.downloadAccess === 'members_only' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                          <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          {lang === 'fr' ? 'Réservé aux membres' : 'حصري للأعضاء'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          <Globe className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {lang === 'fr' ? 'Public (Tous)' : 'متاح للجميع'}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatDownloadCount(app.downloadsCount, lang)}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            await updateSiteSettings({ featuredAppId: app.id });
                            alert(lang === 'fr'
                              ? `"${app.titleFr || app.title}" est maintenant sélectionnée comme application principale !`
                              : `تم اختيار "${app.title}" كتطبيق رئيسي للموقع بنجاح!`);
                          }}
                          title={siteSettings?.featuredAppId === app.id ? "التطبيق المختار حالياً" : "تعيين كتطبيق مختار للواجهة"}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-extrabold ${
                            siteSettings?.featuredAppId === app.id
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md ring-2 ring-amber-500/50'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${siteSettings?.featuredAppId === app.id ? 'fill-slate-950' : ''}`} />
                          <span className="hidden sm:inline">
                            {siteSettings?.featuredAppId === app.id
                              ? (lang === 'fr' ? 'Sélectionnée' : 'التطبيق المختار')
                              : (lang === 'fr' ? 'Sélectionner' : 'اختيار')}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            if (app.pinnedExpiry && app.pinnedExpiry > Date.now()) {
                              unpinApp(app.id);
                            } else {
                              pinApp(app.id, 1440); // Default 24h
                            }
                          }}
                          title={app.pinnedExpiry && app.pinnedExpiry > Date.now() ? "إلغاء التثبيت" : "تثبيت في الصدارة (24 ساعة)"}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            app.pinnedExpiry && app.pinnedExpiry > Date.now()
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-600'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openFeaturedConfigModal(app)}
                          title="تخصيص نافذة العرض المثبتة"
                          className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-500 hover:text-white text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditAppModal(app)}
                          title="تعديل التطبيق والوصول"
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteApp(app.id)}
                          title="حذف التطبيق"
                          className="p-1.5 bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* App Upload & Add/Edit Modal */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingApp ? t.editApp : (lang === 'fr' ? 'Téléverser & Publier une Application' : 'رفع ونشر تطبيق جديد بالموقع')}
                </h3>
              </div>
              <button
                onClick={() => setIsAppModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApp} className="space-y-4 text-xs font-medium">
              {/* FILE UPLOAD DROPZONE */}
              <div className="bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-amber-500/40 rounded-2xl p-5 text-center transition-all hover:border-amber-400">
                <input
                  type="file"
                  id="apkFileInput"
                  accept=".apk,.xapk,.zip,.ipa"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label htmlFor="apkFileInput" className="cursor-pointer block">
                  <UploadCloud className="w-10 h-10 text-amber-500 mx-auto mb-2 animate-bounce" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
                    {uploadedFile
                      ? `${lang === 'fr' ? 'Fichier sélectionné :' : 'تم اختيار الملف:'} ${uploadedFile.name}`
                      : (lang === 'fr' ? 'Cliquez ou glissez le fichier APK ici' : 'انقر هنا لاختيار ملف التطبيق (APK) من جهازك')}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                    .APK, .XAPK, .ZIP (الحد الأقصى: 500 MB)
                  </span>
                </label>

                {isUploading && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] text-amber-600 dark:text-amber-300 font-mono font-bold">
                      <span>جاري رفع الملف للسيرفر...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadedBlobUrl && !isUploading && (
                  <div className="mt-3 p-2 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم رفع الملف وتوليد رابط التحميل المباشر!</span>
                  </div>
                )}
              </div>

              {/* RENAME FILE INPUT */}
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-2">
                  {lang === 'fr' ? 'Nom du fichier pour le téléchargement :' : 'اسم الملف عند التحميل (إعادة تسمية):'}
                </label>
                <div className="relative">
                  <FileCode className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                  <input
                    type="text"
                    value={formUploadedFileName}
                    onChange={(e) => setFormUploadedFileName(e.target.value)}
                    placeholder="Ex: MyCoolApp-v1.apk"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-hidden"
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {lang === 'fr' 
                    ? 'Ce nom sera utilisé comme nom de fichier lors du téléchargement par l\'utilisateur.'
                    : 'هذا الاسم هو الذي سيظهر للمستخدم عند حفظ الملف على جهازه.'}
                </p>
              </div>

              {/* MEMBER VS PUBLIC ACCESS PERMISSION */}
              <div className="bg-amber-50 dark:bg-slate-950/80 p-3.5 border border-amber-500/30 rounded-2xl">
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-2">
                  {lang === 'fr' ? 'Permission d\'accès au téléchargement :' : 'صلاحية تنزيل التطبيق للمستخدمين:'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    formDownloadAccess === 'public'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="downloadAccess"
                      value="public"
                      checked={formDownloadAccess === 'public'}
                      onChange={() => setFormDownloadAccess('public')}
                      className="text-emerald-600 focus:ring-0"
                    />
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{lang === 'fr' ? 'Public (Tous les visiteurs)' : '🌐 متاح للجميع (الزوار والأعضاء)'}</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    formDownloadAccess === 'members_only'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-300 font-bold'
                      : 'border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="downloadAccess"
                      value="members_only"
                      checked={formDownloadAccess === 'members_only'}
                      onChange={() => setFormDownloadAccess('members_only')}
                      className="text-amber-500 focus:ring-0"
                    />
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{lang === 'fr' ? 'Réservé aux membres' : '🔒 حصري للأعضاء (يتطلب التسجيل)'}</span>
                  </label>
                </div>
              </div>

              {/* Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 dark:text-slate-400 block mb-1 font-bold">{t.appTitleAr}</label>
                  <input
                    type="text"
                    required
                    value={formTitleAr}
                    onChange={(e) => setFormTitleAr(e.target.value)}
                    placeholder="مثال: تطبيق سجل المحاسبة RG"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-400 block mb-1 font-bold">{t.appTitleFr}</label>
                  <input
                    type="text"
                    required
                    value={formTitleFr}
                    onChange={(e) => setFormTitleFr(e.target.value)}
                    placeholder="Ex: Application RG Cashier"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* SCREENSHOTS UPLOAD & URL SECTION */}
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-2">
                  {lang === 'fr' ? 'Captures d\'écran de l\'application (Fichiers ou URLs) :' : 'صور لوصف وتوضيح التطبيق (رفع صور أو إضافة روابط direct):'}
                </label>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {formScreenshots.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-sm">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeScreenshot(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-amber-500 text-slate-950 text-[8px] font-black py-0.5 text-center">
                          {lang === 'fr' ? 'Icône' : 'الأيقونة'}
                        </div>
                      )}
                    </div>
                  ))}

                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-colors bg-white dark:bg-slate-900">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleScreenshotsChange}
                      className="hidden"
                    />
                    <Camera className="w-5 h-5 text-amber-500 mb-1" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase">{lang === 'fr' ? '+ Fichier' : '+ رفع صورة'}</span>
                  </label>
                </div>

                {/* PASTE DIRECT IMAGE URL */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="url"
                      value={screenshotUrlInput}
                      onChange={(e) => setScreenshotUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddScreenshotUrl();
                        }
                      }}
                      placeholder={lang === 'fr' ? 'Ou collez un رابط d\'image (https://...)' : 'أو الصق رابط صورة مباشرة (https://...)'}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl py-2 ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 outline-hidden font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddScreenshotUrl}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shrink-0 cursor-pointer transition-colors shadow-xs"
                  >
                    {lang === 'fr' ? '+ Ajouter URL' : '+ إضافة الرابط'}
                  </button>
                </div>

                {isUploadingScreenshots && (
                  <div className="mb-2 space-y-1">
                    <div className="flex justify-between text-[10px] text-amber-600 dark:text-amber-300 font-bold">
                      <span>{lang === 'fr' ? 'Téléversement des images...' : 'جاري رفع الصور...'}</span>
                      <span>{screenshotsProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all duration-200"
                        style={{ width: `${screenshotsProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {lang === 'fr' 
                    ? 'Vous pouvez ajouter plusieurs images d\'aperçu ou captures d\'écran pour décrire l\'application.'
                    : 'يمكنك إضافة عدة صور واجهة للتطبيق لتعريف الزوار بالمحتوى وشاشة الاستخدام.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-700 dark:text-slate-400 block mb-1 font-bold">{t.appCategory}</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white capitalize cursor-pointer font-bold"
                  >
                    <option value="commercial">💼 {t.commercialTitle}</option>
                    <option value="family">👨‍👩‍👧‍👦 {t.familyTitle}</option>
                    <option value="security">🛡️ {t.securityTitle}</option>
                    {categories.filter(c => !['commercial', 'family', 'security'].includes(c.id)).map(c => (
                      <option key={c.id} value={c.id}>📁 {lang === 'fr' ? c.nameFr : c.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-400 block mb-1 font-bold">{t.appSize}</label>
                  <input
                    type="text"
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-400 block mb-1 font-bold">{t.appVersion}</label>
                  <input
                    type="text"
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-400 block mb-1 font-bold">{t.appShortDescAr}</label>
                <input
                  type="text"
                  value={formShortDescAr}
                  onChange={(e) => setFormShortDescAr(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  {t.closeBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-xl shadow-md cursor-pointer"
                >
                  {lang === 'fr' ? 'Publier l\'application' : 'حفظ ونشر التطبيق فوراً'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB 3: MEMBERS LIST (قائمة الأعضاء المسجلين الفعلية) --- */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {t.membersListTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {lang === 'fr'
                  ? 'Liste en temps réel des membres inscrits via Google, Facebook ou Inscription directe.'
                  : 'تأطير ومتابعة جميع الأعضاء المسجلين بالموقع عبر حسابات Google و Facebook.'}
              </p>
            </div>

            <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-extrabold text-amber-900 dark:text-amber-300">
              إجمالي الأعضاء: {users.length}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-md">
            <table className="w-full text-xs text-slate-700 dark:text-slate-300 text-left rtl:text-right font-medium">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <th className="p-3.5">{t.memberName}</th>
                  <th className="p-3.5">{t.memberEmail}</th>
                  <th className="p-3.5">{t.memberProvider}</th>
                  <th className="p-3.5">{t.memberRole}</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5">{t.memberStatus}</th>
                  <th className="p-3.5">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img
                        src={usr.avatar}
                        alt={usr.name}
                        className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
                      />
                      <span>{usr.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400">{usr.email}</td>
                    <td className="p-3.5 font-mono capitalize text-amber-600 dark:text-amber-300 font-bold">{usr.provider}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        usr.role === 'admin' ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 dark:text-slate-400 font-bold">{usr.ipAddress || '0.0.0.0'}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        usr.status === 'active' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-800 dark:text-rose-300'
                      }`}>
                        {usr.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingMember(usr);
                            setMemberFormName(usr.name);
                            setMemberFormAvatar(usr.avatar);
                            setMemberFormPhone(usr.phone || '');
                            setMemberFormRole(usr.role);
                            setMemberFormStatus(usr.status);
                            setIsMemberModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title={lang === 'fr' ? 'Modifier le membre' : 'تعديل بيانات العضو'}
                        >
                          <Edit className="w-3 h-3" />
                          <span>{lang === 'fr' ? 'Modifier' : 'تعديل'}</span>
                        </button>

                        {usr.status === 'active' ? (
                          <button
                            onClick={() => updateUserStatus(usr.id, 'suspended')}
                            className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-300 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            {t.actionSuspend}
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(usr.id, 'active')}
                            className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            {t.actionActivate}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: AD MANAGEMENT --- */}
      {activeTab === 'ads' && (
        <div className="space-y-8">
          {/* FLOATING AD BANNERS MANAGEMENT SECTION (البنرات العائمة الثلاثة) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>{lang === 'fr' ? 'Gestion des 3 Bannières Flottantes' : 'إدارة النوافذ الإعلانية العائمة الثلاثة (3 Floating Popup Banners)'}</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {lang === 'fr' 
                    ? 'Contrôlez les 3 fenêtres publicitaires qui s\'affichent en séquence au-dessus du site avec bouton de fermeture (X).'
                    : 'التحكم الكامل في الإعلانات العائمة المتقدمة التي تظهر على سطح الموقع بالترتيب وتُغلق زر (X) في أعلى كل نافذة.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsFloatingAdsOpen(true);
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Eye className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Aperçu Direct des Bannières' : 'معاينة النوافذ العائمة الآن'}</span>
              </button>
            </div>

            {/* List of 3 Floating Ads */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {floatingAds.map((fad, index) => (
                <div key={fad.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 relative group hover:border-amber-500/40 transition-all shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-[10px] rounded-full uppercase font-mono">
                      #{index + 1} - {fad.id}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateFloatingAd({ ...fad, isActive: !fad.isActive })}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold border cursor-pointer ${
                        fad.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {fad.isActive ? (lang === 'fr' ? 'Actif' : 'مفعل') : (lang === 'fr' ? 'Désactivé' : 'معطل')}
                    </button>
                  </div>

                  {/* Image Preview */}
                  <div className="aspect-video w-full bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800">
                    <img src={fad.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] text-amber-300 font-bold truncate">{fad.badgeAr || `إعلان ${index + 1}`}</span>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">العنوان بالعربية</label>
                      <input
                        type="text"
                        value={fad.titleAr}
                        onChange={(e) => updateFloatingAd({ ...fad, titleAr: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Titre (Français)</label>
                      <input
                        type="text"
                        value={fad.titleFr}
                        onChange={(e) => updateFloatingAd({ ...fad, titleFr: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">الوصف الفرعي (عربي)</label>
                      <textarea
                        rows={2}
                        value={fad.subtitleAr}
                        onChange={(e) => updateFloatingAd({ ...fad, subtitleAr: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 font-medium focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">
                        {lang === 'fr' ? 'Image de la bannière :' : 'صورة البنر الإعلاني (ارف صورة من جهازك):'}
                      </label>

                      <label className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500/15 to-amber-500/25 hover:from-amber-500/25 hover:to-amber-500/35 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs mb-2">
                        <UploadCloud className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'fr' ? 'ارف صورة من جهازك' : 'ارف صورة الإعلان من جهازك'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFloatingAdImageUpload(index, e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        value={fad.imageUrl}
                        onChange={(e) => updateFloatingAd({ ...fad, imageUrl: e.target.value })}
                        placeholder={lang === 'fr' ? 'Ou collez un URL d\'image...' : 'أو الصق رابط الصورة (https://...)'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-amber-300 font-mono text-[10px] focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">نص زر التوجيه (Button Label)</label>
                      <input
                        type="text"
                        value={fad.buttonTextAr}
                        onChange={(e) => updateFloatingAd({ ...fad, buttonTextAr: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">ربط بتطبيق أو رابط خارجي</label>
                      <select
                        value={fad.appId || ''}
                        onChange={(e) => updateFloatingAd({ ...fad, appId: e.target.value || undefined })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold cursor-pointer"
                      >
                        <option value="">-- اختيار تطبيق مرتبِط (اختياري) --</option>
                        {apps.map(app => (
                          <option key={app.id} value={app.id}>{app.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {t.adsTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {lang === 'fr' ? 'Gérez vos bannières publicitaires et campagnes.' : 'إدارة بنرات الإعلانات والطلبات الترويجية الثابتة بالموقع.'}
              </p>
            </div>

            <button
              onClick={openAddAdModal}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Ajouter une publicité' : 'إضافة إعلان جديد'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md group relative">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 block w-max mb-1 font-bold">
                      {ad.placement}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'fr' ? ad.titleFr : ad.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditAdModal(ad)}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 rounded-lg cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAd(ad.id)}
                      className="p-1.5 bg-rose-100 dark:bg-rose-950/40 hover:bg-rose-200 text-rose-600 dark:text-rose-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleAdStatus(ad.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border cursor-pointer ${
                        ad.isActive
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {ad.isActive ? 'مفعل' : 'معطل'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 font-mono">
                  <span>{t.adImpressions}: <strong>{ad.impressions}</strong></span>
                  <span>{t.adClicks}: <strong className="text-amber-600 dark:text-amber-400">{ad.clicks}</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-500" />
              <span>{t.adSenseTitle}</span>
            </h3>

            <textarea
              rows={4}
              value={adSenseInput}
              onChange={(e) => setAdSenseInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300 font-mono focus:outline-hidden focus:border-amber-400 mb-3"
            />

            <button
              onClick={() => updateAdSenseCode(adSenseInput)}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveAdSense}</span>
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 5: COMMENTS MODERATION --- */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Modération des Commentaires' : 'الرقابة وإدارة التعليقات'}
          </h2>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-md">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {rev.userName} ({rev.authProvider})
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-300 text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    حذف (Delete)
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 my-2 font-medium">{rev.comment}</p>

                {replyingReviewId === rev.id ? (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="اكتب رد المطور..."
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        replyToReview(rev.id, replyText);
                        setReplyingReviewId(null);
                        setReplyText('');
                      }}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
                    >
                      حفظ الرد
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setReplyingReviewId(rev.id);
                      setReplyText(rev.developerReply || '');
                    }}
                    className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline mt-1 cursor-pointer font-bold"
                  >
                    + إدراج رد رسمى من مطوري RoiGroupes
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 6: SITE SETTINGS & EDIT ADMIN CREDENTIALS --- */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          <div className="space-y-6">
            {/* UPDATE ADMIN PROFILE BOX */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-amber-500/30 p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 ltr:right-0 rtl:left-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <UserCheck className="w-20 h-20 text-amber-500" />
              </div>
              
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-500" />
                <span>{lang === 'fr' ? 'Modifier le Profil Admin' : 'تعديل بروفيل المدير (Admin Profile)'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
                {lang === 'fr'
                  ? 'Modifiez votre nom d\'affichage, votre photo de profil et votre e-mail.'
                  : 'تعديل بيانات المدير العام للموقع لتظهر بشكل احترافي للزوار.'}
              </p>

              <form onSubmit={handleSaveAdminProfile} className="space-y-5 text-xs font-medium">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">الاسم المستعار:</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-amber-500 absolute ltr:left-3.5 rtl:right-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={adminProfileName}
                      onChange={(e) => setAdminProfileName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-2 font-bold">
                    {lang === 'fr' ? 'Photo de profil (depuis votre appareil) :' : 'الصورة الشخصية (رفع مباشر من جهازك) :'}
                  </label>
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500/40 shrink-0 bg-slate-200 dark:bg-slate-800">
                      <img
                        src={adminProfileAvatar || 'https://ui-avatars.com/api/?name=Manager&background=f59e0b&color=0f172a'}
                        alt={adminProfileName}
                        className="w-full h-full object-cover"
                      />
                      {isProcessingAdminImg && (
                        <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <input
                        ref={adminFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAdminAvatarUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => adminFileInputRef.current?.click()}
                        disabled={isProcessingAdminImg}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{lang === 'fr' ? 'Choisir une photo du PC / Téléphone' : 'اختر صورة من جهازك'}</span>
                      </button>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {lang === 'fr' ? 'Aucun lien requis, import direct.' : 'رفع فوري من الهاتف أو الكمبيوتر بدون روابط خارجية'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
                >
                  <Save className="w-5 h-5" />
                  <span>{lang === 'fr' ? 'Mettre à jour le profil' : 'حفظ وتحديث بيانات البروفيل'}</span>
                </button>
              </form>
            </div>

            {/* WHATSAPP SETTINGS BOX */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 ltr:right-0 rtl:left-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Smartphone className="w-20 h-20 text-emerald-500" />
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-emerald-500" />
                <span>{lang === 'fr' ? 'WhatsApp & Support' : 'إعدادات الواتساب والتواصل المباشر'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
                {lang === 'fr' ? 'Ce numéro sera utilisé pour le bouton flottant.' : 'سيتم استخدام هذا الرقم في زر الواتساب العائم للتواصل الفوري مع الزبائن.'}
              </p>

              <div className="space-y-5">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">
                    {lang === 'fr' ? 'Numéro WhatsApp :' : 'رقم الواتساب الرسمي (WhatsApp):'}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-emerald-500 absolute ltr:left-3.5 rtl:right-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={whatsappInput}
                      onChange={(e) => setWhatsappInput(e.target.value)}
                      placeholder="+213..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    updateSiteSettings({ whatsappNumber: whatsappInput });
                    setCredentialsSavedNotice(true);
                    setTimeout(() => setCredentialsSavedNotice(false), 3000);
                  }}
                  className="w-full px-6 py-4 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-black text-sm rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 group"
                >
                  <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>{lang === 'fr' ? 'Sauvegarder le numéro WhatsApp' : 'حفظ وتثبيت رقم الواتساب المعتمد'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* UPDATE ADMIN CREDENTIALS BOX */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 ltr:right-0 rtl:left-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Key className="w-20 h-20 text-slate-400" />
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <span>{lang === 'fr' ? 'Modifier les Identifiants' : 'تعديل بيانات الدخول (Credentials)'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
                {lang === 'fr'
                  ? 'Modifiez votre nom d\'utilisateur et mot de passe d\'administration.'
                  : 'تعديل اسم المستخدم وكلمة المرور الافتراضية للوحة التحكم لضمان أمن الموقع.'}
              </p>

              {credentialsSavedNotice && (
                <div className="mb-6 p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center animate-fade-in">
                  ✓ تم تحديث البيانات بنجاح!
                </div>
              )}

              <form onSubmit={handleSaveAdminCredentials} className="space-y-5 text-xs font-medium">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">
                    {lang === 'fr' ? 'Nom d\'utilisateur Admin :' : 'اسم المستخدم (Username):'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-amber-500 absolute ltr:left-3.5 rtl:right-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={newAdminUser}
                      onChange={(e) => setNewAdminUser(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">
                    {lang === 'fr' ? 'Nouveau mot de passe :' : 'كلمة المرور الجديدة (Password):'}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-amber-500 absolute ltr:left-3.5 rtl:right-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl py-3 ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-black text-sm rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 group border border-amber-500/30"
                >
                  <Key className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>{lang === 'fr' ? 'Enregistrer les identifiants' : 'حفظ بيانات الدخول الآمنة'}</span>
                </button>
              </form>
            </div>

            {/* FEATURED HERO APP SELECTION BOX */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border-2 border-amber-500/30 p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shadow-md font-bold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {lang === 'fr' ? 'Application En Vedette (Haut de Page)' : 'تحديد التطبيق المختار المعروض أعلى الصفحة الرئيسية'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {lang === 'fr' 
                      ? 'Choisissez l\'application officielle qui sera mise en avant dans le bloc Hero en haut du site.' 
                      : 'اختر التطبيق المخصص الذي يظهر بمواصفاته وصوره في كارت العرض العلوي بالصفحة الرئيسية.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {lang === 'fr' ? 'Sélectionner l\'application :' : 'اختر التطبيق المختار حالياً:'}
                </label>
                <select
                  value={siteSettings.featuredAppId || (safeApps[0]?.id || '')}
                  onChange={async (e) => {
                    await updateSiteSettings({ featuredAppId: e.target.value });
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-amber-500/40 rounded-xl p-3 text-slate-900 dark:text-amber-300 font-black text-sm outline-none cursor-pointer hover:border-amber-500 transition-colors shadow-sm"
                >
                  {safeApps.map(a => (
                    <option key={a.id} value={a.id} className="bg-slate-900 text-white font-bold">
                      {a.title} ({a.category === 'commercial' ? 'تجاري' : a.category === 'family' ? 'عائلي' : 'أمني'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs font-medium shadow-md">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">إعدادات تقنية عامة</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-500 block mb-1">اسم الموقع</label>
                  <input
                    type="text"
                    readOnly
                    value="RoiGroupes.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">البريد الرسمي</label>
                  <input
                    type="text"
                    readOnly
                    value={siteSettings.contactEmail}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-slate-300 font-mono"
                  />
                </div>
              </div>

              {/* DANGER ZONE / RESTORE BUTTON */}
              <div className="mt-6 pt-6 border-t border-rose-500/20">
                <h4 className="text-rose-600 dark:text-rose-400 font-black mb-2 uppercase tracking-widest text-[10px]">منطقة التحكم المتقدمة</h4>
                <p className="text-slate-500 mb-4">في حال فقدان البيانات أو رغبتك في استعادة الإعدادات الافتراضية للتطبيقات والفئات، يمكنك استخدام هذا الزر.</p>
                
                <button
                  onClick={async () => {
                    if (window.confirm(lang === 'fr' ? 'Êtes-vous sûr de vouloir restaurer les données initiales ?' : 'هل أنت متأكد من رغبتك في استعادة البيانات الافتراضية؟')) {
                      await restoreData();
                    }
                  }}
                  className="w-full px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'fr' ? 'Restaurer les données d\'origine' : 'استعادة كافة تطبيقات وبيانات الموقع'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 7: CATEGORY MANAGEMENT --- */}
      {activeTab === 'categories' && (
        <div className="space-y-6 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-amber-500" />
                <span>{lang === 'fr' ? 'Gestion des Catégories' : 'إدارة وتصنيف فئات التطبيقات'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {lang === 'fr' ? 'Ajoutez, modifiez ou supprimez des catégories d\'applications.' : 'تحكم في الفئات التي تظهر في الواجهة الرئيسية والقوائم المنسدلة.'}
              </p>
            </div>

            <button
              onClick={() => {
                setEditingCategory(null);
                setCatNameAr('');
                setCatNameFr('');
                setIsCategoryModalOpen(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>{lang === 'fr' ? 'Ajouter une catégorie' : 'إضافة فئة جديدة'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl transition-all">
            <table className="w-full text-sm text-slate-700 dark:text-slate-300 text-left rtl:text-right font-medium">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-black">
                <tr>
                  <th className="p-5">الفئة (بالعربية)</th>
                  <th className="p-5">Catégorie (Français)</th>
                  <th className="p-5">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/10 transition-colors group">
                    <td className="p-5 font-extrabold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform shadow-sm">
                          <Layers className="w-5 h-5" />
                        </div>
                        <span className="text-base">{cat.nameAr}</span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-700 dark:text-slate-300 text-base">{cat.nameFr}</td>
                    <td className="p-5 text-right rtl:text-right ltr:text-left">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setCatNameAr(cat.nameAr);
                            setCatNameFr(cat.nameFr);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-600 dark:text-slate-400 rounded-xl transition-all cursor-pointer shadow-sm"
                          title="تعديل الفئة"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {!['commercial', 'family', 'security'].includes(cat.id) && (
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="p-2.5 bg-rose-100 dark:bg-rose-950/40 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-xl transition-all cursor-pointer shadow-sm"
                            title="حذف الفئة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 8: PROJECT REQUESTS & AI CONSULTATION MESSAGES --- */}
      {activeTab === 'project_requests' && (
        <div className="space-y-6 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-6 h-6 text-amber-500" />
                <span>{lang === 'fr' ? 'Demandes de Développement (Messages IA)' : 'طلبات البرمجة وتطوير المشاريع (رسائل المساعد الذكي)'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {lang === 'fr'
                  ? 'Consultez les demandes de projets analysées par l\'IA avec les coordonnées et l\'adresse IP des membres.'
                  : 'استعراض أفكار ودراسات المشاريع التي أرسلها العملاء عبر المساعد الذكي مع بياناتهم الكاملة و IP الخاص بهم.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                {projectRequests?.length || 0} {lang === 'fr' ? 'demandes enregistrées' : 'طلبات مشاريع'}
              </span>
            </div>
          </div>

          {(!projectRequests || projectRequests.length === 0) ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <Bot className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Aucune demande de projet pour le moment' : 'لا توجد طلبات مشاريع حتى الآن'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {lang === 'fr'
                  ? 'Les demandes envoyées par les membres via l\'assistant IA apparaîtront ici.'
                  : 'ستظهر هنا جميع رسائل ودراسات المشاريع المرسلة من الزوار والأعضاء عبر مساعد الذكاء الاصطناعي.'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {projectRequests.map((req: ProjectRequestItem) => {
                const statusStyles: Record<string, string> = {
                  pending: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 border-amber-400/40',
                  contacted: 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-300 border-blue-400/40',
                  in_development: 'bg-purple-100 text-purple-900 dark:bg-purple-500/20 dark:text-purple-300 border-purple-400/40',
                  completed: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-400/40'
                };

                const statusLabels = {
                  pending: lang === 'fr' ? 'En attente' : 'قيد المراجعة',
                  contacted: lang === 'fr' ? 'Contacté' : 'تم التواصل والتنسيق',
                  in_development: lang === 'fr' ? 'En cours de dev' : 'في مرحلة التطوير',
                  completed: lang === 'fr' ? 'Conclu & Terminé' : 'مكتمل وتـم الاتفاق'
                };

                const typeLabels: Record<string, string> = {
                  mobile_app: lang === 'fr' ? 'App Mobile (iOS / Android)' : 'تطبيق هاتف ذكي',
                  website: lang === 'fr' ? 'Site Web / Cloud' : 'موقع ويب / منصة سحابية',
                  ecommerce: lang === 'fr' ? 'E-Commerce' : 'متجر إلكتروني',
                  erp_pos: lang === 'fr' ? 'Logiciel ERP / POS' : 'نظام إدارة ومبيعات POS',
                  custom: lang === 'fr' ? 'Sur-mesure' : 'مشروع مخصص'
                };

                return (
                  <div
                    key={req.id}
                    className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl transition-all hover:border-amber-500/30"
                  >
                    {/* Header: Project Title, ID, Date, and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                            #{req.id}
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {typeLabels[req.projectType] || req.projectType}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {req.createdAt}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {req.projectTitle}
                        </h3>
                      </div>

                      {/* Interactive Status Selector */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={req.status}
                          onChange={(e) => updateProjectRequestStatus(req.id, e.target.value as any)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-hidden ${statusStyles[req.status] || ''}`}
                        >
                          <option value="pending">{statusLabels.pending}</option>
                          <option value="contacted">{statusLabels.contacted}</option>
                          <option value="in_development">{statusLabels.in_development}</option>
                          <option value="completed">{statusLabels.completed}</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(lang === 'fr' ? 'Supprimer cette demande ?' : 'هل أنت متأكد من حذف هذا الطلب؟')) {
                              deleteProjectRequest(req.id);
                            }
                          }}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20 transition-all cursor-pointer"
                          title="حذف الطلب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Member & Client Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                          {lang === 'fr' ? 'Nom du client / Membre' : 'اسم العميل / العضو'}
                        </span>
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                          <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{req.userName}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                          {lang === 'fr' ? 'E-mail' : 'البريد الإلكتروني'}
                        </span>
                        <a
                          href={`mailto:${req.userEmail}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-amber-500 transition-colors flex items-center gap-1.5 truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{req.userEmail}</span>
                        </a>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                          {lang === 'fr' ? 'Téléphone / WhatsApp' : 'رقم الهاتف / الواتساب'}
                        </span>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{req.userPhone || (lang === 'fr' ? 'Non spécifié' : 'غير محدد')}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                          {lang === 'fr' ? 'Adresse IP du client' : 'عنوان IP الخاص بالعضو'}
                        </span>
                        <div className="font-mono font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{req.ipAddress || '127.0.0.1'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Client Original Idea & AI Briefing */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-black text-slate-900 dark:text-white block mb-1">
                          {lang === 'fr' ? 'Idée originale exprimée par le client :' : 'فكرة واحتياجات المشروع كما طلبها العميل :'}
                        </span>
                        <p className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                          {req.userIdea}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {req.suggestedTech && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <span className="font-extrabold text-amber-900 dark:text-amber-300 block mb-1 flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              {lang === 'fr' ? 'Technologies conseillées :' : 'التقنيات المقترحة للتنفيذ :'}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-slate-200">
                              {req.suggestedTech}
                            </span>
                          </div>
                        )}

                        {req.estimatedTimeline && (
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                            <span className="font-extrabold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              {lang === 'fr' ? 'Délai estimé :' : 'المدة المقدرة للتنفيذ :'}
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {req.estimatedTimeline}
                            </span>
                          </div>
                        )}
                      </div>

                      {req.aiSummary && (
                        <div>
                          <span className="font-black text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
                            <Bot className="w-3.5 h-3.5 text-amber-500" />
                            {lang === 'fr' ? 'Rapport et étude de faisabilité IA :' : 'دراسة الجدوى الفنية من المساعد الذكي :'}
                          </span>
                          <p className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/30 text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                            {req.aiSummary}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Direct Contact Actions for Admin */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500">
                        {lang === 'fr' ? 'Action rapide de contact :' : 'إجراءات التواصل السريع مع العميل :'}
                      </div>

                      <div className="flex items-center gap-2">
                        {req.userPhone && (
                          <a
                            href={`https://wa.me/${req.userPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `مرحباً بك أستاذ ${req.userName}، نتواصل معك من إدارة مجموعة RoiGroupes بخصوص طلبك لتطوير مشروع (${req.projectTitle}). يسعدنا التنسيق والبدء في التنفيذ.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{lang === 'fr' ? 'Contacter sur WhatsApp' : 'تواصل عبر واتساب'}</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${req.userEmail}?subject=${encodeURIComponent(
                            `RoiGroupes Holding - بخصوص مشروعك: ${req.projectTitle}`
                          )}&body=${encodeURIComponent(
                            `مرحباً بك أستاذ ${req.userName}،\n\nتلقينا طلبك ودراسة المساعد الذكي لمشروع: ${req.projectTitle}.\n\nيسعدنا تحديد موعد لمناقشة التفاصيل وبدء البرمجة.\n\nتحيات إدارة RoiGroupes Holding.`
                          )}`}
                          className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{lang === 'fr' ? 'Envoyer un Email' : 'مراسلة عبر البريد'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl transition-colors">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {editingCategory ? (lang === 'fr' ? 'Modifier la catégorie' : 'تعديل الفئة') : (lang === 'fr' ? 'Ajouter une catégorie' : 'إضافة فئة جديدة')}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">الاسم بالعربية</label>
                <input
                  type="text"
                  value={catNameAr}
                  onChange={(e) => setCatNameAr(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">Nom en Français</label>
                <input
                  type="text"
                  value={catNameFr}
                  onChange={(e) => setCatNameFr(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  {t.closeBtn}
                </button>
                <button
                  onClick={() => {
                    if (editingCategory) {
                      updateCategory({ ...editingCategory, nameAr: catNameAr, nameFr: catNameFr });
                    } else {
                      addCategory({
                        id: `cat-${Date.now()}`,
                        nameAr: catNameAr,
                        nameFr: catNameFr,
                        icon: 'Briefcase',
                        color: 'amber'
                      });
                    }
                    setIsCategoryModalOpen(false);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-xl shadow-md cursor-pointer"
                >
                  {lang === 'fr' ? 'Enregistrer' : 'حفظ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ad Modal */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl transition-colors">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {editingAd ? (lang === 'fr' ? 'Modifier la publicité' : 'تعديل الإعلان') : (lang === 'fr' ? 'Ajouter une publicité' : 'إضافة إعلان جديد')}
              </h3>
              <button
                onClick={() => setIsAdModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">العنوان (عربي)</label>
                  <input
                    type="text"
                    required
                    value={adFormTitleAr}
                    onChange={(e) => setAdFormTitleAr(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">Titre (Français)</label>
                  <input
                    type="text"
                    required
                    value={adFormTitleFr}
                    onChange={(e) => setAdFormTitleFr(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">موقع الإعلان (Placement)</label>
                <select
                  value={adFormPlacement}
                  onChange={(e) => setAdFormPlacement(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white cursor-pointer font-bold"
                >
                  <option value="floating">✨ نافذة عائمة (Floating Banner Popup)</option>
                  <option value="header"> Header (في رأس الموقع)</option>
                  <option value="sidebar"> Sidebar (الجانبي)</option>
                  <option value="in_feed"> In-Feed (وسط محتوى القائمة)</option>
                  <option value="detail"> Detail Page (صفحة تفاصيل التطبيق)</option>
                </select>
              </div>

              {/* IMAGE UPLOAD FROM DEVICE SECTION - PURE FILE UPLOAD */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 border-2 border-dashed border-amber-500/40 rounded-2xl space-y-3">
                <label className="text-xs font-black text-slate-900 dark:text-white block mb-1">
                  {lang === 'fr' ? 'Image de la publicité (Depuis l\'appareil) :' : 'صورة الإعلان (رفع صورة من جهازك):'}
                </label>

                {adFormImageUrl ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-amber-500/50 bg-slate-900 group shadow-md">
                    <img src={adFormImageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAdFormImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-all shadow-lg cursor-pointer"
                      title={lang === 'fr' ? 'Changer l\'image' : 'حذف/تغيير الصورة'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 ltr:left-2 rtl:right-2 px-2.5 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-lg shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'fr' ? 'Image prête' : 'تم اختيار صورة الإعلان من الجهاز'}</span>
                    </div>
                  </div>
                ) : (
                  <label className="w-full py-6 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border-2 border-dashed border-amber-500/50 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-xs group">
                    <UploadCloud className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform animate-bounce" />
                    <span className="text-sm font-black text-center">
                      {isUploadingAdImage 
                        ? (lang === 'fr' ? 'Téléversement de l\'image en cours...' : 'جاري رفع صورة الإعلان...') 
                        : (lang === 'fr' ? 'Cliquez pour choisir une image depuis votre appareil' : 'انقر هنا لاختيار صورة الإعلان من جهازك')}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      (PNG, JPG, WEBP - رفع مباشر من الهاتف أو الحاسوب)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAdImageUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">رابط التوجيه (Target URL)</label>
                <input
                  type="text"
                  required
                  value={adFormTargetUrl}
                  onChange={(e) => setAdFormTargetUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">نوع الإعلان</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={adFormType === 'image'} onChange={() => setAdFormType('image')} className="text-amber-500" /> صورة
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={adFormType === 'sponsored_app'} onChange={() => setAdFormType('sponsored_app')} className="text-amber-500" /> تطبيق مروج
                  </label>
                </div>
              </div>

              {adFormType === 'sponsored_app' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">اسم المعلن</label>
                    <input
                      type="text"
                      value={adFormSponsorName}
                      onChange={(e) => setAdFormSponsorName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">شارة المعلن</label>
                    <input
                      type="text"
                      value={adFormSponsorBadge}
                      onChange={(e) => setAdFormSponsorBadge(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  {t.closeBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-xl shadow-md cursor-pointer"
                >
                  {lang === 'fr' ? 'Enregistrer' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Member Edit Modal (تعديل بروفيل أي عضو) */}
      {isMemberModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl transition-colors">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-500" />
                <span>{lang === 'fr' ? 'Modifier le profil du membre' : 'تعديل بروفيل العضو'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsMemberModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs font-medium">
              {/* Member Avatar with Device Upload */}
              <div className="text-center mb-4">
                <div className="relative inline-block">
                  <div
                    onClick={() => memberFileInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-md group cursor-pointer bg-slate-100 dark:bg-slate-800 mx-auto"
                  >
                    <img
                      src={memberFormAvatar || 'https://ui-avatars.com/api/?name=User'}
                      alt={memberFormName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                      <Camera className="w-5 h-5 text-amber-400" />
                      <span className="text-[9px] font-bold mt-0.5">
                        {lang === 'fr' ? 'Changer' : 'تغيير'}
                      </span>
                    </div>
                    {isProcessingMemberImg && (
                      <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  <input
                    ref={memberFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMemberAvatarUpload}
                    className="hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => memberFileInputRef.current?.click()}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[11px] font-bold cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? 'Photo depuis l\'appareil' : 'رفع صورة من الجهاز'}</span>
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">
                  {lang === 'fr' ? 'Nom du membre' : 'اسم العضو'}
                </label>
                <input
                  type="text"
                  required
                  value={memberFormName}
                  onChange={(e) => setMemberFormName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-bold"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">
                  {lang === 'fr' ? 'Téléphone / WhatsApp' : 'رقم الهاتف / الواتساب'}
                </label>
                <input
                  type="text"
                  value={memberFormPhone}
                  onChange={(e) => setMemberFormPhone(e.target.value)}
                  placeholder="+213..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Role & Status Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">
                    {lang === 'fr' ? 'Rôle' : 'الرتبة والصلاحية'}
                  </label>
                  <select
                    value={memberFormRole}
                    onChange={(e) => setMemberFormRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white cursor-pointer font-bold"
                  >
                    <option value="user">عضو عادي (User)</option>
                    <option value="admin">مدير (Manager)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-bold">
                    {lang === 'fr' ? 'Statut' : 'حالة الحساب'}
                  </label>
                  <select
                    value={memberFormStatus}
                    onChange={(e) => setMemberFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white cursor-pointer font-bold"
                  >
                    <option value="active">نشط (Active)</option>
                    <option value="suspended">مجمد (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-xl cursor-pointer"
                >
                  {t.closeBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-xl shadow-md cursor-pointer"
                >
                  {lang === 'fr' ? 'Enregistrer' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Featured View Customization Modal */}
      {isFeaturedConfigModalOpen && featuredConfigApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{lang === 'fr' ? 'Personnaliser la Vue à l\'Affiche' : 'تخصيص نافذة العرض في الصدارة'}</span>
              </h3>
              <button onClick={() => setIsFeaturedModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFeaturedConfig} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">معلومات ترويجية إضافية (عربي)</label>
                  <textarea 
                    value={featuredInfoAr}
                    onChange={(e) => setFeaturedInfoAr(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white min-h-[100px]"
                    placeholder="اكتب نصاً تسويقياً يظهر في النافذة الكبيرة..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Info Promotionnelle (Français)</label>
                  <textarea 
                    value={featuredInfoFr}
                    onChange={(e) => setFeaturedInfoFr(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white min-h-[100px]"
                    placeholder="Texte marketing pour la fenêtre plein écran..."
                  />
                </div>
              </div>

              {/* Video Upload Section */}
              <div className="bg-slate-50 dark:bg-slate-950/50 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <label className="text-[10px] font-black uppercase text-slate-500 block mb-2">فيديو ترويجي (TikTok Style Video)</label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 w-full">
                    <input 
                      type="file" 
                      ref={videoFileInputRef}
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <button 
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border-2 border-dashed border-amber-500/30 rounded-xl hover:border-amber-500 transition-all text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      <Video className="w-4 h-4 text-amber-500" />
                      <span>{featuredVideoUrl ? (lang === 'fr' ? 'Changer la vidéo' : 'تغيير الفيديو') : (lang === 'fr' ? 'Téléverser une vidéo TikTok' : 'رفع فيديو قصير ترويجي')}</span>
                    </button>

                    {isVideoUploading && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-amber-500 uppercase">
                          <span>جاري الرفع...</span>
                          <span>{videoUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${videoUploadProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {featuredVideoUrl && (
                    <div className="w-full sm:w-[120px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-lg border border-amber-500/20 relative group">
                      <video src={featuredVideoUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                      <button 
                        type="button" 
                        onClick={() => setFeaturedVideoUrl('')}
                        className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-[9px] text-slate-500">{lang === 'fr' ? 'Sera affiché en plein écran à la fin de la vue.' : 'سيظهر الفيديو بحجم الشاشة الكاملة في أسفل نافذة العرض.'}</p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 block mb-3">اختر التعليقات لعرضها في الواجهة (Review Selection)</label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {reviews.filter(r => r.appId === featuredConfigApp.id).length === 0 ? (
                    <p className="text-[10px] text-slate-500 text-center py-4 italic">لا توجد تعليقات لهذا التطبيق حالياً</p>
                  ) : (
                    reviews.filter(r => r.appId === featuredConfigApp.id).map(rev => (
                      <label key={rev.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedFeaturedReviewIds.includes(rev.id) ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'}`}>
                        <input 
                          type="checkbox" 
                          checked={selectedFeaturedReviewIds.includes(rev.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedFeaturedReviewIds([...selectedFeaturedReviewIds, rev.id]);
                            else setSelectedFeaturedReviewIds(selectedFeaturedReviewIds.filter(id => id !== rev.id));
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => <Star key={s} className={`w-2 h-2 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />)}
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2">{rev.comment}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsFeaturedModalOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold">{t.closeBtn}</button>
                <button type="submit" className="px-6 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20">{lang === 'fr' ? 'Enregistrer les modifications' : 'حفظ الإعدادات الفاخرة'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
