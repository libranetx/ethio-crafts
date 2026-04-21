# Notification System Documentation

## Overview

The notification system handles all user communications across in-app, email, SMS, and push channels. It uses an event-driven architecture with configurable rules for multi-channel delivery.

## Notification Types

### Order Notifications
- **order_placed** - Customer places order (HIGH priority)
- **order_confirmed** - Payment confirmed (HIGH priority)
- **order_shipped** - Order dispatched with tracking (HIGH priority)
- **order_delivered** - Order received (HIGH priority)

### Verification Notifications
- **verification_task** - Task assigned to agent (MEDIUM priority)
- **product_verified** - Artisan product approved (HIGH priority)
- **product_rejected** - Product not approved (HIGH priority)

### Review Notifications
- **review_posted** - Customer left review on product (MEDIUM priority)

### Payment Notifications
- **payment_received** - Artisan payment processed (HIGH priority)

### System Notifications
- **system_update** - Platform updates (LOW priority)

## Notification Manager API

### Create and Send Notification
```typescript
import { notificationManager } from '@/lib/notification-service';

const notif = await notificationManager.notify(
  userId,
  'order_placed',
  'Order Placed Successfully',
  'Your order #12345 has been created',
  relatedId: 'order-001'
);
```

### Get Notifications
```typescript
// Get all notifications
const notifications = await notificationManager.getNotifications(userId);

// Get unread only
const unread = await notificationManager.getNotifications(userId, true);

// Get unread count
const count = await notificationManager.getUnreadCount(userId);
```

### Mark as Read
```typescript
// Mark single notification
await notificationManager.markAsRead(notificationId);

// Mark all as read
await notificationManager.markAllAsRead(userId);
```

### Filter Notifications
```typescript
// By type
const orderNotifs = await notificationManager.getByType(userId, 'order_placed');

// By category
const orderNotifs = await notificationManager.getByCategory(userId, 'order');
```

## Notification Channels

### In-App Notifications
Displayed in the notification center on the platform
- Non-intrusive
- Persistent (stored in database)
- Can be marked as read
- Available 24/7

```typescript
await notificationChannels.sendInApp(
  userId,
  'order_placed',
  'Order Placed',
  'Your order has been created'
);
```

### Email Notifications
Sent to customer email for important updates
- For HIGH priority notifications by default
- Includes formatted HTML templates
- Trackable deliverability

```typescript
await notificationChannels.sendEmail(
  email,
  'order_confirmed',
  'Order Confirmed',
  'Your order has been confirmed and will be shipped soon'
);
```

### SMS Notifications (Optional)
Text messages for time-sensitive updates
- Enabled for shipping notifications
- Short, clear messages
- Quick delivery

```typescript
await notificationChannels.sendSMS(
  phone,
  'order_shipped',
  'Your order has shipped! Tracking: ETH-123456'
);
```

### Push Notifications
Mobile app push notifications
- Real-time delivery
- High engagement
- Optional, can be disabled by users

```typescript
await notificationChannels.sendPush(
  userId,
  'order_delivered',
  'Order Delivered',
  'Your order has been delivered'
);
```

## Notification Rules Engine

### Determining Delivery Channels

The system automatically chooses channels based on:
1. Notification type and priority
2. User preferences
3. Communication rules

```typescript
import { notificationRules } from '@/lib/notification-service';

// Get applicable channels for a notification type
const channels = notificationRules.getChannels('order_shipped', {
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true
});
// Returns: ['in_app', 'email', 'push']
```

### User Preferences

Users can customize notification settings:

```typescript
const preferences = {
  emailEnabled: true,   // Receive email notifications
  smsEnabled: false,    // Don't send SMS
  pushEnabled: true,    // Receive push notifications
};
```

### Default Preferences by Role

```
Customers:
  - Email: Enabled (for order updates)
  - SMS: Disabled (optional)
  - Push: Enabled

Artisans:
  - Email: Enabled (for sales, verifications)
  - SMS: Enabled (for important updates)
  - Push: Enabled

Agents:
  - Email: Enabled (for task assignments)
  - SMS: Enabled (for urgent verifications)
  - Push: Enabled

Admins:
  - Email: Enabled (for alerts)
  - SMS: Enabled (for critical issues)
  - Push: Enabled
```

## Event-Driven Triggers

Notifications are triggered automatically on key events:

### Order Events
```typescript
import { notificationTriggers } from '@/lib/notification-service';

// When order is placed
await notificationTriggers.onOrderPlaced(
  customerId,
  'order-001',
  7302.50
);

// When payment confirmed
await notificationTriggers.onPaymentConfirmed(
  customerId,
  'order-001',
  3  // item count
);

// When order shipped
await notificationTriggers.onOrderShipped(
  customerId,
  'order-001',
  'ETH-20240421-ABC123',
  'customer@example.com'  // Optional email
);

// When order delivered
await notificationTriggers.onOrderDelivered(
  customerId,
  'order-001',
  'customer@example.com'
);
```

