'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CharacterPrompt } from '@/types';

interface PromptEditorProps {
  value: CharacterPrompt[];
  onChange: (prompts: CharacterPrompt[]) => void;
  maxPrompts?: number;
  error?: string;
}

const PROMPT_OPTIONS = [
  "The way to win me over is...",
  "My biggest green flag is...",
  "A perfect day for me is...",
  "I'm looking for someone who...",
  "My love language is...",
  "The most spontaneous thing I've done is...",
  "I geek out on...",
  "My simple pleasures are...",
  "I'm convinced that...",
  "Together, we could...",
];

const inputStyles =
  'w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 ' +
  'focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ' +
  'placeholder:text-gray-400';

export function PromptEditor({
  value,
  onChange,
  maxPrompts = 5,
  error,
}: PromptEditorProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPromptType, setNewPromptType] = useState<'predefined' | 'custom'>('predefined');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const addPrompt = () => {
    const prompt = newPromptType === 'predefined' ? selectedPrompt : customPrompt;
    if (!prompt.trim()) return;

    onChange([...value, { prompt: prompt.trim(), answer: '' }]);
    setIsAddingNew(false);
    setSelectedPrompt('');
    setCustomPrompt('');
  };

  const updatePromptAnswer = (index: number, answer: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], answer };
    onChange(updated);
  };

  const removePrompt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const movePrompt = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= value.length) return;

    const updated = [...value];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  // Filter out prompts that are already used
  const availablePrompts = PROMPT_OPTIONS.filter(
    p => !value.some(v => v.prompt === p)
  );

  return (
    <div className="space-y-4">
      {/* Existing prompts */}
      {value.map((prompt, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {prompt.prompt}
              </p>
              <textarea
                value={prompt.answer}
                onChange={(e) => updatePromptAnswer(index, e.target.value)}
                placeholder="Enter your answer..."
                rows={2}
                className={cn(inputStyles, 'resize-none text-sm')}
              />
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => movePrompt(index, 'up')}
                disabled={index === 0}
                className={cn(
                  'p-1 rounded hover:bg-gray-200 transition-colors',
                  index === 0 && 'opacity-30 cursor-not-allowed'
                )}
                title="Move up"
              >
                <ChevronUp className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => movePrompt(index, 'down')}
                disabled={index === value.length - 1}
                className={cn(
                  'p-1 rounded hover:bg-gray-200 transition-colors',
                  index === value.length - 1 && 'opacity-30 cursor-not-allowed'
                )}
                title="Move down"
              >
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => removePrompt(index)}
                className="p-1 rounded hover:bg-red-100 transition-colors"
                title="Remove prompt"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add new prompt */}
      {value.length < maxPrompts && (
        <>
          {isAddingNew ? (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="promptType"
                    checked={newPromptType === 'predefined'}
                    onChange={() => setNewPromptType('predefined')}
                    className="text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Predefined</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="promptType"
                    checked={newPromptType === 'custom'}
                    onChange={() => setNewPromptType('custom')}
                    className="text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Custom</span>
                </label>
              </div>

              {newPromptType === 'predefined' ? (
                <select
                  value={selectedPrompt}
                  onChange={(e) => setSelectedPrompt(e.target.value)}
                  className={inputStyles}
                >
                  <option value="">Select a prompt...</option>
                  {availablePrompts.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter custom prompt..."
                  className={inputStyles}
                />
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={addPrompt}
                  disabled={newPromptType === 'predefined' ? !selectedPrompt : !customPrompt.trim()}
                >
                  Add Prompt
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingNew(false);
                    setSelectedPrompt('');
                    setCustomPrompt('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-pink-300 hover:text-pink-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Prompt ({value.length}/{maxPrompts})
            </button>
          )}
        </>
      )}

      {value.length >= maxPrompts && (
        <p className="text-sm text-amber-600">Maximum {maxPrompts} prompts reached</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
