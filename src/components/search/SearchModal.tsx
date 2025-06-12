import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Hash, FileText, TrendingUp, Clock, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { realDataAPI } from '@/services/realDataAPI';

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

  // Real data state
  const [hasRealData, setHasRealData] = useState(false);

  // Check for real data on component mount
  useEffect(() => {
    const checkRealData = async () => {
      const hasData = await realDataAPI.hasRealData();
      setHasRealData(hasData);
    };
    checkRealData();
  }, []);

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

  // Search function using real data
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const searchResults: SearchResult[] = [];
      
      if (hasRealData) {
        // Search users/creators
        const usersResponse = await realDataAPI.searchUsers(searchQuery, 5);
        if (usersResponse.success && usersResponse.users) {
          const userResults = usersResponse.users.map((user: any) => ({
            id: `creator-${user.id}`,
            type: 'creator' as const,
            title: user.displayName || user.username,
            subtitle: `${user.followersCount || 0} followers • ${user.bio?.slice(0, 30) || 'Content Creator'}...`,
            thumbnail: user.avatar || '/images/branding/fox-mascot.webp',
            url: `/profile/${user.username}`,
            badge: user.isVerified ? 'Verified' : undefined
          }));
          searchResults.push(...userResults);
        }

        // Search content
        const contentResponse = await realDataAPI.getRealContent(5, 0, false);
        if (contentResponse.success && contentResponse.content) {
          const contentResults = contentResponse.content
            .filter((content: any) => 
              content.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              content.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 5)
            .map((content: any) => ({
              id: `content-${content.id}`,
              type: 'content' as const,
              title: content.title,
              subtitle: `By ${content.creator?.displayName || 'Creator'} • ${new Date(content.createdAt).toLocaleDateString()}`,
              thumbnail: content.thumbnailUrl || '/images/branding/fox-mascot.webp',
              url: `/content/${content.id}`,
              badge: content.status === 'published' ? 'Published' : undefined
            }));
          searchResults.push(...contentResults);
        }
      }

      // Add some general navigation results
      const generalResults: SearchResult[] = [
        {
          id: 'general-creators',
          type: 'general' as 'general',
          title: 'Explore Creators',
          subtitle: 'Discover amazing content creators',
          url: '/explore'
        },
        {
          id: 'general-help',
          type: 'general' as 'general',
          title: 'Help Center',
          subtitle: 'Get help and support',
          url: '/help'
        }
      ].filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      searchResults.push(...generalResults);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
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
