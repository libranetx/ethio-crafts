'use client';

import { Notification, NotificationType } from './types';
import { notificationService as dataService } from './data-service';

/**
 * Notification types and their configurations
 */
export const notificationTypeConfig = {
  order_placed: {
    title: 'Order Placed',
    icon: '📦',
    category: 'order',
    priority: 'high',
  },
  order_confirmed: {
    title: 'Order Confirmed',
    icon: '✓',
    category: 'order',
    priority: 'high',
  },
  order_shipped: {
    title: 'Order Shipped',
    icon: '🚚',
    category: 'order',
    priority: 'high',
  },
  order_delivered: {
    title: 'Order Delivered',
    icon: '📬',
    category: 'order',
    priority: 'high',
  },
  review_posted: {
    title: 'New Review',
    icon: '⭐',
    category: 'review',
    priority: 'medium',
  },
  product_verified: {
    title: 'Product Verified',
    icon: '✓✓',
    category: 'verification',
    priority: 'high',
  },
  product_rejected: {
    title: 'Product Rejected',
    icon: '❌',
    category: 'verification',
    priority: 'high',
  },
  verification_task: {
    title: 'Verification Task',
    icon: '📋',
    category: 'verification',
    priority: 'medium',
  },
  payment_received: {
    title: 'Payment Received',
    icon: '💰',
    category: 'payment',
    priority: 'high',
  },
  system_update: {
    title: 'System Update',
    icon: '🔔',
    category: 'system',
    priority: 'low',
  },
};

/**
 * Notification template generator
 */
export const notificationTemplates = {
  order_placed: (orderId: string, total: number) => ({
    title: 'Order Placed Successfully',
    message: `Your order #${orderId} for ETB ${total} has been created. You will receive a confirmation once payment is processed.`,
  }),

  order_confirmed: (orderId: string, itemCount: number) => ({
    title: 'Order Confirmed',
    message: `Payment confirmed for order #${orderId} containing ${itemCount} item${itemCount > 1 ? 's' : ''}. Your order is being prepared for shipment.`,
  }),

  order_shipped: (orderId: string, trackingNumber: string) => ({
    title: 'Your Order Has Shipped',
    message: `Your order #${orderId} is on its way! Tracking number: ${trackingNumber}`,
  }),

  order_delivered: (orderId: string) => ({
    title: 'Order Delivered',
    message: `Your order #${orderId} has been delivered. Please confirm receipt and leave a review!`,
  }),

  review_posted: (reviewerName: string, productName: string) => ({
    title: 'New Review on Your Product',
    message: `${reviewerName} left a review on "${productName}". Check it out!`,
  }),

  product_verified: (productName: string) => ({
    title: 'Product Verified Successfully',
    message: `Congratulations! Your product "${productName}" has been verified and is now available for sale.`,
  }),

  product_rejected: (productName: string, reason: string) => ({
    title: 'Product Verification Failed',
    message: `Your product "${productName}" was not approved. Reason: ${reason}. You can resubmit with corrections.`,
  }),

  verification_task: (agentName: string) => ({
    title: 'Verification Task Assigned',
    message: `Agent ${agentName} has been assigned to verify your product sample. You can track the progress in your dashboard.`,
  }),

  payment_received: (amount: number) => ({
    title: 'Payment Received',
    message: `We received your payment of ETB ${amount}. Thank you for your purchase!`,
  }),

  system_update: (updateTitle: string) => ({
    title: 'System Update',
    message: `${updateTitle}. We've made improvements to better serve you.`,
  }),
};

/**
 * Notification manager
 */
export const notificationManager = {
  /**
   * Create and send notification
   */
  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string
  ): Promise<Notification> {
    return await dataService.create({
      userId,
      type,
      title,
      message,
      relatedId,
      read: false,
      createdAt: new Date(),
    });
  },

  /**
   * Get user notifications
   */
  async getNotifications(userId: string, unreadOnly: boolean = false) {
    return await dataService.getByUser(userId, unreadOnly);
  },

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const notifications = await dataService.getByUser(userId, true);
    return notifications.length;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    return await dataService.markAsRead(notificationId);
  },

  /**
   * Mark all as read for user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    return await dataService.markAllAsRead(userId);
  },

  /**
   * Get notifications by type
   */
  async getByType(userId: string, type: NotificationType) {
    const notifications = await dataService.getByUser(userId);
    return notifications.filter((n) => n.type === type);
  },

  /**
   * Get notifications by category
   */
  async getByCategory(userId: string, category: string) {
    const notifications = await dataService.getByUser(userId);
    return notifications.filter((n) => {
      const config = notificationTypeConfig[n.type as NotificationType];
      return config && config.category === category;
    });
  },

  /**
   * Delete notification
   */
  async delete(notificationId: string): Promise<boolean> {
    // In a real system, implement deletion
    return true;
  },

  /**
   * Clear all notifications for user
   */
  async clearAll(userId: string): Promise<boolean> {
    const notifications = await dataService.getByUser(userId);
    for (const notif of notifications) {
      await this.delete(notif.id);
    }
    return true;
  },
};

