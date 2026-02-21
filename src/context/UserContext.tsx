'use client';

// Unified user context for both guest and authenticated users

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGuestState } from '@/lib/hooks/useGuestState';
import { clearGuestState, getGuestState } from '@/lib/guestState';
import type { GuestState } from '@/types/guest';
import type { CharacterWithBook } from '@/types';

interface UserContextValue {
  // User state
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  isNewVisitor: boolean;

  // Unified data (from guest state or database)
  matchedCharacterIds: string[];
  passedCharacterIds: string[];
  readBookIds: string[];
  genrePreferences: string[];
  prefersSpicy: boolean | null;
  currentCharacterId: string | null;

  // Actions
  addMatch: (characterId: string, nextCharacterId?: string | null) => Promise<void>;
  addPass: (characterId: string, nextCharacterId?: string | null) => Promise<void>;
  markBookAsRead: (bookId: string) => Promise<void>;
  unmarkBookAsRead: (bookId: string) => Promise<void>;
  removeMatch: (characterId: string) => Promise<void>;
  removePass: (characterId: string) => Promise<void>;
  resetPasses: () => Promise<void>;
  setPreferences: (genres: string[], prefersSpicy: boolean | null) => Promise<void>;
  setCurrentCharacter: (characterId: string | null) => void;

  // Signup prompt
  shouldShowSignupPrompt: boolean;
  dismissSignupPrompt: () => void;

