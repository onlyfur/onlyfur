# OnlyFur Platform Test Suite

This directory contains comprehensive tests for the OnlyFur platform including backend, API, frontend integration, and deployment validation tests.

## ✅ **Test Coverage Overview**

- **Jest Unit Tests** - Testing individual components and utilities
- **Jest Integration Tests** - Testing database operations and complete workflows
- **Manual Backend Tests** - Direct backend functionality validation
- **CORS Configuration Tests** - Cross-origin request validation
- **Contact Form Tests** - HTML form testing
- **API Integration Tests** - End-to-end API testing

## Test Structure

```
tests/
├── api/                          # API-specific tests
│   ├── index.test.js            # Core API endpoint tests
│   ├── helpers.test.js          # Middleware and helper function tests
│   ├── integration.test.js      # End-to-end integration tests
│   └── auth.test.js             # Authentication validation tests
├── backend-unit.test.js         # Backend unit tests (Jest)
├── backend-simple.test.js       # Backend integration tests (Jest)
├── backend-integration.test.js  # Backend integration tests (Jest)
├── backend.test.js              # Manual backend validation (Node.js)
├── cors.test.js                 # CORS configuration testing (Node.js)
├── contact-form*.test.js        # Contact form testing (Jest)
├── contact-form-test.html       # Contact form HTML testing
├── test-auth.js                 # Authentication testing utilities
├── test-password.js             # Password testing utilities
├── run-all-tests.js             # Comprehensive test runner
├── setup.js                     # Jest configuration and test environment
└── README.md                    # This documentation
```

## Running Tests

### Quick Start - Run All Tests
```bash
# Run comprehensive test suite (recommended)
npm run test:all

# This will run all tests in sequence:
# - Jest unit tests
# - Jest integration tests  
# - Manual backend validation
# - CORS configuration testing
# - API endpoint testing
# - Environment validation
# - Health monitoring
```

### Individual Test Commands

#### Jest-based Tests (Unit & Integration)
```bash
# Run all Jest tests
npm test

# Run tests in watch mode (automatically re-run on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only API tests
npm run test:api

# Run backend unit tests only
npm run test:backend:unit

# Run backend integration tests only
npm run test:backend:integration

# Run tests for CI/CD (no watch mode, with coverage)
npm run test:ci
```

#### Manual Tests (Node.js Scripts)
```bash
# Test backend functionality manually
npm run test:backend:manual

# Test CORS configuration
npm run test:cors
```

#### Utility Tests
```bash
# Check environment configuration
npm run env-check

# Run health monitoring
npm run health-check
```

## Test Categories

### Jest-based Tests

#### 1. Backend Unit Tests (`backend-unit.test.js`)
- **Component Testing**: Individual function and class testing
- **Utility Testing**: Helper functions, formatters, validators
- **CORS Testing**: Cross-origin request configuration
- **JWT Testing**: Token generation and validation
- **Environment Testing**: Configuration validation

#### 2. Backend Integration Tests (`backend-integration.test.js` & `backend-simple.test.js`)
- **Database Operations**: CRUD operations, connections
- **Authentication Flow**: Complete login/register workflows  
- **Route Integration**: End-to-end route testing
- **Error Handling**: Error scenarios and edge cases

#### 3. API Tests (`api/`)
- **Endpoint Testing**: All API routes and responses
- **Authentication Testing**: Login, registration, tokens
- **Middleware Testing**: CORS, rate limiting, validation
- **Integration Testing**: Complete user workflows

#### 4. Contact Form Tests (`contact-form*.test.js`)
- **Form Validation**: Input validation and sanitization
- **Email Integration**: Email sending functionality
- **Error Handling**: Form submission error scenarios

### Manual Tests (Node.js Scripts)

#### 5. Backend Validation (`backend.test.js`)
- **Database Connection**: Real database connectivity testing
- **Route Creation**: Dynamic route generation validation
- **Environment Setup**: Required environment variables check
- **Service Health**: Overall backend health validation

#### 6. CORS Configuration (`cors.test.js`)
- **Origin Testing**: Tests multiple allowed origins
- **Header Validation**: CORS header correctness
- **Endpoint Testing**: CORS on different API endpoints
- **Production Testing**: Tests against live Vercel deployment

