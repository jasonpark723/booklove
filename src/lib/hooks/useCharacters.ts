// Character data operations hook

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  getPublishedCharacters,
  getCharacterById,
  type GetCharactersOptions,
} from '@/lib/supabase/queries';
import type { Character, CharacterWithBook } from '@/types';
import type { InsertTables, UpdateTables } from '@/lib/supabase/types';

interface UseCharactersOptions {
  excludeIds?: string[];
  excludeBookIds?: string[];
  genre?: string;
  prefersSpicy?: boolean | null;
  limit?: number;
}

interface UseCharactersReturn {
  characters: CharacterWithBook[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useCharacters(options: UseCharactersOptions = {}): UseCharactersReturn {
  const {
    excludeIds = [],
    excludeBookIds = [],
    genre,
    prefersSpicy,
    limit = 10,
  } = options;

  const [characters, setCharacters] = useState<CharacterWithBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchCharacters = useCallback(async (reset = false) => {
    setIsLoading(true);
    setError(null);

    const currentOffset = reset ? 0 : offset;

    try {
      const queryOptions: GetCharactersOptions = {
        limit,
        offset: currentOffset,
        excludeIds,
        excludeBookIds,
        genre,
        prefersSpicy,
      };

      const data = await getPublishedCharacters(queryOptions);

      if (reset) {
        setCharacters(data);
        setOffset(limit);
      } else {
        setCharacters((prev) => [...prev, ...data]);
        setOffset((prev) => prev + limit);
      }

      setHasMore(data.length === limit);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch characters';
      setError(message);
      console.error('Error fetching characters:', err);
    } finally {
      setIsLoading(false);
    }
  }, [excludeIds, excludeBookIds, genre, prefersSpicy, limit, offset]);

  const refetch = useCallback(async () => {
    setOffset(0);
    await fetchCharacters(true);
  }, [fetchCharacters]);

  const fetchMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchCharacters(false);
    }
  }, [isLoading, hasMore, fetchCharacters]);

  useEffect(() => {
    fetchCharacters(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeIds.length, excludeBookIds.length, genre, prefersSpicy, limit]);

  return {
    characters,
    isLoading,
    error,
    hasMore,
    fetchMore,
    refetch,
  };
}

interface UseCharacterReturn {
  character: CharacterWithBook | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCharacter(id: string | null): UseCharacterReturn {
  const [character, setCharacter] = useState<CharacterWithBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacter = useCallback(async () => {
    if (!id) {
      setCharacter(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getCharacterById(id);
      setCharacter(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch character';
      setError(message);
      console.error('Error fetching character:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);

  return {
    character,
    isLoading,
    error,
    refetch: fetchCharacter,
  };
}

// Admin functions for character management
export function useCharacterAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCharacter = useCallback(async (characterData: InsertTables<'characters'>): Promise<Character | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('characters')
        .insert(characterData)
        .select()
        .single();

      if (insertError) throw insertError;
      return data as unknown as Character;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create character';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCharacter = useCallback(async (id: string, updates: UpdateTables<'characters'>): Promise<Character | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data as unknown as Character;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update character';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCharacter = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete character';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createCharacter,
    updateCharacter,
    deleteCharacter,
    isLoading,
    error,
  };
}
