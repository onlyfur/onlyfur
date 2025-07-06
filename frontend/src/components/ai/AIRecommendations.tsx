import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Sparkles,
  TrendingUp,
  Heart,
  Star,
  ArrowRight,
  RefreshCw,
  Zap,
  Brain,
  BarChart3,
  Users,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Target,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/apiClient';

interface ContentRecommendation {
  contentId: string;
  score: number;
  reason: string;
  category: string;
  tags: string[];
  confidence: number;
}

interface UserInsight {
  userId: string;
  category: 'engagement' | 'content_preference' | 'behavior' | 'monetization';
  insight: string;
  confidence: number;
  actionable: boolean;
  suggestions: string[];
  data: any;
}

interface CreatorInsights {
  insights: UserInsight[];
  recommendations: string[];
  opportunities: Array<{
    type: string;
    description: string;
    potential: number;
    effort: 'low' | 'medium' | 'high';
  }>;
  warnings: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

interface AIRecommendationsProps {
  type?: 'content' | 'creator' | 'all';
  limit?: number;
  categories?: string[];
}

export default function AIRecommendations({
  type = 'all',
  limit = 10,
  categories,
}: AIRecommendationsProps) {
  const { user } = useAuth();
  const [contentRecommendations, setContentRecommendations] = useState<ContentRecommendation[]>([]);
  const [creatorInsights, setCreatorInsights] = useState<CreatorInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);

      const promises = [];

      if (type === 'content' || type === 'all') {
        promises.push(
          apiClient.request<{recommendations: ContentRecommendation[]}>('/ai/recommendations', {
            method: 'POST',
            body: JSON.stringify({ limit, categories })
          }).then((response) => {
            if (response.success && response.data) {
              setContentRecommendations(response.data.recommendations);
            }
          })
        );
      }

