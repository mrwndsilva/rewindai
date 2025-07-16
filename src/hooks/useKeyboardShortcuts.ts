import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? event.metaKey : event.ctrlKey;
      
      // Create a key combination string
      let combination = '';
      if (cmdKey) combination += 'cmd+';
      if (event.shiftKey) combination += 'shift+';
      if (event.altKey) combination += 'alt+';
      combination += event.key.toLowerCase();

      // Check if this combination exists in our shortcuts
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}