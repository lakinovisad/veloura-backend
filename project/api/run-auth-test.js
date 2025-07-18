const { runAllTests } = require('./test-auth-profile');

console.log('🔧 Auth Profile Endpoint Test Runner');
console.log('=' .repeat(50));
console.log('');
console.log('📋 Instructions:');
console.log('1. Make sure your server is running on http://localhost:3001');
console.log('2. Get a valid token by:');
console.log('   - Registering a new user: POST /api/auth/register');
console.log('   - Or logging in: POST /api/auth/login');
console.log('3. Replace the VALID_TOKEN in test-auth-profile.js with your actual token');
console.log('4. Run this test: node run-auth-test.js');
console.log('');
console.log('🚀 Starting tests in 3 seconds...');

setTimeout(() => {
  runAllTests();
}, 3000); 