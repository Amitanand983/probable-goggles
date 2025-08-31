/**
 * Validation middleware for the Google Play Store Comments API
 */

/**
 * Validate Google Play Store app ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateAppId = (req, res, next) => {
  const { appId } = req.params;
  
  if (!appId) {
    return res.status(400).json({
      success: false,
      error: 'App ID is required'
    });
  }
  
  // Google Play Store app IDs typically follow this pattern:
  // - Start with a letter or number
  // - Can contain letters, numbers, dots, and underscores
  // - Usually 3-100 characters long
  const appIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,99}$/;
  
  if (!appIdPattern.test(appId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid app ID format',
      message: 'App ID should contain only letters, numbers, dots, underscores, and hyphens, starting with a letter or number'
    });
  }
  
  // Check for common invalid patterns
  if (appId.includes('..') || appId.includes('__') || appId.includes('--')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid app ID format',
      message: 'App ID cannot contain consecutive dots, underscores, or hyphens'
    });
  }
  
  next();
};

/**
 * Validate query parameters for comment fetching
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateCommentParams = (req, res, next) => {
  const { limit, sort } = req.query;
  
  // Validate limit parameter
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 200) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit parameter',
        message: 'Limit must be a number between 1 and 200'
      });
    }
  }
  
  // Validate sort parameter
  if (sort !== undefined) {
    const validSortOptions = ['recent', 'rating', 'helpfulness'];
    if (!validSortOptions.includes(sort)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sort parameter',
        message: `Sort must be one of: ${validSortOptions.join(', ')}`
      });
    }
  }
  
  next();
};

/**
 * Validate batch request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateBatchRequest = (req, res, next) => {
  const { appIds, limit, sort } = req.body;
  
  // Validate appIds array
  if (!appIds || !Array.isArray(appIds)) {
    return res.status(400).json({
      success: false,
      error: 'appIds must be an array'
    });
  }
  
  if (appIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'appIds array cannot be empty'
    });
  }
  
  if (appIds.length > 10) {
    return res.status(400).json({
      success: false,
      error: 'Maximum 10 apps allowed per batch request'
    });
  }
  
  // Validate each app ID in the array
  const appIdPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,99}$/;
  for (let i = 0; i < appIds.length; i++) {
    const appId = appIds[i];
    
    if (typeof appId !== 'string' || !appId.trim()) {
      return res.status(400).json({
        success: false,
        error: `Invalid app ID at index ${i}`,
        message: 'App ID must be a non-empty string'
      });
    }
    
    if (!appIdPattern.test(appId.trim())) {
      return res.status(400).json({
        success: false,
        error: `Invalid app ID format at index ${i}`,
        message: 'App ID should contain only letters, numbers, dots, underscores, and hyphens, starting with a letter or number'
      });
    }
    
    // Check for common invalid patterns
    if (appId.includes('..') || appId.includes('__') || appId.includes('--')) {
      return res.status(400).json({
        success: false,
        error: `Invalid app ID format at index ${i}`,
        message: 'App ID cannot contain consecutive dots, underscores, or hyphens'
      });
    }
  }
  
  // Validate limit parameter
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid limit parameter',
        message: 'Limit must be a number between 1 and 100 for batch requests'
      });
    }
  }
  
  // Validate sort parameter
  if (sort !== undefined) {
    const validSortOptions = ['recent', 'rating', 'helpfulness'];
    if (!validSortOptions.includes(sort)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sort parameter',
        message: `Sort must be one of: ${validSortOptions.join(', ')}`
      });
    }
  }
  
  next();
};

module.exports = {
  validateAppId,
  validateCommentParams,
  validateBatchRequest
};
