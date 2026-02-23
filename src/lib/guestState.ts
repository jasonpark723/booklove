// Guest state localStorage management utilities

import { GuestState, GuestMatch, GUEST_STORAGE_KEY, createInitialGuestState } from '@/types/guest';

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Validate guest state structure (supports both old and new format)
function isValidGuestState(state: unknown): boolean {
  if (!state || typeof state !== 'object') return false;
  const s = state as Record<string, unknown>;
  // Valid if it has visitorId and either matches array or matchedCharacterIds array
  return (
    typeof s.visitorId === 'string' &&
    (Array.isArray(s.matches) || Array.isArray(s.matchedCharacterIds)) &&
    Array.isArray(s.passedCharacterIds)
  );
}

// Migrate old matchedCharacterIds format to new matches format
function migrateGuestState(state: Record<string, unknown>): GuestState {
  // If already has matches array, just ensure proper types
  if (Array.isArray(state.matches)) {
    return state as unknown as GuestState;
  }

  // Migrate from old matchedCharacterIds format
  const oldMatches = (state.matchedCharacterIds as string[]) || [];
  const newMatches: GuestMatch[] = oldMatches.map((characterId) => ({
    characterId,
    matchedAt: null, // null indicates migrated match
    isRead: true, // Mark existing matches as read
  }));

  return {
    visitorId: state.visitorId as string,
    genrePreferences: (state.genrePreferences as string[]) || [],
    prefersSpicy: (state.prefersSpicy as boolean | null) ?? null,
    matches: newMatches,
    passedCharacterIds: (state.passedCharacterIds as string[]) || [],
    readBookIds: (state.readBookIds as string[]) || [],
    currentCharacterId: (state.currentCharacterId as string | null) ?? null,
    lastVisit: (state.lastVisit as string) || new Date().toISOString(),
    signupPromptDismissed: (state.signupPromptDismissed as boolean) ?? false,
  };
}

// Initialize or retrieve guest state
export function initGuestState(): GuestState | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  const existing = localStorage.getItem(GUEST_STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (isValidGuestState(parsed)) {
        // Migrate to new format and handle missing fields
        const migrated = migrateGuestState(parsed);
        if (typeof migrated.signupPromptDismissed !== 'boolean') {
          migrated.signupPromptDismissed = false;
        }
        // Save migrated state back to localStorage
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    } catch {
      // Corrupted data, will create fresh state
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
  }

  // Create new guest state
  const newState = createInitialGuestState(crypto.randomUUID());
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newState));
  return newState;
}

// Get guest state without creating new one
export function getGuestState(): GuestState | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  const existing = localStorage.getItem(GUEST_STORAGE_KEY);
  if (!existing) return null;

  try {
    const parsed = JSON.parse(existing);
    if (isValidGuestState(parsed)) {
      return migrateGuestState(parsed);
    }
  } catch {
    // Corrupted data
  }

  return null;
}

// Update guest state with partial updates
export function updateGuestState(updates: Partial<GuestState>): GuestState | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  const current = initGuestState();
  if (!current) return null;

  const updated: GuestState = {
    ...current,
    ...updates,
    lastVisit: new Date().toISOString(),
  };

  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Clear guest state (for migration or logout)
export function clearGuestState(): void {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(GUEST_STORAGE_KEY);
  }
}

// Check if this is a returning visitor
export function checkReturnVisit(): {
  isReturning: boolean;
  hasData: boolean;
  canResume: boolean;
} {
  const state = getGuestState();
  if (!state) {
    return { isReturning: false, hasData: false, canResume: false };
  }

  const hasData =
    state.matches.length > 0 || state.passedCharacterIds.length > 0;
  const canResume = state.currentCharacterId !== null;

  return { isReturning: true, hasData, canResume };
}

// Check if signup prompt should be shown
export function shouldShowSignupPrompt(): boolean {
  const state = getGuestState();
  if (!state) return false;
  return state.matches.length === 3 && !state.signupPromptDismissed;
}

// Action handlers

export function handleMatch(
  characterId: string,
  nextCharacterId: string | null
): GuestState | null {
  const state = initGuestState();
  if (!state) return null;

  // Don't add duplicates
  const existingMatch = state.matches.find((m) => m.characterId === characterId);
  if (existingMatch) {
    return updateGuestState({ currentCharacterId: nextCharacterId });
  }

  const newMatch: GuestMatch = {
    characterId,
    matchedAt: new Date().toISOString(),
    isRead: false,
  };

  return updateGuestState({
    matches: [...state.matches, newMatch],
    currentCharacterId: nextCharacterId,
  });
}

export function handlePass(
  characterId: string,
  nextCharacterId: string | null
): GuestState | null {
  const state = initGuestState();
  if (!state) return null;

  // Don't add duplicates
  if (state.passedCharacterIds.includes(characterId)) {
    return updateGuestState({ currentCharacterId: nextCharacterId });
  }

  return updateGuestState({
    passedCharacterIds: [...state.passedCharacterIds, characterId],
    currentCharacterId: nextCharacterId,
  });
}

export function handleMarkRead(bookId: string): GuestState | null {
  const state = initGuestState();
  if (!state) return null;

  // Don't add duplicates
  if (state.readBookIds.includes(bookId)) {
    return state;
  }

  return updateGuestState({
    readBookIds: [...state.readBookIds, bookId],
  });
}

export function handleUnmarkRead(bookId: string): GuestState | null {
  const state = initGuestState();
  if (!state) return null;

  return updateGuestState({
    readBookIds: state.readBookIds.filter((id) => id !== bookId),
  });
}

export function handleRemoveMatch(characterId: string): GuestState | null {
  const state = initGuestState();
  if (!state) return null;

  return updateGuestState({
    matches: state.matches.filter((m) => m.characterId !== characterId),
  });
}

export function handleRemovePass(characterId: string): GuestState | null {
  const state = initGuestState();
  if (!state) return null;

  return updateGuestState({
    passedCharacterIds: state.passedCharacterIds.filter((id) => id !== characterId),
  });
}

export function handleReset(): GuestState | null {
  return updateGuestState({
    passedCharacterIds: [],
    currentCharacterId: null,
  });
}

export function handleResetAll(): GuestState | null {
  return updateGuestState({
    matches: [],
    passedCharacterIds: [],
    currentCharacterId: null,
  });
}

export function handleMarkMatchAsRead(characterId: string): GuestState | null {
  const state = initGuestState();
  if (!state) return null;

  const updatedMatches = state.matches.map((m) =>
    m.characterId === characterId ? { ...m, isRead: true } : m
  );

  return updateGuestState({
    matches: updatedMatches,
  });
}

export function handleDismissSignupPrompt(): GuestState | null {
  return updateGuestState({
    signupPromptDismissed: true,
  });
}

export function handleSetPreferences(
  genrePreferences: string[],
  prefersSpicy: boolean | null
): GuestState | null {
  return updateGuestState({
    genrePreferences,
    prefersSpicy,
  });
}
