export default function BooksPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Books</h1>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Add Book
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Book management coming soon.</p>
        <p className="text-sm text-gray-400 mt-2">This feature will be implemented in issue #12.</p>
      </div>
    </div>
  );
}
