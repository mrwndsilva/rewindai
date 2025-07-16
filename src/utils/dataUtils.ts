import { MemoryEntry, SearchFilters } from '../types';

export function searchEntries(entries: MemoryEntry[], query: string, filters: SearchFilters): MemoryEntry[] {
  let filtered = [...entries];

  // Apply type filter
  if (filters.type) {
    filtered = filtered.filter(entry => entry.type === filters.type);
  }

  // Apply date range filter
  if (filters.dateRange?.start || filters.dateRange?.end) {
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const start = filters.dateRange?.start ? new Date(filters.dateRange.start) : null;
      const end = filters.dateRange?.end ? new Date(filters.dateRange.end) : null;

      if (start && entryDate < start) return false;
      if (end && entryDate > end) return false;
      return true;
    });
  }

  // Apply text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(entry => {
      const searchableText = [
        entry.title,
        entry.content,
        entry.metadata?.filePath,
        entry.metadata?.language,
        entry.metadata?.context,
        ...(entry.metadata?.tags || [])
      ].join(' ').toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  // Sort by timestamp (newest first)
  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function exportData(entries: MemoryEntry[]): void {
  const dataStr = JSON.stringify(entries, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `rewind-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function importData(
  event: React.ChangeEvent<HTMLInputElement>,
  onImport: (entries: MemoryEntry[]) => void
): void {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      if (Array.isArray(data)) {
        // Validate that each item has the required fields
        const validEntries = data.filter(item => 
          item.id && item.timestamp && item.type && item.title && item.content
        );
        onImport(validEntries);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Invalid file format. Please select a valid JSON backup file.');
    }
  };
  reader.readAsText(file);
  
  // Reset the input
  event.target.value = '';
}