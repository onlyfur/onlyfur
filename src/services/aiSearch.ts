interface AISearchSuggestion {
  query: string;
  type: 'completion' | 'correction' | 'related' | 'trending';
  confidence: number;
  category: string;
  description?: string;
}

interface SearchIntent {
  intent: 'creator' | 'content' | 'tutorial' | 'commission' | 'general';
  confidence: number;
  entities: string[];
  modifiers: string[];
}

interface AISearchResult {
  enhanced: boolean;
  intent: SearchIntent;
  suggestions: AISearchSuggestion[];
  relatedQueries: string[];
  didYouMean?: string;
}

class AISearchService {
  private readonly SEARCH_PATTERNS = {
    creator: [
      /(?:creator|artist|user|profile|account)\s+(.+)/i,
      /(.+)\s+(?:creator|artist|profile)/i,
      /who\s+is\s+(.+)/i,
      /find\s+(?:creator|artist)\s+(.+)/i
    ],
    content: [
      /(?:content|post|image|video|art)\s+(.+)/i,
      /(.+)\s+(?:content|post|art|artwork)/i,
      /show\s+me\s+(.+)/i
    ],
    tutorial: [
      /(?:tutorial|guide|how\s+to|learn)\s+(.+)/i,
      /(.+)\s+(?:tutorial|guide|lesson)/i,
      /how\s+to\s+(.+)/i,
      /learn\s+(.+)/i
    ],
    commission: [
      /(?:commission|price|cost|buy)\s+(.+)/i,
      /(.+)\s+(?:commission|price|pricing)/i,
      /how\s+much\s+(.+)/i
    ]
  };

  private readonly COMMON_TYPOS = {
    'furry': ['fury', 'furry', 'fary', 'furi'],
    'animation': ['animtion', 'aniamtion', 'animaton'],
    'tutorial': ['tutoral', 'tutorail', 'tutoril'],
    'commission': ['comission', 'commision', 'commmission'],
    'character': ['charachter', 'charcter', 'charecter'],
    'digital': ['digitial', 'digtal', 'digitl'],
    'artist': ['artst', 'artis', 'arist'],
    'creator': ['creater', 'creatoor', 'creator']
  };

  private readonly SYNONYMS = {
    'art': ['artwork', 'drawing', 'illustration', 'painting', 'design'],
    'tutorial': ['guide', 'lesson', 'walkthrough', 'howto', 'instruction'],
    'creator': ['artist', 'user', 'maker', 'designer'],
    'commission': ['order', 'custom', 'request', 'hire'],
    'furry': ['anthro', 'anthropomorphic', 'fursona', 'fursuit'],
    'animation': ['animated', 'motion', 'video', 'gif', 'sequence']
  };

  private readonly TRENDING_TOPICS = [
    'digital art', 'character design', 'fursuit making', 'animation tutorial',
    'commission prices', 'art critique', 'speedpaint', 'ref sheet',
    'world building', 'character development', 'color theory', 'anatomy'
  ];

  // Analyze search query using AI techniques
  analyzeQuery(query: string): AISearchResult {
    const normalizedQuery = this.normalizeQuery(query);
    const intent = this.detectIntent(normalizedQuery);
    const suggestions = this.generateSuggestions(normalizedQuery, intent);
    const relatedQueries = this.findRelatedQueries(normalizedQuery);
    const didYouMean = this.checkSpelling(normalizedQuery);

    return {
      enhanced: true,
      intent,
      suggestions,
      relatedQueries,
      didYouMean
    };
  }

