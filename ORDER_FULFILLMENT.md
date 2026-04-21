# Order Fulfillment & Tracking Documentation

## Order Status Flow

```
                    ┌─────────────────────┐
                    │  PENDING_PAYMENT    │
                    │  (Initial state)    │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
            ┌──────────────┐      ┌──────────────┐
            │ PAID         │      │PAYMENT_FAILED│
            │ (Confirmed)  │      │ (Retry)      │
            └──────┬───────┘      └──────────────┘
                   │
                   ▼
            ┌──────────────┐
            │ PROCESSING   │
            │ (Preparing)  │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │   SHIPPED    │
            │ (In transit) │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  DELIVERED   │
            │ (Received)   │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  COMPLETED   │
            │ (Finished)   │
            └──────────────┘

Cancelled can occur at:
pending_payment → CANCELLED
payment_failed → CANCELLED
paid → CANCELLED
```

## Order Statuses

### PENDING_PAYMENT
**Description:** Order created, awaiting payment confirmation
**Actions Available:**
- Accept payment → PAID
- Payment fails → PAYMENT_FAILED
- Customer cancels → CANCELLED

**Customer View:** 
- "Complete your payment to proceed"
- Payment link
- Time remaining to pay (optional)

### PAYMENT_FAILED
**Description:** Payment could not be processed
**Actions Available:**
- Retry payment → PAID
- Cancel order → CANCELLED

**Customer View:**
- Error message explaining failure
- Retry payment button
- Contact support option

### PAID
**Description:** Payment confirmed, ready for fulfillment
**Actions Available:**
- Start processing → PROCESSING
- Cancel order → CANCELLED

**Artisan View:**
- New order notification
- Start preparing items

### PROCESSING
**Description:** Order being prepared and packed
**Actions Available:**
- Mark shipped → SHIPPED

**Artisan View:**
- Order details for packing
- Items to prepare
- Shipping address
- Generate shipping label

### SHIPPED
**Description:** Order dispatched and in transit
**Actions Available:**
- Mark delivered → DELIVERED

**Customer View:**
- Tracking number
- Estimated delivery date
- Carrier information
- Real-time tracking (if available)

### DELIVERED
**Description:** Order reached customer
**Actions Available:**
- Complete order → COMPLETED
- Can leave review

**Customer View:**
- Delivery confirmation
- Can request refund
- Can leave review

### COMPLETED
**Description:** Order finished and confirmed
**Actions Available:** None (terminal state)

**Customer View:**
- Order summary
- Review section
- Return information (if applicable)

### CANCELLED
**Description:** Order cancelled (terminal state)
**Reasons:**
- Customer requested before payment
- Payment not completed
- Other circumstances

**Customer View:**
- Cancellation confirmation
- Refund status (if paid)

## Fulfillment Service API

### Payment Confirmation
```typescript
import { fulfillmentService } from '@/lib/order-service';

// Confirm payment and move to PAID status
const order = await fulfillmentService.confirmPayment(orderId);
```

### Start Processing
```typescript
// Move order to processing when ready to ship
const order = await fulfillmentService.startProcessing(orderId);
// Triggers notification to artisan if applicable
```

### Ship Order
```typescript
// Mark order as shipped with tracking number
const order = await fulfillmentService.shipOrder(
  orderId,
  'ETH-20240421-ABC123'
);
// Tracking number stored for customer visibility
```

### Deliver Order
```typescript
// Mark order as delivered
const order = await fulfillmentService.deliverOrder(orderId);
// Customer can now leave review
```

### Complete Order
```typescript
// Customer confirms receipt
const order = await fulfillmentService.completeOrder(orderId);
```

### Cancel Order
```typescript
// Cancel with optional reason
const order = await fulfillmentService.cancelOrder(
  orderId,
  'Out of stock'
);
// Only works for non-shipped orders
```

## Status Validation

### Valid Transitions
```typescript
import { canTransitionTo, getValidNextStatuses } from '@/lib/order-service';

// Check if transition is valid
if (canTransitionTo('paid', 'processing')) {
  // Safe to transition
}

// Get all valid next statuses
const nextStatuses = getValidNextStatuses('processing');
// Returns: ['shipped']
```

## Order Progress

### Progress Percentage
```typescript
import { getOrderProgress } from '@/lib/order-service';

const progress = getOrderProgress('shipped');
// Returns: 75 (75% complete)
```

