'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  error?: string;
  disabled?: boolean;
}

const inputStyles =
  'w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 ' +
  'focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ' +
  'placeholder:text-gray-400';

export function TagInput({
  value,
  onChange,
  placeholder = 'Type and press Enter to add',
  maxTags = 10,
  error,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(value[value.length - 1]);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (value.length >= maxTags) return;
    if (value.includes(trimmed)) {
      setInputValue('');
      return;
    }

    onChange([...value, trimmed]);
    setInputValue('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-1">
      <div
        onClick={handleContainerClick}
        className={cn(
          'min-h-[42px] px-2 py-1 border rounded-lg flex flex-wrap gap-2 items-center cursor-text',
          'focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-pink-500',
          error ? 'border-red-500' : 'border-gray-300',
          disabled && 'bg-gray-100 cursor-not-allowed'
        )}
      >
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-100 text-pink-800 rounded-full text-sm"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="hover:text-pink-600 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || value.length >= maxTags}
          className={cn(
            'flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 placeholder:text-gray-400',
            'disabled:cursor-not-allowed'
          )}
        />
      </div>
      {value.length >= maxTags && (
        <p className="text-sm text-amber-600">Maximum {maxTags} tags reached</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
