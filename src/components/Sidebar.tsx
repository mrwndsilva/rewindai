import React from 'react';
import { 
  Clock, 
  Copy, 
  FileText, 
  Image, 
  Code, 
  StickyNote, 
  Plus, 
  Settings, 
  Moon, 
  Sun,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Folder
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryStats: Record<string, number>;
  onAddEntry: () => void;
  onSettings: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  selectedCategory,
  onCategoryChange,
  categoryStats,
  onAddEntry,
  onSettings,
  isDarkMode,
  onToggleTheme
}) => {
  const categories = [
    { id: 'all', label: 'All Memories', icon: Clock, color: 'text-gray-600 dark:text-gray-400' },
    { id: 'clipboard', label: 'Clipboard', icon: Copy, color: 'text-green-600 dark:text-green-400' },
    { id: 'file', label: 'Files', icon: FileText, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'screenshot', label: 'Screenshots', icon: Image, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'code', label: 'Code', icon: Code, color: 'text-orange-600 dark:text-orange-400' },
    { id: 'note', label: 'Notes', icon: StickyNote, color: 'text-yellow-600 dark:text-yellow-400' }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Rewind AI</h1>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onAddEntry}
          className={`w-full flex items-center space-x-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Add Memory (⌘N)' : undefined}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>Add Memory</span>}
        </button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Categories
            </h3>
          )}
          <nav className="space-y-1">
            {categories.map(category => {
              const Icon = category.icon;
              const count = categoryStats[category.id] || 0;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? `${category.label} (${count})` : undefined}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : category.color}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{category.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {count}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`flex ${collapsed ? 'flex-col space-y-2' : 'items-center justify-between'}`}>
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              collapsed ? 'w-full flex justify-center' : ''
            }`}
            title={collapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {!collapsed && <span className="ml-2 text-sm">{isDarkMode ? 'Light' : 'Dark'}</span>}
          </button>
          
          <button
            onClick={onSettings}
            className={`p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              collapsed ? 'w-full flex justify-center' : ''
            }`}
            title={collapsed ? 'Settings (⌘,)' : undefined}
          >
            <Settings className="w-4 h-4" />
            {!collapsed && <span className="ml-2 text-sm">Settings</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;