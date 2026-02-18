import { createClient } from '@supabase/supabase-js';

// Types for our database schema
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  profile_photo_url?: string;
  cover_photo_url?: string;
  bio?: string;
  website_url?: string;
  denomination_tags?: string[];
  shekel_balance?: number;
  follower_count?: number;
  following_count?: number;
  stream_count?: number;
  view_count?: number;
  is_verified?: boolean;
  // Present on rows sourced from `verified_profiles`
  ministry_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VerifiedProfile extends Profile {
  ministry_name?: string;
  verification_status?: string;
  verified_at?: string;
}

export interface Livestream {
  id: string;
  streamer_id: string;
  title: string;
  description?: string;
  room_name: string;
  status: 'active' | 'ended';
  is_live: boolean;
  viewer_count: number;
  max_viewers: number;
  started_at: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
  embed_url?: string;
  stream_type?: string;
  platform?: string;
  stream_key?: string;
  thumbnail_url?: string;
  stream_url?: string;
  start_time?: string;
  flag_count?: number;
  is_hidden?: boolean;
  stream_mode?: string;
  tags?: string[];
  jitsi_room_config?: any;
  redirect_url?: string;
  scheduled_at?: string;
  verified_profiles?: {
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
    ministry_name?: string;
  };
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (first 20 chars):', supabaseAnonKey?.substring(0, 20));

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helpers
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Profile services
export const getProfile = async (userId: string): Promise<Profile | null> => {
  console.log('getProfile: Fetching profile for userId:', userId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('getProfile: Error fetching profile:', error);
    console.error('getProfile: Error details:', error.message, error.code);
    return null;
  }
  console.log('getProfile: Profile data retrieved:', data);
  return data;
};

export const getVerifiedProfile = async (userId: string): Promise<VerifiedProfile | null> => {
  const { data, error } = await supabase
    .from('verified_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  return data;
};

export const isUserVerified = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('verified_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  return !error && data != null;
};

// Livestream services
export const getActiveLivestreams = async (): Promise<Livestream[]> => {
  try {
    const normalizeLivestream = (row: any): Livestream => {
      const createdAt =
        row?.created_at ??
        row?.started_at ??
        row?.updated_at ??
        new Date().toISOString();

      const vp = row?.verified_profiles;
      const verified_profiles =
        Array.isArray(vp) ? (vp[0] ?? undefined) : (vp ?? undefined);

      return {
        ...row,
        created_at: createdAt,
        updated_at: row?.updated_at ?? createdAt,
        verified_profiles,
      } as Livestream;
    };

    // Try using the database function first (like Flutter app)
    try {
      const { data, error } = await supabase.rpc('get_active_livestreams');
      
      if (error) {
        console.warn('Database function failed, falling back to direct query:', error);
        throw error;
      }
      
      console.log('Active livestreams count (function):', data?.length || 0);
      return (data || []).map(normalizeLivestream);
    } catch (functionError) {
      console.warn('Database function failed, falling back to direct query:', functionError);
      
      // Fallback to direct query (like Flutter app)
      const { data, error } = await supabase
        .from('livestreams')
        .select(`
          id,
          streamer_id,
          title,
          description,
          is_live,
          started_at,
          ended_at,
          created_at,
          embed_url,
          stream_type,
          platform,
          stream_key,
          thumbnail_url,
          stream_url,
          start_time,
          updated_at,
          flag_count,
          is_hidden,
          stream_mode,
          tags,
          viewer_count,
          max_viewers,
          jitsi_room_config,
          room_name,
          redirect_url,
          status,
          scheduled_at,
          verified_profiles!livestreams_streamer_id_fkey (
            first_name,
            last_name,
            profile_photo_url,
            ministry_name
          )
        `)
        .eq('is_live', true)
        .eq('is_hidden', false)
        .eq('status', 'active')
        .order('started_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching active livestreams:', error);
        return [];
      }
      
      console.log('Active livestreams count (direct query):', data?.length || 0);
      return (data || []).map(normalizeLivestream);
    }
  } catch (error) {
    console.error('Error getting active livestreams:', error);
    return [];
  }
};

export const getLivestreamById = async (livestreamId: string): Promise<Livestream | null> => {
  // Check if livestreamId is a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = uuidRegex.test(livestreamId);
  
  if (!isUuid) {
    console.log('Invalid UUID format for livestream ID:', livestreamId, 'trying room_name');
    // Try to find by room_name instead
    const { data, error } = await supabase
      .from('livestreams')
      .select('*')
      .eq('room_name', livestreamId)
      .single();
    
    if (error) {
      console.error('Error fetching livestream by room_name:', error);
      return null;
    }
    return data;
  }

  const { data, error } = await supabase
    .from('livestreams')
    .select('*')
    .eq('id', livestreamId)
    .single();
  
  if (error) {
    console.error('Error fetching livestream:', error);
    return null;
  }
  return data;
};

// Follow services
export const getFollowers = async (userId: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('user_follows')
    .select(`
      follower_id,
      profiles!user_follows_follower_id_fkey (
        id,
        first_name,
        last_name,
        profile_photo_url,
        bio
      )
    `)
    .eq('following_id', userId);
  
  if (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
  
  return (
    data?.flatMap((item: any) => {
      const p = item?.profiles;
      if (!p) return [];
      return Array.isArray(p) ? p : [p];
    }) || []
  );
};

const FOLLOWING_ID_COL = 'following_id';
const FOLLOWING_USER_ID_COL = 'following_user_id';

export const getFollowing = async (userId: string): Promise<Profile[]> => {
  // Prefer simple fallback: get list of followed user ids, then fetch profiles (works regardless of FK/join)
  let ids: string[] = [];

  const { data: rowsById, error: errById } = await supabase
    .from('user_follows')
    .select(FOLLOWING_ID_COL)
    .eq('follower_id', userId);

  if (!errById && rowsById && rowsById.length > 0) {
    ids = [...new Set((rowsById as { following_id: string }[]).map((r) => r.following_id).filter(Boolean))];
  } else {
    // Some schemas use following_user_id instead of following_id
    const { data: rowsByUser, error: errByUser } = await supabase
      .from('user_follows')
      .select(FOLLOWING_USER_ID_COL)
      .eq('follower_id', userId);
    if (!errByUser && rowsByUser && rowsByUser.length > 0) {
      ids = [...new Set((rowsByUser as { following_user_id: string }[]).map((r) => r.following_user_id).filter(Boolean))];
    }
  }

  if (ids.length === 0) return [];

  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, profile_photo_url, bio')
    .in('id', ids);
  if (profError || !profiles || !Array.isArray(profiles)) return [];
  return profiles as Profile[];
};

export const followUser = async (followerId: string, followingId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('user_follows')
    .insert({
      follower_id: followerId,
      following_id: followingId,
    });
  
  if (error) {
    console.error('Error following user:', error);
    return false;
  }
  return true;
};

export const unfollowUser = async (followerId: string, followingId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);
  
  if (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
  return true;
};

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();
  
  return !error && data !== null;
};

export const getFollowerCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('user_follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', userId);
  if (error) return 0;
  return count ?? 0;
};

