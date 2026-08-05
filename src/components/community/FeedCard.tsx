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
  Clock,
  Newspaper,
  BookOpen,
  Megaphone,
  Sparkles,
  Building,
  Radio,
} from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getLevelIcon } from './helpers'
import { levelColors, categoryStyles } from './data/mockData'
import { Post, ContentCategory } from '@/types/community'

interface FeedCardProps {
  post: Post
  onLike: (postId: string) => void
  onTip: (postId: string) => void
  onCommentClick: (post: Post) => void
}

const getCategoryIcon = (category?: ContentCategory) => {
  switch (category) {
    case 'Blog Article':
      return <BookOpen className="w-3 h-3" />
    case 'Press Release':
      return <Newspaper className="w-3 h-3" />
    case 'Company News':
      return <Building className="w-3 h-3" />
    case 'Promotional Content':
      return <Sparkles className="w-3 h-3" />
    case 'Community Update':
      return <Radio className="w-3 h-3" />
    case 'Product Announcement':
      return <Megaphone className="w-3 h-3" />
    default:
      return null
  }
}

export const FeedCard: React.FC<FeedCardProps> = ({
  post,
  onLike,
  onTip,
  onCommentClick,
}) => {
  const levelColor = levelColors[post.user.level] || levelColors.Bronze
  const catStyle = post.category ? categoryStyles[post.category] : null

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof window !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: post.title || post.content,
          text: post.summary || post.content,
          url: window.location.href,
        })
        .catch((err) => console.log('Error sharing:', err))
    }
  }

  return (
    <div
      onClick={() => onCommentClick(post)}
      className="p-3.5 sm:p-5 md:p-6 rounded-2xl transition-all duration-300 hover:shadow-xl border cursor-pointer group bg-white"
      style={{
        borderColor: '#233A6C15',
        boxShadow: '0 4px 20px 0 rgba(35,58,108,0.04)',
      }}
    >
      {/* Category & Badge Bar */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap mb-2.5 sm:mb-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.category && catStyle && (
            <span
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide"
              style={{
                backgroundColor: catStyle.bg,
                color: catStyle.text,
                border: `1px solid ${catStyle.border}`,
              }}
            >
              {getCategoryIcon(post.category)}
              {post.category}
            </span>
          )}

          {post.isTrending && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
              style={{ backgroundColor: '#F6E05E20', color: '#D69E2E' }}
            >
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Trending
            </span>
          )}
        </div>

        {post.readTime && (
          <span className="flex items-center gap-1 text-[11px] sm:text-xs text-[#233A6C60] font-medium">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {post.readTime}
          </span>
        )}
      </div>

      {/* Title */}
      {post.title && (
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#233A6C] mb-1.5 sm:mb-2 group-hover:text-[#308D6F] transition-colors leading-snug">
          {post.title}
        </h2>
      )}

      {/* Post Author / Publisher Info */}
      <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4 pt-0.5">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border border-[#233A6C15] shrink-0">
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback>
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#233A6C60]" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-xs sm:text-sm text-[#233A6C] truncate max-w-[140px] sm:max-w-none">
              {post.user.name}
            </h3>
            {post.authorRole && (
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#308D6F] bg-[#308D6F10] px-1.5 py-0.5 rounded-md truncate max-w-[120px] sm:max-w-none">
                {post.authorRole}
              </span>
            )}
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold shrink-0"
              style={{
                backgroundColor: levelColor.bg,
                color: levelColor.text,
                border: `1px solid ${levelColor.border}`,
              }}
            >
              {getLevelIcon(post.user.level)}
              {post.user.level}
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-[#233A6C60] mt-0.5">{post.timestamp}</p>
        </div>
      </div>

      {/* Summary / Body Content */}
      <div className="mb-3 sm:mb-4">
        {post.summary && (
          <p className="text-xs sm:text-sm md:text-base font-medium text-[#233A6C80] mb-1.5 italic leading-relaxed">
            {post.summary}
          </p>
        )}
        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-[#233A6C] whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap mt-2.5 sm:mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-xs font-semibold text-[#308D6F] bg-[#308D6F12] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.taggedPlayer && (
          <div className="flex items-center gap-1 mt-2">
            <Tag className="w-3 h-3 text-[#308D6F]" />
            <span className="text-[11px] sm:text-xs font-semibold text-[#308D6F]">
              {post.taggedPlayer}
            </span>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {post.image && (
        <div className="mb-3 sm:mb-4 rounded-xl overflow-hidden bg-black/5 border border-[#233A6C10]">
          <Image
            src={post.image}
            alt="Media visual content"
            width={700}
            height={360}
            className="w-full h-auto max-h-[260px] sm:max-h-[380px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div
        className="flex items-center justify-between mb-2.5 sm:mb-3 pb-2.5 sm:pb-3 border-b"
        style={{ borderColor: '#233A6C0F' }}
      >
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-medium">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[#233A6C]">{post.likes}</span>
            <span className="text-[#233A6C60]">likes</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-[#233A6C]">{post.comments}</span>
            <span className="text-[#233A6C60]">comments</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-[#308D6F]">${post.tips}</span>
            <span className="text-[#233A6C60]">tips</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 w-full pt-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onLike(post.id)
          }}
          className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold transition-colors min-h-[32px] sm:min-h-[36px] ${
            post.isLiked ? 'text-white' : ''
          }`}
          style={{
            backgroundColor: post.isLiked ? '#308D6F' : '#233A6C0F',
            color: post.isLiked ? '#fff' : '#233A6C',
          }}
        >
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill={post.isLiked ? 'white' : 'none'} />
          <span className="truncate">Like</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onCommentClick(post)
          }}
          className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold transition-colors hover:bg-[#233A6C0B] min-h-[32px] sm:min-h-[36px]"
          style={{ backgroundColor: '#233A6C0F', color: '#233A6C' }}
        >
          <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Comment</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onTip(post.id)
          }}
          className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold text-white transition-opacity hover:opacity-90 min-h-[32px] sm:min-h-[36px]"
          style={{ backgroundColor: '#308D6F' }}
        >
          <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Tip</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg text-[10px] sm:text-xs font-bold transition-colors hover:bg-[#233A6C0B] min-h-[32px] sm:min-h-[36px]"
          style={{ backgroundColor: '#233A6C0F', color: '#233A6C' }}
        >
          <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Share</span>
        </button>
      </div>
    </div>
  )
}

export default FeedCard
