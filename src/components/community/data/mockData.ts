import { User, Post, Comment } from '@/types/community'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    level: 'Diamond',
    xp: 15420,
    badges: ['Top Fan', 'Early Supporter', 'Big Spender']
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    level: 'Platinum',
    xp: 12300,
    badges: ['Consistent', 'Rising Star']
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    level: 'Gold',
    xp: 8900,
    badges: ['Team Player']
  },
  {
    id: '4',
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/150?img=4',
    level: 'Silver',
    xp: 5600,
    badges: []
  },
  {
    id: '5',
    name: 'Jordan Taylor',
    avatar: 'https://i.pravatar.cc/150?img=5',
    level: 'Bronze',
    xp: 2100,
    badges: ['New Fan']
  }
]

const mockCommentsForPost1: Comment[] = [
  {
    id: 'c1',
    user: mockUsers[1],
    content: 'OMG yes! I was screaming at my television! Absolutely stellar performance by the team. 🔥🏀',
    timestamp: '1 minute ago',
    likes: 12,
    reactions: [
      { emoji: '🔥', count: 5, isReacted: true },
      { emoji: '🏀', count: 3, isReacted: false },
      { emoji: '👏', count: 2, isReacted: false },
    ],
  },
  {
    id: 'c2',
    user: mockUsers[2],
    content: 'That buzzer beater will go down in history. Unbelievable shot!',
    timestamp: 'Just now',
    likes: 5,
    reactions: [
      { emoji: '🏆', count: 4, isReacted: false },
      { emoji: '😱', count: 2, isReacted: true },
    ],
  }
]

const mockCommentsForPost2: Comment[] = [
  {
    id: 'c3',
    user: mockUsers[3],
    content: 'Wow, congratulations Sarah! Truly well deserved after all these years of support! 🎉',
    timestamp: '10 minutes ago',
    likes: 2,
    reactions: [
      { emoji: '🎉', count: 6, isReacted: true },
      { emoji: '❤️', count: 3, isReacted: false },
    ],
  }
]

export const mockPosts: Post[] = [
  {
    id: '1',
    user: mockUsers[0],
    content: 'Just witnessed an incredible game tonight! 🏀 The energy was electric and that last-minute buzzer beater was absolutely insane! Who else was watching? #Basketball #Goat',
    image: 'https://i.pinimg.com/736x/7c/8f/7d/7c8f7d9da38051f81935dc3d54b93311.jpg',
    timestamp: '2 minutes ago',
    likes: 142,
    comments: 2,
    commentsList: mockCommentsForPost1,
    tips: 850,
    isLiked: false,
    isTrending: true,
    taggedPlayer: 'LeBron James'
  },
  {
    id: '2',
    user: mockUsers[1],
    content: 'New reward unlocked! 🎉 Been supporting this team for 5 years and finally got the exclusive fan badge. The journey is worth it! #LoyaltyPaysOff',
    image: '/female-player.png',
    timestamp: '15 minutes ago',
    likes: 89,
    comments: 1,
    commentsList: mockCommentsForPost2,
    tips: 320,
    isLiked: true
  },
  {
    id: '3',
    user: mockUsers[2],
    content: 'That moment when your favorite player notices your comment in the livestream! 😱 Made my entire week! Small moments like these make being a fan so special.',
    timestamp: '1 hour ago',
    likes: 234,
    comments: 0,
    commentsList: [],
    tips: 1200,
    isLiked: false,
    isTrending: true
  },
  {
    id: '4',
    user: mockUsers[3],
    content: 'Pro tip: Always stay until the end of the game. You never know when you\'ll witness history! Tonight was one of those nights. 🏆',
    timestamp: '2 hours ago',
    likes: 67,
    comments: 0,
    commentsList: [],
    tips: 150,
    isLiked: false
  },
  {
    id: '5',
    user: mockUsers[4],
    content: 'Just joined the community! Super excited to connect with fellow fans and support our favorite athletes together. Any tips for a newbie? 🙏',
    timestamp: '3 hours ago',
    likes: 45,
    comments: 0,
    commentsList: [],
    tips: 80,
    isLiked: true
  }
]

export const levelColors: Record<string, { bg: string; text: string; border: string }> = {
  Diamond: { bg: '#B794F620', text: '#805AD5', border: '#B794F640' },
  Platinum: { bg: '#E2E8F0', text: '#4A5568', border: '#CBD5E0' },
  Gold: { bg: '#F6E05E20', text: '#D69E2E', border: '#F6E05E40' },
  Silver: { bg: '#E2E8F0', text: '#718096', border: '#CBD5E0' },
  Bronze: { bg: '#FED7AA', text: '#C05621', border: '#FDBA74' }
}
