import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, MapPin, LinkIcon, Users, FileText, Star } from 'lucide-react';

interface UserProfilePageProps {
  
}

const UserProfilePage: React.FC<UserProfilePageProps> = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }

      try {
        // Try to fetch user profile
        const response = await fetch(`/api/user/${username}`, {
          headers: {
            'Authorization': `Bearer ${authService.getSession()}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.user) {
            setUser(data.data.user);
            
            // Check if this is the current user's own profile
            const currentUser = await authService.getCurrentUser();
            setIsOwnProfile(currentUser?.username === username);
          } else {
            setError('User not found');
          }
        } else {
          setError('Failed to load user profile');
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Network error while loading profile');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/404" replace />;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'destructive';
      case 'creator':
        return 'default';
      case 'subscriber':
        return 'secondary';
      default:
        return 'outline-solid';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="text-lg md:text-xl">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{user.displayName}</h1>
                  {user.isVerified && (
                    <Badge variant="outline-solid" className="text-blue-600 border-blue-600">
                      <Star className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">@{user.username}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                  </Badge>
                  {user.subscriptionStatus && (
                    <Badge variant="outline-solid">
                      {user.subscriptionStatus}
                    </Badge>
                  )}
                </div>

                {user.bio && (
                  <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>
                )}
              </div>

              {/* Action Buttons */}
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{user.subscriberCount || 0}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{user.contentCount || 0}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </CardContent>
          </Card>
        </div>

        {/* Details Section */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Profile Details</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined:</span>
              <span>{formatDate(user.createdAt)}</span>
            </div>

            {user.website && (
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Website:</span>
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}

            {((user.twitter || user.socialLinks?.twitter) || (user.instagram || user.socialLinks?.instagram)) && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Social Links</h4>
                  {(user.twitter || user.socialLinks?.twitter) && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Twitter:</span>
                      <a 
                        href={`https://twitter.com/${user.twitter || user.socialLinks?.twitter}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @{user.twitter || user.socialLinks?.twitter}
                      </a>
                    </div>
                  )}
                  {(user.instagram || user.socialLinks?.instagram) && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Instagram:</span>
                      <a 
                        href={`https://instagram.com/${user.instagram || user.socialLinks?.instagram}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @{user.instagram || user.socialLinks?.instagram}
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
