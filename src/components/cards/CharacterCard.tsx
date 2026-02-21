'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { TraitBadge } from './TraitBadge';
import { PromptCard } from './PromptCard';
import { SpiceIndicator } from './SpiceIndicator';
import type { CharacterWithBook, CharacterImage } from '@/types/character';

interface CharacterCardProps {
  character: CharacterWithBook;
  onPromptLike?: (promptIndex: number) => void;
  className?: string;
}

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

    </div>
  );
}
