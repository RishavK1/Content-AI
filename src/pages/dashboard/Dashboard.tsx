import { motion } from 'framer-motion';
import { MessageSquarePlus, Video, Image as ImageIcon, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function Dashboard() {
  const features = [
    {
      name: 'Generate Captions',
      description: 'Create engaging captions for your social media posts',
      href: '/generate/caption',
      icon: MessageSquarePlus,
      color: 'bg-blue-500',
    },
    {
      name: 'Video Scripts',
      description: 'Write compelling scripts for Reels and Shorts',
      href: '/generate/video',
      icon: Video,
      color: 'bg-purple-500',
    },
    {
      name: 'Image Ideas',
      description: 'Get creative ideas for your visual content',
      href: '/generate/image',
      icon: ImageIcon,
      color: 'bg-pink-500',
    },
    {
      name: 'Trending Topics',
      description: 'Discover what\'s trending in your niche',
      href: '/trending',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Content AI</h1>
          <p className="mt-2 text-gray-600">
            Generate engaging content for your social media platforms
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={feature.href}
                className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.name}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}