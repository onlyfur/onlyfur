interface UserProfile {
  id: string;
  demographics: {
    age_group?: string;
    location?: string;
    language_preference: string[];
    timezone?: string;
  };
  interests: {
    content_categories: Map<string, number>; // category -> interest score (0-1)
    art_styles: Map<string, number>;
    content_types: Map<string, number>;
    creator_preferences: Map<string, number>;
    topic_clusters: Map<string, number>;
  };
  behavior: {
    search_patterns: {
      peak_hours: number[];
      session_duration_avg: number;
      queries_per_session: number;
      search_depth: number; // how far down results they typically go
    };
    interaction_patterns: {
      click_through_rate: number;
      time_spent_per_result: number;
      bounce_rate: number;
      conversion_rate: number;
    };
    content_consumption: {
      preferred_content_length: 'short' | 'medium' | 'long';
      preferred_formats: string[];
      quality_sensitivity: number;
      novelty_preference: number; // 0 = familiar content, 1 = novel content
    };
  };
  context: {
    device_preferences: Map<string, number>; // device type -> usage frequency
    temporal_patterns: Map<string, number>; // time period -> activity level
    seasonal_trends: Map<string, number>; // season/month -> preference changes
  };
  learning_model: {
    feature_weights: Map<string, number>;
    similarity_vectors: number[];
    cluster_membership: string[];
    last_updated: string;
    confidence_score: number;
  };
}

interface PersonalizationContext {
  current_session: {
    device_type: string;
    time_of_day: string;
    session_start: string;
    previous_queries: string[];
    viewed_results: string[];
    clicked_results: string[];
  };
  recent_activity: {
    last_7_days: {
      searches: string[];
      content_viewed: string[];
      creators_followed: string[];
      tags_explored: string[];
    };
    last_30_days: {
      trending_interests: string[];
      engagement_changes: Map<string, number>;
      discovery_rate: number;
    };
  };
  external_signals: {
    trending_topics: string[];
    seasonal_content: string[];
    community_activity: Map<string, number>;
    platform_recommendations: string[];
  };
}

interface PersonalizedResult {
  original_result: any;
  personalization_score: number;
  boost_factors: {
    interest_match: number;
    behavioral_fit: number;
    temporal_relevance: number;
    social_signals: number;
    novelty_factor: number;
  };
  explanation: {
    primary_reason: string;
    secondary_reasons: string[];
    confidence: number;
  };
  similar_users_liked: boolean;
  predicted_engagement: {
    click_probability: number;
    time_spent_prediction: number;
    satisfaction_score: number;
  };
}

interface LearningSignal {
  user_id: string;
  query: string;
  results_shown: string[];
  clicked_results: string[];
  time_spent: Map<string, number>;
  satisfaction_rating?: number;
  search_success: boolean;
  timestamp: string;
  context: PersonalizationContext;
}

class SearchPersonalizationEngine {
  private userProfiles: Map<string, UserProfile> = new Map();
  private learningSignals: LearningSignal[] = [];
  private collaborativeFilters: Map<string, string[]> = new Map(); // user similarities
  private globalTrends: Map<string, number> = new Map();
  private modelVersion = '2.7.0';

  constructor() {
    this.initializePersonalization();
    this.loadGlobalTrends();
  }

  private initializePersonalization(): void {
    // Load user profiles from storage
    const savedProfiles = localStorage.getItem('personalization_profiles');
    if (savedProfiles) {
      try {
        const parsed = JSON.parse(savedProfiles);
        for (const [userId, profile] of Object.entries(parsed)) {
          this.userProfiles.set(userId, this.deserializeProfile(profile as any));
        }
      } catch (error) {
        console.warn('Failed to load personalization profiles:', error);
      }
    }

    // Initialize default profile if none exists
    if (!this.userProfiles.has('current_user')) {
      this.createDefaultProfile('current_user');
    }
  }

