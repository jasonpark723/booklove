import { cn } from '@/lib/utils/cn';

interface TraitBadgeProps {
  children: React.ReactNode;
  type?: 'trait' | 'hobby';
  className?: string;
}

export function TraitBadge({ children, type = 'trait', className }: TraitBadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-[18px] py-2.5 rounded-tag text-sm font-bold',
        'bg-gradient-to-br from-primary-light to-peach',
        'text-text shadow-[0_3px_10px_rgba(244,114,182,0.15)]',
        'transition-transform duration-200 ease-out hover:scale-105',
        type === 'hobby' && 'from-peach to-primary-light',
        className
      )}
    >
      {children}
    </span>
  );
}