export const getFollowingCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('user_follows')
    .select('id', { count: 'exact', head: true })
    .eq('follower_id', userId);
  if (error) return 0;
  return count ?? 0;
};

// Notification types
export interface AppNotification {
  id: string;
  user_id: string;
  from_user_id: string | null;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
  isVerifiedNotification?: boolean;
}

export const getNotifications = async (userId: string, options?: { unreadOnly?: boolean; limit?: number }): Promise<AppNotification[]> => {
  const limit = options?.limit ?? 50;
  const unreadOnly = options?.unreadOnly ?? false;

  const notifications: AppNotification[] = [];

  let regularQuery = supabase
    .from('notifications')
    .select('id, user_id, from_user_id, type, title, body, message, created_at, is_read, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (unreadOnly) regularQuery = regularQuery.eq('is_read', false);

  const { data: regular, error: regularError } = await regularQuery;

  if (!regularError && regular) {
    for (const row of regular) {
      notifications.push({
        id: row.id,
        user_id: row.user_id,
        from_user_id: row.from_user_id ?? null,
        type: row.type ?? '',
        title: row.title ?? '',
        body: (row.body ?? row.message ?? '') as string,
        is_read: row.is_read ?? false,
        created_at: row.created_at ?? '',
        metadata: (row.metadata as Record<string, unknown>) ?? undefined,
        isVerifiedNotification: false,
      });
    }
  }

  let verifiedQuery = supabase
    .from('verified_notifications')
    .select('id, user_id, from_user_id, type, title, body, created_at, is_read, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (unreadOnly) verifiedQuery = verifiedQuery.eq('is_read', false);

  const { data: verified, error: verifiedError } = await verifiedQuery;

  if (!verifiedError && verified) {
    for (const row of verified) {
      notifications.push({
        id: row.id,
        user_id: row.user_id,
        from_user_id: row.from_user_id ?? null,
        type: row.type ?? '',
        title: row.title ?? '',
        body: (row.body ?? '') as string,
        is_read: row.is_read ?? false,
        created_at: row.created_at ?? '',
        metadata: (row.metadata as Record<string, unknown>) ?? undefined,
        isVerifiedNotification: true,
      });
    }
  }

  notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return notifications.slice(0, limit);
};

export const markNotificationRead = async (notificationId: string, isVerified: boolean): Promise<void> => {
  const table = isVerified ? 'verified_notifications' : 'notifications';
  await supabase.from(table).update({ is_read: true }).eq('id', notificationId);
};

export const markAllNotificationsRead = async (userId: string): Promise<void> => {
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
  await supabase.from('verified_notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
};

// Direct messages / conversations
export interface ConversationSummary {
  id: string;
  updated_at: string;
  other_user: { id: string; display_name: string; avatar_url?: string | null };
  last_message: { content: string; created_at: string; sender_id: string } | null;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export const getConversations = async (userId: string): Promise<ConversationSummary[]> => {
  try {
    const { data: participants, error: partError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, conversations(id, updated_at)')
      .eq('user_id', userId);

    if (partError || !participants?.length) return [];

    const conversationIds = participants.map((p: { conversation_id: string }) => p.conversation_id);
    const convMap = new Map<string, string>();
    participants.forEach((p: { conversation_id: string; conversations: { id: string; updated_at: string } | { id: string; updated_at: string }[] | null }) => {
      const c = Array.isArray(p.conversations) ? p.conversations[0] ?? null : p.conversations;
      if (c?.id) convMap.set(p.conversation_id, c.updated_at);
    });

    const { data: allParticipants, error: allPartError } = await supabase
      .from('conversation_participants')
      .select('conversation_id, user_id')
      .in('conversation_id', conversationIds);

    if (allPartError) return [];

    const otherUserIds = new Set<string>();
    const conversationToOther = new Map<string, string>();
    allParticipants?.forEach((row: { conversation_id: string; user_id: string }) => {
      if (row.user_id !== userId) {
        otherUserIds.add(row.user_id);
        conversationToOther.set(row.conversation_id, row.user_id);
      }
    });

    const { data: messages, error: msgError } = await supabase
      .from('direct_messages')
      .select('id, conversation_id, sender_id, content, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false });

    if (msgError) return [];

    const lastByConv = new Map<string, { content: string; created_at: string; sender_id: string }>();
    messages?.forEach((m: { conversation_id: string; content: string; created_at: string; sender_id: string }) => {
      if (!lastByConv.has(m.conversation_id)) lastByConv.set(m.conversation_id, { content: m.content, created_at: m.created_at, sender_id: m.sender_id });
    });

    const ids = Array.from(otherUserIds);
    if (ids.length === 0) return [];

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', ids);
    const { data: verified } = await supabase
      .from('verified_profiles')
      .select('id, first_name, last_name, profile_photo_url')
      .in('id', ids);

    const profileMap = new Map<string, { display_name: string; avatar_url?: string | null }>();
    profiles?.forEach((p: { id: string; first_name?: string; last_name?: string; avatar_url?: string | null }) => {
      const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || 'User';
      profileMap.set(p.id, { display_name: name, avatar_url: p.avatar_url ?? null });
    });
    verified?.forEach((p: { id: string; first_name?: string; last_name?: string; profile_photo_url?: string | null }) => {
      const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || 'User';
      if (!profileMap.has(p.id)) profileMap.set(p.id, { display_name: name, avatar_url: p.profile_photo_url ?? null });
      else profileMap.set(p.id, { ...profileMap.get(p.id)!, avatar_url: p.profile_photo_url ?? profileMap.get(p.id)!.avatar_url });
    });

    const summaries: ConversationSummary[] = conversationIds.map((cid) => {
      const otherId = conversationToOther.get(cid);
      const other = otherId ? profileMap.get(otherId) : null;
      const last = lastByConv.get(cid) ?? null;
      return {
        id: cid,
        updated_at: convMap.get(cid) ?? '',
        other_user: otherId && other
          ? { id: otherId, display_name: other.display_name, avatar_url: other.avatar_url }
          : { id: '', display_name: 'Unknown', avatar_url: null },
        last_message: last,
      };
    });

    summaries.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    return summaries;
  } catch {
    return [];
  }
};

export const getMessages = async (conversationId: string, options?: { limit?: number }): Promise<DirectMessage[]> => {
  try {
    const limit = options?.limit ?? 50;
    const { data, error } = await supabase
      .from('direct_messages')
      .select('id, conversation_id, sender_id, content, created_at, read_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) return [];
    return (data ?? []) as DirectMessage[];
  } catch {
    return [];
  }
};

export interface ConversationDetail {
  other_user: { id: string; display_name: string; avatar_url?: string | null };
  messages: DirectMessage[];
}

export const getConversationDetail = async (conversationId: string, currentUserId: string): Promise<ConversationDetail | null> => {
  try {
    const { data: participants, error: partError } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conversationId);

    if (partError || !participants?.length) return null;
    const otherId = participants.find((p: { user_id: string }) => p.user_id !== currentUserId)?.user_id;
    if (!otherId) return null;

    const [profiles, verified, messages] = await Promise.all([
      supabase.from('profiles').select('id, first_name, last_name, avatar_url').eq('id', otherId).maybeSingle(),
      supabase.from('verified_profiles').select('id, first_name, last_name, profile_photo_url').eq('id', otherId).maybeSingle(),
      getMessages(conversationId),
    ]);

    const p = profiles.data ?? verified.data;
    const name = p
      ? [p.first_name, p.last_name].filter(Boolean).join(' ').trim() || 'User'
      : 'User';
    const avatar = profiles.data?.avatar_url ?? verified.data?.profile_photo_url ?? null;

    return {
      other_user: { id: otherId, display_name: name, avatar_url: avatar },
      messages,
    };
  } catch {
    return null;
  }
};

// Products (merch) – Vine/Cedar verified users; RLS restricts to active products from vine/cedar
export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  url: string;
  price: number;
  thumbnail_url: string | null;
  vendor: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getProductsBySeller = async (sellerId: string, limit = 20): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, user_id, title, description, url, price, thumbnail_url, vendor, is_active, created_at, updated_at')
      .eq('user_id', sellerId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as Product[];
  } catch {
    return [];
  }
};

// Courses (public, published)
export interface Course {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  cover_photo_url: string | null;
  category: string | null;
  is_free: boolean;
  price_shekelz: number;
  instructor: string | null;
  enrollments_count: number;
  is_published: boolean;
  slug: string | null;
  created_at: string;
}

export const getPublicCourses = async (options?: { limit?: number; category?: string }): Promise<Course[]> => {
  const limit = options?.limit ?? 24;
  let query = supabase
    .from('courses')
    .select('id, creator_id, title, description, cover_photo_url, category, is_free, price_shekelz, instructor, enrollments_count, is_published, slug, created_at')
    .eq('visibility', 'public')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (options?.category) query = query.eq('category', options.category);
  const { data, error } = await query;
  if (!error) return (data ?? []) as Course[];
  // Fallback: try without is_published filter (in case column missing or RLS only allows visibility)
  const { data: fallbackData, error: fallbackError } = await supabase
    .from('courses')
    .select('id, creator_id, title, description, cover_photo_url, category, is_free, price_shekelz, instructor, enrollments_count, is_published, slug, created_at')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (!fallbackError && fallbackData?.length) {
    const filtered = (fallbackData as Course[]).filter((c) => c.is_published !== false);
    return filtered;
  }
  throw new Error(error?.message ?? 'Failed to load courses');
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, creator_id, title, description, cover_photo_url, category, is_free, price_shekelz, instructor, enrollments_count, is_published, slug, created_at')
      .eq('id', courseId)
      .eq('visibility', 'public')
      .eq('is_published', true)
      .maybeSingle();
    if (error || !data) return null;
    return data as Course;
  } catch {
    return null;
  }
};

// Shekel services
export const getShekelBalance = async (userId: string): Promise<number> => {
  try {
    // Check if user is verified first
    const isVerified = await isUserVerified(userId);
    
    if (isVerified) {
      // For verified users, prioritize verified_profiles.shekel_balance
      const { data, error } = await supabase
        .from('verified_profiles')
        .select('shekel_balance')
        .eq('id', userId)
        .single();
      
      if (!error && data?.shekel_balance !== null) {
        return data.shekel_balance || 0;
      }
    }
    
    // Fallback to profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('shekel_balance')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching shekel balance:', error);
      return 0;
    }
    
    return data?.shekel_balance || 0;
  } catch (error) {
    console.error('Error in getShekelBalance:', error);
    return 0;
  }
};

// Get available shekel packages
export const getShekelPackages = async (): Promise<Array<{
  id: string;
  name: string;
  shekelz_amount: number;
  price_usd: number;
  bonus_shekelz: number;
  is_active: boolean;
  display_order: number;
}>> => {
  try {
    const { data, error } = await supabase
      .from('shekel_packages')
      .select('*')
      .eq('is_active', true)
      .order('shekelz_amount', { ascending: true });

    if (error) {
      console.error('Error fetching shekel packages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getShekelPackages:', error);
    return [];
  }
};

// Get user's purchase history
export const getShekelPurchaseHistory = async (userId: string, limit: number = 20): Promise<Array<{
  id: string;
  shekelz_amount: number;
  total_price_usd: number;
  status: string;
  created_at: string;
}>> => {
  try {
    const { data, error } = await supabase
      .from('shekel_purchases')
      .select('id, shekelz_amount, total_price_usd, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching purchase history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getShekelPurchaseHistory:', error);
    return [];
  }
};

// Get featured/popular streamers (users with most followers)
export const getFeaturedStreamers = async (limit: number = 5): Promise<Profile[]> => {
  try {
    // Get verified users first (they're more likely to be featured)
    const { data: verifiedData, error: verifiedError } = await supabase
      .from('verified_profiles')
      .select('id, first_name, last_name, profile_photo_url, follower_count, ministry_name')
      .not('follower_count', 'is', null)
      .order('follower_count', { ascending: false })
      .limit(limit);

    if (verifiedError) {
      console.error('Error fetching verified streamers:', verifiedError);
    }

    // Get regular users as fallback
    const { data: regularData, error: regularError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, profile_photo_url, follower_count')
      .not('follower_count', 'is', null)
      .order('follower_count', { ascending: false })
      .limit(limit);

    if (regularError) {
      console.error('Error fetching regular streamers:', regularError);
    }

    // Combine and sort by follower count
    const allStreamers = [
      ...(verifiedData || []).map(p => ({ ...p, is_verified: true })),
      ...(regularData || []).map(p => ({ ...p, is_verified: false }))
    ].sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0));

    return allStreamers.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured streamers:', error);
    return [];
  }
};

// Get recent/new profiles
export const getNewProfiles = async (limit: number = 4): Promise<Profile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, profile_photo_url, bio, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching new profiles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching new profiles:', error);
    return [];
  }
};

// Groups interface
export interface Group {
  id: string;
  name: string;
  description?: string;
  cover_photo_url?: string;
  member_count?: number;
  owner_id: string;
  is_private?: boolean;
  created_at: string;
  updated_at: string;
}

// Get user's groups (owned and joined)
export const getUserGroups = async (): Promise<{ owned: Group[]; joined: Group[] }> => {
  try {
    console.log('Calling list-groups Edge Function...');
    
    // Call the list-groups Edge Function (same as Flutter app)
    const { data, error } = await supabase.functions.invoke('list-groups', {
      body: {},
    });

    console.log('list-groups response:', { data, error });

    if (error) {
      console.error('Error fetching user groups:', error);
      return { owned: [], joined: [] };
    }

    const result = {
      owned: data?.owned || [],
      joined: data?.joined || [],
    };
    
    console.log('Processed groups result:', result);
    return result;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return { owned: [], joined: [] };
  }
};

// Get public groups for suggestions
export const getPublicGroups = async (limit: number = 6): Promise<Group[]> => {
  try {
    // Call the list-public-groups Edge Function
    const { data, error } = await supabase.functions.invoke('list-public-groups', {
      body: { limit },
    });

    if (error) {
      console.error('Error fetching public groups:', error);
      return [];
    }

    return data?.groups || [];
  } catch (error) {
    console.error('Error fetching public groups:', error);
    return [];
  }
};

// Join a group
export const joinGroup = async (groupId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('join-group', {
      body: { group_id: groupId },
    });

    if (error) {
      console.error('Error joining group:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error joining group:', error);
    return false;
  }
};

// Create a group
export const createGroup = async (name: string, description?: string): Promise<Group | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-group', {
      body: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    if (error) {
      console.error('Error creating group:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating group:', error);
    return null;
  }
};

