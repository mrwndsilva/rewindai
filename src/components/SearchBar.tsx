import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { SearchFilters, MemoryEntry } from '../types';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  filters,
  onFiltersChange
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const typeOptions: { value: MemoryEntry['type']; label: string }[] = [
    { value: 'clipboard', label: 'Clipboard' },
    { value: 'file', label: 'Files' },
    { value: 'screenshot', label: 'Screenshots' },
    { value: 'code', label: 'Code' },
    { value: 'note', label: 'Notes' }
  ];

  const clearFilters = () => {
    onFiltersChange({});
    setShowFilters(false);
  };

  const hasActiveFilters = filters.type || filters.dateRange;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          id="search-input"
          placeholder="Search your digital memory... (e.g., 'React error fix', 'API documentation')"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
            hasActiveFilters 
              ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Entry Type
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                type: e.target.value as MemoryEntry['type'] || undefined
              })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All types</option>
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: {
                    ...filters.dateRange,
                    start: e.target.value,
                    end: filters.dateRange?.end || ''
                  }
                })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  dateRange: {
                    ...filters.dateRange,
                    start: filters.dateRange?.start || '',
                    end: e.target.value
                  }
                })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;