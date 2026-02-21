'use client';

import { cn } from '@/lib/utils/cn';

interface EmptyStateProps {
  onReset?: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-6xl mb-6">
        <span role="img" aria-label="sparkling heart">💖</span>
      </div>
      <h2 className="text-2xl font-bold text-text mb-3">
        You've seen everyone!
      </h2>
      <p className="text-text-muted mb-8 max-w-xs">
        Check back later for new characters, or reset to see them all again.
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className={cn(
            'px-6 py-3 rounded-button font-semibold',
            'bg-gradient-to-r from-primary to-primary-warm text-white',
            'shadow-card transition-all duration-300 ease-bouncy',
            'hover:scale-105 hover:shadow-card-hover',
            'active:scale-95'
          )}
        >
          Start over
        </button>
      )}
    </div>
  );
}
