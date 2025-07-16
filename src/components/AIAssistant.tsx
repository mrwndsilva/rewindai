import React, { useState } from 'react';
import { Brain, Sparkles, MessageSquare, Lightbulb, Tag, FileText } from 'lucide-react';
import { MemoryEntry } from '../types';

interface AIAssistantProps {
  entries: MemoryEntry[];
  selectedEntry?: MemoryEntry;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ entries, selectedEntry }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Simulate AI analysis
  const analyzeMemories = async () => {
    setIsAnalyzing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate insights based on entry patterns
    const newInsights = [
      `You've captured ${entries.length} memories in your timeline`,
      `Most active type: ${getMostActiveType()}`,
      `Peak activity time: ${getPeakActivityTime()}`,
      'Detected recurring patterns in your code snippets',
      'Found 3 unresolved error messages that might need attention'
    ];

    const newSuggestions = [
      'Consider organizing your React snippets into a dedicated collection',
      'Your API documentation copies could be tagged for easier retrieval',
      'Set up auto-tagging for error messages and bug fixes',
      'Create a summary of your weekly meeting notes',
      'Archive old clipboard entries to improve search performance'
    ];

    setInsights(newInsights);
    setSuggestions(newSuggestions);
    setIsAnalyzing(false);
  };

  const getMostActiveType = () => {
    const typeCounts = entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
  };

  const getPeakActivityTime = () => {
    const hours = entries.map(entry => new Date(entry.timestamp).getHours());
    const hourCounts = hours.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    return peakHour ? `${peakHour}:00` : 'Unknown';
  };

  const generateSummary = (entry: MemoryEntry) => {
    const summaries = {
      clipboard: 'Copied text content, likely for reference or reuse',
      file: 'File activity detected, possibly editing or reviewing',
      screenshot: 'Visual content captured, may contain important information',
      code: 'Code snippet saved, could be a solution or reference',
      note: 'Personal note or reminder created'
    };

    return summaries[entry.type] || 'Memory entry captured';
  };

  const suggestTags = (entry: MemoryEntry) => {
    const content = entry.content.toLowerCase();
    const suggestedTags = [];

    // Programming language detection
    if (content.includes('react') || content.includes('jsx')) suggestedTags.push('react');
    if (content.includes('javascript') || content.includes('js')) suggestedTags.push('javascript');
    if (content.includes('python') || content.includes('py')) suggestedTags.push('python');
    if (content.includes('css') || content.includes('style')) suggestedTags.push('css');
    if (content.includes('api') || content.includes('fetch')) suggestedTags.push('api');
    if (content.includes('error') || content.includes('bug')) suggestedTags.push('debugging');
    if (content.includes('meeting') || content.includes('notes')) suggestedTags.push('meeting');

    return suggestedTags.slice(0, 3);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
        </div>
        <button
          onClick={analyzeMemories}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Memories</span>
            </>
          )}
        </button>
      </div>

      {/* Selected Entry Analysis */}
      {selectedEntry && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Entry Analysis</span>
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
            {generateSummary(selectedEntry)}
          </p>
          
          {/* Suggested Tags */}
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Suggested tags:</span>
            <div className="flex space-x-1">
              {suggestTags(selectedEntry).map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Insights</span>
          </h3>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Suggestions</span>
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {insights.length === 0 && suggestions.length === 0 && !selectedEntry && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">AI Analysis Ready</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Click "Analyze Memories" to get insights about your digital activity patterns
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;