'use client';

import { Order, OrderStatus } from './types';
import { orderService } from './data-service';

/**
 * Order status flow
 */
export const ORDER_STATUS_FLOW = {
  PENDING_PAYMENT: 'pending_payment' as OrderStatus,
  PAYMENT_FAILED: 'payment_failed' as OrderStatus,
  PAID: 'paid' as OrderStatus,
  PROCESSING: 'processing' as OrderStatus,
  SHIPPED: 'shipped' as OrderStatus,
  DELIVERED: 'delivered' as OrderStatus,
  COMPLETED: 'completed' as OrderStatus,
  CANCELLED: 'cancelled' as OrderStatus,
};

/**
 * Order status configuration
 */
export const orderStatusConfig = {
  pending_payment: {
    label: 'Pending Payment',
    description: 'Waiting for payment confirmation',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '⏳',
    canCancel: true,
    canReview: false,
  },
  payment_failed: {
    label: 'Payment Failed',
    description: 'Payment could not be processed',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    canCancel: true,
    canReview: false,
  },
  paid: {
    label: 'Paid',
    description: 'Payment confirmed, processing your order',
    color: 'bg-blue-100 text-blue-800',
    icon: '✓',
    canCancel: false,
    canReview: false,
  },
  processing: {
    label: 'Processing',
    description: 'Your order is being prepared for shipment',
    color: 'bg-blue-100 text-blue-800',
    icon: '📦',
    canCancel: false,
    canReview: false,
  },
  shipped: {
    label: 'Shipped',
    description: 'Your order is on its way',
    color: 'bg-purple-100 text-purple-800',
    icon: '🚚',
    canCancel: false,
    canReview: false,
  },
  delivered: {
    label: 'Delivered',
    description: 'Your order has been delivered',
    color: 'bg-green-100 text-green-800',
    icon: '✓',
    canCancel: false,
    canReview: true,
  },
  completed: {
    label: 'Completed',
    description: 'Order complete',
    color: 'bg-green-100 text-green-800',
    icon: '✓✓',
    canCancel: false,
    canReview: false,
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Order has been cancelled',
    color: 'bg-gray-100 text-gray-800',
    icon: '✗',
    canCancel: false,
    canReview: false,
  },
};

/**
 * Get valid next statuses for current status
 */
export function getValidNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  const flowMap: Record<OrderStatus, OrderStatus[]> = {
    pending_payment: ['paid', 'payment_failed', 'cancelled'],
    payment_failed: ['pending_payment', 'cancelled'],
    paid: ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped: ['delivered'],
    delivered: ['completed'],
    completed: [],
    cancelled: [],
  };

  return flowMap[currentStatus] || [];
}

/**
 * Check if order can transition to a status
 */
export function canTransitionTo(currentStatus: OrderStatus, targetStatus: OrderStatus): boolean {
  return getValidNextStatuses(currentStatus).includes(targetStatus);
}

/**
 * Get order progress percentage
 */
export function getOrderProgress(status: OrderStatus): number {
  const progressMap: Record<OrderStatus, number> = {
    pending_payment: 10,
    payment_failed: 10,
    paid: 25,
    processing: 50,
    shipped: 75,
    delivered: 90,
    completed: 100,
    cancelled: 0,
  };

  return progressMap[status] || 0;
}

/**
 * Check if order is in terminal state
 */
export function isTerminalStatus(status: OrderStatus): boolean {
  return ['completed', 'cancelled'].includes(status);
}

/**
 * Check if order is still active
 */
export function isActiveOrder(status: OrderStatus): boolean {
  return !isTerminalStatus(status);
}

/**
 * Format order number
 */
export function formatOrderNumber(orderId: string): string {
  return `ORD-${new Date().getFullYear()}-${orderId.substring(orderId.length - 6).toUpperCase()}`;
}

/**
 * Calculate estimated delivery date
 */
export function getEstimatedDeliveryDate(order: Order): Date {
  const date = new Date(order.createdAt);
  const shippingDays = order.estimatedDelivery ? 
    Math.ceil((new Date(order.estimatedDelivery).getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)) :
    5; // Default 5 days
  date.setDate(date.getDate() + shippingDays);
  return date;
}

/**
 * Format delivery date
 */
