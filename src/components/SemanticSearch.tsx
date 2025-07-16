import React, { useState, useEffect } from 'react';
import { Search, Brain, Sparkles, Target } from 'lucide-react';
import { MemoryEntry } from '../types';

interface SemanticSearchProps {
  entries: MemoryEntry[];
  onResults: (results: MemoryEntry[]) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({ 
  entries, 
  onResults, 
  query, 
  onQueryChange 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [semanticMatches, setSemanticMatches] = useState<Array<{entry: MemoryEntry, score: number}>>([]);

  // Simulate semantic search with embeddings
  const performSemanticSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      onResults(entries);
      setSemanticMatches([]);
      return;
    }

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate semantic matching with scoring
    const results = entries.map(entry => {
      const searchableText = [
        entry.title,
        entry.content,
        entry.metadata?.context,
        ...(entry.metadata?.tags || [])
      ].join(' ').toLowerCase();

      const queryLower = searchQuery.toLowerCase();
      
      // Simulate semantic similarity scoring
      let score = 0;
      
      // Exact matches get highest score
      if (searchableText.includes(queryLower)) {
        score += 1.0;
      }
      
      // Simulate semantic similarity for related terms
      const semanticPairs = [
        ['error', 'bug', 'issue', 'problem', 'fix'],
        ['react', 'component', 'jsx', 'hook', 'state'],
        ['api', 'fetch', 'request', 'endpoint', 'http'],
        ['database', 'sql', 'query', 'table', 'data'],
        ['css', 'style', 'design', 'layout', 'responsive'],
        ['javascript', 'js', 'function', 'variable', 'object'],
        ['meeting', 'notes', 'discussion', 'planning', 'agenda']
      ];

      semanticPairs.forEach(group => {
        const queryInGroup = group.some(term => queryLower.includes(term));
        const contentInGroup = group.some(term => searchableText.includes(term));
        if (queryInGroup && contentInGroup) {
          score += 0.7;
        }
      });

      // Word similarity bonus
      const queryWords = queryLower.split(' ');
      const contentWords = searchableText.split(' ');
      const commonWords = queryWords.filter(word => 
        word.length > 2 && contentWords.includes(word)
      );
      score += commonWords.length * 0.3;

      return { entry, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score);

    setSemanticMatches(results);
    onResults(results.map(r => r.entry));
    setIsProcessing(false);
  };

  // Generate search suggestions
  const generateSuggestions = () => {
    const commonQueries = [
      'React error fix',
      'API documentation',
      'CSS styling tips',
      'JavaScript functions',
      'Database queries',
      'Meeting notes',
      'Code snippets',
      'Bug reports',
      'Design patterns',
      'Performance optimization'
    ];

    // Filter based on available content
    const relevantSuggestions = commonQueries.filter(suggestion => {
      const suggestionLower = suggestion.toLowerCase();
      return entries.some(entry => {
        const entryText = [entry.title, entry.content, ...(entry.metadata?.tags || [])].join(' ').toLowerCase();
        return suggestionLower.split(' ').some(word => entryText.includes(word));
      });
    });

    setSuggestions(relevantSuggestions.slice(0, 5));
  };

  useEffect(() => {
    generateSuggestions();
  }, [entries]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSemanticSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, entries]);

  return (
    <div className="space-y-4">
      {/* Enhanced Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {isProcessing ? (
            <Brain className="w-5 h-5 text-blue-500 animate-pulse" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
          {query && semanticMatches.length > 0 && (
            <Sparkles className="w-4 h-4 text-yellow-500" />
          )}
        </div>
        
        <input
          type="text"
          placeholder="Semantic search: 'React error fix', 'API docs I copied', 'meeting notes from yesterday'..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-16 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        {isProcessing && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search Suggestions */}
      {!query && suggestions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Try searching for:</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onQueryChange(suggestion)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Semantic Results Info */}
      {query && semanticMatches.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Semantic Search Results
            </span>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-400">
            Found {semanticMatches.length} semantically related entries
            {semanticMatches.length > 0 && (
              <span className="ml-2">
                (Best match: {Math.round(semanticMatches[0].score * 100)}% relevance)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SemanticSearch;