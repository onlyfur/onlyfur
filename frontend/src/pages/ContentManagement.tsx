import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
  Archive,
  MoreHorizontal,
  Play,
  Image as ImageIcon,
  FileText,
  Globe,
  Users,
  Crown,
  Lock,
  Clock,
  TrendingUp,
  BarChart3,
  Download,
  Settings,
} from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { Content, ContentFilter } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const {
    contents,
    categories,
    stats,
    deleteContent,
    publishContent,
    archiveContent,
    filterContent,
    searchContent,
  } = useContent();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const [filters, setFilters] = useState<ContentFilter>({
    type: 'all',
    status: 'all',
    privacyLevel: 'all',
    sortBy: 'newest',
  });

  // Filter and search content
  const filteredContent = useMemo(() => {
    let result = contents;

    // Apply filters
    result = filterContent(filters);

    // Apply search
    if (searchQuery.trim()) {
      result = searchContent(searchQuery);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'mostViewed':
          return b.viewsCount - a.viewsCount;
        case 'mostLiked':
          return b.likesCount - a.likesCount;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [contents, filters, searchQuery, filterContent, searchContent]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return ImageIcon;
      case 'video':
        return Play;
      case 'text':
        return FileText;
      default:
        return FileText;
    }
  };

  const getPrivacyIcon = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'public':
        return Globe;
      case 'subscribers':
        return Users;
      case 'premium':
        return Crown;
      case 'private':
        return Lock;
      default:
        return Globe;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleContentAction = async (action: string, content: Content) => {
    try {
      switch (action) {
        case 'publish':
          await publishContent(content.id);
          break;
        case 'archive':
          await archiveContent(content.id);
          break;
        case 'edit':
          navigate(`/content/edit/${content.id}`);
          break;
        case 'view':
          setSelectedContent(content);
          break;
        case 'delete':
          setContentToDelete(content);
          break;
        case 'analytics':
          setSelectedContent(content);
          setShowAnalytics(true);
          break;
      }
    } catch (error) {
      console.error('Failed to perform action:', error);
    }
  };

  const confirmDelete = async () => {
    if (contentToDelete) {
      try {
        await deleteContent(contentToDelete.id);
        setContentToDelete(null);
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Manage, organize, and track your content performance
          </p>
        </div>
        <Button asChild>
          <Link to="/content/upload">
            <Plus className="w-4 h-4 mr-2" />
            Create Content
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                  <p className="text-2xl font-bold">{stats.totalContent}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{formatViews(stats.totalViews)}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                  <p className="text-2xl font-bold">{stats.totalLikes}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                  <p className="text-2xl font-bold">{stats.averageEngagement}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content by title, description, or tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="photo">Photos</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="text">Text Posts</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy || 'newest'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="mostViewed">Most Viewed</SelectItem>
                  <SelectItem value="mostLiked">Most Liked</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Display */}
      {filteredContent.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No content found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || Object.values(filters).some(f => f !== 'all' && f !== 'newest')
                ? 'Try adjusting your search or filters'
                : 'Start creating content to see it here'}
            </p>
            <Button asChild>
              <Link to="/content/upload">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Content
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => {
            const ContentIcon = getContentIcon(content.type);
            const PrivacyIcon = getPrivacyIcon(content.privacyLevel);
            
            return (
              <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Media Preview */}
                <div className="aspect-video bg-muted relative">
                  {content.mediaUrl ? (
                    content.type === 'video' ? (
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
                      </div>
                    ) : (
                      <img
                        src={content.mediaUrl}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ContentIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <Badge className={`absolute top-2 left-2 ${getStatusColor(content.status)}`}>
                    {content.status}
                  </Badge>
                  
                  {/* Privacy Icon */}
                  <div className="absolute top-2 right-2">
                    <PrivacyIcon className="h-4 w-4 text-white drop-shadow-lg" />
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium line-clamp-2 flex-1">{content.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleContentAction('view', content)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContentAction('edit', content)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContentAction('analytics', content)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {content.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleContentAction('publish', content)}>
                            <Globe className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {content.status === 'published' && (
                          <DropdownMenuItem onClick={() => handleContentAction('archive', content)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleContentAction('delete', content)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

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
                          {tag}
                        </Badge>
                      ))}
                      {content.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{content.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(content.viewsCount)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{content.likesCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{content.commentsCount}</span>
                      </div>
                    </div>
                    <span>{formatDate(content.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // List View
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredContent.map((content) => {
                const ContentIcon = getContentIcon(content.type);
                const PrivacyIcon = getPrivacyIcon(content.privacyLevel);
                
                return (
                  <div key={content.id} className="p-4 flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-muted rounded-md shrink-0 relative">
                      {content.mediaUrl ? (
                        <img
                          src={content.thumbnailUrl || content.mediaUrl}
                          alt={content.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ContentIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium truncate">{content.title}</h3>
                        <Badge className={`${getStatusColor(content.status)} text-xs`}>
                          {content.status}
                        </Badge>
                        <PrivacyIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      {content.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {content.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{content.category}</span>
                        <span>{formatDate(content.createdAt)}</span>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{formatViews(content.viewsCount)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{content.likesCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleContentAction('view', content)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContentAction('edit', content)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContentAction('analytics', content)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {content.status === 'draft' && (
                          <DropdownMenuItem onClick={() => handleContentAction('publish', content)}>
                            <Globe className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {content.status === 'published' && (
                          <DropdownMenuItem onClick={() => handleContentAction('archive', content)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleContentAction('delete', content)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Detail Dialog */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedContent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedContent.title}</DialogTitle>
                <DialogDescription>
                  {formatDate(selectedContent.createdAt)} • {selectedContent.category}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Media Display */}
                {selectedContent.mediaUrl && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    {selectedContent.type === 'video' ? (
                      <video
                        src={selectedContent.mediaUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={selectedContent.mediaUrl}
                        alt={selectedContent.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Content Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedContent.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(selectedContent.status)}>
                          {selectedContent.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Privacy:</span>
                        <span className="capitalize">{selectedContent.privacyLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{selectedContent.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="capitalize">{selectedContent.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedContent.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Performance Stats */}
                <div>
                  <h4 className="font-medium mb-2">Performance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Eye className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                      <p className="text-2xl font-bold">{formatViews(selectedContent.viewsCount)}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Heart className="h-6 w-6 mx-auto mb-1 text-red-500" />
                      <p className="text-2xl font-bold">{selectedContent.likesCount}</p>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <MessageCircle className="h-6 w-6 mx-auto mb-1 text-green-500" />
                      <p className="text-2xl font-bold">{selectedContent.commentsCount}</p>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Share2 className="h-6 w-6 mx-auto mb-1 text-purple-500" />
                      <p className="text-2xl font-bold">{selectedContent.sharesCount}</p>
                      <p className="text-xs text-muted-foreground">Shares</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!contentToDelete} onOpenChange={() => setContentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{contentToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentManagement;
