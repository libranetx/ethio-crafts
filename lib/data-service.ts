'use client';

import {
  dummyProducts,
  dummyArtisans,
  dummyCustomers,
  dummyOrders,
  dummyReviews,
  dummyNotifications,
  dummyVerificationTasks,
  dummyChatConversations,
  dummyAgents,
  dummyAdmins,
} from './dummy-data';
import {
  Product,
  Order,
  Artisan,
  Customer,
  Review,
  Notification,
  VerificationTask,
  ChatConversation,
  User,
} from './types';

// Simulate API delay
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ============= PRODUCTS =============

export const productService = {
  async getAll(page: number = 1, limit: number = 20) {
    await delay();
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: dummyProducts.slice(start, end),
      total: dummyProducts.length,
      page,
      limit,
    };
  },

  async getById(id: string): Promise<Product | null> {
    await delay();
    return dummyProducts.find((p) => p.id === id) || null;
  },

  async getByArtisan(artisanId: string): Promise<Product[]> {
    await delay();
    return dummyProducts.filter((p) => p.artisanId === artisanId);
  },

  async getActive(page: number = 1, limit: number = 20) {
    await delay();
    const active = dummyProducts.filter((p) => p.status === 'active');
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: active.slice(start, end),
      total: active.length,
      page,
      limit,
    };
  },

  async search(query: string, filters?: { category?: string; minPrice?: number; maxPrice?: number }) {
    await delay();
    return dummyProducts.filter((p) => {
      if (p.status !== 'active') return false;

      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory = !filters?.category || p.category === filters.category;
      const matchesPrice =
        (!filters?.minPrice || p.price >= filters.minPrice) &&
        (!filters?.maxPrice || p.price <= filters.maxPrice);

      return matchesQuery && matchesCategory && matchesPrice;
    });
  },

  async getCategories(): Promise<string[]> {
    await delay();
    return [...new Set(dummyProducts.map((p) => p.category))];
  },

  async getTags(): Promise<string[]> {
    await delay();
    const allTags = dummyProducts.flatMap((p) => p.tags);
    return [...new Set(allTags)];
  },
};

// ============= ARTISANS =============

export const artisanService = {
  async getAll(page: number = 1, limit: number = 20) {
    await delay();
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: dummyArtisans.slice(start, end),
      total: dummyArtisans.length,
      page,
      limit,
    };
  },

  async getById(id: string): Promise<Artisan | null> {
    await delay();
    return dummyArtisans.find((a) => a.id === id) || null;
  },

  async getVerified(page: number = 1, limit: number = 20) {
    await delay();
    const verified = dummyArtisans.filter((a) => a.verificationStatus === 'verified');
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: verified.slice(start, end),
      total: verified.length,
      page,
      limit,
    };
  },

  async getByRegion(region: string): Promise<Artisan[]> {
    await delay();
    return dummyArtisans.filter((a) => a.region === region);
  },

  async getTopRated(limit: number = 10): Promise<Artisan[]> {
    await delay();
    return [...dummyArtisans]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  },
};

// ============= CUSTOMERS =============

export const customerService = {
  async getById(id: string): Promise<Customer | null> {
    await delay();
    return dummyCustomers.find((c) => c.id === id) || null;
  },

  async getWishlist(customerId: string): Promise<Product[]> {
    await delay();
    const customer = dummyCustomers.find((c) => c.id === customerId);
    if (!customer) return [];
    return dummyProducts.filter((p) => customer.wishlist.includes(p.id));
  },

  async addToWishlist(customerId: string, productId: string): Promise<boolean> {
    await delay();
    const customer = dummyCustomers.find((c) => c.id === customerId);
    if (customer && !customer.wishlist.includes(productId)) {
      customer.wishlist.push(productId);
      return true;
    }
    return false;
  },

  async removeFromWishlist(customerId: string, productId: string): Promise<boolean> {
    await delay();
    const customer = dummyCustomers.find((c) => c.id === customerId);
    if (customer) {
      customer.wishlist = customer.wishlist.filter((id) => id !== productId);
      return true;
    }
    return false;
  },

  async getCart(customerId: string) {
    await delay();
    const customer = dummyCustomers.find((c) => c.id === customerId);
    if (!customer) return [];
    return customer.cartItems.map((item) => ({
      ...item,
      product: dummyProducts.find((p) => p.id === item.productId),
    }));
  },

  async addToCart(customerId: string, productId: string, quantity: number): Promise<boolean> {
    await delay();
    const customer = dummyCustomers.find((c) => c.id === customerId);
    if (!customer) return false;

    const existingItem = customer.cartItems.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      customer.cartItems.push({
        id: `cart-${Date.now()}`,
        productId,
        quantity,
        addedAt: new Date(),
      });
    }
    return true;
  },

  async removeFromCart(customerId: string, cartItemId: string): Promise<boolean> {
    await delay();
    const customer = dummyCustomers.find((c) => c.id === customerId);
    if (customer) {
      customer.cartItems = customer.cartItems.filter((item) => item.id !== cartItemId);
      return true;
    }
    return false;
  },

  async clearCart(customerId: string): Promise<boolean> {
    await delay();
    const customer = dummyCustomers.find((c) => c.id === customerId);
    if (customer) {
      customer.cartItems = [];
      return true;
    }
    return false;
  },
};

// ============= ORDERS =============

export const orderService = {
  async getById(id: string): Promise<Order | null> {
    await delay();
    return dummyOrders.find((o) => o.id === id) || null;
  },

  async getByCustomer(customerId: string, page: number = 1, limit: number = 10) {
    await delay();
    const orders = dummyOrders.filter((o) => o.customerId === customerId);
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: orders.slice(start, end),
      total: orders.length,
      page,
      limit,
    };
  },

  async getAll(page: number = 1, limit: number = 20) {
    await delay();
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: dummyOrders.slice(start, end),
      total: dummyOrders.length,
      page,
      limit,
    };
  },

  async getByStatus(status: string, page: number = 1, limit: number = 20) {
    await delay();
    const filtered = dummyOrders.filter((o) => o.status === status);
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
    };
  },

  async create(order: Partial<Order>): Promise<Order> {
    await delay(500);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      ...order,
    } as Order;
    dummyOrders.push(newOrder);
    return newOrder;
  },

  async updateStatus(orderId: string, status: string): Promise<Order | null> {
    await delay();
    const order = dummyOrders.find((o) => o.id === orderId);
    if (order) {
      order.status = status as any;
      order.updatedAt = new Date();
      return order;
    }
    return null;
  },
};

// ============= REVIEWS =============

export const reviewService = {
  async getByProduct(productId: string): Promise<Review[]> {
    await delay();
    return dummyReviews.filter((r) => r.productId === productId && r.status === 'approved');
  },

  async create(review: Partial<Review>): Promise<Review> {
    await delay(500);
    const newReview: Review = {
      id: `review-${Date.now()}`,
      status: 'pending',
      helpful: 0,
      unhelpful: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...review,
    } as Review;
    dummyReviews.push(newReview);
    return newReview;
  },

  async getAverage(productId: string): Promise<number> {
    await delay();
    const reviews = dummyReviews.filter((r) => r.productId === productId && r.status === 'approved');
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },
};

// ============= NOTIFICATIONS =============

export const notificationService = {
  async getByUser(userId: string, unreadOnly: boolean = false) {
    await delay();
    let notifications = dummyNotifications.filter((n) => n.userId === userId);
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }
    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    await delay();
    const notif = dummyNotifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    await delay();
    dummyNotifications.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    return true;
  },

  async create(notification: Partial<Notification>): Promise<Notification> {
    await delay(300);
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date(),
      ...notification,
    } as Notification;
    dummyNotifications.push(newNotif);
    return newNotif;
  },
};

// ============= VERIFICATION TASKS =============

export const verificationService = {
  async getById(id: string): Promise<VerificationTask | null> {
    await delay();
    return dummyVerificationTasks.find((t) => t.id === id) || null;
  },

  async getByArtisan(artisanId: string) {
    await delay();
    return dummyVerificationTasks.filter((t) => t.artisanId === artisanId);
  },

  async getByAgent(agentId: string) {
    await delay();
    return dummyVerificationTasks.filter((t) => t.agentId === agentId);
  },

  async getByStatus(status: string) {
    await delay();
    return dummyVerificationTasks.filter((t) => t.status === status);
  },

  async create(task: Partial<VerificationTask>): Promise<VerificationTask> {
    await delay(500);
    const newTask: VerificationTask = {
      id: `verify-${Date.now()}`,
      status: 'pending',
      checklist: {
        handmade: false,
        materials: false,
        dimensions: false,
        identity: false,
      },
      sampleImages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...task,
    } as VerificationTask;
    dummyVerificationTasks.push(newTask);
    return newTask;
  },

  async updateStatus(taskId: string, status: string, notes?: string): Promise<VerificationTask | null> {
    await delay();
    const task = dummyVerificationTasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status as any;
      if (notes) task.notes = notes;
      task.updatedAt = new Date();
      return task;
    }
    return null;
  },
};

