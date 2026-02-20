'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import {
  getCharacters,
  deleteCharacter,
  toggleCharacterPublished,
  getBooksForSelect,
  getCharacterMatchCount,
} from '@/lib/actions/characters';
import type { CharacterWithBook } from '@/lib/actions/characters';
import { Pencil, Trash2 } from 'lucide-react';

interface CharacterTableProps {
  initialCharacters?: CharacterWithBook[];
  initialCount?: number;
}

interface BookOption {
  id: string;
  title: string;
  author: string;
}

export function CharacterTable({ initialCharacters = [], initialCount = 0 }: CharacterTableProps) {
  const [characters, setCharacters] = useState<CharacterWithBook[]>(initialCharacters);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(!initialCharacters.length);

  // Books for filter dropdown
  const [books, setBooks] = useState<BookOption[]>([]);

  // Filters
  const [search, setSearch] = useState('');
  const [bookFilter, setBookFilter] = useState<string>('');
  const [publishedFilter, setPublishedFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    character: CharacterWithBook | null;
    matchCount: number;
  }>({
    open: false,
    character: null,
    matchCount: 0,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle loading state
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  // Load books for filter dropdown
  useEffect(() => {
    async function loadBooks() {
      const result = await getBooksForSelect();
      if (result.success) {
        setBooks(result.data);
      }
    }
    loadBooks();
  }, []);

  const fetchCharacters = useCallback(async () => {
    setIsLoading(true);

    const result = await getCharacters({
      page,
      pageSize,
      search: search || undefined,
      bookId: bookFilter || undefined,
      isPublished: publishedFilter === '' ? null : publishedFilter === 'true',
    });

    if (result.success) {
      setCharacters(result.data);
      setTotalCount(result.count);
    }

    setIsLoading(false);
  }, [page, search, bookFilter, publishedFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCharacters();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Immediate fetch on filter changes
  useEffect(() => {
    fetchCharacters();
  }, [page, bookFilter, publishedFilter]);

  const handleTogglePublished = async (character: CharacterWithBook) => {
    setTogglingIds(prev => new Set(prev).add(character.id));

    const result = await toggleCharacterPublished(character.id, !character.is_published);

    if (result.success) {
      setCharacters(prev =>
        prev.map(c => (c.id === character.id ? { ...c, is_published: !c.is_published } : c))
      );
    }

    setTogglingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(character.id);
      return newSet;
    });
  };

  const handleDeleteClick = async (character: CharacterWithBook) => {
    // Get match count for warning
    const { count } = await getCharacterMatchCount(character.id);
    setDeleteModal({ open: true, character, matchCount: count });
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.character) return;

    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteCharacter(deleteModal.character.id);

    setIsDeleting(false);

    if (result.success) {
      setDeleteModal({ open: false, character: null, matchCount: 0 });
      fetchCharacters();
    } else {
      setDeleteError(result.error);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // Get primary image URL
  const getPrimaryImage = (character: CharacterWithBook): string | null => {
    const images = character.images as Array<{ url: string; is_primary: boolean }> || [];
    const primary = images.find(img => img.is_primary) || images[0];
    return primary?.url || null;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <select
          value={bookFilter}
          onChange={(e) => {
            setBookFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">All Books</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>

        <select
          value={publishedFilter}
          onChange={(e) => {
            setPublishedFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Character</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Book</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Prompts</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : characters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No characters found
                  </td>
                </tr>
              ) : (
                characters.map(character => (
                  <tr key={character.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                          {getPrimaryImage(character) ? (
                            <img
                              src={getPrimaryImage(character)!}
                              alt={character.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              ?
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{character.name}</p>
                          {character.occupation && (
                            <p className="text-sm text-gray-500">{character.occupation}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{character.book.title}</p>
                      <p className="text-xs text-gray-500">{character.book.author}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {(character.prompts as Array<unknown>)?.length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublished(character)}
                        disabled={togglingIds.has(character.id)}
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full transition-colors',
                          character.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                          togglingIds.has(character.id) && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {character.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/characters/${character.id}/edit`}
                          className="p-2 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(character)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.character && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteModal({ open: false, character: null, matchCount: 0 })}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Character
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>{deleteModal.character.name}</strong>?
              This action cannot be undone.
            </p>
            {deleteModal.matchCount > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                <p className="text-sm text-amber-800">
                  This character has <strong>{deleteModal.matchCount}</strong> user match
                  {deleteModal.matchCount > 1 ? 'es' : ''} that will be affected.
                </p>
              </div>
            )}
            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteModal({ open: false, character: null, matchCount: 0 })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
