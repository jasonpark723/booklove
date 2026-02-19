// Reusable Supabase query functions

import { supabase } from './client';
import type { Book, Character, CharacterWithBook } from '@/types';

export interface GetCharactersOptions {
  limit?: number;
  offset?: number;
  excludeIds?: string[];
  excludeBookIds?: string[];
  genre?: string;
  prefersSpicy?: boolean | null;
}

/**
 * Fetch published characters with their book data
 */
export async function getPublishedCharacters(
  options: GetCharactersOptions = {}
): Promise<CharacterWithBook[]> {
  const {
    limit = 10,
    offset = 0,
    excludeIds = [],
    excludeBookIds = [],
    genre,
  } = options;

  let query = supabase
    .from('characters')
    .select(`
      *,
      book:books!inner(*)
    `)
    .eq('is_published', true)
    .eq('books.is_published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Exclude already-seen characters
  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  // Exclude characters from read books
  if (excludeBookIds.length > 0) {
    query = query.not('book_id', 'in', `(${excludeBookIds.join(',')})`);
  }

  // Filter by genre
  if (genre) {
    query = query.eq('books.genre', genre);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch characters: ${error.message}`);
  }

  return (data || []) as unknown as CharacterWithBook[];
}

/**
 * Fetch a single character by ID with book data
 */
export async function getCharacterById(
  id: string
): Promise<CharacterWithBook | null> {
  const { data, error } = await supabase
    .from('characters')
    .select(`
      *,
      book:books(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch character: ${error.message}`);
  }

  return data as unknown as CharacterWithBook;
}

/**
 * Fetch a single book by ID
 */
export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch book: ${error.message}`);
  }

  return data as Book;
}

/**
 * Fetch all published books
 */
export async function getPublishedBooks(options: {
  limit?: number;
  offset?: number;
  genre?: string;
} = {}): Promise<Book[]> {
  const { limit = 50, offset = 0, genre } = options;

  let query = supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('title')
    .range(offset, offset + limit - 1);

  if (genre) {
    query = query.eq('genre', genre);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch books: ${error.message}`);
  }

  return (data || []) as Book[];
}

/**
 * Fetch characters for a specific book
 */
export async function getCharactersByBookId(
  bookId: string
): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('book_id', bookId)
    .eq('is_published', true)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch characters: ${error.message}`);
  }

  return (data || []) as unknown as Character[];
}

/**
 * Count total published characters (for pagination)
 */
export async function countPublishedCharacters(options: {
  excludeIds?: string[];
  excludeBookIds?: string[];
  genre?: string;
} = {}): Promise<number> {
  const { excludeIds = [], excludeBookIds = [], genre } = options;

  let query = supabase
    .from('characters')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  if (excludeBookIds.length > 0) {
    query = query.not('book_id', 'in', `(${excludeBookIds.join(',')})`);
  }

  if (genre) {
    // Note: This requires a join which changes the query structure
    // For now, we'll do a simpler count without genre filter at the DB level
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Failed to count characters: ${error.message}`);
  }

  return count || 0;
}
