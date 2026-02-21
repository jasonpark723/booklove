'use client';

import { cn } from '@/lib/utils/cn';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-6xl mb-6">
        <span role="img" aria-label="warning">😕</span>
      </div>
      <h2 className="text-2xl font-bold text-text mb-3">
        Something went wrong
      </h2>
      <p className="text-text-muted mb-8 max-w-xs">
        {message || "We couldn't load characters. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            'px-6 py-3 rounded-button font-semibold',
            'bg-gradient-to-r from-primary to-primary-warm text-white',
            'shadow-card transition-all duration-300 ease-bouncy',
            'hover:scale-105 hover:shadow-card-hover',
            'active:scale-95'
          )}
        >
          Try again
        </button>
      )}
    </div>
  );
}
