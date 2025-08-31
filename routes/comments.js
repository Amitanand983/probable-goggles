const express = require('express');
const { fetchComments } = require('../services/playStoreAPI');
const { validateAppId } = require('../middleware/validation');

const router = express.Router();

/**
 * @route GET /api/comments/:appId
 * @desc Get comments for a specific app from Google Play Store
 * @access Public
 */
router.get('/:appId', validateAppId, async (req, res) => {
  try {
    const { appId } = req.params;
    const { limit = 50, sort = 'recent' } = req.query;
    
    console.log(`📱 Fetching comments for app: ${appId} via API`);
    
    const comments = await fetchComments(appId, {
      limit: parseInt(limit),
      sort: sort
    });
    
    res.json({
      success: true,
      data: {
        appId,
        totalComments: comments.length,
        comments,
        metadata: {
          fetchedAt: new Date().toISOString(),
          limit: parseInt(limit),
          sort
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments',
      message: error.message
    });
  }
});

/**
 * @route POST /api/comments/batch
 * @desc Get comments for multiple apps in batch
 * @access Public
 */
router.post('/batch', async (req, res) => {
  try {
    const { appIds, limit = 20, sort = 'recent' } = req.body;
    
    if (!appIds || !Array.isArray(appIds) || appIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'appIds array is required and must not be empty'
      });
    }
    
    if (appIds.length > 10) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 apps allowed per batch request'
      });
    }
    
    console.log(`📱 Batch fetching comments for ${appIds.length} apps via API`);
    
    const results = [];
    const errors = [];
    
    // Process apps in parallel with rate limiting
    const promises = appIds.map(async (appId) => {
      try {
        const comments = await fetchComments(appId, {
          limit: parseInt(limit),
          sort: sort
        });
        
        results.push({
          appId,
          success: true,
          totalComments: comments.length,
          comments
        });
      } catch (error) {
        errors.push({
          appId,
          success: false,
          error: error.message
        });
      }
    });
    
    await Promise.all(promises);
    
    res.json({
      success: true,
      data: {
        totalApps: appIds.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors,
        metadata: {
          fetchedAt: new Date().toISOString(),
          limit: parseInt(limit),
          sort
        }
      }
    });
    
  } catch (error) {
    console.error('Error in batch comment fetching:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process batch request',
      message: error.message
    });
  }
});

/**
 * @route GET /api/comments/:appId/stats
 * @desc Get comment statistics for a specific app
 * @access Public
 */
router.get('/:appId/stats', validateAppId, async (req, res) => {
  try {
    const { appId } = req.params;
    const { limit = 100 } = req.query;
    
    console.log(`📊 Fetching comment stats for app: ${appId} via API`);
    
    const comments = await fetchComments(appId, {
      limit: parseInt(limit),
      sort: 'recent'
    });
    
    // Calculate statistics
    const stats = {
      totalComments: comments.length,
      ratingDistribution: {},
      dateDistribution: {},
      averageRating: 0,
      totalRating: 0
    };
    
    let totalRating = 0;
    
    comments.forEach(comment => {
      // Rating distribution
      const rating = comment.rating || 0;
      stats.ratingDistribution[rating] = (stats.ratingDistribution[rating] || 0) + 1;
      
      // Date distribution (by month)
      if (comment.date) {
        const month = comment.date.substring(0, 7); // YYYY-MM
        stats.dateDistribution[month] = (stats.dateDistribution[month] || 0) + 1;
      }
      
      totalRating += rating;
    });
    
    stats.averageRating = comments.length > 0 ? (totalRating / comments.length).toFixed(2) : 0;
    stats.totalRating = totalRating;
    
    res.json({
      success: true,
      data: {
        appId,
        stats,
        metadata: {
          fetchedAt: new Date().toISOString(),
          sampleSize: comments.length
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching comment stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comment statistics',
      message: error.message
    });
  }
});

module.exports = router;
