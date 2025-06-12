import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { 
  Settings,
  Brain,
  Shield,
  Target,
  Eye,
  TrendingUp,
  Users,
  RefreshCw,
  Save,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import AnimatedLoader from '../ui/AnimatedLoader';

interface AISettings {
  personalization: {
    enabled: boolean;
    learningRate: number;
    privacyLevel: 'basic' | 'moderate' | 'strict';
    dataRetention: number; // days
  };
  recommendations: {
    enabled: boolean;
    diversityFactor: number;
    exploreVsExploit: number;
    contextAware: boolean;
    realTimeUpdates: boolean;
  };
  contentModeration: {
    enabled: boolean;
    strictness: number;
    autoAction: boolean;
    humanReview: boolean;
    categories: string[];
  };
  analytics: {
    enabled: boolean;
    detailLevel: 'basic' | 'detailed' | 'comprehensive';
    predictions: boolean;
    insights: boolean;
    sharing: boolean;
  };
  notifications: {
    aiInsights: boolean;
    recommendations: boolean;
    warnings: boolean;
    achievements: boolean;
    frequency: 'real-time' | 'daily' | 'weekly';
  };
  privacy: {
    dataCollection: boolean;
    behaviorTracking: boolean;
    crossPlatform: boolean;
    anonymization: boolean;
    dataExport: boolean;
  };
}

interface AIModel {
  id: string;
  name: string;
  type: 'recommendation' | 'moderation' | 'analytics' | 'personalization';
  version: string;
  accuracy: number;
  speed: number;
  enabled: boolean;
  description: string;
}

export default function AISettingsManager() {
  const [settings, setSettings] = useState<AISettings>({
    personalization: {
      enabled: true,
      learningRate: 0.7,
      privacyLevel: 'moderate',
      dataRetention: 90
    },
    recommendations: {
      enabled: true,
      diversityFactor: 0.3,
      exploreVsExploit: 0.4,
      contextAware: true,
      realTimeUpdates: true
    },
    contentModeration: {
      enabled: true,
      strictness: 0.6,
      autoAction: false,
      humanReview: true,
      categories: ['harassment', 'spam', 'explicit']
    },
    analytics: {
      enabled: true,
      detailLevel: 'detailed',
      predictions: true,
      insights: true,
      sharing: false
    },
    notifications: {
      aiInsights: true,
      recommendations: true,
      warnings: true,
      achievements: true,
      frequency: 'daily'
    },
    privacy: {
      dataCollection: true,
      behaviorTracking: true,
      crossPlatform: false,
      anonymization: true,
      dataExport: true
    }
  });
  
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'rec-v4',
      name: 'Recommendation Engine v4.2',
      type: 'recommendation',
      version: '4.2.1',
      accuracy: 94,
      speed: 98,
      enabled: true,
      description: 'Advanced hybrid recommendation system with real-time learning'
    },
    {
      id: 'mod-v3',
      name: 'Content Moderator v3.8',
      type: 'moderation',
      version: '3.8.2',
      accuracy: 96,
      speed: 99,
      enabled: true,
      description: 'Multi-modal content safety analysis with context understanding'
    },
    {
      id: 'ana-v2',
      name: 'Analytics Predictor v2.5',
      type: 'analytics',
      version: '2.5.3',
      accuracy: 89,
      speed: 95,
      enabled: true,
      description: 'Predictive analytics with audience behavior modeling'
    },
    {
      id: 'per-v1',
      name: 'Personalization Engine v1.9',
      type: 'personalization',
      version: '1.9.4',
      accuracy: 92,
      speed: 97,
      enabled: true,
      description: 'Adaptive user preference learning with privacy protection'
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('personalization');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [blockedKeywords, setBlockedKeywords] = useState<string[]>(['spam', 'hate']);
  const [newKeyword, setNewKeyword] = useState('');

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      // In real implementation, save to backend
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleModelToggle = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, enabled: !model.enabled } : model
    ));
  };

  const addBlockedKeyword = () => {
    if (newKeyword.trim() && !blockedKeywords.includes(newKeyword.trim())) {
      setBlockedKeywords(prev => [...prev, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeBlockedKeyword = (keyword: string) => {
    setBlockedKeywords(prev => prev.filter(k => k !== keyword));
  };

  const getModelTypeIcon = (type: 'recommendation' | 'moderation' | 'analytics' | 'personalization') => {
    switch (type) {
      case 'recommendation': return Target;
      case 'moderation': return Shield;
      case 'analytics': return TrendingUp;
      case 'personalization': return Users;
      default: return Brain;
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
        <div>
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold">AI Settings & Configuration</h1>
          </div>
          <p className="text-gray-600 mt-1">
            Customize your AI experience, privacy settings, and model preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {lastSaved && (
            <div className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            {isSaving ? (
              <AnimatedLoader type="default" size="sm" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </motion.div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
        </TabsList>

        {/* Personalization Tab */}
        <TabsContent value="personalization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Personalization Settings</span>
              </CardTitle>
              <CardDescription>
                Control how AI learns from your behavior and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable AI Personalization</label>
                  <p className="text-sm text-gray-500">Allow AI to learn from your interactions</p>
                </div>
                <Switch
                  checked={settings.personalization.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      personalization: { ...prev.personalization, enabled: checked }
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Learning Rate</label>
                <div className="px-3">
                  <Slider
                    value={[settings.personalization.learningRate]}
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        personalization: { ...prev.personalization, learningRate: value[0] }
                      }))
                    }
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative</span>
                    <span>Adaptive</span>
                    <span>Aggressive</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Privacy Level</label>
                <select 
                  value={settings.personalization.privacyLevel}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      personalization: { 
                        ...prev.personalization, 
                        privacyLevel: e.target.value as 'basic' | 'moderate' | 'strict'
                      }
                    }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="basic">Basic - Full personalization</option>
                  <option value="moderate">Moderate - Balanced approach</option>
                  <option value="strict">Strict - Minimal data usage</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Retention (days)</label>
                <Input
                  type="number"
                  value={settings.personalization.dataRetention}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      personalization: { 
                        ...prev.personalization, 
                        dataRetention: parseInt(e.target.value) || 90
                      }
                    }))
                  }
                  min={1}
                  max={365}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Recommendation Engine</span>
              </CardTitle>
              <CardDescription>
                Configure how AI suggests content and creators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable Recommendations</label>
                  <p className="text-sm text-gray-500">Get AI-powered content suggestions</p>
                </div>
                <Switch
                  checked={settings.recommendations.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      recommendations: { ...prev.recommendations, enabled: checked }
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Diversity Factor</label>
                <p className="text-xs text-gray-500">Higher values show more varied content</p>
                <div className="px-3">
                  <Slider
                    value={[settings.recommendations.diversityFactor]}
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        recommendations: { ...prev.recommendations, diversityFactor: value[0] }
                      }))
                    }
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Exploration vs Exploitation</label>
                <p className="text-xs text-gray-500">Balance between familiar and new content</p>
                <div className="px-3">
                  <Slider
                    value={[settings.recommendations.exploreVsExploit]}
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        recommendations: { ...prev.recommendations, exploreVsExploit: value[0] }
                      }))
                    }
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Familiar</span>
                    <span>Balanced</span>
                    <span>Exploratory</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Context Aware</label>
                    <p className="text-xs text-gray-500">Consider time and activity</p>
                  </div>
                  <Switch
                    checked={settings.recommendations.contextAware}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        recommendations: { ...prev.recommendations, contextAware: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Real-time Updates</label>
                    <p className="text-xs text-gray-500">Immediate adaptation</p>
                  </div>
                  <Switch
                    checked={settings.recommendations.realTimeUpdates}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        recommendations: { ...prev.recommendations, realTimeUpdates: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Moderation Tab */}
        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Content Moderation</span>
              </CardTitle>
              <CardDescription>
                Configure AI content safety and moderation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable AI Moderation</label>
                  <p className="text-sm text-gray-500">Automatic content safety analysis</p>
                </div>
                <Switch
                  checked={settings.contentModeration.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      contentModeration: { ...prev.contentModeration, enabled: checked }
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Moderation Strictness</label>
                <div className="px-3">
                  <Slider
                    value={[settings.contentModeration.strictness]}
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        contentModeration: { ...prev.contentModeration, strictness: value[0] }
                      }))
                    }
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Lenient</span>
                    <span>Moderate</span>
                    <span>Strict</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auto Action</label>
                    <p className="text-xs text-gray-500">Automatic content actions</p>
                  </div>
                  <Switch
                    checked={settings.contentModeration.autoAction}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        contentModeration: { ...prev.contentModeration, autoAction: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Human Review</label>
                    <p className="text-xs text-gray-500">Flag for human review</p>
                  </div>
                  <Switch
                    checked={settings.contentModeration.humanReview}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        contentModeration: { ...prev.contentModeration, humanReview: checked }
                      }))
                    }
                  />
                </div>
              </div>
              
              {/* Blocked Keywords */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Blocked Keywords</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add keyword to block..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addBlockedKeyword()}
                  />
                  <Button onClick={addBlockedKeyword} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blockedKeywords.map(keyword => (
                    <Badge 
                      key={keyword} 
                      variant="secondary" 
                      className="flex items-center space-x-1"
                    >
                      <span>{keyword}</span>
                      <button 
                        onClick={() => removeBlockedKeyword(keyword)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Analytics & Insights</span>
              </CardTitle>
              <CardDescription>
                Configure AI analytics and prediction settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Enable AI Analytics</label>
                  <p className="text-sm text-gray-500">Get AI-powered insights and predictions</p>
                </div>
                <Switch
                  checked={settings.analytics.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      analytics: { ...prev.analytics, enabled: checked }
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Detail Level</label>
                <select 
                  value={settings.analytics.detailLevel}
                  onChange={(e) => 
                    setSettings(prev => ({
                      ...prev,
                      analytics: { 
                        ...prev.analytics, 
                        detailLevel: e.target.value as 'basic' | 'detailed' | 'comprehensive'
                      }
                    }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="basic">Basic - Key metrics only</option>
                  <option value="detailed">Detailed - Enhanced analytics</option>
                  <option value="comprehensive">Comprehensive - Full analysis</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Predictions</label>
                    <p className="text-xs text-gray-500">Future performance forecasts</p>
                  </div>
                  <Switch
                    checked={settings.analytics.predictions}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        analytics: { ...prev.analytics, predictions: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">AI Insights</label>
                    <p className="text-xs text-gray-500">Contextual recommendations</p>
                  </div>
                  <Switch
                    checked={settings.analytics.insights}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        analytics: { ...prev.analytics, insights: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Data Sharing</label>
                    <p className="text-xs text-gray-500">Anonymous platform insights</p>
                  </div>
                  <Switch
                    checked={settings.analytics.sharing}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        analytics: { ...prev.analytics, sharing: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Data Protection</span>
              </CardTitle>
              <CardDescription>
                Control your data privacy and AI processing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Data Collection</label>
                    <p className="text-xs text-gray-500">Allow AI to collect interaction data</p>
                  </div>
                  <Switch
                    checked={settings.privacy.dataCollection}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, dataCollection: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Behavior Tracking</label>
                    <p className="text-xs text-gray-500">Track usage patterns for AI</p>
                  </div>
                  <Switch
                    checked={settings.privacy.behaviorTracking}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, behaviorTracking: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Cross-Platform</label>
                    <p className="text-xs text-gray-500">Share data across platforms</p>
                  </div>
                  <Switch
                    checked={settings.privacy.crossPlatform}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, crossPlatform: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Data Anonymization</label>
                    <p className="text-xs text-gray-500">Remove personal identifiers</p>
                  </div>
                  <Switch
                    checked={settings.privacy.anonymization}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, anonymization: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Data Export</label>
                    <p className="text-xs text-gray-500">Allow data export requests</p>
                  </div>
                  <Switch
                    checked={settings.privacy.dataExport}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, dataExport: checked }
                      }))
                    }
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Data Management</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View My Data</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Export Data</span>
                  </Button>
                  <Button variant="destructive" className="flex items-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete All Data</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>AI Models & Performance</span>
              </CardTitle>
              <CardDescription>
                Manage AI models and their performance settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model, index) => {
                  const IconComponent = getModelTypeIcon(model.type);
                  return (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border rounded-lg p-4 ${model.enabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${model.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <IconComponent className={`w-5 h-5 ${model.enabled ? 'text-green-600' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <h3></h3>
