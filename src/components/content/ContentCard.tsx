import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  Clock,
  Crown,
  Star,
  Lock
} from 'lucide-react';
import { Content, User, PlatformSubscriptionTier } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import ContentAccessControl from './ContentAccessControl';

interface ContentCardProps {
  content: Content;
  creator: User;
  isNewestPost?: boolean;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  creator,
  isNewestPost = false,
  className = ''
}) => {
  const { user } = useAuth();

  const getPrivacyIcon = () => {
    switch (content.privacyLevel) {
      case 'premium':
        return <Star className="w-4 h-4 text-purple-500" />;
      case 'private':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'subscribers':
        return <Heart className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getPrivacyBadgeColor = () => {
    switch (content.privacyLevel) {
      case 'premium':
        return 'bg-purple-500';
      case 'private':
        return 'bg-linear-to-r from-yellow-400 to-orange-500';
      case 'subscribers':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const ContentPreview = () => (
    <div className="space-y-4">
      {/* Creator Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={creator.avatar} alt={creator.displayName} />
            <AvatarFallback>{creator.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-sm">{creator.displayName}</h4>
              {creator.role === 'creator' && (
                <Badge variant="secondary" className="text-xs">
                  Creator
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(content.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isNewestPost && (
            <Badge className="bg-green-500 text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Free Preview
            </Badge>
          )}
          {content.privacyLevel !== 'public' && (
            <Badge className={`text-white text-xs ${getPrivacyBadgeColor()}`}>
              {getPrivacyIcon()}
              <span className="ml-1 capitalize">{content.privacyLevel}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {content.title && (
          <h3 className="font-bold text-lg leading-tight">{content.title}</h3>
        )}
        
        {content.description && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {content.description}
          </p>
        )}

        {/* Media Preview */}
        {content.mediaUrl && (
          <div className="relative rounded-lg overflow-hidden bg-muted">
            {content.type === 'photo' ? (
              <img 
                src={content.mediaUrl} 
                alt={content.title || 'Content image'}
                className="w-full h-64 object-cover"
              />
            ) : content.type === 'video' ? (
              <div className="w-full h-64 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Video Content</p>
                  {content.duration && (
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(content.duration / 60)}:{String(content.duration % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Text Content</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {content.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline-solid" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {content.tags.length > 3 && (
              <Badge variant="outline-solid" className="text-xs">
                +{content.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{content.likesCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{content.commentsCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{content.viewsCount}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <ContentAccessControl
      content={content}
      isNewestPost={isNewestPost}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <ContentPreview />
        </CardContent>
      </Card>
    </ContentAccessControl>
  );
};

export default ContentCard;
