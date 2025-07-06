# OnlyFur Enhanced Subscription Tier System

## Overview

The OnlyFur platform now features a comprehensive subscription tier system that provides different access levels and permissions for both creators and subscribers. This system enables granular control over content access, messaging permissions, and platform features based on user roles and subscription tiers.

## System Architecture

### Core Components

1. **Enhanced Type Definitions** (`src/types/index.ts`)
   - `PlatformSubscriptionTier` - Extended with detailed permissions
   - `ContentAccessLevel` - Custom access level configurations
   - `CreatorContentSettings` - Creator-specific content management
   - `PermissionCheck` - Standardized permission validation results

2. **Subscription Tier Data** (`src/data/subscriptionTiers.ts`)
   - Predefined subscriber tiers (Basic, Pro, VIP)
   - Creator tiers (Basic, Pro, Premium)
   - Detailed feature matrices and limitations

3. **Permission Utils** (`src/utils/permissionUtils.ts`)
   - Content access validation functions
   - Messaging permission checks
   - Feature availability validation
   - File upload restrictions

4. **Tier Validation Service** (`src/services/tierValidationService.ts`)
   - Centralized permission checking
   - Upgrade recommendations
   - Batch operation validation
   - Storage limit enforcement

## Subscription Tiers

### Subscriber Tiers

#### Basic Subscriber ($9.99/month)
- **Content Access**: Public content only
- **Messaging**: 5 conversations/day, text only
- **File Sharing**: 5MB limit, images only
- **Video Quality**: SD (Standard Definition)
- **Support**: Standard support

#### Pro Subscriber ($19.99/month)
- **Content Access**: Premium content included
- **Messaging**: 15 conversations/day, media sharing
- **File Sharing**: 25MB limit, images + videos
- **Video Quality**: HD (High Definition)
- **Support**: Priority support
- **Features**: Download content, early access

#### VIP Subscriber ($39.99/month)
- **Content Access**: All content including VIP exclusive
- **Messaging**: Unlimited conversations, bulk messaging
- **File Sharing**: 100MB limit, all media types
- **Video Quality**: UHD (Ultra High Definition)
- **Support**: Premium support
- **Features**: VIP events, custom badges, priority streaming

### Creator Tiers

#### Basic Creator (Free)
- **Platform Fee**: 20%
- **Uploads**: 10 per day
- **Storage**: 10GB
- **Analytics**: Basic level
- **Features**: Standard profile, basic messaging

#### Pro Creator ($29.99/month)
- **Platform Fee**: 15%
- **Uploads**: 25 per day
- **Storage**: 100GB
- **Analytics**: Advanced insights
- **Features**: Live streaming, custom branding, bulk messaging (100/day)
- **Content Management**: Tier-based access control

#### Premium Creator ($59.99/month)
- **Platform Fee**: 10%
- **Uploads**: Unlimited
- **Storage**: Unlimited
- **Analytics**: Premium suite with detailed demographics
- **Features**: All Pro features + unlimited bulk messaging
- **Advanced**: Custom integrations, dedicated account manager

## Key Features

### 1. Role-Based Registration

The registration flow now includes:
- **Role Selection**: Choose between Creator or Subscriber
- **Tier Selection**: Pick subscription level during signup
- **Enhanced Onboarding**: Detailed feature comparisons
- **Immediate Access**: Tier benefits activate upon payment

**Implementation**: `src/components/auth/EnhancedRoleSelector.tsx`

### 2. Content Access Control

Creators can set content visibility based on subscriber tiers:
- **Public**: Visible to everyone
- **Subscribers**: All subscribers can view
- **Premium**: Pro Subscriber tier or higher
- **VIP Exclusive**: VIP Subscribers only

**Implementation**: `src/components/content/ContentTierManager.tsx`

### 3. Messaging Permissions

Tier-based messaging controls:
- **Daily Limits**: Based on subscription tier
- **Media Sharing**: File size and type restrictions
- **Creator Preferences**: Set which tiers can message
- **Bulk Messaging**: Available for higher tiers

**Implementation**: Enhanced `src/components/messaging/TierBasedMessaging.tsx`

### 4. Advanced Creator Tools

Premium features for creators:
- **Content Tier Management**: Set access levels per content
- **Custom Pricing**: Set individual subscription prices
- **Advanced Scheduling**: Batch content scheduling
- **Analytics Dashboard**: Detailed performance metrics
- **Custom Branding**: Personalized profile themes

## Permission System

### Validation Flow

1. **User Authentication**: Verify user login status
2. **Tier Verification**: Check active subscription status
3. **Feature Check**: Validate specific feature access
4. **Action Allowance**: Grant or deny with upgrade path

### Permission Types

#### Content Permissions
```typescript
- canViewContent(user, content, isNewestPost)
- canDownloadContent(user, content)
- canShareContent(user, content)
```

#### Messaging Permissions
```typescript
- canSendMessage(sender, recipient, dailyCount)
- canSendMedia(user, fileSize, fileType)
- canSendBulkMessage(user, recipientCount)
```

