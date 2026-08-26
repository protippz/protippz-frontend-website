import { User, Post, Comment } from "@/types/community";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: "Diamond",
    xp: 15420,
    badges: ["Top Fan", "Early Supporter", "Big Spender"],
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: "Platinum",
    xp: 12300,
    badges: ["Consistent", "Rising Star"],
  },
  {
    id: "3",
    name: "ProTippz Editorial",
    avatar: "https://i.pravatar.cc/150?img=60",
    level: "Diamond",
    xp: 99999,
    badges: ["Official Account", "Verified Press"],
  },
  {
    id: "4",
    name: "Alex Rivera",
    avatar: "https://i.pravatar.cc/150?img=4",
    level: "Silver",
    xp: 5600,
    badges: [],
  },
  {
    id: "5",
    name: "ProTippz Team",
    avatar: "https://i.pravatar.cc/150?img=68",
    level: "Diamond",
    xp: 88888,
    badges: ["Official Team"],
  },
];

const mockCommentsForPost1: Comment[] = [
  {
    id: "c1",
    user: mockUsers[1],
    content:
      "This new instant payout feature is a total game changer for fans and players! 🔥🏀",
    timestamp: "10 minutes ago",
    likes: 18,
    isLiked: true,
    reactions: [
      { emoji: "🔥", count: 8, isReacted: true },
      { emoji: "🏀", count: 4, isReacted: false },
    ],
    replies: [
      {
        id: "r1",
        user: mockUsers[2],
        content:
          "Appreciate the support Mike! We've worked hard to bring sub-second payouts live.",
        timestamp: "5 minutes ago",
        likes: 7,
        isLiked: false,
        reactions: [{ emoji: "❤️", count: 3, isReacted: false }],
      },
      {
        id: "r2",
        user: mockUsers[0],
        content:
          "Tested it yesterday during the game, payout hit my account instantly! ⚡",
        timestamp: "2 minutes ago",
        likes: 4,
        isLiked: true,
        reactions: [{ emoji: "🙌", count: 2, isReacted: true }],
      },
    ],
  },
];

export const mockPosts: Post[] = [
  {
    id: "v1",
    user: mockUsers[2],
    category: "Product Announcement",
    title: "ProTippz Platform Showcase & Feature Breakdown",
    summary:
      "Watch our official product walkthrough video explaining how sports fans and athletes connect through micro-tipping.",
    content:
      "Check out our latest video overview! We demonstrate the complete fan-to-athlete tipping flow, instant withdrawal setup for players, and custom team reward leaderboards. Watch the full breakdown above and let us know your thoughts in the comments!",
    videoEmbedCode:
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/y8p4wNuPr0U?rel=0&modestbranding=1&controls=1&fs=1&iv_load_policy=3&playsinline=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen> </iframe>',
    timestamp: "30 minutes ago",
    readTime: "4 min video",
    authorRole: "Product Media Team",
    likes: 489,
    comments: 12,
    commentsList: mockCommentsForPost1,
    tips: 1890,
    isLiked: true,
    isTrending: true,
    tags: ["ProductVideo", "PlatformShowcase", "Tutorial"],
  },
  {
    id: "1",
    user: mockUsers[2],
    category: "Product Announcement",
    title: "Introducing Instant Fan-to-Player Tipping v2.0",
    summary:
      "We're thrilled to announce the official rollout of real-time micro-tipping with zero transaction delay.",
    content:
      "We are excited to launch ProTippz v2.0! Our engineering team has rebuilt the core micro-payment engine from the ground up. Fans can now tip their favorite athletes during live games with instantaneous verification and reduced fee structures. Check out the full release notes below and update your app today!",
    image: "/new/post1.png",
    timestamp: "1 hour ago",
    readTime: "3 min read",
    authorRole: "Product Lead @ ProTippz",
    likes: 342,
    comments: 1,
    commentsList: mockCommentsForPost1,
    tips: 1450,
    isLiked: true,
    isTrending: true,
    tags: ["ProductUpdate", "Fintech", "LiveTipping"],
  },
  {
    id: "v2",
    user: mockUsers[4],
    category: "Company News",
    title: "Official ProTippz Highlight Reel & Athlete Stories",
    summary:
      "Watch how collegiate & professional athletes are leveraging direct fan contributions to fuel their athletic careers.",
    content:
      "Go behind the scenes with ProTippz! In this feature documentary snippet, hear directly from players and superfans sharing their experiences on how direct micro-funding creates game-changing support for emerging sports stars.",
    videoUrl: "https://www.youtube.com/embed/xrqgcuNtE64?si=Ur5YUmMMz6OOIwCz",
    timestamp: "3 hours ago",
    readTime: "5 min video",
    authorRole: "ProTippz Media",
    likes: 620,
    comments: 8,
    commentsList: [],
    tips: 2750,
    isLiked: false,
    isTrending: true,
    tags: ["AthleteStories", "HighlightReel", "FanSupport"],
  },
  {
    id: "2",
    user: mockUsers[4],
    category: "Press Release",
    title:
      "ProTippz Secures Strategic Partnership with Major League Franchises",
    summary:
      "ProTippz expands its digital fan engagement network across national sports leagues.",
    content:
      "FOR IMMEDIATE RELEASE   ProTippz is proud to announce formal partnership agreements with leading professional sports organizations. This initiative empowers fans to directly support emerging talent, claim exclusive digital rewards, and access VIP athlete interactions during post-game streams.",
    image: "/new/hero-mocup.webp",
    timestamp: "4 hours ago",
    readTime: "5 min read",
    authorRole: "Corporate Communications",
    likes: 512,
    comments: 0,
    commentsList: [],
    tips: 2300,
    isLiked: false,
    isTrending: true,
    tags: ["PressRelease", "Partnership", "SportsBiz"],
  },
  {
    id: "3",
    user: mockUsers[2],
    category: "Blog Article",
    title: "The Evolution of Athlete Monetization in the Modern Digital Era",
    summary:
      "How direct fan-funding models are transforming the financial landscape for professional & college athletes.",
    content:
      "In recent years, the relationship between sports stars and their supporters has fundamentally shifted. Traditional sponsorship deals are no longer the sole revenue driver for athletes. In this deep dive, we explore how fan micro-contributions, direct tip tiers, and gamified engagement are creating sustainable career paths for players at every level.",
    image: "/new/protippz-workflow.webp",
    timestamp: "1 day ago",
    readTime: "7 min read",
    authorRole: "Senior Editor",
    likes: 289,
    comments: 0,
    commentsList: [],
    tips: 920,
    isLiked: false,
    tags: ["SportsEconomics", "FanEconomy", "Blogs"],
  },
  {
    id: "4",
    user: mockUsers[4],
    category: "Company News",
    title: "ProTippz Celebrates Milestone: Over $1,000,000 Tipped to Players",
    summary:
      "Our passionate global community has officially passed one million dollars in total fan tips!",
    content:
      "A huge thank you to every fan, supporter, team, and player on ProTippz! Together, we have officially crossed $1M+ in total fan-driven tips. Every dollar represents a moment of celebration, encouragement, and real impact for athletes nationwide.",
    image: "/new/gold.webp",
    timestamp: "2 days ago",
    readTime: "2 min read",
    authorRole: "ProTippz Founders",
    likes: 870,
    comments: 0,
    commentsList: [],
    tips: 3400,
    isLiked: true,
    isTrending: true,
    tags: ["Milestone", "CompanyNews", "ThankYou"],
  },
  {
    id: "5",
    user: mockUsers[4],
    category: "Promotional Content",
    title: "Weekend Double-Reward Promo: 2x XP & Special Fan Badges",
    summary:
      "Earn double experience points and unlock limited-edition Diamond supporter badges this weekend only!",
    content:
      "Gear up for the weekend games! For the next 48 hours, every tip sent on ProTippz earns double XP toward your fan level progression. Plus, top tippers on each leaderboard will receive the exclusive 'Championship Contender' badge on their public profile!",
    image: "/new/trophy.webp",
    timestamp: "3 days ago",
    readTime: "2 min read",
    authorRole: "Promotions & Events",
    likes: 195,
    comments: 0,
    commentsList: [],
    tips: 610,
    isLiked: false,
    tags: ["DoubleXP", "SpecialOffer", "Rewards"],
  },
  {
    id: "6",
    user: mockUsers[0],
    category: "Community Update",
    title: "Community Highlight: Fan Spotlight with Sarah Johnson",
    summary:
      "Discover how Sarah built a thriving fan club for local college hoops stars using ProTippz.",
    content:
      "Hey everyone! I'm super honored to be featured in this week's Community Spotlight! Connecting directly with collegiate athletes and sending them words of encouragement after big wins has made watching games 10x more exciting. Let's keep building the best sports community together! 🏆🔥",
    image: "/new/female-player.webp",
    timestamp: "4 days ago",
    readTime: "4 min read",
    authorRole: "Community Champion",
    likes: 410,
    comments: 0,
    commentsList: [],
    tips: 1100,
    isLiked: true,
    tags: ["CommunitySpotlight", "FanStory"],
  },
];

export const levelColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Diamond: { bg: "#B794F620", text: "#805AD5", border: "#B794F640" },
  Platinum: { bg: "#E2E8F0", text: "#4A5568", border: "#CBD5E0" },
  Gold: { bg: "#F6E05E20", text: "#D69E2E", border: "#F6E05E40" },
  Silver: { bg: "#E2E8F0", text: "#718096", border: "#CBD5E0" },
  Bronze: { bg: "#FED7AA", text: "#C05621", border: "#FDBA74" },
};

export const categoryStyles: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "Blog Article": { bg: "#E6F4EA", text: "#137333", border: "#CEEAD6" },
  "Press Release": { bg: "#E8F0FE", text: "#1A73E8", border: "#D2E3FC" },
  "Company News": { bg: "#FEF7E0", text: "#B06000", border: "#FEEFC3" },
  "Promotional Content": { bg: "#FCE8E6", text: "#C5221F", border: "#FAD2CF" },
  "Community Update": { bg: "#F3E8FF", text: "#7E22CE", border: "#E9D5FF" },
  "Product Announcement": { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD" },
};
