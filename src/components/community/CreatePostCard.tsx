'use client'

import React, { useState, useRef } from 'react'
import {
  Image as ImageIcon,
  Tag,
  Smile,
  X,
  Send,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getLevelIcon } from './helpers'
import { mockUsers } from './data/mockData'
import { CreatePostData, Post } from '@/types/community'

interface CreatePostCardProps {
  onCreatePost: (newPostData: CreatePostData) => void
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({
  onCreatePost,
}) => {
  const currentUser = mockUsers[0] // Sarah Johnson (simulation)
  const [content, setContent] = useState('')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [taggedPlayer, setTaggedPlayer] = useState<string>('')
  const [showTagInput, setShowTagInput] = useState(false)
  const postImageRef = useRef<HTMLInputElement | null>(null)

  const handlePost = () => {
    if (!content.trim()) return

    onCreatePost({
      content,
      image: localPreview || undefined,
      taggedPlayer: taggedPlayer.trim() ? taggedPlayer : undefined,
    })

    // Reset Form
    setContent('')
    setLocalPreview(null)
    setTaggedPlayer('')
    setShowTagInput(false)
    setShowCreatePost(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setLocalPreview(previewUrl)
  }

  return (
    <div
      className="p-5 sm:p-6 rounded-2xl transition-all duration-300"
      style={{
        backgroundColor: '#FAFBFB',
        border: '2px solid #308D6F40',
        boxShadow: '0 4px 20px rgba(35,58,108,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10 border border-[#233A6C15]">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>
            <Users className="w-5 h-5 text-[#233A6C60]" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-sm sm:text-base" style={{ color: '#233A6C' }}>
            {currentUser.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="p-0.5 rounded-full bg-[#B794F620] text-[#805AD5]">
              {getLevelIcon(currentUser.level)}
            </span>
            <span className="text-[11px] font-bold" style={{ color: '#308D6F' }}>
              {currentUser.level}
            </span>
          </div>
        </div>
      </div>

      {/* Editor Textarea */}
      <textarea
        placeholder="What's on your mind? Share game analysis, loyalty rewards..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onClick={() => setShowCreatePost(true)}
        className="w-full p-3.5 rounded-xl resize-none outline-none text-sm transition-all duration-200"
        style={{
          backgroundColor: '#F0F2F5',
          border: '1px solid #233A6C15',
          color: '#233A6C',
          minHeight: showCreatePost ? '120px' : '56px',
        }}
        rows={showCreatePost ? 4 : 2}
      />

      {/* Tag Player Input */}
      {showTagInput && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type player name (e.g. LeBron James)..."
            value={taggedPlayer}
            onChange={(e) => setTaggedPlayer(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg outline-none border"
            style={{
              backgroundColor: '#FAFBFB',
              borderColor: '#233A6C20',
              color: '#233A6C',
            }}
          />
          <button
            onClick={() => {
              setTaggedPlayer('')
              setShowTagInput(false)
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Image Preview */}
      {localPreview && (
        <div className="relative mt-4 rounded-xl overflow-hidden group">
          <Image
            width={600}
            height={350}
            src={localPreview}
            alt="Upload Preview"
            className="w-full h-auto max-h-[350px] object-cover rounded-xl border border-gray-100"
          />
          <button
            onClick={() => setLocalPreview(null)}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer transition-colors shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Actions and Buttons */}
      {showCreatePost && (
        <div className="mt-4 space-y-3 pt-3 border-t border-[#233A6C0F]">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => postImageRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-[#233A6C0B] active:scale-95"
              style={{ backgroundColor: '#233A6C0F', color: '#233A6C' }}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Upload reward photo
            </button>
            <input
              type="file"
              ref={postImageRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />

            <button
              onClick={() => setShowTagInput(!showTagInput)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-[#233A6C0B] active:scale-95"
              style={{ backgroundColor: '#233A6C0F', color: '#233A6C' }}
            >
              <Tag className="w-3.5 h-3.5" />
              Tag player
            </button>

            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-[#233A6C0B] active:scale-95"
              style={{ backgroundColor: '#233A6C0F', color: '#233A6C' }}
            >
              <Smile className="w-3.5 h-3.5" />
              Add emoji
            </button>
          </div>

          <div className="flex items-center gap-2 justify-end pt-1">
            <button
              onClick={() => {
                setShowCreatePost(false)
                setLocalPreview(null)
                setTaggedPlayer('')
                setShowTagInput(false)
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-gray-200 active:scale-95"
              style={{ backgroundColor: '#E2E8F0', color: '#4A5568' }}
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
              style={{ backgroundColor: '#308D6F' }}
            >
              <Send className="w-3.5 h-3.5" />
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatePostCard
