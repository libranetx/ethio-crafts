# Agent Fulfillment Workflow Documentation

## Overview

This document outlines the **exclusive agent responsibility** for managing order shipment status updates in the Ethio-Crafts marketplace. Agents are the **primary owners** of the fulfillment process, moving orders through the payment → processing → shipped → delivered workflow.

---

## Role Responsibilities

### 👤 **Agent (Primary Owner)**

Agents handle all order fulfillment operations:

- **Mark as Processed** - Confirms payment received and order is ready for shipment
- **Mark as Shipped** - Updates order with tracking information
- **Mark as Delivered** - Confirms successful delivery

#### Key Characteristics:
- ✅ Full fulfillment authority
- ✅ Can move orders through all states sequentially
- ✅ No skipping steps (must follow: paid → processed → shipped → delivered)
- ✅ Handles real-world logistics updates
- ✅ Required to provide tracking numbers when shipping

---

### 👨‍💼 **Admin (Override Only)**

Admin role is **backup control only**, not for daily operations:

- Can override agent status updates if needed
- Can fix errors or handle disputes
- Manual intervention only
- Cannot initiate status updates (observation role)

---

### 👤 **Customer (Read-Only)**

Customers have **no update authority**:

- View order status
- Receive notifications on status changes
- Track delivery via tracking number
- Cannot modify any order states

---

## Order Status Flow

The strict order flow follows this sequence:

```
Payment Confirmed → Processing → Shipped → Delivered → Completed
     (paid)       (processed)   (shipped) (delivered)  (completed)
```

### State Transitions

| Current Status | Next Allowed | Agent Action | Required Fields |
|---|---|---|---|
| `paid` | `processed` | Mark as Processed | None |
| `processed` | `shipped` | Mark as Shipped | Tracking Number * |
| `shipped` | `delivered` | Mark as Delivered | None |
| `delivered` | `completed` | Mark as Completed | None |

**\* = Required field**

---

## Agent Fulfillment Dashboard

### Location
- **Route:** `/dashboard/agent/fulfillment`
- **Component:** `AgentFulfillment.tsx`
- **Access:** Agent dashboard navigation

### Features

#### 1. **Orders Pending Processing**
Lists all orders with `paid` status ready for agent action.

**Order Card Shows:**
- Order number (e.g., ORD-2026-001)
- Customer name
- Total amount (ETB)
- Order date
- Current status badge

**Actions Available:**
- Click to select order
- View detailed customer information
- Mark as processed (confirm shipment readiness)

#### 2. **Orders Pending Shipment**
Lists all orders with `processed` status awaiting shipment confirmation.

**Order Card Shows:**
- Order number
- Customer details
- Shipping address
- Items in order
- Processing date

**Actions Available:**
- Add tracking number (required)
- Select carrier/logistics provider
- Set estimated delivery date
- Mark as shipped
- Customer notified with tracking info

#### 3. **Shipped Orders Ready for Delivery**
Lists all orders with `shipped` status awaiting delivery confirmation.

**Order Card Shows:**
- Tracking number and carrier
- Estimated delivery date
- Customer contact info
- Shipment details

**Actions Available:**
- Mark as delivered
- Customer notified of successful delivery

---

## Implementation Details

### Component Structure

```typescript
// AgentFulfillment.tsx
interface UpdateForm {
  trackingNumber: string      // Required for shipping
  carrierName: string         // Logistics provider
  estimatedDelivery: string   // Delivery estimate (optional)
}

// Status transitions
'processing' → Mark as Processed
'processed' → Mark as Shipped (requires tracking)
'shipped' → Mark as Delivered
```

### Key Functions

#### 1. **handleMarkProcessed(order)**
Marks an order as `processing`, confirming:
- Payment has been received
- Order is ready for shipment
- Sends notification to customer

**Triggers:**
- Customer notification: "Order Processed"
- Status change: `paid` → `processing`
- Order removed from pending list

#### 2. **handleMarkShipped(order)**
Marks an order as `shipped` with tracking details:
- Requires tracking number
- Optional carrier name
- Optional estimated delivery date

**Triggers:**
- Customer notification with tracking number
- Status change: `processing` → `shipped`
- Tracking info added to order
- Order removed from pending list

#### 3. **handleMarkDelivered(order)**
Marks an order as `delivered`, confirming:
- Item has reached customer
- Delivery successful
- Customer satisfaction checkpoint

**Triggers:**
- Customer notification: "Order Delivered"
- Status change: `shipped` → `delivered`
- Order removed from pending list
- Signals end of fulfillment responsibility

---

## Notification System Integration

Each status update triggers automatic customer notifications:

### On Processing
```
Title: Order Processed
Message: "Your order [ORDER_NUMBER] has been processed and is ready for shipment."
Channel: In-app + Email
```

### On Shipping
```
Title: Order Shipped
Message: "Your order [ORDER_NUMBER] has been shipped. Tracking: [TRACKING_NUMBER]"
Metadata: Carrier name, tracking number, estimated delivery
Channel: In-app + Email + SMS
```

### On Delivery
```
Title: Order Delivered
Message: "Your order [ORDER_NUMBER] has been delivered. Thank you for shopping!"
Channel: In-app + Email
```

---

## Validation Rules

### Processing Validation
✓ Order must be in `paid` status
✓ No additional fields required

### Shipping Validation
✓ Order must be in `processing` status
✓ **Tracking number is REQUIRED**
✓ Carrier name is recommended
✓ Estimated delivery is optional

