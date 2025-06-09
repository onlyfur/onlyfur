import express from 'express';
import AIContentOptimizationService from '../services/aiContentOptimizationService.js';

const router = express.Router();

// Analyze content for optimization opportunities
router.post('/analyze-content', async (req, res) => {
  try {
    const contentData = req.body;
    
    if (!contentData.title || !contentData.description) {
      return res.status(400).json({
        error: 'Title and description are required for analysis'
      });
    }

    const analysis = AIContentOptimizationService.analyzeContent(contentData);
    const suggestions = AIContentOptimizationService.generateOptimizationSuggestions(contentData, analysis);

    res.json({
      success: true,
      analysis,
      suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Content analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze content',
      message: error.message
    });
  }
});

// Get content performance analytics
router.get('/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeRange } = req.query;

    const analytics = AIContentOptimizationService.getContentPerformanceAnalytics(
      userId, 
      timeRange as string
    );

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// Get trending insights
router.get('/trending-insights', async (req, res) => {
  try {
    const { category } = req.query;
    
    const insights = AIContentOptimizationService.getTrendingInsights(category as string);

    res.json({
      success: true,
      data: insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Trending insights error:', error);
    res.status(500).json({
      error: 'Failed to fetch trending insights',
      message: error.message
    });
  }
});

// Optimize content title
router.post('/optimize-title', async (req, res) => {
  try {
    const { title, contentType, targetAudience } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Title is required for optimization'
      });
    }

    // Generate optimized title suggestions
    const suggestions = [
      {
        original: title,
        optimized: `${title} - ${contentType === 'video' ? 'Speedpaint' : 'Digital Art'} Process`,
        score: 85,
        improvements: ['Added process indicator', 'More specific description']
      },
      {
        original: title,
        optimized: `Amazing ${title} - Character Commission Art`,
        score: 78,
        improvements: ['Added emotional keyword', 'Specified content type']
      },
      {
        original: title,
        optimized: `${title} | Furry Art Commission - High Quality`,
        score: 82,
        improvements: ['Added community keywords', 'Quality indicator']
      }
    ];

    res.json({
      success: true,
      suggestions,
      analytics: {
        currentScore: Math.floor(Math.random() * 30) + 50,
        potentialImprovement: Math.floor(Math.random() * 20) + 15
      }
    });
  } catch (error) {
    console.error('Title optimization error:', error);
    res.status(500).json({
      error: 'Failed to optimize title',
      message: error.message
    });
  }
});

// Optimize content tags
router.post('/optimize-tags', async (req, res) => {
  try {
    const { currentTags, contentType, title, description } = req.body;

    if (!Array.isArray(currentTags)) {
      return res.status(400).json({
        error: 'Current tags must be an array'
      });
    }

    const trendingTags = AIContentOptimizationService.getTrendingTags(contentType);
    
    const optimizedTags = {
      current: currentTags,
      suggested: [
        ...currentTags.slice(0, 3), // Keep some original tags
        ...trendingTags.slice(0, 4), // Add trending tags
        '#commission', '#highquality', '#professional'
      ].filter((tag, index, array) => array.indexOf(tag) === index), // Remove duplicates
      trending: trendingTags,
      analysis: {
        currentScore: Math.floor(Math.random() * 30) + 50,
        optimizedScore: Math.floor(Math.random() * 20) + 80,
        improvements: [
          'Added trending community tags',
          'Included quality indicators',
          'Balanced popular and niche tags'
        ]
      }
    };

    res.json({
      success: true,
      data: optimizedTags
    });
  } catch (error) {
    console.error('Tag optimization error:', error);
    res.status(500).json({
      error: 'Failed to optimize tags',
      message: error.message
    });
  }
});

// Get optimal posting schedule
router.get('/posting-schedule/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { timezone } = req.query;

    // Mock optimal posting schedule based on user's audience
    const schedule = {
      weekdays: [
        { day: 'Monday', times: ['7:00 PM', '8:30 PM'], engagement: 85 },
        { day: 'Tuesday', times: ['6:45 PM', '8:00 PM'], engagement: 82 },
        { day: 'Wednesday', times: ['7:15 PM', '8:45 PM'], engagement: 88 },
        { day: 'Thursday', times: ['7:00 PM', '8:30 PM'], engagement: 86 },
        { day: 'Friday', times: ['6:30 PM', '9:00 PM'], engagement: 92 }
      ],
      weekends: [
        { day: 'Saturday', times: ['2:00 PM', '7:30 PM'], engagement: 89 },
        { day: 'Sunday', times: ['1:30 PM', '7:00 PM'], engagement: 84 }
      ],
      timezone: timezone || 'EST',
      analysis: {
        bestDay: 'Friday',
        bestTime: '9:00 PM',
        worstDay: 'Sunday',
        worstTime: '8:00 AM',
        audienceActivityPattern: 'Evening-focused with weekend afternoon activity'
      }
    };

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Posting schedule error:', error);
    res.status(500).json({
      error: 'Failed to generate posting schedule',
      message: error.message
    });
  }
});

