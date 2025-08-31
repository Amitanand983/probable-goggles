/**
 * Example usage of Google Play Store Comments Scraper API
 * This file demonstrates how to use the API programmatically
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const TEST_APP_IDS = [
  'com.whatsapp',           // WhatsApp
  'com.instagram.android',  // Instagram
  'com.twitter.android',    // Twitter
  'com.facebook.katana',    // Facebook
  'com.google.android.youtube' // YouTube
];

/**
 * Helper function to make API requests
 */
async function makeApiRequest(method, endpoint, data = null) {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

/**
 * Example 1: Get comments for a single app
 */
async function getSingleAppComments() {
  console.log('📱 Example 1: Getting comments for WhatsApp...\n');
  
  const result = await makeApiRequest('GET', '/api/comments/com.whatsapp?limit=10&sort=rating');
  
  if (result.success) {
    console.log(`✅ Success! Retrieved ${result.data.data.totalComments} comments`);
    console.log(`📊 App ID: ${result.data.data.appId}`);
    console.log(`🔢 Comments retrieved: ${result.data.data.comments.length}`);
    
    // Display first few comments
    if (result.data.data.comments.length > 0) {
      console.log('\n📝 Sample Comments:');
      result.data.data.comments.slice(0, 3).forEach((comment, index) => {
        console.log(`\n   Comment ${index + 1}:`);
        console.log(`   Rating: ${'⭐'.repeat(comment.rating)} (${comment.rating}/5)`);
        console.log(`   Author: ${comment.author}`);
        console.log(`   Date: ${comment.date}`);
        console.log(`   Text: ${comment.text.substring(0, 100)}${comment.text.length > 100 ? '...' : ''}`);
        console.log(`   Helpful: ${comment.helpful} people found this helpful`);
      });
    }
  } else {
    console.log(`❌ Failed to get comments: ${result.error.error || result.error}`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Example 2: Get comment statistics for an app
 */
async function getCommentStatistics() {
  console.log('📊 Example 2: Getting comment statistics for Instagram...\n');
  
  const result = await makeApiRequest('GET', '/api/comments/com.instagram.android/stats?limit=50');
  
  if (result.success) {
    const stats = result.data.data.stats;
    console.log(`✅ Success! Retrieved statistics for ${stats.totalComments} comments`);
    console.log(`📱 App ID: ${result.data.data.appId}`);
    console.log(`📈 Average Rating: ${stats.averageRating}/5`);
    console.log(`🔢 Total Rating: ${stats.totalRating}`);
    
    // Display rating distribution
    if (stats.ratingDistribution) {
      console.log('\n📊 Rating Distribution:');
      Object.keys(stats.ratingDistribution).sort().forEach(rating => {
        const count = stats.ratingDistribution[rating];
        const percentage = ((count / stats.totalComments) * 100).toFixed(1);
        const stars = '⭐'.repeat(parseInt(rating));
        console.log(`   ${stars} (${rating}/5): ${count} comments (${percentage}%)`);
      });
    }
    
    // Display date distribution
    if (stats.dateDistribution) {
      console.log('\n📅 Date Distribution (Last 3 months):');
      const sortedDates = Object.keys(stats.dateDistribution).sort().reverse();
      sortedDates.slice(0, 3).forEach(date => {
        const count = stats.dateDistribution[date];
        console.log(`   ${date}: ${count} comments`);
      });
    }
  } else {
    console.log(`❌ Failed to get statistics: ${result.error.error || result.error}`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Example 3: Batch processing multiple apps
 */
async function batchProcessApps() {
  console.log('🔄 Example 3: Batch processing multiple apps...\n');
  
  const batchData = {
    appIds: TEST_APP_IDS.slice(0, 3), // Process first 3 apps
    limit: 5, // Get 5 comments per app
    sort: 'recent'
  };
  
  console.log(`📱 Processing ${batchData.appIds.length} apps: ${batchData.appIds.join(', ')}`);
  console.log(`🔢 Comments per app: ${batchData.limit}`);
  console.log(`📊 Sort order: ${batchData.sort}\n`);
  
  const result = await makeApiRequest('POST', '/api/comments/batch', batchData);
  
  if (result.success) {
    const data = result.data.data;
    console.log(`✅ Success! Batch processing completed`);
    console.log(`📊 Total apps processed: ${data.totalApps}`);
    console.log(`✅ Successful: ${data.successful}`);
    console.log(`❌ Failed: ${data.failed}`);
    
    // Display results for each app
    if (data.results && data.results.length > 0) {
      console.log('\n📱 Results by App:');
      data.results.forEach(appResult => {
        console.log(`\n   App: ${appResult.appId}`);
        console.log(`   Comments retrieved: ${appResult.totalComments}`);
        if (appResult.comments.length > 0) {
          const firstComment = appResult.comments[0];
          console.log(`   Sample comment: "${firstComment.text.substring(0, 80)}..."`);
          console.log(`   Rating: ${'⭐'.repeat(firstComment.rating)} (${firstComment.rating}/5)`);
        }
      });
    }
    
    // Display any errors
    if (data.errors && data.errors.length > 0) {
      console.log('\n⚠️ Errors encountered:');
      data.errors.forEach(error => {
        console.log(`   ${error.appId}: ${error.error}`);
      });
    }
  } else {
    console.log(`❌ Failed to process batch: ${result.error.error || result.error}`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Example 4: Error handling and validation
 */
async function demonstrateErrorHandling() {
  console.log('⚠️ Example 4: Demonstrating error handling...\n');
  
  // Test 1: Invalid app ID
  console.log('1. Testing invalid app ID...');
  const invalidAppResult = await makeApiRequest('GET', '/api/comments/invalid..app..id');
  if (!invalidAppResult.success && invalidAppResult.status === 400) {
    console.log('✅ Correctly rejected invalid app ID');
    console.log(`   Error: ${invalidAppResult.error.error}`);
  } else {
    console.log('❌ Should have rejected invalid app ID');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 2: Invalid limit parameter
  console.log('\n2. Testing invalid limit parameter...');
  const invalidLimitResult = await makeApiRequest('GET', '/api/comments/com.whatsapp?limit=999');
  if (!invalidLimitResult.success && invalidLimitResult.status === 400) {
    console.log('✅ Correctly rejected invalid limit parameter');
    console.log(`   Error: ${invalidLimitResult.error.error}`);
  } else {
    console.log('❌ Should have rejected invalid limit parameter');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test 3: Non-existent endpoint
  console.log('\n3. Testing non-existent endpoint...');
  const notFoundResult = await makeApiRequest('GET', '/api/nonexistent');
  if (!notFoundResult.success && notFoundResult.status === 404) {
    console.log('✅ Correctly returned 404 for non-existent endpoint');
  } else {
    console.log('❌ Should have returned 404');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Example 5: Performance monitoring
 */
async function monitorPerformance() {
  console.log('⚡ Example 5: Performance monitoring...\n');
  
  const testAppId = 'com.whatsapp';
  const iterations = 3;
  const results = [];
  
  console.log(`🔄 Running ${iterations} performance tests for app: ${testAppId}`);
  
  for (let i = 0; i < iterations; i++) {
    console.log(`\n   Test ${i + 1}/${iterations}...`);
    
    const startTime = Date.now();
    const result = await makeApiRequest('GET', `/api/comments/${testAppId}?limit=10`);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (result.success) {
      const commentCount = result.data.data.totalComments;
      console.log(`   ✅ Success in ${duration}ms - ${commentCount} comments retrieved`);
      results.push({ duration, commentCount, success: true });
    } else {
      console.log(`   ❌ Failed in ${duration}ms - ${result.error.error || result.error}`);
      results.push({ duration, success: false });
    }
    
    // Wait between requests to avoid rate limiting
    if (i < iterations - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Calculate performance metrics
  const successfulResults = results.filter(r => r.success);
  if (successfulResults.length > 0) {
    const avgDuration = successfulResults.reduce((sum, r) => sum + r.duration, 0) / successfulResults.length;
    const avgComments = successfulResults.reduce((sum, r) => sum + r.commentCount, 0) / successfulResults.length;
    
    console.log('\n📊 Performance Summary:');
    console.log(`   Successful requests: ${successfulResults.length}/${iterations}`);
    console.log(`   Average response time: ${avgDuration.toFixed(0)}ms`);
    console.log(`   Average comments retrieved: ${avgComments.toFixed(0)}`);
    console.log(`   Success rate: ${((successfulResults.length / iterations) * 100).toFixed(1)}%`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Main function to run all examples
 */
async function runAllExamples() {
  console.log('🚀 Google Play Store Comments Scraper API - Example Usage\n');
  console.log('This script demonstrates various ways to use the API.\n');
  console.log('Make sure the server is running on http://localhost:3000\n');
  
  try {
    // Check if server is running
    const healthCheck = await makeApiRequest('GET', '/health');
    if (!healthCheck.success) {
      console.log('❌ Server is not running or not accessible');
      console.log('Please start the server first: npm start');
      return;
    }
    
    console.log('✅ Server is running and accessible\n');
    
    // Run examples
    await getSingleAppComments();
    await getCommentStatistics();
    await batchProcessApps();
    await demonstrateErrorHandling();
    await monitorPerformance();
    
    console.log('🎉 All examples completed successfully!');
    console.log('\n💡 Tips for production use:');
    console.log('- Implement proper error handling and retry logic');
    console.log('- Add request rate limiting to avoid overwhelming the API');
    console.log('- Cache results when appropriate');
    console.log('- Monitor API response times and success rates');
    console.log('- Handle network timeouts and connection errors gracefully');
    
  } catch (error) {
    console.error('❌ Error running examples:', error.message);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(error => {
    console.error('❌ Example execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = {
  makeApiRequest,
  getSingleAppComments,
  getCommentStatistics,
  batchProcessApps,
  demonstrateErrorHandling,
  monitorPerformance,
  runAllExamples
};
