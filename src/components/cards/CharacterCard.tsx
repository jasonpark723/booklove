'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { TraitBadge } from './TraitBadge';
import { PromptCard } from './PromptCard';
import { SpiceIndicator } from './SpiceIndicator';
import type { CharacterWithBook, CharacterImage } from '@/types/character';

interface CharacterCardProps {
  character: CharacterWithBook;
  onLike?: () => void;
  onPass?: () => void;
  onPromptLike?: (promptIndex: number) => void;
  className?: string;
}

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[26px] h-[26px] fill-white">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

function getPrimaryImage(images: CharacterImage[]): string | null {
  const primary = images.find((img) => img.is_primary);
  if (primary) return primary.url;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return sorted[0]?.url ?? null;
}

function getSecondaryImages(images: CharacterImage[]): CharacterImage[] {
  const primaryUrl = getPrimaryImage(images);
  return images
    .filter((img) => img.url !== primaryUrl)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function CharacterCard({
  character,
  onLike,
  onPass,
  onPromptLike,
  className,
}: CharacterCardProps) {
  const primaryImage = getPrimaryImage(character.images);
  const secondaryImages = getSecondaryImages(character.images);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Character Card with Image */}
      <div
        className={cn(
          'bg-surface rounded-card shadow-card overflow-hidden',
          'transition-transform duration-300 ease-bouncy',
          'hover:-translate-y-1'
        )}
      >
        {/* Character Image */}
        <div className="relative h-[500px]">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={character.name}
              fill
              className="object-cover"
              sizes="(max-width: 428px) 100vw, 428px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-light to-peach flex items-center justify-center">
              <span className="text-6xl">📚</span>
            </div>
          )}

          {/* Gradient Overlay with Name */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(157,23,77,0.88)] to-transparent pt-[60px] px-5 pb-6 text-white">
            <h2 className="text-[30px] font-extrabold mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
              {character.name}
            </h2>
            {character.occupation && (
              <p className="text-base opacity-95 font-semibold">
                {character.occupation}
              </p>
            )}
          </div>

          {/* Heart Button */}
          {onLike && (
            <button
              onClick={onLike}
              className={cn(
                'absolute bottom-6 right-5 w-[52px] h-[52px]',
                'bg-gradient-to-br from-primary to-primary-warm rounded-full',
                'flex items-center justify-center cursor-pointer',
                'shadow-heart transition-all duration-300 ease-bouncy',
                'hover:scale-[1.12] hover:-rotate-[5deg]',
                'active:scale-95'
              )}
              aria-label="Like character"
            >
              <HeartIcon />
            </button>
          )}
        </div>

        {/* Trait Tags */}
        {(character.traits.length > 0 || character.hobbies.length > 0) && (
          <div className="flex flex-wrap gap-2.5 px-5 py-[18px]">
            {character.traits.map((trait) => (
              <TraitBadge key={trait} type="trait">
                {trait}
              </TraitBadge>
            ))}
            {character.hobbies.map((hobby) => (
              <TraitBadge key={hobby} type="hobby">
                {hobby}
              </TraitBadge>
            ))}
          </div>
        )}

        {/* Spice Indicator */}
        {character.book?.spice_level !== undefined && (
          <SpiceIndicator level={character.book.spice_level} maxLevel={3} />
        )}
      </div>

      {/* Prompts */}
      {character.prompts.length > 0 && (
        <div className="space-y-3.5">
          {character.prompts.map((prompt, index) => (
            <PromptCard
              key={index}
              prompt={prompt.prompt}
              answer={prompt.answer}
              onLike={onPromptLike ? () => onPromptLike(index) : undefined}
            />
          ))}
        </div>
      )}

      {/* Secondary Images */}
      {secondaryImages.length > 0 && (
        <div className="space-y-4">
          {secondaryImages.map((img, index) => (
            <div
              key={index}
              className={cn(
                'bg-surface rounded-card shadow-card overflow-hidden',
                'transition-transform duration-300 ease-bouncy',
                'hover:-translate-y-1'
              )}
            >
              <div className="relative h-[340px]">
                <Image
                  src={img.url}
                  alt={`${character.name} photo ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 428px) 100vw, 428px"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Swipe Hint */}
      <div className="text-center py-6 text-text-muted text-sm font-semibold">
        ← Swipe to pass · Swipe to like →
      </div>
    </div>
  );
}
