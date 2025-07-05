import React, { useState, useEffect } from 'react';
import { creatorDashboardAPI } from '@/services/creatorDashboardAPI';
import type { RevenueData } from '@/services/creatorDashboardAPI';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Banknote,
  CreditCard,
  Building,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Plus,
  Wallet,
} from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Revenue, Payout, Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const Earnings: React.FC = () => {
  const { user } = useAuth();
  const {
    paymentAnalytics,
    payouts,
    revenue,
    transactions,
    requestPayout,
    refreshAnalytics,
    isLoading,
  } = usePayment();

  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
    bankName: '',
  });
  const [paypalEmail, setPaypalEmail] = useState('');

  // Revenue data loaded from API
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);

  // Load revenue data on component mount
  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      setIsLoadingRevenue(true);
      const data = await creatorDashboardAPI.getRevenueData('year');
      setRevenueData(data);
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setIsLoadingRevenue(false);
    }
  };

  const tierRevenueData = [
    { name: 'Basic', value: 44955, subscribers: 45, color: '#3B82F6' },
    { name: 'Premium', value: 45977, subscribers: 23, color: '#8B5CF6' },
    { name: 'VIP', value: 39992, subscribers: 8, color: '#F59E0B' },
  ];

  const paymentMethodData = [
    { name: 'Credit Card', value: 68.4, color: '#3B82F6' },
    { name: 'PayPal', value: 25.0, color: '#00C4CC' },
    { name: 'Apple Pay', value: 6.6, color: '#000000' },
  ];

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline-solid"> = {
      'pending': 'secondary',
      'processing': 'secondary',
      'paid': 'default',
      'failed': 'destructive',
      'cancelled': 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline-solid'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payout amount.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payoutMethodData = payoutMethod === 'paypal' 
        ? { type: 'paypal', paypalEmail }
        : { type: 'bank_transfer', bankDetails };

      await requestPayout(parseFloat(payoutAmount), payoutMethodData);
      
      toast({
        title: 'Payout Requested',
        description: `Your payout of $${payoutAmount} has been requested and will be processed within 5-7 business days.`,
      });
      
      setPayoutDialogOpen(false);
      setPayoutAmount('');
    } catch (error) {
      toast({
        title: 'Payout Failed',
        description: 'Failed to request payout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Calculate available balance from real data
  const [earningsBreakdown, setEarningsBreakdown] = useState({
    subscriptions: 0,
    tips: 0,
    contentSales: 0,
    commissions: 0,
    total: 0
  });

  // Load earnings breakdown
  useEffect(() => {
    loadEarningsBreakdown();
  }, []);

  const loadEarningsBreakdown = async () => {
    try {
      const breakdown = await creatorDashboardAPI.getEarningsBreakdown('month');
      setEarningsBreakdown(breakdown);
    } catch (error) {
      console.error('Error loading earnings breakdown:', error);
    }
  };

  const totalEarnings = earningsBreakdown.total;
  const totalPayouts = payouts.reduce((sum, payout) => sum + payout.amount, 0);
  const availableBalance = totalEarnings - totalPayouts;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Earnings Dashboard</h1>
          <p className="text-muted-foreground">
            Track your revenue, manage payouts, and analyze your earnings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={refreshAnalytics}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Banknote className="w-4 h-4 mr-2" />
                Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
                <DialogDescription>
                  Request a payout from your available earnings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Available Balance:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(availableBalance)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payout Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      max={availableBalance / 100}
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum: {formatPrice(availableBalance)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label>Payout Method</Label>
                    <RadioGroup value={payoutMethod} onValueChange={setPayoutMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank_transfer" id="bank" />
                        <Label htmlFor="bank" className="flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Bank Transfer (5-7 business days)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center">
                          <Wallet className="w-4 h-4 mr-2" />
                          PayPal (1-2 business days)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {payoutMethod === 'bank_transfer' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={bankDetails.accountNumber}
                            onChange={(e) => setBankDetails(prev => ({ 
                              ...prev, 
                              accountNumber: e.target.value 
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            value={bankDetails.routingNumber}
                            onChange={(e) => setBankDetails(prev => ({ 
                              ...prev, 
                              routingNumber: e.target.value 
                            }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={bankDetails.bankName}
                            onChange={(e) => setBankDetails(prev => ({ 
                              ...prev, 
                              bankName: e.target.value 
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Type</Label>
                          <Select value={bankDetails.accountType} onValueChange={(value: string) =>
                            setBankDetails(prev => ({ ...prev, accountType: value as 'checking' | 'savings' }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="paypalEmail">PayPal Email</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setPayoutDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRequestPayout} disabled={isLoading}>
                    Request Payout
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatPrice(paymentAnalytics?.totalRevenue || 0)}
                </p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {paymentAnalytics?.revenueGrowth || 0}%
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  {formatPrice(paymentAnalytics?.monthlyRevenue || 0)}
                </p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  12.5%
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Subscribers</p>
                <p className="text-2xl font-bold">
                  {paymentAnalytics?.activeSubscriptions || 0}
                </p>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  8 new this month
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold">
                  {formatPrice(availableBalance)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ready for payout
                </p>
              </div>
              <Banknote className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and subscriber growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? formatPrice(value as number) : value,
                        name === 'revenue' ? 'Revenue' : 'Subscribers'
                      ]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                    <Line type="monotone" dataKey="subscribers" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Tier</CardTitle>
                <CardDescription>Distribution of earnings across subscription tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tierRevenueData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {tierRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatPrice(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Earning Content */}
          <Card>
            <CardHeader>
              <CardTitle>Top Earning Content</CardTitle>
              <CardDescription>Your highest revenue-generating content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentAnalytics?.topEarningContent?.map((content, index) => (
                  <div key={content.contentId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {content.views} views
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatPrice(content.revenue)}</div>
                      <div className="text-sm text-muted-foreground">revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue breakdown by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatPrice(value as number)} />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment methods used by subscribers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Detailed analysis of your earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatPrice(14100 * 100)}</div>
                  <div className="text-sm text-muted-foreground">Subscription Revenue</div>
                  <div className="text-xs text-muted-foreground">90.4% of total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatPrice(1200 * 100)}</div>
                  <div className="text-sm text-muted-foreground">Tips Revenue</div>
                  <div className="text-xs text-muted-foreground">7.7% of total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatPrice(300 * 100)}</div>
                  <div className="text-sm text-muted-foreground">One-time Purchases</div>
                  <div className="text-xs text-muted-foreground">1.9% of total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Track your payout requests and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No payouts requested yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{formatDate(payout.createdAt)}</TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(payout.amount)}
                        </TableCell>
                        <TableCell className="capitalize">
                          {payout.payoutMethodType.replace('_', ' ')}
                        </TableCell>
                        <TableCell>{getStatusBadge(payout.status)}</TableCell>
                        <TableCell>{formatDate(payout.scheduledFor)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                 )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>All earnings transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Fees</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {transaction.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline-solid">
                          {transaction.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        -{formatPrice(transaction.fees)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatPrice(transaction.netAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Earnings;