// Get a single group by ID
export const getGroup = async (groupId: string): Promise<Group | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-group', {
      body: { group_id: groupId },
    });

    if (error) {
      console.error('Error fetching group:', error);
      return null;
    }

    return data?.group || null;
  } catch (error) {
    console.error('Error fetching group:', error);
    return null;
  }
};

// Leave a group
export const leaveGroup = async (groupId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('leave-group', {
      body: { group_id: groupId },
    });

    if (error) {
      console.error('Error leaving group:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error leaving group:', error);
    return false;
  }
};

// Check if user is a member of a group
export const isGroupMember = async (userId: string, groupId: string): Promise<{ isMember: boolean; isOwner: boolean }> => {
  try {
    console.log('Calling check-group-membership with:', { userId, groupId });
    
    const { data, error } = await supabase.functions.invoke('check-group-membership', {
      body: { user_id: userId, group_id: groupId },
    });

    console.log('check-group-membership response:', { data, error });

    if (error) {
      console.error('Error checking group membership:', error);
      return { isMember: false, isOwner: false };
    }

    const result = {
      isMember: data?.is_member || false,
      isOwner: data?.is_owner || false,
    };
    
    console.log('Processed membership result:', result);
    return result;
  } catch (error) {
    console.error('Error checking group membership:', error);
    return { isMember: false, isOwner: false };
  }
};