  // Auth actions
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading, signOut: authSignOut, profile } = useAuth();
  const {
    guestState,
    isLoading: guestLoading,
    isNewVisitor,
    addMatch: guestAddMatch,
    addPass: guestAddPass,
    markBookAsRead: guestMarkRead,
    unmarkBookAsRead: guestUnmarkRead,
    removeMatch: guestRemoveMatch,
    removePass: guestRemovePass,
    resetPasses: guestReset,
    dismissSignupPrompt: guestDismissPrompt,
    setPreferences: guestSetPreferences,
    setCurrentCharacter: guestSetCurrentCharacter,
    matchedCharacterIds: guestMatchedIds,
    passedCharacterIds: guestPassedIds,
    readBookIds: guestReadIds,
    shouldShowSignupPrompt: guestShowPrompt,
  } = useGuestState();

  // Database state for authenticated users
  const [dbMatches, setDbMatches] = useState<string[]>([]);
  const [dbPasses, setDbPasses] = useState<string[]>([]);
  const [dbReadBooks, setDbReadBooks] = useState<string[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  const isGuest = !user;
  const isLoading = authLoading || guestLoading || dbLoading;

  // Fetch database data for authenticated users
  useEffect(() => {
    if (!user) {
      setDbMatches([]);
      setDbPasses([]);
      setDbReadBooks([]);
      return;
    }

    const fetchUserData = async () => {
      setDbLoading(true);
      try {
        const [matchesRes, passesRes, readBooksRes] = await Promise.all([
          supabase
            .from('user_matches')
            .select('character_id')
            .eq('user_id', user.id),
          supabase
            .from('user_passes')
            .select('character_id')
            .eq('user_id', user.id),
          supabase
            .from('user_read_books')
            .select('book_id')
            .eq('user_id', user.id),
        ]);

        setDbMatches(matchesRes.data?.map((m) => m.character_id) ?? []);
        setDbPasses(passesRes.data?.map((p) => p.character_id) ?? []);
        setDbReadBooks(readBooksRes.data?.map((r) => r.book_id) ?? []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setDbLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Unified data
  const matchedCharacterIds = isGuest ? guestMatchedIds : dbMatches;
  const passedCharacterIds = isGuest ? guestPassedIds : dbPasses;
  const readBookIds = isGuest ? guestReadIds : dbReadBooks;
  const genrePreferences = isGuest
    ? guestState?.genrePreferences ?? []
    : profile?.genre_preferences ?? [];
  const prefersSpicy = isGuest
    ? guestState?.prefersSpicy ?? null
    : profile?.prefers_spicy ?? null;
  const currentCharacterId = guestState?.currentCharacterId ?? null;

  // Unified actions
  const addMatch = useCallback(
    async (characterId: string, nextCharacterId: string | null = null) => {
      if (isGuest) {
        guestAddMatch(characterId, nextCharacterId);
        return;
      }

      if (!user) return;

      try {
        await supabase
          .from('user_matches')
          .insert({ user_id: user.id, character_id: characterId });
        setDbMatches((prev) => [...prev, characterId]);
      } catch (error) {
        // Ignore duplicate errors
        if ((error as { code?: string }).code !== '23505') {
          console.error('Error adding match:', error);
        }
      }
    },
    [isGuest, user, guestAddMatch]
  );

  const addPass = useCallback(
    async (characterId: string, nextCharacterId: string | null = null) => {
      if (isGuest) {
        guestAddPass(characterId, nextCharacterId);
        return;
      }

      if (!user) return;

      try {
        await supabase
          .from('user_passes')
          .insert({ user_id: user.id, character_id: characterId });
        setDbPasses((prev) => [...prev, characterId]);
      } catch (error) {
        if ((error as { code?: string }).code !== '23505') {
          console.error('Error adding pass:', error);
        }
      }
    },
    [isGuest, user, guestAddPass]
  );

  const markBookAsRead = useCallback(
    async (bookId: string) => {
      if (isGuest) {
        guestMarkRead(bookId);
        return;
      }

      if (!user) return;

      try {
        await supabase
          .from('user_read_books')
          .insert({ user_id: user.id, book_id: bookId });
        setDbReadBooks((prev) => [...prev, bookId]);
      } catch (error) {
        if ((error as { code?: string }).code !== '23505') {
          console.error('Error marking book as read:', error);
        }
      }
    },
    [isGuest, user, guestMarkRead]
  );

  const unmarkBookAsRead = useCallback(
    async (bookId: string) => {
      if (isGuest) {
        guestUnmarkRead(bookId);
        return;
      }

      if (!user) return;

      try {
        await supabase
          .from('user_read_books')
          .delete()
          .eq('user_id', user.id)
          .eq('book_id', bookId);
        setDbReadBooks((prev) => prev.filter((id) => id !== bookId));
      } catch (error) {
        console.error('Error unmarking book as read:', error);
      }
    },
    [isGuest, user, guestUnmarkRead]
  );

  const removeMatch = useCallback(
    async (characterId: string) => {
      if (isGuest) {
        guestRemoveMatch(characterId);
        return;
      }

      if (!user) return;

      try {
        await supabase
          .from('user_matches')
          .delete()
          .eq('user_id', user.id)
          .eq('character_id', characterId);
        setDbMatches((prev) => prev.filter((id) => id !== characterId));
      } catch (error) {
        console.error('Error removing match:', error);
      }
    },
    [isGuest, user, guestRemoveMatch]
  );

  const removePass = useCallback(
    async (characterId: string) => {
      if (isGuest) {
        guestRemovePass(characterId);
        return;
      }

      if (!user) return;

      try {
        await supabase
          .from('user_passes')
          .delete()
          .eq('user_id', user.id)
          .eq('character_id', characterId);
        setDbPasses((prev) => prev.filter((id) => id !== characterId));
      } catch (error) {
        console.error('Error removing pass:', error);
      }
    },
    [isGuest, user, guestRemovePass]
  );

  const resetPasses = useCallback(async () => {
    if (isGuest) {
      guestReset();
      return;
    }

    if (!user) return;

    try {
      await supabase.from('user_passes').delete().eq('user_id', user.id);
      setDbPasses([]);
    } catch (error) {
      console.error('Error resetting passes:', error);
    }
  }, [isGuest, user, guestReset]);

  const setPreferences = useCallback(
    async (genres: string[], prefersSpicy: boolean | null) => {
      if (isGuest) {
        guestSetPreferences(genres, prefersSpicy);
        return;
      }

      if (!user) return;

      try {
        await supabase
          .from('user_profiles')
          .update({ genre_preferences: genres, prefers_spicy: prefersSpicy })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error setting preferences:', error);
      }
    },
    [isGuest, user, guestSetPreferences]
  );

  const setCurrentCharacter = useCallback(
    (characterId: string | null) => {
      guestSetCurrentCharacter(characterId);
    },
    [guestSetCurrentCharacter]
  );

  const dismissSignupPrompt = useCallback(() => {
    guestDismissPrompt();
  }, [guestDismissPrompt]);

  const signOut = useCallback(async () => {
    await authSignOut();
  }, [authSignOut]);

  // Only show signup prompt for guests
  const shouldShowSignupPrompt = isGuest && guestShowPrompt;

  const value: UserContextValue = {
    user,
    isGuest,
    isLoading,
    isNewVisitor,
    matchedCharacterIds,
    passedCharacterIds,
    readBookIds,
    genrePreferences,
    prefersSpicy,
    currentCharacterId,
    addMatch,
    addPass,
    markBookAsRead,
    unmarkBookAsRead,
    removeMatch,
    removePass,
    resetPasses,
    setPreferences,
    setCurrentCharacter,
    shouldShowSignupPrompt,
    dismissSignupPrompt,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Migration helper: Call this after successful signup to migrate guest data
export async function migrateGuestToUser(userId: string): Promise<void> {
  const guestState = getGuestState();
  if (!guestState) return;

  try {
    // Update user profile preferences
    await supabase
      .from('user_profiles')
      .update({
        genre_preferences: guestState.genrePreferences,
        prefers_spicy: guestState.prefersSpicy,
      })
      .eq('id', userId);

    // Bulk insert matches (ignore conflicts)
    if (guestState.matchedCharacterIds.length > 0) {
      await supabase.from('user_matches').upsert(
        guestState.matchedCharacterIds.map((id) => ({
          user_id: userId,
          character_id: id,
        })),
        { onConflict: 'user_id,character_id' }
      );
    }

    // Bulk insert passes (ignore conflicts)
    if (guestState.passedCharacterIds.length > 0) {
      await supabase.from('user_passes').upsert(
        guestState.passedCharacterIds.map((id) => ({
          user_id: userId,
          character_id: id,
        })),
        { onConflict: 'user_id,character_id' }
      );
    }

    // Bulk insert read books (ignore conflicts)
    if (guestState.readBookIds.length > 0) {
      await supabase.from('user_read_books').upsert(
        guestState.readBookIds.map((id) => ({
          user_id: userId,
          book_id: id,
        })),
        { onConflict: 'user_id,book_id' }
      );
    }

    // Clear localStorage after successful migration
    clearGuestState();
  } catch (error) {
    console.error('Error migrating guest data:', error);
    // Don't clear localStorage if migration failed - user can retry
    throw error;
  }
}
