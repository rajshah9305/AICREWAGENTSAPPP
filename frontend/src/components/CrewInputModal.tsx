'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crew } from '@/lib/api';
import { X, ArrowRight } from 'lucide-react';

interface CrewInputModalProps {
  crew: Crew;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inputs: Record<string, any>) => void;
  loading: boolean;
}

export default function CrewInputModal({ crew, isOpen, onClose, onSubmit, loading }: CrewInputModalProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const getInputFields = () => {
    switch (crew.crew_identifier) {
      case 'travel_planner_crew':
        return [
          { key: 'destination', label: 'Destination', placeholder: 'e.g., Paris, France', required: true },
          { key: 'duration', label: 'Duration', placeholder: 'e.g., 7 days', required: true },
          { key: 'budget', label: 'Budget', placeholder: 'e.g., $3000', required: true },
          { key: 'interests', label: 'Interests', placeholder: 'e.g., culture, food, history', required: false },
        ];
      case 'blog_writer_crew':
        return [
          { key: 'topic', label: 'Blog Topic', placeholder: 'e.g., The Future of AI', required: true },
          { key: 'tone', label: 'Tone', placeholder: 'e.g., professional, casual, technical', required: false },
          { key: 'target_audience', label: 'Target Audience', placeholder: 'e.g., business professionals', required: false },
        ];
      case 'market_research_crew':
        return [
          { key: 'topic', label: 'Research Topic', placeholder: 'e.g., AI technology trends', required: true },
        ];
      default:
        return [
          { key: 'input', label: 'Input', placeholder: 'Enter your requirements', required: true },
        ];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const fields = getInputFields();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark-slate-gray">Configure {crew.name}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-dark-slate-gray mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      value={inputs[field.key] || ''}
                      onChange={(e) => setInputs({ ...inputs, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-royal-blue"
                    />
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-600">
                    Cost: <span className="font-semibold text-royal-blue">{crew.credits_required} credits</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center px-6 py-2 bg-royal-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <ArrowRight className="h-4 w-4 mr-2" />
                      )}
                      {loading ? 'Starting...' : 'Start Execution'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}