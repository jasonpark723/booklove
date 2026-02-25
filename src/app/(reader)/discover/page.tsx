'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterCard } from '@/components/cards';
import { ActionButtons, MatchModal, EmptyState, ErrorState } from '@/components/discover';
import { useUser } from '@/context/UserContext';
import { useCharacters } from '@/lib/hooks/useCharacters';
import type { CharacterWithBook } from '@/types/character';

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

// Initial loading state
function InitialLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="text-6xl mb-6 animate-pulse">💕</div>
      <p className="text-text-muted font-semibold">Loading characters...</p>
    </div>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const {
    matchedCharacterIds,
    passedCharacterIds,
    addMatch,
    addPass,
    resetPasses,
    isLoading: userLoading,
  } = useUser();

  // Memoize excludeIds to prevent unnecessary refetches
  const excludeIds = useMemo(
    () => [...matchedCharacterIds, ...passedCharacterIds],
    [matchedCharacterIds, passedCharacterIds]
  );

  // Fetch characters from Supabase
  const {
    characters,
    isLoading: charactersLoading,
    error: charactersError,
    hasMore,
    fetchMore,
    refetch,
  } = useCharacters({
    excludeIds,
    limit: 10,
  });

  const [exitDirection, setExitDirection] = useState<ExitDirection>(null);
  const [lastExitDirection, setLastExitDirection] = useState<'left' | 'right'>('right');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedCharacter, setMatchedCharacter] = useState<CharacterWithBook | null>(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [showLoadingCard, setShowLoadingCard] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Current and next character from the fetched pool
  const currentCharacter = characters[0] ?? null;
  const nextCharacter = characters[1] ?? null;

  // Pre-fetch more characters when running low (3 or fewer remaining)
  useEffect(() => {
    if (characters.length > 0 && characters.length <= 3 && hasMore && !charactersLoading) {
      fetchMore();
    }
  }, [characters.length, hasMore, charactersLoading, fetchMore]);

  // Scroll to top when character changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentCharacter?.id]);


  const handlePass = useCallback(() => {
    if (!currentCharacter || exitDirection) return;

    const isLastCharacter = characters.length === 1 && !hasMore;
    setLastExitDirection('left');
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
  }, [currentCharacter, nextCharacter, addPass, exitDirection, characters.length, hasMore]);

  const handleLike = useCallback(() => {
    if (!currentCharacter || exitDirection) return;

    const isLastCharacter = characters.length === 1 && !hasMore;
    setLastExitDirection('right');
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
  }, [currentCharacter, nextCharacter, addMatch, exitDirection, characters.length, hasMore]);

  const handleCloseModal = useCallback(() => {
    setShowMatchModal(false);
    setMatchedCharacter(null);
    // Show empty state if no more characters
    if (characters.length === 0 && !hasMore) {
      setShowEmptyState(true);
    }
  }, [characters.length, hasMore]);

  const handleSeeBook = useCallback(() => {
    if (matchedCharacter) {
      router.push(`/matches/${matchedCharacter.id}`);
    }
    setShowMatchModal(false);
    setMatchedCharacter(null);
    // Show empty state if no more characters
    if (characters.length === 0 && !hasMore) {
      setShowEmptyState(true);
    }
  }, [matchedCharacter, router, characters.length, hasMore]);

  const handleReset = useCallback(() => {
    setShowMatchModal(false);
    setMatchedCharacter(null);
    setShowEmptyState(false);
    setShowLoadingCard(false);
    resetPasses();
    // useCharacters will auto-refetch when excludeIds changes
  }, [resetPasses]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

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

  // Initial loading state (user state or first character fetch)
  if (userLoading || (charactersLoading && characters.length === 0)) {
    return <InitialLoadingState />;
  }

  // Error state
  if (charactersError && characters.length === 0) {
    return <ErrorState message={charactersError} onRetry={handleRetry} />;
  }

  // Empty state - only show if explicitly set and modal is not open
  if (showEmptyState && !showMatchModal) {
    return <EmptyState onReset={handleReset} />;
  }

  // No characters available (either none in database or all seen)
  if (characters.length === 0 && !exitDirection && !showMatchModal && !showLoadingCard) {
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
              custom={lastExitDirection}
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
