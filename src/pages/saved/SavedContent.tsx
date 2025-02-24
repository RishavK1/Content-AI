import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Loader2, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ContentCard from '../../components/ui/ContentCard';
import { supabase } from '../../lib/supabase';
import { Content } from '../../types/database';
import { useAuthStore } from '../../store/auth';

export default function SavedContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const user = useAuthStore((state) => state.user);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('users_content')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error: any) {
      toast.error('Failed to load saved content');
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setContents(contents.filter(content => content.id !== id));
      toast.success('Content deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete content');
      console.error('Error deleting content:', error);
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || content.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Saved Content</h1>
          <p className="mt-2 text-gray-600">
            Access and manage all your generated content
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="caption">Captions</option>
            <option value="script">Video Scripts</option>
            <option value="idea">Image Ideas & Trends</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredContents.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6"
          >
            {filteredContents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || filter !== 'all'
                ? 'No content matches your search criteria'
                : 'No saved content yet. Start generating content to see it here!'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}