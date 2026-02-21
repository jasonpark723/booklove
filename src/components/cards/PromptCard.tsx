'use client';

import { cn } from '@/lib/utils/cn';

interface PromptCardProps {
  prompt: string;
  answer: string;
  onLike?: () => void;
  className?: string;
}

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-primary group-hover:fill-white transition-colors">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export function PromptCard({ prompt, answer, onLike, className }: PromptCardProps) {
  return (
    <div
      className={cn(
        'bg-surface rounded-card p-[22px] mb-3.5 shadow-card relative',
        'border-l-4 border-primary-light',
        'transition-all duration-200 ease-out',
        'hover:translate-x-1 hover:border-l-primary',
        className
      )}
    >
      <div className="pr-12">
        <div className="text-xs text-accent font-bold mb-2.5 uppercase tracking-[0.5px]">
          {prompt}
        </div>
        <div className="text-lg font-bold leading-[1.45] text-text">
          {answer}
        </div>
      </div>

      {onLike && (
        <button
          onClick={onLike}
          className={cn(
            'group absolute top-[18px] right-[18px] w-9 h-9',
            'bg-gradient-to-br from-primary-light to-peach rounded-full',
            'flex items-center justify-center cursor-pointer',
            'transition-all duration-300 ease-bouncy',
            'hover:bg-gradient-to-br hover:from-primary hover:to-primary-warm',
            'hover:scale-[1.15] hover:rotate-[10deg]'
          )}
          aria-label="Like this prompt"
        >
          <HeartIcon />
        </button>
      )}
    </div>
  );
}
