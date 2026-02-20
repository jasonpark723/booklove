import Link from 'next/link';
import { CharacterTable } from '@/components/admin/CharacterTable';

export default function CharactersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Characters</h1>
        <Link
          href="/admin/characters/new"
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Add Character
        </Link>
      </div>

      <CharacterTable />
    </div>
  );
}
