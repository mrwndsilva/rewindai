export interface MemoryEntry {
  id: string;
  timestamp: string;
  type: 'clipboard' | 'file' | 'screenshot' | 'code' | 'note';
  title: string;
  content: string;
  metadata?: {
    filePath?: string;
    fileType?: string;
    language?: string;
    imageUrl?: string;
    tags?: string[];
    context?: string;
  };
}

export interface SearchFilters {
  type?: MemoryEntry['type'];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface AppSettings {
  autoCapture: boolean;
  captureInterval: number;
  maxEntries: number;
  enableOCR: boolean;
}