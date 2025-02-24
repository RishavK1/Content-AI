import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { generateContent as geminiGenerate } from '../lib/gemini';
import { useAuthStore } from './auth';

interface ContentState {
  loading: boolean;
  error: string | null;
  content: string | null;
  generateContent: (type: 'caption' | 'video' | 'image' | 'trending', platform: string, prompt: string) => Promise<string>;
  saveContent: (title: string, content: string, platform: string, type: string) => Promise<void>;
}

export const useContentStore = create<ContentState>((set) => ({
  loading: false,
  error: null,
  content: null,
  generateContent: async (type, platform, prompt) => {
    set({ loading: true, error: null });
    try {
      const content = await geminiGenerate({ type, platform, prompt });
      set({ content, loading: false });
      return content;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate content. Please try again.';
      set({ error: errorMessage, loading: false });
      throw error; // Preserve the original error for proper handling
    }
  },
  saveContent: async (title, content, platform, type) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      throw new Error('You must be logged in to save content');
    }

    try {
      const { error } = await supabase
        .from('users_content')
        .insert({
          user_id: user.id,
          title,
          content,
          platform,
          type
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error saving content:', error);
      throw new Error('Failed to save content. Please try again.');
    }
  }
}));