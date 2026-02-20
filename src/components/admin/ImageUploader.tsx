'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Upload, Link, X, ChevronUp, ChevronDown, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { uploadCharacterImage } from '@/lib/actions/characters';
import type { CharacterImage } from '@/types';

interface ImageUploaderProps {
  value: CharacterImage[];
  onChange: (images: CharacterImage[]) => void;
  onRemove?: (removedUrl: string) => void;
  maxImages?: number;
  error?: string;
}

const inputStyles =
  'w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 ' +
  'focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ' +
  'placeholder:text-gray-400';

export function ImageUploader({
  value,
  onChange,
  onRemove,
  maxImages = 3,
  error,
}: ImageUploaderProps) {
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImageUrl = () => {
    if (!urlInput.trim()) return;

    const newImage: CharacterImage = {
      url: urlInput.trim(),
      is_primary: value.length === 0, // First image is primary by default
      sort_order: value.length,
    };

    onChange([...value, newImage]);
    setUrlInput('');
    setIsAddingUrl(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadCharacterImage(formData);

    setIsUploading(false);

    if (result.success) {
      const newImage: CharacterImage = {
        url: result.url,
        is_primary: value.length === 0,
        sort_order: value.length,
      };
      onChange([...value, newImage]);
    } else {
      setUploadError(result.error);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const removedImage = value[index];
    const updated = value.filter((_, i) => i !== index);
    // If we removed the primary image, make the first remaining image primary
    if (removedImage.is_primary && updated.length > 0) {
      updated[0] = { ...updated[0], is_primary: true };
    }
    // Update sort_order
    const reordered = updated.map((img, i) => ({ ...img, sort_order: i }));
    onChange(reordered);
    // Notify parent of removed image (for cleanup on save)
    if (onRemove) {
      onRemove(removedImage.url);
    }
  };

  const setPrimary = (index: number) => {
    const updated = value.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(updated);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= value.length) return;

    const updated = [...value];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    // Update sort_order
    const reordered = updated.map((img, i) => ({ ...img, sort_order: i }));
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Existing images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {value.map((image, index) => (
          <div
            key={index}
            className={cn(
              'relative group border-2 rounded-lg overflow-hidden',
              image.is_primary ? 'border-pink-500' : 'border-gray-200'
            )}
          >
            <div className="aspect-[3/4] bg-gray-100">
              <img
                src={image.url}
                alt={`Character image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            </div>

            {/* Primary badge */}
            {image.is_primary && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-pink-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Primary
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  className={cn(
                    'p-2 bg-white rounded-full hover:bg-gray-100 transition-colors',
                    index === 0 && 'opacity-30 cursor-not-allowed'
                  )}
                  title="Move left"
                >
                  <ChevronUp className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === value.length - 1}
                  className={cn(
                    'p-2 bg-white rounded-full hover:bg-gray-100 transition-colors',
                    index === value.length - 1 && 'opacity-30 cursor-not-allowed'
                  )}
                  title="Move right"
                >
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {!image.is_primary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Set as primary"
                  >
                    <Star className="w-4 h-4 text-gray-700" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add new image */}
      {value.length < maxImages && (
        <>
          {isAddingUrl ? (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-3">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter image URL..."
                className={inputStyles}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={addImageUrl}
                  disabled={!urlInput.trim()}
                >
                  Add URL
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingUrl(false);
                    setUrlInput('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={cn(
                  'flex-1 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500',
                  'hover:border-pink-300 hover:text-pink-500 transition-colors',
                  'flex items-center justify-center gap-2',
                  isUploading && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsAddingUrl(true)}
                className="flex-1 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-pink-300 hover:text-pink-500 transition-colors flex items-center justify-center gap-2"
              >
                <Link className="w-4 h-4" />
                Paste URL
              </button>
            </div>
          )}
        </>
      )}

      {/* Status messages */}
      {value.length >= maxImages && (
        <p className="text-sm text-amber-600">Maximum {maxImages} images reached</p>
      )}
      {value.length > 0 && (
        <p className="text-sm text-gray-500">
          {value.length}/{maxImages} images • Hover to reorder or set primary
        </p>
      )}
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
