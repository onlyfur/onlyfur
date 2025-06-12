import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Bell,
  Shield,
  Image,
  Monitor,
  Save,
  RotateCcw,
  Check,
  AlertTriangle,
  Globe,
  Lock,
  Users,
  Mail,
  Smartphone,
  MessageSquare,
  Heart,
  DollarSign,
  Settings,
  Palette,
  Clock,
  Filter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  subscriptionUpdates: boolean;
  newFollowers: boolean;
  contentLikes: boolean;
  contentComments: boolean;
  directMessages: boolean;
  paymentNotifications: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  monthlyReport: boolean;
}

interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'subscribers_only';
  showOnlineStatus: boolean;
  allowDirectMessages: 'everyone' | 'subscribers_only' | 'none';
  showLastSeen: boolean;
  dataAnalytics: boolean;
  personalizedAds: boolean;
  showInSearch: boolean;
  allowTagging: boolean;
}

interface ContentPreferences {
  defaultContentVisibility: 'public' | 'subscribers_only' | 'private';
  allowComments: boolean;
  allowRatings: boolean;
  allowSharing: boolean;
  contentWarnings: boolean;
  ageRestriction: boolean;
  downloadProtection: boolean;
  watermarkContent: boolean;
}

interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  contentPerPage: number;
  autoplayVideos: boolean;
  showNSFWContent: boolean;
  blurNSFWThumbnails: boolean;
  compactMode: boolean;
}

interface AllPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  content: ContentPreferences;
  display: DisplayPreferences;
}

