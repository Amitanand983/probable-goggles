/**
 * Configuration file for Google Play Store Comments Scraper
 */

require('dotenv').config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },

  // Google Play Store configuration
  playStore: {
    baseUrl: 'https://play.google.com',
    userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    language: process.env.LANGUAGE || 'en',
    country: process.env.COUNTRY || 'US',
    requestDelay: parseInt(process.env.REQUEST_DELAY) || 1000, // milliseconds
    timeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000, // milliseconds
    maxRedirects: parseInt(process.env.MAX_REDIRECTS) || 5
  },

  // Scraping configuration
  scraping: {
    maxCommentsPerRequest: parseInt(process.env.MAX_COMMENTS_PER_REQUEST) || 200,
    maxBatchApps: parseInt(process.env.MAX_BATCH_APPS) || 10,
    defaultCommentLimit: parseInt(process.env.DEFAULT_COMMENT_LIMIT) || 50,
    enableFallbackParsing: process.env.ENABLE_FALLBACK_PARSING !== 'false',
    retryAttempts: parseInt(process.env.RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 2000
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // requests per window
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.'
  },

  // Security configuration
  security: {
    enableCors: process.env.ENABLE_CORS !== 'false',
    enableHelmet: process.env.ENABLE_HELMET !== 'false',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsoleLogging: process.env.ENABLE_CONSOLE_LOGGING !== 'false',
    enableFileLogging: process.env.ENABLE_FILE_LOGGING === 'true',
    logFilePath: process.env.LOG_FILE_PATH || './logs/app.log'
  },

  // Cache configuration (for future implementation)
  cache: {
    enableCache: process.env.ENABLE_CACHE === 'true',
    cacheTTL: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour in seconds
    maxCacheSize: parseInt(process.env.MAX_CACHE_SIZE) || 100 // maximum cached items
  }
};

module.exports = config;
