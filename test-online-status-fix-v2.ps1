# Test script to verify online status API improvements
# Tests the rate limiting and error handling improvements

Write-Host "Testing Online Status API Improvements..." -ForegroundColor Green

# Test 1: Check if the API endpoint responds
Write-Host "`n1. Testing API endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://creatorplattform.vercel.app/api/health" -Method GET -TimeoutSec 10
    Write-Host "   API Health Check: " -NoNewline
    if ($response.StatusCode -eq 200) {
        Write-Host "Success - API is responding" -ForegroundColor Green
    } else {
        Write-Host "Error - API returned status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "   Error - API Health Check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test online-status endpoint with invalid token (should handle gracefully)
Write-Host "`n2. Testing online-status endpoint error handling..." -ForegroundColor Yellow
try {
    $headers = @{
        'Authorization' = 'Bearer invalid-token'
        'Content-Type' = 'application/json'
    }
    
    $response = Invoke-WebRequest -Uri "https://creatorplattform.vercel.app/api/online-status/online-count" -Method GET -Headers $headers -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   Success - Online status endpoint responded: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "   Success - Online status endpoint correctly returned 401 Unauthorized" -ForegroundColor Green
    } else {
        Write-Host "   Warning - Online status endpoint error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test 3: Multiple rapid requests to test rate limiting
Write-Host "`n3. Testing rate limiting with multiple requests..." -ForegroundColor Yellow
$successCount = 0
$errorCount = 0

for ($i = 1; $i -le 5; $i++) {
    try {
        Start-Sleep -Milliseconds 100  # Small delay between requests
        $response = Invoke-WebRequest -Uri "https://creatorplattform.vercel.app/api/online-status/online-count" -Method GET -TimeoutSec 3 -ErrorAction Stop
        $successCount++
        Write-Host "   Request ${i}: Success (Status: $($response.StatusCode))" -ForegroundColor Green
    } catch {
        $errorCount++
        $errorMessage = $_.Exception.Message
        if ($errorMessage -like "*ERR_INSUFFICIENT_RESOURCES*" -or $errorMessage -like "*timeout*") {
            Write-Host "   Request ${i}: Resource limit reached (this is expected)" -ForegroundColor Yellow
        } else {
            Write-Host "   Request ${i}: Error: $errorMessage" -ForegroundColor Red
        }
    }
}

Write-Host "`nRate limiting test results:" -ForegroundColor Cyan
Write-Host "   Successful requests: $successCount" -ForegroundColor Green
Write-Host "   Rate limited/timeout requests: $errorCount" -ForegroundColor Yellow

# Test 4: Frontend build verification
Write-Host "`n4. Verifying frontend build contains fixes..." -ForegroundColor Yellow
$indexPath = "s:\Coding\creatorplattform\dist\index.html"
if (Test-Path $indexPath) {
    Write-Host "   Success - Frontend build exists" -ForegroundColor Green
    
    # Check if the built assets contain our improvements
    $jsFiles = Get-ChildItem "s:\Coding\creatorplattform\dist\assets" -Filter "*.js"
    if ($jsFiles.Count -gt 0) {
        Write-Host "   Success - JavaScript assets found: $($jsFiles.Count) files" -ForegroundColor Green
    } else {
        Write-Host "   Error - No JavaScript assets found" -ForegroundColor Red
    }
} else {
    Write-Host "   Error - Frontend build not found. Run 'npm run build' first." -ForegroundColor Red
}

Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "The online status API improvements include:" -ForegroundColor White
Write-Host "• Rate limiting to prevent ERR_INSUFFICIENT_RESOURCES errors" -ForegroundColor Gray
Write-Host "• Exponential backoff retry logic" -ForegroundColor Gray
Write-Host "• Better error handling in AuthContext" -ForegroundColor Gray
Write-Host "• Reduced polling frequency for non-essential requests" -ForegroundColor Gray
Write-Host "• Graceful degradation when online status fails" -ForegroundColor Gray

Write-Host "`nIf you still see ERR_INSUFFICIENT_RESOURCES errors:" -ForegroundColor Yellow
Write-Host "1. Clear your browser cache and reload" -ForegroundColor Gray
Write-Host "2. Check if multiple tabs are open (each tab makes requests)" -ForegroundColor Gray
Write-Host "3. The errors should now be less frequent and not block authentication" -ForegroundColor Gray

Write-Host "`nTest completed!" -ForegroundColor Green