export default function UserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<AllPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/preferences');
      setPreferences(response.data.preferences);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = (category: keyof AllPreferences, updates: any) => {
    if (!preferences) return;
    
    setPreferences(prev => ({
      ...prev!,
      [category]: {
        ...prev![category],
        ...updates
      }
    }));
    setHasChanges(true);
  };

  const savePreferences = async (category?: keyof AllPreferences) => {
    if (!preferences) return;
    
    try {
      setIsSaving(true);
      
      if (category) {
        // Save specific category
        await api.put(`/preferences/${category}`, preferences[category]);
        toast.success(`${category} preferences saved successfully`);
      } else {
        // Save all preferences
        const savePromises = Object.entries(preferences).map(([cat, prefs]) =>
          api.put(`/preferences/${cat}`, prefs)
        );
        
        await Promise.all(savePromises);
        toast.success('All preferences saved successfully');
      }
      
      setHasChanges(false);
      
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const resetPreferences = async (category?: keyof AllPreferences) => {
    try {
      await api.post('/preferences/reset', category ? { category } : {});
      await loadPreferences();
      setHasChanges(false);
      toast.success(
        category 
          ? `${category} preferences reset to defaults`
          : 'All preferences reset to defaults'
      );
    } catch (error) {
      console.error('Failed to reset preferences:', error);
      toast.error('Failed to reset preferences');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Failed to load preferences</h3>
          <p className="text-muted-foreground mb-4">Please try refreshing the page.</p>
          <Button onClick={loadPreferences}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Preferences</h1>
          <p className="text-muted-foreground">
            Customize your OnlyFur experience
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="outline" className="bg-yellow-50">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Unsaved changes
            </Badge>
          )}
          <Button
            onClick={() => savePreferences()}
            disabled={!hasChanges || isSaving}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <Image className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center">
            <Monitor className="h-4 w-4 mr-2" />
            Display
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to be notified about activity on your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Methods */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Delivery Methods
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">Get notified via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.notifications.emailNotifications}
                      onCheckedChange={(checked) => 
                        updatePreferences('notifications', { emailNotifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push</p>
                        <p className="text-sm text-muted-foreground">Browser notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        updatePreferences('notifications', { pushNotifications: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-muted-foreground">Text messages</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.notifications.smsNotifications}
                      onCheckedChange={(checked) => 
                        updatePreferences('notifications', { smsNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Activity Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium">Activity Notifications</h4>
                
                <div className="space-y-3">
                  {[
                    { key: 'subscriptionUpdates', label: 'Subscription Updates', icon: Users },
                    { key: 'newFollowers', label: 'New Followers', icon: Users },
                    { key: 'contentLikes', label: 'Content Likes', icon: Heart },
                    { key: 'contentComments', label: 'Content Comments', icon: MessageSquare },
                    { key: 'directMessages', label: 'Direct Messages', icon: MessageSquare },
                    { key: 'paymentNotifications', label: 'Payment Notifications', icon: DollarSign },
                    { key: 'securityAlerts', label: 'Security Alerts', icon: Shield }
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={key} className="font-normal">{label}</Label>
                      </div>
                      <Switch
                        id={key}
                        checked={preferences.notifications[key as keyof NotificationPreferences] as boolean}
                        onCheckedChange={(checked) => 
                          updatePreferences('notifications', { [key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Marketing & Digests */}
              <div className="space-y-4">
                <h4 className="font-medium">Marketing & Digests</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="marketingEmails" className="font-normal">Marketing Emails</Label>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={preferences.notifications.marketingEmails}
                      onCheckedChange={(checked) => 
                        updatePreferences('notifications', { marketingEmails: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="weeklyDigest" className="font-normal">Weekly Digest</Label>
                    </div>
                    <Switch
                      id="weeklyDigest"
                      checked={preferences.notifications.weeklyDigest}
                      onCheckedChange={(checked) => 
                        updatePreferences('notifications', { weeklyDigest: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="monthlyReport" className="font-normal">Monthly Report</Label>
                    </div>
                    <Switch
                      id="monthlyReport"
                      checked={preferences.notifications.monthlyReport}
                      onCheckedChange={(checked) => 
                        updatePreferences('notifications', { monthlyReport: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  onClick={() => savePreferences('notifications')}
                  disabled={isSaving}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notifications
                </Button>
                <Button
                  onClick={() => resetPreferences('notifications')}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your profile and interact with your content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Visibility */}
              <div className="space-y-4">
                <h4 className="font-medium">Profile Visibility</h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Who can see your profile</Label>
                    <Select
                      value={preferences.privacy.profileVisibility}
                      onValueChange={(value) => 
                        updatePreferences('privacy', { profileVisibility: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Public - Anyone can see your profile
                          </div>
                        </SelectItem>
                        <SelectItem value="subscribers_only">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Subscribers Only - Only your subscribers
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 mr-2" />
                            Private - Only you can see your profile
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Who can send you direct messages</Label>
                    <Select
                      value={preferences.privacy.allowDirectMessages}
                      onValueChange={(value) => 
                        updatePreferences('privacy', { allowDirectMessages: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="subscribers_only">Subscribers Only</SelectItem>
                        <SelectItem value="none">No One</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Online Status */}
              <div className="space-y-4">
                <h4 className="font-medium">Online Status & Activity</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show online status</Label>
                      <p className="text-sm text-muted-foreground">Let others see when you're online</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showOnlineStatus}
                      onCheckedChange={(checked) => 
                        updatePreferences('privacy', { showOnlineStatus: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show last seen</Label>
                      <p className="text-sm text-muted-foreground">Show when you were last active</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showLastSeen}
                      onCheckedChange={(checked) => 
                        updatePreferences('privacy', { showLastSeen: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Data & Search */}
              <div className="space-y-4">
                <h4 className="font-medium">Data & Search</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data analytics</Label>
                      <p className="text-sm text-muted-foreground">Allow collection of usage data for improvements</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.dataAnalytics}
                      onCheckedChange={(checked) => 
                        updatePreferences('privacy', { dataAnalytics: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Personalized ads</Label>
                      <p className="text-sm text-muted-foreground">Show ads based on your interests</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.personalizedAds}
                      onCheckedChange={(checked) => 
                        updatePreferences('privacy', { personalizedAds: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show in search results</Label>
                      <p className="text-sm text-muted-foreground">Allow your profile to appear in search results</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showInSearch}
                      onCheckedChange={(checked) => 
                        updatePreferences('privacy', { showInSearch: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow tagging</Label>
                      <p className="text-sm text-muted-foreground">Let others tag you in their content</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.allowTagging}
                      onCheckedChange={(checked) => 
                        updatePreferences('privacy', { allowTagging: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  onClick={() => savePreferences('privacy')}
                  disabled={isSaving}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Privacy Settings
                </Button>
                <Button
                  onClick={() => resetPreferences('privacy')}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Content Preferences
              </CardTitle>
              <CardDescription>
                Set default settings for your content uploads and interactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Default Content Settings</h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Default content visibility</Label>
                    <Select
                      value={preferences.content.defaultContentVisibility}
                      onValueChange={(value) => 
                        updatePreferences('content', { defaultContentVisibility: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="subscribers_only">Subscribers Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Interaction Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Interaction Settings</h4>
                
                <div className="space-y-3">
                  {[
                    { key: 'allowComments', label: 'Allow comments on your content' },
                    { key: 'allowRatings', label: 'Allow ratings on your content' },
                    { key: 'allowSharing', label: 'Allow sharing of your content' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="font-normal">{label}</Label>
                      <Switch
                        id={key}
                        checked={preferences.content[key as keyof ContentPreferences] as boolean}
                        onCheckedChange={(checked) => 
                          updatePreferences('content', { [key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Content Protection */}
              <div className="space-y-4">
                <h4 className="font-medium">Content Protection</h4>
                
                <div className="space-y-3">
                  {[
                    { key: 'contentWarnings', label: 'Show content warnings' },
                    { key: 'ageRestriction', label: 'Restrict content to 18+' },
                    { key: 'downloadProtection', label: 'Prevent content downloads' },
                    { key: 'watermarkContent', label: 'Add watermark to content' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="font-normal">{label}</Label>
                      <Switch
                        id={key}
                        checked={preferences.content[key as keyof ContentPreferences] as boolean}
                        onCheckedChange={(checked) => 
                          updatePreferences('content', { [key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  onClick={() => savePreferences('content')}
                  disabled={isSaving}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Content Settings
                </Button>
                <Button
                  onClick={() => resetPreferences('content')}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Display Preferences
              </CardTitle>
              <CardDescription>
                Customize how the platform looks and behaves for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme & Appearance */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Theme & Appearance
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={preferences.display.theme}
                      onValueChange={(value) => 
                        updatePreferences('display', { theme: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={preferences.display.language}
                      onValueChange={(value) => 
                        updatePreferences('display', { language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Regional Settings */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Regional Settings
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={preferences.display.timezone}
                      onValueChange={(value) => 
                        updatePreferences('display', { timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={preferences.display.dateFormat}
                      onValueChange={(value) => 
                        updatePreferences('display', { dateFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={preferences.display.currency}
                      onValueChange={(value) => 
                        updatePreferences('display', { currency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Content Display */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Content Display
                </h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Content per page</Label>
                    <Select
                      value={preferences.display.contentPerPage.toString()}
                      onValueChange={(value) => 
                        updatePreferences('display', { contentPerPage: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 items</SelectItem>
                        <SelectItem value="20">20 items</SelectItem>
                        <SelectItem value="50">50 items</SelectItem>
                        <SelectItem value="100">100 items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autoplay videos</Label>
                      <p className="text-sm text-muted-foreground">Automatically play videos when scrolling</p>
                    </div>
                    <Switch
                      checked={preferences.display.autoplayVideos}
                      onCheckedChange={(checked) => 
                        updatePreferences('display', { autoplayVideos: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show NSFW content</Label>
                      <p className="text-sm text-muted-foreground">Display age-restricted content</p>
                    </div>
                    <Switch
                      checked={preferences.display.showNSFWContent}
                      onCheckedChange={(checked) => 
                        updatePreferences('display', { showNSFWContent: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Blur NSFW thumbnails</Label>
                      <p className="text-sm text-muted-foreground">Blur sensitive content previews</p>
                    </div>
                    <Switch
                      checked={preferences.display.blurNSFWThumbnails}
                      onCheckedChange={(checked) => 
                        updatePreferences('display', { blurNSFWThumbnails: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more condensed layout</p>
                    </div>
                    <Switch
                      checked={preferences.display.compactMode}
                      onCheckedChange={(checked) => 
                        updatePreferences('display', { compactMode: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  onClick={() => savePreferences('display')}
                  disabled={isSaving}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Display Settings
                </Button>
                <Button
                  onClick={() => resetPreferences('display')}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
