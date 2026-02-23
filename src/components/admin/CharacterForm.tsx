'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { TagInput } from './TagInput';
import { PromptEditor } from './PromptEditor';
import { ImageUploader } from './ImageUploader';
import {
  createCharacter,
  updateCharacter,
  getBooksForSelect,
  deleteCharacterImage,
} from '@/lib/actions/characters';
import type { Character, CharacterFormData, Gender, CharacterImage } from '@/types';

interface CharacterFormProps {
  character?: Character;
  mode: 'create' | 'edit';
}

interface BookOption {
  id: string;
  title: string;
  author: string;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'other', label: 'Other' },
];

const initialFormData: CharacterFormData = {
  book_id: '',
  name: '',
  gender: 'male',
  traits: [],
  hobbies: [],
  occupation: '',
  opening_line: '',
  prompts: [],
  images: [],
  is_published: false,
};

const inputStyles =
  'w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 ' +
  'focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ' +
  'placeholder:text-gray-400';

export function CharacterForm({ character, mode }: CharacterFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CharacterFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [books, setBooks] = useState<BookOption[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);

  // Load books for dropdown
  useEffect(() => {
    async function loadBooks() {
      setIsLoadingBooks(true);
      const result = await getBooksForSelect();
      if (result.success) {
        setBooks(result.data);
      }
      setIsLoadingBooks(false);
    }
    loadBooks();
  }, []);

  // Load character data for edit mode
  useEffect(() => {
    if (character && mode === 'edit') {
      setFormData({
        book_id: character.book_id,
        name: character.name,
        gender: character.gender,
        traits: character.traits || [],
        hobbies: character.hobbies || [],
        occupation: character.occupation || '',
        opening_line: character.opening_line || '',
        prompts: character.prompts || [],
        images: character.images || [],
        is_published: character.is_published,
      });
    }
  }, [character, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.book_id) {
      newErrors.book_id = 'Please select a book';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate prompts have answers
    const incompletePrompts = formData.prompts.filter(p => p.prompt && !p.answer.trim());
    if (incompletePrompts.length > 0) {
      newErrors.prompts = 'All prompts must have answers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const result = mode === 'create'
      ? await createCharacter(formData)
      : await updateCharacter(character!.id, formData);

    setIsSubmitting(false);

    if (result.success) {
      // Delete removed images from storage (fire and forget)
      if (removedImageUrls.length > 0) {
        Promise.all(
          removedImageUrls
            .filter(url => url.includes('character-images')) // Only delete uploaded images, not external URLs
            .map(url => deleteCharacterImage(url))
        ).catch(console.error);
      }
      router.push('/admin/characters');
    } else {
      setSubmitError(result.error);
    }
  };

  const handleImageRemove = (url: string) => {
    setRemovedImageUrls(prev => [...prev, url]);
  };

  // Get primary image for preview
  const primaryImage = formData.images.find(img => img.is_primary) || formData.images[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {submitError}
        </div>
      )}

      {/* Book Selection */}
      <FormField label="Book" required error={errors.book_id}>
        <select
          name="book_id"
          value={formData.book_id}
          onChange={handleChange}
          disabled={isLoadingBooks}
          className={cn(inputStyles, errors.book_id && 'border-red-500')}
        >
          <option value="">
            {isLoadingBooks ? 'Loading books...' : 'Select a book'}
          </option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>
      </FormField>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Character Name" required error={errors.name}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={cn(inputStyles, errors.name && 'border-red-500')}
            placeholder="Enter character name"
          />
        </FormField>

        <FormField label="Gender">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={inputStyles}
          >
            {GENDERS.map(g => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Opening Line */}
      <FormField
        label="Opening Line"
        hint={`Preview text shown in matches list (${formData.opening_line.length}/200)`}
      >
        <textarea
          name="opening_line"
          value={formData.opening_line}
          onChange={handleChange}
          maxLength={200}
          rows={2}
          className={inputStyles}
          placeholder="e.g., &quot;If you're looking for someone who'll bring you flowers and also teach you sword fighting...&quot;"
        />
      </FormField>

      {/* Occupation */}
      <FormField label="Occupation">
        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          className={inputStyles}
          placeholder="e.g., Warrior, Healer, Prince"
        />
      </FormField>

      {/* Traits */}
      <FormField label="Traits" hint="Add personality traits (max 10)">
        <TagInput
          value={formData.traits}
          onChange={(traits) => setFormData(prev => ({ ...prev, traits }))}
          placeholder="Type a trait and press Enter"
          maxTags={10}
        />
      </FormField>

      {/* Hobbies */}
      <FormField label="Hobbies" hint="Add hobbies and interests (max 10)">
        <TagInput
          value={formData.hobbies}
          onChange={(hobbies) => setFormData(prev => ({ ...prev, hobbies }))}
          placeholder="Type a hobby and press Enter"
          maxTags={10}
        />
      </FormField>

      {/* Prompts */}
      <FormField label="Prompts" hint="Add Hinge-style prompts (max 5)" error={errors.prompts}>
        <PromptEditor
          value={formData.prompts}
          onChange={(prompts) => setFormData(prev => ({ ...prev, prompts }))}
          maxPrompts={5}
        />
      </FormField>

      {/* Images */}
      <FormField label="Images" hint="Add up to 3 images (first or starred is primary)">
        <ImageUploader
          value={formData.images}
          onChange={(images) => setFormData(prev => ({ ...prev, images }))}
          onRemove={handleImageRemove}
          maxImages={3}
        />
      </FormField>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_published"
          id="is_published"
          checked={formData.is_published}
          onChange={handleChange}
          className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
        />
        <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
          Published (visible to users)
        </label>
      </div>

      {/* Character Preview */}
      {(formData.name || primaryImage) && (
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="max-w-sm">
            <CharacterPreview
              name={formData.name}
              occupation={formData.occupation}
              traits={formData.traits}
              prompts={formData.prompts}
              imageUrl={primaryImage?.url}
            />
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? (mode === 'create' ? 'Creating...' : 'Saving...')
            : (mode === 'create' ? 'Create Character' : 'Save Changes')
          }
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/characters')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Helper components

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

interface CharacterPreviewProps {
  name: string;
  occupation?: string;
  traits: string[];
  prompts: { prompt: string; answer: string }[];
  imageUrl?: string;
}

function CharacterPreview({ name, occupation, traits, prompts, imageUrl }: CharacterPreviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
      {/* Image */}
      <div className="aspect-[3/4] bg-gray-100 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name || 'Character'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">
            {name || 'Character Name'}
          </h3>
          {occupation && (
            <p className="text-sm text-white/80">{occupation}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Traits */}
        {traits.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {traits.slice(0, 5).map(trait => (
              <span
                key={trait}
                className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full"
              >
                {trait}
              </span>
            ))}
            {traits.length > 5 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{traits.length - 5}
              </span>
            )}
          </div>
        )}

        {/* First prompt */}
        {prompts.length > 0 && prompts[0].answer && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{prompts[0].prompt}</p>
            <p className="text-sm text-gray-900">{prompts[0].answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
