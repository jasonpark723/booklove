// Book-related types

export type SpiceLevel = 0 | 1 | 2 | 3;

export const SPICE_LABELS: Record<SpiceLevel, string> = {
  0: 'Clean',
  1: 'Mild',
  2: 'Moderate',
  3: 'Spicy',
};

export const SPICE_DESCRIPTIONS: Record<SpiceLevel, string> = {
  0: 'No spicy content, fade to black or less',
  1: 'Light steam, closed door with tension',
  2: 'Open door, some explicit scenes',
  3: 'Explicit content throughout',
};

export const GENRES = [
  'Mystery',
  'Thriller',
  'Romance',
  'Fantasy',
  'Science Fiction',
] as const;

export type Genre = (typeof GENRES)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_image_url: string | null;
  amazon_affiliate_link: string | null;
  genre: Genre;
  tags: string[];
  spice_level: SpiceLevel;
  mature_themes: boolean;
  series_name: string | null;
  series_order: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  cover_image_url: string;
  amazon_affiliate_link: string;
  genre: Genre;
  tags: string[];
  spice_level: SpiceLevel;
  mature_themes: boolean;
  series_name: string;
  series_order: number | null;
  is_published: boolean;
}
