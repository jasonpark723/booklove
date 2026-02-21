// Guest state localStorage management utilities

import { GuestState, GUEST_STORAGE_KEY, createInitialGuestState } from '@/types/guest';

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

// Validate guest state structure
function isValidGuestState(state: unknown): state is GuestState {
  if (!state || typeof state !== 'object') return false;
  const s = state as Record<string, unknown>;
  return (
    typeof s.visitorId === 'string' &&
    Array.isArray(s.matchedCharacterIds) &&
    Array.isArray(s.passedCharacterIds)
  );
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
        // Migrate older state that may be missing signupPromptDismissed
        if (typeof parsed.signupPromptDismissed !== 'boolean') {
          parsed.signupPromptDismissed = false;
        }
        return parsed;
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
      return parsed;
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
    state.matchedCharacterIds.length > 0 || state.passedCharacterIds.length > 0;
  const canResume = state.currentCharacterId !== null;

  return { isReturning: true, hasData, canResume };
}

// Check if signup prompt should be shown
export function shouldShowSignupPrompt(): boolean {
  const state = getGuestState();
  if (!state) return false;
  return state.matchedCharacterIds.length === 3 && !state.signupPromptDismissed;
}

// Action handlers

export function handleMatch(
  characterId: string,
  nextCharacterId: string | null
): GuestState | null {
  const state = initGuestState();
  if (!state) return null;

  // Don't add duplicates
  if (state.matchedCharacterIds.includes(characterId)) {
    return updateGuestState({ currentCharacterId: nextCharacterId });
  }

  return updateGuestState({
    matchedCharacterIds: [...state.matchedCharacterIds, characterId],
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
    matchedCharacterIds: state.matchedCharacterIds.filter((id) => id !== characterId),
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
