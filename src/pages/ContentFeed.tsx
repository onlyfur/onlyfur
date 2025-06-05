import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MoreHorizontal,
  Crown,
  Lock,
  Eye,
  Calendar,
  Tag,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Flag,
} from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Content } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const ContentFeed: React.FC = () => {
  const { contents } = useContent();
  const { user } = useAuth();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [likedContent, setLikedContent] = useState<Set<string>>(new Set());
  const [bookmarkedContent, setBookmarkedContent] = useState<Set<string>>(new Set());

  // Filter to show only published content
  const publishedContent = contents.filter(content => content.status === 'published');

  // Load user preferences from localStorage
  useEffect(() => {
    const liked = localStorage.getItem(`liked-content-${user?.id}`);
    const bookmarked = localStorage.getItem(`bookmarked-content-${user?.id}`);
    
    if (liked) {
      setLikedContent(new Set(JSON.parse(liked)));
    }
    if (bookmarked) {
      setBookmarkedContent(new Set(JSON.parse(bookmarked)));
    }
  }, [user?.id]);

  const savePreferences = (type: 'liked' | 'bookmarked', contentSet: Set<string>) => {
    localStorage.setItem(`${type}-content-${user?.id}`, JSON.stringify([...contentSet]));
  };

  const toggleLike = (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedContent = new Set(likedContent);
    
    if (newLikedContent.has(contentId)) {
      newLikedContent.delete(contentId);
      toast({
        description: "Removed from liked content",
      });
    } else {
      newLikedContent.add(contentId);
      toast({
        description: "Added to liked content",
      });
    }
    
    setLikedContent(newLikedContent);
    savePreferences('liked', newLikedContent);
  };

  const toggleBookmark = (contentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarkedContent = new Set(bookmarkedContent);
    
    if (newBookmarkedContent.has(contentId)) {
      newBookmarkedContent.delete(contentId);
      toast({
        description: "Removed from bookmarks",
      });
    } else {
      newBookmarkedContent.add(contentId);
      toast({
        description: "Added to bookmarks",
      });
    }
    
    setBookmarkedContent(newBookmarkedContent);
    savePreferences('bookmarked', newBookmarkedContent);
  };

  const shareContent = (content: Content, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: content.title,
        text: content.description,
        url: window.location.href + `content/${content.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.href + `content/${content.id}`);
      toast({
        description: "Link copied to clipboard",
      });
    }
  };

  const openContentViewer = (content: Content) => {
    setSelectedContent(content);
    setCurrentMediaIndex(0);
    setShowComments(false);
  };

  const closeContentViewer = () => {
    setSelectedContent(null);
    setIsPlaying(false);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!selectedContent?.mediaUrls) return;
    
    const maxIndex = selectedContent.mediaUrls.length - 1;
    if (direction === 'prev') {
      setCurrentMediaIndex(prev => prev > 0 ? prev - 1 : maxIndex);
    } else {
      setCurrentMediaIndex(prev => prev < maxIndex ? prev + 1 : 0);
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // Simulate comment submission
    toast({
      description: "Comment added successfully",
    });
    setNewComment('');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return new Date(date).toLocaleDateString();
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const canViewContent = (content: Content) => {
    if (content.privacyLevel === 'public') return true;
    if (!user) return false;
    if (content.creatorId === user.id) return true;
    // In a real app, check subscription status here
    return user.role === 'subscriber' || user.role === 'creator';
  };

  const ContentPreview: React.FC<{ content: Content }> = ({ content }) => {
    const isLiked = likedContent.has(content.id);
    const isBookmarked = bookmarkedContent.has(content.id);
    const canView = canViewContent(content);

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div
          className="relative aspect-square bg-muted cursor-pointer"
          onClick={() => canView && openContentViewer(content)}
        >
          {content.mediaUrl ? (
            <>
              {content.type === 'video' ? (
                <div className="relative w-full h-full">
                  <img
                    src={content.thumbnailUrl || content.mediaUrl}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-3">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  {content.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={content.mediaUrl}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              )}
              
              {content.mediaUrls && content.mediaUrls.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  1/{content.mediaUrls.length}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-sm font-medium">Text Post</p>
              </div>
            </div>
          )}

          {/* Overlay for restricted content */}
          {!canView && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center text-white">
                <Lock className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {content.privacyLevel === 'subscribers' ? 'Subscribers Only' : 'Premium Content'}
                </p>
                <Button size="sm" className="mt-2">
                  <Crown className="h-4 w-4 mr-1" />
                  Subscribe
                </Button>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Creator Info */}
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {content.creatorId.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Creator Name</p>
              <p className="text-xs text-muted-foreground">{formatDate(content.createdAt)}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content Title */}
          <h3 className="font-medium mb-2 line-clamp-2">{content.title}</h3>

          {/* Content Description */}
          {content.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {content.description}
            </p>
          )}

          {/* Tags */}
          {content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {content.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {content.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{content.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Interaction Bar */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => toggleLike(content.id, e)}
                className={isLiked ? 'text-red-500' : ''}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {content.likesCount + (isLiked ? 1 : 0)}
              </Button>
              
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                {content.commentsCount}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => shareContent(content, e)}
              >
                <Share2 className="h-4 w-4 mr-1" />
                {content.sharesCount}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => toggleBookmark(content.id, e)}
                className={isBookmarked ? 'text-blue-500' : ''}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Eye className="h-3 w-3 mr-1" />
                {formatViews(content.viewsCount)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Feed</h1>
        <p className="text-muted-foreground">
          Discover and enjoy content from creators you follow
        </p>
      </div>

      {/* Content Grid */}
      {publishedContent.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-medium mb-2">No content available</h3>
            <p className="text-muted-foreground mb-4">
              Start following creators to see their content here
            </p>
            <Button asChild>
              <Link to="/explore">Explore Creators</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publishedContent.map((content) => (
            <ContentPreview key={content.id} content={content} />
          ))}
        </div>
      )}

      {/* Full Screen Content Viewer */}
      <Dialog open={!!selectedContent} onOpenChange={closeContentViewer}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
          {selectedContent && (
            <div className="flex h-[95vh]">
              {/* Media Display */}
              <div className="flex-1 bg-black relative flex items-center justify-center">
                {selectedContent.mediaUrls && selectedContent.mediaUrls.length > 0 ? (
                  <>
                    {selectedContent.type === 'video' ? (
                      <video
                        src={selectedContent.mediaUrls[currentMediaIndex]}
                        controls
                        autoPlay={isPlaying}
                        muted={isMuted}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <img
                        src={selectedContent.mediaUrls[currentMediaIndex]}
                        alt={selectedContent.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    )}

                    {/* Navigation Arrows */}
                    {selectedContent.mediaUrls.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                          onClick={() => navigateMedia('prev')}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                          onClick={() => navigateMedia('next')}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                        
                        {/* Media Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {currentMediaIndex + 1} / {selectedContent.mediaUrls.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold mb-4">{selectedContent.title}</h2>
                    <p className="text-lg opacity-90 max-w-2xl">
                      {selectedContent.description}
                    </p>
                  </div>
                )}

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                  onClick={closeContentViewer}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Sidebar */}
              <div className="w-96 bg-background border-l flex flex-col">
                {/* Content Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {selectedContent.creatorId.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">Creator Name</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedContent.createdAt)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>

                  <h2 className="text-xl font-bold mb-2">{selectedContent.title}</h2>
                  
                  {selectedContent.description && (
                    <p className="text-muted-foreground mb-4">
                      {selectedContent.description}
                    </p>
                  )}

                  {/* Tags */}
                  {selectedContent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedContent.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Interaction Buttons */}
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      onClick={(e) => toggleLike(selectedContent.id, e)}
                      className={likedContent.has(selectedContent.id) ? 'text-red-500' : ''}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${likedContent.has(selectedContent.id) ? 'fill-current' : ''}`} />
                      {selectedContent.likesCount}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={() => setShowComments(!showComments)}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {selectedContent.commentsCount}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={(e) => shareContent(selectedContent, e)}
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex-1 overflow-y-auto">
                  {showComments ? (
                    <div className="p-6">
                      <h3 className="font-medium mb-4">Comments</h3>
                      
                      {/* Comment Form */}
                      <form onSubmit={submitComment} className="mb-6">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mb-2"
                        />
                        <Button type="submit" size="sm" disabled={!newComment.trim()}>
                          Post Comment
                        </Button>
                      </form>

                      {/* Comments List */}
                      <div className="space-y-4">
                        <div className="text-center text-muted-foreground py-8">
                          No comments yet. Be the first to comment!
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <h3 className="font-medium mb-4">Content Stats</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <Eye className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                          <p className="text-2xl font-bold">{formatViews(selectedContent.viewsCount)}</p>
                          <p className="text-sm text-muted-foreground">Views</p>
                        </div>
                        
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                          <p className="text-2xl font-bold">{selectedContent.likesCount}</p>
                          <p className="text-sm text-muted-foreground">Likes</p>
                        </div>
                        
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                          <p className="text-2xl font-bold">{selectedContent.commentsCount}</p>
                          <p className="text-sm text-muted-foreground">Comments</p>
                        </div>
                        
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <Share2 className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                          <p className="text-2xl font-bold">{selectedContent.sharesCount}</p>
                          <p className="text-sm text-muted-foreground">Shares</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentFeed;
