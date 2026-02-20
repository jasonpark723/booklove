'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Book, BookFormData, Tag } from '@/types';

export type BookActionResult =
  | { success: true; data: Book }
  | { success: false; error: string };

export type BooksListResult =
  | { success: true; data: Book[]; count: number }
  | { success: false; error: string };

export type TagsResult =
  | { success: true; data: Tag[] }
  | { success: false; error: string };

export type DeleteResult =
  | { success: true }
  | { success: false; error: string };

export interface GetBooksOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  genre?: string;
  isPublished?: boolean | null;
  sortBy?: 'created_at' | 'title' | 'author';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get paginated list of books with filters
 */
export async function getBooks(options: GetBooksOptions = {}): Promise<BooksListResult> {
  const {
    page = 1,
    pageSize = 20,
    search,
    genre,
    isPublished,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options;

  try {
    const supabase = await createServerClient();
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('books')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    // Apply genre filter
    if (genre) {
      query = query.eq('genre', genre);
    }

    // Apply published filter
    if (isPublished !== null && isPublished !== undefined) {
      query = query.eq('is_published', isPublished);
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Book[], count: count || 0 };
  } catch (err) {
    return { success: false, error: 'Failed to fetch books' };
  }
}

/**
 * Get a single book by ID
 */
export async function getBookById(id: string): Promise<BookActionResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Book not found' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Book };
  } catch (err) {
    return { success: false, error: 'Failed to fetch book' };
  }
}

/**
 * Create a new book
 */
export async function createBook(formData: BookFormData): Promise<BookActionResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('books')
      .insert({
        title: formData.title,
        author: formData.author,
        description: formData.description || null,
        cover_image_url: formData.cover_image_url || null,
        amazon_affiliate_link: formData.amazon_affiliate_link || null,
        genre: formData.genre,
        tags: formData.tags,
        spice_level: formData.spice_level,
        mature_themes: formData.mature_themes,
        series_name: formData.series_name || null,
        series_order: formData.series_order,
        is_published: formData.is_published,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/books');
    return { success: true, data: data as Book };
  } catch (err) {
    return { success: false, error: 'Failed to create book' };
  }
}

/**
 * Update an existing book
 */
export async function updateBook(id: string, formData: BookFormData): Promise<BookActionResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('books')
      .update({
        title: formData.title,
        author: formData.author,
        description: formData.description || null,
        cover_image_url: formData.cover_image_url || null,
        amazon_affiliate_link: formData.amazon_affiliate_link || null,
        genre: formData.genre,
        tags: formData.tags,
        spice_level: formData.spice_level,
        mature_themes: formData.mature_themes,
        series_name: formData.series_name || null,
        series_order: formData.series_order,
        is_published: formData.is_published,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/books');
    revalidatePath(`/admin/books/${id}/edit`);
    return { success: true, data: data as Book };
  } catch (err) {
    return { success: false, error: 'Failed to update book' };
  }
}

/**
 * Delete a book (checks for characters first)
 */
export async function deleteBook(id: string): Promise<DeleteResult> {
  try {
    const supabase = await createServerClient();

    // Check if book has any characters
    const { count, error: countError } = await supabase
      .from('characters')
      .select('id', { count: 'exact', head: true })
      .eq('book_id', id);

    if (countError) {
      return { success: false, error: countError.message };
    }

    if (count && count > 0) {
      return {
        success: false,
        error: `Cannot delete book with ${count} character${count > 1 ? 's' : ''}. Delete characters first.`
      };
    }

    // Delete the book
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/books');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete book' };
  }
}

/**
 * Toggle book published status
 */
export async function toggleBookPublished(id: string, isPublished: boolean): Promise<BookActionResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('books')
      .update({ is_published: isPublished })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/books');
    return { success: true, data: data as Book };
  } catch (err) {
    return { success: false, error: 'Failed to toggle published status' };
  }
}

/**
 * Check for duplicate Amazon affiliate links
 */
export async function checkDuplicateAmazonLink(
  link: string,
  excludeBookId?: string
): Promise<{ isDuplicate: boolean; bookTitle?: string }> {
  if (!link) {
    return { isDuplicate: false };
  }

  try {
    const supabase = await createServerClient();

    let query = supabase
      .from('books')
      .select('id, title')
      .eq('amazon_affiliate_link', link);

    if (excludeBookId) {
      query = query.neq('id', excludeBookId);
    }

    const { data, error } = await query.limit(1);

    if (error) {
      return { isDuplicate: false };
    }

    if (data && data.length > 0) {
      return { isDuplicate: true, bookTitle: data[0].title };
    }

    return { isDuplicate: false };
  } catch (err) {
    return { isDuplicate: false };
  }
}

// ============================================
// TAG OPERATIONS
// ============================================

/**
 * Get all tags
 */
export async function getTags(): Promise<TagsResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Tag[] };
  } catch (err) {
    return { success: false, error: 'Failed to fetch tags' };
  }
}

/**
 * Create a new tag
 */
export async function createTag(name: string): Promise<{ success: true; data: Tag } | { success: false; error: string }> {
  try {
    const supabase = await createServerClient();

    // Normalize tag name (lowercase, trim)
    const normalizedName = name.toLowerCase().trim().replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('tags')
      .insert({ name: normalizedName })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - tag already exists
        return { success: false, error: 'Tag already exists' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Tag };
  } catch (err) {
    return { success: false, error: 'Failed to create tag' };
  }
}

/**
 * Search tags by name
 */
export async function searchTags(query: string): Promise<TagsResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(20);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Tag[] };
  } catch (err) {
    return { success: false, error: 'Failed to search tags' };
  }
}

// ============================================
// BOOK COVER IMAGE OPERATIONS
// ============================================

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

/**
 * Upload book cover image to Supabase Storage
 */
export async function uploadBookCover(formData: FormData): Promise<UploadResult> {
  try {
    const supabase = await createServerClient();
    const file = formData.get('file') as File;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP' };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 5MB' };
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `covers/${filename}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('book-covers')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('book-covers')
      .getPublicUrl(path);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err) {
    return { success: false, error: 'Failed to upload image' };
  }
}

/**
 * Delete book cover image from Supabase Storage
 */
export async function deleteBookCover(imageUrl: string): Promise<DeleteResult> {
  try {
    const supabase = await createServerClient();

    // Extract path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/book-covers\/(.+)$/);

    if (!pathMatch) {
      // Not a storage URL, nothing to delete
      return { success: true };
    }

    const path = pathMatch[1];

    const { error } = await supabase.storage
      .from('book-covers')
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete image' };
  }
}
