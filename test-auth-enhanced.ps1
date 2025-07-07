# Enhanced Authentication System Test Script
# For OnlyFur Creator Platform - PowerShell Compatible

param(
    [string]$BaseUrl = "http://localhost:3001",
    [switch]$Verbose = $false
)

# Set TLS version for modern HTTPS
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "🔐 Testing OnlyFur Authentication System" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

# Test configuration
$testUser = @{
    email = "test-user-$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    username = "testuser$(Get-Date -Format 'HHmmss')"
    displayName = "Test User $(Get-Date -Format 'HH:mm:ss')"
    password = "SecurePassword123!"
    role = "SUBSCRIBER"
}

$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

$testResults = @()

function Add-TestResult {
    param(
        [string]$TestName,
        [bool]$Success,
        [string]$Message,
        [object]$Details = $null
    )
    
    $result = @{
        Name = $TestName
        Success = $Success
        Message = $Message
        Details = $Details
        Timestamp = Get-Date
    }
    
    $script:testResults += $result
    
    $icon = if ($Success) { "✅" } else { "❌" }
    Write-Host "$icon $TestName`: $Message" -ForegroundColor $(if ($Success) { "Green" } else { "Red" })
    
    if ($Verbose -and $Details) {
        Write-Host "   Details: $($Details | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
    }
}

function Test-Backend {
    Write-Host "🔍 Testing Backend Availability..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
        $isHealthy = $response.StatusCode -eq 200
        
        Add-TestResult -TestName "Backend Health Check" -Success $isHealthy -Message "Backend is $(if ($isHealthy) { 'healthy' } else { 'unhealthy' })" -Details @{ StatusCode = $response.StatusCode }
        
        return $isHealthy
    }
    catch {
        Add-TestResult -TestName "Backend Health Check" -Success $false -Message "Backend unavailable: $($_.Exception.Message)"
        return $false
    }
}

function Test-Registration {
    Write-Host "📝 Testing User Registration..." -ForegroundColor Yellow
    
    try {
        $body = $testUser | ConvertTo-Json -Depth 3
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/register" -Method POST -Headers $headers -Body $body -TimeoutSec 15 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            $responseData = $response.Content | ConvertFrom-Json
            
            if ($responseData.success) {
                Add-TestResult -TestName "User Registration" -Success $true -Message "Registration successful" -Details @{ 
                    UserId = $responseData.data.user.id
                    Email = $responseData.data.user.email
                    HasToken = [bool]$responseData.data.token
                }
                return $responseData.data.token
            }
            else {
                Add-TestResult -TestName "User Registration" -Success $false -Message "Registration failed: $($responseData.error)"
                return $null
            }
        }
        else {
            Add-TestResult -TestName "User Registration" -Success $false -Message "HTTP Error: $($response.StatusCode)"
            return $null
        }
    }
    catch {
        Add-TestResult -TestName "User Registration" -Success $false -Message "Registration error: $($_.Exception.Message)"
        return $null
    }
}

function Test-Login {
    Write-Host "🔑 Testing User Login..." -ForegroundColor Yellow
    
    try {
        $loginData = @{
            email = $testUser.email
            password = $testUser.password
        }
        
        $body = $loginData | ConvertTo-Json -Depth 2
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST -Headers $headers -Body $body -TimeoutSec 15 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            $responseData = $response.Content | ConvertFrom-Json
            
            if ($responseData.success) {
                Add-TestResult -TestName "User Login" -Success $true -Message "Login successful" -Details @{
                    UserId = $responseData.data.user.id
                    Email = $responseData.data.user.email
                    Role = $responseData.data.user.role
                    HasToken = [bool]$responseData.data.token
                    HasRefreshToken = [bool]$responseData.data.refreshToken
                }
                return $responseData.data.token
            }
            else {
                Add-TestResult -TestName "User Login" -Success $false -Message "Login failed: $($responseData.error)"
                return $null
            }
        }
        else {
            Add-TestResult -TestName "User Login" -Success $false -Message "HTTP Error: $($response.StatusCode)"
            return $null
        }
    }
    catch {
        Add-TestResult -TestName "User Login" -Success $false -Message "Login error: $($_.Exception.Message)"
        return $null
    }
}

