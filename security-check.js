#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to check for potential hardcoded secrets
function checkForHardcodedSecrets(filePath) {
    console.log(`🔍 Scanning ${filePath} for hardcoded secrets...`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    // Patterns that might indicate hardcoded secrets
    const patterns = [
        // Secret keys and tokens
        { regex: /['"]\w{32,}['"]/, desc: 'Potential secret key (32+ chars)' },
        { regex: /password\s*[:=]\s*['"](?!.*process\.env)[^'"]{6,}['"]/, desc: 'Hardcoded password' },
        { regex: /secret\s*[:=]\s*['"](?!.*process\.env)[^'"]{10,}['"]/, desc: 'Hardcoded secret' },
        { regex: /key\s*[:=]\s*['"](?!.*process\.env)[^'"]{10,}['"]/, desc: 'Hardcoded key' },
        { regex: /token\s*[:=]\s*['"](?!.*process\.env)[^'"]{10,}['"]/, desc: 'Hardcoded token' },
        
        // URLs and endpoints that should be configurable
        { regex: /http:\/\/localhost:\d+/, desc: 'Hardcoded localhost URL' },
        { regex: /https?:\/\/(?!.*process\.env)[^'"\s]+/, desc: 'Potential hardcoded URL' },
        
        // Database connection strings
        { regex: /postgres:\/\/[^'"\s]+/, desc: 'Potential hardcoded database URL' },
        { regex: /mysql:\/\/[^'"\s]+/, desc: 'Potential hardcoded database URL' },
        
        // API keys and credentials
        { regex: /['"]sk_[a-zA-Z0-9_]+['"]/, desc: 'Potential Stripe secret key' },
        { regex: /['"]pk_[a-zA-Z0-9_]+['"]/, desc: 'Potential Stripe publishable key' },
        { regex: /['"]SG\.[a-zA-Z0-9_\-\.]+['"]/, desc: 'Potential SendGrid API key' },
    ];
    
    lines.forEach((line, index) => {
        // Skip comments and environment variable usage
        if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.includes('process.env')) {
            return;
        }
        
        patterns.forEach(pattern => {
            if (pattern.regex.test(line)) {
                issues.push({
                    line: index + 1,
                    content: line.trim(),
                    issue: pattern.desc
                });
            }
        });
    });
    
    return issues;
}

// Function to check environment variable usage
function checkEnvironmentVariables(filePath) {
    console.log(`🔧 Checking environment variable usage in ${filePath}...`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const envVars = [...content.matchAll(/process\.env\.([A-Z_]+)/g)].map(match => match[1]);
    const uniqueEnvVars = [...new Set(envVars)];
    
    console.log(`✅ Found ${uniqueEnvVars.length} environment variables:`);
    uniqueEnvVars.forEach(envVar => {
        console.log(`   - ${envVar}`);
    });
    
    return uniqueEnvVars;
}

// Main execution
const backendFile = path.join(__dirname, 'server', 'complete-auth-backend.js');

console.log('🔒 Security Check: Scanning for hardcoded secrets\n');

try {
    // Check for hardcoded secrets
    const issues = checkForHardcodedSecrets(backendFile);
    
    if (issues.length === 0) {
        console.log('✅ No obvious hardcoded secrets found!');
    } else {
        console.log(`⚠️  Found ${issues.length} potential issues:`);
        issues.forEach((issue, index) => {
            console.log(`\n${index + 1}. Line ${issue.line}: ${issue.issue}`);
            console.log(`   ${issue.content}`);
        });
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Check environment variables
    const envVars = checkEnvironmentVariables(backendFile);
    
    console.log('\n✅ Security check complete!');
    console.log('📋 All configuration should use environment variables from .env file');
    
} catch (error) {
    console.error('❌ Error during security check:', error.message);
}
