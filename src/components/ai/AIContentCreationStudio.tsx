import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Wand2, 
  ImageIcon, 
  VideoIcon, 
  FileTextIcon, 
  MicIcon,
  Sparkles,
  TrendingUpIcon,
  Users,
  DollarSign,
  BarChart3,
  PlusCircle,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';
import AnimatedLoader from '../ui/AnimatedLoader';

interface ContentSuggestion {
  id: string;
  type: 'image' | 'video' | 'text' | 'audio';
  title: string;
  description: string;
  tags: string[];
  estimatedEngagement: number;
  estimatedRevenue: number;
  difficulty: 'easy' | 'medium' | 'hard';
  trendScore: number;
  aiConfidence: number;
}

interface ContentAnalysis {
  title: string;
  description: string;
  tags: string[];
  seoScore: number;
  engagementPrediction: number;
  monetizationPotential: number;
  improvements: string[];
  targetAudience: string[];
}

export default function AIContentCreationStudio() {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestion[]>([]);
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | null>(null);
  const [userInput, setUserInput] = useState('');
  const [analysisInput, setAnalysisInput] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateContentSuggestions = useCallback(async (prompt: string = '') => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSuggestions: ContentSuggestion[] = [
        {
          id: '1',
          type: 'image',
          title: 'Fursuit Friday Photoshoot',
          description: 'Professional outdoor fursuit photography with natural lighting',
          tags: ['fursuit', 'photography', 'outdoors', 'friday'],
          estimatedEngagement: 87,
          estimatedRevenue: 245,
          difficulty: 'medium',
          trendScore: 92,
          aiConfidence: 94
        },
        {
          id: '2',
          type: 'video',
          title: 'Character Transformation Process',
          description: 'Behind-the-scenes content showing your character creation process',
          tags: ['transformation', 'process', 'bts', 'creative'],
          estimatedEngagement: 93,
          estimatedRevenue: 380,
          difficulty: 'easy',
          trendScore: 88,
          aiConfidence: 91
        },
        {
          id: '3',
          type: 'text',
          title: 'Character Backstory Series',
          description: 'Weekly character development posts with rich storytelling',
          tags: ['story', 'character', 'development', 'weekly'],
          estimatedEngagement: 76,
          estimatedRevenue: 156,
          difficulty: 'easy',
          trendScore: 84,
          aiConfidence: 89
        },
        {
          id: '4',
          type: 'video',
          title: 'Interactive Q&A Session',
          description: 'Live streaming Q&A about your creative journey and characters',
          tags: ['live', 'qa', 'interactive', 'community'],
          estimatedEngagement: 95,
          estimatedRevenue: 420,
          difficulty: 'hard',
          trendScore: 96,
          aiConfidence: 97
        }
      ];

      const filteredSuggestions = prompt 
        ? mockSuggestions.filter(s => 
            s.title.toLowerCase().includes(prompt.toLowerCase()) ||
            s.description.toLowerCase().includes(prompt.toLowerCase()) ||
            s.tags.some(tag => tag.toLowerCase().includes(prompt.toLowerCase()))
          )
        : mockSuggestions;

      setContentSuggestions(filteredSuggestions);
      setGenerationProgress(100);
      
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);
    } catch (error) {
      setIsGenerating(false);
      setGenerationProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  }, []);

  const analyzeContent = useCallback(async () => {
    if (!analysisInput.title) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAnalysis: ContentAnalysis = {
        title: analysisInput.title,
        description: analysisInput.description,
        tags: analysisInput.tags.split(',').map(tag => tag.trim()),
        seoScore: Math.floor(Math.random() * 40) + 60,
        engagementPrediction: Math.floor(Math.random() * 30) + 70,
        monetizationPotential: Math.floor(Math.random() * 25) + 75,
        improvements: [
          'Add trending hashtags for better discoverability',
          'Include call-to-action in description',
          'Consider posting during peak hours (7-9 PM)',
          'Add more descriptive keywords'
        ],
        targetAudience: [
          'Furry art enthusiasts (45%)',
          'Character design fans (30%)',
          'Digital art collectors (25%)'
        ]
      };
      
      setContentAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [analysisInput]);

  useEffect(() => {
    generateContentSuggestions();
  }, [generateContentSuggestions]);

  const getContentTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return VideoIcon;
      case 'text': return FileTextIcon;
      case 'audio': return MicIcon;
      default: return FileTextIcon;
    }
  }, []);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Wand2 className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Content Creation Studio
          </h1>
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Powered by advanced AI, get personalized content suggestions, analyze your ideas, 
          and optimize your content strategy for maximum engagement and revenue.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="w-full">
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === 'suggestions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('suggestions')}
            className="flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Suggestions</span>
          </Button>
          <Button
            variant={activeTab === 'analyzer' ? 'default' : 'outline'}
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Content Analyzer</span>
          </Button>
          <Button
            variant={activeTab === 'planner' ? 'default' : 'outline'}
            onClick={() => setActiveTab('planner')}
            className="flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>Content Planner</span>
          </Button>
        </div>

        {/* AI Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Generate New Ideas</span>
                </CardTitle>
                <CardDescription>
                  Describe your interests or let AI surprise you with trending content ideas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter topic, character type, or leave blank for trending suggestions..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateContentSuggestions(userInput)}
                  />
                  <Button 
                    onClick={() => generateContentSuggestions(userInput)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    Generate
                  </Button>
                </div>
                
                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>AI is generating personalized suggestions...</span>
                      <span>{Math.round(generationProgress)}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Suggestions */}
            <AnimatePresence>
              {contentSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {contentSuggestions.map((suggestion, index) => {
                    const IconComponent = getContentTypeIcon(suggestion.type);
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                <IconComponent className="w-5 h-5 text-purple-600" />
                                <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                              </div>
                              <Badge className={getDifficultyColor(suggestion.difficulty)}>
                                {suggestion.difficulty}
                              </Badge>
                            </div>
                            <CardDescription>{suggestion.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {suggestion.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            
                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <TrendingUpIcon className="w-4 h-4 text-green-600" />
                                <span>Engagement: {suggestion.estimatedEngagement}%</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span>Revenue: ${suggestion.estimatedRevenue}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BarChart3 className="w-4 h-4 text-blue-600" />
                                <span>Trend: {suggestion.trendScore}%</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-4 h-4 text-purple-600" />
                                <span>AI: {suggestion.aiConfidence}%</span>
                              </div>
                            </div>
                            
                            <Button className="w-full" size="sm">
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Use This Idea
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Content Analyzer Tab */}
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Content Performance Analyzer</span>
                </CardTitle>
                <CardDescription>
                  Analyze your content ideas to optimize for engagement and revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Title</label>
                    <Input
                      placeholder="Enter your content title..."
                      value={analysisInput.title}
                      onChange={(e) => setAnalysisInput({...analysisInput, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                      placeholder="furry, art, character, etc..."
                      value={analysisInput.tags}
                      onChange={(e) => setAnalysisInput({...analysisInput, tags: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Description</label>
                  <Textarea
                    placeholder="Describe your content in detail..."
                    value={analysisInput.description}
                    onChange={(e) => setAnalysisInput({...analysisInput, description: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button 
                  onClick={analyzeContent}
                  disabled={!analysisInput.title || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <AnimatedLoader type="ai" size="sm" />
                  ) : (
                    <BarChart3 className="w-4 h-4 mr-2" />
                  )}
                  Analyze Content
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <AnimatePresence>
              {contentAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Performance Scores */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Prediction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">SEO Score</span>
                            <span className="text-sm">{contentAnalysis.seoScore}%</span>
                          </div>
                          <Progress value={contentAnalysis.seoScore} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Engagement</span>
                            <span className="text-sm">{contentAnalysis.engagementPrediction}%</span>
                          </div>
                          <Progress value={contentAnalysis.engagementPrediction} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Revenue Potential</span>
                            <span className="text-sm">{contentAnalysis.monetizationPotential}%</span>
                          </div>
                          <Progress value={contentAnalysis.monetizationPotential} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Improvements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>AI Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {contentAnalysis.improvements.map((improvement, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{improvement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Target Audience */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Target Audience Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {contentAnalysis.targetAudience.map((audience, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            <span className="text-sm">{audience}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Content Planner Tab */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>AI Content Planner</span>
                </CardTitle>
                <CardDescription>
                  Generate and schedule content plans optimized for your audience
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-gray-600">
                  AI-powered content scheduling and calendar management is coming in the next update.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
