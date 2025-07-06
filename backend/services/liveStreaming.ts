import { prisma } from './database';
import { logger } from '../middleware/logger';
import { createAuditLog, AuditActions } from './auditLog';
import { createNotification } from './notifications';
import { webhookService, WebhookEvents } from './webhooks';
import { createAnalyticsEvent } from './analytics';
import { NotificationType, NotificationPriority } from '@prisma/client';

export interface LiveStream {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  isPrivate: boolean;
  requiresSubscription: boolean;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  streamKey: string;
  playbackUrl?: string;
  thumbnailUrl?: string;
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  viewerCount: number;
  maxViewers: number;
  settings: StreamSettings;
  analytics: StreamAnalytics;
}

export interface StreamSettings {
  allowChat: boolean;
  allowDonations: boolean;
  allowRecording: boolean;
  chatModeration: 'none' | 'basic' | 'strict';
  donationGoal?: number;
  donationMinAmount?: number;
  subscriberOnlyChat: boolean;
  slowMode: boolean;
  slowModeInterval: number;
}

export interface StreamAnalytics {
  totalViews: number;
  uniqueViewers: number;
  averageViewTime: number;
  chatMessages: number;
  donations: number;
  donationAmount: number;
  subscribers: number;
  peakViewers: number;
  engagementRate: number;
}

export interface StreamViewer {
  userId: string;
  username: string;
  avatar?: string;
  joinedAt: Date;
  isSubscriber: boolean;
  isModerator: boolean;
  isCreator: boolean;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isDeleted: boolean;
  isModerator: boolean;
  isCreator: boolean;
  metadata?: any;
}

export interface StreamDonation {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  amount: number;
  currency: string;
  message?: string;
  timestamp: Date;
  isAnonymous: boolean;
}

/**
 * Live Streaming Service
 */
export class LiveStreamingService {
  private static instance: LiveStreamingService;
  private activeStreams: Map<string, LiveStream> = new Map();
  private streamViewers: Map<string, Set<string>> = new Map();
  private streamChatRooms: Map<string, ChatMessage[]> = new Map();

  static getInstance(): LiveStreamingService {
    if (!LiveStreamingService.instance) {
      LiveStreamingService.instance = new LiveStreamingService();
    }
    return LiveStreamingService.instance;
  }

