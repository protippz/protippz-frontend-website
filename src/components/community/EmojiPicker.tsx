'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Smile, Flame, Heart, Trophy, ThumbsUp } from 'lucide-react'

interface EmojiPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelectEmoji: (emoji: string) => void
  align?: 'left' | 'right'
}

interface EmojiCategory {
  id: string
  name: string
  icon: React.ReactNode
  emojis: string[]
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'quick',
    name: 'Top Reactions',
    icon: <Flame className="w-3.5 h-3.5" />,
    emojis: ['🔥', '❤️', '👍', '😂', '🎉', '⚽', '🏀', '🏆', '🚀', '👏', '🎯', '💯'],
  },
  {
    id: 'faces',
    name: 'Smileys',
    icon: <Smile className="w-3.5 h-3.5" />,
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
      '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪',
      '😎', '🥳', '🤩', '🤐', '🤨', '🧐', '🤓', '🤯', '😱', '🤩',
    ],
  },
  {
    id: 'hands',
    name: 'Gestures',
    icon: <ThumbsUp className="w-3.5 h-3.5" />,
    emojis: [
      '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪',
      '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '👊',
    ],
  },
  {
    id: 'sports',
    name: 'Sports & Trophy',
    icon: <Trophy className="w-3.5 h-3.5" />,
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🏓', '🏸', '🏒', '🥊', '🥋', '🛹', '🏋️', '🏆', '🥇', '🥈',
      '🥉', '🏅', '🎖️', '🎯', '⚡', '🔥',
    ],
  },
  {
    id: 'hearts',
    name: 'Hearts & Vibes',
    icon: <Heart className="w-3.5 h-3.5" />,
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖',
      '💗', '💓', '💞', '💕', '✨', '🌟', '⭐', '💥', '🎉', '🎊',
    ],
  },
]

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
  align = 'right',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('quick')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const pickerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Filter emojis based on search
  const currentCategoryObj = EMOJI_CATEGORIES.find((c) => c.id === activeCategory) || EMOJI_CATEGORIES[0]

  const displayEmojis = searchQuery.trim()
    ? EMOJI_CATEGORIES.flatMap((cat) => cat.emojis).filter((emoji) =>
        emoji.includes(searchQuery.trim())
      )
    : currentCategoryObj.emojis

  return (
    <div
      ref={pickerRef}
      className={`absolute bottom-full mb-2 ${
        align === 'right' ? 'right-0' : 'left-0'
      } z-50 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#05369718] overflow-hidden flex flex-col animate-in fade-in duration-150`}
      style={{ maxHeight: '320px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Search & Close */}
      <div className="p-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search emoji..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-gray-200 outline-none text-[#053697] focus:border-[#2FC191]"
          />
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors"
          type="button"
          aria-label="Close emoji picker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs (shown if no search query) */}
      {!searchQuery.trim() && (
        <div className="flex items-center justify-around px-2 py-1.5 border-b border-gray-100 bg-white">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                activeCategory === cat.id
                  ? 'bg-[#2FC19115] text-[#2FC191]'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={cat.name}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid Container */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <div className="grid grid-cols-6 sm:grid-cols-7 gap-1">
          {displayEmojis.length > 0 ? (
            displayEmojis.map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                type="button"
                onClick={() => {
                  onSelectEmoji(emoji)
                }}
                className="w-9 h-9 flex items-center justify-center text-xl rounded-xl hover:bg-[#2FC19112] transition-colors"
              >
                {emoji}
              </button>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-xs text-gray-400">
              No emojis found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmojiPicker
