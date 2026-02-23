'use client';

import { cn } from '@/lib/utils/cn';
import type { MatchWithCharacter } from '@/lib/hooks/useMatches';

interface MatchItemProps {
  match: MatchWithCharacter;
  onSelect: () => void;
}

function formatRelativeDate(date: string | null): string {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1d';
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`;
  return `${Math.floor(diffDays / 365)}yr`;
}

export function MatchItem({ match, onSelect }: MatchItemProps) {
  const { character, matchedAt, isRead } = match;

  // Get primary image or first image
  const primaryImage =
    character.images?.find((img) => img.is_primary) || character.images?.[0];
  const imageUrl = primaryImage?.url;

  // Get preview text - opening_line or first prompt answer
  const previewText =
    character.opening_line ||
    character.prompts?.[0]?.answer ||
    `From "${character.book?.title}"`;

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 transition-colors text-left',
        'hover:bg-gray-50 active:bg-gray-100'
      )}
    >
      {/* Profile Image */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">
              {character.name.charAt(0)}
            </div>
          )}
        </div>
        {/* Unread indicator */}
        {!isRead && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3
            className={cn(
              'text-base truncate',
              !isRead ? 'font-bold text-text-primary' : 'font-medium text-text-primary'
            )}
          >
            {character.name}
          </h3>
          {matchedAt && (
            <span className="text-xs text-text-muted flex-shrink-0">
              {formatRelativeDate(matchedAt)}
            </span>
          )}
        </div>
        <p className="text-sm text-text-muted truncate">{previewText}</p>
      </div>
    </button>
  );
}
