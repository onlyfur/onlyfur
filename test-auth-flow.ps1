# PowerShell script to test authentication flow
Write-Host "Testing OnlyFur Authentication Flow" -ForegroundColor Green

# Test 1: Check if backend is running
Write-Host "`n1. Testing backend health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET
    Write-Host "✅ Backend is running - Status: $($healthResponse.StatusCode)" -ForegroundColor Green
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "   Environment: $($healthData.environment)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Try to login with test credentials
Write-Host "`n2. Testing login with test credentials..." -ForegroundColor Yellow
$loginData = @{
    email = "test@example.com"
    password = "any-password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Login successful - Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginResult.success -and $loginResult.token) {
        Write-Host "   Token received: $($loginResult.token.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host "   User: $($loginResult.user.email)" -ForegroundColor Gray
        
        # Store token for next test
        $global:authToken = $loginResult.token
        
        # Test 3: Make authenticated request
        Write-Host "`n3. Testing authenticated request..." -ForegroundColor Yellow
        $headers = @{
            "Authorization" = "Bearer $($loginResult.token)"
            "Content-Type" = "application/json"
        }
        
        try {
            $profileResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/auth/me" -Method GET -Headers $headers
            Write-Host "✅ Authenticated request successful - Status: $($profileResponse.StatusCode)" -ForegroundColor Green
            $profileData = $profileResponse.Content | ConvertFrom-Json
            Write-Host "   Profile loaded for: $($profileData.user.email)" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Authenticated request failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Login failed: $($loginResult.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Login request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Check frontend accessibility
Write-Host "`n4. Testing frontend accessibility..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5176" -Method GET
    Write-Host "✅ Frontend is accessible - Status: $($frontendResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🔗 Test URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5176" -ForegroundColor Gray
Write-Host "   Login: http://localhost:5176/login" -ForegroundColor Gray
Write-Host "   Test Protected: http://localhost:5176/test-protected" -ForegroundColor Gray
Write-Host "   Simple Messages: http://localhost:5176/messages-v3-simple" -ForegroundColor Gray
Write-Host "   Messages V3: http://localhost:5176/messages-v3" -ForegroundColor Gray

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Go to http://localhost:5176/login and login with test@example.com" -ForegroundColor Gray
Write-Host "   2. Navigate to http://localhost:5176/test-protected to verify auth state" -ForegroundColor Gray
Write-Host "   3. Try accessing http://localhost:5176/messages-v3-simple" -ForegroundColor Gray
Write-Host "   4. Then try http://localhost:5176/messages-v3" -ForegroundColor Gray
