import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Calendar,
  PieChart,
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminPayment, CreatorPayout } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from '@/hooks/use-toast';

const PaymentManagement: React.FC = () => {
  const {
    payments,
    payouts,
    users,
    platformAnalytics,
    processRefund,
    processPayout,
    isLoading,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<CreatorPayout | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPayoutDetails, setShowPayoutDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('payments');

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const user = users.find(u => u.id === payment.userId);
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesType = typeFilter === 'all' || payment.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [payments, users, searchQuery, statusFilter, typeFilter]);

  const filteredPayouts = useMemo(() => {
    return payouts.filter(payout => {
      const creator = users.find(u => u.id === payout.creatorId);
      const matchesSearch = 
        payout.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator?.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [payouts, users, searchQuery, statusFilter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      processing: 'secondary',
      failed: 'destructive',
      cancelled: 'destructive',
    } as const;

    const icons = {
      completed: <CheckCircle className="w-3 h-3 mr-1" />,
      pending: <Clock className="w-3 h-3 mr-1" />,
      processing: <RefreshCw className="w-3 h-3 mr-1" />,
      failed: <XCircle className="w-3 h-3 mr-1" />,
      cancelled: <XCircle className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {icons[status as keyof typeof icons]}
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      stripe: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      paypal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };

    return (
      <Badge className={colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {method.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleRefund = async (paymentId: string, amount: number, reason: string) => {
    try {
      await processRefund(paymentId, amount, reason);
      toast({
        title: 'Success',
        description: 'Refund processed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process refund.',
        variant: 'destructive',
      });
    }
  };

  const handlePayout = async (creatorId: string, amount: number) => {
    try {
      await processPayout(creatorId, amount);
      toast({
        title: 'Success',
        description: 'Payout processed successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payout.',
        variant: 'destructive',
      });
    }
  };

  // Mock chart data
  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Math.floor(Math.random() * 10000) + 5000,
    fees: Math.floor(Math.random() * 1000) + 500,
  }));

  const paymentMethodData = [
    { name: 'Stripe', value: 65, color: '#8B5CF6' },
    { name: 'PayPal', value: 35, color: '#3B82F6' },
  ];

  const totalRevenue = platformAnalytics?.overview?.totalRevenue || 0;
  const totalPayouts = payouts.reduce((sum, payout) => sum + payout.amount, 0);
  const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const failedPayments = payments.filter(p => p.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">
            Monitor payments, process payouts, and analyze financial data
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPayouts)}</p>
                <div className="flex items-center mt-1">
                  <ArrowDownLeft className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">{payouts.length} processed</span>
                </div>
              </div>
              <ArrowDownLeft className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                <p className="text-2xl font-bold">{formatCurrency(pendingPayouts)}</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-sm text-yellow-600">
                    {payouts.filter(p => p.status === 'pending').length} pending
                  </span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Payments</p>
                <p className="text-2xl font-bold">{failedPayments}</p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">
                    {((failedPayments / payments.length) * 100).toFixed(1)}% failure rate
                  </span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Fees Trend</CardTitle>
            <CardDescription>Daily revenue and processing fees over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="fees" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.6}
                  name="Fees"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution of payment processors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethodData.map((method) => (
                <div key={method.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: method.color }}
                    />
                    <span className="text-sm font-medium">{method.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{method.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search payments by ID, user, or transaction..."
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="tip">Tip</SelectItem>
                    <SelectItem value="payout">Payout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const user = users.find(u => u.id === payment.userId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">
                          {payment.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user?.avatar} />
                              <AvatarFallback className="text-xs">
                                {user?.displayName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user?.displayName}</p>
                              <p className="text-xs text-muted-foreground">@{user?.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatCurrency(payment.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              Fee: {formatCurrency(payment.fees.total)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline-solid">{payment.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(payment.paymentMethod)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payment.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(payment.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowPaymentDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
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
                                <DropdownMenuItem>View Transaction</DropdownMenuItem>
                                {payment.status === 'completed' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleRefund(payment.id, payment.amount, 'Admin refund')}
                                  >
                                    Process Refund
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Contact User</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          {/* Payouts Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Creator Payouts</CardTitle>
                  <CardDescription>Manage and process creator payouts</CardDescription>
                </div>
                <Button onClick={() => handlePayout('user-1', 1000)}>
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Process Payout
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => {
                    const creator = users.find(u => u.id === payout.creatorId);
                    return (
                      <TableRow key={payout.id}>
                        <TableCell className="font-mono text-sm">
                          {payout.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={creator?.avatar} />
                              <AvatarFallback className="text-xs">
                                {creator?.displayName?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{creator?.displayName}</p>
                              <p className="text-xs text-muted-foreground">@{creator?.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payout.amount)}
                        </TableCell>
                        <TableCell className="text-red-600">
                          -{formatCurrency(payout.fees)}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(payout.netAmount)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(payout.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payout.period.start.toLocaleDateString()} - {payout.period.end.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPayout(payout);
                                setShowPayoutDetails(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {payout.status === 'pending' && (
                                  <DropdownMenuItem>Cancel Payout</DropdownMenuItem>
                                )}
                                <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subscriptions</span>
                    <span className="font-medium">{formatCurrency(platformAnalytics?.financial?.revenue?.subscriptions || 0)}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tips</span>
                    <span className="font-medium">{formatCurrency(platformAnalytics?.financial?.revenue?.tips || 0)}</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pay-per-view</span>
                    <span className="font-medium">{formatCurrency(platformAnalytics?.financial?.revenue?.payPerView || 0)}</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Fee Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Fees</span>
                    <span className="font-medium">{formatCurrency(platformAnalytics?.financial?.fees?.platformFees || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processing Fees</span>
                    <span className="font-medium">{formatCurrency(platformAnalytics?.financial?.fees?.processingFees || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total Fees</span>
                    <span className="font-bold">{formatCurrency(platformAnalytics?.financial?.fees?.totalFees || 0)}</span>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    {platformAnalytics?.financial?.fees?.feePercentage || 0}% of total revenue
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payout Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Payout Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Payouts</span>
                    <span className="font-medium">{formatCurrency(platformAnalytics?.financial?.payouts?.totalPayouts || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Payouts</span>
                    <span className="font-medium">{formatCurrency(platformAnalytics?.financial?.payouts?.pendingPayouts || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Processing Time</span>
                    <span className="font-medium">{platformAnalytics?.financial?.payouts?.averagePayoutTime || 0} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Failure Rate</span>
                    <span className="font-medium">{platformAnalytics?.financial?.payouts?.payoutFailureRate || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detailed information about payment {selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{selectedPayment.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span>{selectedPayment.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span>{getStatusBadge(selectedPayment.status)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Fee Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>{formatCurrency(selectedPayment.fees.platform)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processor Fee:</span>
                      <span>{formatCurrency(selectedPayment.fees.processor)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Fees:</span>
                      <span>{formatCurrency(selectedPayment.fees.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Processing Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono">{selectedPayment.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span>{selectedPayment.processingDetails.processingTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Score:</span>
                    <span>{selectedPayment.riskScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retry Count:</span>
                    <span>{selectedPayment.processingDetails.retryCount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payout Details Dialog */}
      <Dialog open={showPayoutDetails} onOpenChange={setShowPayoutDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payout Details</DialogTitle>
            <DialogDescription>
              Detailed information about payout {selectedPayout?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayout && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Payout Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedPayout.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fees:</span>
                      <span className="text-red-600">-{formatCurrency(selectedPayout.fees)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Net Amount:</span>
                      <span className="text-green-600">{formatCurrency(selectedPayout.netAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span>{getStatusBadge(selectedPayout.status)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{selectedPayout.paymentMethod.type}</span>
                    </div>
                    {selectedPayout.paymentMethod.details.accountNumber && (
                      <div className="flex justify-between">
                        <span>Account:</span>
                        <span className="font-mono">{selectedPayout.paymentMethod.details.accountNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Period</h4>
                <div className="text-sm">
                  {selectedPayout.period.start.toLocaleDateString()} - {selectedPayout.period.end.toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManagement;