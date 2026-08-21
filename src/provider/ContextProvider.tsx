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
import { get } from '@/ApisRequests/server';
import ReduxProvider from './ReduxProvider';

interface User {
  address: any;
  taxInfo: any;
  email: string;
  name: string;
  phone: string;
  profile_image: string;
  totalAmount: number;
  totalPoint: number;
  dueAmount: number;
  isStripeConnected: boolean;
  totalTips: number;
  user: {
    role: string;
    email: string | undefined | null;
  };
  username: string;
  _id: string;
}
interface AuthContextProps {
  userData: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface Props {
  children: ReactNode;
}
export const useContextData = () => useContext(AuthContext);

// Replace with your Google Client ID
const AuthProvider = ({ children }: Props) => {
  const GOOGLE_CLIENT_ID = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`;
  
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const res = await get('/user/get-my-profile', {
            headers: {
              Authorization: `${token}`,
            },
          });
          if (res?.success) {
            setUserData(res?.data);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ userData, loading }}>
        <ReduxProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ReduxProvider>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

// Hook to use Auth Context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
