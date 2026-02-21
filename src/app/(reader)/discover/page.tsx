'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterCard } from '@/components/cards';
import { ActionButtons, MatchModal, EmptyState } from '@/components/discover';
import { useGuestState } from '@/lib/hooks/useGuestState';
import { mockCharacters } from '@/data/mockCharacters';
import type { CharacterWithBook } from '@/types/character';
import { cn } from '@/lib/utils/cn';

type ExitDirection = 'left' | 'right' | null;

// Loading placeholder card component
function LoadingCard() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-40">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-pulse">💕</div>
        <p className="text-text-muted font-semibold text-lg">Finding more characters...</p>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const {
    matchedCharacterIds,
    passedCharacterIds,
    addMatch,
    addPass,
    resetAll,
    isLoading,
  } = useGuestState();

  const [exitDirection, setExitDirection] = useState<ExitDirection>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedCharacter, setMatchedCharacter] = useState<CharacterWithBook | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [showLoadingCard, setShowLoadingCard] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const exitDirectionRef = useRef<ExitDirection>(null);

  // Filter out already matched or passed characters
  const availableCharacters = mockCharacters.filter(
    (char) =>
      !matchedCharacterIds.includes(char.id) &&
      !passedCharacterIds.includes(char.id)
  );

  const currentCharacter = availableCharacters[0] ?? null;
  const nextCharacter = availableCharacters[1] ?? null;


  // Scroll to top when character changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Also scroll the window
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCharacter?.id]);

  const handlePass = useCallback(() => {
    if (!currentCharacter || exitDirection) return;

    const isLastCharacter = availableCharacters.length === 1;
    exitDirectionRef.current = 'left';
    setExitDirection('left');

    // If last character, show loading card first
    if (isLastCharacter) {
      setShowLoadingCard(true);
    }

    // Delay state updates until animation completes
    setTimeout(() => {
      addPass(currentCharacter.id, nextCharacter?.id ?? null);
      setExitDirection(null);

      // Show empty state after loading card displays for 2 seconds
      if (isLastCharacter) {
        setTimeout(() => {
          setShowLoadingCard(false);
          setShowEmptyState(true);
        }, 2000);
      }
    }, 300);
  }, [currentCharacter, nextCharacter, addPass, exitDirection, availableCharacters.length]);

  const handleLike = useCallback(() => {
    if (!currentCharacter || exitDirection) return;

    const isLastCharacter = availableCharacters.length === 1;
    exitDirectionRef.current = 'right';
    setExitDirection('right');
    setMatchedCharacter(currentCharacter);

    // If last character, show loading card first
    if (isLastCharacter) {
      setShowLoadingCard(true);
    }

    // Delay state updates until animation completes
    setTimeout(() => {
      addMatch(currentCharacter.id, nextCharacter?.id ?? null);
      setExitDirection(null);
    }, 300);

    // Show modal after card animation fully completes
    setTimeout(() => {
      setShowLoadingCard(false);
      setShowMatchModal(true);
    }, 1000);
  }, [currentCharacter, nextCharacter, addMatch, exitDirection, availableCharacters.length]);

  const handleCloseModal = useCallback(() => {
    setShowMatchModal(false);
    setMatchedCharacter(null);
    // Show empty state if no more characters
    if (availableCharacters.length === 0) {
      setShowEmptyState(true);
    }
  }, [availableCharacters.length]);

  const handleSeeBook = useCallback(() => {
    // Placeholder - will navigate to book page in future
    setShowMatchModal(false);
    setMatchedCharacter(null);
    // Show empty state if no more characters
    if (availableCharacters.length === 0) {
      setShowEmptyState(true);
    }
  }, [availableCharacters.length]);

  const handleReset = useCallback(() => {
    setShowMatchModal(false);
    setMatchedCharacter(null);
    setShowEmptyState(false);
    setShowLoadingCard(false);
    resetAll();
  }, [resetAll]);

  const handlePromptLike = useCallback((promptIndex: number) => {
    console.log('Liked prompt:', promptIndex);
  }, []);

  // Animation variants
  const cardVariants = {
    enter: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      rotate: direction === 'left' ? -10 : 10,
      transition: { duration: 0.3 },
    }),
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    );
  }

  // Empty state - only show if explicitly set and modal is not open
  if (showEmptyState && !showMatchModal) {
    return <EmptyState onReset={handleReset} />;
  }

  // If no characters and no animation/modal/loading pending, show empty state
  if (availableCharacters.length === 0 && !exitDirection && !showMatchModal && !showLoadingCard) {
    return <EmptyState onReset={handleReset} />;
  }

  return (
    <div ref={scrollContainerRef}>
      {/* Card Stack */}
      <div className="relative p-4">
        <AnimatePresence mode="wait">
          {showLoadingCard ? (
            <motion.div
              key="loading"
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom="right"
            >
              <LoadingCard />
            </motion.div>
          ) : currentCharacter ? (
            <motion.div
              key={currentCharacter.id}
              custom={exitDirectionRef.current || 'right'}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <CharacterCard
                character={currentCharacter}
                onPromptLike={handlePromptLike}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Action Buttons - only show if there's a current character and not showing loading card */}
      {currentCharacter && !showLoadingCard && (
        <ActionButtons
          onPass={handlePass}
          onLike={handleLike}
          disabled={!!exitDirection}
        />
      )}

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        character={matchedCharacter}
        onClose={handleCloseModal}
        onSeeBook={handleSeeBook}
      />
    </div>
  );
}
