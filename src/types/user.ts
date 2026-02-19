// User profile and action types

export interface UserProfile {
  id: string;
  genre_preferences: string[];
  prefers_spicy: boolean | null; // null = no preference
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Note: Email accessed via Supabase auth.users, not stored in profile

export interface UserMatch {
  id: string;
  user_id: string;
  character_id: string;
  created_at: string;
}

export interface UserPass {
  id: string;
  user_id: string;
  character_id: string;
  created_at: string;
}

export interface UserReadBook {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
}
