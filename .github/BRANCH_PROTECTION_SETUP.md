# GitHub Branch Protection Setup Guide

This guide helps you configure GitHub branch protection rules to ensure all PRs pass our comprehensive backend tests before merging.

## 🔒 **Recommended Branch Protection Rules**

### For `main` branch:

1. **Go to Repository Settings**
   - Navigate to your repository on GitHub
   - Click **Settings** (tab at the top)
   - Click **Branches** (in the left sidebar)

2. **Add Branch Protection Rule**
   - Click **Add rule**
   - Branch name pattern: `main` (or `master` if that's your default)

3. **Configure Protection Settings**

   ✅ **Require a pull request before merging**
   - ✅ Require approvals: `1` (or more for team review)
   - ✅ Dismiss stale PR approvals when new commits are pushed
   - ✅ Require review from code owners (if you have CODEOWNERS file)

   ✅ **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - **Required status checks:**
     - `Quick Validation`
     - `Backend Validation` 
     - `API Startup Test`
     - `PR Status Check`

   ✅ **Require conversation resolution before merging**

   ✅ **Require signed commits** (optional but recommended)

   ✅ **Include administrators** (applies rules to repo admins too)

   ✅ **Restrict pushes that create files that are larger than 100MB**

4. **Save the Rule**
   - Click **Create** to save the branch protection rule

## 🚦 **Status Checks Explained**

Our workflows provide these status checks:

### **PR Quality Checks** (`.github/workflows/pr-checks.yml`)
- ✅ **Quick Validation**: Package integrity, environment setup
- ✅ **Backend Validation**: All 44 backend tests (unit + integration)
- ✅ **API Startup Test**: Backend startup and health endpoint
- ✅ **PR Status Check**: Overall summary and auto-commenting

### **Backend Tests & Quality Checks** (`.github/workflows/test.yml`)
- ✅ **Backend Tests**: Comprehensive testing on Node.js 18.x and 20.x
- ✅ **API Health Check**: Full startup validation
- ✅ **Test Summary**: Coverage and results summary

## 📋 **What Gets Tested on Each PR**

When someone opens a PR, the following tests run automatically:

### **🔍 Quick Validation**
- Package.json integrity check
- Dependency security audit
- Test script availability
- Test file existence

### **🧪 Backend Tests** (44 total tests)
- **Unit Tests (26 tests)**:
  - JWT Handler (7 tests)
  - Password Hasher (5 tests) 
  - CORS Headers (3 tests)
  - User Normalization (2 tests)
  - Google OAuth (4 tests)
  - Email Service (5 tests)

- **Integration Tests (18 tests)**:
  - Database Operations (6 tests)
  - Authentication Workflows (7 tests)
  - Profile Management (3 tests)
  - Environment Configuration (2 tests)

### **🚀 API Validation**
- Backend startup test
- Health endpoint validation
- Basic API response verification

## 🎯 **Benefits of These Rules**

### **Quality Assurance**
- ✅ No broken code can be merged
- ✅ All authentication features tested
- ✅ Database operations validated
- ✅ API startup confirmed

### **Security**
- ✅ Dependency vulnerability checks
- ✅ Authentication system validation
- ✅ Secure password handling verified
- ✅ JWT token security tested

### **Developer Experience**
- ✅ Immediate feedback on PR quality
- ✅ Clear test results and summaries
- ✅ Automatic status comments on PRs
- ✅ Fast feedback (~3-5 minutes)

### **Production Safety**
- ✅ Serverless deployment compatibility
- ✅ Database integration verified
- ✅ Environment configuration validated
- ✅ Error handling tested

## 🔧 **Environment Variables for CI**

The workflows use these environment variables (automatically set):

```env
DATABASE_URL=postgresql://test_user:test_password@localhost:5432/onlyfur_test
JWT_SECRET=test-jwt-secret-for-pr-validation-32-chars
JWT_REFRESH_SECRET=test-refresh-secret-for-pr-validation
ADMIN_EMAIL=admin@onlyfur.net
ADMIN_PASSWORD=test-admin-password-123
ADMIN_USERNAME=admin
CLIENT_BASE_URL=http://localhost:5174
FROM_EMAIL=noreply@onlyfur.net
SUPPORT_EMAIL=support@onlyfur.net
BCRYPT_ROUNDS=4
NODE_ENV=test
```

## 📊 **Workflow Performance**

- **Quick Validation**: ~30 seconds
- **Backend Tests**: ~2-3 minutes
- **API Startup**: ~30 seconds
- **Total Runtime**: ~3-5 minutes per PR

## 🚨 **Troubleshooting Failed Checks**

### If Backend Tests Fail:
```bash
# Run tests locally to debug
npm run test:backend

# Run specific test suites
npm run test:backend:unit
npm run test:backend:integration

# Check environment variables
npm run env-check
```

### If API Startup Fails:
```bash
# Test backend startup locally
npm run dev:backend:simple

# Check health endpoint
curl http://localhost:3001/api/health

# Check environment configuration
npm run verify
```

### If Quick Validation Fails:
```bash
# Check package integrity
npm audit

# Install dependencies
npm ci

# Verify test files exist
ls tests/backend-*.test.js
```

## 🔄 **Updating Branch Protection**

When adding new tests or changing requirements:

1. Update the workflow files
2. Test changes on a test branch
3. Update branch protection rules to include new status checks
4. Document changes in this file

## 📚 **Additional Resources**

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [OnlyFur Backend Test Documentation](../tests/README.md)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

## ✅ **Quick Setup Checklist**

- [ ] Branch protection rule created for `main`
- [ ] Required status checks configured
- [ ] PR approval requirements set
- [ ] Administrator rules included
- [ ] Conversation resolution required
- [ ] Workflow files committed to `.github/workflows/`
- [ ] Test branch protection with a test PR
- [ ] Document any custom requirements for your team

---

**Need Help?** Check the workflow run logs in the Actions tab of your GitHub repository for detailed error messages and debugging information.
