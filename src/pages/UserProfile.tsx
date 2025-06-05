import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Edit,
  Heart,
  Users,
  MessageCircle,
  Star,
  Share,
  Flag,
  UserPlus,
  UserMinus,
  Camera
} from 'lucide-react';
import { userAPI, uploadAPI } from '@/services/api';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: 'SUBSCRIBER' | 'CREATOR' | 'ADMIN';
  bio?: string;
  location?: string;
  joinDate: string;
  isVerified: boolean;
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    website?: string;
  };
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  subscriptionTier?: {
    id: string;
    name: string;
    color: string;
  };
  isFollowing?: boolean;
  isOwnProfile: boolean;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    socialLinks: {
      twitter: '',
      telegram: '',
      discord: '',
      website: ''
    }
  });

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userAPI.getProfile(userId);
      
      // Transform API data to UserProfile interface
      const transformedProfile: UserProfile = {
        id: profileData.id,
        username: profileData.username,
        displayName: profileData.displayName,
        avatar: profileData.avatar,
        role: profileData.role,
        bio: profileData.bio || '',
        location: profileData.location || '',
        joinDate: profileData.createdAt,
        isVerified: profileData.isVerified || false,
        socialLinks: profileData.socialLinks || {},
        stats: {
          followers: profileData._count?.followers || 0,
          following: profileData._count?.following || 0,
          posts: profileData._count?.content || 0,
        },
        subscriptionTier: profileData.platformSubscriptionTier,
        isFollowing: profileData.isFollowing || false,
        isOwnProfile: currentUser?.id === profileData.id
      };

      setProfile(transformedProfile);
      
      // Set edit form data
      setEditForm({
        displayName: transformedProfile.displayName,
        bio: transformedProfile.bio || '',
        location: transformedProfile.location || '',
        socialLinks: transformedProfile.socialLinks || {
          twitter: '', telegram: '', discord: '', website: ''
        }
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile || profile.isOwnProfile) return;

    try {
      if (profile.isFollowing) {
        await userAPI.unfollow(profile.id);
        setProfile(prev => prev ? {
          ...prev,
          isFollowing: false,
          stats: { ...prev.stats, followers: prev.stats.followers - 1 }
        } : null);
        toast({
          title: 'Unfollowed',
          description: `You unfollowed ${profile.displayName}`,
        });
      } else {
        await userAPI.follow(profile.id);
        setProfile(prev => prev ? {
          ...prev,
          isFollowing: true,
          stats: { ...prev.stats, followers: prev.stats.followers + 1 }
        } : null);
        toast({
          title: 'Following',
          description: `You are now following ${profile.displayName}`,
        });
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update follow status',
        variant: 'destructive',
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!profile?.isOwnProfile) return;

    try {
      await userAPI.updateProfile(editForm);
      await loadProfile(); // Reload profile data
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.isOwnProfile) return;

    try {
      const uploadResult = await uploadAPI.uploadAvatar(file);
      await userAPI.updateProfile({ avatar: uploadResult.url });
      await loadProfile(); // Reload to get updated avatar
      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    }
  };

  const handleMessage = () => {
    if (!profile) return;
    navigate(`/messages?user=${profile.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar} alt={profile.displayName} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
                  {profile.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {profile.isOwnProfile && (
                <label className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/80">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                <Badge variant="secondary" className="capitalize">
                  {profile.role.toLowerCase()}
                </Badge>
                {profile.isVerified && (
                  <Badge className="bg-blue-500">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {profile.subscriptionTier && (
                  <Badge style={{ backgroundColor: profile.subscriptionTier.color }}>
                    <Star className="w-3 h-3 mr-1" />
                    {profile.subscriptionTier.name}
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-2">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>
              )}
              
              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <div className="font-bold">{profile.stats.posts}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profile.stats.followers}</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profile.stats.following}</div>
                  <div className="text-xs text-muted-foreground">Following</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-center md:justify-start space-x-3">
                {profile.isOwnProfile ? (
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Update your profile information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={editForm.displayName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveProfile} className="flex-1">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <>
                    <Button onClick={handleFollow} variant={profile.isFollowing ? "outline" : "default"}>
                      {profile.isFollowing ? (
                        <><UserMinus className="w-4 h-4 mr-2" />Unfollow</>
                      ) : (
                        <><UserPlus className="w-4 h-4 mr-2" />Follow</>
                      )}
                    </Button>
                    <Button onClick={handleMessage} variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content Tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About {profile.displayName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
              </div>
              
              {profile.socialLinks && Object.entries(profile.socialLinks).some(([_, url]) => url) && (
                <div>
                  <h4 className="font-semibold mb-2">Social Links</h4>
                  <div className="space-y-2">
                    {Object.entries(profile.socialLinks).map(([platform, url]) => 
                      url && (
                        <div key={platform} className="flex items-center space-x-2">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="posts">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Posts content will be displayed here once content management is integrated.
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gallery">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Gallery content will be displayed here once media management is integrated.
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Activity feed will be displayed here once activity tracking is implemented.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
