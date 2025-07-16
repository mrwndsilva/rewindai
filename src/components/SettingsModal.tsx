import React, { useState } from 'react';
import { X, Trash2, Download, AlertTriangle } from 'lucide-react';
import { MemoryEntry } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  entries: MemoryEntry[];
  onClearAll: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, entries, onClearAll }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearAll = () => {
    onClearAll();
    setShowConfirm(false);
    onClose();
  };

  const totalSize = new Blob([JSON.stringify(entries)]).size;
  const formatSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Storage Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Entries:</span>
                <span className="font-medium text-gray-900 dark:text-white">{entries.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Data Size:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatSize(totalSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Storage Type:</span>
                <span className="font-medium text-gray-900 dark:text-white">Local Browser</span>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(entries, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `rewind-backup-${new Date().toISOString().split('T')[0]}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export All Data</span>
              </button>

              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>Rewind AI is a personal digital memory timeline that helps you track and search through your digital activities.</p>
              <p>All data is stored locally in your browser and never leaves your device.</p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Deletion</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This will permanently delete all {entries.length} memory entries. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;