/**
 * Shared domain models returned by the ProTippz backend.
 * Fields are optional where the backend does not always populate them.
 */

export interface League {
  _id: string;
  name: string;
  sport?: string;
  league_image?: string;
}

export interface TeamSummary {
  _id: string;
  name: string;
  team_logo?: string;
  sport?: string;
}

export interface Team extends TeamSummary {
  league?: League;
  team_bg_image?: string;
  description?: string;
  username?: string;
  email?: string;
  totalTips?: number;
  paidAmount?: number;
  dueAmount?: number;
  isStripeConnected?: boolean;
  isStripeReady?: boolean;
  isProfileClaimed?: boolean;
  isBookmark?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Player {
  _id: string;
  user?: string;
  name: string;
  league?: League;
  team?: Team;
  position?: string;
  player_image?: string;
  player_bg_image?: string;
  totalTips?: number;
  paidAmount?: number;
  dueAmount?: number;
  stripe_account_id?: string;
  stripAccountId?: string;
  isStripeConnected?: boolean;
  isStripeReady?: boolean;
  jerceyNumber?: number | string;
  experience?: string;
  school?: string;
  classYear?: string;
  city?: string;
  state?: string;
  country?: string;
  username?: string;
  email?: string;
  bio?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  followersCount?: number;
  isProfileClaimed?: boolean;
  isBookmark?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RewardCategory {
  _id: string;
  name: string;
  image?: string;
  deliveryOption?: string;
}

export interface Reward {
  _id: string;
  category: RewardCategory;
  name: string;
  reward_image: string;
  pointRequired: number;
  description: string;
}

export interface Tip {
  _id: string;
  user: {
    _id: string;
    name: string;
    user?: string;
    email?: string;
    profile_image?: string;
  };
  entityId: string;
  entityType: string;
  point: number;
  amount: number;
  paymentStatus: string;
  tipBy: string;
  entity: {
    name: string;
    position?: string;
    player_image?: string;
    team_logo?: string;
  };
  createdAt: string;
}

export interface TransactionParty {
  _id?: string;
  name?: string;
  email?: string;
  player_image?: string;
  profile_image?: string;
  team_logo?: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  fee?: number;
  netAmount?: number;
  currency?: string;
  transactionType: string;
  paymentBy?: string;
  status: string;
  description?: string;
  entityId?: TransactionParty;
  entityType?: string;
  senderId?: TransactionParty;
  senderType?: string;
  recipientId?: TransactionParty;
  recipientType?: string;
  transactionId?: string;
  referenceId?: string;
  referenceModel?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Withdraw {
  _id: string;
  amount: number;
  status: "Completed" | "Rejected" | "Pending" | string;
  entityType?: string;
  entityId?: string;
  stripeTransferId?: string | null;
  rejectionReason?: string | null;
  withdrawOption?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  seen?: boolean;
  isRead?: boolean;
  isSeen?: boolean;
  readAt?: string;
  type?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bookmark<TEntity = Player | Team> {
  _id: string;
  player?: TEntity;
  team?: TEntity;
  createdAt?: string;
}

/** Shape of `/manage/get-privacy-policy` and `/manage/get-terms-conditions`. */
export interface ManagedContent {
  _id?: string;
  description?: string;
  content?: string;
  updatedAt?: string;
}
