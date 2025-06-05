import React, { useState, useMemo } from 'react';
import {
  FileText,
  Image,
  Video,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Clock,
  User,
  Calendar,
  TrendingUp,
  DollarSign,
  Heart,
  MessageSquare,
  Share,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminContent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

const ContentModeration: React.FC = () => {
  const {
    pendingContent,
    flaggedContent,
    users,
    moderateContent,
    flagContent,
    isLoading,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<AdminContent | null>(null);
  const [showContentDetails, setShowContentDetails] = useState(false);
  const [moderationNotes, setModerationNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const allContent = [...pendingContent, ...flaggedContent];

  const filteredContent = useMemo(() => {
    const targetContent = activeTab === 'pending' ? pendingContent : 
                         activeTab === 'flagged' ? flaggedContent : allContent;
    
    return targetContent.filter(content => {
      const matchesSearch = 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || content.moderationStatus === statusFilter;
      const matchesType = typeFilter === 'all' || content.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [pendingContent, flaggedContent, allContent, activeTab, searchQuery, statusFilter, typeFilter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      flagged: 'destructive',
    } as const;

    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      approved: <CheckCircle className="w-3 h-3 mr-1" />,
      rejected: <XCircle className="w-3 h-3 mr-1" />,
      flagged: <Flag className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {icons[status as keyof typeof icons]}
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleContentAction = async (contentId: string, action: string, notes?: string) => {
    try {
      await moderateContent(contentId, action, notes);
      
      toast({
        title: 'Success',
        description: `Content ${action} successful.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} content.`,
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedContent.length === 0) return;

    try {
      await Promise.all(
        selectedContent.map(contentId => handleContentAction(contentId, action, moderationNotes))
      );
      
      setSelectedContent([]);
      setModerationNotes('');
      
      toast({
        title: 'Success',
        description: `Bulk ${action} completed for ${selectedContent.length} items.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Bulk action failed.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getCreatorInfo = (creatorId: string) => {
    return users.find(user => user.id === creatorId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground">
            Review and moderate platform content
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingContent.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Flagged Content</p>
                <p className="text-2xl font-bold">{flaggedContent.length}</p>
              </div>
              <Flag className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">{allContent.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review
            {pendingContent.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {pendingContent.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged Content
            {flaggedContent.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {flaggedContent.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All Content</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search content by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedContent.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      {selectedContent.length} item{selectedContent.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Textarea
                      placeholder="Moderation notes (optional)"
                      value={moderationNotes}
                      onChange={(e) => setModerationNotes(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <div className="flex flex-col space-y-2">
                      <Button 
                        onClick={() => handleBulkAction('approved')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleBulkAction('rejected')}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredContent.map((content) => {
              const creator = getCreatorInfo(content.creatorId);
              return (
                <Card key={content.id} className="overflow-hidden">
                  <div className="relative">
                    {/* Content Preview */}
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      {content.thumbnailUrl ? (
                        <img 
                          src={content.thumbnailUrl} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                          {getTypeIcon(content.type)}
                          <span className="text-sm mt-2">{content.type.toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Checkbox */}
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedContent.includes(content.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedContent(prev => [...prev, content.id]);
                          } else {
                            setSelectedContent(prev => prev.filter(id => id !== content.id));
                          }
                        }}
                        className="bg-white border-gray-300"
                      />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(content.moderationStatus)}
                    </div>

                    {/* Flags */}
                    {content.flags.length > 0 && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="destructive" className="text-xs">
                          <Flag className="w-3 h-3 mr-1" />
                          {content.flags.length} flag{content.flags.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    {/* Creator Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={creator?.avatar} />
                        <AvatarFallback className="text-xs">
                          {creator?.displayName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">@{creator?.username}</span>
                    </div>

                    {/* Content Info */}
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{content.title}</h3>
                    {content.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {content.description}
                      </p>
                    )}

                    {/* Tags */}
                    {content.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {content.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {content.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{content.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Metrics */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatNumber(content.engagementMetrics.views)}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {formatNumber(content.engagementMetrics.likes)}
                        </div>
                      </div>
                      <span>{formatDate(content.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(content);
                          setShowContentDetails(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {content.moderationStatus === 'pending' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleContentAction(content.id, 'approved')}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleContentAction(content.id, 'rejected')}
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem 
                            onClick={() => flagContent(content.id, 'inappropriate')}
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            Flag Content
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <User className="w-4 h-4 mr-2" />
                            View Creator
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredContent.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Content Found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'pending' ? 'No content pending review.' :
                   activeTab === 'flagged' ? 'No flagged content.' :
                   'No content matches your filters.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Content Details Dialog */}
      <Dialog open={showContentDetails} onOpenChange={setShowContentDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Details</DialogTitle>
            <DialogDescription>
              Detailed content information and moderation options
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              {/* Content Preview */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                {selectedItem.thumbnailUrl ? (
                  <img 
                    src={selectedItem.thumbnailUrl} 
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {getTypeIcon(selectedItem.type)}
                    <span className="ml-2">{selectedItem.type.toUpperCase()} Content</span>
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <p className="mt-1 font-medium">{selectedItem.title}</p>
                  </div>
                  
                  {selectedItem.description && (
                    <div>
                      <Label>Description</Label>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedItem.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label>Creator</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={getCreatorInfo(selectedItem.creatorId)?.avatar} />
                        <AvatarFallback className="text-xs">
                          {getCreatorInfo(selectedItem.creatorId)?.displayName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>@{getCreatorInfo(selectedItem.creatorId)?.username}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedItem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedItem.moderationStatus)}
                    </div>
                  </div>

                  <div>
                    <Label>Engagement Metrics</Label>
                    <div className="mt-1 grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-2 text-blue-600" />
                        <span>{formatNumber(selectedItem.engagementMetrics.views)} views</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-red-600" />
                        <span>{formatNumber(selectedItem.engagementMetrics.likes)} likes</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                        <span>{formatNumber(selectedItem.engagementMetrics.comments)} comments</span>
                      </div>
                      <div className="flex items-center">
                        <Share className="w-4 h-4 mr-2 text-purple-600" />
                        <span>{formatNumber(selectedItem.engagementMetrics.shares)} shares</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Revenue</Label>
                    <div className="mt-1 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subscriptions:</span>
                        <span>{formatCurrency(selectedItem.revenue.subscriptions)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tips:</span>
                        <span>{formatCurrency(selectedItem.revenue.tips)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Direct:</span>
                        <span>{formatCurrency(selectedItem.revenue.direct)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Dates</Label>
                    <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                      <div>Created: {formatDate(selectedItem.createdAt)}</div>
                      <div>Updated: {formatDate(selectedItem.updatedAt)}</div>
                      {selectedItem.moderatedAt && (
                        <div>Moderated: {formatDate(selectedItem.moderatedAt)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flags and Reports */}
              {(selectedItem.flags.length > 0 || selectedItem.reports.length > 0) && (
                <div className="space-y-4">
                  {selectedItem.flags.length > 0 && (
                    <div>
                      <Label>Flags ({selectedItem.flags.length})</Label>
                      <div className="mt-2 space-y-2">
                        {selectedItem.flags.map((flag) => (
                          <div key={flag.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="destructive">{flag.reason}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(flag.flaggedAt)}
                              </span>
                            </div>
                            {flag.description && (
                              <p className="text-sm text-muted-foreground">{flag.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.reports.length > 0 && (
                    <div>
                      <Label>Reports ({selectedItem.reports.length})</Label>
                      <div className="mt-2 space-y-2">
                        {selectedItem.reports.map((report) => (
                          <div key={report.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{report.reason}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(report.reportedAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{report.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Moderation Notes */}
              {selectedItem.moderationNotes && (
                <div>
                  <Label>Moderation Notes</Label>
                  <p className="mt-1 text-sm text-muted-foreground p-3 bg-muted rounded">
                    {selectedItem.moderationNotes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedItem.moderationStatus === 'pending' && (
                <div className="flex items-center space-x-3 pt-4 border-t">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add moderation notes..."
                      value={moderationNotes}
                      onChange={(e) => setModerationNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => {
                        handleContentAction(selectedItem.id, 'approved', moderationNotes);
                        setShowContentDetails(false);
                        setModerationNotes('');
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleContentAction(selectedItem.id, 'rejected', moderationNotes);
                        setShowContentDetails(false);
                        setModerationNotes('');
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentModeration;