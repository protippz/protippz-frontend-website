export type ContentCategory =
  | 'All'
  | 'Blog Article'
  | 'Press Release'
  | 'Company News'
  | 'Promotional Content'
  | 'Community Update'
  | 'Product Announcement';

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  xp: number;
  badges: string[];
}

export interface CommentReaction {
  emoji: string;
  count: number;
  isReacted?: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  parentId?: string;
  replies?: Comment[];
  reactions?: CommentReaction[];
}

export interface Post {
  id: string;
  user: User;
  title?: string;
  category?: ContentCategory;
  summary?: string;
  readTime?: string;
  authorRole?: string;
  content: string;
  image?: string;
  videoUrl?: string;
  videoEmbedCode?: string;
  timestamp: string;
  likes: number;
  comments: number; // Count of comments
  commentsList?: Comment[]; // List of actual comments
  tips: number;
  isLiked: boolean;
  isTrending?: boolean;
  slug?: string;
  taggedPlayer?: string;
  tags?: string[];
}

export interface CreatePostData {
  content: string;
  title?: string;
  category?: ContentCategory;
  image?: string;
  taggedPlayer?: string;
}

export interface MetaPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface CommunityPostBackendItem {
  _id: string;
  category?: ContentCategory | string;
  title?: string;
  description: string;
  images?: string[];
  video_url?: string;
  slug?: string;
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  featuredImageAlt?: string;
  canonicalUrl?: string;
  likers?: string[];
  totalView?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  totalComment?: number;
  totalLikers?: number;
  isLiked?: boolean;
  user?: Partial<User>;
}

export interface BackendCommentItem {
  _id: string;
  communityPost?: string;
  user?: Partial<User> | string;
  commentor?: {
    _id?: string;
    id?: string;
    name?: string;
    username?: string;
    profile_image?: string;
    avatar?: string;
  };
  commentorFormatted?: {
    _id?: string;
    id?: string;
    name?: string;
    username?: string;
    profile_image?: string;
    avatar?: string;
    role?: string;
  };
  text?: string;
  content?: string;
  parent?: string | null;
  rootId?: string | null;
  likes?: number;
  totalLikers?: number;
  likers?: string[];
  isLiked?: boolean;
  replies?: BackendCommentItem[];
  firstReplies?: BackendCommentItem[];
  reactions?: CommentReaction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CommunityPostApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    meta?: MetaPagination;
    result?: CommunityPostBackendItem[];
  };
}

export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const mapBackendItemToPost = (item?: CommunityPostBackendItem): Post => {
  const defaultUser: User = {
    id: item?.user?.id || item?._id || 'unknown_id',
    name: item?.user?.name || 'ProTippz Team',
    avatar:
      item?.user?.avatar ||
      'http://dsuotz3idqy4q.cloudfront.net/uploads/images/og_images/1787317787613-logo.bacbe230.png',
    level: item?.user?.level || 'Gold',
    xp: item?.user?.xp || 500,
    badges: item?.user?.badges || ['Official'],
  };

  const image =
    (item?.images && item?.images?.length > 0 ? item?.images?.[0] : null) ||
    item?.ogImage ||
    undefined;

  return {
    id: item?._id || String(Math.random()),
    user: defaultUser,
    title: item?.title,
    category: (item?.category as ContentCategory) || undefined,
    summary: item?.metaDescription,
    content: item?.description || '',
    image,
    videoUrl: item?.video_url,
    timestamp: formatRelativeTime(item?.createdAt),
    likes: item?.totalLikers ?? item?.likers?.length ?? 0,
    comments: item?.totalComment ?? 0,
    tips: 0,
    isLiked: Boolean(item?.isLiked),
    slug: item?.slug,
  };
};

export const mapBackendCommentToComment = (item?: BackendCommentItem): Comment => {
  const commentorObj =
    item?.commentorFormatted ||
    item?.commentor ||
    (typeof item?.user === 'object' ? item?.user : null);

  const userObj: User =
    commentorObj && typeof commentorObj === 'object'
      ? {
          id: (commentorObj as any).id || (commentorObj as any)._id || 'user_id',
          name: (commentorObj as any).name || (commentorObj as any).username || 'Community Member',
          avatar:
            (commentorObj as any).profile_image ||
            (commentorObj as any).avatar ||
            'http://dsuotz3idqy4q.cloudfront.net/uploads/images/og_images/1787317787613-logo.bacbe230.png',
          level: (commentorObj as any).level || 'Bronze',
          xp: (commentorObj as any).xp || 100,
          badges: (commentorObj as any).badges || [],
        }
      : {
          id: typeof item?.user === 'string' ? item.user : 'user_id',
          name: 'Community Member',
          avatar:
            'http://dsuotz3idqy4q.cloudfront.net/uploads/images/og_images/1787317787613-logo.bacbe230.png',
          level: 'Bronze',
          xp: 100,
          badges: [],
        };

  const rawReplies = item?.firstReplies || item?.replies || [];

  return {
    id: item?._id || String(Math.random()),
    user: userObj,
    content: item?.text || item?.content || '',
    timestamp: formatRelativeTime(item?.createdAt),
    likes: item?.totalLikers ?? item?.likes ?? item?.likers?.length ?? 0,
    isLiked: Boolean(item?.isLiked),
    parentId: item?.parent || undefined,
    replies: rawReplies.map(mapBackendCommentToComment),
    reactions: item?.reactions,
  };
};
