import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  Calendar,
  DollarSign,
  Download,
  Eye,
  MoreHorizontal,
  Pause,
  Play,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Crown,
  Filter,
  Search,
} from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction, Subscription, PaymentMethod, Invoice } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const Billing: React.FC = () => {
  const { user } = useAuth();
  const {
    userSubscriptions,
    paymentMethods,
    transactions,
    invoices,
    cancelSubscription,
    resumeSubscription,
    removePaymentMethod,
    setDefaultPaymentMethod,
    addPaymentMethod,
    isLoading,
  } = usePayment();

  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'subscriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [paymentMethodType, setPaymentMethodType] = useState<'stripe' | 'paypal'>('stripe');

  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Calculate billing summary
  const monthlyTotal = userSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => {
      // In real app, would get tier price from subscription tiers
      return total + 1999; // Mock price
    }, 0);

  const nextBilling = userSubscriptions
    .filter(sub => sub.status === 'active')
    .reduce((earliest, sub) => {
      return !earliest || sub.currentPeriodEnd < earliest 
        ? sub.currentPeriodEnd 
        : earliest;
    }, null as Date | null);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline-solid"> = {
      'active': 'default',
      'completed': 'default',
      'pending': 'secondary',
      'processing': 'secondary',
      'cancelled': 'destructive',
      'failed': 'destructive',
      'past_due': 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline-solid'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await cancelSubscription(subscriptionId);
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription will remain active until the end of the current billing period.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      await resumeSubscription(subscriptionId);
      toast({
        title: 'Subscription Resumed',
        description: 'Your subscription has been successfully resumed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resume subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    try {
      await removePaymentMethod(paymentMethodId);
      toast({
        title: 'Payment Method Removed',
        description: 'Payment method has been successfully removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove payment method. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId);
      toast({
        title: 'Default Payment Method Updated',
        description: 'Payment method has been set as default.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update default payment method. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddPaymentMethod = async (formData: any) => {
    try {
      await addPaymentMethod(formData);
      setShowAddPaymentDialog(false);
      toast({
        title: 'Payment Method Added',
        description: 'Your payment method has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add payment method. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage your subscriptions, payment methods, and billing history
          </p>
        </div>
      </div>

      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Total</p>
                <p className="text-2xl font-bold">{formatPrice(monthlyTotal)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold">
                  {userSubscriptions.filter(sub => sub.status === 'active').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Billing</p>
                <p className="text-2xl font-bold">
                  {nextBilling ? formatDate(nextBilling) : 'No active subscriptions'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          {userSubscriptions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Active Subscriptions</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't subscribed to any creators yet.
                </p>
                <Button onClick={() => window.location.href = '/explore'}>
                  Explore Creators
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userSubscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">Creator Subscription</h4>
                          <p className="text-sm text-muted-foreground">
                            Premium Tier • Subscribed {formatDate(subscription.createdAt)}
                          </p>
                          <div className="flex items-center mt-2">
                            {getStatusIcon(subscription.status)}
                            <span className="ml-2 text-sm">{getStatusBadge(subscription.status)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatPrice(1999)}/month</div>
                        <div className="text-sm text-muted-foreground">
                          Next billing: {formatDate(subscription.currentPeriodEnd)}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="mt-2">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Subscription Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd ? (
                              <DropdownMenuItem 
                                onClick={() => handleCancelSubscription(subscription.id)}
                                className="text-red-600"
                              >
                                <Pause className="w-4 h-4 mr-2" />
                                Cancel Subscription
                              </DropdownMenuItem>
                            ) : subscription.cancelAtPeriodEnd ? (
                              <DropdownMenuItem 
                                onClick={() => handleResumeSubscription(subscription.id)}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Resume Subscription
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {subscription.cancelAtPeriodEnd && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This subscription is set to cancel on {formatDate(subscription.currentPeriodEnd)}. 
                          You'll continue to have access until then.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Saved Payment Methods</h3>
            <Button onClick={() => setShowAddPaymentDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>

          {paymentMethods.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
                <p className="text-muted-foreground mb-4">
                  Add a payment method to subscribe to creators.
                </p>
                <Button onClick={() => setShowAddPaymentDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((paymentMethod) => (
                <Card key={paymentMethod.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {paymentMethod.type === 'stripe' 
                                ? `•••• •••• •••• ${paymentMethod.last4}`
                                : paymentMethod.paypalEmail
                              }
                            </h4>
                            {paymentMethod.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {paymentMethod.type === 'stripe' 
                              ? `${paymentMethod.brand?.toUpperCase()} • Expires ${paymentMethod.expiryMonth}/${paymentMethod.expiryYear}`
                              : 'PayPal Account'
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added {formatDate(paymentMethod.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Payment Method Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {!paymentMethod.isDefault && (
                            <DropdownMenuItem 
                              onClick={() => handleSetDefaultPaymentMethod(paymentMethod.id)}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Set as Default
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleRemovePaymentMethod(paymentMethod.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="tip">Tip</SelectItem>
                <SelectItem value="one_time">One-time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {formatDate(transaction.createdAt)}
                      </TableCell>
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
                          {transaction.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.paymentMethodType}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(transaction.status)}
                          <span className="ml-2">{getStatusBadge(transaction.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                Complete details for transaction {transaction.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTransaction && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Transaction ID</Label>
                                    <p className="text-sm">{selectedTransaction.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Date</Label>
                                    <p className="text-sm">{formatDate(selectedTransaction.createdAt)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Amount</Label>
                                    <p className="text-sm">{formatPrice(selectedTransaction.amount)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <p className="text-sm">{getStatusBadge(selectedTransaction.status)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Payment Method</Label>
                                    <p className="text-sm capitalize">{selectedTransaction.paymentMethodType}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Type</Label>
                                    <p className="text-sm">{selectedTransaction.type}</p>
                                  </div>
                                </div>
                                <Separator />
                                <div>
                                  <Label className="text-sm font-medium">Description</Label>
                                  <p className="text-sm">{selectedTransaction.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Fees</Label>
                                    <p className="text-sm">{formatPrice(selectedTransaction.fees)}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Net Amount</Label>
                                    <p className="text-sm">{formatPrice(selectedTransaction.netAmount)}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Invoices Available</h3>
              <p className="text-muted-foreground">
                Your invoices will appear here once you have subscription payments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method to your account for subscriptions and purchases.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Payment Method Type Selection */}
            <div className="space-y-3">
              <Label>Payment Method Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={paymentMethodType === 'stripe' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethodType('stripe')}
                  className="h-12 flex flex-col items-center justify-center"
                >
                  <CreditCard className="h-4 w-4 mb-1" />
                  <span className="text-xs">Credit Card</span>
                </Button>
                <Button
                  variant={paymentMethodType === 'paypal' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethodType('paypal')}
                  className="h-12 flex flex-col items-center justify-center"
                >
                  <span className="text-sm font-semibold text-blue-600">PayPal</span>
                </Button>
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethodType === 'stripe' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Expiry Month</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Expiry Year</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvc">Security Code (CVC)</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {paymentMethodType === 'paypal' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You'll be redirected to PayPal to complete the setup process.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox id="setDefault" />
              <Label htmlFor="setDefault" className="text-sm">
                Set as default payment method
              </Label>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAddPaymentDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Real form validation and submission would go here
                  toast({
                    title: "Form Required",
                    description: "Please fill out the payment method form and submit it properly.",
                    variant: "destructive",
                  });
                }}
              >
                Add Payment Method
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;