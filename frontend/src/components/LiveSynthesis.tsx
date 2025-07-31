'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Search, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

interface LiveSynthesisProps {
  runId: string;
}

interface LogEntry {
  id: string;
  type: string;
  agent?: string;
  message?: string;
  tool?: string;
  input?: string;
  output?: string;
  content?: string;
  error?: string;
  timestamp: number;
}

export default function LiveSynthesis({ runId }: LiveSynthesisProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [runId]);

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const connectWebSocket = () => {
    const wsUrl = `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('http', 'ws')}/ws/runs/${runId}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      addLog({
        id: Date.now().toString(),
        type: 'system',
        message: 'Connected to live synthesis stream',
        timestamp: Date.now(),
      });
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        addLog({
          id: Date.now().toString() + Math.random(),
          ...data,
        });

        if (data.type === 'complete' || data.type === 'error') {
          setIsComplete(true);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      addLog({
        id: Date.now().toString(),
        type: 'system',
        message: 'Connection closed',
        timestamp: Date.now(),
      });
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      addLog({
        id: Date.now().toString(),
        type: 'error',
        error: 'Connection error occurred',
        timestamp: Date.now(),
      });
    };
  };

  const addLog = (entry: LogEntry) => {
    setLogs((prev) => [...prev, entry]);
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getIcon = (type: string, tool?: string) => {
    switch (type) {
      case 'agent_start':
      case 'agent_action':
        return <Bot className="h-4 w-4 text-blue-500" />;
      case 'tool_start':
      case 'tool_end':
        return <Search className="h-4 w-4 text-green-500" />;
      case 'llm_chunk':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'system':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'agent_start':
      case 'agent_action':
        return 'border-l-blue-500 bg-blue-50';
      case 'tool_start':
      case 'tool_end':
        return 'border-l-green-500 bg-green-50';
      case 'llm_chunk':
        return 'border-l-purple-500 bg-purple-50';
      case 'complete':
        return 'border-l-green-500 bg-green-100';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatContent = (entry: LogEntry) => {
    switch (entry.type) {
      case 'agent_start':
        return `🤖 ${entry.agent} started: ${entry.message}`;
      case 'agent_action':
        return `🔄 ${entry.agent}: ${entry.message}`;
      case 'tool_start':
        return `🔧 Using ${entry.tool}: ${entry.input}`;
      case 'tool_end':
        return `✅ ${entry.tool} completed: ${entry.output}`;
      case 'llm_chunk':
        return entry.content;
      case 'complete':
        return `🎉 Execution completed successfully!`;
      case 'error':
        return `❌ Error: ${entry.error}`;
      case 'system':
        return `ℹ️ ${entry.message}`;
      default:
        return entry.message || 'Unknown event';
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live stream active' : 'Connecting...'}
          </span>
        </div>
        {isComplete && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Execution Complete</span>
          </div>
        )}
      </div>

      {/* Live Log */}
      <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
        <AnimatePresence>
          {logs.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-2 p-3 border-l-4 rounded-r ${getEntryColor(entry.type)}`}
            >
              <div className="flex items-start space-x-2">
                <div className="mt-0.5">{getIcon(entry.type, entry.tool)}</div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-gray-800">
                    {entry.type === 'llm_chunk' ? (
                      <span className="whitespace-pre-wrap">{formatContent(entry)}</span>
                    ) : (
                      formatContent(entry)
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={logsEndRef} />
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
          <p>Waiting for AI agents to begin execution...</p>
        </div>
      )}
    </div>
  );
}