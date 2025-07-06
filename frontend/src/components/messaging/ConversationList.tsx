import React from 'react';
import { Pin, Archive, Volume2, VolumeX, MoreHorizontal } from 'lucide-react';
import { Conversation } from '@/types';
import { useMessaging } from '@/contexts/MessagingContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
  activeConversation: Conversation | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelect,
  activeConversation,
}) => {
  const { updateConversation, deleteConversation, userPresence } = useMessaging();

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getParticipantStatus = (conversation: Conversation) => {
    if (conversation.type === 'group') return null;
    
    const otherParticipant = conversation.participants.find(p => p.userId !== 'current-user');
    if (!otherParticipant) return null;
    
    const presence = userPresence[otherParticipant.userId];
    return presence?.status;
  };

  const isParticipantTyping = (conversation: Conversation) => {
    if (conversation.type === 'group') return false;
    
    const otherParticipant = conversation.participants.find(p => p.userId !== 'current-user');
    if (!otherParticipant) return false;
    
    const presence = userPresence[otherParticipant.userId];
    return presence?.isTyping?.conversationId === conversation.id;
  };

  const handlePin = async (conversation: Conversation, event: React.MouseEvent) => {
    event.stopPropagation();
    await updateConversation(conversation.id, { isPinned: !conversation.isPinned });
  };

  const handleMute = async (conversation: Conversation, event: React.MouseEvent) => {
    event.stopPropagation();
    await updateConversation(conversation.id, { isMuted: !conversation.isMuted });
  };

  const handleArchive = async (conversation: Conversation, event: React.MouseEvent) => {
    event.stopPropagation();
    await updateConversation(conversation.id, { isArchived: true });
  };

  const handleDelete = async (conversation: Conversation, event: React.MouseEvent) => {
    event.stopPropagation();
    await deleteConversation(conversation.id);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Archive className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No conversations found</p>
        </div>
      </div>
    );
  }

  // Sort conversations: pinned first, then by last message time
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const aTime = a.lastMessageAt?.getTime() || 0;
    const bTime = b.lastMessageAt?.getTime() || 0;
    return bTime - aTime;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      {sortedConversations.map((conversation) => {
        const isActive = activeConversation?.id === conversation.id;
        const participantStatus = getParticipantStatus(conversation);
        const isTyping = isParticipantTyping(conversation);
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={cn(
              'flex items-center p-3 hover:bg-muted/50 cursor-pointer border-b border-border/50 relative',
              isActive && 'bg-muted',
              conversation.unreadCount > 0 && 'bg-muted/30'
            )}
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>
                  {conversation.name?.charAt(0) || conversation.type.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Online status indicator */}
              {participantStatus === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
              )}
              
              {/* Conversation type indicator */}
              {conversation.type === 'group' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 border-2 border-background rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">G</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 ml-3 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h3 className={cn(
                    'font-medium text-sm truncate',
                    conversation.unreadCount > 0 && 'font-semibold'
                  )}>
                    {conversation.name || 'Unnamed Conversation'}
                  </h3>
                  
                  {/* Icons */}
                  {conversation.isPinned && (
                    <Pin className="w-3 h-3 text-muted-foreground" />
                  )}
                  {conversation.isMuted && (
                    <VolumeX className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {conversation.lastMessageAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  )}
                  
                  {/* Options menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handlePin(conversation, e)}>
                        <Pin className="w-4 h-4 mr-2" />
                        {conversation.isPinned ? 'Unpin' : 'Pin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleMute(conversation, e)}>
                        {conversation.isMuted ? (
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
                      <DropdownMenuItem onClick={(e) => handleArchive(conversation, e)}>
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => handleDelete(conversation, e)}
                        className="text-red-600"
                      >
                        Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Last message or typing indicator */}
              <div className="flex items-center justify-between">
                <p className={cn(
                  'text-sm text-muted-foreground truncate',
                  conversation.unreadCount > 0 && 'font-medium text-foreground'
                )}>
                  {isTyping ? (
                    <span className="italic text-blue-600">typing...</span>
                  ) : conversation.lastMessage ? (
                    <>
                      {conversation.lastMessage.senderId === 'current-user' && (
                        <span className="mr-1">You:</span>
                      )}
                      {conversation.lastMessage.type === 'text' 
                        ? conversation.lastMessage.content
                        : `📎 ${conversation.lastMessage.type}`
                      }
                    </>
                  ) : (
                    'No messages yet'
                  )}
                </p>
                
                {/* Unread count */}
                {conversation.unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="h-5 min-w-5 px-1.5 text-xs flex items-center justify-center"
                  >
                    {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;