      if (type === 'creator' || type === 'all') {
        promises.push(
          apiClient.request<CreatorInsights>('/ai/creator-insights').then((response) => {
            if (response.success && response.data) {
              setCreatorInsights(response.data);
            }
          })
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
      toast.error('Failed to load AI recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [type, limit, categories]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const refreshRecommendations = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await loadRecommendations();
      toast.success('Recommendations refreshed');
    } catch (error) {
      toast.error('Failed to refresh recommendations');
    } finally {
      setIsRefreshing(false);
    }
  }, [loadRecommendations]);

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case 'engagement':
        return <Heart className="h-4 w-4" />;
      case 'content_preference':
        return <Star className="h-4 w-4" />;
      case 'behavior':
        return <Users className="h-4 w-4" />;
      case 'monetization':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  }, []);

  const getConfidenceColor = useCallback((confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const getEffortColor = useCallback((effort: string) => {
    switch (effort) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'low':
        return 'border-yellow-200 bg-yellow-50';
      case 'medium':
        return 'border-orange-200 bg-orange-50';
      case 'high':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span>AI is analyzing your data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Recommendations</h2>
            <p className="text-muted-foreground">Personalized insights powered by AI</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={() => setActiveTab('recommendations')} variant={activeTab === 'recommendations' ? 'default' : 'outline'} size="sm">
            Content
          </Button>
          <Button onClick={() => setActiveTab('insights')} variant={activeTab === 'insights' ? 'default' : 'outline'} size="sm">
            Insights
          </Button>
          <Button onClick={() => setActiveTab('opportunities')} variant={activeTab === 'opportunities' ? 'default' : 'outline'} size="sm">
            Growth
          </Button>
          <Button onClick={refreshRecommendations} disabled={isRefreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content Sections */}
      {activeTab === 'recommendations' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Recommended Content
            </CardTitle>
            <CardDescription>AI-curated content based on your interests and behavior patterns.</CardDescription>
          </CardHeader>
          <CardContent>
            {contentRecommendations.length > 0 ? (
              <div className="space-y-4">
                {contentRecommendations.map((rec) => (
                  <div
                    key={rec.contentId}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline-solid">{rec.category}</Badge>
                          <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                            {Math.round(rec.confidence * 100)}% match
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground">{rec.reason}</p>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {rec.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {rec.tags.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{rec.tags.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">{Math.round(rec.score * 100)}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Interact with more content to receive personalized recommendations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'insights' && (
        <>
          {creatorInsights?.insights && creatorInsights.insights.length > 0 ? (
            <div className="grid gap-4">
              {creatorInsights.insights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-muted rounded-lg">{getCategoryIcon(insight.category)}</div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant={insight.actionable ? 'default' : 'secondary'}>
                            {insight.category.replace('_', ' ')}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                              {Math.round(insight.confidence * 100)}% confident
                            </span>
                            {insight.actionable && (
                              <Badge variant="outline-solid" className="bg-green-50 text-green-700">
                                <Zap className="h-3 w-3 mr-1" />
                                Actionable
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm font-medium">{insight.insight}</p>

                        {insight.suggestions.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Suggestions:</h4>
                            <ul className="space-y-1">
                              {insight.suggestions.map((suggestion, i) => (
                                <li key={i} className="flex items-start space-x-2 text-sm">
                                  <ChevronRight className="h-3 w-3 mt-0.5 text-muted-foreground" />
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {insight.data && Object.keys(insight.data).length > 0 && (
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Data Points:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(insight.data).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-muted-foreground">{key}:</span>
                                  <span className="font-medium">
                                    {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Gathering insights...</h3>
                <p className="text-muted-foreground">Continue using the platform to generate personalized insights.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeTab === 'opportunities' && (
        <>
          {creatorInsights?.opportunities && creatorInsights.opportunities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Growth Opportunities
                </CardTitle>
                <CardDescription>AI-identified opportunities to grow your audience and engagement.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creatorInsights.opportunities.map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline-solid">{opportunity.type.replace('_', ' ')}</Badge>
                            <Badge className={getEffortColor(opportunity.effort)}>{opportunity.effort} effort</Badge>
                          </div>
                          <p className="text-sm">{opportunity.description}</p>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            +{Math.round(opportunity.potential * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Potential</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Potential Impact</span>
                          <span>{Math.round(opportunity.potential * 100)}%</span>
                        </div>
                        <Progress value={opportunity.potential * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {creatorInsights?.warnings && creatorInsights.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Attention Required
                </CardTitle>
                <CardDescription>Areas that may need your attention to maintain or improve performance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creatorInsights.warnings.map((warning, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(warning.severity)}`}>
                      <div className="flex items-start space-x-3">
                        <AlertCircle
                          className={`h-5 w-5 mt-0.5 ${
                            warning.severity === 'high'
                              ? 'text-red-600'
                              : warning.severity === 'medium'
                              ? 'text-orange-600'
                              : 'text-yellow-600'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              variant="outline-solid"
                              className={`${
                                warning.severity === 'high'
                                  ? 'border-red-300 text-red-700'
                                  : warning.severity === 'medium'
                                  ? 'border-orange-300 text-orange-700'
                                  : 'border-yellow-300 text-yellow-700'
                              }`}
                            >
                              {warning.severity} priority
                            </Badge>
                            <span className="text-sm font-medium">{warning.type.replace('_', ' ')}</span>
                          </div>
                          <p className="text-sm">{warning.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {creatorInsights?.recommendations && creatorInsights.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Actionable suggestions to improve your content strategy.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creatorInsights.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-1 bg-primary/10 rounded">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm flex-1">{recommendation}</p>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!creatorInsights?.opportunities?.length &&
            !creatorInsights?.warnings?.length &&
            !creatorInsights?.recommendations?.length && (
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Building your growth profile...</h3>
                  <p className="text-muted-foreground">Keep creating and engaging to unlock growth opportunities.</p>
                </CardContent>
              </Card>
            )}
        </>
      )}
    </div>
  );
}
