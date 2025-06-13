import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Brain,
  Zap,
  Clock,
  TrendingUp,
  Users,
  Flag,
  Sparkles,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModerationResult {
  id: string;
  contentId: string;
  status: 'approved' | 'rejected' | 'pending' | 'review_needed';
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  aiAnalysis: {
    toxicity: number;
    spam: number;
    harassment: number;
    explicitContent: number;
    copyright: number;
    qualityScore: number;
  };
  recommendedAction: string;
  processingTime: number;
  humanReviewRequired: boolean;
}

interface AIContentModeratorProps {
  contentId?: string;
  mode: 'realtime' | 'batch' | 'dashboard';
  onModerationComplete?: (result: ModerationResult) => void;
  className?: string;
}

const AIContentModerator: React.FC<AIContentModeratorProps> = ({
  contentId,
  mode,
  onModerationComplete,
  className = ''
}) => {
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [recentModerations, setRecentModerations] = useState<ModerationResult[]>([]);

  useEffect(() => {
    if (mode === 'dashboard') {
      loadRecentModerations();
    }
  }, [mode]);

  const loadRecentModerations = async () => {
    try {
      const response = await fetch('/api/ai/moderation/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRecentModerations(data.moderations);
      }
    } catch (error) {
      console.error('Error loading recent moderations:', error);
    }
  };

  const moderateContent = async (contentToModerate?: string) => {
    setIsProcessing(true);
    setProcessingStage('Initializing AI Analysis...');
    
    try {
      // Simulate AI processing stages for realistic feel
      const stages = [
        'Scanning for explicit content...',
        'Analyzing toxicity levels...',
        'Checking for spam patterns...',
        'Evaluating content quality...',
        'Running final safety checks...',
        'Generating recommendations...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setProcessingStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const response = await fetch('/api/ai/moderation/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          contentId: contentId || 'demo',
          content: contentToModerate || 'Sample content for analysis'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setModerationResult(data.result);
        onModerationComplete?.(data.result);
      }
    } catch (error) {
      console.error('Error during content moderation:', error);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'review_needed': return <Eye className="w-5 h-5 text-orange-500" />;
      default: return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
    }
  };

  const AnalysisMetric: React.FC<{ 
    label: string; 
    value: number; 
    icon: React.ReactNode; 
    color: string;
    delay: number;
  }> = ({ label, value, icon, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded ${color}`}>
            {icon}
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold">{Math.round(value)}%</span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: delay + 0.2, duration: 0.8 }}
      >
        <Progress 
          value={value} 
          className={`h-2 ${value > 70 ? 'bg-red-200' : value > 40 ? 'bg-yellow-200' : 'bg-green-200'}`}
        />
      </motion.div>
    </motion.div>
  );

  if (mode === 'dashboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Content Moderation Dashboard
              </h2>
            </div>
            <Badge variant="secondary" className="bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Content Processed', value: '12,847', icon: <Eye className="w-4 h-4" />, trend: '+12%' },
              { label: 'Auto-Approved', value: '11,234', icon: <CheckCircle className="w-4 h-4" />, trend: '+8%' },
              { label: 'Flagged for Review', value: '847', icon: <Flag className="w-4 h-4" />, trend: '-5%' },
              { label: 'False Positives', value: '32', icon: <AlertTriangle className="w-4 h-4" />, trend: '-15%' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">{stat.trend}</span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Recent Moderations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Moderation Results</span>
              </CardTitle>
              <CardDescription>
                Latest AI content analysis results with confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentModerations.slice(0, 5).map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium">Content #{result.contentId}</p>
                        <p className="text-sm text-muted-foreground">
                          Processed in {result.processingTime}ms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getRiskColor(result.riskLevel)}>
                        {result.riskLevel} risk
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">{Math.round(result.confidence)}% confident</p>
                        <p className="text-xs text-muted-foreground">
                          Quality: {Math.round(result.aiAnalysis.qualityScore)}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Processing Animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            <Card className="border-2 border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardContent className="p-8 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="mx-auto mb-4"
                >
                  <Brain className="w-12 h-12 text-blue-600" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">AI Content Analysis in Progress</h3>
                <p className="text-muted-foreground mb-4">{processingStage}</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={33} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moderation Result */}
      <AnimatePresence>
        {moderationResult && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="border-2 border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon(moderationResult.status)}
                    <span>AI Moderation Result</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(moderationResult.riskLevel)}>
                      {moderationResult.riskLevel} risk
                    </Badge>
                    <Badge variant="outline">
                      <Brain className="w-3 h-3 mr-1" />
                      {Math.round(moderationResult.confidence)}% confident
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Content analysis completed in {moderationResult.processingTime}ms
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* AI Analysis Metrics */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Analysis Breakdown</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnalysisMetric
                      label="Toxicity Level"
                      value={moderationResult.aiAnalysis.toxicity}
                      icon={<AlertTriangle className="w-3 h-3" />}
                      color="bg-red-100 text-red-600 dark:bg-red-950"
                      delay={0}
                    />
                    <AnalysisMetric
                      label="Spam Detection"
                      value={moderationResult.aiAnalysis.spam}
                      icon={<Flag className="w-3 h-3" />}
                      color="bg-orange-100 text-orange-600 dark:bg-orange-950"
                      delay={0.1}
                    />
                    <AnalysisMetric
                      label="Harassment Risk"
                      value={moderationResult.aiAnalysis.harassment}
                      icon={<Users className="w-3 h-3" />}
                      color="bg-yellow-100 text-yellow-600 dark:bg-yellow-950"
                      delay={0.2}
                    />
                    <AnalysisMetric
                      label="Content Quality"
                      value={moderationResult.aiAnalysis.qualityScore}
                      icon={<Target className="w-3 h-3" />}
                      color="bg-green-100 text-green-600 dark:bg-green-950"
                      delay={0.3}
                    />
                  </div>
                </div>

                {/* Flags */}
                {moderationResult.flags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <h4 className="font-semibold text-orange-600">Content Flags</h4>
                    <div className="flex flex-wrap gap-2">
                      {moderationResult.flags.map((flag, index) => (
                        <motion.div
                          key={flag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.6 }}
                        >
                          <Badge variant="destructive">
                            <Flag className="w-3 h-3 mr-1" />
                            {flag}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Recommended Action */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Alert className={moderationResult.riskLevel === 'high' || moderationResult.riskLevel === 'critical' ? 'border-red-200 bg-red-50 dark:bg-red-950' : 'border-blue-200 bg-blue-50 dark:bg-blue-950'}>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommended Action:</strong> {moderationResult.recommendedAction}
                    </AlertDescription>
                  </Alert>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex space-x-3 pt-4"
                >
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={moderationResult.status === 'rejected'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Content
                  </Button>
                  <Button 
                    variant="destructive"
                    disabled={moderationResult.status === 'approved'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Content
                  </Button>
                  {moderationResult.humanReviewRequired && (
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Request Human Review
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Trigger for Testing */}
      {mode === 'realtime' && !moderationResult && !isProcessing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="text-center p-8 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-dashed border-blue-200 dark:border-blue-800">
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
                <Shield className="w-12 h-12 text-blue-400 mx-auto" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  AI Content Moderation Ready
                </h3>
                <p className="text-muted-foreground">
                  Submit content for AI-powered safety analysis and quality assessment
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => moderateContent()}
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AIContentModerator;