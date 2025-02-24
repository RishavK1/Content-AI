import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronDown, ChevronUp, Hash } from 'lucide-react';

interface TrendingCardProps {
  trend: {
    title: string;
    description: string;
    why: string;
    leverage: string;
    hashtags: string[];
    ideas: string[];
  };
  index: number;
}

export default function TrendingCard({ trend, index }: TrendingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {trend.title}
            </h3>
            <p className="text-gray-600 mb-4">{trend.description}</p>
            
            <div className="space-y-4">
              <div className={`transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}>
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Why it's trending</h4>
                  <p className="text-gray-600">{trend.why}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">How to leverage it</h4>
                  <p className="text-gray-600">{trend.leverage}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Content Ideas</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {trend.ideas.map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {trend.hashtags.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="ml-1 w-4 h-4" />
                </>
              ) : (
                <>
                  Show more
                  <ChevronDown className="ml-1 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}