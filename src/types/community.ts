export type ContentCategory =
  | 'All'
  | 'Blog Article'
  | 'Press Release'
  | 'Company News'
  | 'Promotional Content'
  | 'Community Update'
  | 'Product Announcement';

export interface User {
  id: string
  name: string
  avatar: string
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  xp: number
  badges: string[]
}

export interface CommentReaction {
  emoji: string
  count: number
  isReacted?: boolean
}

export interface Comment {
  id: string
  user: User
  content: string
  timestamp: string
  likes: number
  reactions?: CommentReaction[]
}

export interface Post {
  id: string
  user: User
  title?: string
  category?: ContentCategory
  summary?: string
  readTime?: string
  authorRole?: string
  content: string
  image?: string
  videoUrl?: string
  videoEmbedCode?: string
  timestamp: string
  likes: number
  comments: number // Count of comments
  commentsList?: Comment[] // List of actual comments
  tips: number
  isLiked: boolean
  isTrending?: boolean
  taggedPlayer?: string
  tags?: string[]
}

export interface CreatePostData {
  content: string
  title?: string
  category?: ContentCategory
  image?: string
  taggedPlayer?: string
}

