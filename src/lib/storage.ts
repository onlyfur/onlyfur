// Content storage and persistence system for OnlyFur
// Uses IndexedDB for large file storage and localStorage for metadata

export interface StoredContent {
  id: string;
  userId: string;
  type: 'image' | 'video' | 'audio';
  fileName: string;
  fileSize: number;
  mimeType: string;
  data: string; // Base64 encoded data
  thumbnail?: string; // Base64 encoded thumbnail
  tags: string[];
  species?: string;
  isNSFW: boolean;
  title: string;
  description: string;
  price?: number;
  isPublic: boolean;
  likes: number;
  views: number;
  comments: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentFilter {
  species?: string[];
  tags?: string[];
  contentType?: string[];
  isNSFW?: boolean;
  priceRange?: [number, number];
  userId?: string;
  sortBy?: 'newest' | 'popular' | 'trending' | 'price';
}

// Initialize IndexedDB for large file storage
const initIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OnlyFurDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create content store
      if (!db.objectStoreNames.contains('content')) {
        const contentStore = db.createObjectStore('content', { keyPath: 'id' });
        contentStore.createIndex('userId', 'userId', { unique: false });
        contentStore.createIndex('type', 'type', { unique: false });
        contentStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      // Create user data store
      if (!db.objectStoreNames.contains('userData')) {
        db.createObjectStore('userData', { keyPath: 'userId' });
      }
    };
  });
};

// Content management functions
export class ContentStorage {
  private static db: IDBDatabase | null = null;
  
  static async init(): Promise<void> {
    if (!this.db) {
      this.db = await initIndexedDB();
    }
  }
  
