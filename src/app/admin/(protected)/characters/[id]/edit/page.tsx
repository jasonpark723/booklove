import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CharacterForm } from '@/components/admin/CharacterForm';
import { getCharacterById } from '@/lib/actions/characters';

interface EditCharacterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCharacterPage({ params }: EditCharacterPageProps) {
  const { id } = await params;
  const result = await getCharacterById(id);

  if (!result.success) {
    notFound();
  }

  const character = result.data;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/characters"
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Characters
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Character</h1>
        <p className="text-gray-500">{character.name}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <CharacterForm character={character} mode="edit" />
      </div>
    </div>
  );
}
