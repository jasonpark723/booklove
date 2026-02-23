// Guest state types (localStorage)

export interface GuestMatch {
  characterId: string;
  matchedAt: string | null; // null for migrated matches
  isRead: boolean;
}

export interface GuestState {
  visitorId: string;
  genrePreferences: string[];
  prefersSpicy: boolean | null;
  matches: GuestMatch[];
  passedCharacterIds: string[];
  readBookIds: string[];
  currentCharacterId: string | null; // For resume functionality
  lastVisit: string;
  signupPromptDismissed: boolean;
  // Legacy field - kept for backward compatibility during migration
  matchedCharacterIds?: string[];
}

export const GUEST_STORAGE_KEY = 'booklove_guest';

// Helper to create initial guest state
export function createInitialGuestState(visitorId: string): GuestState {
  return {
    visitorId,
    genrePreferences: [],
    prefersSpicy: null,
    matches: [],
    passedCharacterIds: [],
    readBookIds: [],
    currentCharacterId: null,
    lastVisit: new Date().toISOString(),
    signupPromptDismissed: false,
  };
}

// Helper to get matched character IDs from matches array
export function getMatchedCharacterIds(state: GuestState): string[] {
  return state.matches.map((m) => m.characterId);
}

// Helper to check if there are unread matches
export function hasUnreadMatches(state: GuestState): boolean {
  return state.matches.some((m) => !m.isRead);
}