// Batch content analysis
router.post('/batch-analyze', async (req, res) => {
  try {
    const { contentItems } = req.body;

    if (!Array.isArray(contentItems) || contentItems.length === 0) {
      return res.status(400).json({
        error: 'Content items array is required'
      });
    }

    if (contentItems.length > 10) {
      return res.status(400).json({
        error: 'Maximum 10 content items allowed per batch'
      });
    }

    const results = contentItems.map((content, index) => {
      const analysis = AIContentOptimizationService.analyzeContent(content);
      const suggestions = AIContentOptimizationService.generateOptimizationSuggestions(content, analysis);
      
      return {
        id: content.id || `content-${index}`,
        analysis,
        suggestions: suggestions.slice(0, 3), // Limit suggestions for batch processing
        priority: analysis.overall_score < 60 ? 'high' : analysis.overall_score < 80 ? 'medium' : 'low'
      };
    });

    const summary = {
      totalItems: results.length,
      averageScore: Math.round(results.reduce((sum, r) => sum + r.analysis.overall_score, 0) / results.length),
      highPriority: results.filter(r => r.priority === 'high').length,
      mediumPriority: results.filter(r => r.priority === 'medium').length,
      lowPriority: results.filter(r => r.priority === 'low').length
    };

    res.json({
      success: true,
      results,
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({
      error: 'Failed to perform batch analysis',
      message: error.message
    });
  }
});

// Content performance prediction
router.post('/predict-performance', async (req, res) => {
  try {
    const contentData = req.body;

    const analysis = AIContentOptimizationService.analyzeContent(contentData);
    
    const prediction = {
      engagement: {
        predicted: analysis.engagement_prediction,
        confidence: Math.floor(Math.random() * 20) + 70,
        factors: [
          { factor: 'Title optimization', impact: analysis.title_score / 100 * 0.3 },
          { factor: 'Tag effectiveness', impact: analysis.tags_score / 100 * 0.25 },
          { factor: 'Content type', impact: 0.2 },
          { factor: 'Posting time', impact: analysis.timing_score / 100 * 0.25 }
        ]
      },
      reach: {
        predicted: analysis.reach_prediction,
        confidence: Math.floor(Math.random() * 15) + 75,
        organic_reach: Math.floor(analysis.reach_prediction * 0.7),
        viral_potential: analysis.overall_score > 85 ? 'high' : analysis.overall_score > 70 ? 'medium' : 'low'
      },
      revenue: {
        estimated_tips: Math.floor(Math.random() * 50) + 10,
        commission_inquiries: Math.floor(Math.random() * 10) + 2,
        subscription_conversions: Math.floor(Math.random() * 5) + 1
      }
    };

    res.json({
      success: true,
      prediction,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Performance prediction error:', error);
    res.status(500).json({
      error: 'Failed to predict performance',
      message: error.message
    });
  }
});

// A/B test content variations
router.post('/ab-test', async (req, res) => {
  try {
    const { variations } = req.body;

    if (!Array.isArray(variations) || variations.length < 2) {
      return res.status(400).json({
        error: 'At least 2 content variations are required for A/B testing'
      });
    }

    const testResults = variations.map((variation, index) => {
      const analysis = AIContentOptimizationService.analyzeContent(variation);
      
      return {
        variation: `Variation ${String.fromCharCode(65 + index)}`, // A, B, C, etc.
        content: variation,
        scores: {
          overall: analysis.overall_score,
          title: analysis.title_score,
          description: analysis.description_score,
          tags: analysis.tags_score
        },
        predictions: {
          engagement: analysis.engagement_prediction,
          reach: analysis.reach_prediction
        },
        recommendation: analysis.overall_score >= 80 ? 'Recommended' : 'Needs improvement'
      };
    });

    // Find the best performing variation
    const bestVariation = testResults.reduce((best, current) => 
      current.scores.overall > best.scores.overall ? current : best
    );

    const summary = {
      bestVariation: bestVariation.variation,
      improvementPotential: bestVariation.scores.overall - Math.min(...testResults.map(r => r.scores.overall)),
      keyDifferences: [
        'Title optimization varies significantly between versions',
        'Tag strategy impacts reach potential',
        'Description length affects engagement prediction'
      ]
    };

    res.json({
      success: true,
      testResults,
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('A/B test error:', error);
    res.status(500).json({
      error: 'Failed to perform A/B test',
      message: error.message
    });
  }
});

export default router;
