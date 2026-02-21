import { cn } from '@/lib/utils/cn';

interface SpiceIndicatorProps {
  level: number; // 0-3 (matches SpiceLevel type)
  maxLevel?: number;
  className?: string;
}

export function SpiceIndicator({ level, maxLevel = 5, className }: SpiceIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-5 py-4',
        'border-t border-primary-light',
        'bg-gradient-to-r from-transparent via-primary-light/30 to-transparent',
        className
      )}
    >
      <span className="text-xs text-text-muted mr-3 font-bold uppercase tracking-[0.5px]">
        Spice Level
      </span>
      {Array.from({ length: maxLevel }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'text-[22px] transition-transform duration-200',
            i < level
              ? 'filter-none animate-chili-bounce hover:scale-125 hover:-rotate-[10deg]'
              : 'grayscale opacity-20'
          )}
          style={{
            animationDelay: i < level ? `${i * 0.1}s` : undefined,
          }}
        >
          {'\u{1F336}\uFE0F'}
        </span>
      ))}
    </div>
  );
}
