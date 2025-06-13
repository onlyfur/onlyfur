import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Zap, 
  Star,
  Users,
  Heart,
  Eye,
  Clock,
  RefreshCw,
  ChevronRight,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'trend' | 'optimization' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  metadata?: any;
}

interface RecommendedCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  categories: string[];
  subscriberCount: number;
  contentCount: number;
  isVerified: boolean;
  matchScore: number;
  matchReasons: string[];
  recentEngagement: number;
  growthTrend: 'up' | 'down' | 'stable';
}

interface AIRecommendationEngineProps {
  userId?: string;
  context: 'home' | 'explore' | 'dashboard' | 'creator';
  maxRecommendations?: number;
  showInsights?: boolean;
  className?: string;
}

const AIRecommendationEngine: React.FC<AIRecommendationEngineProps> = ({
  userId,
  context,
  maxRecommendations = 6,
  showInsights = true,
  className = ''
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendedCreator[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  useEffect(() => {
    loadRecommendations();
    if (showInsights) {
      loadAIInsights();
    }
  }, [userId, context]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    setAiProcessing(true);
    
    try {
      // Simulate AI processing time for realistic feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch(`/api/ai/recommendations?context=${context}&limit=${maxRecommendations}`, {
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        } : {},
      });
      
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
    } finally {
      setIsLoading(false);
      setAiProcessing(false);
    }
  };

  const loadAIInsights = async () => {
    try {
      const response = await fetch(`/api/ai/insights?context=${context}`, {
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        } : {},
      });
      
      const data = await response.json();
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error('Error loading AI insights:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRecommendations();
    if (showInsights) {
      await loadAIInsights();
    }
    setIsRefreshing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Target className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'prediction': return <BarChart3 className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-950';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-950';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950';
    }
  };

  const CreatorCard: React.FC<{ creator: RecommendedCreator; index: number }> = ({ creator, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-linear-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30 hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-purple-200 dark:ring-purple-800 group-hover:ring-purple-400 transition-colors">
                  <AvatarImage src={creator.avatar} alt={creator.displayName} />
                  <AvatarFallback>{creator.displayName?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                {creator.growthTrend === 'up' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <TrendingUp className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm group-hover:text-purple-600 transition-colors">
                    {creator.displayName}
                  </h3>
                  {creator.isVerified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Star className="w-4 h-4 text-blue-500 fill-current" />
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">@{creator.username}</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge 
                variant="secondary" 
                className="bg-linear-to-r from-purple-500 to-pink-500 text-white border-0"
              >
                {Math.round(creator.matchScore)}% match
              </Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {creator.bio}
          </p>

          <div className="flex flex-wrap gap-1">
            {creator.categories?.slice(0, 2).map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Match Quality</span>
              <span className="font-medium">{Math.round(creator.matchScore)}%</span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Progress 
                value={creator.matchScore} 
                className="h-2 bg-gray-200 dark:bg-gray-800"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{creator.subscriberCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{creator.contentCount} posts</span>
            </div>
          </div>

          {creator.matchReasons && creator.matchReasons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.6 }}
              className="space-y-1"
            >
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                Why you might like them:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {creator.matchReasons.slice(0, 2).map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    className="flex items-center space-x-1"
                  >
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    <span>{reason}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 group-hover:shadow-lg transition-all duration-300"
              size="sm"
            >
              <Heart className="w-4 h-4 mr-2" />
              View Profile
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const InsightCard: React.FC<{ insight: AIInsight; index: number }> = ({ insight, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${getImpactColor(insight.impact)}`}>
              {getInsightIcon(insight.type)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{insight.title}</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'} className="text-xs">
                    {insight.impact}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Brain className="w-3 h-3" />
                    <span>{Math.round(insight.confidence)}%</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              {insight.actionable && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 p-0 h-auto">
                    <Zap className="w-3 h-3 mr-1" />
                    Take Action
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {showInsights && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">AI Recommendations</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-4 h-4" />
              </motion.div>
              <span>AI Processing...</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: maxRecommendations }).map((_, i) => (
              <Card key={i} className="h-80">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Insights Section */}
      {showInsights && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Brain className="w-5 h-5 text-purple-600" />
              </motion.div>
              <h3 className="text-lg font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Insights
              </h3>
            </div>
            <Badge variant="secondary" className="bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by AI
            </Badge>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {insights.map((insight, index) => (
                <InsightCard key={insight.id} insight={insight} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Sparkles className="w-5 h-5 text-purple-600" />
            </motion.div>
            <h3 className="text-lg font-semibold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Recommendations
            </h3>
          </div>
          
          <div className="flex items-center space-x-3">
            {aiProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-sm text-muted-foreground"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-4 h-4 text-purple-600" />
                </motion.div>
                <span>AI Learning...</span>
              </motion.div>
            )}
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950"
              >
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                </motion.div>
                Refresh
              </Button>
            </motion.div>
          </div>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {recommendations.map((creator, index) => (
                <CreatorCard key={creator.id} creator={creator} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center p-8 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-2 border-dashed border-purple-200 dark:border-purple-800">
              <CardContent className="space-y-4">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Brain className="w-12 h-12 text-purple-400 mx-auto" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                    AI Learning Your Preferences
                  </h3>
                  <p className="text-muted-foreground">
                    Interact with more content to get personalized recommendations
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Explore Content
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AIRecommendationEngine;