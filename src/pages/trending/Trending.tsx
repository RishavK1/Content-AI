import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import TrendingCard from '../../components/ui/TrendingCard';
import { useContentStore } from '../../store/content';

interface TrendTopic {
  title: string;
  description: string;
  why: string;
  leverage: string;
  hashtags: string[];
  ideas: string[];
}

export default function Trending() {
  const [trends, setTrends] = useState<TrendTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const { generateContent } = useContentStore();

  const parseTrendingContent = (content: string): TrendTopic[] => {
    const trends: TrendTopic[] = [];
    const sections = content.split(/\*\*Trend \d+:/g).filter(Boolean);

    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      const title = lines[0].replace(/\*\*/g, '').trim();
      
      const trend: TrendTopic = {
        title,
        description: '',
        why: '',
        leverage: '',
        hashtags: [],
        ideas: []
      };

      let currentSection = '';
      lines.forEach(line => {
        line = line.trim();
        if (line.includes('**Trend description:**')) {
          currentSection = 'description';
          trend.description = line.replace('**Trend description:**', '').trim();
        } else if (line.includes('**Why it\'s trending:**')) {
          currentSection = 'why';
          trend.why = line.replace('**Why it\'s trending:**', '').trim();
        } else if (line.includes('**How to leverage it:**')) {
          currentSection = 'leverage';
          trend.leverage = line.replace('**How to leverage it:**', '').trim();
        } else if (line.includes('**Popular hashtags:**')) {
          currentSection = 'hashtags';
          trend.hashtags = line
            .replace('**Popular hashtags:**', '')
            .trim()
            .split(' ')
            .filter(tag => tag.startsWith('#'))
            .map(tag => tag.replace('#', ''));
        } else if (line.includes('**Content ideas:**')) {
          currentSection = 'ideas';
        } else if (line.startsWith('- ') && currentSection === 'ideas') {
          trend.ideas.push(line.replace('- ', ''));
        }
      });

      trends.push(trend);
    });

    return trends;
  };

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const content = await generateContent('trending', 'all', '');
      const parsedTrends = parseTrendingContent(content);
      setTrends(parsedTrends);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trending Topics</h1>
            <p className="mt-2 text-gray-600">
              Discover what's trending across social media
            </p>
          </div>
          <Button onClick={fetchTrends} loading={loading} variant="secondary">
            Refresh Trends
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : trends.length > 0 ? (
          <motion.div layout className="grid gap-6">
            {trends.map((trend, index) => (
              <TrendingCard key={index} trend={trend} index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No trending topics available. Please try refreshing.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}