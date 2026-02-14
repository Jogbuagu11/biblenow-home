export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audio_playlists: {
        Row: {
          created_at: string | null
          id: string
          name: string
          user_id: string
          verse_references: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          user_id: string
          verse_references: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
          verse_references?: Json
        }
        Relationships: []
      }
      auth_signups: {
        Row: {
          birthdate: string | null
          country: string | null
          device_type: string | null
          email: string | null
          gender: string | null
          id: string
          ip_address: string | null
          referral_source: string | null
          signup_time: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          birthdate?: string | null
          country?: string | null
          device_type?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          ip_address?: string | null
          referral_source?: string | null
          signup_time?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          birthdate?: string | null
          country?: string | null
          device_type?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          ip_address?: string | null
          referral_source?: string | null
          signup_time?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bible_kjv: {
        Row: {
          book_name: string | null
          book_number: number | null
          chapter: number | null
          text: string | null
          verse: number | null
          verse_id: number
        }
        Insert: {
          book_name?: string | null
          book_number?: number | null
          chapter?: number | null
          text?: string | null
          verse?: number | null
          verse_id: number
        }
        Update: {
          book_name?: string | null
          book_number?: number | null
          chapter?: number | null
          text?: string | null
          verse?: number | null
          verse_id?: number
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_references: {
        Row: {
          book_key: number
          chapter_nbr: number | null
          reference_list: string | null
          sort_order: number | null
          verse_nbr: number | null
          word: string | null
        }
        Insert: {
          book_key: number
          chapter_nbr?: number | null
          reference_list?: string | null
          sort_order?: number | null
          verse_nbr?: number | null
          word?: string | null
        }
        Update: {
          book_key?: number
          chapter_nbr?: number | null
          reference_list?: string | null
          sort_order?: number | null
          verse_nbr?: number | null
          word?: string | null
        }
        Relationships: []
      }
      denomination_requests: {
        Row: {
          created_at: string | null
          id: string
          not_approved: boolean | null
          reason: string | null
          requested_name: string | null
          status: Database["public"]["Enums"]["denomination_status"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          not_approved?: boolean | null
          reason?: string | null
          requested_name?: string | null
          status?: Database["public"]["Enums"]["denomination_status"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          not_approved?: boolean | null
          reason?: string | null
          requested_name?: string | null
          status?: Database["public"]["Enums"]["denomination_status"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      denominations: {
        Row: {
          created_at: string | null
          description: string | null
          name: string
          sort_order: number | null
          status: Database["public"]["Enums"]["status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          name: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          name?: string
          sort_order?: number | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_verification_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: []
      }
      game_preferences: {
        Row: {
          audiospeed: number | null
          backgroundmusic: boolean | null
          updated_at: string | null
          user_id: string
          volume: number | null
        }
        Insert: {
          audiospeed?: number | null
          backgroundmusic?: boolean | null
          updated_at?: string | null
          user_id: string
          volume?: number | null
        }
        Update: {
          audiospeed?: number | null
          backgroundmusic?: boolean | null
          updated_at?: string | null
          user_id?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string | null
          group_id: string | null
          id: string
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          id: string
          is_private: boolean
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_private?: boolean
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_private?: boolean
          title?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      livestream_followers: {
        Row: {
          followed_at: string | null
          id: string
          streamer_id: string | null
          user_id: string | null
        }
        Insert: {
          followed_at?: string | null
          id?: string
          streamer_id?: string | null
          user_id?: string | null
        }
        Update: {
          followed_at?: string | null
          id?: string
          streamer_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "livestream_followers_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livestream_followers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      livestreams: {
        Row: {
          created_at: string | null
          description: string | null
          ended_at: string | null
          id: string
          is_live: boolean | null
          started_at: string | null
          streamer_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_live?: boolean | null
          started_at?: string | null
          streamer_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_live?: boolean | null
          started_at?: string | null
          streamer_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "livestreams_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          enable_realtime: boolean | null
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          enable_realtime?: boolean | null
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          enable_realtime?: boolean | null
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          recipient_id: string | null
          seen: boolean | null
          sender_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          recipient_id?: string | null
          seen?: boolean | null
          sender_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          recipient_id?: string | null
          seen?: boolean | null
          sender_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_logs: {
        Row: {
          completed_at: string | null
          email: string | null
          id: string
          ip_address: string | null
          requested_at: string | null
          user_agent: string | null
        }
        Insert: {
          completed_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          requested_at?: string | null
          user_agent?: string | null
        }
        Update: {
          completed_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
          requested_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      post_attachments: {
        Row: {
          audio_url: string | null
          caption: string | null
          created_at: string | null
          id: string
          link_preview: Json | null
          link_url: string | null
          post_id: string | null
          scripture_ref: string | null
          type: string | null
        }
        Insert: {
          audio_url?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string
          link_preview?: Json | null
          link_url?: string | null
          post_id?: string | null
          scripture_ref?: string | null
          type?: string | null
        }
        Update: {
          audio_url?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string
          link_preview?: Json | null
          link_url?: string | null
          post_id?: string | null
          scripture_ref?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_attachments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_prayers: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayers_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          created_at: string
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          enable_realtime: boolean | null
          id: string
          images: string[] | null
          link_url: string | null
          scripture_reference: string | null
          shared_post_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          enable_realtime?: boolean | null
          id?: string
          images?: string[] | null
          link_url?: string | null
          scripture_reference?: string | null
          shared_post_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          enable_realtime?: boolean | null
          id?: string
          images?: string[] | null
          link_url?: string | null
          scripture_reference?: string | null
          shared_post_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_shared_post_id_fkey"
            columns: ["shared_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          birthdate: string | null
          church: string | null
          church_name: string | null
          church_place_id: string | null
          city: string | null
          cover_photo_url: string | null
          created_at: string | null
          date_saved: string | null
          denomination: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          has_completed_2fa: boolean | null
          has_completed_profile: boolean | null
          id: string
          is_private: boolean | null
          is_verified: boolean | null
          last_name: string | null
          location: string | null
          name: string | null
          phone: string | null
          phone_number: string | null
          phone_number_verified: boolean | null
          profile_photo_url: string | null
          state: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          updated_at: string | null
          username: string | null
          years_saved_category: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          birthdate?: string | null
          church?: string | null
          church_name?: string | null
          church_place_id?: string | null
          city?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          date_saved?: string | null
          denomination?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          has_completed_2fa?: boolean | null
          has_completed_profile?: boolean | null
          id: string
          is_private?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          phone_number?: string | null
          phone_number_verified?: boolean | null
          profile_photo_url?: string | null
          state?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          username?: string | null
          years_saved_category?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          birthdate?: string | null
          church?: string | null
          church_name?: string | null
          church_place_id?: string | null
          city?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          date_saved?: string | null
          denomination?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          has_completed_2fa?: boolean | null
          has_completed_profile?: boolean | null
          id?: string
          is_private?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          phone_number?: string | null
          phone_number_verified?: boolean | null
          profile_photo_url?: string | null
          state?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          username?: string | null
          years_saved_category?: string | null
        }
        Relationships: []
      }
      public_config: {
        Row: {
          key: string
          value: string | null
        }
        Insert: {
          key: string
          value?: string | null
        }
        Update: {
          key?: string
          value?: string | null
        }
        Relationships: []
      }
      reading_plan_days: {
        Row: {
          day_number: number
          id: string
          plan_id: string | null
          reference: string
        }
        Insert: {
          day_number: number
          id?: string
          plan_id?: string | null
          reference: string
        }
        Update: {
          day_number?: number
          id?: string
          plan_id?: string | null
          reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plan_members: {
        Row: {
          id: string
          joined_at: string | null
          last_completed_day: number | null
          plan_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          last_completed_day?: number | null
          plan_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          last_completed_day?: number | null
          plan_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_members_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_plan_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plans: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          start_date: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          start_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      save_tags: {
        Row: {
          id: string
          saved_post_id: string | null
          tag: string | null
        }
        Insert: {
          id?: string
          saved_post_id?: string | null
          tag?: string | null
        }
        Update: {
          id?: string
          saved_post_id?: string | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "save_tags_saved_post_id_fkey"
            columns: ["saved_post_id"]
            isOneToOne: false
            referencedRelation: "saved_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_posts: {
        Row: {
          id: string
          post_id: string | null
          saved_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          saved_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          saved_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_years_ranges: {
        Row: {
          created_at: string | null
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          sort_order: number
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      sent_emails: {
        Row: {
          created_at: string | null
          error: string | null
          id: string
          status: string | null
          subject: string | null
          to_email: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          id?: string
          status?: string | null
          subject?: string | null
          to_email: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          id?: string
          status?: string | null
          subject?: string | null
          to_email?: string
          type?: string | null
        }
        Relationships: []
      }
      shares: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      signin_logs: {
        Row: {
          email: string | null
          id: string
          ip_address: string | null
          signed_in_at: string | null
          success: boolean | null
          used_2fa: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          ip_address?: string | null
          signed_in_at?: string | null
          success?: boolean | null
          used_2fa?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          ip_address?: string | null
          signed_in_at?: string | null
          success?: boolean | null
          used_2fa?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      signup_logs: {
        Row: {
          confirmed_at: string | null
          email: string
          id: string
          inserted_at: string | null
          user_id: string | null
        }
        Insert: {
          confirmed_at?: string | null
          email: string
          id?: string
          inserted_at?: string | null
          user_id?: string | null
        }
        Update: {
          confirmed_at?: string | null
          email?: string
          id?: string
          inserted_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      strongs: {
        Row: {
          description: string | null
          lemma: string | null
          number: string
          pronounce: string | null
          xlit: string | null
        }
        Insert: {
          description?: string | null
          lemma?: string | null
          number: string
          pronounce?: string | null
          xlit?: string | null
        }
        Update: {
          description?: string | null
          lemma?: string | null
          number?: string
          pronounce?: string | null
          xlit?: string | null
        }
        Relationships: []
      }
      subscription_logs: {
        Row: {
          created_at: string | null
          event_data: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          event_data?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          event_data?: string | null
          id?: number
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          issue_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          issue_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          issue_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_user_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          blocked_user_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          blocked_user_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_font_styles: {
        Row: {
          book_name: string
          chapter: number
          content: string
          created_at: string | null
          id: string
          styles: string
          user_id: string
          verse: number
        }
        Insert: {
          book_name: string
          chapter: number
          content: string
          created_at?: string | null
          id?: string
          styles: string
          user_id: string
          verse: number
        }
        Update: {
          book_name?: string
          chapter?: number
          content?: string
          created_at?: string | null
          id?: string
          styles?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      user_highlights: {
        Row: {
          book_name: string
          chapter: number
          color: string | null
          content: string
          created_at: string | null
          id: string
          user_id: string
          verse: number
        }
        Insert: {
          book_name: string
          chapter: number
          color?: string | null
          content: string
          created_at?: string | null
          id?: string
          user_id: string
          verse: number
        }
        Update: {
          book_name?: string
          chapter?: number
          color?: string | null
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          audiospeed: number | null
          created_at: string | null
          fontsize: string | null
          hideversenumbers: boolean | null
          id: string
          letterspacing: string | null
          linespacing: string | null
          studymode: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audiospeed?: number | null
          created_at?: string | null
          fontsize?: string | null
          hideversenumbers?: boolean | null
          id?: string
          letterspacing?: string | null
          linespacing?: string | null
          studymode?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audiospeed?: number | null
          created_at?: string | null
          fontsize?: string | null
          hideversenumbers?: boolean | null
          id?: string
          letterspacing?: string | null
          linespacing?: string | null
          studymode?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          audio_settings: Json | null
          created_at: string | null
          font_size: string | null
          highlight_preferences: Json | null
          id: string
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_settings?: Json | null
          created_at?: string | null
          font_size?: string | null
          highlight_preferences?: Json | null
          id?: string
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_settings?: Json | null
          created_at?: string | null
          font_size?: string | null
          highlight_preferences?: Json | null
          id?: string
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      "websters-1828": {
        Row: {
          definition: string | null
          word: string | null
        }
        Insert: {
          definition?: string | null
          word?: string | null
        }
        Update: {
          definition?: string | null
          word?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apple_subscription_webhook: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      denomination_status: "pending" | "approved" | "not_approved"
      status: "pending" | "approved" | "not_approved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      denomination_status: ["pending", "approved", "not_approved"],
      status: ["pending", "approved", "not_approved"],
    },
  },
} as const