**Progress Mapping:**
- PENDING_PAYMENT: 10%
- PAYMENT_FAILED: 10%
- PAID: 25%
- PROCESSING: 50%
- SHIPPED: 75%
- DELIVERED: 90%
- COMPLETED: 100%
- CANCELLED: 0%

## Order Tracking

### Tracking Information
```typescript
import { trackingService } from '@/lib/order-service';

const tracking = trackingService.getTrackingInfo(order);
// Returns:
// {
//   orderId: 'order-001',
//   orderNumber: 'ORD-2024-ABC123',
//   status: 'shipped',
//   trackingNumber: 'ETH-20240421-ABC123',
//   shippingAddress: {...},
//   estimatedDelivery: Date,
//   isLate: false,
//   daysRemaining: 3,
//   timeline: [...],
//   carrier: { name: '...', logo: '...', url: '...' }
// }
```

### Tracking Timeline
```typescript
import { fulfillmentService } from '@/lib/order-service';

const timeline = fulfillmentService.getOrderTimeline(order);
// Returns array of status changes with timestamps
```

### External Carrier Tracking
```typescript
// Get tracking info from carrier (e.g., postal service)
const carrierTracking = await trackingService.trackWithCarrier(
  'ETH-20240421-ABC123'
);
```

### Delivery Estimates
```typescript
import { 
  getEstimatedDeliveryDate,
  formatDeliveryDate,
  getDaysRemainingForDelivery
} from '@/lib/order-service';

// Get estimated delivery date
const deliveryDate = getEstimatedDeliveryDate(order);

// Format for display
const formatted = formatDeliveryDate(deliveryDate);
// "Monday, April 22, 2024"

// Get days remaining
const daysRemaining = fulfillmentService.getDaysRemainingForDelivery(order);
```

### Check if Order is Late
```typescript
const isLate = fulfillmentService.isOrderLate(order);
if (isLate) {
  // Send follow-up notification
}
```

## Refunds

### Refund Policy by Status

| Status | Refundable | Amount | Notes |
|--------|-----------|--------|-------|
| PENDING_PAYMENT | ✓ | 100% | Full refund, no processing |
| PAYMENT_FAILED | ✓ | 100% | Full refund before retry |
| PAID | ✓ | 100% | Full refund before shipment |
| PROCESSING | ✓ | 100% | Full refund before shipment |
| SHIPPED | ✓ | 80% | 20% restocking fee |
| DELIVERED | ✓ | 50% | 50% restocking fee |
| COMPLETED | ✗ | 0% | No refund (by policy) |
| CANCELLED | ✗ | N/A | Already cancelled |

### Refund Service
```typescript
import { refundService } from '@/lib/order-service';

// Check if order is refundable
if (refundService.isRefundable(order)) {
  // Get refundable amount
  const amount = refundService.getRefundableAmount(order);
  
  // Request refund
  const refund = await refundService.requestRefund(
    orderId,
    'product_damaged',
    'Corner of box damaged'
  );
}

// Get refund reasons
const reasons = refundService.getRefundReasons();
// Returns: [
//   { id: 'damaged', label: 'Product damaged' },
//   { id: 'defective', label: 'Product defective' },
//   ...
// ]
```

## Batch Operations (Admin)

### Process Multiple Orders
```typescript
import { batchOrderOps } from '@/lib/order-service';

// Mark multiple orders as processing
await batchOrderOps.markAsProcessing([
  'order-001',
  'order-002',
  'order-003'
]);

// Ship multiple orders at once
await batchOrderOps.shipOrders([
  { orderId: 'order-001', trackingNumber: 'ETH-001' },
  { orderId: 'order-002', trackingNumber: 'ETH-002' },
]);

// Cancel multiple orders
await batchOrderOps.cancelOrders(
  ['order-001', 'order-002'],
  'Inventory issues'
);
```

## Order Timeline Display

### Timeline Component Data
```typescript
const timeline = fulfillmentService.getOrderTimeline(order);
// Returns:
// [
//   {
//     status: 'pending_payment',
//     timestamp: Date,
//     label: 'Order created'
//   },
//   {
//     status: 'paid',
//     timestamp: Date,
//     label: 'Payment confirmed'
//   },
//   ...
// ]
```

## Carrier Integration

### Supported Carriers
- **Ethiopian Postal Service** (ETH-xxxxxx)
- **FastX Delivery** (FX-xxxxxx)
- **Local Delivery** (Generic)

### Tracking Number Format
- Ethiopian Post: `ETH-YYYYMMDD-XXXXXX`
- FastX: `FX-XXXXXX`

