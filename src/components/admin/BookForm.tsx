'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Link, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import {
  createBook,
  updateBook,
  getTags,
  createTag,
  checkDuplicateAmazonLink,
  uploadBookCover,
  deleteBookCover,
} from '@/lib/actions/books';
import type { Book, BookFormData, Tag, SpiceLevel, Genre } from '@/types';
import { GENRES, SPICE_LABELS } from '@/types';

interface BookFormProps {
  book?: Book;
  mode: 'create' | 'edit';
}

const initialFormData: BookFormData = {
  title: '',
  author: '',
  description: '',
  cover_image_url: '',
  amazon_affiliate_link: '',
  genre: 'Fantasy',
  tags: [],
  spice_level: 0,
  mature_themes: false,
  series_name: '',
  series_order: null,
  is_published: true,
};

export function BookForm({ book, mode }: BookFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Tags state
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // Cover image upload state
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [isAddingCoverUrl, setIsAddingCoverUrl] = useState(false);
  const [coverUrlInput, setCoverUrlInput] = useState('');
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [oldCoverUrl, setOldCoverUrl] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    if (book && mode === 'edit') {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || '',
        cover_image_url: book.cover_image_url || '',
        amazon_affiliate_link: book.amazon_affiliate_link || '',
        genre: book.genre,
        tags: book.tags || [],
        spice_level: book.spice_level,
        mature_themes: book.mature_themes,
        series_name: book.series_name || '',
        series_order: book.series_order,
        is_published: book.is_published,
      });
    }
  }, [book, mode]);

  // Load available tags
  useEffect(() => {
    async function loadTags() {
      const result = await getTags();
      if (result.success) {
        setAvailableTags(result.data);
      }
    }
    loadTags();
  }, []);

  // Check for duplicate Amazon link
  const checkDuplicate = useCallback(async (link: string) => {
    if (!link) {
      setDuplicateWarning(null);
      return;
    }
    const result = await checkDuplicateAmazonLink(link, book?.id);
    if (result.isDuplicate) {
      setDuplicateWarning(`This link is already used by "${result.bookTitle}"`);
    } else {
      setDuplicateWarning(null);
    }
  }, [book?.id]);

  // Debounced duplicate check
  useEffect(() => {
    const timer = setTimeout(() => {
      checkDuplicate(formData.amazon_affiliate_link);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.amazon_affiliate_link, checkDuplicate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
          ? value === '' ? null : parseInt(value, 10)
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

  const handleSpiceLevelChange = (level: SpiceLevel) => {
    setFormData(prev => ({ ...prev, spice_level: level }));
  };

  const handleTagSelect = (tagName: string) => {
    if (!formData.tags.includes(tagName)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagName],
      }));
    }
    setTagSearch('');
    setIsTagDropdownOpen(false);
  };

  const handleTagRemove = (tagName: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagName),
    }));
  };

  const handleCreateTag = async () => {
    if (!tagSearch.trim()) return;

    // Split by comma, trim each, filter empty strings
    const newTagNames = tagSearch
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !formData.tags.includes(tag));

    if (newTagNames.length === 0) {
      setTagSearch('');
      return;
    }

    setIsCreatingTag(true);

    const createdTags: Tag[] = [];
    for (const tagName of newTagNames) {
      // Check if tag already exists
      const existingTag = availableTags.find(
        t => t.name.toLowerCase() === tagName.toLowerCase()
      );
      if (existingTag) {
        // Just select existing tag
        if (!formData.tags.includes(existingTag.name)) {
          createdTags.push(existingTag);
        }
      } else {
        // Create new tag
        const result = await createTag(tagName);
        if (result.success) {
          createdTags.push(result.data);
        }
      }
    }

    setIsCreatingTag(false);

    if (createdTags.length > 0) {
      // Add new tags to available tags
      setAvailableTags(prev => {
        const combined = [...prev, ...createdTags.filter(t => !prev.some(p => p.id === t.id))];
        return combined.sort((a, b) => a.name.localeCompare(b.name));
      });
      // Add all created/found tags to form
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, ...createdTags.map(t => t.name)],
      }));
    }

    setTagSearch('');
    setIsTagDropdownOpen(false);
  };

  const filteredTags = availableTags.filter(
    tag =>
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !formData.tags.includes(tag.name)
  );

  // Cover image handlers
  const handleCoverFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setCoverUploadError(null);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const result = await uploadBookCover(uploadFormData);

    setIsUploadingCover(false);

    if (result.success) {
      // Track old URL for cleanup
      if (formData.cover_image_url && formData.cover_image_url.includes('book-covers')) {
        setOldCoverUrl(formData.cover_image_url);
      }
      setFormData(prev => ({ ...prev, cover_image_url: result.url }));
    } else {
      setCoverUploadError(result.error);
    }

    // Reset file input
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = '';
    }
  };

  const handleCoverUrlAdd = () => {
    if (!coverUrlInput.trim()) return;
    // Track old URL for cleanup
    if (formData.cover_image_url && formData.cover_image_url.includes('book-covers')) {
      setOldCoverUrl(formData.cover_image_url);
    }
    setFormData(prev => ({ ...prev, cover_image_url: coverUrlInput.trim() }));
    setCoverUrlInput('');
    setIsAddingCoverUrl(false);
  };

  const handleCoverRemove = () => {
    // Track URL for cleanup
    if (formData.cover_image_url && formData.cover_image_url.includes('book-covers')) {
      setOldCoverUrl(formData.cover_image_url);
    }
    setFormData(prev => ({ ...prev, cover_image_url: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    if (formData.amazon_affiliate_link && !formData.amazon_affiliate_link.includes('amazon')) {
      newErrors.amazon_affiliate_link = 'Link must be an Amazon URL';
    }

    if (formData.cover_image_url && !isValidUrl(formData.cover_image_url)) {
      newErrors.cover_image_url = 'Invalid URL format';
    }

    if (formData.series_order !== null && formData.series_order < 1) {
      newErrors.series_order = 'Series order must be a positive number';
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
      ? await createBook(formData)
      : await updateBook(book!.id, formData);

    setIsSubmitting(false);

    if (result.success) {
      // Clean up old cover image if it was replaced
      if (oldCoverUrl) {
        deleteBookCover(oldCoverUrl).catch(() => {
          // Silently ignore cleanup errors
        });
      }
      router.push('/admin/books');
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {submitError}
        </div>
      )}

      {/* Title & Author */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title" required error={errors.title}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={cn(inputStyles, errors.title && 'border-red-500')}
            placeholder="Enter book title"
          />
        </FormField>

        <FormField label="Author" required error={errors.author}>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={cn(inputStyles, errors.author && 'border-red-500')}
            placeholder="Enter author name"
          />
        </FormField>
      </div>

      {/* Description */}
      <FormField
        label="Description"
        error={errors.description}
        hint={`${formData.description.length}/2000 characters`}
      >
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={cn(inputStyles, 'resize-none', errors.description && 'border-red-500')}
          placeholder="Enter book description"
        />
      </FormField>

      {/* Cover Image */}
      <FormField label="Cover Image" error={errors.cover_image_url || coverUploadError || undefined}>
        <div className="space-y-3">
          {/* Current cover preview */}
          {formData.cover_image_url && isValidUrl(formData.cover_image_url) && (
            <div className="relative inline-block group">
              <img
                src={formData.cover_image_url}
                alt="Cover preview"
                className="w-32 h-48 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={handleCoverRemove}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md border hover:bg-red-50 transition-colors"
                title="Remove cover"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}

          {/* Upload/URL input options */}
          {!formData.cover_image_url && (
            <>
              {isAddingCoverUrl ? (
                <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-3">
                  <input
                    type="url"
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                    placeholder="Enter image URL..."
                    className={inputStyles}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleCoverUrlAdd}
                      disabled={!coverUrlInput.trim()}
                    >
                      Add URL
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingCoverUrl(false);
                        setCoverUrlInput('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    disabled={isUploadingCover}
                    className={cn(
                      'flex-1 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500',
                      'hover:border-pink-300 hover:text-pink-500 transition-colors',
                      'flex items-center justify-center gap-2',
                      isUploadingCover && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Cover
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCoverUrl(true)}
                    className="flex-1 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-pink-300 hover:text-pink-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Link className="w-4 h-4" />
                    Paste URL
                  </button>
                </div>
              )}
            </>
          )}

          {/* Replace option when cover exists */}
          {formData.cover_image_url && (
            <div className="flex gap-2">
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => coverFileInputRef.current?.click()}
                disabled={isUploadingCover}
              >
                {isUploadingCover ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-1" />
                    Replace
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingCoverUrl(true)}
              >
                <Link className="w-4 h-4 mr-1" />
                Use URL
              </Button>
            </div>
          )}
        </div>
      </FormField>

      {/* Amazon Affiliate Link */}
      <FormField
        label="Amazon Affiliate Link"
        error={errors.amazon_affiliate_link}
        warning={duplicateWarning || undefined}
      >
        <input
          type="url"
          name="amazon_affiliate_link"
          value={formData.amazon_affiliate_link}
          onChange={handleChange}
          className={cn(inputStyles, errors.amazon_affiliate_link && 'border-red-500')}
          placeholder="https://amazon.com/..."
        />
      </FormField>

      {/* Genre */}
      <FormField label="Genre" required error={errors.genre}>
        <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className={cn(inputStyles, errors.genre && 'border-red-500')}
        >
          {GENRES.map(genre => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </FormField>

      {/* Tags */}
      <FormField label="Tags">
        <div className="space-y-2">
          {/* Selected tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="hover:text-pink-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag search input */}
          <div className="relative">
            <input
              type="text"
              value={tagSearch}
              onChange={(e) => {
                setTagSearch(e.target.value);
                setIsTagDropdownOpen(true);
              }}
              onFocus={() => setIsTagDropdownOpen(true)}
              className={inputStyles}
              placeholder="Search or add tags (comma-separated)..."
            />

            {/* Dropdown */}
            {isTagDropdownOpen && (tagSearch || filteredTags.length > 0) && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagSelect(tag.name)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-900"
                  >
                    {tag.name}
                  </button>
                ))}

                {tagSearch && (
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    disabled={isCreatingTag}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-pink-600 border-t"
                  >
                    {isCreatingTag ? 'Creating...' : tagSearch.includes(',')
                      ? `Add tags: ${tagSearch.split(',').map(t => t.trim()).filter(Boolean).join(', ')}`
                      : `Create "${tagSearch.toLowerCase().trim().replace(/\s+/g, '-')}"`}
                  </button>
                )}

                {!tagSearch && filteredTags.length === 0 && (
                  <div className="px-4 py-2 text-gray-500">No more tags available</div>
                )}
              </div>
            )}
          </div>

          {/* Click outside to close */}
          {isTagDropdownOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setIsTagDropdownOpen(false)}
            />
          )}
        </div>
      </FormField>

      {/* Spice Level */}
      <FormField label="Spice Level" required>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            {([0, 1, 2, 3] as SpiceLevel[]).map(level => (
              <button
                key={level}
                type="button"
                onClick={() => handleSpiceLevelChange(level)}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg border-2 transition-colors text-center',
                  formData.spice_level === level
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                <div className="text-2xl mb-1">
                  {'🌶️'.repeat(level) || '😇'}
                </div>
                <div className="text-sm font-medium">{SPICE_LABELS[level]}</div>
              </button>
            ))}
          </div>
        </div>
      </FormField>

      {/* Mature Themes */}
      <FormField label="">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="mature_themes"
            checked={formData.mature_themes}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
          <span className="text-gray-700">Contains mature themes</span>
        </label>
      </FormField>

      {/* Series Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Series Name">
          <input
            type="text"
            name="series_name"
            value={formData.series_name}
            onChange={handleChange}
            className={inputStyles}
            placeholder="e.g., The Bridgerton Series"
          />
        </FormField>

        <FormField label="Series Order" error={errors.series_order}>
          <input
            type="number"
            name="series_order"
            value={formData.series_order ?? ''}
            onChange={handleChange}
            min="1"
            className={cn(inputStyles, errors.series_order && 'border-red-500')}
            placeholder="e.g., 1"
          />
        </FormField>
      </div>

      {/* Published */}
      <FormField label="">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            checked={formData.is_published}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
          <span className="text-gray-700">Published (visible to users)</span>
        </label>
      </FormField>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Book' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/books')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Helper components
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  warning?: string;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, required, error, warning, hint, children }: FormFieldProps) {
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
      {warning && <p className="text-sm text-amber-600">{warning}</p>}
      {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

const inputStyles =
  'w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 ' +
  'focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ' +
  'placeholder:text-gray-400';