#### Creator Permissions
```typescript
- canUploadContent(user, dailyCount)
- canLiveStream(user)
- canSetContentTiers(user)
- canAccessAnalytics(user, level)
```

## Usage Examples

### Checking Content Access
```typescript
import { tierValidationService } from '@/services/tierValidationService';

const canAccess = tierValidationService.validateContentAccess(
  user, 
  content, 
  { isNewestPost: false }
);

if (!canAccess.allowed) {
  // Show upgrade prompt with canAccess.reason
  // Redirect to canAccess.upgradeUrl
}
```

### Validating File Upload
```typescript
const uploadCheck = tierValidationService.validateFileUpload(user, file);

if (!uploadCheck.allowed) {
  showError(uploadCheck.reason);
  if (uploadCheck.requiredTier) {
    showUpgradePrompt(uploadCheck.requiredTier);
  }
}
```

### Getting Upgrade Recommendations
```typescript
const recommendations = tierValidationService.getUpgradeRecommendations(
  user,
  {
    dailyUploads: 8,
    monthlyEarnings: 250,
    storageUsedGB: 45
  }
);

recommendations.forEach(rec => {
  console.log(`${rec.feature}: ${rec.reason} -> ${rec.recommendedTier}`);
});
```

## Integration Points

### Components Using Tier System

1. **ContentAccessControl**: Blurs content based on tier
2. **TierBasedMessaging**: Enforces messaging limits
3. **ContentTierManager**: Creator content access settings
4. **EnhancedPricingModal**: Tier comparison and selection
5. **ContentUpload**: Upload limit enforcement

### API Integration

The tier system integrates with backend APIs for:
- **Subscription Management**: Stripe/PayPal integration
- **Usage Tracking**: Daily limits and analytics
- **Permission Caching**: Performance optimization
- **Upgrade Flows**: Seamless tier transitions

## Configuration

### Tier Customization

Tiers can be customized by modifying:
- `src/data/subscriptionTiers.ts` - Tier definitions
- `src/utils/permissionUtils.ts` - Permission logic
- `src/services/tierValidationService.ts` - Validation rules

### Feature Flags

Control feature availability:
```typescript
// In tier definition
creatorFeatures: {
  canSetContentTiers: true,
  customPricing: true,
  advancedScheduling: true,
  // ... other features
}
```

## Best Practices

### 1. Graceful Degradation
- Always provide fallback options for restricted features
- Show clear upgrade paths when features are unavailable
- Maintain functionality for free tier users

### 2. User Experience
- Make tier benefits clear and valuable
- Provide easy upgrade/downgrade options
- Show usage statistics and limits

### 3. Performance
- Cache permission checks where possible
- Use optimistic UI updates
- Implement efficient tier validation

### 4. Security
- Always validate permissions server-side
- Don't expose premium content to unauthorized users
- Implement proper authentication checks

## Monitoring and Analytics

### Key Metrics

1. **Conversion Rates**: Free to paid tier upgrades
2. **Feature Utilization**: Which tier features are most used
3. **Churn Analysis**: Tier downgrade patterns
4. **Revenue Impact**: Tier-based revenue tracking

### Implementation

Track tier-related events:
```typescript
// Example analytics integration
analytics.track('tier_upgrade', {
  user_id: user.id,
  from_tier: oldTier.id,
  to_tier: newTier.id,
  upgrade_reason: reason
});
```

## Future Enhancements

### Planned Features

1. **Dynamic Pricing**: Location-based tier pricing
2. **Enterprise Tiers**: Custom tiers for large creators
3. **Family Plans**: Shared subscriptions
4. **Seasonal Promotions**: Temporary tier benefits
5. **API Access Tiers**: Developer subscription levels

### Scalability Considerations

1. **Microservices**: Separate tier management service
2. **Event-Driven**: Tier change event handling
3. **Caching Strategy**: Redis-based permission caching
4. **Database Optimization**: Efficient tier queries

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check user authentication status
   - Verify subscription tier is active
   - Ensure tier has required permissions

2. **Upgrade Flow Problems**
   - Validate payment integration
   - Check tier activation timing
   - Verify permission cache updates

3. **Performance Issues**
   - Implement permission caching
   - Optimize database queries
   - Use efficient validation logic

### Debug Tools

```typescript
// Debug permission check
const debug = tierValidationService.validateContentAccess(user, content);
console.log('Permission Debug:', {
  user: user?.id,
  tier: user?.subscriptionTier?.id,
  content: content.id,
  result: debug
});
```

## Support and Documentation

For additional help:
- Review component documentation in respective files
- Check type definitions for available properties
- Refer to permission utility functions for validation logic
- Contact development team for tier customization needs

---

*This documentation covers the complete enhanced subscription tier system implementation for the OnlyFur platform. The system provides comprehensive role-based access control while maintaining flexibility for future enhancements.*
