import React, { useState, useEffect } from 'react';
import { Search, Clock, FileText, Image, Code, Copy, Settings, Download, Upload, Moon, Sun, Filter, Plus, Calendar, Tag, Folder, Activity, Brain } from 'lucide-react';
import Timeline from './components/Timeline';
import SemanticSearch from './components/SemanticSearch';
import AddEntryModal from './components/AddEntryModal';
import EditEntryModal from './components/EditEntryModal';
import SettingsModal from './components/SettingsModal';
import Sidebar from './components/Sidebar';
import LiveFeed from './components/LiveFeed';
import SystemTray from './components/SystemTray';
import AIAssistant from './components/AIAssistant';
import { MemoryEntry, SearchFilters } from './types';
import { searchEntries, exportData, importData } from './utils/dataUtils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const [entries, setEntries] = useLocalStorage<MemoryEntry[]>('rewind-entries', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [filteredEntries, setFilteredEntries] = useState<MemoryEntry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MemoryEntry | null>(null);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCapturing, setIsCapturing] = useLocalStorage('auto-capture', true);
  const [selectedEntry, setSelectedEntry] = useState<MemoryEntry | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real desktop app, this would capture clipboard, etc.
      // For demo purposes, we'll just ensure data persistence
      localStorage.setItem('rewind-entries', JSON.stringify(entries));
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [entries]);

  useEffect(() => {
    const results = searchEntries(entries, searchQuery, searchFilters);
    let filtered = results;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = results.filter(entry => entry.type === selectedCategory);
    }

    setFilteredEntries(filtered);
  }, [entries, searchQuery, searchFilters, selectedCategory]);

  // Auto-generate sample entries when capturing is enabled
  useEffect(() => {
    if (entries.length === 0 && isCapturing) {
      // Add some sample entries to demonstrate the system
      const sampleEntries: MemoryEntry[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'clipboard',
          title: 'React useEffect Hook Documentation',
          content: 'useEffect(() => {\n  // Effect logic here\n  return () => {\n    // Cleanup\n  };\n}, [dependencies]);',
          metadata: { tags: ['react', 'hooks', 'documentation'] }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'code',
          title: 'API Error Handler Function',
          content: 'const handleApiError = (error) => {\n  console.error("API Error:", error);\n  if (error.response?.status === 401) {\n    // Handle unauthorized\n  }\n};',
          metadata: { language: 'javascript', tags: ['api', 'error-handling', 'javascript'] }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          type: 'note',
          title: 'Sprint Planning Meeting Notes',
          content: '• Implement user authentication system\n• Fix responsive design issues on mobile\n• Add dark mode toggle\n• Performance optimization for large datasets',
          metadata: { tags: ['meeting', 'sprint', 'planning', 'tasks'] }
        }
      ];
      setEntries(sampleEntries);
    }
  }, [isCapturing, entries.length, setEntries]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+n': () => setShowAddModal(true),
    'cmd+f': () => document.getElementById('search-input')?.focus(),
    'cmd+,': () => setShowSettings(true),
    'cmd+e': () => handleExport(),
    'cmd+shift+a': () => setShowAI(!showAI),
    'cmd+shift+c': () => setIsCapturing(!isCapturing),
    'escape': () => {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowSettings(false);
      setShowAI(false);
    }
  });

  const addEntry = (entry: Omit<MemoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: MemoryEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = (updatedEntry: MemoryEntry) => {
    setEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    setShowEditModal(false);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleEditEntry = (entry: MemoryEntry) => {
    setEditingEntry(entry);
    setSelectedEntry(entry);
    setShowEditModal(true);
  };

  const handleExport = () => {
    exportData(entries);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    importData(event, (importedEntries) => {
      setEntries(prev => [...importedEntries, ...prev]);
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const getCategoryStats = () => {
    const stats = entries.reduce((acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      all: entries.length,
      ...stats
    };
  };

  const categoryStats = getCategoryStats();

  if (isMinimized) {
    return (
      <div className={`${isDarkMode ? 'dark' : ''}`}>
        <SystemTray
          isCapturing={isCapturing}
          onToggleCapture={() => setIsCapturing(!isCapturing)}
          onOpenSettings={() => {
            setIsMinimized(false);
            setShowSettings(true);
          }}
          onExport={handleExport}
          totalEntries={entries.length}
          onMinimize={() => setIsMinimized(true)}
          onClose={() => setIsMinimized(true)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryStats={categoryStats}
        onAddEntry={() => setShowAddModal(true)}
        onSettings={() => setShowSettings(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* System Tray */}
      <SystemTray
        isCapturing={isCapturing}
        onToggleCapture={() => setIsCapturing(!isCapturing)}
        onOpenSettings={() => setShowSettings(true)}
        onExport={handleExport}
        totalEntries={entries.length}
        onMinimize={() => setIsMinimized(true)}
        onClose={() => setIsMinimized(true)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Memory Timeline</h1>
                  {isCapturing && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Live</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {filteredEntries.length} of {entries.length} entries
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAI(!showAI)}
                  className={`p-2 rounded-lg transition-colors ${
                    showAI 
                      ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="AI Assistant (⌘⇧A)"
                >
                  <Brain className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  onClick={handleExport}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Export Data (⌘E)"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  title="Add Memory (⌘N)"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Memory</span>
                </button>
              </div>
            </div>
            
            <SemanticSearch
              entries={entries}
              onResults={setFilteredEntries}
              query={searchQuery}
              onQueryChange={setSearchQuery}
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Column - Timeline */}
          <div className="flex-1 px-6 py-8 overflow-y-auto">
            {/* Live Feed */}
            {isCapturing && (
              <div className="mb-8">
                <LiveFeed
                  onNewEntry={addEntry}
                  isActive={isCapturing}
                  onToggleActive={() => setIsCapturing(!isCapturing)}
                />
              </div>
            )}

            {/* Timeline Content */}
          {filteredEntries.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          ) : filteredEntries.length === 0 && entries.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your digital memory is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start by adding your first memory entry</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Your First Memory
              </button>
            </div>
          ) : (
            <Timeline 
              entries={filteredEntries} 
              onDeleteEntry={deleteEntry}
              onEditEntry={handleEditEntry}
            />
          )}
          </div>

          {/* Right Column - AI Assistant */}
          {showAI && (
            <div className="w-96 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
              <AIAssistant 
                entries={entries} 
                selectedEntry={selectedEntry}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddEntryModal
          onClose={() => setShowAddModal(false)}
          onAdd={addEntry}
        />
      )}

      {showEditModal && editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onClose={() => {
            setShowEditModal(false);
            setEditingEntry(null);
          }}
          onUpdate={updateEntry}
          onDelete={deleteEntry}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          entries={entries}
          onClearAll={() => setEntries([])}
        />
      )}
    </div>
  );
}

export default App;