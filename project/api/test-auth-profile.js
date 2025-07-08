const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3001';
const PROFILE_ENDPOINT = '/api/auth/profile';

// Test token (replace with actual token from login/register)
const VALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImtsaWplbnQiLCJpYXQiOjE3MzQ5NjgwMDAsImV4cCI6MTczNTA1NDQwMH0.example-signature";

// Test functions
async function testValidToken() {
  console.log('\n🧪 Test 1: Valid Token');
  console.log('=' .repeat(50));
  
  try {
    const response = await axios.get(`${BASE_URL}${PROFILE_ENDPOINT}`, {
      headers: {
        'Authorization': `Bearer ${VALID_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Status:', response.status);
    console.log('✅ Response:', JSON.stringify(response.data, null, 2));

    // Validate response structure
    if (response.data.success && response.data.data && response.data.data.user) {
      const user = response.data.data.user;
      const requiredFields = ['id', 'name', 'email', 'role'];
      
      console.log('\n📋 Validating user fields:');
      requiredFields.forEach(field => {
        if (user.hasOwnProperty(field)) {
          console.log(`✅ ${field}: ${user[field]}`);
        } else {
          console.log(`❌ Missing field: ${field}`);
        }
      });

      if (user.phone !== undefined) {
        console.log(`✅ phone: ${user.phone}`);
      }
    } else {
      console.log('❌ Invalid response structure');
    }

  } catch (error) {
    console.log('❌ Error:', error.response ? error.response.data : error.message);
  }
}

async function testMissingToken() {
  console.log('\n🧪 Test 2: Missing Token');
  console.log('=' .repeat(50));
  
  try {
    const response = await axios.get(`${BASE_URL}${PROFILE_ENDPOINT}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ Unexpected success:', response.status);
    console.log('Response:', response.data);

  } catch (error) {
    if (error.response) {
      console.log('✅ Expected error status:', error.response.status);
      console.log('✅ Error message:', error.response.data.message);
      
      if (error.response.status === 401 && 
          error.response.data.message === 'Token je potreban za pristup') {
        console.log('✅ Correct error message for missing token');
      } else {
        console.log('❌ Unexpected error message');
      }
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

async function testInvalidToken() {
  console.log('\n🧪 Test 3: Invalid Token');
  console.log('=' .repeat(50));
  
  const invalidToken = "invalid.token.here";
  
  try {
    const response = await axios.get(`${BASE_URL}${PROFILE_ENDPOINT}`, {
      headers: {
        'Authorization': `Bearer ${invalidToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ Unexpected success:', response.status);
    console.log('Response:', response.data);

  } catch (error) {
    if (error.response) {
      console.log('✅ Expected error status:', error.response.status);
      console.log('✅ Error message:', error.response.data.message);
      
      if (error.response.status === 401 && 
          error.response.data.message === 'Neispravan token') {
        console.log('✅ Correct error message for invalid token');
      } else {
        console.log('❌ Unexpected error message');
      }
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

async function testMalformedToken() {
  console.log('\n🧪 Test 4: Malformed Authorization Header');
  console.log('=' .repeat(50));
  
  try {
    const response = await axios.get(`${BASE_URL}${PROFILE_ENDPOINT}`, {
      headers: {
        'Authorization': 'InvalidFormat token',
        'Content-Type': 'application/json'
      }
    });

    console.log('❌ Unexpected success:', response.status);
    console.log('Response:', response.data);

  } catch (error) {
    if (error.response) {
      console.log('✅ Expected error status:', error.response.status);
      console.log('✅ Error message:', error.response.data.message);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Auth Profile Endpoint Tests');
  console.log('=' .repeat(60));
  console.log(`📍 Testing endpoint: ${BASE_URL}${PROFILE_ENDPOINT}`);
  console.log(`🔑 Using token: ${VALID_TOKEN.substring(0, 50)}...`);
  
  try {
    await testValidToken();
    await testMissingToken();
    await testInvalidToken();
    await testMalformedToken();
    
    console.log('\n🎉 All tests completed!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Test runner error:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testValidToken,
  testMissingToken,
  testInvalidToken,
  testMalformedToken,
  runAllTests
}; 