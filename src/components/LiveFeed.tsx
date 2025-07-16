import React, { useState, useEffect } from 'react';
import { Clock, Zap, Activity, Wifi, WifiOff } from 'lucide-react';
import { MemoryEntry } from '../types';

interface LiveFeedProps {
  onNewEntry: (entry: Omit<MemoryEntry, 'id' | 'timestamp'>) => void;
  isActive: boolean;
  onToggleActive: () => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ onNewEntry, isActive, onToggleActive }) => {
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [captureStats, setCaptureStats] = useState({
    clipboard: 0,
    files: 0,
    screenshots: 0,
    total: 0
  });

  // Simulate auto-capture activities
  useEffect(() => {
    if (!isActive) return;

    const simulateActivity = () => {
      const activities = [
        {
          type: 'clipboard' as const,
          title: 'API Documentation Copied',
          content: 'fetch("/api/users", { method: "GET", headers: { "Authorization": "Bearer token" } })',
          context: 'Copied from Stack Overflow'
        },
        {
          type: 'file' as const,
          title: 'Modified: UserService.js',
          content: 'export class UserService {\n  async getUsers() {\n    return await fetch("/api/users");\n  }\n}',
          metadata: { filePath: '/src/services/UserService.js', language: 'javascript' }
        },
        {
          type: 'screenshot' as const,
          title: 'Error Dialog Captured',
          content: 'TypeError: Cannot read property "map" of undefined at UserList.render',
          metadata: { imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400' }
        },
        {
          type: 'code' as const,
          title: 'React Hook Implementation',
          content: 'const useLocalStorage = (key, initialValue) => {\n  const [value, setValue] = useState(() => {\n    return localStorage.getItem(key) || initialValue;\n  });\n  return [value, setValue];\n};',
          metadata: { language: 'javascript', tags: ['react', 'hooks', 'localStorage'] }
        },
        {
          type: 'note' as const,
          title: 'Meeting Notes: Sprint Planning',
          content: '- Implement user authentication\n- Fix responsive design issues\n- Add dark mode toggle\n- Performance optimization',
          metadata: { tags: ['meeting', 'sprint', 'planning'] }
        }
      ];

      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      
      // Add to recent activity feed
      setRecentActivity(prev => [
        `${new Date().toLocaleTimeString()}: Captured ${randomActivity.type} - ${randomActivity.title}`,
        ...prev.slice(0, 4)
      ]);

      // Update stats
      setCaptureStats(prev => ({
        ...prev,
        [randomActivity.type]: prev[randomActivity.type] + 1,
        total: prev.total + 1
      }));

      // Add to main timeline
      onNewEntry(randomActivity);
    };

    // Simulate captures at random intervals (3-8 seconds)
    const interval = setInterval(() => {
      simulateActivity();
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, [isActive, onNewEntry]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Memory Capture
          </h2>
        </div>
        <button
          onClick={onToggleActive}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isActive
              ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {isActive ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          <span>{isActive ? 'Stop Capture' : 'Start Capture'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{captureStats.clipboard}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Clipboard</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{captureStats.files}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Files</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{captureStats.screenshots}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Screenshots</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{captureStats.total}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>Recent Activity</span>
        </h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {recentActivity.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {isActive ? 'Waiting for activity...' : 'Start capture to see live activity'}
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-2 font-mono"
              >
                {activity}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;