export type CategoryType = string; // Changed from union to string for dynamic support

export type Language = 'ar' | 'fr';

export interface CategoryItem {
  id: string;
  nameAr: string;
  nameFr: string;
  icon: string;
  color: string; // Tailwind color class or hex
}

export interface AppItem {
  id: string;
  title: string;
  titleFr: string;
  slug: string;
  category: string; // Refers to CategoryItem.id
  shortDesc: string;
  shortDescFr: string;
  fullDesc: string;
  fullDescFr: string;
  icon: string;
  badge: string;
  badgeFr: string;
  downloadsCount: number;
  rating: number;
  reviewsCount: number;
  size: string;
  version: string;
  updatedDate: string;
  developer: string;
  screenshots: string[];
  features: string[];
  featuresFr: string[];
  downloadLinks: {
    androidUrl: string;
    iosUrl: string;
    apkSize: string;
  };
  uploadedFileName?: string;
  uploadedFileBlobUrl?: string;
  downloadAccess?: 'public' | 'members_only'; // Public vs Members-only access
  isFeatured?: boolean;
  pinnedExpiry?: number; // Timestamp when pinning expires
  pinnedPosition?: number; // Priority order in pinned list
  status: 'published' | 'draft';
  featuredCustomInfoAr?: string;
  featuredCustomInfoFr?: string;
  featuredScreenshots?: string[];
  featuredReviewIds?: string[];
  videoUrl?: string;
}

export interface ReviewItem {
  id: string;
  appId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  authProvider: 'google' | 'facebook';
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  developerReply?: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'facebook' | 'admin' | 'email';
  role: 'user' | 'admin';
  joinedDate: string;
  status: 'active' | 'suspended';
  ipAddress?: string;
  phone?: string;
  bio?: string;
  passwordHash?: string;
  friends?: string[];
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName?: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

export interface AdBannerItem {
  id: string;
  title: string;
  titleFr: string;
  placement: 'header' | 'sidebar' | 'in_feed' | 'detail' | 'floating';
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  type: 'image' | 'sponsored_app';
  sponsorName?: string;
  sponsorBadge?: string;
  appId?: string;
}

export interface FloatingAdItem {
  id: string;
  titleAr: string;
  titleFr: string;
  subtitleAr: string;
  subtitleFr: string;
  imageUrl: string;
  badgeAr?: string;
  badgeFr?: string;
  buttonTextAr: string;
  buttonTextFr: string;
  targetUrl: string;
  appId?: string;
  isActive: boolean;
}

export interface DownloadLog {
  id: string;
  appId: string;
  appName: string;
  timestamp: string;
  device: 'Android' | 'iOS' | 'Web';
  ipLocation: string;
}

export interface SiteSettings {
  siteTitleAr: string;
  siteTitleFr: string;
  defaultLang: Language;
  enableGoogleLogin: boolean;
  enableFacebookLogin: boolean;
  adSenseCode: string;
  maintenanceMode: boolean;
  contactEmail: string;
  whatsappNumber: string; // Added field
  facebookLink?: string;
  instagramLink?: string;
  tiktokLink?: string;
  featuredAppId?: string; // Admin selected app for top Hero showcase
  adminUsername?: string;
  adminPassword?: string;
  adminDisplayName?: string;
  adminAvatar?: string;
  adminPhone?: string;
  // Platform App / PWA configuration
  pwaTitle?: string;
  pwaShortName?: string;
  pwaStartUrl?: string;
  pwaIcon?: string;
  officialApkUrl?: string;
  // Feature Toggles for the App/Platform
  appFeatures?: {
    enableMemberChat?: boolean;
    enableNotifications?: boolean;
    enableAppReviews?: boolean;
    enableAIStoreAssistant?: boolean;
    enableLiveSupport?: boolean;
    enableUserProfiles?: boolean;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ProjectRequestItem {
  id: string;
  projectType: 'mobile_app' | 'website' | 'ecommerce' | 'erp_pos' | 'custom';
  projectTitle: string;
  userIdea: string;
  aiSummary: string;
  suggestedTech?: string;
  estimatedTimeline?: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userId?: string;
  ipAddress?: string;
  createdAt: string;
  status: 'pending' | 'contacted' | 'in_development' | 'completed';
}

export interface NotificationItem {
  id: string;
  titleAr: string;
  titleFr: string;
  messageAr: string;
  messageFr: string;
  type: 'info' | 'update' | 'news' | 'alert';
  createdAt: string;
  targetAppId?: string; // Optional link to an app
  isActive: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