### Carrier Info
```typescript
const carrier = getCarrierInfo('ETH-20240421-ABC123');
// Returns:
// {
//   name: 'Ethiopian Postal Service',
//   logo: '📮',
//   url: 'https://tracking.ethiopianpost.et'
// }
```

## Notifications

### Customer Notifications
- **PAID:** Order confirmed, processing started
- **PROCESSING:** "Your order is being prepared"
- **SHIPPED:** Shipping confirmation with tracking number
- **DELIVERED:** Delivery confirmation
- **COMPLETED:** Order completed successfully

### Artisan Notifications
- **PAID:** New order received
- **PROCESSING:** Order ready to ship notification (if applicable)
- **SHIPPED:** Shipment confirmation

### Admin Notifications
- **CANCELLED:** Order cancellation alert
- **FAILED:** Payment failures (batch summary)
- **OVERDUE:** Orders not shipped within SLA

## SLA Compliance

### Service Level Agreement
- **PAID → PROCESSING:** 24 hours
- **PROCESSING → SHIPPED:** 48 hours
- **SHIPPED → DELIVERED:** Based on selected shipping method
  - Standard: 3-5 days
  - Express: 1-2 days
- **DELIVERED → COMPLETED:** 7 days (auto-complete after 7 days)

### SLA Monitoring
```typescript
// Get overdue orders
const overdue = await orderService.getByStatus('processing');
const delayed = overdue.filter(o => fulfillmentService.isOrderLate(o));

// Alert if SLA breached
delayed.forEach(order => {
  console.warn(`Order ${order.id} is overdue for shipment`);
  // Send alert to admin
});
```

## Order Export

### Export Order Data
```typescript
// Export order with all details for printing
const order = await orderService.getById(orderId);
const doc = {
  orderNumber: formatOrderNumber(order.id),
  date: new Date(order.createdAt).toLocaleDateString(),
  customer: {
    name: order.shippingAddress.name,
    email: order.customerId,
    phone: order.shippingAddress.phone,
  },
  items: order.items,
  total: order.total,
  shippingAddress: order.shippingAddress,
};

// Use for packing slip, invoice, shipping label
```

## Troubleshooting

### Order Stuck in Processing
- Check if tracking number was added
- Verify shipping address is complete
- Contact artisan if not responding

### Late Delivery
- Check tracking with carrier
- Contact courier for status
- Offer refund if applicable

### Payment Failed
- Check payment provider logs
- Try payment again
- Contact customer support

### Missing Tracking Number
- Request from artisan
- If not provided after 48h, escalate
- Offer refund if unresolvable

## Artisan Shipping Integration

### Prepare Order for Shipping
When order status moves to PROCESSING:

1. Artisan receives notification
2. Retrieves order with shipping address
3. Prepares and packs items
4. Generates shipping label
5. Ships with tracking number
6. Updates tracking number in system

### Update Shipping Status
```typescript
// Artisan updates tracking number
await fulfillmentService.shipOrder(
  orderId,
  'ETH-20240421-XYZ789'
);
```

## Analytics

### Fulfillment Metrics
```typescript
// Get order metrics
const metrics = {
  pendingCount: orders.filter(o => o.status === 'pending_payment').length,
  processingCount: orders.filter(o => o.status === 'processing').length,
  shippedCount: orders.filter(o => o.status === 'shipped').length,
  deliveredCount: orders.filter(o => o.status === 'delivered').length,
  completedCount: orders.filter(o => o.status === 'completed').length,
  cancelledCount: orders.filter(o => o.status === 'cancelled').length,
  
  // Timing metrics
  avgTimeToShip: calculateAvg('processing_to_shipped'),
  avgTimeToDelivery: calculateAvg('shipped_to_delivered'),
  avgTimeToComplete: calculateAvg('created_to_completed'),
  
  // SLA metrics
  slaCompliance: (onTimeOrders / totalOrders) * 100,
  lateOrders: orders.filter(o => fulfillmentService.isOrderLate(o)).length,
};
```

## Production Considerations

### Database Schema
- Orders table with status field
- Order items table
- Order status history table (audit trail)
- Tracking information table
- Refund requests table

### External Integrations
- Payment gateway webhooks
- Carrier API integrations
- Email notification service
- SMS notification service (optional)

### Security
- Validate status transitions
- Authenticate status updates
- Log all status changes
- Prevent direct database updates
- Verify order ownership before updates

### Performance
- Index orders by status
- Cache frequently accessed orders
- Batch notification sends
- Archive old orders
- Implement pagination for lists
