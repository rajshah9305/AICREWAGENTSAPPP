'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { apiService, Crew } from '@/lib/api';
import { Bot, Users, Coins, Play, Settings } from 'lucide-react';
import CrewInputModal from './CrewInputModal';

interface CrewCardProps {
  crew: Crew;
  userCredits: number;
}

export default function CrewCard({ crew, userCredits }: CrewCardProps) {
  const [showInputModal, setShowInputModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRunCrew = async (inputs: Record<string, any>) => {
    setLoading(true);
    try {
      const response = await apiService.runCrew(crew.id, inputs);
      router.push(`/run/${response.id}`);
    } catch (error: any) {
      alert(error.message || 'Failed to start crew execution');
    } finally {
      setLoading(false);
      setShowInputModal(false);
    }
  };

  const canAfford = userCredits >= crew.credits_required;

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {crew.is_single_agent ? (
              <div className="bg-green-50 p-3 rounded-lg">
                <Bot className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <div className="ml-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {crew.is_single_agent ? 'Single Agent' : 'Multi-Agent'}
              </span>
            </div>
          </div>
          <div className="flex items-center text-royal-blue">
            <Coins className="h-4 w-4 mr-1" />
            <span className="font-semibold">{crew.credits_required}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-dark-slate-gray mb-2">{crew.name}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{crew.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Configure crew"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => setShowInputModal(true)}
            disabled={!canAfford || loading}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              canAfford
                ? 'bg-royal-blue text-white hover:bg-blue-600 hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {canAfford ? 'Run Crew' : 'Insufficient Credits'}
          </button>
        </div>

        {!canAfford && (
          <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
            You need {crew.credits_required - userCredits} more credits to run this crew.
          </div>
        )}
      </motion.div>

      <CrewInputModal
        crew={crew}
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onSubmit={handleRunCrew}
        loading={loading}
      />
    </>
  );
}