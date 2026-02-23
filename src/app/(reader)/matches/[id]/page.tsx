'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCharacter } from '@/lib/hooks/useCharacters';
import { Button } from '@/components/ui/Button';

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

function LoadingSkeleton() {
  return (
    <div className="animate-pulse p-4">
      <div className="h-8 bg-gray-200 rounded w-32 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-3/4" />
    </div>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;
  const { character, isLoading, error } = useCharacter(characterId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-surface border-b border-gray-100 px-4 py-3 z-10 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <BackIcon />
          </button>
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
        </header>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-surface border-b border-gray-100 px-4 py-3 z-10 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <BackIcon />
          </button>
          <h1 className="text-lg font-bold text-text-primary">Error</h1>
        </header>
        <div className="p-4 text-center">
          <p className="text-red-500 mb-4">{error || 'Character not found'}</p>
          <Button variant="secondary" onClick={() => router.push('/matches')}>
            Back to Matches
          </Button>
        </div>
      </div>
    );
  }

  // Get primary image
  const primaryImage =
    character.images?.find((img) => img.is_primary) || character.images?.[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-surface border-b border-gray-100 px-4 py-3 z-10 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1">
          <BackIcon />
        </button>
        <h1 className="text-lg font-bold text-text-primary">{character.name}</h1>
      </header>

      {/* Placeholder content - Chat detail will be implemented in issue #34 */}
      <div className="p-4">
        {/* Character preview */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {primaryImage?.url ? (
              <img
                src={primaryImage.url}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                {character.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">{character.name}</h2>
            {character.occupation && (
              <p className="text-text-muted">{character.occupation}</p>
            )}
            <p className="text-sm text-text-muted">
              From &quot;{character.book?.title}&quot;
            </p>
          </div>
        </div>

        {/* Opening line */}
        {character.opening_line && (
          <div className="bg-primary-light/20 rounded-2xl rounded-tl-sm p-4 mb-4">
            <p className="text-text-primary italic">&quot;{character.opening_line}&quot;</p>
          </div>
        )}

        {/* Coming soon notice */}
        <div className="bg-gray-50 rounded-lg p-6 text-center mt-8">
          <p className="text-text-muted mb-2">
            Full chat experience coming soon!
          </p>
          <p className="text-sm text-text-muted">
            For now, check out the book to continue your connection with {character.name}.
          </p>
          {character.book?.amazon_affiliate_link && (
            <a
              href={character.book.amazon_affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4"
            >
              <Button variant="primary">Get the Book</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
