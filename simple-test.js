const axios = require('axios');

async function simpleTest() {
  try {
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('Health response:', healthResponse.status, healthResponse.data);
    
    console.log('\nTesting root endpoint...');
    const rootResponse = await axios.get('http://localhost:3000/');
    console.log('Root response:', rootResponse.status, rootResponse.data);
    
    console.log('\nTesting comments endpoint...');
    const commentsResponse = await axios.get('http://localhost:3000/api/comments/com.whatsapp?limit=3');
    console.log('Comments response:', commentsResponse.status, commentsResponse.data);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

simpleTest();
