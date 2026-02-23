'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Character, CharacterFormData, CharacterImage, CharacterPrompt } from '@/types';
import type { Json } from '@/lib/supabase/types';

export type CharacterActionResult =
  | { success: true; data: Character }
  | { success: false; error: string };

export type CharactersListResult =
  | { success: true; data: Character[]; count: number }
  | { success: false; error: string };

export type DeleteResult =
  | { success: true }
  | { success: false; error: string };

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

export interface GetCharactersOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  bookId?: string;
  isPublished?: boolean | null;
  includeDeleted?: boolean;
  sortBy?: 'created_at' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface CharacterWithBook extends Character {
  book: {
    id: string;
    title: string;
    author: string;
    is_published: boolean;
  };
}

export type CharactersWithBookResult =
  | { success: true; data: CharacterWithBook[]; count: number }
  | { success: false; error: string };

/**
 * Helper to convert database row to Character type
 */
function toCharacter(row: Record<string, unknown>): Character {
  return {
    id: row.id as string,
    book_id: row.book_id as string,
    name: row.name as string,
    gender: row.gender as Character['gender'],
    traits: row.traits as string[],
    hobbies: row.hobbies as string[],
    occupation: row.occupation as string | null,
    opening_line: (row.opening_line as string | null) ?? null,
    prompts: row.prompts as CharacterPrompt[],
    images: row.images as CharacterImage[],
    is_published: row.is_published as boolean,
    is_deleted: row.is_deleted as boolean,
    deleted_at: row.deleted_at as string | null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

/**
 * Helper to convert database row to CharacterWithBook type
 */
function toCharacterWithBook(row: Record<string, unknown>): CharacterWithBook {
  const character = toCharacter(row);
  return {
    ...character,
    book: row.book as CharacterWithBook['book'],
  };
}

/**
 * Get paginated list of characters with filters
 */
export async function getCharacters(options: GetCharactersOptions = {}): Promise<CharactersWithBookResult> {
  const {
    page = 1,
    pageSize = 20,
    search,
    bookId,
    isPublished,
    includeDeleted = false,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options;

  try {
    const supabase = await createServerClient();
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('characters')
      .select(`
        *,
        book:books!inner(id, title, author, is_published)
      `, { count: 'exact' });

    // Exclude soft-deleted by default
    if (!includeDeleted) {
      query = query.eq('is_deleted', false);
    }

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply book filter
    if (bookId) {
      query = query.eq('book_id', bookId);
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

    const characters = (data || []).map(row => toCharacterWithBook(row as Record<string, unknown>));
    return { success: true, data: characters, count: count || 0 };
  } catch (err) {
    return { success: false, error: 'Failed to fetch characters' };
  }
}

/**
 * Get a single character by ID
 */
export async function getCharacterById(id: string): Promise<CharacterActionResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Character not found' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, data: toCharacter(data as Record<string, unknown>) };
  } catch (err) {
    return { success: false, error: 'Failed to fetch character' };
  }
}

/**
 * Create a new character
 */
export async function createCharacter(formData: CharacterFormData): Promise<CharacterActionResult> {
  try {
    const supabase = await createServerClient();

    // Verify book exists
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id')
      .eq('id', formData.book_id)
      .single();

    if (bookError || !book) {
      return { success: false, error: 'Selected book does not exist' };
    }

    const { data, error } = await supabase
      .from('characters')
      .insert({
        book_id: formData.book_id,
        name: formData.name,
        gender: formData.gender,
        traits: formData.traits,
        hobbies: formData.hobbies,
        occupation: formData.occupation || null,
        opening_line: formData.opening_line || null,
        prompts: formData.prompts as unknown as Json,
        images: formData.images as unknown as Json,
        is_published: formData.is_published,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/characters');
    return { success: true, data: toCharacter(data as Record<string, unknown>) };
  } catch (err) {
    return { success: false, error: 'Failed to create character' };
  }
}

/**
 * Update an existing character
 */
export async function updateCharacter(id: string, formData: CharacterFormData): Promise<CharacterActionResult> {
  try {
    const supabase = await createServerClient();

    // Verify book exists if book_id is being changed
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id')
      .eq('id', formData.book_id)
      .single();

    if (bookError || !book) {
      return { success: false, error: 'Selected book does not exist' };
    }

    const { data, error } = await supabase
      .from('characters')
      .update({
        book_id: formData.book_id,
        name: formData.name,
        gender: formData.gender,
        traits: formData.traits,
        hobbies: formData.hobbies,
        occupation: formData.occupation || null,
        opening_line: formData.opening_line || null,
        prompts: formData.prompts as unknown as Json,
        images: formData.images as unknown as Json,
        is_published: formData.is_published,
      })
      .eq('id', id)
      .eq('is_deleted', false)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/characters');
    revalidatePath(`/admin/characters/${id}/edit`);
    return { success: true, data: toCharacter(data as Record<string, unknown>) };
  } catch (err) {
    return { success: false, error: 'Failed to update character' };
  }
}

/**
 * Soft delete a character
 */
export async function deleteCharacter(id: string): Promise<DeleteResult> {
  try {
    const supabase = await createServerClient();

    // Soft delete the character
    const { error } = await supabase
      .from('characters')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/characters');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete character' };
  }
}

/**
 * Toggle character published status
 */
export async function toggleCharacterPublished(id: string, isPublished: boolean): Promise<CharacterActionResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('characters')
      .update({ is_published: isPublished })
      .eq('id', id)
      .eq('is_deleted', false)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/characters');
    return { success: true, data: toCharacter(data as Record<string, unknown>) };
  } catch (err) {
    return { success: false, error: 'Failed to toggle published status' };
  }
}

/**
 * Upload character image to Supabase Storage
 */
export async function uploadCharacterImage(formData: FormData): Promise<UploadResult> {
  try {
    const supabase = await createServerClient();
    const file = formData.get('file') as File;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'File too large. Maximum size is 5MB' };
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `characters/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('character-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('character-images')
      .getPublicUrl(path);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err) {
    return { success: false, error: 'Failed to upload image' };
  }
}

/**
 * Delete character image from Supabase Storage
 */
export async function deleteCharacterImage(imageUrl: string): Promise<DeleteResult> {
  try {
    const supabase = await createServerClient();

    // Extract path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/character-images\/(.+)$/);

    if (!pathMatch) {
      return { success: false, error: 'Invalid image URL' };
    }

    const path = pathMatch[1];

    const { error } = await supabase.storage
      .from('character-images')
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Failed to delete image' };
  }
}

/**
 * Get list of books for dropdown selection
 */
export async function getBooksForSelect(): Promise<{ success: true; data: Array<{ id: string; title: string; author: string }> } | { success: false; error: string }> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('books')
      .select('id, title, author')
      .order('title');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to fetch books' };
  }
}

/**
 * Get character match count (for delete warning)
 */
export async function getCharacterMatchCount(id: string): Promise<{ count: number }> {
  try {
    const supabase = await createServerClient();

    const { count, error } = await supabase
      .from('user_matches')
      .select('id', { count: 'exact', head: true })
      .eq('character_id', id);

    return { count: count || 0 };
  } catch (err) {
    return { count: 0 };
  }
}
