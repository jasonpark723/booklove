import Link from 'next/link';
import { BookTable } from '@/components/admin/BookTable';

export default function BooksPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Books</h1>
        <Link
          href="/admin/books/new"
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Add Book
        </Link>
      </div>

      <BookTable />
    </div>
  );
}
