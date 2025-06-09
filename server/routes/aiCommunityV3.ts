import express from 'express';
import AICommunityManagementService from '../services/aiCommunityManagementService.js';

const router = express.Router();

// Get community health metrics
router.get('/health-metrics', async (req, res) => {
  try {
    const metrics = AICommunityManagementService.getCommunityHealthMetrics();
    
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Community health metrics error:', error);
    res.status(500).json({
      error: 'Failed to fetch community health metrics',
      message: error.message
    });
  }
});

// Analyze content for toxicity
router.post('/analyze-toxicity', async (req, res) => {
  try {
    const { content, userId } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Content is required for toxicity analysis'
      });
    }

    const analysis = AICommunityManagementService.analyzeContentToxicity(content, userId);

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Toxicity analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze content toxicity',
      message: error.message
    });
  }
});

// Analyze user behavior
router.get('/user-behavior/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const behaviorAnalysis = AICommunityManagementService.analyzeUserBehavior(userId);

    res.json({
      success: true,
      data: behaviorAnalysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User behavior analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze user behavior',
      message: error.message
    });
  }
});

// Process content report
router.post('/report-content', async (req, res) => {
  try {
    const reportData = req.body;

    if (!reportData.content_preview || !reportData.reported_by) {
      return res.status(400).json({
        error: 'Content preview and reporter information are required'
      });
    }

    const processedReport = AICommunityManagementService.processContentReport(reportData);

    res.json({
      success: true,
      report: processedReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Content report processing error:', error);
    res.status(500).json({
      error: 'Failed to process content report',
      message: error.message
    });
  }
});

// Execute moderation action
router.post('/moderation-action', async (req, res) => {
  try {
    const actionData = req.body;

    if (!actionData.target_user || !actionData.type) {
      return res.status(400).json({
        error: 'Target user and action type are required'
      });
    }

    const executedAction = AICommunityManagementService.executeModerationAction(actionData);

    res.json({
      success: true,
      action: executedAction,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Moderation action error:', error);
    res.status(500).json({
      error: 'Failed to execute moderation action',
      message: error.message
    });
  }
});

// Get trending topics
router.get('/trending-topics', async (req, res) => {
  try {
    const trendingTopics = AICommunityManagementService.getTrendingTopics();

    res.json({
      success: true,
      data: trendingTopics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trending topics error:', error);
    res.status(500).json({
      error: 'Failed to fetch trending topics',
      message: error.message
    });
  }
});

// Get moderation recommendations
router.get('/moderation-recommendations', async (req, res) => {
  try {
    const recommendations = AICommunityManagementService.generateModerationRecommendations({});

    res.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Moderation recommendations error:', error);
    res.status(500).json({
      error: 'Failed to generate moderation recommendations',
      message: error.message
    });
  }
});

// Analyze sentiment trends
router.get('/sentiment-analysis', async (req, res) => {
  try {
    const sentimentData = AICommunityManagementService.analyzeSentimentTrends();

    res.json({
      success: true,
      data: sentimentData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze sentiment trends',
      message: error.message
    });
  }
});

// Get user risk assessment
router.get('/user-risk/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const riskAssessment = AICommunityManagementService.getUserRiskAssessment(userId);

    res.json({
      success: true,
      data: riskAssessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User risk assessment error:', error);
    res.status(500).json({
      error: 'Failed to assess user risk',
      message: error.message
    });
  }
});

// Get real-time monitoring data
router.get('/realtime-monitoring', async (req, res) => {
  try {
    const monitoringData = AICommunityManagementService.getRealtimeMonitoringData();

    res.json({
      success: true,
      data: monitoringData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Real-time monitoring error:', error);
    res.status(500).json({
      error: 'Failed to fetch real-time monitoring data',
      message: error.message
    });
  }
});

// Bulk user analysis
router.post('/bulk-user-analysis', async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: 'User IDs array is required'
      });
    }

    if (userIds.length > 20) {
      return res.status(400).json({
        error: 'Maximum 20 users allowed per bulk analysis'
      });
    }

    const results = userIds.map(userId => {
      const behaviorAnalysis = AICommunityManagementService.analyzeUserBehavior(userId);
      const riskAssessment = AICommunityManagementService.getUserRiskAssessment(userId);
      
      return {
        userId,
        behavior: behaviorAnalysis,
        risk: riskAssessment,
        summary: {
          overall_score: behaviorAnalysis.engagement_score,
          risk_level: riskAssessment.risk_level,
          requires_attention: riskAssessment.risk_level === 'high' || riskAssessment.risk_level === 'critical'
        }
      };
    });

    const summary = {
      totalUsers: results.length,
      highRiskUsers: results.filter(r => r.risk.risk_level === 'high' || r.risk.risk_level === 'critical').length,
      averageEngagement: Math.round(results.reduce((sum, r) => sum + r.behavior.engagement_score, 0) / results.length),
      usersRequiringAttention: results.filter(r => r.summary.requires_attention).length
    };

    res.json({
      success: true,
      results,
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Bulk user analysis error:', error);
    res.status(500).json({
      error: 'Failed to perform bulk user analysis',
      message: error.message
    });
  }
});

// Community insights dashboard
router.get('/insights-dashboard', async (req, res) => {
  try {
    const healthMetrics = AICommunityManagementService.getCommunityHealthMetrics();
    const trendingTopics = AICommunityManagementService.getTrendingTopics();
    const sentimentData = AICommunityManagementService.analyzeSentimentTrends();
    const recommendations = AICommunityManagementService.generateModerationRecommendations({});
    const monitoringData = AICommunityManagementService.getRealtimeMonitoringData();

    const dashboard = {
      overview: {
        health_score: healthMetrics.find(m => m.metric === 'Community Health')?.value || 85,
        active_users: monitoringData.active_users,
        sentiment_score: sentimentData.overall_sentiment,
        alert_count: monitoringData.alerts.length
      },
      metrics: healthMetrics,
      trending: trendingTopics.slice(0, 5),
      sentiment: sentimentData,
      recommendations: recommendations.filter(r => r.priority === 'high'),
      alerts: monitoringData.alerts,
      activity: {
        posts_per_hour: monitoringData.posts_per_hour,
        reports_pending: monitoringData.reports_pending,
        auto_actions: monitoringData.auto_actions_taken
      }
    };

    res.json({
      success: true,
      data: dashboard,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard insights error:', error);
    res.status(500).json({
      error: 'Failed to generate dashboard insights',
      message: error.message
    });
  }
});

// Community member search and filter
router.get('/members', async (req, res) => {
  try {
    const { 
      search, 
      status, 
      role, 
      risk_level, 
      engagement_min, 
      page = 1, 
      limit = 20 
    } = req.query;

    // Mock member data with filtering
    const mockMembers = Array.from({ length: 100 }, (_, i) => ({
      id: `member-${i + 1}`,
      username: `user${i + 1}`,
      displayName: `Community Member ${i + 1}`,
      avatar: '/api/placeholder/40/40',
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)],
      role: ['member', 'contributor', 'moderator'][Math.floor(Math.random() * 3)],
      stats: {
        posts: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 500),
        likes_received: Math.floor(Math.random() * 1000),
        likes_given: Math.floor(Math.random() * 300),
        reports: Math.floor(Math.random() * 5),
        warnings: Math.floor(Math.random() * 3)
      },
      ai_insights: {
        engagement_score: Math.floor(Math.random() * 40) + 60,
        toxicity_risk: Math.floor(Math.random() * 30),
        contribution_quality: Math.floor(Math.random() * 40) + 60,
        community_fit: Math.floor(Math.random() * 40) + 60
      },
      tier: ['free', 'premium', 'vip'][Math.floor(Math.random() * 3)],
      badges: ['active', 'helpful', 'creator'].filter(() => Math.random() > 0.5)
    }));

    // Apply filters
    let filteredMembers = mockMembers;

    if (search) {
      filteredMembers = filteredMembers.filter(member => 
        member.username.toLowerCase().includes(search.toString().toLowerCase()) ||
        member.displayName.toLowerCase().includes(search.toString().toLowerCase())
      );
    }

    if (status && status !== 'all') {
      filteredMembers = filteredMembers.filter(member => member.status === status);
    }

    if (role && role !== 'all') {
      filteredMembers = filteredMembers.filter(member => member.role === role);
    }

    if (engagement_min) {
      filteredMembers = filteredMembers.filter(member => 
        member.ai_insights.engagement_score >= parseInt(engagement_min.toString())
      );
    }

    // Pagination
    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        members: paginatedMembers,
        pagination: {
          current_page: pageNum,
          total_pages: Math.ceil(filteredMembers.length / limitNum),
          total_count: filteredMembers.length,
          has_next: endIndex < filteredMembers.length,
          has_prev: pageNum > 1
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Members fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch community members',
      message: error.message
    });
  }
});

// Community reports management
router.get('/reports', async (req, res) => {
  try {
    const { status, severity, type, page = 1, limit = 10 } = req.query;

    // Mock reports data
    const mockReports = Array.from({ length: 50 }, (_, i) => ({
      id: `report-${i + 1}`,
      type: ['harassment', 'spam', 'inappropriate', 'copyright', 'other'][Math.floor(Math.random() * 5)],
      content_id: `content-${i + 1}`,
      content_type: ['post', 'comment', 'message'][Math.floor(Math.random() * 3)],
      content_preview: `This is sample content that has been reported by the community...`,
      reported_by: `user${Math.floor(Math.random() * 10) + 1}`,
      reported_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: ['pending', 'reviewing', 'resolved', 'dismissed'][Math.floor(Math.random() * 4)],
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      ai_analysis: {
        confidence: Math.floor(Math.random() * 30) + 70,
        category: 'Potentially harmful content',
        risk_level: Math.floor(Math.random() * 40) + 30,
        auto_action: 'Flag for review'
      }
    }));

    // Apply filters
    let filteredReports = mockReports;

    if (status && status !== 'all') {
      filteredReports = filteredReports.filter(report => report.status === status);
    }

    if (severity && severity !== 'all') {
      filteredReports = filteredReports.filter(report => report.severity === severity);
    }

    if (type && type !== 'all') {
      filteredReports = filteredReports.filter(report => report.type === type);
    }

    // Sort by date (newest first)
    filteredReports.sort((a, b) => b.reported_at.getTime() - a.reported_at.getTime());

    // Pagination
    const pageNum = parseInt(page.toString());
    const limitNum = parseInt(limit.toString());
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        reports: paginatedReports,
        pagination: {
          current_page: pageNum,
          total_pages: Math.ceil(filteredReports.length / limitNum),
          total_count: filteredReports.length,
          has_next: endIndex < filteredReports.length,
          has_prev: pageNum > 1
        },
        summary: {
          pending: mockReports.filter(r => r.status === 'pending').length,
          reviewing: mockReports.filter(r => r.status === 'reviewing').length,
          high_priority: mockReports.filter(r => r.severity === 'high' || r.severity === 'critical').length
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Reports fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch community reports',
      message: error.message
    });
  }
});

export default router;
