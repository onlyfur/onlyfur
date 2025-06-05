import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Users,
  Radio,
  Settings,
  Search,
  Plus,
  Archive,
  Pin,
  Volume2,
  VolumeX,
  MoreHorizontal,
  Phone,
  Video,
  Info,
} from 'lucide-react';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import ConversationList from '@/components/messaging/ConversationList';
import ChatInterface from '@/components/messaging/ChatInterface';
import BroadcastPanel from '@/components/messaging/BroadcastPanel';
import MessageSettings from '@/components/messaging/MessageSettings';

const Messages: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createConversation,
    isConnected,
  } = useMessaging();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setActiveConversation(conversation);
        setShowMobileChat(true);
      }
    } else {
      setActiveConversation(null);
      setShowMobileChat(false);
    }
  }, [conversationId, conversations, setActiveConversation]);

  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
    navigate(`/messages/${conversation.id}`);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    navigate('/messages');
  };

  const handleCreateConversation = async () => {
    // In a real app, this would open a user selection dialog
    const newConversation = await createConversation('direct', [user?.id || '1', 'new-user'], 'New Chat');
    handleConversationSelect(newConversation);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'unread' && conv.unreadCount > 0) ||
                      (activeTab === 'archived' && conv.isArchived) ||
                      (activeTab === 'groups' && conv.type === 'group');
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-80 border-r bg-background ${showMobileChat ? 'hidden md:block' : 'block'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">Messages</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <Button variant="ghost" size="icon" onClick={handleCreateConversation}>
                  <Plus className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Message Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="w-4 h-4 mr-2" />
                      Archived Chats
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Radio className="w-4 h-4 mr-2" />
                      Broadcast Lists
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                    {conversations.filter(c => c.unreadCount > 0).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1 mt-0">
              <ConversationList
                conversations={filteredConversations}
                onSelect={handleConversationSelect}
                activeConversation={activeConversation}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${showMobileChat ? 'block' : 'hidden md:flex'}`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={handleBackToList}
                  >
                    ←
                  </Button>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activeConversation.avatar} />
                    <AvatarFallback>
                      {activeConversation.name?.charAt(0) || activeConversation.type.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{activeConversation.name || 'Conversation'}</h2>
                    <p className="text-sm text-muted-foreground">
                      {activeConversation.type === 'group' 
                        ? `${activeConversation.participants.length} members`
                        : 'Online now'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pin className="w-4 h-4 mr-2" />
                        {activeConversation.isPinned ? 'Unpin' : 'Pin'} Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {activeConversation.isMuted ? (
                          <>
                            <Volume2 className="w-4 h-4 mr-2" />
                            Unmute
                          </>
                        ) : (
                          <>
                            <VolumeX className="w-4 h-4 mr-2" />
                            Mute
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="w-4 h-4 mr-2" />
                        Archive Chat
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <ChatInterface conversation={activeConversation} />
          </>
        ) : (
          // Welcome Screen
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Welcome to Messages</h2>
              <p className="text-muted-foreground mb-6">
                Select a conversation to start messaging, or create a new chat to connect with your community.
              </p>
              <div className="space-y-2">
                <Button onClick={handleCreateConversation} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Chat
                </Button>
                <Button variant="outline" className="w-full">
                  <Radio className="w-4 h-4 mr-2" />
                  Create Broadcast
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar (Desktop) - Optional panels */}
      {activeConversation && (
        <div className="hidden xl:block w-80 border-l bg-background">
          <Tabs defaultValue="info" className="h-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="p-4 space-y-4">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={activeConversation.avatar} />
                  <AvatarFallback className="text-lg">
                    {activeConversation.name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-medium">{activeConversation.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeConversation.description || 'No description'}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Participants ({activeConversation.participants.length})</h4>
                {activeConversation.participants.slice(0, 5).map((participant) => (
                  <div key={participant.userId} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {participant.userId.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{participant.userId}</p>
                      <p className="text-xs text-muted-foreground capitalize">{participant.role}</p>
                    </div>
                  </div>
                ))}
                {activeConversation.participants.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Members
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="p-4">
              <h4 className="font-medium mb-3">Shared Media</h4>
              <div className="grid grid-cols-3 gap-2">
                {/* Placeholder for shared media */}
                <div className="aspect-square bg-muted rounded border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No media</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4">
              <MessageSettings conversation={activeConversation} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Messages;