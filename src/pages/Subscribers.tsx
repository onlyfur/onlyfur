import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers, getUserAnalytics } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Search, MessageSquare, Star, TrendingUp, DollarSign, Calendar, Send, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Subscriber {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  subscriptionTier: string;
  subscriptionDate: Date;
  totalSpent: number;
  lastActive: Date;
  species?: string;
  isActive: boolean;
}

export default function Subscribers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [messageModal, setMessageModal] = useState<{ open: boolean; recipient?: Subscriber }>({ open: false });
  const [bulkMessage, setBulkMessage] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  // Generate mock subscriber data
  useEffect(() => {
    if (!user) return;

    const generateMockSubscribers = (): Subscriber[] => {
      const tiers = ['basic', 'premium', 'vip'];
      const species = ['Fox', 'Wolf', 'Cat', 'Dragon', 'Tiger', 'Rabbit'];
      
      return Array.from({ length: 45 }, (_, i) => ({
        id: `subscriber-${i + 1}`,
        username: `user${i + 1}`,
        displayName: `Subscriber ${i + 1}`,
        avatar: `/images/branding/paw-logo.jpg`,
        subscriptionTier: tiers[Math.floor(Math.random() * tiers.length)],
        subscriptionDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        totalSpent: Math.floor(Math.random() * 500) + 25,
        lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        species: species[Math.floor(Math.random() * species.length)],
        isActive: Math.random() > 0.2
      }));
    };

    const mockData = generateMockSubscribers();
    setSubscribers(mockData);
    setFilteredSubscribers(mockData);
    setIsLoading(false);
  }, [user]);

  // Filter and sort subscribers
  useEffect(() => {
    let filtered = subscribers.filter(sub => {
      const matchesSearch = sub.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sub.displayName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = filterTier === 'all' || sub.subscriptionTier === filterTier;
      
      return matchesSearch && matchesTier;
    });

    // Sort subscribers
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.subscriptionDate.getTime() - a.subscriptionDate.getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => a.subscriptionDate.getTime() - b.subscriptionDate.getTime());
        break;
      case 'spending':
        filtered.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
      case 'activity':
        filtered.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
        break;
    }

    setFilteredSubscribers(filtered);
  }, [subscribers, searchTerm, filterTier, sortBy]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'vip': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierPrice = (tier: string) => {
    switch (tier) {
      case 'basic': return '$12';
      case 'premium': return '$25';
      case 'vip': return '$50';
      default: return '$0';
    }
  };

  const handleSendMessage = (subscriber: Subscriber) => {
    setMessageModal({ open: true, recipient: subscriber });
  };

  const handleSendBulkMessage = () => {
    if (selectedSubscribers.length === 0) {
      toast({
        title: "No subscribers selected",
        description: "Please select subscribers to send a message to",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message sent",
      description: `Message sent to ${selectedSubscribers.length} subscribers`,
    });
    setSelectedSubscribers([]);
    setBulkMessage('');
  };

  const toggleSubscriberSelection = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId) 
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const selectAllSubscribers = () => {
    setSelectedSubscribers(
      selectedSubscribers.length === filteredSubscribers.length 
        ? [] 
        : filteredSubscribers.map(s => s.id)
    );
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please log in to view subscribers.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== 'creator' && user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Only creators can view subscriber information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">Subscribers</h1>
        <p className="text-gray-600">Manage your subscribers and community</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-orange-600">{subscribers.length}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active This Month</p>
                <p className="text-2xl font-bold text-green-600">
                  {subscribers.filter(s => s.isActive).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${subscribers.reduce((sum, s) => sum + parseInt(getTierPrice(s.subscriptionTier).slice(1)), 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Lifetime Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${Math.round(subscribers.reduce((sum, s) => sum + s.totalSpent, 0) / subscribers.length)}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="spending">Highest Spending</SelectItem>
                <SelectItem value="activity">Most Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllSubscribers}
              >
                {selectedSubscribers.length === filteredSubscribers.length ? 'Deselect All' : 'Select All'}
              </Button>
              
              {selectedSubscribers.length > 0 && (
                <Badge variant="secondary">
                  {selectedSubscribers.length} selected
                </Badge>
              )}
            </div>

            {selectedSubscribers.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Selected
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Bulk Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Sending to {selectedSubscribers.length} subscribers
                    </p>
                    <Textarea
                      placeholder="Write your message..."
                      value={bulkMessage}
                      onChange={(e) => setBulkMessage(e.target.value)}
                      rows={4}
                    />
                    <Button 
                      onClick={handleSendBulkMessage}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading subscribers...</div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No subscribers found matching your criteria.
            </div>
          ) : (
            <div className="divide-y">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => toggleSubscriberSelection(subscriber.id)}
                        className="rounded border-gray-300"
                      />
                      
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={subscriber.avatar} />
                        <AvatarFallback>
                          {subscriber.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{subscriber.displayName}</h3>
                          <Badge className={getTierColor(subscriber.subscriptionTier)}>
                            {subscriber.subscriptionTier}
                          </Badge>
                          {subscriber.isActive && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">@{subscriber.username}</p>
                        {subscriber.species && (
                          <p className="text-sm text-gray-500">{subscriber.species}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-sm">
                          <p className="font-medium">${subscriber.totalSpent} total</p>
                          <p className="text-gray-500">{getTierPrice(subscriber.subscriptionTier)}/month</p>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(subscriber)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <p>Subscribed: {subscriber.subscriptionDate.toLocaleDateString()}</p>
                        <p>Last active: {subscriber.lastActive.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Modal */}
      <Dialog open={messageModal.open} onOpenChange={(open) => setMessageModal({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Message {messageModal.recipient?.displayName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your message..."
              rows={4}
            />
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
