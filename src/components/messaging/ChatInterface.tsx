import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  File,
  Video,
  Plus,
  X,
  Play,
  Pause,
  Download,
  Reply,
  MoreHorizontal,
  Heart,
  ThumbsUp,
  Laugh,
  Angry,
  Check,
  CheckCheck,
} from 'lucide-react';
import { Conversation, Message, MessageAttachment } from '@/types';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  conversation: Conversation;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversation }) => {
  const { user } = useAuth();
  const {
    messages,
    sendMessage,
    addReaction,
    removeReaction,
    editMessage,
    deleteMessage,
    markAsRead,
    uploadAttachment,
    recordVoiceMessage,
    setTyping,
    userPresence,
    loadDraft,
    saveDraft,
    clearDraft,
  } = useMessaging();

  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTypingState] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const conversationMessages = messages[conversation.id] || [];

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  useEffect(() => {
    // Load draft when conversation changes
    const draft = loadDraft(conversation.id);
    if (draft) {
      setMessageText(draft.content);
      setAttachments(draft.attachments);
    }
  }, [conversation.id, loadDraft]);

  useEffect(() => {
    // Mark messages as read when conversation is active
    const unreadMessages = conversationMessages.filter(msg => 
      msg.senderId !== user?.id && msg.status !== 'read'
    );
    
    if (unreadMessages.length > 0) {
      const lastMessage = unreadMessages[unreadMessages.length - 1];
      markAsRead(conversation.id, lastMessage.id);
    }
  }, [conversationMessages, conversation.id, user?.id, markAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (value: string) => {
    setMessageText(value);
    
    // Handle typing indicator
    if (!isTyping && value.length > 0) {
      setIsTypingState(true);
      setTyping(conversation.id, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTypingState(false);
      setTyping(conversation.id, false);
    }, 1000);

    // Save draft
    saveDraft(conversation.id, value, attachments);
  };

  const handleSend = async () => {
    if (!messageText.trim() && attachments.length === 0) return;

    try {
      await sendMessage(
        conversation.id,
        messageText.trim(),
        attachments.length > 0 ? 'media' : 'text',
        attachments
      );

      setMessageText('');
      setAttachments([]);
      setReplyTo(null);
      setIsTypingState(false);
      setTyping(conversation.id, false);
      clearDraft(conversation.id);

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 100MB.',
          variant: 'destructive',
        });
        continue;
      }

      try {
        const attachment = await uploadAttachment(file, getFileType(file));
        setAttachments(prev => [...prev, attachment]);
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'file';
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      try {
        const voiceAttachment = await recordVoiceMessage();
        setAttachments(prev => [...prev, voiceAttachment]);
      } catch (error) {
        toast({
          title: 'Recording failed',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      setIsRecording(true);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const message = conversationMessages.find(m => m.id === messageId);
      const existingReaction = message?.reactions?.find(r => r.userId === user?.id && r.emoji === emoji);
      
      if (existingReaction) {
        await removeReaction(messageId, emoji);
      } else {
        await addReaction(messageId, emoji);
      }
    } catch (error) {
      toast({
        title: 'Failed to add reaction',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setMessageText(message.content);
    textareaRef.current?.focus();
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      toast({
        title: 'Failed to delete message',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'failed':
        return <X className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const emojis = ['❤️', '👍', '😂', '😮', '😢', '😡'];

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Start the conversation</p>
            </div>
          </div>
        ) : (
          conversationMessages.map((message, index) => {
            const isOwn = message.senderId === user?.id;
            const showAvatar = !isOwn && (
              index === 0 || 
              conversationMessages[index - 1].senderId !== message.senderId
            );
            const showTime = index === conversationMessages.length - 1 || 
              conversationMessages[index + 1]?.senderId !== message.senderId;

            return (
              <div
                key={message.id}
                className={cn(
                  'flex items-end space-x-2',
                  isOwn ? 'justify-end' : 'justify-start'
                )}
              >
                {!isOwn && (
                  <Avatar className={cn('w-8 h-8', !showAvatar && 'invisible')}>
                    <AvatarFallback className="text-xs">
                      {message.senderId.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn('max-w-xs lg:max-w-md', isOwn && 'order-last')}>
                  {/* Message Bubble */}
                  <div
                    className={cn(
                      'px-4 py-2 rounded-2xl relative group',
                      isOwn 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted text-foreground',
                      message.deletedAt && 'opacity-50 italic'
                    )}
                  >
                    {/* Reply indicator */}
                    {message.replyTo && (
                      <div className="text-xs opacity-75 mb-1 border-l-2 border-current pl-2">
                        Replying to message
                      </div>
                    )}

                    {/* Message content */}
                    {message.type === 'text' ? (
                      <p className="break-words">{message.content}</p>
                    ) : message.type === 'image' && message.attachments?.[0] ? (
                      <div className="space-y-2">
                        <img
                          src={message.attachments[0].url}
                          alt={message.attachments[0].name}
                          className="max-w-full rounded-lg"
                        />
                        {message.content && <p className="break-words">{message.content}</p>}
                      </div>
                    ) : message.type === 'file' && message.attachments?.[0] ? (
                      <div className="flex items-center space-x-2 p-2 bg-background/10 rounded">
                        <File className="w-4 h-4" />
                        <span className="text-sm">{message.attachments[0].name}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : null}

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.reactions.reduce((acc, reaction) => {
                          const existing = acc.find(r => r.emoji === reaction.emoji);
                          if (existing) {
                            existing.count++;
                            if (reaction.userId === user?.id) {
                              existing.hasUserReacted = true;
                            }
                          } else {
                            acc.push({
                              emoji: reaction.emoji,
                              count: 1,
                              hasUserReacted: reaction.userId === user?.id,
                            });
                          }
                          return acc;
                        }, [] as Array<{ emoji: string; count: number; hasUserReacted: boolean }>).map((reaction) => (
                          <button
                            key={reaction.emoji}
                            onClick={() => handleReaction(message.id, reaction.emoji)}
                            className={cn(
                              'px-2 py-1 rounded-full text-xs flex items-center space-x-1',
                              reaction.hasUserReacted
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-background/20 hover:bg-background/30'
                            )}
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message actions */}
                    <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-1 bg-background border rounded-lg shadow-lg p-1">
                        {/* Quick reactions */}
                        {emojis.slice(0, 3).map(emoji => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleReaction(message.id, emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                        
                        {/* More options */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setReplyTo(message)}>
                              <Reply className="w-4 h-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            {isOwn && (
                              <>
                                <DropdownMenuItem onClick={() => handleEdit(message)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(message.id)}
                                  className="text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Time and status */}
                  {showTime && (
                    <div className={cn(
                      'flex items-center space-x-1 mt-1 text-xs text-muted-foreground',
                      isOwn ? 'justify-end' : 'justify-start'
                    )}>
                      <span>{formatTime(message.createdAt)}</span>
                      {isOwn && getMessageStatusIcon(message.status)}
                      {message.editedAt && <span>• edited</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {Object.values(userPresence).some(presence => 
          presence.isTyping?.conversationId === conversation.id
        ) && (
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">T</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        {/* Reply indicator */}
        {replyTo && (
          <div className="flex items-center justify-between p-2 mb-2 bg-muted rounded border-l-4 border-primary">
            <div className="text-sm">
              <span className="font-medium">Replying to:</span>
              <p className="text-muted-foreground truncate">{replyTo.content}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setReplyTo(null)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="relative flex items-center space-x-2 p-2 bg-muted rounded border"
              >
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.thumbnail || attachment.url}
                    alt={attachment.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted-foreground/20 rounded flex items-center justify-center">
                    <File className="w-6 h-6" />
                  </div>
                )}
                <span className="text-sm truncate max-w-20">{attachment.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute -top-1 -right-1"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input controls */}
        <div className="flex items-end space-x-2">
          {/* Attachment button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Plus className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-4 h-4 mr-2" />
                File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleFileUpload(files);
                };
                input.click();
              }}>
                <Image className="w-4 h-4 mr-2" />
                Photo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleFileUpload(files);
                };
                input.click();
              }}>
                <Video className="w-4 h-4 mr-2" />
                Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="resize-none min-h-10 max-h-32 pr-10"
              rows={1}
            />
            
            {/* Emoji picker */}
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <div className="grid grid-cols-8 gap-2 p-4">
                  {emojis.concat(['🎉', '🔥', '💯', '✨', '🚀', '⭐', '💎', '🎯']).map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setMessageText(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Voice message button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-10 w-10',
              isRecording && 'bg-red-500 text-white hover:bg-red-600'
            )}
            onClick={handleVoiceRecord}
          >
            <Mic className="w-5 h-5" />
          </Button>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!messageText.trim() && attachments.length === 0}
            className="h-10 w-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(e.target.files);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatInterface;