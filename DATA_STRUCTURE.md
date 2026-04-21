# Ethio-Crafts Data Structure Documentation

## Overview

This document describes the complete data model and dummy data structure for the Ethio-Crafts marketplace platform. All data is currently mocked and can be easily swapped with real API calls when ready.

## File Structure

```
lib/
├── types.ts          # Complete TypeScript type definitions
├── dummy-data.ts     # Mock data for all entities
└── data-service.ts   # Service layer for data operations
```

## Core Data Models

### User Types

The platform supports 4 user roles, each extending the base `User` interface:

1. **Customer** - Browse, purchase, review products
   - Manages addresses for shipping
   - Maintains wishlist and shopping cart
   - Can leave reviews on products

2. **Artisan** - Create and sell handcrafted products
   - Manages product listings
   - Receives orders and payments
   - Undergoes verification process before selling
   - Tracks sales analytics

3. **Agent** - Verify artisans and their products
   - Assigned to verify artisan samples
   - Completes verification checklists
   - Assigned artisans in specific regions

4. **Admin** - Manage platform
   - Approve/reject artisans and products
   - View analytics and reports
   - Manage users and orders

### Product Model

```typescript
Product {
  id: string
  artisanId: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  tags: string[]
  images: string[] // 1-5 images
  stock: number
  status: 'draft' | 'pending_verification' | 'active' | 'rejected' | 'inactive'
  rating: number
  reviewCount: number
  materials?: string[]
  dimensions?: { length, width, height, unit }
  weight?: { value, unit }
  shippingDays?: number
  customizationAvailable?: boolean
  createdAt: Date
  updatedAt: Date
}
```

**Status Flow:**
- draft → pending_verification → active (or rejected)
- active → inactive (when artisan unpublishes)

### Order Model

```typescript
Order {
  id: string
  customerId: string
  items: OrderItem[] // Items from same artisan grouped together
  shippingAddress: Address
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: 'chapa' | 'telebirr'
  paymentReference: string
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
}
```

**Order Status Flow:**
- pending_payment → paid → processing → shipped → delivered → completed
- Any status can go to cancelled or payment_failed

### Verification Task Model

Verification happens before a product becomes active:

```typescript
VerificationTask {
  id: string
  artisanId: string
  agentId?: string // Assigned agent
  productId: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'resubmitted'
  checklist: {
    handmade: boolean
    materials: boolean
    dimensions: boolean
    identity: boolean
  }
  sampleImages: string[]
  notes?: string
  rejectionReason?: string
  dueDate: Date
}
```

## Dummy Data

### Sample Data Included

- **Customers:** 2 customers with addresses and cart items
- **Artisans:** 3 artisans (2 verified, 1 pending)
- **Agents:** 2 verification agents
- **Admins:** 1 admin user
- **Products:** 8 products (6 active, 2 pending verification)
- **Orders:** 3 orders in various statuses
- **Reviews:** 3 approved reviews
- **Verification Tasks:** 2 tasks in progress
- **Notifications:** 4 sample notifications
- **Chat Conversations:** 1 support chat example

### Price Ranges

- Products range from 1,200 ETB to 6,500 ETB
- Orders include realistic shipping and tax calculations

## Data Service API

### Product Service

```typescript
productService.getAll(page, limit)           // Paginated product list
productService.getById(id)                   // Get single product
productService.getByArtisan(artisanId)       // All products by artisan
productService.getActive(page, limit)        // Active products only
productService.search(query, filters)        // Search with filters
productService.getCategories()               // Get all categories
productService.getTags()                     // Get all tags
```

### Order Service

```typescript
orderService.getById(id)                     // Get single order
orderService.getByCustomer(customerId, page) // Customer's orders
orderService.getAll(page, limit)             // All orders (admin)
orderService.getByStatus(status, page)       // Orders by status
orderService.create(order)                   // Create new order
orderService.updateStatus(orderId, status)   // Update status
```

### Artisan Service

```typescript
artisanService.getAll(page, limit)           // All artisans
artisanService.getById(id)                   // Get single artisan
artisanService.getVerified(page, limit)      // Verified artisans only
artisanService.getByRegion(region)           // Artisans by region
artisanService.getTopRated(limit)            // Top rated artisans
```

### Customer Service

```typescript
customerService.getById(id)                  // Get customer details
customerService.getWishlist(customerId)      // Get wishlist products
customerService.addToWishlist(customerId, productId)
customerService.removeFromWishlist(customerId, productId)
customerService.getCart(customerId)          // Get cart items with products
customerService.addToCart(customerId, productId, quantity)
customerService.removeFromCart(customerId, cartItemId)
customerService.clearCart(customerId)
```

### Review Service

```typescript
reviewService.getByProduct(productId)        // Reviews for product
reviewService.create(review)                 // Create new review
reviewService.getAverage(productId)          // Average rating
```

### Notification Service

```typescript
notificationService.getByUser(userId, unreadOnly)
notificationService.markAsRead(notificationId)
notificationService.markAllAsRead(userId)
notificationService.create(notification)
```

### Verification Service

```typescript
verificationService.getById(id)
verificationService.getByArtisan(artisanId)
verificationService.getByAgent(agentId)
verificationService.getByStatus(status)
verificationService.create(task)
verificationService.updateStatus(taskId, status, notes)
```

### Chat Service

```typescript
chatService.getByCustomer(customerId)
chatService.getById(conversationId)
chatService.create(customerId, subject)
chatService.sendMessage(conversationId, senderId, senderRole, message)
```

### Analytics Service

```typescript
analyticsService.getTotalSales(startDate?, endDate?)
analyticsService.getTotalOrders(startDate?, endDate?)
analyticsService.getTopProducts(limit)
analyticsService.getTopArtisans(limit)
analyticsService.getDailySales(days)
```

## Usage Example

```typescript
import { productService, orderService } from '@/lib/data-service';

// In a component or page
const products = await productService.getActive(1, 20);
const order = await orderService.getById('order-001');
const customer = await customerService.getById('cust-001');
```

## Migration to Real APIs

When ready to connect real APIs:

1. Replace service function implementations with actual API calls
2. Update dummy data calls to fetch from backend
3. Keep the same service interface for zero breaking changes
4. Add error handling for API failures

Example migration:
```typescript
// Before (dummy data)
async getById(id: string) {
  await delay();
  return dummyProducts.find(p => p.id === id) || null;
}

// After (real API)
async getById(id: string) {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
}
```

## Categories

Current product categories:
- textiles
- clothing
- home-decor
- tableware
- jewelry
- accessories (for future use)

## Common Tags

- handwoven
- traditional
- handmade
- cultural
- ceramic
- pottery
- jewelry
- beadwork
- metalwork
- textiles
- etc.

## Notes

- All dates use ISO 8601 format
- All prices in Ethiopian Birr (ETB)
- Product images use placeholder URLs (replace with real image URLs)
- Service functions include simulated delays (300-500ms) to mimic network latency
- All services use client-side ('use client') for SWR compatibility
