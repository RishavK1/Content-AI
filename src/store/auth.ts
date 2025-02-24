import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Email signups are disabled') {
          throw new Error('Sign up is currently disabled. Please try again later.');
        }
        throw error;
      }

      // Don't set the user here as they need to sign in after registration
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Email logins are disabled') {
          throw new Error('Sign in is currently disabled. Please try again later.');
        }
        if (error.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password.');
        }
        throw error;
      }

      set({ user: data.user });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error: any) {
      throw new Error('Error signing out. Please try again.');
    }
  },
  checkUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        if (error.message === 'refresh_token_not_found') {
          // Handle expired or invalid session gracefully
          await supabase.auth.signOut();
          set({ user: null, loading: false });
          return;
        }
        throw error;
      }

      set({ user: session?.user || null, loading: false });
    } catch (error: any) {
      console.error('Error checking user session:', error);
      set({ user: null, loading: false });
    }
  },
}));