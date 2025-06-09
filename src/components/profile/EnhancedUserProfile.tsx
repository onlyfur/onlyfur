import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Settings, MapPin, Calendar, Link as LinkIcon, Users, Heart, MessageCircle, Share2, Edit } from 'lucide-react';
import { apiClientEnhanced } from '../../services/apiClientEnhanced';
import { formatDate } from '../../utils/formatters';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  subscriptionStatus: string;
  authProvider: string;
  socialLinks?: any;
  preferredLanguage?: string;
  timezone?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  stats?: {
    contentCount: number;
    totalViews: number;
    followersCount: number;
    followingCount: number;
  };
}

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  thumbnailUrl?: string;
  views: number;
  createdAt: string;
  isPremium: boolean;
}

const EnhancedUserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'followers' | 'following'>('content');
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProfile();
      checkIfOwnProfile();
    }
  }, [userId]);

  const checkIfOwnProfile = async () => {
    try {
      const currentUser = await apiClientEnhanced.getCurrentProfile();
      setIsOwnProfile(currentUser.user?.id === userId);
    } catch (error) {
      setIsOwnProfile(false);
    }
  };

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const profileResponse = await apiClientEnhanced.getUserProfile(userId!);
      setProfile(profileResponse.profile);

      const contentResponse = await apiClientEnhanced.getContentFeed({
        limit: 12
      });
      setContent(contentResponse.content || []);

      if (isOwnProfile) {
        const [followersResponse, followingResponse] = await Promise.all([
          apiClientEnhanced.getUserFollowers(userId!, { limit: 20 }),
          apiClientEnhanced.getUserFollowing(userId!, { limit: 20 })
        ]);
        setFollowers(followersResponse.followers || []);
        setFollowing(followingResponse.following || []);
      }

    } catch (error: any) {
      setError(apiClientEnhanced.handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await apiClientEnhanced.unfollowUser(userId!);
        setIsFollowing(false);
      } else {
        await apiClientEnhanced.followUser(userId!);
        setIsFollowing(true);
      }
    } catch (error: any) {
      setError(apiClientEnhanced.handleError(error));
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleContentClick = (contentId: string) => {
    navigate(`/content/${contentId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-700 rounded-lg mb-6"></div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading profile</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button
            onClick={loadProfile}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Profile not found</div>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-64 bg-gradient-to-r from-orange-600 to-pink-600">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt={profile.displayName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            {profile.isVerified && (
              <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">{profile.displayName}</h1>
                <p className="text-gray-400">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-gray-300 mt-2 max-w-md">{profile.bio}</p>
                )}
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={handleEditProfile}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        isFollowing
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>
                    <button className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats?.contentCount || 0}</div>
                <div className="text-gray-400 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats?.followersCount || 0}</div>
                <div className="text-gray-400 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats?.followingCount || 0}</div>
                <div className="text-gray-400 text-sm">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.stats?.totalViews || 0}</div>
                <div className="text-gray-400 text-sm">Views</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4 text-gray-400 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </div>
              {profile.timezone && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.timezone}</span>
                </div>
              )}
              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <div className="flex items-center space-x-1">
                  <LinkIcon className="w-4 h-4" />
                  <span>Links available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Content ({profile.stats?.contentCount || 0})
            </button>
            {isOwnProfile && (
              <>
                <button
                  onClick={() => setActiveTab('followers')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'followers'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Followers ({profile.stats?.followersCount || 0})
                </button>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'following'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Following ({profile.stats?.followingCount || 0})
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {content.length > 0 ? (
                content.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleContentClick(item.id)}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-750 transition-colors"
                  >
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.views} views</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      {item.isPremium && (
                        <div className="mt-2">
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Premium
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No content yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'followers' && isOwnProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <div
                    key={follower.id}
                    onClick={() => navigate(`/profile/${follower.id}`)}
                    className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={follower.avatar || '/default-avatar.png'}
                        alt={follower.displayName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{follower.displayName}</h3>
                        <p className="text-gray-400 text-sm">@{follower.username}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No followers yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'following' && isOwnProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {following.length > 0 ? (
                following.map((followedUser) => (
                  <div
                    key={followedUser.id}
                    onClick={() => navigate(`/profile/${followedUser.id}`)}
                    className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={followedUser.avatar || '/default-avatar.png'}
                        alt={followedUser.displayName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{followedUser.displayName}</h3>
                        <p className="text-gray-400 text-sm">@{followedUser.username}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Not following anyone yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserProfile;
