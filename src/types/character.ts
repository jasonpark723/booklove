// Character-related types

import type { Book } from './book';

export type Gender = 'male' | 'female' | 'non-binary' | 'other';

export interface CharacterPrompt {
  prompt: string;
  answer: string;
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
  profile_image_url: string | null;
  is_published: boolean;
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
  profile_image_url: string;
  is_published: boolean;
}
