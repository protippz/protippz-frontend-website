import { Crown, CrownIcon, Gift, Trophy, Users, Flame, Sparkles, ChevronRight, Heart, DollarSign } from 'lucide-react'
import React, { memo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { levelColors } from '@/components/community/data/mockData'
import { Post, User } from '@/types/community'

interface SidebarProps {
  topFans: User[]
  trendingPosts: Post[]
  isMobileDrawer?: boolean
  className?: string
  topOffset?: string
}

function Sidebar({ 
  topFans, 
  trendingPosts,
  isMobileDrawer = false,
  className = '',
  topOffset = 'lg:top-[176px]'
}: SidebarProps) {
  // Sticky container classes for desktop vs drawer container classes
  const containerClasses = isMobileDrawer 
    ? "space-y-4 sm:space-y-6" 
    : `lg:sticky ${topOffset} self-start w-full max-h-[calc(100vh-190px)] overflow-y-auto pr-2 pb-6 space-y-4 sm:space-y-6 custom-sidebar-scrollbar`

  return (
    <aside 
      data-lenis-prevent={!isMobileDrawer ? true : undefined}
      className={`${containerClasses} ${className}`}
    >
      <div className={isMobileDrawer ? "space-y-4 sm:space-y-6" : "space-y-4 sm:space-y-6"}>
        {/* Top Community Posts */}
        <div
          className="p-4 sm:p-5 lg:p-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
          style={{ backgroundColor: '#FAFBFB', border: '1px solid #233A6C12' }}
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#233A6C0F]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#308D6F15]">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#308D6F' }} />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight" style={{ color: '#233A6C' }}>
                Top Community Posts
              </h3>
            </div>
            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#308D6F15', color: '#308D6F' }}>
              <Flame className="w-3 h-3" />
              Hot
            </span>
          </div>

          <div className="space-y-3">
            {trendingPosts && trendingPosts.length > 0 ? (
              trendingPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="group p-2 -mx-2 rounded-xl transition-all duration-150 hover:bg-[#233A6C08] cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[10px] sm:text-xs font-extrabold mt-0.5 shrink-0 shadow-xs"
                      style={{ 
                        backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#308D6F', 
                        color: index <= 2 ? '#233A6C' : 'white' 
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold truncate group-hover:text-[#308D6F] transition-colors" style={{ color: '#233A6C' }}>
                        {post.user.name}
                      </p>
                      <p className="text-xs line-clamp-2 leading-relaxed mt-0.5" style={{ color: '#233A6C80' }}>
                        {post.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: '#308D6F15', color: '#308D6F' }}>
                          <DollarSign className="w-2.5 h-2.5" />
                          {post.tips} tips
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: '#233A6C0B', color: '#233A6C70' }}>
                          <Heart className="w-2.5 h-2.5" />
                          {post.likes} likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-center py-4" style={{ color: '#233A6C60' }}>
                No trending posts available.
              </p>
            )}
          </div>
        </div>

        {/* Top Fans This Week */}
        <div
          className="p-4 sm:p-5 lg:p-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
          style={{ backgroundColor: '#FAFBFB', border: '1px solid #233A6C12' }}
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#233A6C0F]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#308D6F15]">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#308D6F' }} />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight" style={{ color: '#233A6C' }}>
                Top Fans This Week
              </h3>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#233A6C0B', color: '#233A6C80' }}>
              Top 5
            </span>
          </div>

          <div className="space-y-2.5">
            {topFans && topFans.length > 0 ? (
              topFans.map((fan, index) => {
                const levelColor = levelColors[fan.level] || levelColors.Bronze

                return (
                  <div 
                    key={fan.id} 
                    className="flex items-center gap-2.5 sm:gap-3 p-2 -mx-2 rounded-xl transition-all duration-150 hover:bg-[#233A6C08] cursor-pointer group"
                  >
                    <div className="relative shrink-0">
                      <Avatar className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border border-[#233A6C15]">
                        <AvatarImage src={fan.avatar} alt={fan.name} />
                        <AvatarFallback>
                          <Users className="w-4 h-4 text-[#233A6C60]" />
                        </AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: '#F6E05E' }}
                        >
                          <CrownIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs sm:text-sm font-bold truncate group-hover:text-[#308D6F] transition-colors" style={{ color: '#233A6C' }}>
                          {fan.name}
                        </p>
                        <div
                          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: levelColor.bg, color: levelColor.text }}
                        >
                          {fan.level}
                        </div>
                      </div>
                      <p className="text-[10px] sm:text-xs font-medium flex items-center gap-1 mt-0.5" style={{ color: '#308D6F' }}>
                        <Sparkles className="w-3 h-3" />
                        {fan.xp.toLocaleString()} XP
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-xs text-center py-4" style={{ color: '#233A6C60' }}>
                No top fans found.
              </p>
            )}
          </div>
        </div>

        {/* Rewards Preview */}
        <div
          className="p-4 sm:p-5 lg:p-6 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md"
          style={{ backgroundColor: '#308D6F10', border: '1px solid #308D6F30' }}
        >
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#308D6F20]">
            <div className="p-1.5 rounded-lg bg-[#308D6F20]">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#308D6F' }} />
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight" style={{ color: '#233A6C' }}>
              Rewards Preview
            </h3>
          </div>

          <div className="space-y-3">
            <div
              className="p-3 rounded-xl transition-all hover:bg-white"
              style={{ backgroundColor: '#FAFBFB', border: '1px solid #233A6C12' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-bold" style={{ color: '#233A6C' }}>
                  Bronze Badge
                </span>
                <span className="text-xs font-semibold" style={{ color: '#308D6F' }}>
                  100 XP
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: '#233A6C0F' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: '75%', backgroundColor: '#FED7AA' }}
                />
              </div>
            </div>

            <div
              className="p-3 rounded-xl transition-all hover:bg-white"
              style={{ backgroundColor: '#FAFBFB', border: '1px solid #233A6C12' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-bold" style={{ color: '#233A6C' }}>
                  Silver Badge
                </span>
                <span className="text-xs font-semibold" style={{ color: '#308D6F' }}>
                  500 XP
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: '#233A6C0F' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: '30%', backgroundColor: '#CBD5E0' }}
                />
              </div>
            </div>
          </div>

          <button
            className="w-full mt-4 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#28795e] active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: '#308D6F' }}
          >
            View All Rewards
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default memo(Sidebar)