import type { Livestream, Profile, UserFollow, VerifiedProfile } from '../services/supabase';

// Re-export types from supabase service
export type { Livestream, Profile, UserFollow, VerifiedProfile };

// Additional web-specific types
export interface User {
  id: string;
  email: string;
  profile?: Profile;
  verifiedProfile?: VerifiedProfile;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LivestreamCard {
  id: string;
  title: string;
  description?: string;
  streamer: {
    id: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
  };
  viewerCount: number;
  thumbnail?: string;
  isLive: boolean;
  startedAt: string;
}

export interface ProfileCard {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  followerCount: number;
  isVerified: boolean;
  isFollowing?: boolean;
}

export interface GroupCard {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avatar?: string;
  coverImage?: string;
  category: string;
}

export interface NotificationItem {
  id: string;
  type: 'follow' | 'livestream' | 'donation' | 'mention';
  title: string;
  message: string;
  avatar?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SearchResult {
  users: ProfileCard[];
  livestreams: LivestreamCard[];
  groups: GroupCard[];
}

// UI State types
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: NotificationItem[];
  unreadCount: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  bio?: string;
  websiteUrl?: string;
  denominationTags?: string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
