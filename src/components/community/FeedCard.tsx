'use client'

import React from 'react'
import {
  Heart,
  MessageCircle,
  DollarSign,
  Share2,
  TrendingUp,
  Tag,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getLevelIcon } from './helpers'
import { levelColors } from './data/mockData'
import { Post } from '@/types/community'

interface FeedCardProps {
  post: Post
  onLike: (postId: string) => void
  onTip: (postId: string) => void
  onCommentClick: (post: Post) => void
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  onLike,
  onTip,
  onCommentClick,
}) => {
  const levelColor = levelColors[post.user.level] || levelColors.Bronze

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.content,
        text: post.content,
        url: window.location.href,
      }).catch((err) => console.log('Error sharing:', err))
    }
  }

  return (
    <div
      onClick={() => onCommentClick(post)}
      className="p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg border cursor-pointer group"
      style={{
        backgroundColor: '#FAFBFB',
        borderColor: '#233A6C1A',
        boxShadow: '0 2px 16px 0 rgba(35,58,108,0.05)',
      }}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-[#233A6C15]">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>
              <Users className="w-5 h-5 text-[#233A6C60]" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base text-[#233A6C]">
                {post.user.name}
              </h3>
              <div
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold"
                style={{
                  backgroundColor: levelColor.bg,
                  color: levelColor.text,
                  border: `1px solid ${levelColor.border}`,
                }}
              >
                {getLevelIcon(post.user.level)}
                {post.user.level}
              </div>
              {post.isTrending && (
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  style={{ backgroundColor: '#F6E05E20', color: '#D69E2E' }}
                >
                  <TrendingUp className="w-2.5 h-2.5" />
                  Trending
                </div>
              )}
            </div>
            <p className="text-xs mt-0.5 text-[#233A6C60]">
              {post.timestamp}
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-sm sm:text-base leading-relaxed text-[#233A6C] whitespace-pre-wrap group-hover:text-black transition-colors">
          {post.content}
        </p>
        {post.taggedPlayer && (
          <div className="flex items-center gap-1 mt-2.5">
            <Tag className="w-3.5 h-3.5 text-[#308D6F]" />
            <span className="text-xs font-semibold text-[#308D6F]">
              {post.taggedPlayer}
            </span>
          </div>
        )}
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mb-4 rounded-xl overflow-hidden bg-black/5">
          <Image
            src={post.image}
            alt="Post content visualization"
            width={600}
            height={300}
            className="w-full h-auto max-h-[380px] object-cover rounded-xl"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div
        className="flex items-center justify-between mb-3 pb-3 border-b"
        style={{ borderColor: '#233A6C0F' }}
      >
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#233A6C]">{post.likes}</span>
            <span className="text-[#233A6C60]">likes</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#233A6C]">{post.comments}</span>
            <span className="text-[#233A6C60]">comments</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#308D6F]">${post.tips}</span>
            <span className="text-[#233A6C60]">tips</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Responsive mobile layout */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full pt-1">
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onLike(post.id)
          }}
          className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold transition-colors min-h-[36px] ${
            post.isLiked ? 'text-white' : ''
          }`}
          style={{
            backgroundColor: post.isLiked ? '#308D6F' : '#233A6C0F',
            color: post.isLiked ? '#fff' : '#233A6C',
          }}
        >
          <Heart className="w-3.5 h-3.5 shrink-0" fill={post.isLiked ? 'white' : 'none'} />
          <span className="truncate">Like</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCommentClick(post)
          }}
          className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold transition-colors hover:bg-[#233A6C0B] min-h-[36px]"
          style={{ backgroundColor: '#233A6C0F', color: '#233A6C' }}
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Comment</span>
        </button>

        {/* Send Tip Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onTip(post.id)
          }}
          className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold text-white transition-opacity hover:opacity-90 min-h-[36px]"
          style={{ backgroundColor: '#308D6F' }}
        >
          <DollarSign className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Tip</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold transition-colors hover:bg-[#233A6C0B] min-h-[36px]"
          style={{ backgroundColor: '#233A6C0F', color: '#233A6C' }}
        >
          <Share2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Share</span>
        </button>
      </div>
    </div>
  )
}

export default FeedCard
