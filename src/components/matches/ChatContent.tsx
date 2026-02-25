'use client';

import type { CharacterWithBook } from '@/types';
import { BookPurchaseCard } from './BookPurchaseCard';

interface ChatContentProps {
  character: CharacterWithBook;
}

export function ChatContent({ character }: ChatContentProps) {
  const primaryImage =
    character.images?.find((img) => img.is_primary) || character.images?.[0];

  // Get first prompt topic for "Ask me about" section
  const firstPrompt = character.prompts?.[0];
  const askMeTopic = firstPrompt?.prompt || character.occupation || 'my story';

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
      {/* Ask me about section */}
      <div className="text-center mb-6">
        <p className="text-sm text-text-muted">Ask me about</p>
        <p className="text-lg font-medium text-text-primary mt-1">{askMeTopic}</p>
      </div>

      {/* Character's opening line - chat bubble style */}
      {character.opening_line && (
        <div className="flex items-start gap-2 mb-6">
          {/* Small avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 mt-1">
            {primaryImage?.url ? (
              <img
                src={primaryImage.url}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                {character.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Chat bubble */}
          <div className="max-w-[80%]">
            <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
              <p className="text-text-primary">{character.opening_line}</p>
            </div>
            <p className="text-xs text-text-muted mt-1 ml-1">Just now</p>
          </div>
        </div>
      )}

      {/* Prompts as additional conversation starters */}
      {character.prompts && character.prompts.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-text-muted text-center mb-3">Conversation starters</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {character.prompts.slice(0, 3).map((prompt, index) => (
              <button
                key={index}
                className="px-3 py-1.5 bg-primary-light/20 text-primary text-sm rounded-full hover:bg-primary-light/30 transition-colors"
                onClick={() => {
                  // Future: Show prompt answer or expand conversation
                }}
              >
                {prompt.prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spacer to push book card to bottom */}
      <div className="flex-grow" />

      {/* Book purchase card */}
      <div className="mt-auto">
        <BookPurchaseCard book={character.book} openingLine={character.opening_line} />
      </div>
    </div>
  );
}