export function formatDeliveryDate(date: Date): string {
  return date.toLocaleDateString('en-ET', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Order fulfillment utilities
 */
export const fulfillmentService = {
  /**
   * Confirm payment and move to paid status
   */
  async confirmPayment(orderId: string): Promise<Order | null> {
    const order = await orderService.getById(orderId);
    if (!order) return null;

    if (order.status !== 'pending_payment') {
      throw new Error('Order is not in pending payment status');
    }

    return await orderService.updateStatus(orderId, 'paid');
  },

  /**
   * Start processing order
   */
  async startProcessing(orderId: string): Promise<Order | null> {
    const order = await orderService.getById(orderId);
    if (!order) return null;

    if (order.status !== 'paid') {
      throw new Error('Order must be paid before processing');
    }

    return await orderService.updateStatus(orderId, 'processing');
  },

  /**
   * Mark order as shipped with tracking number
   */
  async shipOrder(orderId: string, trackingNumber: string): Promise<Order | null> {
    const order = await orderService.getById(orderId);
    if (!order) return null;

    if (order.status !== 'processing') {
      throw new Error('Order must be processing before shipping');
    }

    order.trackingNumber = trackingNumber;
    order.status = 'shipped';
    order.updatedAt = new Date();

    return order;
  },

  /**
   * Mark order as delivered
   */
  async deliverOrder(orderId: string): Promise<Order | null> {
    const order = await orderService.getById(orderId);
    if (!order) return null;

    if (order.status !== 'shipped') {
      throw new Error('Order must be shipped before delivery');
    }

    return await orderService.updateStatus(orderId, 'delivered');
  },

  /**
   * Complete order (customer confirms receipt)
   */
  async completeOrder(orderId: string): Promise<Order | null> {
    const order = await orderService.getById(orderId);
    if (!order) return null;

    if (order.status !== 'delivered') {
      throw new Error('Order must be delivered before completion');
    }

    return await orderService.updateStatus(orderId, 'completed');
  },

  /**
   * Cancel order (only if not shipped)
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order | null> {
    const order = await orderService.getById(orderId);
    if (!order) return null;

    if (['shipped', 'delivered', 'completed'].includes(order.status)) {
      throw new Error('Cannot cancel order after shipping');
    }

    if (reason) {
      order.notes = `Cancelled: ${reason}`;
    }

    return await orderService.updateStatus(orderId, 'cancelled');
  },

  /**
   * Get timeline of order status changes
   */
  getOrderTimeline(order: Order) {
    const timeline: Array<{
      status: OrderStatus;
      timestamp: Date;
      label: string;
    }> = [
      {
        status: 'pending_payment',
        timestamp: order.createdAt,
        label: 'Order created',
      },
    ];

    if (order.status !== 'pending_payment' && order.status !== 'payment_failed') {
      timeline.push({
        status: 'paid',
        timestamp: order.createdAt,
        label: 'Payment confirmed',
      });
    }

    if (['processing', 'shipped', 'delivered', 'completed'].includes(order.status)) {
      timeline.push({
        status: 'processing',
        timestamp: order.updatedAt,
        label: 'Order processing',
      });
    }

    if (['shipped', 'delivered', 'completed'].includes(order.status)) {
      timeline.push({
        status: 'shipped',
        timestamp: order.updatedAt,
        label: 'Order shipped',
      });
    }

    if (['delivered', 'completed'].includes(order.status)) {
      timeline.push({
        status: 'delivered',
        timestamp: order.updatedAt,
        label: 'Order delivered',
      });
    }

    if (order.status === 'completed') {
      timeline.push({
        status: 'completed',
        timestamp: order.updatedAt,
        label: 'Order completed',
      });
    }

    return timeline;
  },

  /**
   * Check if order is late
   */
  isOrderLate(order: Order): boolean {
    if (['delivered', 'completed'].includes(order.status)) {
      return false;
    }

    const estimatedDate = getEstimatedDeliveryDate(order);
    return new Date() > estimatedDate;
  },

  /**
   * Get days remaining for delivery
   */
  getDaysRemainingForDelivery(order: Order): number {
    if (['delivered', 'completed'].includes(order.status)) {
      return 0;
    }

    const estimatedDate = getEstimatedDeliveryDate(order);
    const daysRemaining = Math.ceil(
      (estimatedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.max(0, daysRemaining);
  },
};

/**
 * Batch operations for admin
 */
export const batchOrderOps = {
  /**
   * Batch update orders to processing
   */
  async markAsProcessing(orderIds: string[]): Promise<Order[]> {
    const updated: Order[] = [];
    for (const orderId of orderIds) {
      const result = await fulfillmentService.startProcessing(orderId);
      if (result) updated.push(result);
    }
    return updated;
  },

  /**
   * Batch ship orders
   */
  async shipOrders(
    orders: Array<{ orderId: string; trackingNumber: string }>
  ): Promise<Order[]> {
    const shipped: Order[] = [];
    for (const { orderId, trackingNumber } of orders) {
      const result = await fulfillmentService.shipOrder(orderId, trackingNumber);
      if (result) shipped.push(result);
    }
    return shipped;
  },

  /**
   * Cancel multiple orders
   */
  async cancelOrders(orderIds: string[], reason: string): Promise<Order[]> {
    const cancelled: Order[] = [];
    for (const orderId of orderIds) {
      const result = await fulfillmentService.cancelOrder(orderId, reason);
      if (result) cancelled.push(result);
    }
    return cancelled;
  },
};

/**
 * Order tracking
 */
export const trackingService = {
  /**
   * Get tracking info for customer
   */
  getTrackingInfo(order: Order) {
    return {
      orderId: order.id,
      orderNumber: formatOrderNumber(order.id),
      status: order.status,
      trackingNumber: order.trackingNumber,
      shippingAddress: order.shippingAddress,
      estimatedDelivery: getEstimatedDeliveryDate(order),
      isLate: fulfillmentService.isOrderLate(order),
      daysRemaining: fulfillmentService.getDaysRemainingForDelivery(order),
      timeline: fulfillmentService.getOrderTimeline(order),
      carrier: getCarrierInfo(order.trackingNumber),
    };
  },

  /**
   * Track with external carrier (mock)
   */
  async trackWithCarrier(trackingNumber: string) {
    // In production, call actual carrier APIs
    // For now, return mock data
    return {
      trackingNumber,
      status: 'in_transit',
      lastUpdate: new Date(),
      location: 'Addis Ababa Hub',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      history: [
        {
          date: new Date(),
          location: 'Addis Ababa Hub',
          status: 'In transit',
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          location: 'Sorting Center',
          status: 'Processed',
        },
      ],
    };
  },
};

/**
 * Get carrier info from tracking number
 */
function getCarrierInfo(trackingNumber?: string) {
  if (!trackingNumber) return null;

  if (trackingNumber.startsWith('ETH-')) {
    return {
      name: 'Ethiopian Postal Service',
      logo: '📮',
      url: 'https://tracking.ethiopianpost.et',
    };
  }

  if (trackingNumber.startsWith('FX-')) {
    return {
      name: 'FastX Delivery',
      logo: '🚚',
      url: 'https://tracking.fastxdelivery.et',
    };
  }

  return {
    name: 'Local Delivery',
    logo: '📦',
  };
}

/**
 * Order refund utilities
 */
export const refundService = {
  /**
   * Calculate refund amount based on order status
   */
  getRefundableAmount(order: Order): number {
    if (order.status === 'pending_payment') {
      // Full refund before payment
      return order.total;
    }

    if (order.status === 'payment_failed') {
      // Full refund on failed payment
      return order.total;
    }

    if (['paid', 'processing'].includes(order.status)) {
      // Full refund before shipment
      return order.total;
    }

    if (order.status === 'shipped') {
      // 80% refund after shipment
      return Math.round(order.total * 0.8);
    }

    if (order.status === 'delivered') {
      // 50% refund after delivery (restocking fee)
      return Math.round(order.total * 0.5);
    }

    // No refund for completed orders (unless by exception)
    return 0;
  },

  /**
   * Check if order is refundable
   */
  isRefundable(order: Order): boolean {
    return this.getRefundableAmount(order) > 0;
  },

  /**
   * Get refund reason options
   */
  getRefundReasons(): Array<{ id: string; label: string }> {
    return [
      { id: 'damaged', label: 'Product damaged' },
      { id: 'defective', label: 'Product defective' },
      { id: 'not_as_described', label: 'Not as described' },
      { id: 'changed_mind', label: 'Changed mind' },
      { id: 'duplicate_order', label: 'Duplicate order' },
      { id: 'other', label: 'Other reason' },
    ];
  },

  /**
   * Create refund request
   */
  async requestRefund(orderId: string, reason: string, notes?: string) {
    const order = await orderService.getById(orderId);
    if (!order) return null;

    const amount = this.getRefundableAmount(order);
    if (amount === 0) {
      throw new Error('Order is not refundable');
    }

    return {
      orderId,
      amount,
      reason,
      notes,
      requestedAt: new Date(),
      status: 'pending' as const,
    };
  },
};
