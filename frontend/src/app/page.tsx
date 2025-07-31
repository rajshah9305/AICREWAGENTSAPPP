'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { ArrowRight, Bot, Zap, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, refreshUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser().then(() => {
        if (isAuthenticated) {
          router.push('/dashboard');
        }
      });
    }
  }, [isAuthenticated, refreshUser, router]);

  const features = [
    {
      icon: Bot,
      title: 'AI Agent Teams',
      description: 'Pre-configured AI crews powered by Cerebras for market research, content creation, and business planning.',
    },
    {
      icon: Zap,
      title: 'Lightning-Fast Execution',
      description: 'Experience unprecedented speed with Cerebras AI. Watch your agents work in real-time with our Live Synthesis interface.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with JWT authentication and encrypted data.',
    },
    {
      icon: Users,
      title: 'Credit System',
      description: 'Pay-per-use model with transparent pricing and no hidden fees.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-slate-800"
              >
                CrewDeck
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-slate-800 mb-6"
          >
            Execute Complex Tasks with
            <span className="text-blue-600"> AI Agent Teams</span>
            <div className="text-2xl md:text-3xl font-normal text-slate-600 mt-4">
              Powered by <span className="text-blue-600 font-semibold">Cerebras AI</span>
            </div>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto"
          >
            CrewDeck provides pre-configured AI agent teams powered by Cerebras AI that work together to complete 
            complex business tasks at lightning speed. Watch them collaborate in real-time and get professional 
            results in minutes, not hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why Choose CrewDeck?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of AI-powered task execution with our cutting-edge platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using CrewDeck to automate their complex tasks.
            </p>
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">CrewDeck</div>
            <p className="text-slate-400 mb-4">
              AI-powered task execution platform powered by Cerebras AI
            </p>
            <p className="text-slate-500 text-sm">
              © 2024 CrewDeck. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}