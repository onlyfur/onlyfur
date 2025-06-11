import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Heart, 
  MessageCircle, 
  Share2, 
  Lock,
  Play,
  Image as ImageIcon,
  FileText,
  Crown,
  Verified
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Button } from '../components/ui/button';
import { formatDistanceToNow } from 'date-fns';

const LoadingSpinner: React.FC<{ size?: string }> = ({ size = '6' }) => (
  <svg
    className={`animate-spin h-${size} w-${size} text-gray-600`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  isVerified: boolean;
  createdAt: string;
  stats: {
    followers: number;
    contentCount: number;
  };
}

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'PHOTO' | 'VIDEO' | 'TEXT';
  mediaUrls?: string[];
  thumbnailUrl?: string;
  tier: string;
  createdAt: string;
  isBlurred: boolean;
  requiresSubscription: boolean;
  _count: {
    likes: number;
    comments: number;
  };
}

interface Subscription {
  tier: string;
  status: string;
  expiresAt: string;
}

interface CreatorPageData {
  creator: Creator;
  content: ContentItem[];
  subscription: Subscription | null;
}

const CreatorPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<CreatorPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (username) {
      fetchCreatorPage();
    }
  }, [username]);

  const fetchCreatorPage = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/creator/${username}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load creator page');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubscribing(true);
      // Implement subscription logic here
      await apiService.post(`/subscriptions/subscribe`, {
        creatorId: data?.creator.id,
        tier: 'BASIC'
      });
      await fetchCreatorPage(); // Refresh data
    } catch (err: any) {
      console.error('Subscription failed:', err);
    } finally {
      setSubscribing(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'PHOTO':
        return <ImageIcon className="w-4 h-4" />;
      case 'VIDEO':
        return <Play className="w-4 h-4" />;
      case 'TEXT':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="12" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Creator Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This creator page does not exist.'}</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const { creator, content, subscription } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-purple-500 to-pink-500">
        {creator.coverImage && (
          <img
            src={creator.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Profile Section */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={creator.avatar || '/default-avatar.png'}
                alt={creator.displayName}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              {creator.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <Verified className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{creator.displayName}</h1>
                {creator.isVerified && (
                  <Verified className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <p className="text-gray-600 mb-2">@{creator.username}</p>
              
              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>{formatNumber(creator.stats.followers)} followers</span>
                <span>{formatNumber(creator.stats.contentCount)} posts</span>
                <span>Joined {formatDistanceToNow(new Date(creator.createdAt))} ago</span>
              </div>
            </div>

            {/* Subscribe Button */}
            {user?.id !== creator.id && (
              <div className="flex flex-col space-y-2">
                {subscription ? (
                  <div className="text-center">
                    <div className="flex items-center space-x-2 text-green-600 mb-2">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-medium">Subscribed</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Expires {new Date(subscription.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {subscribing ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            )}
          </div>

          {/* Bio */}
          {creator.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700">{creator.bio}</p>
            </div>
          )}

          {/* Social Links */}
          {creator.socialLinks && Object.keys(creator.socialLinks).length > 0 && (
            <div className="mt-4 flex items-center space-x-4">
              {Object.entries(creator.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LinkIcon className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Posts</h2>
        
        {content.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Content Preview */}
                <div className="relative aspect-square bg-gray-100">
                  {item.thumbnailUrl && !item.isBlurred ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {item.isBlurred ? (
                        <div className="text-center">
                          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Subscription Required</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          {getContentIcon(item.type)}
                          <p className="text-sm text-gray-500 mt-2">{item.type}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Content Type Badge */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-black bg-opacity-50 rounded-full p-1">
                      {getContentIcon(item.type)}
                    </div>
                  </div>

                  {/* Tier Badge */}
                  {item.tier !== 'FREE' && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        {item.tier}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Engagement */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{formatNumber(item._count.likes)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{formatNumber(item._count.comments)}</span>
                      </span>
                    </div>
                    <span>{formatDistanceToNow(new Date(item.createdAt))} ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorPage;