### Product Events
```typescript
// When product verified
await notificationTriggers.onProductVerified(
  artisanId,
  'Traditional Shawl',
  'artisan@example.com'
);

// When product rejected
await notificationTriggers.onProductRejected(
  artisanId,
  'Traditional Shawl',
  'Dimensions do not match specification',
  'artisan@example.com'
);
```

### Review Events
```typescript
// When review posted
await notificationTriggers.onReviewPosted(
  artisanId,
  'John Doe',
  'Traditional Shawl'
);
```

### Verification Events
```typescript
// When verification task assigned
await notificationTriggers.onVerificationTaskAssigned(
  artisanId,
  'Agent Aman Mulatu',
  'artisan@example.com'
);
```

### Payment Events
```typescript
// When artisan payment received
await notificationTriggers.onPaymentReceived(
  artisanId,
  5000,  // amount in ETB
  'artisan@example.com'
);
```

## Notification Templates

Pre-built templates with placeholder substitution:

```typescript
import { notificationTemplates } from '@/lib/notification-service';

// Order placed template
const template = notificationTemplates.order_placed('order-001', 7302.50);
// Returns:
// {
//   title: 'Order Placed Successfully',
//   message: 'Your order #order-001 for ETB 7,302.50 has been created...'
// }

// Product rejected template
const template = notificationTemplates.product_rejected(
  'Traditional Shawl',
  'Dimensions do not match specification'
);
```

### Creating Custom Templates
```typescript
const customTemplate = {
  title: 'Custom Event',
  message: `User ${name} performed action at ${date}`
};
```

## Batch Notifications

### Send to Multiple Users
```typescript
import { batchNotifications } from '@/lib/notification-service';

await batchNotifications.sendToMultiple(
  ['user-001', 'user-002', 'user-003'],
  'system_update',
  'Platform Maintenance',
  'We are performing maintenance tonight 10 PM - 12 AM'
);
```

### Daily Digest
```typescript
// Send daily summary of unread notifications
await batchNotifications.sendDigest(userId);
```

### Weekly Report
```typescript
// Send artisan weekly sales report
await batchNotifications.sendWeeklyReport(artisanId, {
  newOrders: 5,
  totalSales: 25000,
  avgRating: 4.8,
  newReviews: 3
});
```

## Notification Analytics

### User Statistics
```typescript
import { notificationAnalytics } from '@/lib/notification-service';

const stats = await notificationAnalytics.getUserStats(userId);
// Returns:
// {
//   total: 25,
//   unread: 3,
//   byType: {
//     order_placed: 5,
//     order_shipped: 4,
//     ...
//   },
//   byCategory: {
//     order: 15,
//     review: 3,
//     ...
//   }
// }
```

### Engagement Metrics
```typescript
// Get how many notifications users are reading
const metrics = await notificationAnalytics.getEngagementMetrics(
  userId,
  7  // last 7 days
);
// Returns:
// {
//   totalSent: 20,
//   totalRead: 16,
//   readRate: 80,
//   avgTimeToRead: 2.5  // hours
// }
```

## Notification Center UI Components

### Notification Badge
```tsx
import { useNotifications } from '@/hooks/useNotifications';

function NotificationBell() {
  const { unreadCount } = useNotifications();
  
  return (
    <button className="relative">
      🔔
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
```

### Notification List
```tsx
function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  
  return (
    <div className="notification-center">
      <header>
        <h2>Notifications</h2>
        <button onClick={() => markAllAsRead()}>Mark all as read</button>
      </header>
      
      <ul>
        {notifications.map(notif => (
          <li 
            key={notif.id} 
            className={notif.read ? 'read' : 'unread'}
            onClick={() => markAsRead(notif.id)}
          >
            <span className="icon">{getIcon(notif.type)}</span>
            <div>
              <h3>{notif.title}</h3>
              <p>{notif.message}</p>
              <time>{formatTime(notif.createdAt)}</time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Notification Preferences UI

Allow users to customize notification settings:

```tsx
function NotificationPreferences() {
  const [prefs, setPrefs] = useState({
    orderNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    digestFrequency: 'daily', // or weekly
  });

  return (
    <form>
      <label>
        <input 
          type="checkbox" 
          checked={prefs.orderNotifications}
          onChange={(e) => setPrefs({...prefs, orderNotifications: e.target.checked})}
        />
        Order Notifications
      </label>
      
      <label>
        <input type="checkbox" checked={prefs.emailNotifications} />
        Email Notifications
      </label>
      
      <label>
        <input type="checkbox" checked={prefs.smsNotifications} />
        SMS Notifications
      </label>
      
      <label>
        <input type="checkbox" checked={prefs.pushNotifications} />
        Push Notifications
      </label>
      
      <select value={prefs.digestFrequency}>
        <option value="daily">Daily Digest</option>
        <option value="weekly">Weekly Digest</option>
        <option value="none">No Digest</option>
      </select>
      
      <button type="submit">Save Preferences</button>
    </form>
  );
}
```

## Priority and Urgency

### High Priority (Immediate)
- Payment confirmations
- Order shipments
- Product verification results
- Payment received

**Channels:** In-app + Email (+ SMS optional)

### Medium Priority (Same Day)
- Review notifications
- Verification task assignments
- Order processing updates

**Channels:** In-app + Email

### Low Priority (Batch)
- System updates
- Feature announcements
- Promotional messages

**Channels:** In-app (email digest)

## Unsubscribe and Preferences

All email notifications include unsubscribe links:

```html
<footer>
  <p>Don't want these emails? 
    <a href="https://ethio-crafts.com/preferences">Manage your preferences</a>
  </p>
