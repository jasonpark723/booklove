'use client';

import type { CharacterWithBook } from '@/types';

interface ChatHeaderProps {
  character: CharacterWithBook;
  onBack: () => void;
}

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
  </svg>
);

export function ChatHeader({ character, onBack }: ChatHeaderProps) {
  const primaryImage =
    character.images?.find((img) => img.is_primary) || character.images?.[0];

  return (
    <header className="sticky top-0 bg-surface border-b border-gray-100 px-2 py-2 z-10">
      <div className="flex items-center justify-between">
        {/* Back button */}
        <button
          onClick={onBack}
          className="p-2 -ml-1 text-text-primary hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <BackIcon />
        </button>

        {/* Center: Character image and name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {primaryImage?.url ? (
              <img
                src={primaryImage.url}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                {character.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="font-semibold text-text-primary">{character.name}</span>
        </div>

        {/* Options menu (placeholder for future) */}
        <button
          className="p-2 -mr-1 text-text-muted hover:bg-gray-100 rounded-full transition-colors"
          aria-label="More options"
          onClick={() => {
            // Future: show options menu (remove match, report, etc.)
          }}
        >
          <MoreIcon />
        </button>
      </div>
    </header>
  );
}
