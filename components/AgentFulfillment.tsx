'use client'

import React, { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle2, AlertCircle, MapPin, Phone, Mail, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { orderService } from '@/lib/order-service'
import { notificationService } from '@/lib/notification-service'
import type { Order } from '@/lib/types'

export default function AgentFulfillment() {
  const [activeTab, setActiveTab] = useState<'processing' | 'pending-shipment'>('processing')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updateForm, setUpdateForm] = useState({
    trackingNumber: '',
    carrierName: '',
    estimatedDelivery: '',
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // Simulate fetching orders with different statuses
        const mockOrders: Order[] = [
          {
            id: 'ord-001',
            orderNumber: 'ORD-2026-001',
            customerId: 'cust-001',
            items: [
              {
                productId: 'prod-001',
                productName: 'Hand-Woven Basket',
                quantity: 1,
                price: 2500,
                subtotal: 2500,
              },
            ],
            subtotal: 2500,
            tax: 375,
            shippingCost: 250,
            total: 3125,
            status: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'chapa',
            shippingAddress: {
              fullName: 'John Doe',
              email: 'john@example.com',
              phone: '+251911234567',
              address: '123 Main Street',
              city: 'Addis Ababa',
              region: 'Addis Ababa',
              postalCode: '1000',
            },
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            trackingNumber: undefined,
            carrierName: undefined,
            estimatedDeliveryDate: undefined,
          },
          {
            id: 'ord-002',
            orderNumber: 'ORD-2026-002',
            customerId: 'cust-002',
            items: [
              {
                productId: 'prod-002',
                productName: 'Leather Messenger Bag',
                quantity: 1,
                price: 4500,
                subtotal: 4500,
              },
            ],
            subtotal: 4500,
            tax: 675,
            shippingCost: 250,
            total: 5425,
            status: 'processing',
            paymentStatus: 'paid',
            paymentMethod: 'telebirr',
            shippingAddress: {
              fullName: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+251922345678',
              address: '456 Oak Avenue',
              city: 'Hawassa',
              region: 'SNNPR',
              postalCode: '5000',
            },
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            trackingNumber: undefined,
            carrierName: undefined,
            estimatedDeliveryDate: undefined,
          },
          {
            id: 'ord-003',
            orderNumber: 'ORD-2026-003',
            customerId: 'cust-003',
            items: [
              {
                productId: 'prod-003',
                productName: 'Traditional Coffee Roaster',
                quantity: 1,
                price: 8000,
                subtotal: 8000,
              },
            ],
            subtotal: 8000,
            tax: 1200,
            shippingCost: 500,
            total: 9700,
            status: 'shipped',
            paymentStatus: 'paid',
            paymentMethod: 'chapa',
            shippingAddress: {
              fullName: 'Ahmed Hassan',
              email: 'ahmed@example.com',
              phone: '+251933456789',
              address: '789 Stone Road',
              city: 'Gondar',
              region: 'Amhara',
              postalCode: '2000',
            },
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            trackingNumber: 'ETH-2026-123456',
            carrierName: 'Ethiopian Logistics',
            estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]

        // Filter orders based on active tab
        const filtered = mockOrders.filter((order) => {
          if (activeTab === 'processing') {
            return order.status === 'processing'
          } else if (activeTab === 'pending-shipment') {
            return order.status === 'paid'
          }
          return false
        })

        setOrders(filtered)
      } catch (error) {
        console.error('[v0] Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [activeTab])

  const handleMarkProcessed = async (order: Order) => {
    setIsUpdating(true)
    setUpdateMessage(null)

    try {
      console.log('[v0] Marking order as processed:', order.id)
      
      // In production, this would call an API endpoint
      // For now, we simulate the order status update
      const updatedOrder = {
        ...order,
        status: 'processed' as const,
        updatedAt: new Date().toISOString(),
      }

      // Trigger notification
      await notificationService.sendNotification({
        userId: order.customerId,
        type: 'order_processed',
        title: 'Order Processed',
        message: `Your order ${order.orderNumber} has been processed and is ready for shipment.`,
        metadata: { orderId: order.id },
      })

      setUpdateMessage({
        type: 'success',
        text: `Order ${order.orderNumber} marked as processed. Notification sent to customer.`,
      })

      // Update local state
      setOrders((prev) => prev.filter((o) => o.id !== order.id))
      setSelectedOrder(null)
      setUpdateForm({ trackingNumber: '', carrierName: '', estimatedDelivery: '' })
    } catch (error) {
      console.error('[v0] Failed to mark order as processed:', error)
      setUpdateMessage({
        type: 'error',
        text: 'Failed to update order status. Please try again.',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkShipped = async (order: Order) => {
    if (!updateForm.trackingNumber.trim()) {
      setUpdateMessage({
        type: 'error',
        text: 'Please enter a tracking number before shipping.',
      })
      return
    }

    setIsUpdating(true)
    setUpdateMessage(null)

    try {
      console.log('[v0] Marking order as shipped:', order.id)
      
      const updatedOrder = {
        ...order,
        status: 'shipped' as const,
        trackingNumber: updateForm.trackingNumber,
        carrierName: updateForm.carrierName || 'Not specified',
        estimatedDeliveryDate: updateForm.estimatedDelivery || undefined,
        updatedAt: new Date().toISOString(),
      }

      // Trigger notification with tracking info
      await notificationService.sendNotification({
        userId: order.customerId,
        type: 'order_shipped',
        title: 'Order Shipped',
        message: `Your order ${order.orderNumber} has been shipped. Tracking: ${updateForm.trackingNumber}`,
        metadata: {
          orderId: order.id,
          trackingNumber: updateForm.trackingNumber,
          carrierName: updateForm.carrierName,
        },
      })

      setUpdateMessage({
        type: 'success',
        text: `Order ${order.orderNumber} marked as shipped. Customer notified with tracking info.`,
      })

      // Update local state
      setOrders((prev) => prev.filter((o) => o.id !== order.id))
      setSelectedOrder(null)
      setUpdateForm({ trackingNumber: '', carrierName: '', estimatedDelivery: '' })
    } catch (error) {
      console.error('[v0] Failed to mark order as shipped:', error)
      setUpdateMessage({
        type: 'error',
        text: 'Failed to update order status. Please try again.',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkDelivered = async (order: Order) => {
    setIsUpdating(true)
    setUpdateMessage(null)

    try {
      console.log('[v0] Marking order as delivered:', order.id)
      
      const updatedOrder = {
        ...order,
        status: 'delivered' as const,
        updatedAt: new Date().toISOString(),
      }

      // Trigger notification
      await notificationService.sendNotification({
        userId: order.customerId,
        type: 'order_delivered',
        title: 'Order Delivered',
        message: `Your order ${order.orderNumber} has been delivered. Thank you for shopping with Ethio Crafts!`,
        metadata: { orderId: order.id },
      })

      setUpdateMessage({
        type: 'success',
        text: `Order ${order.orderNumber} marked as delivered. Customer notified.`,
      })

      // Update local state
      setOrders((prev) => prev.filter((o) => o.id !== order.id))
      setSelectedOrder(null)
      setUpdateForm({ trackingNumber: '', carrierName: '', estimatedDelivery: '' })
    } catch (error) {
      console.error('[v0] Failed to mark order as delivered:', error)
      setUpdateMessage({
        type: 'error',
        text: 'Failed to update order status. Please try again.',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-50 border-blue-200'
      case 'shipped':
        return 'bg-amber-50 border-amber-200'
      case 'delivered':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-amber-600" />
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Order Fulfillment</h1>
              <p className="text-muted-foreground mt-1">Agent ID: AG-2847 | Manage shipment status updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-border flex gap-8">
          {[
            { id: 'processing', label: 'Processing Orders', description: 'Ready to ship' },
            { id: 'pending-shipment', label: 'Pending Shipment', description: 'Awaiting processing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              updateMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <p className="text-sm font-medium">{updateMessage.text}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg border border-border">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {activeTab === 'processing'
                ? 'No orders currently processing. Check back soon!'
                : 'No pending shipment orders.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedOrder?.id === order.id
                      ? 'ring-2 ring-primary border-primary'
                      : 'border-border hover:border-primary/50'
                  } ${getStatusColor(order.status)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <h3 className="font-semibold text-foreground">{order.orderNumber}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Customer: {order.shippingAddress.fullName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">ETB {order.total.toLocaleString()}</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm border-t border-current border-opacity-10 pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Items</p>
                      <p className="font-medium text-foreground mt-1">{order.items.length} item(s)</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ordered</p>
                      <p className="font-medium text-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-medium text-foreground mt-1 capitalize">{order.status}</p>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-4 p-3 bg-white/50 rounded border border-current border-opacity-20">
                      <p className="text-xs font-medium text-foreground">Tracking: {order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Order Details & Actions */}
            {selectedOrder && (
              <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
                <h3 className="font-serif font-bold text-foreground mb-6">Order Details</h3>

                {/* Customer Info */}
                <div className="mb-6 pb-6 border-b border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Shipping Address</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground font-medium">{selectedOrder.shippingAddress.fullName}</p>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>{selectedOrder.shippingAddress.address}</p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <p>{selectedOrder.shippingAddress.phone}</p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <p>{selectedOrder.shippingAddress.email}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6 pb-6 border-b border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.productName}</span>
                        <span className="text-muted-foreground">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Based on Status */}
                {selectedOrder.status === 'processing' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Tracking Number *</label>
                      <input
                        type="text"
                        placeholder="e.g., ETH-2026-123456"
                        value={updateForm.trackingNumber}
                        onChange={(e) => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Carrier Name</label>
                      <select
                        value={updateForm.carrierName}
                        onChange={(e) => setUpdateForm({ ...updateForm, carrierName: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select carrier...</option>
                        <option value="Ethiopian Logistics">Ethiopian Logistics</option>
                        <option value="Addis Express">Addis Express</option>
                        <option value="East Africa Courier">East Africa Courier</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Est. Delivery Date</label>
                      <input
                        type="date"
                        value={updateForm.estimatedDelivery}
                        onChange={(e) => setUpdateForm({ ...updateForm, estimatedDelivery: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleMarkShipped(selectedOrder)}
                        disabled={isUpdating}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4 mr-2" />
                            Mark as Shipped
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleMarkProcessed(selectedOrder)}
                        variant="outline"
                        disabled={isUpdating}
                        className="w-full border-border"
                      >
                        {isUpdating ? 'Updating...' : 'Mark as Processed'}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedOrder.status === 'shipped' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-900 font-medium mb-2">Tracking Information</p>
                      <p className="text-sm font-mono text-blue-900">{selectedOrder.trackingNumber}</p>
                      {selectedOrder.carrierName && (
                        <p className="text-xs text-blue-700 mt-2">via {selectedOrder.carrierName}</p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleMarkDelivered(selectedOrder)}
                      disabled={isUpdating}
                      className="w-full bg-green-600 text-white hover:bg-green-700"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Delivered
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
