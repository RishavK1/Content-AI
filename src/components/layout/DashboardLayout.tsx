import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  LogOut, 
  Sparkles,
  MessageSquarePlus,
  Bookmark,
  TrendingUp,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import Button from '../ui/Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Layout },
    { name: 'Generate Caption', href: '/generate/caption', icon: MessageSquarePlus },
    { name: 'Video Scripts', href: '/generate/video', icon: Video },
    { name: 'Image Ideas', href: '/generate/image', icon: ImageIcon },
    { name: 'Trending Topics', href: '/trending', icon: TrendingUp },
    { name: 'Saved Content', href: '/saved', icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="fixed inset-y-0 flex w-64 flex-col bg-white shadow-lg"
        >
          <div className="flex h-16 items-center px-6">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">Content AI</span>
          </div>
          <div className="flex flex-1 flex-col">
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="pl-64 flex-1">
          <main className="py-6 px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}