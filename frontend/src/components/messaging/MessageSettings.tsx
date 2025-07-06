import React, { useState } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Shield,
  Eye,
  EyeOff,
  Clock,
  Users,
  Lock,
  Trash2,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Conversation } from '@/types';
import { useMessaging } from '@/contexts/MessagingContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface MessageSettingsProps {
  conversation?: Conversation;
}

const MessageSettings: React.FC<MessageSettingsProps> = ({ conversation }) => {
  const {
    notificationSettings,
    updateNotificationSettings,
    updateConversation,
    deleteConversation,
  } = useMessaging();

  const [localSettings, setLocalSettings] = useState(notificationSettings);
  const [autoDeleteAfter, setAutoDeleteAfter] = useState(conversation?.settings.autoDeleteAfter || 0);
  const [wordFilter, setWordFilter] = useState(conversation?.settings.wordFilter.join(', ') || '');

  const handleNotificationToggle = async (key: keyof typeof notificationSettings, value: boolean) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    await updateNotificationSettings({ [key]: value });
    
    toast({
      title: 'Settings updated',
      description: 'Your notification preferences have been saved.',
    });
  };

  const handleDoNotDisturbToggle = async (enabled: boolean) => {
    const updated = {
      ...localSettings,
      doNotDisturb: { ...localSettings.doNotDisturb, enabled }
    };
    setLocalSettings(updated);
    await updateNotificationSettings({ doNotDisturb: updated.doNotDisturb });
  };

  const handleConversationSettingUpdate = async (key: string, value: any) => {
    if (!conversation) return;

    try {
      await updateConversation(conversation.id, {
        settings: {
          ...conversation.settings,
          [key]: value,
        },
      });
      
      toast({
        title: 'Conversation updated',
        description: 'Settings have been applied to this conversation.',
      });
    } catch (error) {
      toast({
        title: 'Failed to update',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleWordFilterUpdate = () => {
    const words = wordFilter.split(',').map(w => w.trim()).filter(w => w);
    handleConversationSettingUpdate('wordFilter', words);
  };

  const handleDeleteConversation = async () => {
    if (!conversation) return;

    try {
      await deleteConversation(conversation.id);
      toast({
        title: 'Conversation deleted',
        description: 'The conversation has been permanently deleted.',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const exportConversation = () => {
    // Mock export functionality
    toast({
      title: 'Export started',
      description: 'Your conversation data will be downloaded shortly.',
    });
  };

  if (!conversation) {
    return (
      <div className="space-y-6">
        {/* Global Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how you receive message notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications for new messages
                </p>
              </div>
              <Switch
                checked={localSettings.pushNotifications}
                onCheckedChange={(checked) => handleNotificationToggle('pushNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Sound</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound for new messages
                </p>
              </div>
              <Switch
                checked={localSettings.soundEnabled}
                onCheckedChange={(checked) => handleNotificationToggle('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show desktop notifications
                </p>
              </div>
              <Switch
                checked={localSettings.desktopNotifications}
                onCheckedChange={(checked) => handleNotificationToggle('desktopNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Message Preview</Label>
                <p className="text-sm text-muted-foreground">
                  Show message content in notifications
                </p>
              </div>
              <Switch
                checked={localSettings.messagePreview}
                onCheckedChange={(checked) => handleNotificationToggle('messagePreview', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Do Not Disturb</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable all notifications
                  </p>
                </div>
                <Switch
                  checked={localSettings.doNotDisturb.enabled}
                  onCheckedChange={handleDoNotDisturbToggle}
                />
              </div>

              {localSettings.doNotDisturb.enabled && (
                <div className="ml-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-time" className="text-sm">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={localSettings.doNotDisturb.startTime || '22:00'}
                        onChange={(e) => {
                          const updated = {
                            ...localSettings,
                            doNotDisturb: {
                              ...localSettings.doNotDisturb,
                              startTime: e.target.value,
                            },
                          };
                          setLocalSettings(updated);
                          updateNotificationSettings({ doNotDisturb: updated.doNotDisturb });
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time" className="text-sm">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={localSettings.doNotDisturb.endTime || '08:00'}
                        onChange={(e) => {
                          const updated = {
                            ...localSettings,
                            doNotDisturb: {
                              ...localSettings.doNotDisturb,
                              endTime: e.target.value,
                            },
                          };
                          setLocalSettings(updated);
                          updateNotificationSettings({ doNotDisturb: updated.doNotDisturb });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Control your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Read Receipts</Label>
                <p className="text-sm text-muted-foreground">
                  Let others know when you've read their messages
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Online Status</Label>
                <p className="text-sm text-muted-foreground">
                  Show when you're online
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Typing Indicators</Label>
                <p className="text-sm text-muted-foreground">
                  Show when you're typing
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conversation Info */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation Settings</CardTitle>
          <CardDescription>
            Manage settings for this conversation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Mute Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Stop receiving notifications from this chat
              </p>
            </div>
            <Switch
              checked={conversation.isMuted}
              onCheckedChange={(checked) => handleConversationSettingUpdate('isMuted', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Pin Conversation</Label>
              <p className="text-sm text-muted-foreground">
                Keep this chat at the top of your list
              </p>
            </div>
            <Switch
              checked={conversation.isPinned}
              onCheckedChange={(checked) => handleConversationSettingUpdate('isPinned', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Encryption</Label>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption for messages
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={conversation.settings.isEncrypted ? 'default' : 'secondary'}>
                {conversation.settings.isEncrypted ? 'Enabled' : 'Disabled'}
              </Badge>
              <Lock className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File & Media Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Media & Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">File Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Allow file attachments in this conversation
              </p>
            </div>
            <Switch
              checked={conversation.settings.allowFileSharing}
              onCheckedChange={(checked) => handleConversationSettingUpdate('allowFileSharing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Voice Messages</Label>
              <p className="text-sm text-muted-foreground">
                Enable voice message recording
              </p>
            </div>
            <Switch
              checked={conversation.settings.allowVoiceMessages}
              onCheckedChange={(checked) => handleConversationSettingUpdate('allowVoiceMessages', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auto-delete">Auto-Delete Messages</Label>
            <Select
              value={autoDeleteAfter.toString()}
              onValueChange={(value) => {
                const days = parseInt(value);
                setAutoDeleteAfter(days);
                handleConversationSettingUpdate('autoDeleteAfter', days);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Never</SelectItem>
                <SelectItem value="1">After 1 day</SelectItem>
                <SelectItem value="7">After 1 week</SelectItem>
                <SelectItem value="30">After 1 month</SelectItem>
                <SelectItem value="90">After 3 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Settings (for group chats) */}
      {conversation.type === 'group' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Moderation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Message Moderation</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic message filtering
                </p>
              </div>
              <Switch
                checked={conversation.settings.moderationEnabled}
                onCheckedChange={(checked) => handleConversationSettingUpdate('moderationEnabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="word-filter">Blocked Words</Label>
              <Textarea
                id="word-filter"
                placeholder="Enter words separated by commas"
                value={wordFilter}
                onChange={(e) => setWordFilter(e.target.value)}
                onBlur={handleWordFilterUpdate}
              />
              <p className="text-xs text-muted-foreground">
                Messages containing these words will be automatically blocked
              </p>
            </div>

            {conversation.settings.maxParticipants && (
              <div className="space-y-2">
                <Label>Member Limit</Label>
                <p className="text-sm text-muted-foreground">
                  Maximum {conversation.settings.maxParticipants} members allowed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={exportConversation} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Conversation Data
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Block User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block User</DialogTitle>
                <DialogDescription>
                  This will prevent the user from sending you messages and hide your online status from them.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Block User</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Conversation
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this conversation 
                  and remove all messages from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConversation}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Conversation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageSettings;