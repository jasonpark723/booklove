// Guest state types (localStorage)

export interface GuestState {
  visitorId: string;
  genrePreferences: string[];
  prefersSpicy: boolean | null;
  matchedCharacterIds: string[];
  passedCharacterIds: string[];
  readBookIds: string[];
  currentCharacterId: string | null; // For resume functionality
  lastVisit: string;
}

export const GUEST_STORAGE_KEY = 'booklove_guest';

// Helper to create initial guest state
export function createInitialGuestState(visitorId: string): GuestState {
  return {
    visitorId,
    genrePreferences: [],
    prefersSpicy: null,
    matchedCharacterIds: [],
    passedCharacterIds: [],
    readBookIds: [],
    currentCharacterId: null,
    lastVisit: new Date().toISOString(),
  };
}
