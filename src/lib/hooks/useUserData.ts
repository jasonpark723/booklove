// User data operations hook (matches, passes, read books)

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import type { UserMatch, UserPass, UserReadBook, CharacterWithBook } from '@/types';

interface UseUserDataReturn {
  matches: UserMatch[];
  passes: UserPass[];
  readBooks: UserReadBook[];
  matchedCharacters: CharacterWithBook[];
  isLoading: boolean;
  error: string | null;
  addMatch: (characterId: string) => Promise<void>;
  addPass: (characterId: string) => Promise<void>;
  markBookAsRead: (bookId: string) => Promise<void>;
  removeMatch: (characterId: string) => Promise<void>;
  removePass: (characterId: string) => Promise<void>;
  unmarkBookAsRead: (bookId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useUserData(): UseUserDataReturn {
  const { user } = useAuth();
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [passes, setPasses] = useState<UserPass[]>([]);
  const [readBooks, setReadBooks] = useState<UserReadBook[]>([]);
  const [matchedCharacters, setMatchedCharacters] = useState<CharacterWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setMatches([]);
      setPasses([]);
      setReadBooks([]);
      setMatchedCharacters([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all user data in parallel
      const [matchesRes, passesRes, readBooksRes] = await Promise.all([
        supabase
          .from('user_matches')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_passes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_read_books')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (matchesRes.error) throw matchesRes.error;
      if (passesRes.error) throw passesRes.error;
      if (readBooksRes.error) throw readBooksRes.error;

      setMatches((matchesRes.data || []) as UserMatch[]);
      setPasses((passesRes.data || []) as UserPass[]);
      setReadBooks((readBooksRes.data || []) as UserReadBook[]);

      // Fetch matched characters with book data
      if (matchesRes.data && matchesRes.data.length > 0) {
        const characterIds = matchesRes.data.map((m) => m.character_id);
        const { data: charactersData, error: charactersError } = await supabase
          .from('characters')
          .select(`
            *,
            book:books(*)
          `)
          .in('id', characterIds);

        if (charactersError) throw charactersError;
        setMatchedCharacters((charactersData || []) as unknown as CharacterWithBook[]);
      } else {
        setMatchedCharacters([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user data';
      setError(message);
      console.error('Error fetching user data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const addMatch = useCallback(async (characterId: string) => {
    if (!user) return;

    try {
      const { data, error: insertError } = await supabase
        .from('user_matches')
        .insert({ user_id: user.id, character_id: characterId })
        .select()
        .single();

      if (insertError) {
        // Ignore duplicate error (already matched)
        if (insertError.code === '23505') return;
        throw insertError;
      }

      setMatches((prev) => [data as UserMatch, ...prev]);

      // Fetch the matched character
      const { data: charData } = await supabase
        .from('characters')
        .select(`*, book:books(*)`)
        .eq('id', characterId)
        .single();

      if (charData) {
        setMatchedCharacters((prev) => [charData as unknown as CharacterWithBook, ...prev]);
      }
    } catch (err) {
      console.error('Error adding match:', err);
      throw err;
    }
  }, [user]);

  const addPass = useCallback(async (characterId: string) => {
    if (!user) return;

    try {
      const { data, error: insertError } = await supabase
        .from('user_passes')
        .insert({ user_id: user.id, character_id: characterId })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') return;
        throw insertError;
      }

      setPasses((prev) => [data as UserPass, ...prev]);
    } catch (err) {
      console.error('Error adding pass:', err);
      throw err;
    }
  }, [user]);

  const markBookAsRead = useCallback(async (bookId: string) => {
    if (!user) return;

    try {
      const { data, error: insertError } = await supabase
        .from('user_read_books')
        .insert({ user_id: user.id, book_id: bookId })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') return;
        throw insertError;
      }

      setReadBooks((prev) => [data as UserReadBook, ...prev]);
    } catch (err) {
      console.error('Error marking book as read:', err);
      throw err;
    }
  }, [user]);

  const removeMatch = useCallback(async (characterId: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('user_matches')
        .delete()
        .eq('user_id', user.id)
        .eq('character_id', characterId);

      if (deleteError) throw deleteError;

      setMatches((prev) => prev.filter((m) => m.character_id !== characterId));
      setMatchedCharacters((prev) => prev.filter((c) => c.id !== characterId));
    } catch (err) {
      console.error('Error removing match:', err);
      throw err;
    }
  }, [user]);

  const removePass = useCallback(async (characterId: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('user_passes')
        .delete()
        .eq('user_id', user.id)
        .eq('character_id', characterId);

      if (deleteError) throw deleteError;

      setPasses((prev) => prev.filter((p) => p.character_id !== characterId));
    } catch (err) {
      console.error('Error removing pass:', err);
      throw err;
    }
  }, [user]);

  const unmarkBookAsRead = useCallback(async (bookId: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('user_read_books')
        .delete()
        .eq('user_id', user.id)
        .eq('book_id', bookId);

      if (deleteError) throw deleteError;

      setReadBooks((prev) => prev.filter((r) => r.book_id !== bookId));
    } catch (err) {
      console.error('Error unmarking book as read:', err);
      throw err;
    }
  }, [user]);

  return {
    matches,
    passes,
    readBooks,
    matchedCharacters,
    isLoading,
    error,
    addMatch,
    addPass,
    markBookAsRead,
    removeMatch,
    removePass,
    unmarkBookAsRead,
    refetch: fetchUserData,
  };
}

// Helper hook to get IDs for exclusion in queries
export function useExcludedIds() {
  const { matches, passes } = useUserData();

  const excludedCharacterIds = [
    ...matches.map((m) => m.character_id),
    ...passes.map((p) => p.character_id),
  ];

  return {
    excludedCharacterIds,
    matchedIds: matches.map((m) => m.character_id),
    passedIds: passes.map((p) => p.character_id),
  };
}
