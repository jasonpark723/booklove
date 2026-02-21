'use client';

import { cn } from '@/lib/utils/cn';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  disabled?: boolean;
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export function ActionButtons({ onPass, onLike, disabled }: ActionButtonsProps) {
  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center gap-16 pointer-events-none">
      {/* Pass Button */}
      <button
        onClick={onPass}
        disabled={disabled}
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center pointer-events-auto',
          'bg-gray-400 shadow-lg',
          'transition-all duration-300 ease-bouncy',
          'hover:scale-110 hover:bg-gray-500',
          'active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
        )}
        aria-label="Pass on character"
      >
        <XIcon />
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={disabled}
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center pointer-events-auto',
          'bg-gradient-to-br from-primary to-primary-warm shadow-heart',
          'transition-all duration-300 ease-bouncy',
          'hover:scale-110',
          'active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
        )}
        aria-label="Like character"
      >
        <HeartIcon />
      </button>
    </div>
  );
}