### Delivery Validation
✓ Order must be in `shipped` status
✓ Confirms item reached customer
✓ No additional fields required

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|---|---|---|
| Missing tracking number | Agent tries to ship without tracking | Provide valid tracking number |
| Invalid status transition | Trying to skip steps | Follow sequence: processing → shipped → delivered |
| Order not found | Order ID doesn't exist | Verify order number in system |
| Notification failed | Email/SMS service down | Retry or check notification logs |

### Error Recovery
- All status updates are logged
- Failed updates don't change order state
- Retry mechanism available in UI
- Admin can manually override if needed

---

## Access Control

### Who Can Access This Dashboard?
- ✅ Verified agents only
- ❌ Customers cannot access
- ⚠️ Admins can access (read-only/override)

### Security Considerations
- Agent ID verification required
- Update logs tracked for auditing
- Notifications sent to customer for verification
- No order data leakage to agents (only assigned orders)

---

## Best Practices

### For Agents

1. **Process Orders Daily**
   - Check fulfillment dashboard each morning
   - Process pending orders in FIFO order
   - No status should be >3 days in one state

2. **Provide Accurate Tracking**
   - Always use real tracking numbers
   - Update carrier information
   - Set realistic delivery estimates

3. **Communicate Proactively**
   - Add notes if there are delays
   - Update customers if delivery extends
   - Follow up on failed deliveries

4. **Follow the Flow**
   - Don't skip steps
   - Don't go backwards
   - Always mark processing before shipping

### For Admins (Emergency Only)

1. **Override Only When Necessary**
   - Document reason for override
   - Notify customer of change
   - Review agent's actions

2. **Spot Check**
   - Review agent processing speed
   - Check for tracking accuracy
   - Audit notification delivery

---

## API Integration (Production)

### Current Implementation
- Uses dummy data for development
- Simulates order updates
- Notifications use `notificationService`

### Production Implementation Steps

1. **Replace Dummy Data with Real Orders**
```typescript
// Instead of mock orders
const response = await orderService.getByStatus('processing')
const orders = response.data
```

2. **Use Order Service for Updates**
```typescript
// Update order status in database
await orderService.updateStatus(orderId, 'shipped', {
  trackingNumber: form.trackingNumber,
  carrierName: form.carrierName,
  estimatedDeliveryDate: form.estimatedDelivery,
})
```

3. **Integrate with Real Notification Service**
```typescript
// Send real notifications
await notificationService.sendNotification({
  userId: order.customerId,
  type: 'order_shipped',
  metadata: { trackingNumber, carrierName }
})
```

4. **Add Webhooks for Carrier Updates**
```typescript
// Listen for carrier tracking updates
// Auto-update delivery status when carrier confirms
```

---

## UI Components

### OrderCard Component
- Displays order summary
- Shows status with color coding
- Quick action buttons
- Click to select for details

### OrderDetailsPanel Component
- Full customer information
- Shipping address
- Item list
- Status-specific actions
- Validation messages

### StatusBadge Component
- Color-coded by status
- Shows current state
- Updates in real-time

---

## Testing Scenarios

### Test Case 1: Normal Flow
1. Agent selects order in `paid` state
2. Marks as processed ✓
3. Adds tracking and marks shipped ✓
4. Marks delivered ✓
5. Verify notifications sent ✓

### Test Case 2: Shipping with Details
1. Agent marks as processed
2. Enters tracking number: "ETH-2026-123456"
3. Selects carrier: "Ethiopian Logistics"
4. Sets delivery date: "+3 days"
5. Marks shipped
6. Verify customer gets SMS with tracking ✓

### Test Case 3: Error Recovery
1. Agent forgets tracking number
2. Try to mark shipped → Error ✓
3. Add tracking number
4. Retry → Success ✓

### Test Case 4: Admin Override
1. Agent marked order as shipped
2. Admin detects error
3. Admin reverts to processing
4. Agent fixes tracking
5. Marks shipped again ✓

---

## Metrics & Analytics

### Track These Metrics

| Metric | Target | Purpose |
|---|---|---|
| Avg processing time | <1 day | Order readiness efficiency |
| Avg shipping time | <2 days | Fulfillment speed |
| Avg delivery time | <5 days | Logistics performance |
| Notification success | >99% | Customer communication |
| Tracking accuracy | 100% | Customer trust |

### Agent Performance Dashboard (Future)
- Orders processed today
- Average fulfillment time
- Notification delivery rate
- Customer satisfaction with delivery

---

## Troubleshooting

### Agent Can't See Orders
- Verify agent is assigned to orders
- Check order status is `paid` or `processing`
- Verify agent ID in session

### Notifications Not Sending
- Check notification service status
- Verify customer email/phone
- Check notification preferences
- Review notification logs

### Tracking Number Issues
- Validate format with carrier
- Check for typos
- Confirm carrier in system
- Test with real tracking API

---

## FAQ

**Q: Can agents create orders?**
A: No, agents only manage fulfillment. Orders come from customers.

**Q: What if a customer cancels after marked as processed?**
A: Admin can revert status or handle refund manually.

**Q: Can agents see all orders or only assigned ones?**
A: Production system should show only assigned orders (by region/specialization).

**Q: What happens if package gets lost after shipped?**
A: Customer files claim, admin investigates, agent and customer are notified.

**Q: How long should each status take?**
A: Processing: 1 day, Shipped: 2 days, Delivery: 5 days (varies by location).

---

## Summary

The agent fulfillment system provides:
- ✅ Clear responsibility: agents handle fulfillment
- ✅ Strict workflow: no skipping steps
- ✅ Required tracking: prevents lost packages
- ✅ Automatic notifications: keeps customers informed
- ✅ Audit trail: all actions logged
- ✅ Admin override: emergency control

This ensures efficient, transparent, and customer-friendly order fulfillment.