// Get group feed (posts)
export const getGroupFeed = async (groupId: string, limit: number = 20): Promise<Post[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-group-feed', {
      body: { group_id: groupId, limit },
    });

    if (error) {
      console.error('Error fetching group feed:', error);
      return [];
    }

    return data?.posts || [];
  } catch (error) {
    console.error('Error fetching group feed:', error);
    return [];
  }
};

// Group member interface
export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

// Get group members
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-group-members', {
      body: { group_id: groupId },
    });

    if (error) {
      console.error('Error fetching group members:', error);
      return [];
    }

    return data?.members || [];
  } catch (error) {
    console.error('Error fetching group members:', error);
    return [];
  }
};

// Request to join a group
export const requestToJoinGroup = async (groupId: string, message?: string): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('request-to-join-group', {
      body: {
        group_id: groupId,
        message: message || null
      },
    });

    if (error) {
      console.error('Error requesting to join group:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting to join group:', error);
    return false;
  }
};

// Auth functions matching Flutter app
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('update-password', {
      body: {
        current_password: currentPassword,
        new_password: newPassword,
      },
    });

    if (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message || 'Failed to update password' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const updateEmail = async (newEmail: string, currentPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('update-email', {
      body: {
        newEmail: newEmail,
        password: currentPassword,
      },
    });

    if (error) {
      console.error('Error updating email:', error);
      return { success: false, error: error.message || 'Failed to update email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating email:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const sendInvite = async (inviteeEmail: string, message?: string): Promise<{ success: boolean; error?: string; inviteId?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-invite', {
      body: {
        invitee_email: inviteeEmail,
        inviter_id: (await supabase.auth.getUser()).data.user?.id,
        message: message || null,
      },
    });

    if (error) {
      console.error('Error sending invite:', error);
      return { success: false, error: error.message || 'Failed to send invite' };
    }

    return { 
      success: true, 
      inviteId: data?.invite_id 
    };
  } catch (error) {
    console.error('Error sending invite:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const reportContent = async (reportData: {
  reason_key: string;
  custom_reason?: string;
  report_url?: string;
  content_type?: string;
  content_id?: string;
  additional_notes?: string;
  screenshot_urls?: string[];
}): Promise<{ success: boolean; error?: string; reportId?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('report-content', {
      body: reportData,
    });

    if (error) {
      console.error('Error reporting content:', error);
      return { success: false, error: error.message || 'Failed to submit report' };
    }

    return { 
      success: true, 
      reportId: data?.report_id 
    };
  } catch (error) {
    console.error('Error reporting content:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Get groups/communities (if you have a groups table) - for featured groups
export const getFeaturedGroups = async (limit: number = 4): Promise<any[]> => {
  try {
    // Check if groups table exists, if not return empty array
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('member_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching groups (table may not exist):', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

// Get trending topics (from posts or hashtags)
export const getTrendingTopics = async (limit: number = 8): Promise<{tag: string, posts: number}[]> => {
  try {
    // Check if there's a posts or hashtags table to get real trending data
    // For now, return empty array since we don't have real trending data
    // This will hide the trending topics section until real data is available
    return [];
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
};

// Posts functionality
export interface Post {
  id: string;
  user_id: string;
  content: string;
  images?: string[];
  audio_url?: string;
  video_url?: string;
  scripture_reference?: string;
  link_url?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
    is_verified: boolean;
  };
  like_count: number;
  prayer_count: number;
  comment_count: number;
  share_count: number;
  liked: boolean;
  prayed: boolean;
}

export async function getPublicFeed(limit: number = 20, before?: string): Promise<Post[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Fetch shield relationships (both directions)
    const [myShields, theirShields] = await Promise.all([
      supabase
        .from('user_shields')
        .select('shielded_user_id')
        .eq('user_id', user.id),
      supabase
        .from('user_shields')
        .select('user_id')
        .eq('shielded_user_id', user.id)
    ]);

    const excludedUserIds = new Set([
      ...(myShields.data || []).map(r => r.shielded_user_id).filter(Boolean),
      ...(theirShields.data || []).map(r => r.user_id).filter(Boolean)
    ]);

    // Fetch posts
    const pageSize = Math.min(limit, 50);
    const fetchSize = Math.min(pageSize * 2, 100);

    let query = supabase
      .from('posts')
      .select(`
        id,
        user_id,
        content,
        images,
        created_at,
        updated_at,
        scripture_reference,
        link_url,
        audio_url,
        shared_post_id
      `)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(fetchSize);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data: posts, error } = await query;
    if (error) throw error;

    // Filter out shielded users
    const filteredPosts = (posts || []).filter(p => !excludedUserIds.has(p.user_id));
    const limited = filteredPosts.slice(0, pageSize);

    if (limited.length === 0) return [];

    // Gather author ids and post ids
    const authorIds = [...new Set(limited.map(p => p.user_id))];
    const postIds = limited.map(p => p.id);

    // Fetch base profiles
    const { data: baseProfiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, profile_photo_url')
      .in('id', authorIds);

    // Fetch verified profiles
    const { data: verifiedProfiles } = await supabase
      .from('verified_profiles')
      .select('id, first_name, last_name, profile_photo_url')
      .in('id', authorIds);

    const baseMap = new Map((baseProfiles || []).map(p => [p.id, p]));
    const verifiedMap = new Map((verifiedProfiles || []).map(p => [p.id, p]));

    // Fetch reaction counts
    const [likes, myLikes, prayers, myPrayers, comments, shares] = await Promise.all([
      supabase.from('post_likes').select('post_id').in('post_id', postIds),
      supabase.from('post_likes').select('post_id').in('post_id', postIds).eq('user_id', user.id),
      supabase.from('post_prayers').select('post_id').in('post_id', postIds),
      supabase.from('post_prayers').select('post_id').in('post_id', postIds).eq('user_id', user.id),
      supabase.from('post_comments').select('post_id').in('post_id', postIds),
      supabase.from('post_shares').select('post_id').in('post_id', postIds)
    ]);

    // Count reactions
    const countReactions = (data: any[] | null | undefined, key: string) => {
      const counts = new Map<string, number>();
      (data || []).forEach(item => {
        const id = item[key];
        if (id) counts.set(id, (counts.get(id) || 0) + 1);
      });
      return counts;
    };

    const likeCounts = countReactions(likes.data, 'post_id');
    const prayCounts = countReactions(prayers.data, 'post_id');
    const commentCounts = countReactions(comments.data, 'post_id');
    const shareCounts = countReactions(shares.data, 'post_id');

    const myLikedSet = new Set((myLikes.data || []).map(l => l.post_id));
    const myPrayedSet = new Set((myPrayers.data || []).map(p => p.post_id));

    // Enrich posts with author data and counts
    const enrichedPosts: Post[] = limited.map(post => {
      const authorId = post.user_id;
      const base = baseMap.get(authorId);
      const verified = verifiedMap.get(authorId);

      const mergedAuthor = {
        id: authorId,
        first_name: (verified?.first_name?.trim() || base?.first_name) || '',
        last_name: (verified?.last_name?.trim() || base?.last_name) || '',
        profile_photo_url: (verified?.profile_photo_url || base?.profile_photo_url) || undefined,
        is_verified: !!verified
      };

      return {
        ...post,
        author: mergedAuthor,
        like_count: likeCounts.get(post.id) || 0,
        prayer_count: prayCounts.get(post.id) || 0,
        comment_count: commentCounts.get(post.id) || 0,
        share_count: shareCounts.get(post.id) || 0,
        liked: myLikedSet.has(post.id),
        prayed: myPrayedSet.has(post.id)
      };
    });

    return enrichedPosts;
  } catch (error) {
    console.error('Error fetching public feed:', error);
    return [];
  }
}

export async function createPost(content: string, options?: {
  images?: string[];
  audioUrl?: string;
  videoUrl?: string;
  scriptureReference?: string;
  groupId?: string;
}): Promise<Post | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content: content.trim(),
        ...(options?.images && { images: options.images }),
        ...(options?.audioUrl && { audio_url: options.audioUrl }),
        ...(options?.videoUrl && { link_url: options.videoUrl }),
        ...(options?.scriptureReference && { scripture_reference: options.scriptureReference }),
        ...(options?.groupId && { group_id: options.groupId })
      })
      .select()
      .single();

    if (error) throw error;

    // Return a simplified post object for immediate UI update
    return {
      ...data,
      author: {
        id: user.id,
        first_name: '',
        last_name: '',
        is_verified: false
      },
      like_count: 0,
      prayer_count: 0,
      comment_count: 0,
      share_count: 0,
      liked: false,
      prayed: false
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
}

export async function togglePostLike(postId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      return false;
    } else {
      // Like
      await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        });
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return false;
  }
}

export async function togglePostPrayer(postId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if already prayed
    const { data: existingPrayer } = await supabase
      .from('post_prayers')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingPrayer) {
      // Unpray
      await supabase
        .from('post_prayers')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      return false;
    } else {
      // Pray
      await supabase
        .from('post_prayers')
        .insert({
          post_id: postId,
          user_id: user.id
        });
      return true;
    }
  } catch (error) {
    console.error('Error toggling prayer:', error);
    return false;
  }
}
