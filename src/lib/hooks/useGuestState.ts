// React hook for guest state management

import { useState, useEffect, useCallback } from 'react';
import { GuestState } from '@/types/guest';
import {
  initGuestState,
  getGuestState,
  updateGuestState,
  clearGuestState,
  handleMatch as guestHandleMatch,
  handlePass as guestHandlePass,
  handleMarkRead as guestHandleMarkRead,
  handleUnmarkRead as guestHandleUnmarkRead,
  handleRemoveMatch as guestHandleRemoveMatch,
  handleRemovePass as guestHandleRemovePass,
  handleReset as guestHandleReset,
  handleDismissSignupPrompt as guestHandleDismissSignupPrompt,
  handleSetPreferences as guestHandleSetPreferences,
} from '@/lib/guestState';

interface UseGuestStateReturn {
  guestState: GuestState | null;
  isLoading: boolean;
  isNewVisitor: boolean;
  // Actions
  addMatch: (characterId: string, nextCharacterId?: string | null) => void;
  addPass: (characterId: string, nextCharacterId?: string | null) => void;
  markBookAsRead: (bookId: string) => void;
  unmarkBookAsRead: (bookId: string) => void;
  removeMatch: (characterId: string) => void;
  removePass: (characterId: string) => void;
  resetPasses: () => void;
  dismissSignupPrompt: () => void;
  setPreferences: (genres: string[], prefersSpicy: boolean | null) => void;
  setCurrentCharacter: (characterId: string | null) => void;
  clearState: () => void;
  // Computed values
  matchedCharacterIds: string[];
  passedCharacterIds: string[];
  readBookIds: string[];
  shouldShowSignupPrompt: boolean;
}

export function useGuestState(): UseGuestStateReturn {
  const [guestState, setGuestState] = useState<GuestState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewVisitor, setIsNewVisitor] = useState(false);

  // Initialize on mount (client-side only)
  useEffect(() => {
    const existing = getGuestState();
    setIsNewVisitor(!existing);
    const state = initGuestState();
    setGuestState(state);
    setIsLoading(false);
  }, []);

  const addMatch = useCallback(
    (characterId: string, nextCharacterId: string | null = null) => {
      const updated = guestHandleMatch(characterId, nextCharacterId);
      if (updated) setGuestState(updated);
    },
    []
  );

  const addPass = useCallback(
    (characterId: string, nextCharacterId: string | null = null) => {
      const updated = guestHandlePass(characterId, nextCharacterId);
      if (updated) setGuestState(updated);
    },
    []
  );

  const markBookAsRead = useCallback((bookId: string) => {
    const updated = guestHandleMarkRead(bookId);
    if (updated) setGuestState(updated);
  }, []);

  const unmarkBookAsRead = useCallback((bookId: string) => {
    const updated = guestHandleUnmarkRead(bookId);
    if (updated) setGuestState(updated);
  }, []);

  const removeMatch = useCallback((characterId: string) => {
    const updated = guestHandleRemoveMatch(characterId);
    if (updated) setGuestState(updated);
  }, []);

  const removePass = useCallback((characterId: string) => {
    const updated = guestHandleRemovePass(characterId);
    if (updated) setGuestState(updated);
  }, []);

  const resetPasses = useCallback(() => {
    const updated = guestHandleReset();
    if (updated) setGuestState(updated);
  }, []);

  const dismissSignupPrompt = useCallback(() => {
    const updated = guestHandleDismissSignupPrompt();
    if (updated) setGuestState(updated);
  }, []);

  const setPreferences = useCallback(
    (genres: string[], prefersSpicy: boolean | null) => {
      const updated = guestHandleSetPreferences(genres, prefersSpicy);
      if (updated) setGuestState(updated);
    },
    []
  );

  const setCurrentCharacter = useCallback((characterId: string | null) => {
    const updated = updateGuestState({ currentCharacterId: characterId });
    if (updated) setGuestState(updated);
  }, []);

  const clearState = useCallback(() => {
    clearGuestState();
    setGuestState(null);
    setIsNewVisitor(true);
  }, []);

  // Computed values
  const matchedCharacterIds = guestState?.matchedCharacterIds ?? [];
  const passedCharacterIds = guestState?.passedCharacterIds ?? [];
  const readBookIds = guestState?.readBookIds ?? [];
  const shouldShowSignupPrompt =
    matchedCharacterIds.length === 3 && !guestState?.signupPromptDismissed;

  return {
    guestState,
    isLoading,
    isNewVisitor,
    addMatch,
    addPass,
    markBookAsRead,
    unmarkBookAsRead,
    removeMatch,
    removePass,
    resetPasses,
    dismissSignupPrompt,
    setPreferences,
    setCurrentCharacter,
    clearState,
    matchedCharacterIds,
    passedCharacterIds,
    readBookIds,
    shouldShowSignupPrompt,
  };
}
