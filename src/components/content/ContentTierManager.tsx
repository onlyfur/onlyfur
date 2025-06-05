import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lock, 
  Eye, 
  Crown, 
  Star, 
  Heart, 
  Users,
  DollarSign,
  Settings,
  Check,
  X,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { Content, User, CreatorContentSettings, ContentAccessLevel } from '@/types';
import { subscriberTiers } from '@/data/subscriptionTiers';
import { useAuth } from '@/contexts/AuthContext';

interface ContentTierManagerProps {
  content?: Content;
  onSettingsChange?: (settings: Partial<CreatorContentSettings>) => void;
  onContentUpdate?: (content: Partial<Content>) => void;
  isCreating?: boolean;
}

const ContentTierManager: React.FC<ContentTierManagerProps> = ({
  content,
  onSettingsChange,
  onContentUpdate,
  isCreating = false
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('content');
  
  // Content-specific state
  const [privacyLevel, setPrivacyLevel] = useState<string>(
    content?.privacyLevel || 'public'
  );
  const [requiresSubscription, setRequiresSubscription] = useState(
    content?.requiresSubscription || false
  );
  const [scheduledAt, setScheduledAt] = useState<string>(
    content?.scheduledAt?.toISOString().slice(0, 16) || ''
  );
  
  // Creator settings state
  const [defaultPrivacy, setDefaultPrivacy] = useState<string>('public');
  const [allowedMessagingTiers, setAllowedMessagingTiers] = useState<string[]>([
    'basic-subscriber'
  ]);
  const [subscriptionPrice, setSubscriptionPrice] = useState<number>(9.99);
  const [tipSettings, setTipSettings] = useState({
    enabled: true,
    minimumAmount: 1,
    suggestedAmounts: [5, 10, 20, 50]
  });
  const [liveStreamSettings, setLiveStreamSettings] = useState({
    enabled: false,
    subscriberOnly: false,
    requiredTier: 'basic-subscriber'
  });
  
  // Custom access levels
  const [customLevels, setCustomLevels] = useState<ContentAccessLevel[]>([
    {
      id: 'vip-exclusive',
      name: 'VIP Exclusive',
      requiredTiers: ['vip-subscriber'],
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      icon: 'crown',
      description: 'Content only for VIP subscribers'
    }
  ]);

  const privacyOptions = [
    {
      value: 'public',
      label: 'Public',
      icon: Eye,
      description: 'Visible to everyone, including non-subscribers',
      color: 'bg-green-500'
    },
    {
      value: 'subscribers',
      label: 'Subscribers Only',
      icon: Heart,
      description: 'Visible to all your subscribers',
      color: 'bg-blue-500'
    },
    {
      value: 'premium',
      label: 'Premium Content',
      icon: Star,
      description: 'Requires Pro Subscriber tier or higher',
      color: 'bg-purple-500'
    },
    {
      value: 'private',
      label: 'VIP Exclusive',
      icon: Crown,
      description: 'Only for VIP subscribers',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500'
    }
  ];

  const handlePrivacyChange = (value: string) => {
    setPrivacyLevel(value);
    setRequiresSubscription(value !== 'public');
    
    if (onContentUpdate) {
      onContentUpdate({
        privacyLevel: value as any,
        requiresSubscription: value !== 'public'
      });
    }
  };

  const handleSubscriptionToggle = (checked: boolean) => {
    setRequiresSubscription(checked);
    
    if (onContentUpdate) {
      onContentUpdate({
        requiresSubscription: checked
      });
    }
  };

  const handleScheduleChange = (dateTime: string) => {
    setScheduledAt(dateTime);
    
    if (onContentUpdate) {
      onContentUpdate({
        scheduledAt: dateTime ? new Date(dateTime) : undefined,
        status: dateTime ? 'scheduled' : 'draft'
      });
    }
  };

  const handleMessagingTierToggle = (tierId: string) => {
    const newTiers = allowedMessagingTiers.includes(tierId)
      ? allowedMessagingTiers.filter(id => id !== tierId)
      : [...allowedMessagingTiers, tierId];
    
    setAllowedMessagingTiers(newTiers);
    
    if (onSettingsChange) {
      onSettingsChange({
        allowedMessagingTiers: newTiers
      });
    }
  };

  const addCustomAccessLevel = () => {
    const newLevel: ContentAccessLevel = {
      id: `custom-${Date.now()}`,
      name: 'Custom Level',
      requiredTiers: ['pro-subscriber'],
      color: 'bg-indigo-500',
      icon: 'star',
      description: 'Custom access level'
    };
    
    setCustomLevels([...customLevels, newLevel]);
  };

  const removeCustomAccessLevel = (id: string) => {
    setCustomLevels(customLevels.filter(level => level.id !== id));
  };

  const getSubscriberCount = (tierIds: string[]): number => {
    // Mock function - in real app, this would come from API
    const counts: Record<string, number> = {
      'basic-subscriber': 150,
      'pro-subscriber': 80,
      'vip-subscriber': 25
    };
    
    return tierIds.reduce((total, tierId) => total + (counts[tierId] || 0), 0);
  };

  const canUseFeature = (feature: string): boolean => {
    if (!user?.subscriptionTier?.creatorFeatures) return false;
    
    const features = user.subscriptionTier.creatorFeatures;
    
    switch (feature) {
      case 'contentTiers':
        return features.canSetContentTiers;
      case 'customPricing':
        return features.customPricing;
      case 'advancedScheduling':
        return features.advancedScheduling;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isCreating ? 'Content Settings' : 'Manage Content Access'}
        </h2>
        <p className="text-muted-foreground">
          Control who can see your content and how they can interact with you
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content Access</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>

        {/* Content Access Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacy Level
              </CardTitle>
              <CardDescription>
                Choose who can access this content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {privacyOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = privacyLevel === option.value;
                  
                  return (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'ring-2 ring-primary border-primary' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handlePrivacyChange(option.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center text-white`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{option.label}</h4>
                              {isSelected && <Check className="w-4 h-4 text-green-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                            {option.value !== 'public' && (
                              <div className="flex items-center gap-2 mt-1">
                                <Users className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  ~{getSubscriberCount(
                                    option.value === 'subscribers' ? ['basic-subscriber', 'pro-subscriber', 'vip-subscriber'] :
                                    option.value === 'premium' ? ['pro-subscriber', 'vip-subscriber'] :
                                    ['vip-subscriber']
                                  )} potential viewers
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {privacyLevel !== 'public' && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This content will require an active subscription to view.
                    Non-subscribers will see a blurred preview with subscription prompt.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Advanced Scheduling */}
          {canUseFeature('advancedScheduling') && (
            <Card>
              <CardHeader>
                <CardTitle>Advanced Scheduling</CardTitle>
                <CardDescription>
                  Schedule this content for future publication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-date">Publish Date & Time</Label>
                    <Input
                      id="schedule-date"
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => handleScheduleChange(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  {scheduledAt && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Content will be published on {new Date(scheduledAt).toLocaleString()}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Access Levels */}
          {canUseFeature('contentTiers') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Custom Access Levels
                  <Button onClick={addCustomAccessLevel} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Level
                  </Button>
                </CardTitle>
                <CardDescription>
                  Create custom content access tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customLevels.map((level) => (
                    <Card key={level.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded ${level.color} flex items-center justify-center text-white text-xs`}>
                              {level.icon === 'crown' ? <Crown className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{level.name}</h4>
                              <p className="text-sm text-muted-foreground">{level.description}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomAccessLevel(level.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Messaging Tab */}
        <TabsContent value="messaging" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Messaging Permissions</CardTitle>
              <CardDescription>
                Control which subscriber tiers can message you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriberTiers.map((tier) => {
                  const isAllowed = allowedMessagingTiers.includes(tier.id);
                  const Icon = tier.level === 'basic' ? Heart : 
                               tier.level === 'pro' ? Star : Crown;
                  
                  return (
                    <div key={tier.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${tier.color} flex items-center justify-center text-white`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{tier.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ~{getSubscriberCount([tier.id])} subscribers
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isAllowed}
                        onCheckedChange={() => handleMessagingTierToggle(tier.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Pricing</CardTitle>
              <CardDescription>
                Set your monthly subscription price
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subscription-price">Monthly Price (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="subscription-price"
                      type="number"
                      value={subscriptionPrice}
                      onChange={(e) => setSubscriptionPrice(Number(e.target.value))}
                      className="pl-9"
                      min="1"
                      max="100"
                      step="0.01"
                    />
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Platform fee: {user?.subscriptionTier?.creatorFeatures?.platformFeePercentage || 20}%
                    {' '}• You'll earn: ${(subscriptionPrice * (1 - (user?.subscriptionTier?.creatorFeatures?.platformFeePercentage || 20) / 100)).toFixed(2)} per subscriber
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tip Settings</CardTitle>
              <CardDescription>
                Configure how subscribers can tip you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tips-enabled">Enable Tips</Label>
                  <Switch
                    id="tips-enabled"
                    checked={tipSettings.enabled}
                    onCheckedChange={(checked) => 
                      setTipSettings({ ...tipSettings, enabled: checked })
                    }
                  />
                </div>

                {tipSettings.enabled && (
                  <>
                    <div>
                      <Label htmlFor="min-tip">Minimum Tip Amount ($)</Label>
                      <Input
                        id="min-tip"
                        type="number"
                        value={tipSettings.minimumAmount}
                        onChange={(e) => 
                          setTipSettings({ 
                            ...tipSettings, 
                            minimumAmount: Number(e.target.value) 
                          })
                        }
                        min="1"
                      />
                    </div>

                    <div>
                      <Label>Suggested Tip Amounts</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {tipSettings.suggestedAmounts.map((amount, index) => (
                          <Input
                            key={index}
                            type="number"
                            value={amount}
                            onChange={(e) => {
                              const newAmounts = [...tipSettings.suggestedAmounts];
                              newAmounts[index] = Number(e.target.value);
                              setTipSettings({ 
                                ...tipSettings, 
                                suggestedAmounts: newAmounts 
                              });
                            }}
                            min="1"
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1"
          onClick={() => {
            // Handle save logic
            console.log('Saving settings...');
          }}
        >
          {isCreating ? 'Create Content' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ContentTierManager;