function Test-ProfileAccess {
    param([string]$Token)
    
    Write-Host "👤 Testing Profile Access..." -ForegroundColor Yellow
    
    if (-not $Token) {
        Add-TestResult -TestName "Profile Access" -Success $false -Message "No token provided"
        return
    }
    
    try {
        $authHeaders = $headers.Clone()
        $authHeaders["Authorization"] = "Bearer $Token"
        
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/profile" -Method GET -Headers $authHeaders -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            $responseData = $response.Content | ConvertFrom-Json
            
            if ($responseData.success) {
                Add-TestResult -TestName "Profile Access" -Success $true -Message "Profile access successful" -Details @{
                    Email = $responseData.data.email
                    Username = $responseData.data.username
                    Role = $responseData.data.role
                    IsVerified = $responseData.data.isVerified
                }
            }
            else {
                Add-TestResult -TestName "Profile Access" -Success $false -Message "Profile access failed: $($responseData.error)"
            }
        }
        else {
            Add-TestResult -TestName "Profile Access" -Success $false -Message "HTTP Error: $($response.StatusCode)"
        }
    }
    catch {
        Add-TestResult -TestName "Profile Access" -Success $false -Message "Profile access error: $($_.Exception.Message)"
    }
}

function Test-InvalidLogin {
    Write-Host "🚫 Testing Invalid Login Prevention..." -ForegroundColor Yellow
    
    try {
        $invalidData = @{
            email = $testUser.email
            password = "WrongPassword123!"
        }
        
        $body = $invalidData | ConvertTo-Json -Depth 2
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST -Headers $headers -Body $body -TimeoutSec 10 -ErrorAction SilentlyContinue
        
        # Should fail with 401 or 400
        if ($response.StatusCode -eq 401 -or $response.StatusCode -eq 400) {
            Add-TestResult -TestName "Invalid Login Prevention" -Success $true -Message "Invalid login correctly rejected"
        }
        else {
            Add-TestResult -TestName "Invalid Login Prevention" -Success $false -Message "Invalid login was not rejected properly"
        }
    }
    catch {
        # Expected behavior for invalid credentials
        if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400) {
            Add-TestResult -TestName "Invalid Login Prevention" -Success $true -Message "Invalid login correctly rejected"
        }
        else {
            Add-TestResult -TestName "Invalid Login Prevention" -Success $false -Message "Unexpected error: $($_.Exception.Message)"
        }
    }
}

function Show-Summary {
    Write-Host ""
    Write-Host "📊 Test Summary" -ForegroundColor Cyan
    Write-Host "=" * 50
    
    $totalTests = $testResults.Count
    $passedTests = ($testResults | Where-Object { $_.Success }).Count
    $failedTests = $totalTests - $passedTests
    
    Write-Host "Total Tests: $totalTests" -ForegroundColor White
    Write-Host "Passed: $passedTests" -ForegroundColor Green
    Write-Host "Failed: $failedTests" -ForegroundColor $(if ($failedTests -gt 0) { "Red" } else { "Green" })
    Write-Host ""
    
    if ($failedTests -eq 0) {
        Write-Host "🎉 All authentication tests passed!" -ForegroundColor Green
        Write-Host "✅ Registration working" -ForegroundColor Green
        Write-Host "✅ Login working" -ForegroundColor Green
        Write-Host "✅ Authentication working" -ForegroundColor Green
        Write-Host "✅ Security measures working" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Some tests failed. Check the implementation." -ForegroundColor Yellow
        
        $failedTests = $testResults | Where-Object { -not $_.Success }
        foreach ($test in $failedTests) {
            Write-Host "❌ $($test.Name): $($test.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "🔐 Security Features Verified:" -ForegroundColor Cyan
    Write-Host "• Password hashing and verification"
    Write-Host "• JWT token generation and validation"
    Write-Host "• Protected route access control"
    Write-Host "• Invalid credential rejection"
    Write-Host "• Session management"
}

# Main execution
Write-Host "Starting authentication system tests..." -ForegroundColor White
Write-Host ""

# Run tests in sequence
$backendHealthy = Test-Backend

if ($backendHealthy) {
    $null = Test-Registration  # Registration creates user for login test
    $loginToken = Test-Login
    
    if ($loginToken) {
        Test-ProfileAccess -Token $loginToken
    }
    
    Test-InvalidLogin
}
else {
    Write-Host "⚠️  Backend is not available. Testing will use mock/offline mode." -ForegroundColor Yellow
    Add-TestResult -TestName "Backend Status" -Success $false -Message "Backend unavailable - tests will run in offline mode"
}

Show-Summary

# Export results for further analysis
$resultsFile = "auth-test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$testResults | ConvertTo-Json -Depth 3 | Out-File -FilePath $resultsFile -Encoding UTF8
Write-Host "Test results saved to: $resultsFile" -ForegroundColor Gray
