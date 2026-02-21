'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { CharacterWithBook } from '@/types/character';

interface MatchModalProps {
  isOpen: boolean;
  character: CharacterWithBook | null;
  onClose: () => void;
  onSeeBook: () => void;
}

const confettiEmojis = ['💕', '✨', '💖', '🌸', '💗', '💝'];

export function MatchModal({ isOpen, character, onClose, onSeeBook }: MatchModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!character) return null;

  const primaryImage = character.images.find((img) => img.is_primary)?.url
    ?? character.images[0]?.url
    ?? null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative z-10 w-full max-w-sm mx-4 bg-surface rounded-card p-6 shadow-match text-center overflow-hidden"
          >
            {/* Confetti */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiEmojis.map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ y: -20, x: `${15 + i * 15}%`, opacity: 0 }}
                  animate={{
                    y: ['0%', '100%'],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.15,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="absolute text-2xl"
                  style={{ left: `${10 + i * 14}%` }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>

            {/* Pulsing Hearts Background */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-4 left-4 text-3xl opacity-30"
            >
              💗
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
              className="absolute top-6 right-6 text-2xl opacity-30"
            >
              💕
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold bg-gradient-to-r from-primary to-primary-warm bg-clip-text text-transparent mb-2"
            >
              You Matched!
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-text-muted font-semibold mb-6"
            >
              {character.name} wants to meet you
            </motion.p>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-4 mb-4"
            >
              {/* Character Image */}
              <div className="relative w-[145px] h-[205px] rounded-xl overflow-hidden shadow-card">
                {primaryImage ? (
                  <Image
                    src={primaryImage}
                    alt={character.name}
                    fill
                    className="object-cover"
                    sizes="145px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-light to-peach flex items-center justify-center">
                    <span className="text-4xl">💕</span>
                  </div>
                )}
              </div>

              {/* Book Cover */}
              <div className="relative w-[145px] h-[205px] rounded-xl overflow-hidden shadow-card">
                {character.book.cover_image_url ? (
                  <Image
                    src={character.book.cover_image_url}
                    alt={character.book.title}
                    fill
                    className="object-cover"
                    sizes="145px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-light to-peach flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Book Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-text font-bold">{character.book.title}</p>
              <p className="text-text-muted text-sm">by {character.book.author}</p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <button
                onClick={onSeeBook}
                className={cn(
                  'w-full py-3.5 rounded-button font-bold text-white',
                  'bg-gradient-to-r from-primary to-primary-warm',
                  'shadow-card transition-all duration-300 ease-bouncy',
                  'hover:scale-[1.02] hover:shadow-card-hover',
                  'active:scale-[0.98]'
                )}
              >
                See the Book
              </button>
              <button
                onClick={onClose}
                className={cn(
                  'w-full py-3 rounded-button font-semibold',
                  'text-text-muted bg-gray-100',
                  'transition-all duration-300 ease-bouncy',
                  'hover:bg-gray-200',
                  'active:scale-[0.98]'
                )}
              >
                Keep Swiping
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
