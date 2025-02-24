import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Video, Image, TrendingUp, Trash2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from './Button';
import { Content } from '../../types/database';

interface ContentCardProps {
  content: Content;
  onDelete: (id: string) => void;
}

export default function ContentCard({ content, onDelete }: ContentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (content.type) {
      case 'caption':
        return <MessageSquare className="w-5 h-5" />;
      case 'script':
        return <Video className="w-5 h-5" />;
      case 'idea':
        return content.platform === 'trending' ? <TrendingUp className="w-5 h-5" /> : <Image className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (content.type) {
      case 'caption':
        return 'Social Media Caption';
      case 'script':
        return 'Video Script';
      case 'idea':
        return content.platform === 'trending' ? 'Trending Topic' : 'Image Idea';
      default:
        return 'Content';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content.content);
    toast.success('Content copied to clipboard!');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{content.title}</h3>
              <p className="text-sm text-gray-500">
                {getTypeLabel()} • {content.platform}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="p-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => onDelete(content.id)}
              className="p-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          className={`prose prose-sm max-w-none ${
            isExpanded ? '' : 'line-clamp-3'
          }`}
        >
          <p className="text-gray-600 whitespace-pre-wrap">{content.content}</p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>

        <div className="mt-4 text-xs text-gray-400">
          Created {new Date(content.created_at).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}