'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCharacter } from '@/lib/hooks/useCharacters';
import { useUser } from '@/context/UserContext';
import { ChatHeader } from '@/components/matches/ChatHeader';
import { ChatContent } from '@/components/matches/ChatContent';
import { Button } from '@/components/ui/Button';

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="sticky top-0 bg-surface border-b border-gray-100 px-2 py-2 z-10">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </header>

      {/* Content skeleton */}
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <div className="w-20 h-4 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
          <div className="w-32 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
        <div className="flex items-start gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl rounded-tl-md p-4">
              <div className="w-full h-4 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;
  const { character, isLoading, error } = useCharacter(characterId);
  const { markMatchAsRead } = useUser();

  // Mark match as read when viewing the detail page
  useEffect(() => {
    if (characterId) {
      markMatchAsRead(characterId);
    }
  }, [characterId, markMatchAsRead]);

  const handleBack = () => {
    router.push('/matches');
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-surface border-b border-gray-100 px-4 py-3 z-10 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <BackIcon />
          </button>
          <h1 className="text-lg font-bold text-text-primary">Error</h1>
        </header>
        <div className="p-4 text-center">
          <p className="text-red-500 mb-4">{error || 'Character not found'}</p>
          <Button variant="secondary" onClick={handleBack}>
            Back to Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <ChatHeader character={character} onBack={handleBack} />
      <ChatContent character={character} />
    </motion.div>
  );
}