// ============= CHAT =============

export const chatService = {
  async getByCustomer(customerId: string) {
    await delay();
    return dummyChatConversations.filter((c) => c.customerId === customerId);
  },

  async getById(conversationId: string): Promise<ChatConversation | null> {
    await delay();
    return dummyChatConversations.find((c) => c.id === conversationId) || null;
  },

  async create(customerId: string, subject: string): Promise<ChatConversation> {
    await delay(500);
    const newConversation: ChatConversation = {
      id: `chat-${Date.now()}`,
      customerId,
      subject,
      messages: [],
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
    };
    dummyChatConversations.push(newConversation);
    return newConversation;
  },

  async sendMessage(conversationId: string, senderId: string, senderRole: 'customer' | 'support' | 'bot', message: string) {
    await delay(200);
    const conversation = dummyChatConversations.find((c) => c.id === conversationId);
    if (!conversation) return null;

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderRole,
      message,
      createdAt: new Date(),
    };

    conversation.messages.push(newMessage);
    conversation.lastMessageAt = new Date();
    conversation.updatedAt = new Date();

    return newMessage;
  },
};

// ============= AGENTS =============

export const agentService = {
  async getAll(page: number = 1, limit: number = 20) {
    await delay();
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: dummyAgents.slice(start, end),
      total: dummyAgents.length,
      page,
      limit,
    };
  },

  async getById(id: string) {
    await delay();
    return dummyAgents.find((a) => a.id === id) || null;
  },
};

// ============= ADMIN ANALYTICS =============

export const analyticsService = {
  async getTotalSales(startDate?: Date, endDate?: Date) {
    await delay();
    return dummyOrders
      .filter(
        (o) =>
          o.status !== 'cancelled' &&
          (!startDate || o.createdAt >= startDate) &&
          (!endDate || o.createdAt <= endDate)
      )
      .reduce((sum, o) => sum + o.total, 0);
  },

  async getTotalOrders(startDate?: Date, endDate?: Date) {
    await delay();
    return dummyOrders.filter(
      (o) =>
        o.status !== 'cancelled' &&
        (!startDate || o.createdAt >= startDate) &&
        (!endDate || o.createdAt <= endDate)
    ).length;
  },

  async getTopProducts(limit: number = 5) {
    await delay();
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};

    dummyOrders
      .filter((o) => o.status !== 'cancelled')
      .forEach((order) => {
        order.items.forEach((item) => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { name: item.productName, sales: 0, revenue: 0 };
          }
          productSales[item.productId].sales += item.quantity;
          productSales[item.productId].revenue += item.total;
        });
      });

    return Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  },

  async getTopArtisans(limit: number = 5) {
    await delay();
    const artisanSales: Record<string, { name: string; sales: number; revenue: number; orders: number }> = {};

    dummyOrders
      .filter((o) => o.status !== 'cancelled')
      .forEach((order) => {
        order.items.forEach((item) => {
          if (!artisanSales[item.artisanId]) {
            artisanSales[item.artisanId] = { name: item.artisanName, sales: 0, revenue: 0, orders: 0 };
          }
          artisanSales[item.artisanId].sales += item.quantity;
          artisanSales[item.artisanId].revenue += item.total;
          artisanSales[item.artisanId].orders += 1;
        });
      });

    return Object.entries(artisanSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  },

  async getDailySales(days: number = 30) {
    await delay();
    const dailyData: Record<string, { sales: number; orders: number }> = {};

    dummyOrders
      .filter((o) => o.status !== 'cancelled')
      .forEach((order) => {
        const dateKey = order.createdAt.toISOString().split('T')[0];
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { sales: 0, orders: 0 };
        }
        dailyData[dateKey].sales += order.total;
        dailyData[dateKey].orders += 1;
      });

    return Object.entries(dailyData)
      .map(([date, data]) => ({ date, ...data }))
      .slice(-days);
  },
};