  private createDefaultProfile(userId: string): UserProfile {
    const profile: UserProfile = {
      id: userId,
      demographics: {
        language_preference: ['en'],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      interests: {
        content_categories: new Map(),
        art_styles: new Map(),
        content_types: new Map(),
        creator_preferences: new Map(),
        topic_clusters: new Map()
      },
      behavior: {
        search_patterns: {
          peak_hours: [],
          session_duration_avg: 0,
          queries_per_session: 0,
          search_depth: 3
        },
        interaction_patterns: {
          click_through_rate: 0.1,
          time_spent_per_result: 30,
          bounce_rate: 0.6,
          conversion_rate: 0.05
        },
        content_consumption: {
          preferred_content_length: 'medium',
          preferred_formats: ['image', 'text'],
          quality_sensitivity: 0.7,
          novelty_preference: 0.5
        }
      },
      context: {
        device_preferences: new Map(),
        temporal_patterns: new Map(),
        seasonal_trends: new Map()
      },
      learning_model: {
        feature_weights: new Map(),
        similarity_vectors: new Array(50).fill(0),
        cluster_membership: [],
        last_updated: new Date().toISOString(),
        confidence_score: 0.1
      }
    };

    this.userProfiles.set(userId, profile);
    this.saveProfiles();
    return profile;
  }

  private loadGlobalTrends(): void {
    // Simulate global trending data
    this.globalTrends.set('digital_art', 0.8);
    this.globalTrends.set('character_design', 0.7);
    this.globalTrends.set('animation', 0.6);
    this.globalTrends.set('fursuit', 0.5);
    this.globalTrends.set('tutorials', 0.9);
    this.globalTrends.set('commissions', 0.4);
  }

  // Main personalization function
  async personalizeSearchResults(
    originalResults: any[],
    query: string,
    userId: string = 'current_user',
    context: PersonalizationContext
  ): Promise<PersonalizedResult[]> {
    const profile = this.getUserProfile(userId);
    const personalizedResults: PersonalizedResult[] = [];

    for (const result of originalResults) {
      const personalized = await this.personalizeResult(result, query, profile, context);
      personalizedResults.push(personalized);
    }

    // Sort by personalization score
    personalizedResults.sort((a, b) => b.personalization_score - a.personalization_score);

    // Apply diversity injection to prevent filter bubbles
    const diversifiedResults = this.injectDiversity(personalizedResults, profile);

    return diversifiedResults;
  }

  private async personalizeResult(
    result: any,
    query: string,
    profile: UserProfile,
    context: PersonalizationContext
  ): Promise<PersonalizedResult> {
    const boostFactors = this.calculateBoostFactors(result, profile, context);
    const personalizationScore = this.calculatePersonalizationScore(boostFactors, profile);
    const explanation = this.generateExplanation(boostFactors, profile);
    const engagementPrediction = this.predictEngagement(result, profile, context);

    return {
      original_result: result,
      personalization_score: personalizationScore,
      boost_factors: boostFactors,
      explanation,
      similar_users_liked: this.checkSimilarUsersLiked(result, profile),
      predicted_engagement: engagementPrediction
    };
  }

  private calculateBoostFactors(
    result: any,
    profile: UserProfile,
    context: PersonalizationContext
  ): PersonalizedResult['boost_factors'] {
    // Interest match based on content categories and tags
    const interestMatch = this.calculateInterestMatch(result, profile);
    
    // Behavioral fit based on past interaction patterns
    const behavioralFit = this.calculateBehavioralFit(result, profile, context);
    
    // Temporal relevance based on time and context
    const temporalRelevance = this.calculateTemporalRelevance(result, profile, context);
    
    // Social signals from similar users
    const socialSignals = this.calculateSocialSignals(result, profile);
    
    // Novelty factor to balance familiar vs new content
    const noveltyFactor = this.calculateNoveltyFactor(result, profile, context);

    return {
      interest_match: interestMatch,
      behavioral_fit: behavioralFit,
      temporal_relevance: temporalRelevance,
      social_signals: socialSignals,
      novelty_factor: noveltyFactor
    };
  }

  private calculateInterestMatch(result: any, profile: UserProfile): number {
    let score = 0;
    let factors = 0;

    // Category interest
    if (result.metadata?.category) {
      const categoryInterest = profile.interests.content_categories.get(result.metadata.category) || 0;
      score += categoryInterest * 0.3;
      factors += 0.3;
    }

    // Tag interests
    if (result.metadata?.tags) {
      let tagScore = 0;
      for (const tag of result.metadata.tags) {
        const tagInterest = profile.interests.topic_clusters.get(tag) || 0;
        tagScore += tagInterest;
      }
      score += (tagScore / result.metadata.tags.length) * 0.4;
      factors += 0.4;
    }

    // Creator preference
    if (result.creator?.id) {
      const creatorInterest = profile.interests.creator_preferences.get(result.creator.id) || 0;
      score += creatorInterest * 0.3;
      factors += 0.3;
    }

    return factors > 0 ? score / factors : 0;
  }

  private calculateBehavioralFit(
    result: any,
    profile: UserProfile,
    context: PersonalizationContext
  ): number {
    let score = 0;

    // Content type preference
    const contentTypeInterest = profile.interests.content_types.get(result.type) || 0.5;
    score += contentTypeInterest * 0.3;

    // Quality sensitivity match
    if (result.metadata?.quality_score) {
      const qualityMatch = result.metadata.quality_score >= profile.behavior.content_consumption.quality_sensitivity ? 1 : 0.5;
      score += qualityMatch * 0.2;
    }

    // Device context
    const devicePreference = profile.context.device_preferences.get(context.current_session.device_type) || 0.5;
    score += devicePreference * 0.2;

    // Search depth preference
    const positionPenalty = Math.max(0, 1 - (0.1 * Math.max(0, result.position - profile.behavior.search_patterns.search_depth)));
    score += positionPenalty * 0.3;

    return Math.min(1, score);
  }

  private calculateTemporalRelevance(
    result: any,
    profile: UserProfile,
    context: PersonalizationContext
  ): number {
    let score = 0.5; // Base score

    // Time of day preference
    const currentHour = new Date().getHours();
    const hourPreference = profile.context.temporal_patterns.get(currentHour.toString()) || 0.5;
    score += (hourPreference - 0.5) * 0.3;

    // Content freshness preference
    if (result.metadata?.created_at) {
      const ageInDays = (Date.now() - new Date(result.metadata.created_at).getTime()) / (1000 * 60 * 60 * 24);
      const freshnessScore = Math.max(0, 1 - (ageInDays / 30)); // Decay over 30 days
      const freshnessWeight = profile.behavior.content_consumption.novelty_preference;
      score += freshnessScore * freshnessWeight * 0.3;
    }

    // Seasonal trends
    const month = new Date().getMonth().toString();
    const seasonalBoost = profile.context.seasonal_trends.get(month) || 0;
    score += seasonalBoost * 0.2;

    // Global trending boost
    if (result.metadata?.tags) {
      let trendingBoost = 0;
      for (const tag of result.metadata.tags) {
        trendingBoost += this.globalTrends.get(tag) || 0;
      }
      score += (trendingBoost / result.metadata.tags.length) * 0.2;
    }

    return Math.min(1, Math.max(0, score));
  }

  private calculateSocialSignals(result: any, profile: UserProfile): number {
    // Check if similar users liked this content
    const similarUsers = this.collaborativeFilters.get(profile.id) || [];
    
    // Simulate collaborative filtering score
    let socialScore = 0;
    if (similarUsers.length > 0) {
      // In a real implementation, this would check actual user interactions
      socialScore = Math.random() * 0.5; // Simplified for demo
    }

    // Engagement signals
    if (result.metrics) {
      const engagementRate = (result.metrics.likes + result.metrics.comments) / Math.max(1, result.metrics.views);
      socialScore += Math.min(0.5, engagementRate * 10);
    }

    return Math.min(1, socialScore);
  }

  private calculateNoveltyFactor(
    result: any,
    profile: UserProfile,
    context: PersonalizationContext
  ): number {
    const noveltyPreference = profile.behavior.content_consumption.novelty_preference;
    
    // Check if user has seen similar content recently
    let familiarityScore = 0;
    
    // Check recent activity for similar content
    if (context.recent_activity.last_7_days.content_viewed.includes(result.id)) {
      familiarityScore = 1; // Very familiar
    } else if (result.creator && context.recent_activity.last_7_days.creators_followed.includes(result.creator.id)) {
      familiarityScore = 0.7; // Somewhat familiar
    } else if (result.metadata?.tags) {
      const tagOverlap = result.metadata.tags.filter((tag: string) => 
        context.recent_activity.last_7_days.tags_explored.includes(tag)
      ).length;
      familiarityScore = Math.min(1, tagOverlap / result.metadata.tags.length);
    }

    // Calculate novelty score (inverse of familiarity)
    const noveltyScore = 1 - familiarityScore;
    
    // Weight by user's novelty preference
    return noveltyPreference * noveltyScore + (1 - noveltyPreference) * familiarityScore;
  }

  private calculatePersonalizationScore(
    boostFactors: PersonalizedResult['boost_factors'],
    profile: UserProfile
  ): number {
    // Get feature weights from user's learning model
    const weights = {
      interest_match: profile.learning_model.feature_weights.get('interest_match') || 0.3,
      behavioral_fit: profile.learning_model.feature_weights.get('behavioral_fit') || 0.25,
      temporal_relevance: profile.learning_model.feature_weights.get('temporal_relevance') || 0.15,
      social_signals: profile.learning_model.feature_weights.get('social_signals') || 0.15,
      novelty_factor: profile.learning_model.feature_weights.get('novelty_factor') || 0.15
    };

    return (
      boostFactors.interest_match * weights.interest_match +
      boostFactors.behavioral_fit * weights.behavioral_fit +
      boostFactors.temporal_relevance * weights.temporal_relevance +
      boostFactors.social_signals * weights.social_signals +
      boostFactors.novelty_factor * weights.novelty_factor
    );
  }

  private generateExplanation(
    boostFactors: PersonalizedResult['boost_factors'],
    profile: UserProfile
  ): PersonalizedResult['explanation'] {
    const factors = Object.entries(boostFactors).sort(([,a], [,b]) => b - a);
    const topFactor = factors[0];
    const secondaryFactors = factors.slice(1, 3).filter(([,score]) => score > 0.3);

    const explanationMap = {
      interest_match: 'matches your interests',
      behavioral_fit: 'fits your browsing patterns',
      temporal_relevance: 'trending now',
      social_signals: 'popular with similar users',
      novelty_factor: 'offers something new'
    };

    return {
      primary_reason: explanationMap[topFactor[0] as keyof typeof explanationMap] || 'general relevance',
      secondary_reasons: secondaryFactors.map(([factor]) => 
        explanationMap[factor as keyof typeof explanationMap]
      ).filter(Boolean),
      confidence: profile.learning_model.confidence_score
    };
  }

  private predictEngagement(
    result: any,
    profile: UserProfile,
    context: PersonalizationContext
  ): PersonalizedResult['predicted_engagement'] {
    // Base predictions on user's historical behavior
    const baseClickRate = profile.behavior.interaction_patterns.click_through_rate;
    const baseTimeSpent = profile.behavior.interaction_patterns.time_spent_per_result;
    
    // Adjust based on result characteristics
    let clickProbability = baseClickRate;
    let timeSpentPrediction = baseTimeSpent;
    
    // Quality boost
    if (result.metadata?.quality_score > 0.8) {
      clickProbability *= 1.3;
      timeSpentPrediction *= 1.2;
    }
    
    // Interest boost
    if (result.metadata?.category) {
      const categoryInterest = profile.interests.content_categories.get(result.metadata.category) || 0.5;
      clickProbability *= (1 + categoryInterest);
      timeSpentPrediction *= (1 + categoryInterest * 0.5);
    }
    
    // Recency penalty for older content
    if (result.metadata?.created_at) {
      const ageInDays = (Date.now() - new Date(result.metadata.created_at).getTime()) / (1000 * 60 * 60 * 24);
      const recencyFactor = Math.max(0.5, 1 - (ageInDays / 90));
      clickProbability *= recencyFactor;
    }

    // Calculate satisfaction score
    const satisfactionScore = Math.min(1, (clickProbability + timeSpentPrediction / 100) / 2);

    return {
      click_probability: Math.min(1, clickProbability),
      time_spent_prediction: Math.min(300, timeSpentPrediction), // Cap at 5 minutes
      satisfaction_score: satisfactionScore
    };
  }

  private checkSimilarUsersLiked(result: any, profile: UserProfile): boolean {
    // Simplified collaborative filtering check
    const similarUsers = this.collaborativeFilters.get(profile.id) || [];
    return similarUsers.length > 0 && Math.random() > 0.6; // Simulated for demo
  }

  private injectDiversity(
    results: PersonalizedResult[],
    profile: UserProfile
  ): PersonalizedResult[] {
    // Prevent filter bubbles by injecting diverse content
    const diversityTarget = 0.3; // 30% diverse content
    const diversityCount = Math.floor(results.length * diversityTarget);
    
    // Identify diverse content (different categories, creators, styles)
    const diverseResults = results.filter(result => {
      const noveltyScore = result.boost_factors.novelty_factor;
      const interestScore = result.boost_factors.interest_match;
      return noveltyScore > 0.6 || (noveltyScore > 0.4 && interestScore < 0.5);
    });

    // Inject diverse results at strategic positions
    const finalResults = [...results];
    for (let i = 0; i < Math.min(diversityCount, diverseResults.length); i++) {
      const insertPosition = Math.floor((i + 1) * (results.length / (diversityCount + 1)));
      if (insertPosition < finalResults.length && !finalResults.slice(0, insertPosition).includes(diverseResults[i])) {
        finalResults.splice(insertPosition, 0, diverseResults[i]);
      }
    }

    return finalResults.slice(0, results.length); // Maintain original length
  }

  // Learning from user interactions
  async learnFromInteraction(signal: LearningSignal): Promise<void> {
    this.learningSignals.push(signal);
    
    // Update user profile based on interaction
    const profile = this.getUserProfile(signal.user_id);
    await this.updateProfileFromSignal(profile, signal);
    
    // Update collaborative filtering
    this.updateCollaborativeFiltering(signal);
    
    // Save updated profile
    this.saveProfiles();
    
    // Trigger model retraining if enough signals collected
    if (this.learningSignals.length % 100 === 0) {
      await this.retrainPersonalizationModel(signal.user_id);
    }
  }

  private async updateProfileFromSignal(profile: UserProfile, signal: LearningSignal): Promise<void> {
    // Update interests based on clicked results
    for (const resultId of signal.clicked_results) {
      // In a real implementation, we'd fetch result details
      // For demo, simulate interest updates
      const categories = ['digital_art', 'character_design', 'animation', 'tutorial'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const currentInterest = profile.interests.content_categories.get(randomCategory) || 0;
      profile.interests.content_categories.set(randomCategory, Math.min(1, currentInterest + 0.1));
    }

    // Update behavioral patterns
    profile.behavior.interaction_patterns.click_through_rate = 
      (profile.behavior.interaction_patterns.click_through_rate * 0.9) + 
      (signal.clicked_results.length / signal.results_shown.length * 0.1);

    // Update search patterns
    const currentHour = new Date(signal.timestamp).getHours();
    const currentActivity = profile.context.temporal_patterns.get(currentHour.toString()) || 0;
    profile.context.temporal_patterns.set(currentHour.toString(), Math.min(1, currentActivity + 0.05));

    // Update device preferences
    const deviceType = signal.context.current_session.device_type;
    const currentPreference = profile.context.device_preferences.get(deviceType) || 0;
    profile.context.device_preferences.set(deviceType, Math.min(1, currentPreference + 0.1));

    // Update confidence score
    profile.learning_model.confidence_score = Math.min(1, profile.learning_model.confidence_score + 0.01);
    profile.learning_model.last_updated = new Date().toISOString();
  }

  private updateCollaborativeFiltering(signal: LearningSignal): void {
    // Simplified collaborative filtering update
    // In a real implementation, this would use more sophisticated similarity calculations
    
    for (const [userId, otherProfile] of this.userProfiles) {
      if (userId !== signal.user_id) {
        const similarity = this.calculateUserSimilarity(signal.user_id, userId);
        if (similarity > 0.7) {
          const similarUsers = this.collaborativeFilters.get(signal.user_id) || [];
          if (!similarUsers.includes(userId)) {
            similarUsers.push(userId);
            this.collaborativeFilters.set(signal.user_id, similarUsers);
          }
        }
      }
    }
  }

  private calculateUserSimilarity(userId1: string, userId2: string): number {
    const profile1 = this.userProfiles.get(userId1);
    const profile2 = this.userProfiles.get(userId2);
    
    if (!profile1 || !profile2) return 0;

    let similarity = 0;
    let factors = 0;

    // Interest similarity
    const commonCategories = new Set([
      ...Array.from(profile1.interests.content_categories.keys()),
      ...Array.from(profile2.interests.content_categories.keys())
    ]);

    for (const category of commonCategories) {
      const interest1 = profile1.interests.content_categories.get(category) ?? 0;
      const interest2 = profile2.interests.content_categories.get(category) ?? 0;
      similarity += 1 - Math.abs(interest1 - interest2);
      factors++;
    }

    // Behavioral similarity
    const ctr1 = profile1.behavior.interaction_patterns.click_through_rate;
    const ctr2 = profile2.behavior.interaction_patterns.click_through_rate;
    similarity += 1 - Math.abs(ctr1 - ctr2);
    factors++;

    return factors > 0 ? similarity / factors : 0;
  }

  private async retrainPersonalizationModel(userId: string): Promise<void> {
    const profile = this.getUserProfile(userId);
    const userSignals = this.learningSignals.filter(s => s.user_id === userId);
    
    if (userSignals.length < 10) return; // Need enough data

    // Retrain feature weights based on success signals
    const successfulSearches = userSignals.filter(s => s.search_success);
    const unsuccessfulSearches = userSignals.filter(s => !s.search_success);

    // Simplified weight adjustment based on successful vs unsuccessful patterns
    // In a real implementation, this would use more sophisticated ML algorithms
    
    if (successfulSearches.length > unsuccessfulSearches.length) {
      // Increase weight for factors that led to success
      profile.learning_model.feature_weights.set('interest_match', 
        Math.min(1, (profile.learning_model.feature_weights.get('interest_match') || 0.3) + 0.05)
      );
    }

    profile.learning_model.confidence_score = Math.min(1, 
      profile.learning_model.confidence_score + (successfulSearches.length / userSignals.length) * 0.1
    );
  }

  // Utility methods
  private getUserProfile(userId: string): UserProfile {
    let profile = this.userProfiles.get(userId);
    if (!profile) {
      profile = this.createDefaultProfile(userId);
    }
    return profile;
  }

  private saveProfiles(): void {
    const serializedProfiles: Record<string, any> = {};
    for (const [userId, profile] of this.userProfiles) {
      serializedProfiles[userId] = this.serializeProfile(profile);
    }
    localStorage.setItem('personalization_profiles', JSON.stringify(serializedProfiles));
  }

  private serializeProfile(profile: UserProfile): any {
    return {
      ...profile,
      interests: {
        content_categories: Array.from(profile.interests.content_categories.entries()),
        art_styles: Array.from(profile.interests.art_styles.entries()),
        content_types: Array.from(profile.interests.content_types.entries()),
        creator_preferences: Array.from(profile.interests.creator_preferences.entries()),
        topic_clusters: Array.from(profile.interests.topic_clusters.entries())
      },
      context: {
        device_preferences: Array.from(profile.context.device_preferences.entries()),
        temporal_patterns: Array.from(profile.context.temporal_patterns.entries()),
        seasonal_trends: Array.from(profile.context.seasonal_trends.entries())
      },
      learning_model: {
        ...profile.learning_model,
        feature_weights: Array.from(profile.learning_model.feature_weights.entries())
      }
    };
  }

  private deserializeProfile(data: any): UserProfile {
    return {
      ...data,
      interests: {
        content_categories: new Map(data.interests.content_categories || []),
        art_styles: new Map(data.interests.art_styles || []),
        content_types: new Map(data.interests.content_types || []),
        creator_preferences: new Map(data.interests.creator_preferences || []),
        topic_clusters: new Map(data.interests.topic_clusters || [])
      },
      context: {
        device_preferences: new Map(data.context.device_preferences || []),
        temporal_patterns: new Map(data.context.temporal_patterns || []),
        seasonal_trends: new Map(data.context.seasonal_trends || [])
      },
      learning_model: {
        ...data.learning_model,
        feature_weights: new Map(data.learning_model.feature_weights || [])
      }
    };
  }

  // Public API methods
  async getPersonalizedRecommendations(
    userId: string,
    context: PersonalizationContext,
    limit: number = 10
  ): Promise<any[]> {
    const profile = this.getUserProfile(userId);
    
    // Generate recommendations based on user profile
    const recommendations = [];
    
    // Interest-based recommendations
    const topInterests = Array.from(profile.interests.content_categories.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    for (const [category, interest] of topInterests) {
      recommendations.push({
        type: 'interest_based',
        category,
        score: interest,
        reason: `Based on your interest in ${category}`
      });
    }
    
    // Trending recommendations
    const trending = Array.from(this.globalTrends.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    for (const [topic, trendScore] of trending) {
      recommendations.push({
        type: 'trending',
        topic,
        score: trendScore,
        reason: `${topic} is trending now`
      });
    }
    
    return recommendations.slice(0, limit);
  }

  getPersonalizationInsights(userId: string): any {
    const profile = this.getUserProfile(userId);
    const userSignals = this.learningSignals.filter(s => s.user_id === userId);
    
    return {
      profile_summary: {
        confidence_score: profile.learning_model.confidence_score,
        top_interests: Array.from(profile.interests.content_categories.entries())
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5),
        search_patterns: profile.behavior.search_patterns,
        learning_progress: userSignals.length
      },
      recommendations_effectiveness: {
        total_searches: userSignals.length,
        successful_searches: userSignals.filter(s => s.search_success).length,
        avg_satisfaction: userSignals.length > 0 ? 
          userSignals.reduce((sum, s) => sum + (s.satisfaction_rating || 3), 0) / userSignals.length : 0
      },
      personalization_features: {
        collaborative_filtering: this.collaborativeFilters.has(userId),
        temporal_patterns: profile.context.temporal_patterns.size > 0,
        device_optimization: profile.context.device_preferences.size > 0,
        interest_modeling: profile.interests.content_categories.size > 0
      }
    };
  }

  resetPersonalization(userId: string): void {
    this.userProfiles.delete(userId);
    this.learningSignals = this.learningSignals.filter(s => s.user_id !== userId);
    this.collaborativeFilters.delete(userId);
    this.createDefaultProfile(userId);
  }
}

export const searchPersonalizationEngine = new SearchPersonalizationEngine();
export type { UserProfile, PersonalizationContext, PersonalizedResult, LearningSignal };
