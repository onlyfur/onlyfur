import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Hash, FileText, TrendingUp, Clock, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SearchResult {
  id: string;
  type: 'creator' | 'content' | 'tag' | 'general';
  title: string;
  subtitle?: string;
  thumbnail?: string;
  url: string;
  badge?: string;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Mock search data
  const mockResults: SearchResult[] = [
    // Creators
    {
      id: 'creator-1',
      type: 'creator',
      title: 'FurryArtist_Pro',
      subtitle: '12.5K followers • Digital Art',
      thumbnail: '/images/branding/fox-mascot.webp',
      url: '/profile/furryartist-pro',
      badge: 'Verified'
    },
    {
      id: 'creator-2',
      type: 'creator',
      title: 'PawsomeMaker',
      subtitle: '8.2K followers • Animation',
      thumbnail: '/images/branding/fox-mascot.webp',
      url: '/profile/pawsomemaker'
    },
    // Content
    {
      id: 'content-1',
      type: 'content',
      title: 'Amazing Forest Scene Digital Art',
      subtitle: 'By FurryArtist_Pro • 2 hours ago',
      thumbnail: '/images/branding/fox-mascot.webp',
      url: '/content/amazing-forest-scene',
      badge: 'New'
    },
    {
      id: 'content-2',
      type: 'content',
      title: 'Character Design Tutorial',
      subtitle: 'By PawsomeMaker • 1 day ago',
      thumbnail: '/images/branding/fox-mascot.webp',
      url: '/content/character-design-tutorial',
      badge: 'Popular'
    },
    // Tags
    {
      id: 'tag-1',
      type: 'tag',
      title: '#DigitalArt',
      subtitle: '1.2K posts',
      url: '/explore?tag=digitalart'
    },
    {
      id: 'tag-2',
      type: 'tag',
      title: '#Animation',
      subtitle: '856 posts',
      url: '/explore?tag=animation'
    },
    // General pages
    {
      id: 'general-1',
      type: 'general',
      title: 'Creator Program',
      subtitle: 'Join our creator program',
      url: '/creator-program'
    },
    {
      id: 'general-2',
      type: 'general',
      title: 'Help Center',
      subtitle: 'Get help and support',
      url: '/help'
    }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onlyfur_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [
      result.title,
      ...recentSearches.filter(search => search !== result.title)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('onlyfur_recent_searches', JSON.stringify(newRecentSearches));

    // Navigate to result
    navigate(result.url);
    onOpenChange(false);
    setQuery('');
    setResults([]);
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('onlyfur_recent_searches');
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleResultClick(results[0]);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'creator': return User;
      case 'content': return FileText;
      case 'tag': return Hash;
      default: return Search;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search OnlyFur
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search for creators, content, or tags..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pl-10 h-12 text-lg"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex items-center w-full p-2 text-left rounded-md hover:bg-accent transition-colors"
                  >
                    <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="px-6 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result) => {
                    const Icon = getResultIcon(result.type);
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center w-full p-3 text-left rounded-md hover:bg-accent transition-colors group"
                      >
                        {result.thumbnail ? (
                          <Avatar className="w-10 h-10 mr-3">
                            <AvatarImage src={result.thumbnail} alt={result.title} />
                            <AvatarFallback>
                              <Icon className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 mr-3 rounded-full bg-accent flex items-center justify-center">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium truncate">{result.title}</p>
                            {result.badge && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {result.badge}
                              </Badge>
                            )}
                          </div>
                          {result.subtitle && (
                            <p className="text-xs text-muted-foreground truncate">
                              {result.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center ml-2">
                          {result.type === 'content' && (
                            <TrendingUp className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try different keywords or check your spelling
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Popular Searches */}
          {!query && recentSearches.length === 0 && (
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Searches</h3>
              <div className="space-y-2">
                {['Digital Art', 'Animation', 'Character Design', 'Fursuit Making'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentSearchClick(term)}
                    className="flex items-center w-full p-2 text-left rounded-md hover:bg-accent transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span className="text-sm">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1 py-0.5 text-xs bg-background border rounded">Enter</kbd> to select first result
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
