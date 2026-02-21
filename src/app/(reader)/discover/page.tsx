'use client';

import { CharacterCard } from '@/components/cards';
import type { CharacterWithBook } from '@/types/character';

// Sample data for demonstration
const sampleCharacter: CharacterWithBook = {
  id: '1',
  book_id: '1',
  name: 'Aurora Winters',
  gender: 'female',
  occupation: 'Ice Queen Heir',
  traits: ['Cold Exterior', 'Secretly Soft', 'Protective'],
  hobbies: ['Ice Skating', 'Reading'],
  prompts: [
    {
      prompt: "Don't let the ice fool you",
      answer:
        'Behind every cold glare is someone who feels too deeply and hides it even deeper.',
    },
    {
      prompt: 'What melts my walls',
      answer:
        'Persistence without pressure. Show up, but give me space to come to you.',
    },
    {
      prompt: 'Worth the wait because',
      answer: "Once I let you in, I'd freeze the world to keep you safe.",
    },
  ],
  images: [
    {
      url: 'https://picsum.photos/seed/aurora1/400/600',
      is_primary: true,
      sort_order: 0,
    },
    {
      url: 'https://picsum.photos/seed/aurora2/400/400',
      is_primary: false,
      sort_order: 1,
    },
  ],
  is_published: true,
  is_deleted: false,
  deleted_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  book: {
    id: '1',
    title: 'Frozen Hearts Thaw',
    author: 'Melody Frost',
    description: 'A story of love melting the coldest heart.',
    cover_image_url: 'https://picsum.photos/seed/bookpeach/300/400',
    amazon_affiliate_link: null,
    genre: 'Romance',
    tags: ['enemies-to-lovers', 'slow-burn'],
    spice_level: 2,
    mature_themes: false,
    series_name: null,
    series_order: null,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export default function DiscoverPage() {
  const handleLike = () => {
    console.log('Liked character!');
  };

  const handlePass = () => {
    console.log('Passed on character');
  };

  const handlePromptLike = (promptIndex: number) => {
    console.log('Liked prompt:', promptIndex);
  };

  return (
    <div className="p-4">
      <CharacterCard
        character={sampleCharacter}
        onLike={handleLike}
        onPass={handlePass}
        onPromptLike={handlePromptLike}
      />
    </div>
  );
}
