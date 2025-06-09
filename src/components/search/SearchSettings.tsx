import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, Mic, Sparkles, Search, Shield, Clock, 
  Volume2, Brain, Target, Zap, Info, RotateCcw
} from 'lucide-react';
import { voiceSearchService } from '@/services/voiceSearch';
import { searchAnalytics } from '@/services/searchAnalytics';

interface SearchPreferences {
  enableVoiceSearch: boolean;
  enableAiSuggestions: boolean;
  enableAutoComplete: boolean;
  enableSearchHistory: boolean;
  enablePopularSuggestions: boolean;
  maxSearchHistory: number;
  voiceLanguage: string;
  searchResultsPerPage: number;
  enableAnalytics: boolean;
  enableSmartFilters: boolean;
  autoSearchDelay: number;
}

const defaultPreferences: SearchPreferences = {
  enableVoiceSearch: true,
  enableAiSuggestions: true,
  enableAutoComplete: true,
  enableSearchHistory: true,
  enablePopularSuggestions: true,
  maxSearchHistory: 5,
  voiceLanguage: 'en-US',
  searchResultsPerPage: 10,
  enableAnalytics: true,
  enableSmartFilters: true,
  autoSearchDelay: 300
};

const SearchSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<SearchPreferences>(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [microphoneAccess, setMicrophoneAccess] = useState<boolean | null>(null);

  useEffect(() => {
    loadPreferences();
    checkMicrophoneAccess();
  }, []);

  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem('onlyfur_search_preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch {
      setPreferences(defaultPreferences);
    }
  };

  const checkMicrophoneAccess = async () => {
    if (voiceSearchService.isSupported()) {
      const hasAccess = await voiceSearchService.checkMicrophonePermission();
      setMicrophoneAccess(hasAccess);
    } else {
      setMicrophoneAccess(false);
    }
  };

  const updatePreference = <K extends keyof SearchPreferences>(
    key: K, 
    value: SearchPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const savePreferences = () => {
    localStorage.setItem('onlyfur_search_preferences', JSON.stringify(preferences));
    setHasChanges(false);
    
    // Apply preferences immediately
    window.dispatchEvent(new CustomEvent('searchPreferencesChanged', { 
      detail: preferences 
    }));
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    setHasChanges(true);
  };

  const clearSearchData = () => {
    searchAnalytics.clearAnalytics();
    localStorage.removeItem('onlyfur_recent_searches');
    localStorage.removeItem('onlyfur_popular_searches');
    
    // Notify user
    alert('Search data cleared successfully');
  };

  const languageOptions = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'ru-RU', label: 'Russian' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Search Settings
          </h2>
          <p className="text-muted-foreground">
            Customize your search experience and AI features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Unsaved Changes
            </Badge>
          )}
          <Button 
            onClick={savePreferences} 
            disabled={!hasChanges}
            className="flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Features
            </CardTitle>
            <CardDescription>
              Configure AI-powered search enhancements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">AI Suggestions</label>
                <p className="text-xs text-muted-foreground">
                  Get intelligent search suggestions and corrections
                </p>
              </div>
              <Switch
                checked={preferences.enableAiSuggestions}
                onCheckedChange={(checked) => updatePreference('enableAiSuggestions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-Complete</label>
                <p className="text-xs text-muted-foreground">
                  Show search completions as you type
                </p>
              </div>
              <Switch
                checked={preferences.enableAutoComplete}
                onCheckedChange={(checked) => updatePreference('enableAutoComplete', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Smart Filters</label>
                <p className="text-xs text-muted-foreground">
                  AI-powered search result filtering
                </p>
              </div>
              <Switch
                checked={preferences.enableSmartFilters}
                onCheckedChange={(checked) => updatePreference('enableSmartFilters', checked)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Auto-Search Delay</label>
              <div className="px-3">
                <Slider
                  value={[preferences.autoSearchDelay]}
                  onValueChange={(value) => updatePreference('autoSearchDelay', value[0])}
                  max={1000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Fast (100ms)</span>
                  <span className="font-medium">{preferences.autoSearchDelay}ms</span>
                  <span>Slow (1000ms)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="w-5 h-5 mr-2" />
              Voice Search
            </CardTitle>
            <CardDescription>
              Configure voice search settings and language
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Voice Search Status */}
            {microphoneAccess === false && voiceSearchService.isSupported() && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Microphone access is required for voice search. Please allow access in your browser settings.
                </AlertDescription>
              </Alert>
            )}

            {!voiceSearchService.isSupported() && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Voice search is not supported in your browser. Please use a modern browser with Web Speech API support.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Enable Voice Search</label>
                <p className="text-xs text-muted-foreground">
                  Use voice commands to search content
                </p>
              </div>
              <Switch
                checked={preferences.enableVoiceSearch && voiceSearchService.isSupported()}
                onCheckedChange={(checked) => updatePreference('enableVoiceSearch', checked)}
                disabled={!voiceSearchService.isSupported()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Voice Language</label>
              <Select 
                value={preferences.voiceLanguage} 
                onValueChange={(value) => updatePreference('voiceLanguage', value)}
                disabled={!preferences.enableVoiceSearch || !voiceSearchService.isSupported()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}\n                </SelectContent>
              </Select>
            </div>

            {voiceSearchService.isSupported() && microphoneAccess && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center text-sm text-green-800 dark:text-green-200">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Voice search is ready and configured
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Search History
            </CardTitle>
            <CardDescription>
              Manage search history and suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Save Search History</label>
                <p className="text-xs text-muted-foreground">
                  Remember your recent searches
                </p>
              </div>
              <Switch
                checked={preferences.enableSearchHistory}
                onCheckedChange={(checked) => updatePreference('enableSearchHistory', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Popular Suggestions</label>
                <p className="text-xs text-muted-foreground">
                  Show trending and popular searches
                </p>
              </div>
              <Switch
                checked={preferences.enablePopularSuggestions}
                onCheckedChange={(checked) => updatePreference('enablePopularSuggestions', checked)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">History Size</label>
              <div className="px-3">
                <Slider
                  value={[preferences.maxSearchHistory]}
                  onValueChange={(value) => updatePreference('maxSearchHistory', value[0])}
                  max={20}
                  min={3}
                  step={1}
                  className="w-full"
                  disabled={!preferences.enableSearchHistory}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3 searches</span>
                  <span className="font-medium">{preferences.maxSearchHistory} searches</span>
                  <span>20 searches</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Display Settings
            </CardTitle>
            <CardDescription>
              Customize search results and interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Results Per Page</label>
              <Select 
                value={preferences.searchResultsPerPage.toString()} 
                onValueChange={(value) => updatePreference('searchResultsPerPage', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 results</SelectItem>
                  <SelectItem value="10">10 results</SelectItem>
                  <SelectItem value="15">15 results</SelectItem>
                  <SelectItem value="20">20 results</SelectItem>
                  <SelectItem value="25">25 results</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Search Analytics</label>
                <p className="text-xs text-muted-foreground">
                  Track search behavior for insights
                </p>
              </div>
              <Switch
                checked={preferences.enableAnalytics}
                onCheckedChange={(checked) => updatePreference('enableAnalytics', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
          <CardDescription>
            Manage your search data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>

            <Button
              variant="outline"
              onClick={clearSearchData}
              className="flex items-center justify-center"
            >
              <Target className="w-4 h-4 mr-2" />
              Clear Search Data
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const data = {
                  preferences,
                  analytics: searchAnalytics.getAnalytics(),
                  popular: searchAnalytics.getPopularSearches()
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'search-data-export.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center justify-center"
            >
              <Zap className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your search preferences are stored locally in your browser. Clearing browser data will reset these settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Advanced Features
          </CardTitle>
          <CardDescription>
            Experimental and beta search features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Coming Soon</p>
            <p className="text-sm">Advanced AI features will be available in future updates</p>
            <div className="flex justify-center mt-4 space-x-2">
              <Badge variant="outline">Neural Search</Badge>
              <Badge variant="outline">Semantic Understanding</Badge>
              <Badge variant="outline">Context Awareness</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchSettings;
