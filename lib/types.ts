// User Types
export type UserRole = 'customer' | 'artisan' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer-specific
export interface Customer extends User {
  role: 'customer';
  addresses: Address[];
  wishlist: string[]; // product IDs
  cartItems: CartItem[];
}

// Artisan-specific
export interface Artisan extends User {
  role: 'artisan';
  bio: string;
  region: string;
  specialties: string[];
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalSales: number;
  products: string[]; // product IDs
}

// Agent-specific
export interface Agent extends User {
  role: 'agent';
  assignedArtisans: string[]; // artisan IDs
  tasksCompleted: number;
  averageRating: number;
}

// Admin-specific
export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Address
export interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
}

// Product Types
export type ProductStatus = 'draft' | 'pending_verification' | 'active' | 'rejected' | 'inactive';

export interface Product {
  id: string;
  artisanId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields
  materials?: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inches';
  };
  weight?: {
    value: number;
    unit: 'kg' | 'lbs';
  };
  shippingDays?: number;
  customizationAvailable?: boolean;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  title: string;
  text: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  unhelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus =
  | 'pending_payment'
  | 'payment_failed'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  artisanId: string;
  artisanName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'chapa' | 'telebirr';
  paymentReference?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

// Verification Task Types
export type VerificationTaskStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'resubmitted';

export interface VerificationTask {
  id: string;
  artisanId: string;
  agentId?: string;
  productId: string;
  status: VerificationTaskStatus;
  checklist: {
    handmade: boolean;
    materials: boolean;
    dimensions: boolean;
    identity: boolean;
  };
  sampleImages: string[];
  notes?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}

// Notification Types
export type NotificationType =
  | 'order_placed'
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'review_posted'
  | 'product_verified'
  | 'product_rejected'
  | 'verification_task'
  | 'payment_received'
  | 'system_update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  read: boolean;
  createdAt: Date;
}

// Chat/Support Types
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'customer' | 'support' | 'bot';
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface ChatConversation {
  id: string;
  customerId: string;
  subject: string;
  messages: ChatMessage[];
  status: 'open' | 'closed' | 'escalated';
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
}

// Analytics Types
export interface DailySales {
  date: string;
  totalSales: number;
  orderCount: number;
}

export interface ProductAnalytics {
  productId: string;
  productName: string;
  views: number;
  sales: number;
  revenue: number;
  conversionRate: number;
}

export interface ArtisanAnalytics {
  artisanId: string;
  artisanName: string;
  totalSales: number;
  revenue: number;
  orderCount: number;
  rating: number;
  reviewCount: number;
}

export interface AnalyticsReport {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  topProducts: ProductAnalytics[];
  topArtisans: ArtisanAnalytics[];
  dailySales: DailySales[];
}

// Wishlist
export interface Wishlist {
  id: string;
  customerId: string;
  productIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
