import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, Monitor, Moon, Sun, Bell, Shield, 
  Globe, Eye, Volume2, Palette, Zap, Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Appearance
    theme: theme,
    fontSize: 14,
    accentColor: 'orange',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    contentNotifications: true,
    marketingEmails: false,
    
    // Privacy
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowDirectMessages: true,
    showActivity: true,
    
    // Content
    autoplay: true,
    showNSFW: false,
    contentQuality: 'high',
    
    // Language & Region
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    
    // Accessibility
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    
    // Performance
    dataSaver: false,
    preloadContent: true,
    hardwareAcceleration: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Handle theme changes immediately
    if (key === 'theme') {
      setTheme(value);
    }
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('onlyfur-settings', JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'system',
      fontSize: 14,
      accentColor: 'orange',
      emailNotifications: true,
      pushNotifications: true,
      messageNotifications: true,
      contentNotifications: true,
      marketingEmails: false,
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowDirectMessages: true,
      showActivity: true,
      autoplay: true,
      showNSFW: false,
      contentQuality: 'high',
      language: 'en',
      timezone: 'UTC',
      currency: 'USD',
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
      dataSaver: false,
      preloadContent: true,
      hardwareAcceleration: true
    };
    
    setSettings(defaultSettings);
    localStorage.removeItem('onlyfur-settings');
    
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults",
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please log in to access settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your OnlyFur experience</p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex gap-4">
                  <Button
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSettingChange('theme', 'light')}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSettingChange('theme', 'dark')}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSettingChange('theme', 'system')}
                    className="flex items-center gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Accent Color</Label>
                <div className="flex gap-3">
                  {['orange', 'purple', 'blue', 'green', 'red', 'pink'].map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSettingChange('accentColor', color)}
                      className={`w-12 h-12 rounded-full p-0 ${
                        settings.accentColor === color ? 'ring-2 ring-offset-2 ring-current' : ''
                      }`}
                      style={{ backgroundColor: `var(--${color}-500)` }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Font Size: {settings.fontSize}px</Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => handleSettingChange('fontSize', value)}
                  min={12}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>New Messages</Label>
                    <p className="text-sm text-gray-600">Notify when you receive messages</p>
                  </div>
                  <Switch
                    checked={settings.messageNotifications}
                    onCheckedChange={(checked) => handleSettingChange('messageNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Content Updates</Label>
                    <p className="text-sm text-gray-600">Notify about new content from creators you follow</p>
                  </div>
                  <Switch
                    checked={settings.contentNotifications}
                    onCheckedChange={(checked) => handleSettingChange('contentNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Receive promotional content and updates</p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select 
                    value={settings.profileVisibility} 
                    onValueChange={(value) => handleSettingChange('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="subscribers">Subscribers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-gray-600">Let others see when you're online</p>
                  </div>
                  <Switch
                    checked={settings.showOnlineStatus}
                    onCheckedChange={(checked) => handleSettingChange('showOnlineStatus', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-gray-600">Let other users message you</p>
                  </div>
                  <Switch
                    checked={settings.allowDirectMessages}
                    onCheckedChange={(checked) => handleSettingChange('allowDirectMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Activity</Label>
                    <p className="text-sm text-gray-600">Display your activity status</p>
                  </div>
                  <Switch
                    checked={settings.showActivity}
                    onCheckedChange={(checked) => handleSettingChange('showActivity', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Content Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autoplay Media</Label>
                    <p className="text-sm text-gray-600">Automatically play videos and GIFs</p>
                  </div>
                  <Switch
                    checked={settings.autoplay}
                    onCheckedChange={(checked) => handleSettingChange('autoplay', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show NSFW Content</Label>
                    <p className="text-sm text-gray-600">Display adult content (18+ only)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">18+</Badge>
                    <Switch
                      checked={settings.showNSFW}
                      onCheckedChange={(checked) => handleSettingChange('showNSFW', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content Quality</Label>
                  <Select 
                    value={settings.contentQuality} 
                    onValueChange={(value) => handleSettingChange('contentQuality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Data Saver)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => handleSettingChange('language', value)}
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

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select 
                    value={settings.timezone} 
                    onValueChange={(value) => handleSettingChange('timezone', value)}
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
                      <SelectItem value="Europe/Berlin">Berlin</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select 
                    value={settings.currency} 
                    onValueChange={(value) => handleSettingChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Accessibility & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>High Contrast Mode</Label>
                    <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reduce Motion</Label>
                    <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                  </div>
                  <Switch
                    checked={settings.reduceMotion}
                    onCheckedChange={(checked) => handleSettingChange('reduceMotion', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Screen Reader Support</Label>
                    <p className="text-sm text-gray-600">Enhanced accessibility features</p>
                  </div>
                  <Switch
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => handleSettingChange('screenReader', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Saver Mode</Label>
                    <p className="text-sm text-gray-600">Reduce data usage</p>
                  </div>
                  <Switch
                    checked={settings.dataSaver}
                    onCheckedChange={(checked) => handleSettingChange('dataSaver', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Preload Content</Label>
                    <p className="text-sm text-gray-600">Load content in advance for faster browsing</p>
                  </div>
                  <Switch
                    checked={settings.preloadContent}
                    onCheckedChange={(checked) => handleSettingChange('preloadContent', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Hardware Acceleration</Label>
                    <p className="text-sm text-gray-600">Use GPU for better performance</p>
                  </div>
                  <Switch
                    checked={settings.hardwareAcceleration}
                    onCheckedChange={(checked) => handleSettingChange('hardwareAcceleration', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={resetSettings}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
          <Download className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
