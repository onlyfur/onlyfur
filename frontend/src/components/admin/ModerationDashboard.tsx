import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  User, 
  Clock, 
  MessageSquare,
  Flag,
  Ban,
  AlertCircle,
  Filter,
  Search,
  Download,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { createProductionApiCall } from '@/utils/productionApi';

interface ContentReport {
  id: string;
  contentId: string;
  contentType: 'image' | 'video' | 'text' | 'profile';
  contentTitle: string;
  contentPreview?: string;
  reportedBy: {
    id: string;
    username: string;
    avatar?: string;
  };
  creator: {
    id: string;
    username: string;
    avatar?: string;
    isVerified: boolean;
  };
  reason: string;
  customReason?: string;
  status: 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    id: string;
    username: string;
  };
  resolution?: string;
  aiConfidence?: number;
  tags: string[];
}

interface ModerationStats {
  totalReports: number;
  pendingReports: number;
  resolvedToday: number;
  averageResponseTime: number;
  topReasons: Array<{ reason: string; count: number; }>;
  moderationQueue: number;
}

const ModerationDashboard: React.FC = () => {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [resolution, setResolution] = useState('');
  const [action, setAction] = useState<'approve' | 'remove' | 'warn' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchModerationData();
    fetchStats();
    
    // Set up real-time updates only in development or when page is visible
    let interval: NodeJS.Timeout | null = null;
    
    const setupPolling = () => {
      if (!document.hidden && (import.meta.env.DEV || window.location.pathname.includes('/admin'))) {
        // Reduced frequency: refresh every 2 minutes instead of 30 seconds
        interval = setInterval(() => {
          if (!document.hidden) {
            fetchModerationData();
            fetchStats();
          }
        }, 120000); // 2 minutes
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      } else {
        setupPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    setupPolling();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const fetchModerationData = async () => {
    try {
      const response = await fetch('/api/moderation/queue', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch moderation data:', error);
      toast({
        title: "Error",
        description: "Failed to load moderation queue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/moderation/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch moderation stats:', error);
    }
  };

  const handleReportAction = async (reportId: string, actionType: 'approve' | 'remove' | 'warn' | 'dismiss') => {
    try {
      const apiCall = createProductionApiCall(`/api/moderation/reports/${reportId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: actionType,
          resolution: resolution || `Content ${actionType}d by moderator`
        })
      });

      const data = await apiCall();
      if (data) {
        await fetchModerationData();
        await fetchStats();
        setReviewDialogOpen(false);
        setResolution('');
        setSelectedReport(null);

        toast({
          title: "Action completed",
          description: `Report has been ${actionType}d successfully`
        });
      } else {
        throw new Error('Failed to process action');
      }
    } catch (error) {
      console.error('Failed to process moderation action:', error);
      toast({
        title: "Error",
        description: "Failed to process moderation action",
        variant: "destructive"
      });
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesReason = reasonFilter === 'all' || report.reason === reasonFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesReason;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'NORMAL':
        return 'bg-blue-500';
      case 'LOW':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'border-yellow-500 text-yellow-700 bg-yellow-50';
      case 'REVIEWING':
        return 'border-blue-500 text-blue-700 bg-blue-50';
      case 'RESOLVED':
        return 'border-green-500 text-green-700 bg-green-50';
      case 'DISMISSED':
        return 'border-gray-500 text-gray-700 bg-gray-50';
      default:
        return 'border-gray-500 text-gray-700 bg-gray-50';
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'inappropriate_content':
        return <AlertTriangle className="w-4 h-4" />;
      case 'spam':
        return <MessageSquare className="w-4 h-4" />;
      case 'harassment':
        return <Flag className="w-4 h-4" />;
      case 'copyright':
        return <Shield className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Moderation</h2>
          <p className="text-muted-foreground">
            Review and manage reported content
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => fetchModerationData()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <Flag className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">
                All time reports
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting action
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
              <p className="text-xs text-muted-foreground">
                Completed reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.averageResponseTime / 60)}m</div>
              <p className="text-xs text-muted-foreground">
                Time to resolution
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REVIEWING">Reviewing</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All reasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="copyright">Copyright</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setReasonFilter('all');
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Moderation Queue ({filteredReports.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No reports match your current filters</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(report.priority)}`} />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium truncate">{report.contentTitle}</h4>
                            <Badge variant="outline-solid" className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <Badge variant="secondary">{report.contentType}</Badge>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center space-x-1">
                              {getReasonIcon(report.reason)}
                              <span>{report.reason.replace('_', ' ')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={report.creator.avatar} />
                                  <AvatarFallback>
                                    {report.creator.username.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">@{report.creator.username}</span>
                                {report.creator.isVerified && (
                                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                                )}
                              </div>

                              <div className="text-sm text-muted-foreground">
                                Reported by @{report.reportedBy.username}
                              </div>
                            </div>

                            {report.aiConfidence && (
                              <Badge variant="outline-solid" className="text-xs">
                                AI: {Math.round(report.aiConfidence * 100)}%
                              </Badge>
                            )}
                          </div>

                          {report.customReason && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>Additional details:</strong> {report.customReason}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setReviewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleReportAction(report.id, 'approve')}
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Content
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReportAction(report.id, 'remove')}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Remove Content
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReportAction(report.id, 'warn')}
                              className="text-orange-600"
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Warn Creator
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReportAction(report.id, 'dismiss')}
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Dismiss Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Take appropriate action on this reported content
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-medium mb-2">Content Details</h4>
                  <div className="p-3 border rounded bg-muted/50">
                    <p><strong>Title:</strong> {selectedReport.contentTitle}</p>
                    <p><strong>Type:</strong> {selectedReport.contentType}</p>
                    <p><strong>Creator:</strong> @{selectedReport.creator.username}</p>
                    {selectedReport.contentPreview && (
                      <p><strong>Preview:</strong> {selectedReport.contentPreview}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Report Details</h4>
                  <div className="p-3 border rounded bg-muted/50">
                    <p><strong>Reason:</strong> {selectedReport.reason.replace('_', ' ')}</p>
                    <p><strong>Reported by:</strong> @{selectedReport.reportedBy.username}</p>
                    <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                    {selectedReport.customReason && (
                      <p><strong>Additional details:</strong> {selectedReport.customReason}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                  <Textarea
                    placeholder="Add notes about your decision..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReportAction(selectedReport.id, 'dismiss')}
                  className="text-gray-600"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Dismiss
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReportAction(selectedReport.id, 'warn')}
                  className="text-orange-600"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Warn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReportAction(selectedReport.id, 'approve')}
                  className="text-green-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReportAction(selectedReport.id, 'remove')}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationDashboard;
