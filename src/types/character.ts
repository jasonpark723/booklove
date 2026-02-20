// Character-related types

import type { Book } from './book';

export type Gender = 'male' | 'female' | 'non-binary' | 'other';

export interface CharacterPrompt {
  prompt: string;
  answer: string;
}

export interface CharacterImage {
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Character {
  id: string;
  book_id: string;
  name: string;
  gender: Gender;
  traits: string[];
  hobbies: string[];
  occupation: string | null;
  prompts: CharacterPrompt[];
  images: CharacterImage[];
  is_published: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Character with joined book data (for swipe cards)
export interface CharacterWithBook extends Character {
  book: Book;
}

export interface CharacterFormData {
  book_id: string;
  name: string;
  gender: Gender;
  traits: string[];
  hobbies: string[];
  occupation: string;
  prompts: CharacterPrompt[];
  images: CharacterImage[];
  is_published: boolean;
}
