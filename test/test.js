/**
 * Basic test suite for Google Play Store Comments Scraper API
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_APP_ID = 'com.whatsapp'; // WhatsApp as test app

// Test configuration
const config = {
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Test helper functions
 */
const testHelpers = {
  async makeRequest(method, endpoint, data = null) {
    try {
      console.log(`   Making ${method} request to ${endpoint}`);
      
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
        ...config
      });
      
      console.log(`   Response status: ${response.status}`);
      console.log(`   Response data type: ${typeof response.data}`);
      
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      console.log(`   Request failed: ${error.message}`);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        console.log(`   Error response status: ${error.response.status}`);
        console.log(`   Error response data:`, error.response.data);
        
        try {
          const errorData = error.response.data;
          return { 
            success: false, 
            error: errorData, 
            status: error.response.status 
          };
        } catch (parseError) {
          console.log(`   Error parsing error response: ${parseError.message}`);
          return { 
            success: false, 
            error: { error: 'Invalid response format', message: error.response.statusText }, 
            status: error.response.status 
          };
        }
      } else if (error.request) {
        // Request was made but no response received
        console.log(`   No response received`);
        return { 
          success: false, 
          error: { error: 'No response received', message: 'Request timeout or network error' }, 
          status: 0 
        };
      } else {
        // Something else happened
        console.log(`   Other error: ${error.message}`);
        return { 
          success: false, 
          error: { error: 'Request failed', message: error.message }, 
          status: 0 
        };
      }
    }
  },

  logTestResult(testName, result) {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
    if (!result.success) {
      console.log(`   Status: ${result.status}`);
      if (result.error && typeof result.error === 'object') {
        console.log(`   Error: ${result.error.error || 'Unknown error'}`);
        if (result.error.message) {
          console.log(`   Message: ${result.error.message}`);
        }
      } else {
        console.log(`   Error: ${result.error}`);
      }
    }
  },

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

/**
 * Test suite
 */
async function runTests() {
  console.log('🧪 Starting Google Play Store Comments Scraper API Tests\n');
  
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Health Check
  totalTests++;
  console.log('1. Testing Health Check Endpoint...');
  const healthResult = await testHelpers.makeRequest('GET', '/health');
  testHelpers.logTestResult('Health Check', healthResult);
  if (healthResult.success) passedTests++;
  
  await testHelpers.delay(1000);

  // Test 2: Root Endpoint
  totalTests++;
  console.log('\n2. Testing Root Endpoint...');
  const rootResult = await testHelpers.makeRequest('GET', '/');
  testHelpers.logTestResult('Root Endpoint', rootResult);
  if (rootResult.success) passedTests++;
  
  await testHelpers.delay(1000);

  // Test 3: Single App Comments (with limit)
  totalTests++;
  console.log('\n3. Testing Single App Comments Endpoint...');
  const commentsResult = await testHelpers.makeRequest('GET', `/api/comments/${TEST_APP_ID}?limit=5`);
  testHelpers.logTestResult('Single App Comments', commentsResult);
  if (commentsResult.success) passedTests++;
  
  await testHelpers.delay(2000);

  // Test 4: Comment Statistics
  totalTests++;
  console.log('\n4. Testing Comment Statistics Endpoint...');
  const statsResult = await testHelpers.makeRequest('GET', `/api/comments/${TEST_APP_ID}/stats?limit=10`);
  testHelpers.logTestResult('Comment Statistics', statsResult);
  if (statsResult.success) passedTests++;
  
  await testHelpers.delay(2000);

  // Test 5: Batch Comments
  totalTests++;
  console.log('\n5. Testing Batch Comments Endpoint...');
  const batchData = {
    appIds: [TEST_APP_ID, 'com.instagram.android'],
    limit: 3,
    sort: 'recent'
  };
  const batchResult = await testHelpers.makeRequest('POST', '/api/comments/batch', batchData);
  testHelpers.logTestResult('Batch Comments', batchResult);
  if (batchResult.success) passedTests++;
  
  await testHelpers.delay(2000);

  // Test 6: Invalid App ID
  totalTests++;
  console.log('\n6. Testing Invalid App ID Validation...');
  const invalidAppResult = await testHelpers.makeRequest('GET', '/api/comments/invalid..app..id');
  testHelpers.logTestResult('Invalid App ID Validation', { 
    success: !invalidAppResult.success && invalidAppResult.status === 400,
    error: invalidAppResult.error
  });
  if (!invalidAppResult.success && invalidAppResult.status === 400) passedTests++;
  
  await testHelpers.delay(1000);

  // Test 7: Invalid Limit Parameter
  totalTests++;
  console.log('\n7. Testing Invalid Limit Parameter...');
  const invalidLimitResult = await testHelpers.makeRequest('GET', `/api/comments/${TEST_APP_ID}?limit=999`);
  testHelpers.logTestResult('Invalid Limit Parameter', { 
    success: !invalidLimitResult.success && invalidLimitResult.status === 400,
    error: invalidLimitResult.error
  });
  if (!invalidLimitResult.success && invalidLimitResult.status === 400) passedTests++;
  
  await testHelpers.delay(1000);

  // Test 8: Non-existent Endpoint
  totalTests++;
  console.log('\n8. Testing Non-existent Endpoint...');
  const notFoundResult = await testHelpers.makeRequest('GET', '/api/nonexistent');
  testHelpers.logTestResult('Non-existent Endpoint', { 
    success: !notFoundResult.success && notFoundResult.status === 404,
    error: notFoundResult.error
  });
  if (!notFoundResult.success && notFoundResult.status === 404) passedTests++;

  // Test Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  console.log('='.repeat(50));
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the output above for details.');
  }
  
  console.log('\n💡 Tips:');
  console.log('- Make sure the server is running on port 3000');
  console.log('- Check your internet connection');
  console.log('- Verify that Google Play Store is accessible');
  console.log('- Some tests may fail due to rate limiting or network issues');
}

/**
 * Run tests if this file is executed directly
 */
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runTests, testHelpers };