  static async saveContent(content: Omit<StoredContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    await this.init();
    
    const contentWithMeta: StoredContent = {
      ...content,
      id: this.generateContentId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const transaction = this.db!.transaction(['content'], 'readwrite');
    const store = transaction.objectStore('content');
    
    await new Promise((resolve, reject) => {
      const request = store.add(contentWithMeta);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Update user analytics
    this.updateUserContentCount(content.userId);
    
    return contentWithMeta.id;
  }
  
  static async getContent(contentId: string): Promise<StoredContent | null> {
    await this.init();
    
    const transaction = this.db!.transaction(['content'], 'readonly');
    const store = transaction.objectStore('content');
    
    return new Promise((resolve, reject) => {
      const request = store.get(contentId);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Convert date strings back to Date objects
          result.createdAt = new Date(result.createdAt);
          result.updatedAt = new Date(result.updatedAt);
        }
        resolve(result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  static async getUserContent(userId: string): Promise<StoredContent[]> {
    await this.init();
    
    const transaction = this.db!.transaction(['content'], 'readonly');
    const store = transaction.objectStore('content');
    const index = store.index('userId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => {
        const results = request.result.map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt)
        }));
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  static async getAllContent(filter?: ContentFilter): Promise<StoredContent[]> {
    await this.init();
    
    const transaction = this.db!.transaction(['content'], 'readonly');
    const store = transaction.objectStore('content');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        let results = request.result.map((content: any) => ({
          ...content,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt)
        }));
        
        // Apply filters
        if (filter) {
          results = this.applyFilters(results, filter);
        }
        
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  static async updateContent(contentId: string, updates: Partial<StoredContent>): Promise<boolean> {
    await this.init();
    
    const existing = await this.getContent(contentId);
    if (!existing) return false;
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    
    const transaction = this.db!.transaction(['content'], 'readwrite');
    const store = transaction.objectStore('content');
    
    return new Promise((resolve, reject) => {
      const request = store.put(updated);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
  
  static async deleteContent(contentId: string): Promise<boolean> {
    await this.init();
    
    const content = await this.getContent(contentId);
    if (!content) return false;
    
    const transaction = this.db!.transaction(['content'], 'readwrite');
    const store = transaction.objectStore('content');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(contentId);
      request.onsuccess = () => {
        this.updateUserContentCount(content.userId, -1);
        resolve(true);
      };
      request.onerror = () => reject(request.error);
    });
  }
  
  static async incrementViews(contentId: string): Promise<void> {
    const content = await this.getContent(contentId);
    if (content) {
      await this.updateContent(contentId, { views: content.views + 1 });
    }
  }
  
  static async toggleLike(contentId: string, userId: string): Promise<boolean> {
    const content = await this.getContent(contentId);
    if (!content) return false;
    
    // For simplicity, we'll just increment/decrement likes
    // In a real app, you'd track which users liked what
    const likes = content.likes + (Math.random() > 0.5 ? 1 : -1);
    await this.updateContent(contentId, { likes: Math.max(0, likes) });
    return true;
  }
  
  private static generateContentId(): string {
    return 'content-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  private static updateUserContentCount(userId: string, change: number = 1): void {
    // Update user analytics in localStorage
    const stored = localStorage.getItem('onlyfur-database');
    if (stored) {
      try {
        const db = JSON.parse(stored);
        if (!db.analytics[userId]) {
          db.analytics[userId] = {
            totalViews: 0,
            totalLikes: 0,
            subscriberCount: 0,
            revenue: 0,
            contentCount: 0
          };
        }
        db.analytics[userId].contentCount = Math.max(0, db.analytics[userId].contentCount + change);
        localStorage.setItem('onlyfur-database', JSON.stringify(db));
      } catch (error) {
        console.error('Failed to update user analytics:', error);
      }
    }
  }
  
  private static applyFilters(content: StoredContent[], filter: ContentFilter): StoredContent[] {
    let filtered = content;
    
    // Filter by species
    if (filter.species && filter.species.length > 0) {
      filtered = filtered.filter(c => filter.species!.includes(c.species || ''));
    }
    
    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(c => 
        filter.tags!.some(tag => c.tags.includes(tag))
      );
    }
    
    // Filter by content type
    if (filter.contentType && filter.contentType.length > 0) {
      filtered = filtered.filter(c => filter.contentType!.includes(c.type));
    }
    
    // Filter by NSFW
    if (filter.isNSFW !== undefined) {
      filtered = filtered.filter(c => c.isNSFW === filter.isNSFW);
    }
    
    // Filter by price range
    if (filter.priceRange) {
      filtered = filtered.filter(c => {
        const price = c.price || 0;
        return price >= filter.priceRange![0] && price <= filter.priceRange![1];
      });
    }
    
    // Filter by user
    if (filter.userId) {
      filtered = filtered.filter(c => c.userId === filter.userId);
    }
    
    // Sort results
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'newest':
          filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'popular':
          filtered.sort((a, b) => b.likes - a.likes);
          break;
        case 'trending':
          filtered.sort((a, b) => b.views - a.views);
          break;
        case 'price':
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
      }
    }
    
    return filtered;
  }
}

// File processing utilities
export const processImageFile = async (file: File): Promise<{ data: string; thumbnail: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      
      // Create thumbnail
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Calculate thumbnail size (max 200x200)
        const maxSize = 200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve({ data, thumbnail });
      };
      img.src = data;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const processVideoFile = async (file: File): Promise<{ data: string; thumbnail: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      
      // Create video element to generate thumbnail
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Seek to 1 second
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = (video.videoHeight / video.videoWidth) * 200;
        
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve({ data, thumbnail });
      };
      video.src = data;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Furry-specific content categories and tags
export const FURRY_SPECIES = [
  'Fox', 'Wolf', 'Cat', 'Dog', 'Dragon', 'Tiger', 'Lion', 'Bear',
  'Rabbit', 'Horse', 'Deer', 'Otter', 'Shark', 'Bird', 'Reptile',
  'Hybrid', 'Protogen', 'Sergal', 'Other'
];

export const FURRY_CONTENT_TAGS = [
  'Fursuit', 'Murrsuit', 'Art', 'Photography', 'Video', 'Animation',
  'Partial', 'Fullsuit', 'Head Only', 'Paws', 'Tail', 'Ears',
  'Commission', 'YCH', 'Reference Sheet', 'Character Design',
  'Convention', 'Outdoor', 'Indoor', 'Studio', 'Candid',
  'Cute', 'Sexy', 'Artistic', 'Funny', 'Action', 'Pose'
];

export const ADULT_CONTENT_TAGS = [
  'NSFW', 'Adult', 'Mature', 'Explicit', 'Suggestive', 'Fetish',
  'Kink', 'Roleplay', 'Fantasy', 'Erotic', 'Sensual', 'Intimate'
];