/**
 * Notification event emitter (for different channels)
 */
export const notificationChannels = {
  /**
   * Send in-app notification
   */
  async sendInApp(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string
  ) {
    return await notificationManager.notify(userId, type, title, message, relatedId);
  },

  /**
   * Send email notification (for critical events)
   */
  async sendEmail(
    email: string,
    type: NotificationType,
    title: string,
    message: string,
    html?: string
  ) {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`[EMAIL] To: ${email}, Type: ${type}, Title: ${title}`);
    
    return {
      success: true,
      channel: 'email',
      recipient: email,
      timestamp: new Date(),
    };
  },

  /**
   * Send SMS notification (optional)
   */
  async sendSMS(
    phone: string,
    type: NotificationType,
    message: string
  ) {
    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`[SMS] To: ${phone}, Type: ${type}, Message: ${message}`);
    
    return {
      success: true,
      channel: 'sms',
      recipient: phone,
      timestamp: new Date(),
    };
  },

  /**
   * Send push notification
   */
  async sendPush(
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ) {
    // In production, integrate with push notification service
    console.log(`[PUSH] User: ${userId}, Type: ${type}, Title: ${title}`);
    
    return {
      success: true,
      channel: 'push',
      userId,
      timestamp: new Date(),
    };
  },
};

/**
 * Notification rules engine - determines which channels to use
 */
export const notificationRules = {
  /**
   * Get notification channels based on type and urgency
   */
  getChannels(type: NotificationType, recipientPreferences?: {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
  }) {
    const config = notificationTypeConfig[type];
    if (!config) return ['in_app'];

    const channels: string[] = ['in_app'];

    // High priority notifications also go via email
    if (config.priority === 'high') {
      if (recipientPreferences?.emailEnabled !== false) {
        channels.push('email');
      }
    }

    // Optional SMS for critical updates
    if (['order_shipped', 'order_delivered'].includes(type)) {
      if (recipientPreferences?.smsEnabled === true) {
        channels.push('sms');
      }
    }

    // Push notifications if enabled
    if (recipientPreferences?.pushEnabled !== false) {
      channels.push('push');
    }

    return channels;
  },

  /**
   * Batch notification preferences
   */
  preferences: {
    customers: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
    },
    artisans: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
    },
    agents: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
    },
    admins: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
    },
  },
};

/**
 * Event-driven notification triggers
 */
