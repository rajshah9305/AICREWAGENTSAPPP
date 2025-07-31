'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/lib/api';
import { ArrowLeft, Download, Copy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import LiveSynthesis from '@/components/LiveSynthesis';

interface CrewRunStatus {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  output?: string;
  created_at: string;
  completed_at?: string;
}

export default function RunPage() {
  const { isAuthenticated } = useAuthStore();
  const [runStatus, setRunStatus] = useState<CrewRunStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const params = useParams();
  const runId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (runId) {
      loadRunStatus();
      const interval = setInterval(loadRunStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, runId, router]);

  const loadRunStatus = async () => {
    try {
      const status = await apiService.getRunStatus(runId);
      setRunStatus(status);
    } catch (error) {
      console.error('Failed to load run status:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (runStatus?.output) {
      await navigator.clipboard.writeText(runStatus.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusIcon = () => {
    switch (runStatus?.status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'RUNNING':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-dark-slate-gray">
                Crew Execution: {runId.slice(0, 8)}...
              </h1>
            </div>
            
            {runStatus && (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50">
                {getStatusIcon()}
                <span className="font-medium capitalize text-blue-600">{runStatus.status.toLowerCase()}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-dark-slate-gray mb-4">
                Live Synthesis
              </h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <LiveSynthesis runId={runId} />
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-dark-slate-gray">
                  Final Results
                </h2>
                {runStatus?.output && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                {runStatus?.output ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      {runStatus.output}
                    </pre>
                  </div>
                ) : runStatus?.status === 'FAILED' ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-600 mb-2">
                      Execution Failed
                    </h3>
                    <p className="text-gray-600">
                      The crew execution encountered an error. Please try again.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Execution in Progress
                    </h3>
                    <p className="text-gray-500">
                      Your AI crew is working hard to complete the task. Results will appear here when ready.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}