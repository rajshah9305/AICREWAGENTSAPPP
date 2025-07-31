'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { apiService, Crew } from '@/lib/api';
import { Bot, Users, Clock, Coins, Play, LogOut } from 'lucide-react';
import CrewCard from '@/components/CrewCard';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadCrews();
  }, [isAuthenticated, router]);

  const loadCrews = async () => {
    try {
      const crewData = await apiService.getCrews();
      setCrews(crewData);
    } catch (error) {
      console.error('Failed to load crews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-royal-blue">CrewDeck</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                <Coins className="h-5 w-5 text-royal-blue mr-2" />
                <span className="font-medium text-royal-blue">{user.credits} credits</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-dark-slate-gray mb-2">
            Welcome back, {user.email.split('@')[0]}!
          </h2>
          <p className="text-gray-600">
            Choose an AI crew to execute your business tasks with lightning speed.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Coins className="h-6 w-6 text-royal-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Credits</p>
                <p className="text-2xl font-bold text-dark-slate-gray">{user.credits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <Bot className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Crews</p>
                <p className="text-2xl font-bold text-dark-slate-gray">{crews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg. Execution Time</p>
                <p className="text-2xl font-bold text-dark-slate-gray">2-5 min</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Crews Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-dark-slate-gray mb-6">Available AI Crews</h3>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crews.map((crew, index) => (
                <motion.div
                  key={crew.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <CrewCard crew={crew} userCredits={user.credits} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {user.credits < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6"
          >
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">Low Credits Warning</h4>
            <p className="text-yellow-700 mb-4">
              You're running low on credits. Consider purchasing more to continue using AI crews.
            </p>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Purchase Credits
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}