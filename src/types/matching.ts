// Matching algorithm types

export interface UserPreferences {
  genres: string[];
  prefersSpicy: boolean | null;
}

export interface MatchingConfig {
  batchSize: number;
  preferredRatio: number; // 0.7 = 70% preferred
  prefetchThreshold: number;
}

export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  batchSize: 10,
  preferredRatio: 0.7,
  prefetchThreshold: 7,
};

// API Response Types
import type { CharacterWithBook } from './character';

export interface CharacterBatchResponse {
  characters: CharacterWithBook[];
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
}
