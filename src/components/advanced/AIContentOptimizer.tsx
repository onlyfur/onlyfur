import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  Calendar,
  Users,
  Tag,
  Image,
  Video,
  FileText,
  Mic,
  Camera,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  Download,
  Upload,
  Settings,
  Wand2
} from 'lucide-react';
import AnimatedLoader from '../ui/AnimatedLoader';

interface ContentAnalysis {
  overall_score: number;
  title_score: number;
  description_score: number;
  tags_score: number;
  timing_score: number;
  engagement_prediction: number;
  reach_prediction: number;
  areas_for_improvement: string[];
  strengths: string[];
  optimal_post_time: string;
  trending_tags: string[];
  competitor_analysis: {
    similar_content_performance: number;
    trending_in_category: boolean;
    uniqueness_score: number;
  };
}

interface OptimizationSuggestion {
  category: 'title' | 'description' | 'tags' | 'timing' | 'format' | 'engagement';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  example?: string;
}

interface ContentData {
  type: 'image' | 'video' | 'audio' | 'text' | 'live';
  title: string;
  description: string;
  tags: string[];
  scheduled_time?: Date;
  target_audience: string[];
  content_url?: string;
  duration?: string;
  thumbnail_url?: string;
}

export default function AIContentOptimizer() {
  const [contentData, setContentData] = useState<ContentData>({
    type: 'image',
    title: '',
    description: '',
    tags: [],
    target_audience: [],
    content_url: '',
    duration: '',
    thumbnail_url: ''
  });
  
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [tagInput, setTagInput] = useState('');
  const [audienceInput, setAudienceInput] = useState('');

  const contentTypes = [
    { value: 'image', label: 'Image Post', icon: Image },
    { value: 'video', label: 'Video Content', icon: Video },
    { value: 'audio', label: 'Audio Content', icon: Mic },
    { value: 'text', label: 'Text Post', icon: FileText },
    { value: 'live', label: 'Live Stream', icon: Camera }
  ];

  const audienceOptions = [
    'Furry Artists', 'Digital Artists', 'Traditional Artists', 'Commissioners',
    'Art Collectors', 'Character Designers', 'Fursuit Makers', 'Writers',
    'Gamers', 'Cosplayers', 'LGBTQ+ Community', 'Convention Goers'
  ];

  const generateMockAnalysis = (): ContentAnalysis => {
    const baseScore = 60 + Math.random() * 30;
    return {
      overall_score: Math.round(baseScore),
      title_score: Math.round(baseScore + (Math.random() - 0.5) * 20),
      description_score: Math.round(baseScore + (Math.random() - 0.5) * 20),
      tags_score: Math.round(baseScore + (Math.random() - 0.5) * 20),
      timing_score: Math.round(baseScore + (Math.random() - 0.5) * 20),
      engagement_prediction: Math.round(baseScore + (Math.random() - 0.5) * 15),
      reach_prediction: Math.round(baseScore + (Math.random() - 0.5) * 25),
      areas_for_improvement: [
        'Add more specific hashtags',
        'Include call-to-action in description',
        'Optimize posting time for target audience',
        'Consider trending topics'
      ],
      strengths: [
        'Clear and engaging title',
        'Good content quality',
        'Relevant to audience interests',
        'Appropriate content type'
      ],
      optimal_post_time: '7:30 PM EST',
      trending_tags: ['#furryart', '#digitalart', '#commission', '#characterdesign', '#fursuit'],
      competitor_analysis: {
        similar_content_performance: Math.round(60 + Math.random() * 30),
        trending_in_category: Math.random() > 0.5,
        uniqueness_score: Math.round(70 + Math.random() * 25)
      }
    };
  };

  const generateSuggestions = (analysis: ContentAnalysis): OptimizationSuggestion[] => {
    const suggestions: OptimizationSuggestion[] = [];

    if (analysis.title_score < 80) {
      suggestions.push({
        category: 'title',
        priority: 'high',
        suggestion: 'Add emotional keywords and make your title more specific',
        impact: 85,
        effort: 'low',
        example: 'Instead of "New Art", try "Cozy Dragon Character Commission - Fantasy Art"'
      });
    }

    if (analysis.description_score < 75) {
      suggestions.push({
        category: 'description',
        priority: 'medium',
        suggestion: 'Include a story or process description to increase engagement',
        impact: 70,
        effort: 'medium',
        example: 'Describe your creative process, inspiration, or character backstory'
      });
    }

    if (analysis.tags_score < 85) {
      suggestions.push({
        category: 'tags',
        priority: 'high',
        suggestion: 'Use a mix of popular and niche hashtags for better discoverability',
        impact: 90,
        effort: 'low',
        example: 'Combine trending tags like #furryart with specific ones like #dragonart'
      });
    }

    if (analysis.timing_score < 70) {
      suggestions.push({
        category: 'timing',
        priority: 'medium',
        suggestion: 'Post during peak audience activity hours',
        impact: 65,
        effort: 'low',
        example: `Consider posting at ${analysis.optimal_post_time} for maximum visibility`
      });
    }

    suggestions.push({
      category: 'engagement',
      priority: 'medium',
      suggestion: 'Add a question or call-to-action to encourage comments',
      impact: 75,
      effort: 'low',
      example: 'Ask "What do you think of this character?" or "Commission slots open!"'
    });

    if (contentData.type === 'video' && !contentData.thumbnail_url) {
      suggestions.push({
        category: 'format',
        priority: 'high',
        suggestion: 'Add an eye-catching thumbnail for better click-through rates',
        impact: 80,
        effort: 'medium',
        example: 'Create a thumbnail with bright colors and clear character visibility'
      });
    }

    return suggestions.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  };

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const mockAnalysis = generateMockAnalysis();
      const mockSuggestions = generateSuggestions(mockAnalysis);
      
      setAnalysis(mockAnalysis);
      setSuggestions(mockSuggestions);
      setActiveTab('analysis');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !contentData.tags.includes(tagInput.trim())) {
      setContentData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setContentData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addAudience = () => {
    if (audienceInput.trim() && !contentData.target_audience.includes(audienceInput.trim())) {
      setContentData(prev => ({
        ...prev,
        target_audience: [...prev.target_audience, audienceInput.trim()]
      }));
      setAudienceInput('');
    }
  };

  const removeAudience = (audienceToRemove: string) => {
    setContentData(prev => ({
      ...prev,
      target_audience: prev.target_audience.filter(aud => aud !== audienceToRemove)
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Content Optimizer
            </h1>
            <p className="text-gray-600">Maximize your content's reach and engagement with AI</p>
          </div>
        </div>
        <Button onClick={analyzeContent} disabled={isAnalyzing || !contentData.title.trim()}>
          {isAnalyzing ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4 mr-2" />
          )}
          {isAnalyzing ? 'Analyzing...' : 'Optimize Content'}
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Content Editor</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" disabled={!analysis} className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>AI Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" disabled={!suggestions.length} className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Optimization Tips</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Editor Tab */}
        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Content Details</CardTitle>
                <CardDescription>Enter your content information for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <Select value={contentData.type} onValueChange={(value: any) => setContentData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map(type => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={contentData.title}
                    onChange={(e) => setContentData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter an engaging title..."
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {contentData.title.length}/100 characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={contentData.description}
                    onChange={(e) => setContentData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your content, include context and calls-to-action..."
                    className="w-full min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {contentData.description.length}/500 characters
                  </p>
                </div>

                {/* Duration (for video/audio) */}
                {(contentData.type === 'video' || contentData.type === 'audio') && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Input
                      value={contentData.duration}
                      onChange={(e) => setContentData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 5:30"
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags and Audience */}
            <Card>
              <CardHeader>
                <CardTitle>Tags & Audience</CardTitle>
                <CardDescription>Help AI understand your content better</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add tags..."
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contentData.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Click tags to remove them
                  </p>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Audience</label>
                  <div className="flex space-x-2 mb-2">
                    <Select value={audienceInput} onValueChange={setAudienceInput}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select audience..." />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addAudience} size="sm" disabled={!audienceInput}>
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contentData.target_audience.map(audience => (
                      <Badge
                        key={audience}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => removeAudience(audience)}
                      >
                        {audience} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Content URLs */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Content URL (Optional)</label>
                  <Input
                    value={contentData.content_url}
                    onChange={(e) => setContentData(prev => ({ ...prev, content_url: e.target.value }))}
                    placeholder="Direct link to your content..."
                    className="w-full"
                  />
                </div>

                {/* Thumbnail URL (for video) */}
                {contentData.type === 'video' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Thumbnail URL (Optional)</label>
                    <Input
                      value={contentData.thumbnail_url}
                      onChange={(e) => setContentData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                      placeholder="Thumbnail image URL..."
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-12">
              <AnimatedLoader type="ai" size="lg" message="AI is analyzing your content for optimization opportunities..." />
            </div>
          ) : analysis ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysis.overall_score)}`}>
                      {analysis.overall_score}
                    </div>
                    <div className="text-xl font-semibold mb-4">Overall Optimization Score</div>
                    <div className="max-w-md mx-auto">
                      <Progress value={analysis.overall_score} className="h-3" />
                    </div>
                    <p className="text-gray-600 mt-4">
                      {analysis.overall_score >= 80 ? 'Excellent! Your content is well optimized.' :
                       analysis.overall_score >= 60 ? 'Good foundation, but there\'s room for improvement.' :
                       'Significant optimization opportunities available.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.title_score)}`}>
                      {analysis.title_score}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Title</div>
                    <Progress value={analysis.title_score} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.description_score)}`}>
                      {analysis.description_score}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Description</div>
                    <Progress value={analysis.description_score} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.tags_score)}`}>
                      {analysis.tags_score}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Tags</div>
                    <Progress value={analysis.tags_score} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.timing_score)}`}>
                      {analysis.timing_score}
                    </div>
                    <div className="text-sm font-medium text-gray-600">Timing</div>
                    <Progress value={analysis.timing_score} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Predictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Engagement Prediction</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.engagement_prediction)}`}>
                        {analysis.engagement_prediction}%
                      </div>
                      <Badge className={getScoreBg(analysis.engagement_prediction)}>
                        {analysis.engagement_prediction >= 80 ? 'High' :
                         analysis.engagement_prediction >= 60 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                    <Progress value={analysis.engagement_prediction} className="mb-4" />
                    <p className="text-sm text-gray-600">
                      Expected engagement rate based on content analysis and audience behavior patterns.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span>Reach Prediction</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`text-3xl font-bold ${getScoreColor(analysis.reach_prediction)}`}>
                        {analysis.reach_prediction}%
                      </div>
                      <Badge className={getScoreBg(analysis.reach_prediction)}>
                        {analysis.reach_prediction >= 80 ? 'Wide' :
                         analysis.reach_prediction >= 60 ? 'Moderate' : 'Limited'}
                      </Badge>
                    </div>
                    <Progress value={analysis.reach_prediction} className="mb-4" />
                    <p className="text-sm text-gray-600">
                      Estimated reach potential based on content optimization and trending factors.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Strengths and Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span>Areas for Improvement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analysis.areas_for_improvement.map((area, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Optimal Timing and Trending Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span>Optimal Timing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {analysis.optimal_post_time}
                      </div>
                      <p className="text-sm text-gray-600">
                        Best time to post for maximum visibility based on your audience activity patterns.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      <span>Trending Tags</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.trending_tags.map(tag => (
                        <Badge key={tag} className="bg-orange-100 text-orange-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Currently trending tags in your content category.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : null}
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-6">
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Optimization Recommendations</h3>
                <Badge variant="secondary">{suggestions.length} suggestions</Badge>
              </div>

              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-l-4 ${getPriorityColor(suggestion.priority)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category}
                          </Badge>
                          <Badge 
                            className={`text-xs ${
                              suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                              suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {suggestion.priority} priority
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{suggestion.impact}% impact</span>
                          <span>•</span>
                          <span>{suggestion.effort} effort</span>
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-2">{suggestion.suggestion}</h4>
                      
                      {suggestion.example && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-3">
                          <p className="text-sm text-gray-700">
                            <strong>Example:</strong> {suggestion.example}
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Potential Impact</span>
                          <span>{suggestion.impact}%</span>
                        </div>
                        <Progress value={suggestion.impact} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}