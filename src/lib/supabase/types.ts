// Database types - matches the schema defined in migrations
// For production, regenerate with: npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          description: string | null
          cover_image_url: string | null
          amazon_affiliate_link: string | null
          genre: string
          tags: string[]
          spice_level: number
          mature_themes: boolean
          series_name: string | null
          series_order: number | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          description?: string | null
          cover_image_url?: string | null
          amazon_affiliate_link?: string | null
          genre?: string
          tags?: string[]
          spice_level?: number
          mature_themes?: boolean
          series_name?: string | null
          series_order?: number | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          description?: string | null
          cover_image_url?: string | null
          amazon_affiliate_link?: string | null
          genre?: string
          tags?: string[]
          spice_level?: number
          mature_themes?: boolean
          series_name?: string | null
          series_order?: number | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          id: string
          book_id: string
          name: string
          gender: string
          traits: string[]
          hobbies: string[]
          occupation: string | null
          prompts: Json
          images: Json
          is_published: boolean
          is_deleted: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          name: string
          gender?: string
          traits?: string[]
          hobbies?: string[]
          occupation?: string | null
          prompts?: Json
          images?: Json
          is_published?: boolean
          is_deleted?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          name?: string
          gender?: string
          traits?: string[]
          hobbies?: string[]
          occupation?: string | null
          prompts?: Json
          images?: Json
          is_published?: boolean
          is_deleted?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_book_id_fkey"
            columns: ["book_id"]
            referencedRelation: "books"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          genre_preferences: string[]
          prefers_spicy: boolean | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          genre_preferences?: string[]
          prefers_spicy?: boolean | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          genre_preferences?: string[]
          prefers_spicy?: boolean | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_matches: {
        Row: {
          id: string
          user_id: string
          character_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          character_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_matches_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_matches_character_id_fkey"
            columns: ["character_id"]
            referencedRelation: "characters"
            referencedColumns: ["id"]
          }
        ]
      }
      user_passes: {
        Row: {
          id: string
          user_id: string
          character_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          character_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          character_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_passes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_passes_character_id_fkey"
            columns: ["character_id"]
            referencedRelation: "characters"
            referencedColumns: ["id"]
          }
        ]
      }
      user_read_books: {
        Row: {
          id: string
          user_id: string
          book_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_read_books_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_read_books_book_id_fkey"
            columns: ["book_id"]
            referencedRelation: "books"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for accessing table rows
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
