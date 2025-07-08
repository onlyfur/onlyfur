# Simple CORS Test Script
param(
    [string]$BaseUrl = "https://onlyfur-git-minor-fixes-k3noxs-projects.vercel.app"
)

Write-Host "Testing CORS configuration for: $BaseUrl" -ForegroundColor Green

# Test 1: Simple GET request to API
Write-Host "`n1. Testing API endpoint availability..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api" -Method GET -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   CORS Headers:" -ForegroundColor Cyan
    $corsHeaders = @('Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials')
    foreach ($header in $corsHeaders) {
        if ($response.Headers[$header]) {
            Write-Host "     $header`: $($response.Headers[$header])" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: OPTIONS preflight request
Write-Host "`n2. Testing OPTIONS preflight request..." -ForegroundColor Yellow
try {
    $headers = @{
        'Origin' = $BaseUrl
        'Access-Control-Request-Method' = 'POST'
        'Access-Control-Request-Headers' = 'Content-Type,Authorization'
    }
    $response = Invoke-WebRequest -Uri "$BaseUrl/api" -Method OPTIONS -Headers $headers -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Preflight Response Headers:" -ForegroundColor Cyan
    $corsHeaders = @('Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers')
    foreach ($header in $corsHeaders) {
        if ($response.Headers[$header]) {
            Write-Host "     $header`: $($response.Headers[$header])" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check if frontend loads without CORS errors
Write-Host "`n3. Checking frontend deployment..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $BaseUrl -UseBasicParsing
    Write-Host "   Frontend Status: $($response.StatusCode)" -ForegroundColor Green
    if ($response.Content -match "<!DOCTYPE html") {
        Write-Host "   Frontend appears to be loading correctly" -ForegroundColor Green
    }
} catch {
    Write-Host "   Error loading frontend: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nCORS Test Complete!" -ForegroundColor Green
Write-Host "Key improvements made:" -ForegroundColor Yellow
Write-Host "1. Added centralized API utility for production-safe requests" -ForegroundColor White
Write-Host "2. Updated all major components to use the new API utility" -ForegroundColor White
Write-Host "3. Reduced polling frequency and added visibility checks" -ForegroundColor White
Write-Host "4. Improved CORS headers in backend and Vercel config" -ForegroundColor White
Write-Host "5. The main goal is to reduce CORS error spam, not eliminate 401s" -ForegroundColor White
