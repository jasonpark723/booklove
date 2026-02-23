'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-16 h-16 text-primary-light"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6">
        <HeartIcon />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">
        No matches yet!
      </h2>
      <p className="text-text-muted mb-8 max-w-xs">
        Start swiping to find your next book boyfriend or girlfriend.
      </p>
      <Link href="/discover">
        <Button variant="primary" size="lg">
          Start Discovering
        </Button>
      </Link>
    </div>
  );
}
