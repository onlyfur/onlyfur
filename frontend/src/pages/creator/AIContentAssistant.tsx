import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  Edit3, 
  MessageSquare, 
  Calendar,
  Target,
  BarChart3,
  Copy,
  RefreshCw,
  Star,
  ThumbsUp,
  Hash,
  Clock,
  Wand2,
  Brain,
  Zap,
  Eye,
  Heart,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ContentIdea {
  id: number;
  title: string;
  description: string;
  type: string;
  estimatedEngagement: string;
  difficulty: string;
  timeInvestment: string;
  audienceMatch: number;
  hashtags: string[];
  tips: string[];
}

interface TitleSuggestion {
  id: number;
  title: string;
  style: string;
  estimatedPerformance: number;
  length: number;
  keywords: string[];
}

interface CaptionSuggestion {
  id: number;
  text: string;
  tone: string;
  engagement: string;
  callToAction: string;
}

interface TrendingTopic {
  topic: string;
  popularity: number;
  growth: string;
}

const AIContentAssistant: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('ideas');
  
  // Content Ideas State
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [ideaParams, setIdeaParams] = useState({
    category: '',
    mood: '',
    contentType: '',
    audienceTier: 'all'
  });

  // Title Suggestions State
  const [titleSuggestions, setTitleSuggestions] = useState<TitleSuggestion[]>([]);
  const [titleParams, setTitleParams] = useState({
    content: '',
    style: 'catchy',
    maxLength: 100
  });

  // Caption Generator State
  const [captionSuggestions, setCaptionSuggestions] = useState<CaptionSuggestion[]>([]);
  const [captionParams, setCaptionParams] = useState({
    imageDescription: '',
    tone: 'fun',
    includeHashtags: true,
    includeEmojis: true,
    maxLength: 500
  });

  // Trending Topics State
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<any[]>([]);
  const [seasonalSuggestions, setSeasonalSuggestions] = useState<string[]>([]);

  // Optimization State
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [contentToOptimize, setContentToOptimize] = useState('');

  // Posting Schedule State
  const [postingSchedule, setPostingSchedule] = useState<any>(null);

  useEffect(() => {
    fetchTrendingTopics();
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Load some mock data for demo purposes
    setContentIdeas([
      {
        id: 1,
        title: "Digital Art Tutorial Series",
        description: "Create a series of tutorials showing your digital art process",
        type: "Video/Image Series",
        estimatedEngagement: "High",
        difficulty: "Medium",
        timeInvestment: "3-4 hours",
        audienceMatch: 92,
        hashtags: ["#digitalart", "#tutorial", "#artistprocess"],
        tips: ["Film in good lighting", "Show step-by-step process", "Include voice-over"]
      },
      {
        id: 2,
        title: "Behind the Scenes Content",
        description: "Show your creative workspace and daily routine",
        type: "Story/Video",
        estimatedEngagement: "Medium",
        difficulty: "Easy",
        timeInvestment: "1-2 hours",
        audienceMatch: 87,
        hashtags: ["#behindthescenes", "#artistlife", "#workspace"],
        tips: ["Be authentic", "Show personality", "Include music"]
      }
    ]);

    setTrendingTopics([
      { topic: "AI Art Generation", popularity: 95, growth: "+15%" },
      { topic: "Digital Portraits", popularity: 88, growth: "+8%" },
      { topic: "Fantasy Art", popularity: 82, growth: "+12%" }
    ]);
  };

  const generateContentIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-assistant/content-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ideaParams)
      });

      const data = await response.json();
      if (data.success) {
        setContentIdeas(data.ideas);
        toast.success('Content ideas generated!');
      } else {
        toast.error(data.message || 'Failed to generate ideas');
        // Use mock data for demo
        loadMockData();
        toast.success('Content ideas generated! (Demo mode)');
      }
    } catch (error) {
      console.error('Failed to generate content ideas:', error);
      toast.error('Failed to generate content ideas');
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateTitles = async () => {
    if (!titleParams.content.trim()) {
      toast.error('Please provide content description');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-assistant/title-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(titleParams)
      });

      const data = await response.json();
      if (data.success) {
        setTitleSuggestions(data.suggestions);
        toast.success('Title suggestions generated!');
      } else {
        // Generate mock titles for demo
        const mockTitles = [
          {
            id: 1,
            title: "🎨 Amazing Digital Art Process Revealed!",
            style: "Catchy",
            estimatedPerformance: 87,
            length: 37,
            keywords: ["amazing", "digital art", "process"]
          },
          {
            id: 2,
            title: "Step-by-Step: Creating Fantasy Characters",
            style: "Professional",
            estimatedPerformance: 82,
            length: 39,
            keywords: ["step-by-step", "fantasy", "characters"]
          }
        ];
        setTitleSuggestions(mockTitles);
        toast.success('Title suggestions generated! (Demo mode)');
      }
    } catch (error) {
      console.error('Failed to generate titles:', error);
      toast.error('Failed to generate titles');
    } finally {
      setLoading(false);
    }
  };

  const generateCaptions = async () => {
    if (!captionParams.imageDescription.trim()) {
      toast.error('Please provide image description');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-assistant/caption-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(captionParams)
      });

      const data = await response.json();
      if (data.success) {
        setCaptionSuggestions(data.captions);
        toast.success('Captions generated!');
      } else {
        // Generate mock captions for demo
        const mockCaptions = [
          {
            id: 1,
            text: "Just finished this amazing digital artwork! 🎨✨ What do you think? Let me know in the comments! #digitalart #artistlife",
            tone: "Fun",
            engagement: "High",
            callToAction: "Comment below!"
          },
          {
            id: 2,
            text: "Hours of work went into this piece. The creative process is always a journey of discovery. Thank you for supporting my art! 🙏",
            tone: "Professional",
            engagement: "Medium",
            callToAction: "Thank supporters"
          }
        ];
        setCaptionSuggestions(mockCaptions);
        toast.success('Captions generated! (Demo mode)');
      }
    } catch (error) {
      console.error('Failed to generate captions:', error);
      toast.error('Failed to generate captions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const response = await fetch('/api/ai-assistant/trending-topics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setTrendingTopics(data.trends.topics);
        setTrendingHashtags(data.trends.hashtags);
        setSeasonalSuggestions(data.trends.seasonalSuggestions);
      }
    } catch (error) {
      console.error('Failed to fetch trending topics:', error);
    }
  };

  const getOptimalSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-assistant/posting-schedule', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setPostingSchedule(data.schedule);
        toast.success('Optimal schedule generated!');
      } else {
        // Generate mock schedule for demo
        const mockSchedule = {
          bestDays: ['Tuesday', 'Thursday', 'Saturday'],
          bestTimes: ['6:00 PM', '8:00 PM', '10:00 PM'],
          timezone: 'EST',
          recommendations: [
            'Post consistently at the same times',
            'Engage with your audience within the first hour',
            'Use trending hashtags relevant to your content'
          ]
        };
        setPostingSchedule(mockSchedule);
        toast.success('Optimal schedule generated! (Demo mode)');
      }
    } catch (error) {
      console.error('Failed to get posting schedule:', error);
      toast.error('Failed to get posting schedule');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="w-8 h-8 text-purple-500" />
          AI Content Assistant
          <Badge className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            v3.9
          </Badge>
        </h1>
        <p className="text-muted-foreground">
          Leverage AI to generate content ideas, optimize your posts, and grow your audience.
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="ideas">Ideas</TabsTrigger>
          <TabsTrigger value="titles">Titles</TabsTrigger>
          <TabsTrigger value="captions">Captions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        {/* Content Ideas Tab */}
        <TabsContent value="ideas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Content Idea Generator
              </CardTitle>
              <CardDescription>
                Get AI-powered content ideas tailored to your audience and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={ideaParams.category} onValueChange={(value) => setIdeaParams(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="art">Art & Design</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mood</Label>
                  <Select value={ideaParams.mood} onValueChange={(value) => setIdeaParams(prev => ({ ...prev, mood: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fun">Fun & Playful</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select value={ideaParams.contentType} onValueChange={(value) => setIdeaParams(prev => ({ ...prev, contentType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select value={ideaParams.audienceTier} onValueChange={(value) => setIdeaParams(prev => ({ ...prev, audienceTier: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="premium">Premium+</SelectItem>
                      <SelectItem value="vip">VIP Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={generateContentIdeas} disabled={loading} className="w-full">
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Generate Ideas
              </Button>

              {contentIdeas.length > 0 && (
                <div className="space-y-4">
                  {contentIdeas.map((idea) => (
                    <Card key={idea.id} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{idea.title}</h3>
                              <p className="text-muted-foreground">{idea.description}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {idea.audienceMatch}% match
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Type:</span> {idea.type}
                            </div>
                            <div>
                              <span className="font-medium">Engagement:</span> {idea.estimatedEngagement}
                            </div>
                            <div>
                              <span className="font-medium">Difficulty:</span> {idea.difficulty}
                            </div>
                            <div>
                              <span className="font-medium">Time:</span> {idea.timeInvestment}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="font-medium text-sm">Suggested Hashtags:</p>
                            <div className="flex flex-wrap gap-2">
                              {idea.hashtags.map((tag, index) => (
                                <Badge key={index} variant="outline-solid" className="cursor-pointer" onClick={() => copyToClipboard(tag)}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="font-medium text-sm">Tips:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {idea.tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-purple-500">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Title Suggestions Tab */}
        <TabsContent value="titles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                Title Generator
              </CardTitle>
              <CardDescription>
                Generate catchy titles that drive engagement and clicks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Content Description</Label>
                  <Textarea
                    placeholder="Describe your content (e.g., 'Digital art tutorial showing character design process')"
                    value={titleParams.content}
                    onChange={(e) => setTitleParams(prev => ({ ...prev, content: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Title Style</Label>
                    <Select value={titleParams.style} onValueChange={(value) => setTitleParams(prev => ({ ...prev, style: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="catchy">Catchy & Fun</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="mysterious">Mysterious</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Length</Label>
                    <Input
                      type="number"
                      value={titleParams.maxLength}
                      onChange={(e) => setTitleParams(prev => ({ ...prev, maxLength: parseInt(e.target.value) }))}
                      min="30"
                      max="150"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={generateTitles} disabled={loading || !titleParams.content.trim()} className="w-full">
                <Wand2 className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Generate Titles
              </Button>

              {titleSuggestions.length > 0 && (
                <div className="space-y-3">
                  {titleSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <h3 className="font-medium">{suggestion.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Style: {suggestion.style}</span>
                              <span>Length: {suggestion.length} chars</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>{suggestion.estimatedPerformance}% performance</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(suggestion.title)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Caption Generator Tab */}
        <TabsContent value="captions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Caption Generator
              </CardTitle>
              <CardDescription>
                Create engaging captions that connect with your audience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Image/Content Description</Label>
                  <Textarea
                    placeholder="Describe your image or content (e.g., 'Fantasy character artwork with dragon and magical elements')"
                    value={captionParams.imageDescription}
                    onChange={(e) => setCaptionParams(prev => ({ ...prev, imageDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={captionParams.tone} onValueChange={(value) => setCaptionParams(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fun">Fun & Casual</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="storytelling">Storytelling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Length</Label>
                    <Input
                      type="number"
                      value={captionParams.maxLength}
                      onChange={(e) => setCaptionParams(prev => ({ ...prev, maxLength: parseInt(e.target.value) }))}
                      min="50"
                      max="2000"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hashtags"
                        checked={captionParams.includeHashtags}
                        onChange={(e) => setCaptionParams(prev => ({ ...prev, includeHashtags: e.target.checked }))}
                      />
                      <Label htmlFor="hashtags">Include Hashtags</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emojis"
                        checked={captionParams.includeEmojis}
                        onChange={(e) => setCaptionParams(prev => ({ ...prev, includeEmojis: e.target.checked }))}
                      />
                      <Label htmlFor="emojis">Include Emojis</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={generateCaptions} disabled={loading || !captionParams.imageDescription.trim()} className="w-full">
                <MessageSquare className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Generate Captions
              </Button>

              {captionSuggestions.length > 0 && (
                <div className="space-y-4">
                  {captionSuggestions.map((caption) => (
                    <Card key={caption.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap">{caption.text}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(caption.text)}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Tone: {caption.tone}</span>
                            <span>Engagement: {caption.engagement}</span>
                            <span>CTA: {caption.callToAction}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trending Topics Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{topic.topic}</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">{topic.growth}</Badge>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${topic.popularity}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Trending Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {['#digitalart', '#aiart', '#characterdesign', '#fantasy', '#tutorial', '#process'].map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline-solid"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => copyToClipboard(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Content Optimizer
              </CardTitle>
              <CardDescription>
                Analyze and optimize your content for maximum engagement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Content to Optimize</Label>
                <Textarea
                  placeholder="Paste your content title and description here..."
                  value={contentToOptimize}
                  onChange={(e) => setContentToOptimize(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={() => {
                  if (!contentToOptimize.trim()) {
                    toast.error('Please enter content to optimize');
                    return;
                  }
                  
                  // Mock optimization results
                  setOptimizationResults({
                    score: 87,
                    suggestions: [
                      'Add more emotional triggers',
                      'Include trending hashtags',
                      'Optimize posting time'
                    ],
                    estimatedReach: '+25%',
                    engagement: '+18%'
                  });
                  toast.success('Content analyzed!');
                }} 
                disabled={loading || !contentToOptimize.trim()} 
                className="w-full"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Content
              </Button>

              {optimizationResults && (
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Optimization Score</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600">{optimizationResults.score}</span>
                          <span className="text-muted-foreground">/100</span>
                        </div>
                      </div>
                      
                      <Progress value={optimizationResults.score} className="h-3" />
                      
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Est. Reach Increase</p>
                          <p className="font-bold text-blue-600">{optimizationResults.estimatedReach}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Est. Engagement Boost</p>
                          <p className="font-bold text-green-600">{optimizationResults.engagement}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Improvement Suggestions:</h4>
                        <ul className="space-y-1">
                          {optimizationResults.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Sparkles className="w-3 h-3 text-yellow-500" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Optimal Posting Schedule
              </CardTitle>
              <CardDescription>
                Find the best times to post based on your audience activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={getOptimalSchedule} disabled={loading} className="w-full">
                <Calendar className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Generate Schedule
              </Button>

              {postingSchedule && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Best Days</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {postingSchedule.bestDays.map((day: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>{day}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Best Times</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {postingSchedule.bestTimes.map((time: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-500" />
                              <span>{time} {postingSchedule.timezone}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {postingSchedule.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <ThumbsUp className="w-4 h-4 text-blue-500 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIContentAssistant;
