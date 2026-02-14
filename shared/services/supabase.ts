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
  console.log('getVerifiedProfile: Fetching verified profile for userId:', userId);
  const { data, error } = await supabase
    .from('verified_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('getVerifiedProfile: Error fetching verified profile:', error);
    console.error('getVerifiedProfile: Error details:', error.message, error.code);
    return null;
  }
  console.log('getVerifiedProfile: Verified profile data retrieved:', data);
  return data;
};

export const isUserVerified = async (userId: string): Promise<boolean> => {
  console.log('isUserVerified: Checking if user is verified for userId:', userId);
  const { data, error } = await supabase
    .from('verified_profiles')
    .select('id')
    .eq('id', userId)
    .single();
  
  const isVerified = !error && data !== null;
  console.log('isUserVerified: User verification result:', isVerified, 'Error:', error);
  return isVerified;
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

export const getFollowing = async (userId: string): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('user_follows')
    .select(`
      following_id,
      profiles!user_follows_following_id_fkey (
        id,
        first_name,
        last_name,
        profile_photo_url,
        bio
      )
    `)
    .eq('follower_id', userId);
  
  if (error) {
    console.error('Error fetching following:', error);
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
