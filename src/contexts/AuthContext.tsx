import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If supabase client is not configured, disable auth gracefully
    if (!(supabase as any).auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    (supabase as any).auth.getSession().then(({ data: { session }, error }: any) => {
      if (error) {
        console.error('Session retrieval error:', error.message);
        (supabase as any).auth.signOut();
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = (supabase as any).auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        await (supabase as any).auth.signOut();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      if ((supabase as any).auth) {
        await (supabase as any).auth.signOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // Force clear the user state even if signOut fails
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};