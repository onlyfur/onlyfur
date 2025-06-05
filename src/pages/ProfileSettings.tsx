import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/auth';
import { processImageFile, FURRY_SPECIES } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, Save, User, Star, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    species: user?.species || '',
    fursona: user?.fursona || '',
    location: user?.location || '',
    website: user?.website || '',
    twitter: user?.twitter || '',
    telegram: user?.telegram || '',
    isCreatorVerified: user?.isCreatorVerified || false,
    allowMessages: user?.allowMessages !== false,
    showOnlineStatus: user?.showOnlineStatus !== false,
    allowContentDownload: user?.allowContentDownload !== false,
    profileVisibility: user?.profileVisibility || 'public'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Avatar must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data } = await processImageFile(file);
      setAvatarPreview(data);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process image",
        variant: "destructive"
      });
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Banner must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data } = await processImageFile(file);
      setBannerPreview(data);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process image",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updates: any = { ...formData };
      
      if (avatarPreview) {
        updates.avatar = avatarPreview;
      }
      
      if (bannerPreview) {
        updates.banner = bannerPreview;
      }

      await updateUserProfile(user.id, updates);
      updateUser(updates);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please log in to access profile settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your OnlyFur profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="creator">Creator</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar & Banner */}
              <div className="space-y-4">
                <div className="relative">
                  {/* Banner */}
                  <div className="relative h-32 bg-gradient-to-r from-orange-400 to-purple-600 rounded-lg overflow-hidden">
                    {(bannerPreview || user.banner) && (
                      <img 
                        src={bannerPreview || user.banner} 
                        alt="Banner" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <label className="absolute bottom-2 right-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                      <div className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                        <Camera className="h-4 w-4" />
                      </div>
                    </label>
                  </div>
                  
                  {/* Avatar */}
                  <div className="absolute -bottom-8 left-6">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-4 border-white">
                        <AvatarImage src={avatarPreview || user.avatar} />
                        <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <label className="absolute bottom-0 right-0 cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <div className="bg-orange-500 text-white p-1 rounded-full hover:bg-orange-600 transition-colors">
                          <Camera className="h-3 w-3" />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    placeholder="Your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Your unique username"
                    disabled // Username changes require special handling
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Species</Label>
                  <Select value={formData.species} onValueChange={(value) => handleInputChange('species', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your species" />
                    </SelectTrigger>
                    <SelectContent>
                      {FURRY_SPECIES.map((species) => (
                        <SelectItem key={species} value={species}>
                          {species}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fursona">Fursona Name</Label>
                  <Input
                    id="fursona"
                    value={formData.fursona}
                    onChange={(e) => handleInputChange('fursona', e.target.value)}
                    placeholder="Your fursona's name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell others about yourself and your fursona..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Creator Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Creator Verification</h3>
                  <p className="text-sm text-gray-600">
                    {user.isCreatorVerified 
                      ? "You are a verified creator" 
                      : "Apply for creator verification to unlock additional features"
                    }
                  </p>
                </div>
                {user.isCreatorVerified ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Star className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    Apply for Verification
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowContentDownload">Allow Content Downloads</Label>
                    <p className="text-sm text-gray-600">Let subscribers download your content</p>
                  </div>
                  <Switch
                    id="allowContentDownload"
                    checked={formData.allowContentDownload}
                    onCheckedChange={(checked) => handleInputChange('allowContentDownload', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="@username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  value={formData.telegram}
                  onChange={(e) => handleInputChange('telegram', e.target.value)}
                  placeholder="@username"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowMessages">Allow Direct Messages</Label>
                    <p className="text-sm text-gray-600">Let other users send you messages</p>
                  </div>
                  <Switch
                    id="allowMessages"
                    checked={formData.allowMessages}
                    onCheckedChange={(checked) => handleInputChange('allowMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showOnlineStatus">Show Online Status</Label>
                    <p className="text-sm text-gray-600">Let others see when you're online</p>
                  </div>
                  <Switch
                    id="showOnlineStatus"
                    checked={formData.showOnlineStatus}
                    onCheckedChange={(checked) => handleInputChange('showOnlineStatus', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select 
                    value={formData.profileVisibility} 
                    onValueChange={(value) => handleInputChange('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Public
                        </div>
                      </SelectItem>
                      <SelectItem value="subscribers">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Subscribers Only
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <EyeOff className="h-4 w-4" />
                          Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