export const notificationTriggers = {
  /**
   * Trigger on order placed
   */
  async onOrderPlaced(userId: string, orderId: string, total: number) {
    const template = notificationTemplates.order_placed(orderId, total);
    return await notificationChannels.sendInApp(
      userId,
      'order_placed',
      template.title,
      template.message,
      orderId
    );
  },

  /**
   * Trigger on payment confirmed
   */
  async onPaymentConfirmed(userId: string, orderId: string, itemCount: number) {
    const template = notificationTemplates.order_confirmed(orderId, itemCount);
    await notificationChannels.sendInApp(
      userId,
      'order_confirmed',
      template.title,
      template.message,
      orderId
    );
    // Also send email for payment confirmation
    await notificationChannels.sendEmail(
      userId,
      'order_confirmed',
      template.title,
      template.message
    );
  },

  /**
   * Trigger on order shipped
   */
  async onOrderShipped(userId: string, orderId: string, trackingNumber: string, email?: string) {
    const template = notificationTemplates.order_shipped(orderId, trackingNumber);
    await notificationChannels.sendInApp(
      userId,
      'order_shipped',
      template.title,
      template.message,
      orderId
    );
    if (email) {
      await notificationChannels.sendEmail(
        email,
        'order_shipped',
        template.title,
        template.message
      );
    }
  },

  /**
   * Trigger on order delivered
   */
  async onOrderDelivered(userId: string, orderId: string, email?: string) {
    const template = notificationTemplates.order_delivered(orderId);
    await notificationChannels.sendInApp(
      userId,
      'order_delivered',
      template.title,
      template.message,
      orderId
    );
    if (email) {
      await notificationChannels.sendEmail(
        email,
        'order_delivered',
        template.title,
        template.message
      );
    }
  },

  /**
   * Trigger on product verified
   */
  async onProductVerified(artisanId: string, productName: string, email?: string) {
    const template = notificationTemplates.product_verified(productName);
    await notificationChannels.sendInApp(
      artisanId,
      'product_verified',
      template.title,
      template.message
    );
    if (email) {
      await notificationChannels.sendEmail(
        email,
        'product_verified',
        template.title,
        template.message
      );
    }
  },

  /**
   * Trigger on product rejected
   */
  async onProductRejected(
    artisanId: string,
    productName: string,
    rejectionReason: string,
    email?: string
  ) {
    const template = notificationTemplates.product_rejected(productName, rejectionReason);
    await notificationChannels.sendInApp(
      artisanId,
      'product_rejected',
      template.title,
      template.message
    );
    if (email) {
      await notificationChannels.sendEmail(
        email,
        'product_rejected',
        template.title,
        template.message
      );
    }
  },

  /**
   * Trigger on review posted
   */
  async onReviewPosted(artisanId: string, reviewerName: string, productName: string) {
    const template = notificationTemplates.review_posted(reviewerName, productName);
    return await notificationChannels.sendInApp(
      artisanId,
      'review_posted',
      template.title,
      template.message
    );
  },

  /**
   * Trigger on verification task assigned
   */
  async onVerificationTaskAssigned(artisanId: string, agentName: string, email?: string) {
    const template = notificationTemplates.verification_task(agentName);
    await notificationChannels.sendInApp(
      artisanId,
      'verification_task',
      template.title,
      template.message
    );
    if (email) {
      await notificationChannels.sendEmail(
        email,
        'verification_task',
        template.title,
        template.message
      );
    }
  },

  /**
   * Trigger on payment received
   */
  async onPaymentReceived(artisanId: string, amount: number, email?: string) {
    const template = notificationTemplates.payment_received(amount);
    await notificationChannels.sendInApp(
      artisanId,
      'payment_received',
      template.title,
      template.message
    );
    if (email) {
      await notificationChannels.sendEmail(
        email,
        'payment_received',
        template.title,
        template.message
      );
    }
  },
};

/**
 * Batch notification processor
 */
export const batchNotifications = {
  /**
   * Send notifications to multiple users
   */
  async sendToMultiple(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string
  ) {
    const notifications = [];
    for (const userId of userIds) {
      const notif = await notificationChannels.sendInApp(
        userId,
        type,
        title,
        message
      );
      notifications.push(notif);
    }
    return notifications;
  },

  /**
   * Send daily digest
   */
  async sendDigest(userId: string, dayOfWeek: number = new Date().getDay()) {
    const notifications = await notificationManager.getNotifications(userId);
    const unreadCount = notifications.filter((n) => !n.read).length;

    if (unreadCount === 0) return;

    const message = `You have ${unreadCount} unread notifications. Check your dashboard to stay updated!`;
    
    return await notificationChannels.sendEmail(
      userId,
      'system_update',
      'Your Daily Notification Digest',
      message
    );
  },

  /**
   * Send weekly report
   */
  async sendWeeklyReport(artisanId: string, stats: any) {
    const message = `Weekly Report:
- New Orders: ${stats.newOrders}
- Total Sales: ETB ${stats.totalSales}
- Average Rating: ${stats.avgRating}
- Reviews: ${stats.newReviews}`;

    return await notificationChannels.sendEmail(
      artisanId,
      'system_update',
      'Your Weekly Sales Report',
      message
    );
  },
};

/**
 * Notification history and analytics
 */
export const notificationAnalytics = {
  /**
   * Get notification stats for user
   */
  async getUserStats(userId: string) {
    const notifications = await notificationManager.getNotifications(userId);
    
    const stats = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    notifications.forEach((n) => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
      
      const config = notificationTypeConfig[n.type];
      if (config) {
        stats.byCategory[config.category] = 
          (stats.byCategory[config.category] || 0) + 1;
      }
    });

    return stats;
  },

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(userId: string, days: number = 7) {
    const notifications = await notificationManager.getNotifications(userId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recent = notifications.filter((n) => n.createdAt > cutoffDate);
    const readNotifications = recent.filter((n) => n.read);

    return {
      totalSent: recent.length,
      totalRead: readNotifications.length,
      readRate: recent.length > 0 ? 
        Math.round((readNotifications.length / recent.length) * 100) : 0,
      avgTimeToRead: calculateAvgTimeToRead(readNotifications),
    };
  },
};

/**
 * Helper function (mock)
 */
function calculateAvgTimeToRead(notifications: Notification[]): number {
  // In a real system, track when notification was read
  return 0;
}
