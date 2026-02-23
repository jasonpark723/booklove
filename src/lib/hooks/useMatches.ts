// Hook for fetching matched characters with full details

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/context/UserContext';
import type { CharacterWithBook } from '@/types';

export interface MatchWithCharacter {
  characterId: string;
  character: CharacterWithBook;
  matchedAt: string | null;
  isRead: boolean;
}

interface UseMatchesReturn {
  matches: MatchWithCharacter[];
  isLoading: boolean;
  error: string | null;
  hasUnread: boolean;
  markAsRead: (characterId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useMatches(): UseMatchesReturn {
  const { matches: userMatches, markMatchAsRead, isLoading: userLoading } = useUser();
  const [matchesWithCharacters, setMatchesWithCharacters] = useState<MatchWithCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacterDetails = useCallback(async () => {
    if (userLoading) return;

    if (userMatches.length === 0) {
      setMatchesWithCharacters([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const characterIds = userMatches.map((m) => m.characterId);

      const { data, error: fetchError } = await supabase
        .from('characters')
        .select(`
          *,
          book:books(*)
        `)
        .in('id', characterIds)
        .eq('is_deleted', false);

      if (fetchError) throw fetchError;

      // Create a map for quick lookup
      const characterMap = new Map(
        (data || []).map((c) => [c.id, c as unknown as CharacterWithBook])
      );

      // Build matches with character details, filtering out deleted characters
      const matchesWithData: MatchWithCharacter[] = userMatches
        .map((match) => {
          const character = characterMap.get(match.characterId);
          if (!character) return null;

          return {
            characterId: match.characterId,
            character,
            matchedAt: match.matchedAt,
            isRead: match.isRead,
          };
        })
        .filter((m): m is MatchWithCharacter => m !== null);

      // Sort by matchedAt (most recent first), null values go to bottom
      matchesWithData.sort((a, b) => {
        if (!a.matchedAt && !b.matchedAt) return 0;
        if (!a.matchedAt) return 1;
        if (!b.matchedAt) return -1;
        return new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime();
      });

      setMatchesWithCharacters(matchesWithData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch match details';
      setError(message);
      console.error('Error fetching match details:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userMatches, userLoading]);

  useEffect(() => {
    fetchCharacterDetails();
  }, [fetchCharacterDetails]);

  const hasUnread = matchesWithCharacters.some((m) => !m.isRead);

  const markAsRead = useCallback(
    async (characterId: string) => {
      await markMatchAsRead(characterId);
      // Optimistically update local state
      setMatchesWithCharacters((prev) =>
        prev.map((m) =>
          m.characterId === characterId ? { ...m, isRead: true } : m
        )
      );
    },
    [markMatchAsRead]
  );

  return {
    matches: matchesWithCharacters,
    isLoading: isLoading || userLoading,
    error,
    hasUnread,
    markAsRead,
    refetch: fetchCharacterDetails,
  };
}
