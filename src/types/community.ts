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
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number // Count of comments
  commentsList?: Comment[] // List of actual comments
  tips: number
  isLiked: boolean
  isTrending?: boolean
  taggedPlayer?: string
}

export interface CreatePostData {
  content: string
  image?: string
  taggedPlayer?: string
}
