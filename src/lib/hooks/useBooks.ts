// Book data operations hook

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getPublishedBooks, getBookById } from '@/lib/supabase/queries';
import type { Book } from '@/types';
import type { InsertTables, UpdateTables } from '@/lib/supabase/types';

interface UseBooksOptions {
  genre?: string;
  limit?: number;
}

interface UseBooksReturn {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBooks(options: UseBooksOptions = {}): UseBooksReturn {
  const { genre, limit = 50 } = options;
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPublishedBooks({ genre, limit });
      setBooks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch books';
      setError(message);
      console.error('Error fetching books:', err);
    } finally {
      setIsLoading(false);
    }
  }, [genre, limit]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    isLoading,
    error,
    refetch: fetchBooks,
  };
}

interface UseBookReturn {
  book: Book | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBook(id: string | null): UseBookReturn {
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = useCallback(async () => {
    if (!id) {
      setBook(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getBookById(id);
      setBook(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch book';
      setError(message);
      console.error('Error fetching book:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return {
    book,
    isLoading,
    error,
    refetch: fetchBook,
  };
}

// Admin functions for book management
export function useBookAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBook = useCallback(async (bookData: InsertTables<'books'>): Promise<Book | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single();

      if (insertError) throw insertError;
      return data as Book;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create book';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBook = useCallback(async (id: string, updates: UpdateTables<'books'>): Promise<Book | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return data as Book;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update book';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteBook = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete book';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createBook,
    updateBook,
    deleteBook,
    isLoading,
    error,
  };
}
