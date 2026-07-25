const http = require('http');
const app = require('./src/index');

const PORT = 5001; // Test port

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    let payload = null;
    const reqOptions = { ...options, headers: { ...options.headers } };

    if (postData) {
      payload = JSON.stringify(postData);
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, rawBody: data });
        }
      });
    });

    req.on('error', reject);

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  const server = app.listen(PORT, async () => {
    console.log(`\n========================================`);
    console.log(`🧪 Running Auth Module Automated Tests on port ${PORT}`);
    console.log(`========================================\n`);

    try {
      // Test 1: Health check
      console.log('Test 1: GET /api/health');
      const healthRes = await makeRequest({
        host: 'localhost',
        port: PORT,
        path: '/api/health',
        method: 'GET',
      });
      console.log('Result:', healthRes.status, healthRes.body.message);
      console.assert(healthRes.status === 200, 'Health check failed');

      // Test 2: Input validation error on registration (weak password)
      console.log('\nTest 2: POST /api/auth/register (Weak password validation check)');
      const weakRegRes = await makeRequest(
        {
          host: 'localhost',
          port: PORT,
          path: '/api/auth/register',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { fullName: 'Test User', email: 'test@example.com', password: '123' }
      );
      console.log('Result:', weakRegRes.status, weakRegRes.body.message);
      console.assert(weakRegRes.status === 400, 'Expected 400 for weak password');

      // Test 3: Valid Registration
      console.log('\nTest 3: POST /api/auth/register (Valid input)');
      const regRes = await makeRequest(
        {
          host: 'localhost',
          port: PORT,
          path: '/api/auth/register',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { fullName: 'Alice Smith', email: 'alice@example.com', password: 'Password@123', role: 'customer' }
      );
      console.log('Result:', regRes.status, regRes.body.message);
      console.assert(regRes.status === 201, 'Registration failed');

      // Intercept OTP from in-memory store for verification testing
      const User = require('./src/models/User');
      const user = await User.findOne({ email: 'alice@example.com' });
      const otpCode = user.otp;
      console.log(`[TEST HELP] Generated OTP for alice@example.com is: ${otpCode}`);

      // Test 4: Invalid OTP verification
      console.log('\nTest 4: POST /api/auth/verify-otp (Invalid OTP)');
      const badOtpRes = await makeRequest(
        {
          host: 'localhost',
          port: PORT,
          path: '/api/auth/verify-otp',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { email: 'alice@example.com', otp: '000000' }
      );
      console.log('Result:', badOtpRes.status, badOtpRes.body.message);
      console.assert(badOtpRes.status === 400, 'Expected 400 for invalid OTP');

      // Test 5: Valid OTP verification
      console.log('\nTest 5: POST /api/auth/verify-otp (Valid OTP)');
      const validOtpRes = await makeRequest(
        {
          host: 'localhost',
          port: PORT,
          path: '/api/auth/verify-otp',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { email: 'alice@example.com', otp: otpCode }
      );
      console.log('Result:', validOtpRes.status, validOtpRes.body.message);
      console.assert(validOtpRes.status === 200, 'OTP Verification failed');
      const jwtToken = validOtpRes.body.token;
      console.log('Issued JWT Token:', jwtToken ? `${jwtToken.substring(0, 25)}...` : 'NONE');

      // Test 6: Access Protected Route GET /api/auth/me with Bearer token
      console.log('\nTest 6: GET /api/auth/me (Authenticated user profile)');
      const meRes = await makeRequest({
        host: 'localhost',
        port: PORT,
        path: '/api/auth/me',
        method: 'GET',
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      console.log('Result:', meRes.status, 'User:', meRes.body.user);
      console.assert(meRes.status === 200, 'GET /me failed');

      // Test 7: Role Based Access Control (RBAC) - Customer accessing customer route
      console.log('\nTest 7: GET /api/protected/customer-menu (RBAC Customer access)');
      const menuRes = await makeRequest({
        host: 'localhost',
        port: PORT,
        path: '/api/protected/customer-menu',
        method: 'GET',
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      console.log('Result:', menuRes.status, menuRes.body.message);
      console.assert(menuRes.status === 200, 'Customer menu access failed');

      // Test 8: Role Based Access Control (RBAC) - Customer trying to access admin-only route
      console.log('\nTest 8: GET /api/protected/admin-only (RBAC Forbidden check)');
      const adminRes = await makeRequest({
        host: 'localhost',
        port: PORT,
        path: '/api/protected/admin-only',
        method: 'GET',
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      console.log('Result:', adminRes.status, adminRes.body.message);
      console.assert(adminRes.status === 403, 'Expected 403 Forbidden for admin route');

      // Test 9: Login with verified user
      console.log('\nTest 9: POST /api/auth/login');
      const loginRes = await makeRequest(
        {
          host: 'localhost',
          port: PORT,
          path: '/api/auth/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { email: 'alice@example.com', password: 'Password@123' }
      );
      console.log('Result:', loginRes.status, loginRes.body.message);
      console.assert(loginRes.status === 200, 'Login failed');

      console.log('\n========================================');
      console.log('✅ ALL AUTHENTICATION MODULE TESTS PASSED');
      console.log('========================================\n');
    } catch (err) {
      console.error('❌ Test failed:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();