  // Normalize and clean query
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^\w\s#@]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  // Detect user intent from query
  private detectIntent(query: string): SearchIntent {
    const intents = Object.entries(this.SEARCH_PATTERNS);
    
    for (const [intentType, patterns] of intents) {
      for (const pattern of patterns) {
        const match = query.match(pattern);
        if (match) {
          return {
            intent: intentType as any,
            confidence: 0.8,
            entities: this.extractEntities(query),
            modifiers: this.extractModifiers(query)
          };
        }
      }
    }

    // Default intent based on keywords
    if (query.includes('tutorial') || query.includes('how')) {
      return { intent: 'tutorial', confidence: 0.6, entities: [], modifiers: [] };
    }
    if (query.includes('commission') || query.includes('price')) {
      return { intent: 'commission', confidence: 0.7, entities: [], modifiers: [] };
    }
    if (query.includes('artist') || query.includes('creator')) {
      return { intent: 'creator', confidence: 0.6, entities: [], modifiers: [] };
    }

    return { intent: 'general', confidence: 0.5, entities: [], modifiers: [] };
  }

  // Extract entities from query
  private extractEntities(query: string): string[] {
    const entities: string[] = [];
    
    // Extract hashtags
    const hashtags = query.match(/#\w+/g);
    if (hashtags) {
      entities.push(...hashtags);
    }
    
    // Extract @mentions
    const mentions = query.match(/@\w+/g);
    if (mentions) {
      entities.push(...mentions);
    }
    
    // Extract quoted phrases
    const quotes = query.match(/"([^"]+)"/g);
    if (quotes) {
      entities.push(...quotes.map(q => q.replace(/"/g, '')));
    }
    
    return entities;
  }

  // Extract modifiers (adjectives, descriptors)
  private extractModifiers(query: string): string[] {
    const modifiers = [
      'new', 'old', 'recent', 'popular', 'trending', 'best', 'top',
      'beginner', 'advanced', 'professional', 'amateur',
      'free', 'paid', 'premium', 'exclusive',
      'cute', 'cool', 'awesome', 'amazing'
    ];
    
    return modifiers.filter(mod => query.includes(mod));
  }

  // Generate AI-powered suggestions
  private generateSuggestions(query: string, intent: SearchIntent): AISearchSuggestion[] {
    const suggestions: AISearchSuggestion[] = [];
    
    // Auto-completion suggestions
    suggestions.push(...this.generateCompletions(query));
    
    // Spelling corrections
    const correction = this.checkSpelling(query);
    if (correction && correction !== query) {
      suggestions.push({
        query: correction,
        type: 'correction',
        confidence: 0.9,
        category: 'spelling',
        description: 'Did you mean this?'
      });
    }
    
    // Related suggestions based on intent
    suggestions.push(...this.generateIntentBasedSuggestions(query, intent));
    
    // Trending suggestions
    suggestions.push(...this.generateTrendingSuggestions(query));
    
    return suggestions.slice(0, 10); // Limit to top 10
  }

  // Generate query completions
  private generateCompletions(query: string): AISearchSuggestion[] {
    const completions: AISearchSuggestion[] = [];
    
    // Find completions based on common patterns
    const commonCompletions = [
      'digital art tutorial',
      'character design guide',
      'fursuit making tips',
      'animation basics',
      'commission pricing',
      'art critique',
      'color theory',
      'anatomy reference'
    ];
    
    commonCompletions
      .filter(completion => completion.startsWith(query) && completion !== query)
      .forEach(completion => {
        completions.push({
          query: completion,
          type: 'completion',
          confidence: 0.8,
          category: 'auto-complete'
        });
      });
    
    return completions.slice(0, 3);
  }

  // Generate intent-based suggestions
  private generateIntentBasedSuggestions(query: string, intent: SearchIntent): AISearchSuggestion[] {
    const suggestions: AISearchSuggestion[] = [];
    
    switch (intent.intent) {
      case 'tutorial':
        suggestions.push(
          { query: `${query} beginner`, type: 'related', confidence: 0.7, category: 'tutorial' },
          { query: `${query} advanced`, type: 'related', confidence: 0.7, category: 'tutorial' },
          { query: `${query} step by step`, type: 'related', confidence: 0.8, category: 'tutorial' }
        );
        break;
      
      case 'creator':
        suggestions.push(
          { query: `${query} portfolio`, type: 'related', confidence: 0.7, category: 'creator' },
          { query: `${query} commissions`, type: 'related', confidence: 0.8, category: 'creator' },
          { query: `${query} gallery`, type: 'related', confidence: 0.7, category: 'creator' }
        );
        break;
      
      case 'commission':
        suggestions.push(
          { query: `${query} prices`, type: 'related', confidence: 0.9, category: 'commission' },
          { query: `${query} examples`, type: 'related', confidence: 0.8, category: 'commission' },
          { query: `${query} terms of service`, type: 'related', confidence: 0.7, category: 'commission' }
        );
        break;
    }
    
    return suggestions;
  }

  // Generate trending suggestions
  private generateTrendingSuggestions(query: string): AISearchSuggestion[] {
    return this.TRENDING_TOPICS
      .filter(topic => topic.includes(query) || query.includes(topic.split(' ')[0]))
      .slice(0, 2)
      .map(topic => ({
        query: topic,
        type: 'trending' as const,
        confidence: 0.6,
        category: 'trending',
        description: 'Trending now'
      }));
  }

  // Check spelling and suggest corrections
  private checkSpelling(query: string): string | undefined {
    const words = query.split(' ');
    const correctedWords: string[] = [];
    let hasCorrection = false;
    
    for (const word of words) {
      let corrected = word;
      
      // Check against common typos
      for (const [correct, typos] of Object.entries(this.COMMON_TYPOS)) {
        if (typos.includes(word)) {
          corrected = correct;
          hasCorrection = true;
          break;
        }
      }
      
      correctedWords.push(corrected);
    }
    
    return hasCorrection ? correctedWords.join(' ') : undefined;
  }

  // Find related queries
  private findRelatedQueries(query: string): string[] {
    const related: string[] = [];
    const words = query.split(' ');
    
    // Find synonyms and related terms
    words.forEach(word => {
      if (this.SYNONYMS[word]) {
        const synonyms = this.SYNONYMS[word];
        synonyms.forEach(synonym => {
          const relatedQuery = query.replace(word, synonym);
          if (relatedQuery !== query) {
            related.push(relatedQuery);
          }
        });
      }
    });
    
    return related.slice(0, 5);
  }

  // Get search suggestions for autocomplete
  getAutocompletesSuggestions(partialQuery: string): string[] {
    if (partialQuery.length < 2) return [];
    
    const suggestions = new Set<string>();
    
    // Add completions
    this.generateCompletions(partialQuery).forEach(s => suggestions.add(s.query));
    
    // Add trending that match
    this.TRENDING_TOPICS
      .filter(topic => topic.toLowerCase().includes(partialQuery.toLowerCase()))
      .forEach(topic => suggestions.add(topic));
    
    return Array.from(suggestions).slice(0, 8);
  }

  // Enhance search results with AI insights
  enhanceSearchResults(results: any[], query: string): any[] {
    const analysis = this.analyzeQuery(query);
    
    // Sort results based on intent and relevance
    return results.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, analysis);
      const bScore = this.calculateRelevanceScore(b, analysis);
      return bScore - aScore;
    });
  }

  // Calculate relevance score for search result
  private calculateRelevanceScore(result: any, analysis: AISearchResult): number {
    let score = 0;
    
    // Base score from result type matching intent
    if (analysis.intent.intent === 'creator' && result.type === 'creator') score += 10;
    if (analysis.intent.intent === 'content' && result.type === 'content') score += 10;
    if (analysis.intent.intent === 'tutorial' && result.title.toLowerCase().includes('tutorial')) score += 10;
    
    // Boost for exact matches in title
    analysis.intent.entities.forEach(entity => {
      if (result.title.toLowerCase().includes(entity.toLowerCase())) {
        score += 5;
      }
    });
    
    // Boost for badges (verified, popular, etc.)
    if (result.badge) score += 3;
    
    return score;
  }
}

export const aiSearchService = new AISearchService();
export type { AISearchSuggestion, SearchIntent, AISearchResult };