</footer>
```

Users can:
- Disable specific notification types
- Change notification frequency
- Switch channels (email → SMS, etc.)
- Unsubscribe from all (except critical order updates)

## Email Templates

### Order Confirmation
```
Subject: Your Ethio-Crafts Order Confirmed (#ORDER-123)
Body:
- Order details
- Items ordered
- Estimated delivery
- Tracking placeholder
- Order timeline
- Support contact
```

### Shipping Notification
```
Subject: Your Order Is On Its Way! (Tracking: ETH-123)
Body:
- Tracking number prominently displayed
- Expected delivery date
- Carrier tracking link
- Packaging details
- Support contact
```

### Product Verification
```
Subject: Congratulations! Your Product Is Verified
Body:
- Congratulations message
- Product name and listing URL
- Tips for promotion
- Next steps
```

## Integration with Backend

### Webhook Handlers
```typescript
// When order status changes
POST /api/webhooks/order-status
{
  orderId: 'order-001',
  status: 'shipped',
  trackingNumber: 'ETH-123'
}
// Triggers: onOrderShipped notification

// When payment processed
POST /api/webhooks/payment
{
  orderId: 'order-001',
  status: 'success',
  amount: 7302.50
}
// Triggers: Payment confirmation + onPaymentConfirmed
```

### Database Schema
```sql
-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50),
  title VARCHAR(200),
  message TEXT,
  related_id VARCHAR(100),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  read_at TIMESTAMP
);

-- User preferences
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  digest_frequency VARCHAR(50),
  updated_at TIMESTAMP
);

-- Notification history (for analytics)
CREATE TABLE notification_events (
  id UUID PRIMARY KEY,
  notification_id UUID,
  channel VARCHAR(50),
  status VARCHAR(50),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP
);
```

## Testing Notifications

### Test Scenarios
```typescript
// Test order notification flow
async function testOrderFlow() {
  const orderId = 'test-order-001';
  
  // 1. Order placed
  await notificationTriggers.onOrderPlaced(userId, orderId, 1000);
  
  // 2. Payment confirmed
  await notificationTriggers.onPaymentConfirmed(userId, orderId, 2);
  
  // 3. Order shipped
  await notificationTriggers.onOrderShipped(userId, orderId, 'TEST-123');
  
  // 4. Order delivered
  await notificationTriggers.onOrderDelivered(userId, orderId);
}

// Test notification retrieval
async function testNotificationRetrieval() {
  const unread = await notificationManager.getNotifications(userId, true);
  console.log(`Unread: ${unread.length}`);
  
  const byType = await notificationManager.getByType(userId, 'order_placed');
  console.log(`Order placed notifications: ${byType.length}`);
}
```

## Production Deployment

### Email Service Integration
```typescript
// Update notificationChannels.sendEmail to use:
// - SendGrid
// - AWS SES
// - Mailgun
// - Custom SMTP
```

### SMS Service Integration
```typescript
// Update notificationChannels.sendSMS to use:
// - Twilio
// - AWS SNS
// - MessageBird
// - Local provider
```

### Push Notification Integration
```typescript
// Update notificationChannels.sendPush to use:
// - Firebase Cloud Messaging
// - Apple Push Notification
// - OneSignal
```

### Database Migration
- Replace in-memory storage with real database
- Implement proper indexing for performance
- Add archiving for old notifications
- Implement rate limiting to prevent spam

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Notifications not sent | Channel not configured | Check notificationChannels integration |
| High email bounce rate | Invalid email addresses | Validate email on user signup |
| SMS not received | Phone format incorrect | Use E.164 format (+251XXX) |
| Missing preferences | Not initialized | Create on user creation |
| Old notifications accumulating | No cleanup | Archive notifications after 30 days |

## Best Practices

1. **Use templates** - Always use predefined templates
2. **Batch wisely** - Group related notifications
3. **Respect preferences** - Honor user settings
4. **Time appropriately** - Don't send notifications at night
5. **Personalize** - Include user/product names
6. **Test before launch** - Test all notification paths
7. **Monitor delivery** - Track sent/delivered/read rates
8. **Gradual rollout** - A/B test new notification types
