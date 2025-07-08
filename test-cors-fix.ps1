# CORS Test Script for PowerShell
# Tests the production deployment to verify CORS headers are working

$deploymentUrl = "https://onlyfur-git-minor-fixes-k3noxs-projects.vercel.app"

Write-Host "Testing CORS configuration for: $deploymentUrl" -ForegroundColor Green

# Test 1: Basic API health check
Write-Host "`n1. Testing API health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$deploymentUrl/api/health" -Method GET -Headers @{
        "Origin" = $deploymentUrl
        "Access-Control-Request-Method" = "GET"
    } -UseBasicParsing
    
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   CORS Headers:"
    
    $corsHeaders = @(
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods", 
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials"
    )
    
    foreach ($header in $corsHeaders) {
        $value = $response.Headers[$header]
        if ($value) {
            Write-Host "     $header : $value" -ForegroundColor Cyan
        } else {
            Write-Host "     $header : [Not set]" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: OPTIONS preflight request
Write-Host "`n2. Testing OPTIONS preflight request..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$deploymentUrl/api/health" -Method OPTIONS -Headers @{
        "Origin" = $deploymentUrl
        "Access-Control-Request-Method" = "GET"
        "Access-Control-Request-Headers" = "Content-Type, Authorization"
    } -UseBasicParsing
    
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response indicates CORS preflight is working" -ForegroundColor Green
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test with different origins
Write-Host "`n3. Testing with various origins..." -ForegroundColor Yellow

$testOrigins = @(
    $deploymentUrl,
    "https://onlyfur.vercel.app",
    "http://localhost:5173"
)

foreach ($testOrigin in $testOrigins) {
    Write-Host "   Testing origin: $testOrigin"
    try {
        $response = Invoke-WebRequest -Uri "$deploymentUrl/api/health" -Method GET -Headers @{
            "Origin" = $testOrigin
        } -UseBasicParsing
        
        $allowedOrigin = $response.Headers["Access-Control-Allow-Origin"]
        if ($allowedOrigin) {
            Write-Host "     Success - Allowed: $allowedOrigin" -ForegroundColor Green
        } else {
            Write-Host "     Warning - No CORS header returned" -ForegroundColor Red
        }
    } catch {
        Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n4. Checking frontend deployment..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $deploymentUrl -Method GET -UseBasicParsing
    Write-Host "   Frontend Status: $($response.StatusCode)" -ForegroundColor Green
    
    if ($response.Content -like "*title*") {
        Write-Host "   Frontend appears to be loaded correctly" -ForegroundColor Green
    } else {
        Write-Host "   Frontend may have issues" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   Error loading frontend: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nCORS Test Complete!" -ForegroundColor Green
Write-Host "If you are still experiencing CORS errors:" -ForegroundColor Yellow
Write-Host "1. Clear browser cache and cookies" -ForegroundColor White
Write-Host "2. Try opening the site in an incognito/private window" -ForegroundColor White
Write-Host "3. Check browser developer tools for specific error messages" -ForegroundColor White
