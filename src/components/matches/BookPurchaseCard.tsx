'use client';

import type { Book } from '@/types';
import { SPICE_LABELS, type SpiceLevel } from '@/types/book';

interface BookPurchaseCardProps {
  book: Book;
  openingLine?: string | null;
}

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const SpiceIcon = ({ level }: { level: SpiceLevel }) => {
  const peppers = [];
  for (let i = 0; i < 3; i++) {
    peppers.push(
      <span key={i} className={i < level ? 'text-red-500' : 'text-gray-300'}>
        🌶️
      </span>
    );
  }
  return <span className="text-xs">{peppers}</span>;
};

export function BookPurchaseCard({ book, openingLine }: BookPurchaseCardProps) {
  const affiliateLink = book.amazon_affiliate_link || '#';
  const hasLink = !!book.amazon_affiliate_link;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-primary mb-3">
          <BookIcon />
          <span className="text-sm font-medium">Get this book</span>
        </div>

        {/* Book info - larger layout */}
        <div className="flex gap-4">
          {/* Book cover - larger */}
          <div className="w-24 h-36 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-md">
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <BookIcon />
              </div>
            )}
          </div>

          {/* Book details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text-primary text-lg leading-tight">
              {book.title}
            </h3>
            <p className="text-sm text-text-muted mt-0.5">by {book.author}</p>

            {/* Series info */}
            {book.series_name && (
              <p className="text-xs text-text-muted mt-1">
                {book.series_name}
                {book.series_order && ` #${book.series_order}`}
              </p>
            )}

            {/* Genre and spice */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-primary-light/20 text-primary text-xs rounded-full">
                {book.genre}
              </span>
              {book.spice_level > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-xs rounded-full">
                  <SpiceIcon level={book.spice_level} />
                  <span className="text-red-600">{SPICE_LABELS[book.spice_level]}</span>
                </span>
              )}
            </div>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {book.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-text-muted text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {book.tags.length > 3 && (
                  <span className="text-xs text-text-muted">+{book.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Opening line quote */}
        {openingLine && (
          <div className="mt-4 p-3 bg-gray-50 rounded-xl border-l-4 border-primary">
            <p className="text-sm text-text-primary italic">&ldquo;{openingLine}&rdquo;</p>
            <p className="text-xs text-text-muted mt-1">— First line</p>
          </div>
        )}

        {/* Description */}
        {book.description && (
          <p className="mt-3 text-sm text-text-muted line-clamp-3">{book.description}</p>
        )}

        {/* Buy button */}
        <div className="mt-4">
          {hasLink ? (
            <a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors"
            >
              Buy on Amazon
              <ExternalLinkIcon />
            </a>
          ) : (
            <span className="flex items-center justify-center w-full py-3 bg-gray-100 text-text-muted rounded-full">
              Amazon link coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
