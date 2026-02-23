'use client';

import { useState, useCallback } from 'react';
import { useMatches } from '@/lib/hooks/useMatches';
import { MatchList, EmptyState, MatchDetailPanel } from '@/components/matches';
import type { CharacterWithBook } from '@/types';

function LoadingSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MatchesPage() {
  const { matches, isLoading, error, markAsRead } = useMatches();
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterWithBook | null>(null);

  const handleSelectMatch = useCallback((character: CharacterWithBook) => {
    setSelectedCharacter(character);
    // Mark as read when viewing
    markAsRead(character.id);
  }, [markAsRead]);

  const handleCloseDetail = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-surface border-b border-gray-100 px-4 py-4 z-10">
        <h1 className="text-xl font-bold text-text-primary">Chat Log</h1>
      </header>

      {/* Content */}
      <main>
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="px-4 py-8 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : matches.length === 0 ? (
          <EmptyState />
        ) : (
          <MatchList matches={matches} onSelectMatch={handleSelectMatch} />
        )}
      </main>

      {/* Slide-over detail panel */}
      <MatchDetailPanel
        character={selectedCharacter}
        isOpen={selectedCharacter !== null}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
