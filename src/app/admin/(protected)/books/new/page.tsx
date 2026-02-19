import Link from 'next/link';
import { BookForm } from '@/components/admin/BookForm';

export default function NewBookPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/books"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Books
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Book</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <BookForm mode="create" />
      </div>
    </div>
  );
}
