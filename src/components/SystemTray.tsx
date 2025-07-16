import React, { useState, useEffect } from 'react';
import { Clock, Settings, Pause, Play, Download, Minimize2, X } from 'lucide-react';

interface SystemTrayProps {
  isCapturing: boolean;
  onToggleCapture: () => void;
  onOpenSettings: () => void;
  onExport: () => void;
  totalEntries: number;
  onMinimize: () => void;
  onClose: () => void;
}

const SystemTray: React.FC<SystemTrayProps> = ({
  isCapturing,
  onToggleCapture,
  onOpenSettings,
  onExport,
  totalEntries,
  onMinimize,
  onClose
}) => {
  const [showTray, setShowTray] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  useEffect(() => {
    if (isCapturing) {
      const interval = setInterval(() => {
        setLastActivity(new Date());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isCapturing]);

  const formatLastActivity = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastActivity.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <>
      {/* System Tray Icon */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowTray(!showTray)}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isCapturing 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
          title="Rewind AI System Tray"
        >
          <Clock className="w-5 h-5" />
          {isCapturing && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Tray Menu */}
      {showTray && (
        <div className="fixed top-16 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Rewind AI</h3>
                  <p className="text-sm opacity-90">Personal Memory Timeline</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={onMinimize}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {isCapturing ? 'Capturing' : 'Paused'}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatLastActivity()}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Total Memories:</span>
                <span className="font-medium">{totalEntries}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 space-y-2">
            <button
              onClick={onToggleCapture}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                isCapturing
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
              }`}
            >
              {isCapturing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isCapturing ? 'Pause Capture' : 'Resume Capture'}</span>
            </button>

            <button
              onClick={onExport}
              className="w-full flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full flex items-center space-x-3 px-3 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 text-center">
            Click outside to close • Press ⌘Q to quit
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showTray && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTray(false)}
        />
      )}
    </>
  );
};

export default SystemTray;