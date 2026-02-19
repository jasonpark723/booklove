// Re-export database types
export type { Database, Json } from '@/lib/supabase/types';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Book types
export type { Book, BookFormData, SpiceLevel, Genre, Tag } from './book';
export { SPICE_LABELS, SPICE_DESCRIPTIONS, GENRES } from './book';

// Character types
export type {
  Character,
  CharacterWithBook,
  CharacterFormData,
  CharacterPrompt,
  Gender,
} from './character';

// User types
export type {
  UserProfile,
  UserMatch,
  UserPass,
  UserReadBook,
} from './user';

// Guest types
export type { GuestState } from './guest';
export { GUEST_STORAGE_KEY, createInitialGuestState } from './guest';

// Matching types
export type {
  UserPreferences,
  MatchingConfig,
  CharacterBatchResponse,
  ApiError,
} from './matching';
export { DEFAULT_MATCHING_CONFIG } from './matching';
