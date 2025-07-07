# 🚀 OnlyFur Platform - Enhanced Authentication Testing Script
# PowerShell script to test the enhanced authentication system
# Supports: Session persistence, token validation, security features

param(
    [string]$BaseUrl = "http://localhost:3001",
    [switch]$Verbose,
    [switch]$ShowDetails
)

# Configuration
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Test user data
$testUser = @{
    email = "test-auth-$(Get-Random)@onlyfur.com"
    password = "TestPassword123!"
    username = "testuser$(Get-Random)"
    displayName = "Test User"
    role = "creator"
}

Write-Host "🧪 OnlyFur Platform - Authentication Test Suite" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "Testing URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "Test User: $($testUser.email)" -ForegroundColor Yellow
Write-Host ""

# Store test results
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
                Add-TestResult -TestName "User Registration" -Success $true -Message "User registered successfully" -Details @{ UserId = $responseData.user.id }
                return $true
            } else {
                Add-TestResult -TestName "User Registration" -Success $false -Message "Registration failed: $($responseData.message)"
                return $false
            }
        } else {
            Add-TestResult -TestName "User Registration" -Success $false -Message "Unexpected status code: $($response.StatusCode)"
            return $false
        }
    }
    catch {
        $errorMessage = $_.Exception.Message
        if ($_.Exception.Response.StatusCode -eq 409) {
            Add-TestResult -TestName "User Registration" -Success $true -Message "User already exists (expected for repeated tests)"
            return $true
        } else {
            Add-TestResult -TestName "User Registration" -Success $false -Message "Registration error: $errorMessage"
            return $false
        }
    }
}

function Test-Login {
    Write-Host "🔐 Testing User Login..." -ForegroundColor Yellow
    
    try {
        $loginData = @{
            email = $testUser.email
            password = $testUser.password
            rememberMe = $true
        }
        
        $body = $loginData | ConvertTo-Json -Depth 3
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST -Headers $headers -Body $body -TimeoutSec 15 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            $responseData = $response.Content | ConvertFrom-Json
            
            if ($responseData.success -and $responseData.token) {
                $script:authToken = $responseData.token
                Add-TestResult -TestName "User Login" -Success $true -Message "Login successful" -Details @{ 
                    UserId = $responseData.user.id
                    TokenLength = $responseData.token.Length
                    RememberMe = $responseData.rememberMe
                }
                return @{ success = $true; token = $responseData.token; user = $responseData.user }
            } else {
                Add-TestResult -TestName "User Login" -Success $false -Message "Login failed: $($responseData.message)"
                return @{ success = $false }
            }
        } else {
            Add-TestResult -TestName "User Login" -Success $false -Message "Unexpected status code: $($response.StatusCode)"
            return @{ success = $false }
        }
    }
    catch {
        Add-TestResult -TestName "User Login" -Success $false -Message "Login error: $($_.Exception.Message)"
        return @{ success = $false }
    }
}

function Test-ProfileAccess {
    param([string]$Token)
    
    Write-Host "👤 Testing Profile Access..." -ForegroundColor Yellow
    
    if (-not $Token) {
        Add-TestResult -TestName "Profile Access" -Success $false -Message "No auth token available"
        return $false
    }
    
    try {
        $authHeaders = $headers.Clone()
        $authHeaders["Authorization"] = "Bearer $Token"
        
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/profile" -Method GET -Headers $authHeaders -TimeoutSec 15 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            $profileData = $response.Content | ConvertFrom-Json
            
            if ($profileData.success) {
                Add-TestResult -TestName "Profile Access" -Success $true -Message "Profile access successful" -Details @{ 
                    Email = $profileData.user.email
                    Role = $profileData.user.role
                }
                return $true
            } else {
                Add-TestResult -TestName "Profile Access" -Success $false -Message "Profile access failed: $($profileData.message)"
                return $false
            }
        } else {
            Add-TestResult -TestName "Profile Access" -Success $false -Message "Unexpected status code: $($response.StatusCode)"
            return $false
        }
    }
    catch {
        Add-TestResult -TestName "Profile Access" -Success $false -Message "Profile access error: $($_.Exception.Message)"
        return $false
    }
}

function Test-InvalidLogin {
    Write-Host "🚫 Testing Invalid Login..." -ForegroundColor Yellow
    
    try {
        $invalidLogin = @{
            email = $testUser.email
            password = "WrongPassword123!"
        }
        
        $body = $invalidLogin | ConvertTo-Json -Depth 3
        $null = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST -Headers $headers -Body $body -TimeoutSec 15 -ErrorAction Stop
        
        # Should not reach here with valid error handling
        Add-TestResult -TestName "Invalid Login Security" -Success $false -Message "Invalid login was accepted (security issue)"
        return $false
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400) {
            Add-TestResult -TestName "Invalid Login Security" -Success $true -Message "Invalid login properly rejected"
            return $true
        } else {
            Add-TestResult -TestName "Invalid Login Security" -Success $false -Message "Unexpected error: $($_.Exception.Message)"
            return $false
        }
    }
}

function Show-Summary {
    Write-Host ""
    Write-Host "📊 Test Summary" -ForegroundColor Cyan
    Write-Host "=" * 30 -ForegroundColor Cyan
    
    $totalTests = $testResults.Count
    $passedTests = ($testResults | Where-Object { $_.Success }).Count
    $failedTests = $totalTests - $passedTests
    
    Write-Host "Total Tests: $totalTests" -ForegroundColor Yellow
    Write-Host "Passed: $passedTests" -ForegroundColor Green
    Write-Host "Failed: $failedTests" -ForegroundColor Red
    Write-Host "Success Rate: $([math]::Round(($passedTests / $totalTests) * 100, 2))%" -ForegroundColor $(if ($failedTests -eq 0) { "Green" } else { "Yellow" })
    
    if ($ShowDetails) {
        Write-Host ""
        Write-Host "📋 Detailed Results:" -ForegroundColor Cyan
        foreach ($result in $testResults) {
            $icon = if ($result.Success) { "✅" } else { "❌" }
            Write-Host "$icon $($result.Name): $($result.Message)" -ForegroundColor $(if ($result.Success) { "Green" } else { "Red" })
            if ($result.Details) {
                Write-Host "   $($result.Details | ConvertTo-Json -Compress)" -ForegroundColor Gray
            }
        }
    }
    
    if ($failedTests -eq 0) {
        Write-Host ""
        Write-Host "🎉 All tests passed! Enhanced authentication system is working correctly." -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Some tests failed. Please check the backend server and configuration." -ForegroundColor Yellow
    }
}

# Run the test suite
Write-Host "🚀 Starting Enhanced Authentication Tests..." -ForegroundColor Green
Write-Host ""

# Test 1: Backend availability
$backendAvailable = Test-Backend

if ($backendAvailable) {
    # Test 2: User registration
    Test-Registration | Out-Null
    
    # Test 3: User login
    $loginResult = Test-Login
    
    if ($loginResult.success) {
        # Test 4: Profile access with token
        Test-ProfileAccess -Token $loginResult.token | Out-Null
    }
    
    # Test 5: Invalid login security
    Test-InvalidLogin | Out-Null
} else {
    Write-Host "⚠️  Backend is not available. Skipping authentication tests." -ForegroundColor Yellow
    Write-Host "Please ensure the backend server is running on $BaseUrl" -ForegroundColor Yellow
}

# Show final summary
Show-Summary

Write-Host ""
Write-Host "🏁 Authentication testing complete!" -ForegroundColor Cyan
