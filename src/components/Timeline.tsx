import React from 'react';
import { Clock, FileText, Image, Code, Copy, StickyNote, Trash2, ExternalLink, Edit3 } from 'lucide-react';
import { MemoryEntry } from '../types';
import { formatTimeAgo, formatDate } from '../utils/dateUtils';

interface TimelineProps {
  entries: MemoryEntry[];
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: MemoryEntry) => void;
}

const Timeline: React.FC<TimelineProps> = ({ entries, onDeleteEntry, onEditEntry }) => {
  const getIcon = (type: MemoryEntry['type']) => {
    switch (type) {
      case 'clipboard': return Copy;
      case 'file': return FileText;
      case 'screenshot': return Image;
      case 'code': return Code;
      case 'note': return StickyNote;
      default: return Clock;
    }
  };

  const getTypeColor = (type: MemoryEntry['type']) => {
    switch (type) {
      case 'clipboard': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'file': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'screenshot': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'code': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'note': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const groupEntriesByDate = (entries: MemoryEntry[]) => {
    const groups: { [date: string]: MemoryEntry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div className="space-y-8">
      {groupedEntries.map(([date, dayEntries]) => (
        <div key={date} className="relative">
          {/* Date Header */}
          <div className="sticky top-24 z-30 mb-6">
            <div className="inline-block bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(new Date(date))}
              </h2>
            </div>
          </div>

          {/* Timeline Line */}
          <div className="absolute left-6 top-16 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Entries */}
          <div className="space-y-6">
            {dayEntries.map((entry, index) => {
              const Icon = getIcon(entry.type);
              
              return (
                <div key={entry.id} className="relative flex items-start space-x-4 group">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(entry.type)} border-4 border-white dark:border-gray-900`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-gray-300 dark:group-hover:border-gray-600">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {entry.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                            <span>{formatTimeAgo(new Date(entry.timestamp))}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(entry.type)}`}>
                              {entry.type}
                            </span>
                            {entry.metadata?.tags?.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {entry.metadata?.filePath && (
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditEntry(entry)}
                            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Edit entry"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteEntry(entry.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        {entry.metadata?.imageUrl && (
                          <img
                            src={entry.metadata.imageUrl}
                            alt="Screenshot"
                            className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                        )}
                        
                        <div className={`text-gray-700 dark:text-gray-300 ${
                          entry.type === 'code' 
                            ? 'bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto' 
                            : ''
                        }`}>
                          {entry.content.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < entry.content.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </div>

                        {entry.metadata?.context && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                            <span className="font-medium">Context:</span> {entry.metadata.context}
                          </div>
                        )}

                        {entry.metadata?.filePath && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">File:</span> {entry.metadata.filePath}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;