  /**
   * Create a new live stream
   */
  async createStream(data: {
    creatorId: string;
    title: string;
    description?: string;
    category: string;
    tags?: string[];
    isPrivate?: boolean;
    requiresSubscription?: boolean;
    scheduledAt?: Date;
    settings?: Partial<StreamSettings>;
  }): Promise<LiveStream> {
    try {
      const streamKey = this.generateStreamKey();
      const defaultSettings: StreamSettings = {
        allowChat: true,
        allowDonations: true,
        allowRecording: true,
        chatModeration: 'basic',
        subscriberOnlyChat: false,
        slowMode: false,
        slowModeInterval: 5,
        ...data.settings
      };

      const stream: LiveStream = {
        id: this.generateStreamId(),
        creatorId: data.creatorId,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        isPrivate: data.isPrivate || false,
        requiresSubscription: data.requiresSubscription || false,
        status: data.scheduledAt ? 'scheduled' : 'live',
        streamKey,
        scheduledAt: data.scheduledAt,
        viewerCount: 0,
        maxViewers: 0,
        settings: defaultSettings,
        analytics: {
          totalViews: 0,
          uniqueViewers: 0,
          averageViewTime: 0,
          chatMessages: 0,
          donations: 0,
          donationAmount: 0,
          subscribers: 0,
          peakViewers: 0,
          engagementRate: 0
        }
      };

      // Store in database (simplified - would use actual DB)
      await this.saveStreamToDatabase(stream);

      // Add to active streams if live
      if (stream.status === 'live') {
        this.activeStreams.set(stream.id, stream);
        this.streamViewers.set(stream.id, new Set());
        this.streamChatRooms.set(stream.id, []);
      }

      // Audit log
      await createAuditLog({
        userId: data.creatorId,
        action: AuditActions.CONTENT_CREATE,
        resource: 'live_stream',
        resourceId: stream.id,
        metadata: {
          title: data.title,
          category: data.category,
          isPrivate: data.isPrivate,
          scheduledAt: data.scheduledAt
        }
      });

      // Send notification to followers if not private
      if (!stream.isPrivate && stream.status === 'live') {
        await this.notifyFollowersOfLiveStream(stream);
      }

      // Webhook event
      await webhookService.triggerEvent(WebhookEvents.CONTENT_CREATED, {
        type: 'live_stream',
        stream: this.sanitizeStreamForWebhook(stream)
      }, data.creatorId);

      logger.info('Live stream created', {
        streamId: stream.id,
        creatorId: data.creatorId,
        title: data.title,
        status: stream.status
      });

      return stream;

    } catch (error) {
      logger.error('Failed to create live stream', {
        creatorId: data.creatorId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Start a live stream
   */
  async startStream(streamId: string, creatorId: string): Promise<LiveStream> {
    try {
      const stream = await this.getStream(streamId);
      
      if (!stream || stream.creatorId !== creatorId) {
        throw new Error('Stream not found or unauthorized');
      }

      if (stream.status !== 'scheduled') {
        throw new Error('Stream cannot be started');
      }

      // Update stream status
      stream.status = 'live';
      stream.startedAt = new Date();
      stream.playbackUrl = this.generatePlaybackUrl(streamId);

      // Add to active streams
      this.activeStreams.set(streamId, stream);
      this.streamViewers.set(streamId, new Set());
      this.streamChatRooms.set(streamId, []);

      // Update in database
      await this.updateStreamInDatabase(stream);

      // Notify followers
      await this.notifyFollowersOfLiveStream(stream);

      // Analytics event
      await createAnalyticsEvent({
        userId: creatorId,
        eventType: 'stream_started',
        metadata: {
          streamId,
          title: stream.title,
          category: stream.category
        }
      });

      // Webhook event
      await webhookService.triggerEvent(WebhookEvents.CONTENT_PUBLISHED, {
        type: 'live_stream_started',
        stream: this.sanitizeStreamForWebhook(stream)
      }, creatorId);

      logger.info('Live stream started', {
        streamId,
        creatorId,
        title: stream.title
      });

      return stream;

    } catch (error) {
      logger.error('Failed to start live stream', {
        streamId,
        creatorId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * End a live stream
   */
  async endStream(streamId: string, creatorId: string): Promise<LiveStream> {
    try {
      const stream = this.activeStreams.get(streamId);
      
      if (!stream || stream.creatorId !== creatorId) {
        throw new Error('Stream not found or unauthorized');
      }

      // Calculate duration and update analytics
      const endTime = new Date();
      stream.endedAt = endTime;
      stream.duration = stream.startedAt 
        ? Math.floor((endTime.getTime() - stream.startedAt.getTime()) / 1000)
        : 0;
      stream.status = 'ended';

      // Final analytics update
      await this.updateStreamAnalytics(streamId);

      // Remove from active streams
      this.activeStreams.delete(streamId);
      this.streamViewers.delete(streamId);
      
      // Keep chat history for a while, then clean up
      setTimeout(() => {
        this.streamChatRooms.delete(streamId);
      }, 24 * 60 * 60 * 1000); // 24 hours

      // Update in database
      await this.updateStreamInDatabase(stream);

      // Analytics event
      await createAnalyticsEvent({
        userId: creatorId,
        eventType: 'stream_ended',
        metadata: {
          streamId,
          duration: stream.duration,
          maxViewers: stream.maxViewers,
          totalViews: stream.analytics.totalViews
        }
      });

      // Webhook event
      await webhookService.triggerEvent(WebhookEvents.CONTENT_UPDATED, {
        type: 'live_stream_ended',
        stream: this.sanitizeStreamForWebhook(stream)
      }, creatorId);

      logger.info('Live stream ended', {
        streamId,
        creatorId,
        duration: stream.duration,
        maxViewers: stream.maxViewers
      });

      return stream;

    } catch (error) {
      logger.error('Failed to end live stream', {
        streamId,
        creatorId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Join a live stream as viewer
   */
  async joinStream(streamId: string, userId: string): Promise<{
    stream: LiveStream;
    viewer: StreamViewer;
    canView: boolean;
    reason?: string;
  }> {
    try {
      const stream = this.activeStreams.get(streamId);
      
      if (!stream || stream.status !== 'live') {
        return {
          stream: null,
          viewer: null,
          canView: false,
          reason: 'Stream is not live or not found'
        };
      }

      // Check access permissions
      const canView = await this.canUserViewStream(stream, userId);
      if (!canView.allowed) {
        return {
          stream,
          viewer: null,
          canView: false,
          reason: canView.reason
        };
      }

      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          username: true,
          avatar: true,
          role: true
        }
      });

      if (!user) {
        return {
          stream,
          viewer: null,
          canView: false,
          reason: 'User not found'
        };
      }

      // Check if user is already viewing
      const viewers = this.streamViewers.get(streamId);
      const isNewViewer = !viewers.has(userId);

      // Add viewer
      viewers.add(userId);
      
      // Update viewer count
      stream.viewerCount = viewers.size;
      if (stream.viewerCount > stream.maxViewers) {
        stream.maxViewers = stream.viewerCount;
      }

      // Check if user is subscriber
      const isSubscriber = await this.isUserSubscriber(userId, stream.creatorId);
      const isModerator = await this.isUserModerator(userId, stream.creatorId);

      const viewer: StreamViewer = {
        userId,
        username: user.username,
        avatar: user.avatar,
        joinedAt: new Date(),
        isSubscriber,
        isModerator,
        isCreator: userId === stream.creatorId
      };

      // Update analytics for new viewer
      if (isNewViewer) {
        stream.analytics.uniqueViewers++;
        stream.analytics.totalViews++;
      }

      // Analytics event
      await createAnalyticsEvent({
        userId,
        eventType: 'stream_joined',
        metadata: {
          streamId,
          creatorId: stream.creatorId,
          isNewViewer
        }
      });

      logger.debug('User joined live stream', {
        streamId,
        userId,
        username: user.username,
        isNewViewer
      });

      return {
        stream,
        viewer,
        canView: true
      };

    } catch (error) {
      logger.error('Failed to join live stream', {
        streamId,
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Leave a live stream
   */
  async leaveStream(streamId: string, userId: string): Promise<void> {
    try {
      const viewers = this.streamViewers.get(streamId);
      if (viewers && viewers.has(userId)) {
        viewers.delete(userId);
        
        const stream = this.activeStreams.get(streamId);
        if (stream) {
          stream.viewerCount = viewers.size;
        }

        // Analytics event
        await createAnalyticsEvent({
          userId,
          eventType: 'stream_left',
          metadata: {
            streamId,
            creatorId: stream?.creatorId
          }
        });

        logger.debug('User left live stream', {
          streamId,
          userId
        });
      }
    } catch (error) {
      logger.error('Failed to leave live stream', {
        streamId,
        userId,
        error: error.message
      });
    }
  }

  /**
   * Send chat message
   */
  async sendChatMessage(data: {
    streamId: string;
    userId: string;
    message: string;
  }): Promise<ChatMessage> {
    try {
      const stream = this.activeStreams.get(data.streamId);
      if (!stream || stream.status !== 'live') {
        throw new Error('Stream is not live');
      }

      if (!stream.settings.allowChat) {
        throw new Error('Chat is disabled for this stream');
      }

      // Check if user can send messages
      const canSend = await this.canUserSendMessage(stream, data.userId);
      if (!canSend.allowed) {
        throw new Error(canSend.reason);
      }

      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: {
          username: true,
          role: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isSubscriber = await this.isUserSubscriber(data.userId, stream.creatorId);
      const isModerator = await this.isUserModerator(data.userId, stream.creatorId);

      const chatMessage: ChatMessage = {
        id: this.generateMessageId(),
        streamId: data.streamId,
        userId: data.userId,
        username: user.username,
        message: data.message,
        timestamp: new Date(),
        isDeleted: false,
        isModerator,
        isCreator: data.userId === stream.creatorId
      };

      // Add to chat room
      const chatRoom = this.streamChatRooms.get(data.streamId);
      if (chatRoom) {
        chatRoom.push(chatMessage);
        
        // Keep only last 1000 messages
        if (chatRoom.length > 1000) {
          chatRoom.splice(0, chatRoom.length - 1000);
        }
      }

      // Update analytics
      stream.analytics.chatMessages++;

      // Analytics event
      await createAnalyticsEvent({
        userId: data.userId,
        eventType: 'stream_chat_message',
        metadata: {
          streamId: data.streamId,
          messageLength: data.message.length
        }
      });

      logger.debug('Chat message sent', {
        streamId: data.streamId,
        userId: data.userId,
        messageId: chatMessage.id
      });

      return chatMessage;

    } catch (error) {
      logger.error('Failed to send chat message', {
        streamId: data.streamId,
        userId: data.userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Send donation to stream
   */
  async sendDonation(data: {
    streamId: string;
    userId: string;
    amount: number;
    currency: string;
    message?: string;
    isAnonymous?: boolean;
  }): Promise<StreamDonation> {
    try {
      const stream = this.activeStreams.get(data.streamId);
      if (!stream || stream.status !== 'live') {
        throw new Error('Stream is not live');
      }

      if (!stream.settings.allowDonations) {
        throw new Error('Donations are disabled for this stream');
      }

      if (stream.settings.donationMinAmount && data.amount < stream.settings.donationMinAmount) {
        throw new Error(`Minimum donation amount is ${stream.settings.donationMinAmount}`);
      }

      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: {
          username: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const donation: StreamDonation = {
        id: this.generateDonationId(),
        streamId: data.streamId,
        userId: data.userId,
        username: data.isAnonymous ? 'Anonymous' : user.username,
        amount: data.amount,
        currency: data.currency,
        message: data.message,
        timestamp: new Date(),
        isAnonymous: data.isAnonymous || false
      };

      // Update stream analytics
      stream.analytics.donations++;
      stream.analytics.donationAmount += data.amount;

      // Save donation to database
      await this.saveDonationToDatabase(donation);

      // Send notification to creator
      await createNotification({
        userId: stream.creatorId,
        type: NotificationType.PAYMENT,
        title: 'New Stream Donation',
        message: `${donation.username} donated ${data.amount} ${data.currency}${data.message ? `: "${data.message}"` : ''}`,
        priority: NotificationPriority.HIGH,
        data: {
          streamId: data.streamId,
          donationId: donation.id,
          amount: data.amount,
          currency: data.currency
        }
      });

      // Analytics event
      await createAnalyticsEvent({
        userId: data.userId,
        eventType: 'stream_donation',
        metadata: {
          streamId: data.streamId,
          amount: data.amount,
          currency: data.currency,
          isAnonymous: data.isAnonymous
        }
      });

      logger.info('Stream donation sent', {
        streamId: data.streamId,
        donationId: donation.id,
        amount: data.amount,
        currency: data.currency,
        isAnonymous: data.isAnonymous
      });

      return donation;

    } catch (error) {
      logger.error('Failed to send donation', {
        streamId: data.streamId,
        userId: data.userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get live stream details
   */
  async getStream(streamId: string): Promise<LiveStream | null> {
    try {
      // Check active streams first
      const activeStream = this.activeStreams.get(streamId);
      if (activeStream) {
        return activeStream;
      }

      // Fallback to database
      return await this.getStreamFromDatabase(streamId);

    } catch (error) {
      logger.error('Failed to get stream', {
        streamId,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Get chat messages for a stream
   */
  getChatMessages(streamId: string, limit: number = 50): ChatMessage[] {
    const chatRoom = this.streamChatRooms.get(streamId);
    if (!chatRoom) return [];

    return chatRoom.slice(-limit);
  }

  /**
   * Get current viewers for a stream
   */
  getStreamViewers(streamId: string): string[] {
    const viewers = this.streamViewers.get(streamId);
    return viewers ? Array.from(viewers) : [];
  }

  /**
   * Get user's streams
   */
  async getUserStreams(
    userId: string,
    status?: 'scheduled' | 'live' | 'ended',
    limit: number = 20
  ): Promise<LiveStream[]> {
    try {
      // This would query the database
      return await this.getStreamsFromDatabase({ creatorId: userId, status, limit });
    } catch (error) {
      logger.error('Failed to get user streams', {
        userId,
        error: error.message
      });
      return [];
    }
  }

  // Private helper methods

  private generateStreamKey(): string {
    return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateStreamId(): string {
    return `strm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDonationId(): string {
    return `don_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generatePlaybackUrl(streamId: string): string {
    return `https://stream.onlyfur.net/live/${streamId}`;
  }

  private async canUserViewStream(stream: LiveStream, userId: string): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    if (stream.isPrivate && userId !== stream.creatorId) {
      return { allowed: false, reason: 'Stream is private' };
    }

    if (stream.requiresSubscription) {
      const isSubscriber = await this.isUserSubscriber(userId, stream.creatorId);
      if (!isSubscriber && userId !== stream.creatorId) {
        return { allowed: false, reason: 'Subscription required' };
      }
    }

    return { allowed: true };
  }

  private async canUserSendMessage(stream: LiveStream, userId: string): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    if (stream.settings.subscriberOnlyChat) {
      const isSubscriber = await this.isUserSubscriber(userId, stream.creatorId);
      const isModerator = await this.isUserModerator(userId, stream.creatorId);
      
      if (!isSubscriber && !isModerator && userId !== stream.creatorId) {
        return { allowed: false, reason: 'Subscriber-only chat' };
      }
    }

    // Add more moderation checks here (slow mode, user bans, etc.)

    return { allowed: true };
  }

  private async isUserSubscriber(userId: string, creatorId: string): Promise<boolean> {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: {
          subscriberId: userId,
          creatorId,
          status: 'active'
        }
      });
      return !!subscription;
    } catch {
      return false;
    }
  }

  private async isUserModerator(userId: string, creatorId: string): Promise<boolean> {
    // This would check if user is a moderator for the creator
    return false;
  }

  private async notifyFollowersOfLiveStream(stream: LiveStream): Promise<void> {
    try {
      // Get creator's followers
      const followers = await prisma.subscription.findMany({
        where: {
          creatorId: stream.creatorId,
          status: 'active'
        },
        include: {
          subscriber: true
        }
      });

      // Send notifications
      for (const follower of followers) {
        await createNotification({
          userId: follower.subscriberId,
          type: NotificationType.CONTENT,
          title: 'Live Stream Started',
          message: `${follower.creator?.username || 'A creator'} is now live: ${stream.title}`,
          priority: NotificationPriority.NORMAL,
          data: {
            streamId: stream.id,
            creatorId: stream.creatorId,
            streamTitle: stream.title
          }
        });
      }

      logger.info('Notified followers of live stream', {
        streamId: stream.id,
        followerCount: followers.length
      });

    } catch (error) {
      logger.error('Failed to notify followers', {
        streamId: stream.id,
        error: error.message
      });
    }
  }

  private sanitizeStreamForWebhook(stream: LiveStream): any {
    const { streamKey, ...sanitized } = stream;
    return sanitized;
  }

  private async updateStreamAnalytics(streamId: string): Promise<void> {
    // Update analytics in database
  }

  private async saveStreamToDatabase(stream: LiveStream): Promise<void> {
    // Save to database
  }

  private async updateStreamInDatabase(stream: LiveStream): Promise<void> {
    // Update in database
  }

  private async getStreamFromDatabase(streamId: string): Promise<LiveStream | null> {
    // Get from database
    return null;
  }

  private async getStreamsFromDatabase(params: any): Promise<LiveStream[]> {
    // Get from database
    return [];
  }

  private async saveDonationToDatabase(donation: StreamDonation): Promise<void> {
    // Save to database
  }
}

export const liveStreamingService = LiveStreamingService.getInstance();
export default liveStreamingService;
