'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import OneSignalHandler from '@/components/OneSignal/OneSignalHandler';
import { useMyProfileQuery } from "@/Redux/Apis/profileApis"

export interface User {
  address?: any;
  taxInfo?: any;
  email?: string;
  name?: string;
  phone?: string;
  profile_image?: string;
  totalAmount?: number;
  totalPoint?: number;
  dueAmount?: number;
  paidAmount?: number;
  isStripeConnected?: boolean;
  isStripeReady?: boolean;
  isProfileClaimed?: boolean;
  totalTips?: number;
  position?: string;
  jerceyNumber?: string;
  experience?: string;
  school?: string;
  classYear?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  player_image?: string;
  player_bg_image?: string;
  followersCount?: number;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  league?: any;
  team?: {
    _id?: string;
    name?: string;
    team_logo?: string;
  } | any;
  user?: {
    role?: string;
    email?: string | undefined | null;
    id?: string | null;
  };
  username?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  invitedPassword?: string;
}
interface AuthContextProps {
  userData: User | null;
  loading: boolean;
  hardLoad?: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface Props {
  children: ReactNode;
}
export const useContextData = () => useContext(AuthContext);

const AuthProvider = ({ children }: Props) => {
  const GOOGLE_CLIENT_ID = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;

  const [userData, setUserData] = useState<User | null>(null);
  const { data, isLoading, refetch } = useMyProfileQuery({})

  useEffect(() => {
    if (data?.success) {
      setUserData(data?.data);
    }
  }, [data]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ userData, loading: isLoading, hardLoad: () => refetch() }}>
        <OneSignalHandler />
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
