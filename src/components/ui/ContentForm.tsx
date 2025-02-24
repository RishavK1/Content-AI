import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Button from './Button';
import { useContentStore } from '../../store/content';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/auth';

interface ContentFormProps {
  title: string;
  description: string;
  type: 'caption' | 'video' | 'image' | 'trending';
  platforms: string[];
  promptPlaceholder: string;
}

export default function ContentForm({
  title,
  description,
  type,
  platforms,
  promptPlaceholder,
}: ContentFormProps) {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState(platforms[0]);
  const [generatedContent, setGeneratedContent] = useState('');
  const { generateContent, loading } = useContentStore();
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const content = await generateContent(type, platform, prompt);
      setGeneratedContent(content);
    } catch (error: any) {
      if (error.message?.includes('Gemini API key')) {
        toast.error('Please add your Gemini API key to continue', {
          duration: 5000,
          icon: '⚠️'
        });
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('users_content')
        .insert({
          user_id: user?.id,
          title: prompt || title,
          content: generatedContent,
          platform,
          type: type === 'trending' ? 'idea' : type
        });

      if (error) throw error;
      toast.success('Content saved successfully!');
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">{description}</p>

        {!import.meta.env.VITE_GEMINI_API_KEY && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              ⚠️ Please add your Gemini API key to the .env file to enable content generation.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Prompt
            </label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={promptPlaceholder}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <Button 
            type="submit" 
            loading={loading} 
            className="w-full"
            disabled={!import.meta.env.VITE_GEMINI_API_KEY}
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </Button>
        </form>

        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Content</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="whitespace-pre-wrap text-gray-700">{generatedContent}</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <Button
                onClick={handleSave}
                variant="primary"
              >
                Save Content
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContent);
                  toast.success('Content copied to clipboard!');
                }}
                variant="secondary"
              >
                Copy to Clipboard
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}