### HTML Tests

#### 7. Contact Form HTML (`contact-form-test.html`)
- **Visual Testing**: Manual form testing in browser
- **JavaScript Testing**: Frontend form validation
- **Integration Testing**: Form submission to backend
- **UI/UX Testing**: User experience validation

### Utility Scripts

#### 8. Authentication Utilities (`test-auth.js`, `test-password.js`)
- **Password Testing**: Password hashing and validation
- **Token Testing**: JWT token utilities
- **Session Testing**: Session management validation

## Test Environment

Tests run in a controlled environment with:
- **Environment**: `NODE_ENV=test`
- **Isolated Server**: Each test suite starts its own server instance
- **Mock Database**: Uses test database URL (doesn't connect to real DB)
- **Console Management**: Optionally suppresses console output for cleaner test output

## Coverage Reports

Coverage reports are generated in the `coverage/` directory and include:
- **Text Report**: Displays in terminal
- **HTML Report**: Open `coverage/lcov-report/index.html` in browser
- **LCOV Report**: For CI/CD integration

## Writing New Tests

### Test File Structure

```javascript
const request = require('supertest');
const app = require('../../api/index.js');

describe('Your Test Suite', () => {
  describe('Feature Group', () => {
    test('should do something specific', async () => {
      const response = await request(app)
        .get('/api/endpoint')
        .expect(200);

      expect(response.body).toMatchObject({
        expected: 'structure'
      });
    });
  });
});
```

### Best Practices

1. **Descriptive Test Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
3. **Independent Tests**: Each test should be independent and not rely on others
4. **Error Testing**: Test both success and failure scenarios
5. **Performance Considerations**: Include response time assertions where appropriate

### Common Test Patterns

```javascript
// Testing successful responses
await request(app)
  .get('/api/endpoint')
  .expect('Content-Type', /json/)
  .expect(200);

// Testing POST requests with data
await request(app)
  .post('/api/endpoint')
  .send({ data: 'value' })
  .expect(200);

// Testing error responses
await request(app)
  .get('/api/nonexistent')
  .expect(404);

// Testing response structure
expect(response.body).toMatchObject({
  success: true,
  data: expect.any(Array)
});

// Testing response time
const start = Date.now();
await request(app).get('/api/endpoint');
const duration = Date.now() - start;
expect(duration).toBeLessThan(1000);
```

## Continuous Integration

Tests are configured to run in CI/CD with:
- No watch mode
- Coverage reporting
- Exit on completion
- Proper error codes for build failure

Use `npm run test:ci` for CI/CD environments.

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Tests use dynamic ports to avoid conflicts
2. **Async Operations**: All tests use proper async/await patterns
3. **Server Cleanup**: Servers are properly closed after tests
4. **Environment Variables**: Test environment is isolated

### Debug Mode

To see detailed output during tests:
1. Uncomment console restoration in `setup.js`
2. Add `--verbose` flag to jest commands
3. Use `console.log` in tests for debugging

### Test Failures

If tests fail:
1. Check that the API server starts correctly
2. Verify all dependencies are installed
3. Ensure no other services are using test ports
4. Check environment variable configuration

## Performance Benchmarks

Current performance expectations:
- Health checks: < 1 second
- Auth endpoints: < 2 seconds  
- Concurrent requests: 10+ without degradation
- Average response time: < 500ms under normal load

## Test Results Summary

**Total Test Coverage:**
- **74 total tests** across 4 test suites
- **Mock API Tests**: 44 tests (index, helpers, integration)
- **Real Auth Tests**: 30 tests (credential validation)
- **All tests passing** ✅

**Real Authentication Testing:**
- ✅ **Login only works for valid users in database**
- ✅ **Password validation using bcrypt hashing**
- ✅ **Rejects non-existent users**
- ✅ **Rejects wrong passwords**
- ✅ **Handles inactive accounts**
- ✅ **JWT token generation and validation**
- ✅ **SQL injection protection**
- ✅ **Case-insensitive email/username lookup**
- ✅ **Password security (no exposure in responses)**
