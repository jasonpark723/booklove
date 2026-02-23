'use client';

import { MatchItem } from './MatchItem';
import type { MatchWithCharacter } from '@/lib/hooks/useMatches';
import type { CharacterWithBook } from '@/types';

interface MatchListProps {
  matches: MatchWithCharacter[];
  onSelectMatch: (character: CharacterWithBook) => void;
}

export function MatchList({ matches, onSelectMatch }: MatchListProps) {
  return (
    <div className="divide-y divide-gray-100">
      {matches.map((match) => (
        <MatchItem
          key={match.characterId}
          match={match}
          onSelect={() => onSelectMatch(match.character)}
        />
      ))}
    </div>
  );
}
