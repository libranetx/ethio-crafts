import {
  User,
  Customer,
  Artisan,
  Agent,
  Admin,
  Product,
  Order,
  Review,
  Notification,
  VerificationTask,
  ChatConversation,
  Address,
} from './types';

// ============= USERS =============

export const dummyCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Almaz Belay',
    email: 'almaz@example.com',
    phone: '+251911123456',
    role: 'customer',
    profileImage: 'https://via.placeholder.com/150?text=Almaz',
    bio: 'Art lover and local craft enthusiast',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-04-15'),
    addresses: [
      {
        id: 'addr-001',
        userId: 'cust-001',
        name: 'Home',
        street: '123 Bole Road',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        postalCode: '1000',
        phone: '+251911123456',
        isDefault: true,
        createdAt: new Date('2024-01-15'),
      },
    ],
    wishlist: ['prod-001', 'prod-003'],
    cartItems: [
      {
        id: 'cart-001',
        productId: 'prod-002',
        quantity: 1,
        addedAt: new Date('2024-04-20'),
      },
    ],
  },
  {
    id: 'cust-002',
    name: 'Daniel Tekle',
    email: 'daniel@example.com',
    phone: '+251922234567',
    role: 'customer',
    profileImage: 'https://via.placeholder.com/150?text=Daniel',
    bio: 'Traditional textiles collector',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-04-18'),
    addresses: [
      {
        id: 'addr-002',
        userId: 'cust-002',
        name: 'Work',
        street: '456 Nifas Silk',
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        postalCode: '1001',
        phone: '+251922234567',
        isDefault: true,
        createdAt: new Date('2024-02-20'),
      },
    ],
    wishlist: ['prod-005', 'prod-007'],
    cartItems: [],
  },
];

export const dummyArtisans: Artisan[] = [
  {
    id: 'artisan-001',
    name: 'Abeba Tsegaye',
    email: 'abeba.crafts@example.com',
    phone: '+251944555666',
    role: 'artisan',
    profileImage: 'https://via.placeholder.com/150?text=Abeba',
    bio: 'Master weaver creating traditional Ethiopian textiles for 15 years',
    region: 'Addis Ababa',
    specialties: ['weaving', 'textiles', 'traditional'],
    bankAccount: {
      accountName: 'Abeba Tsegaye',
      accountNumber: '0123456789',
      bankName: 'Commercial Bank of Ethiopia',
    },
    verificationStatus: 'verified',
    rating: 4.8,
    totalSales: 342,
    products: ['prod-001', 'prod-002', 'prod-003'],
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-04-15'),
  },
  {
    id: 'artisan-002',
    name: 'Girma Kebede',
    email: 'girma.pottery@example.com',
    phone: '+251933777888',
    role: 'artisan',
    profileImage: 'https://via.placeholder.com/150?text=Girma',
    bio: 'Ceramic artist specializing in Afar-inspired pottery',
    region: 'Oromia',
    specialties: ['ceramics', 'pottery', 'sculpture'],
    bankAccount: {
      accountName: 'Girma Kebede',
      accountNumber: '0987654321',
      bankName: 'Awash International Bank',
    },
    verificationStatus: 'verified',
    rating: 4.6,
    totalSales: 218,
    products: ['prod-004', 'prod-005', 'prod-006'],
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2024-04-16'),
  },
  {
    id: 'artisan-003',
    name: 'Hiwot Assefa',
    email: 'hiwot.jewelry@example.com',
    phone: '+251921888999',
    role: 'artisan',
    profileImage: 'https://via.placeholder.com/150?text=Hiwot',
    bio: 'Contemporary jewelry designer blending traditional and modern',
    region: 'Addis Ababa',
    specialties: ['jewelry', 'beadwork', 'metalwork'],
    bankAccount: {
      accountName: 'Hiwot Assefa',
      accountNumber: '1122334455',
      bankName: 'Dashen Bank',
    },
    verificationStatus: 'pending',
    rating: 0,
    totalSales: 0,
    products: ['prod-007', 'prod-008'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-04-10'),
  },
];

export const dummyAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Aman Mulatu',
    email: 'aman.agent@example.com',
    phone: '+251934666000',
    role: 'agent',
    profileImage: 'https://via.placeholder.com/150?text=Aman',
    bio: 'Verification agent for Addis Ababa region',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-04-15'),
    assignedArtisans: ['artisan-001', 'artisan-002'],
    tasksCompleted: 45,
    averageRating: 4.7,
  },
  {
    id: 'agent-002',
    name: 'Selam Dagne',
    email: 'selam.agent@example.com',
    phone: '+251925777111',
    role: 'agent',
    profileImage: 'https://via.placeholder.com/150?text=Selam',
    bio: 'Regional agent covering Oromia',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-04-14'),
    assignedArtisans: ['artisan-003'],
    tasksCompleted: 28,
    averageRating: 4.5,
  },
];

export const dummyAdmins: Admin[] = [
  {
    id: 'admin-001',
    name: 'Dawit Tekle',
    email: 'admin@ethio-crafts.com',
    phone: '+251911000999',
    role: 'admin',
    profileImage: 'https://via.placeholder.com/150?text=Dawit',
    bio: 'Platform administrator',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-04-15'),
    permissions: ['manage_users', 'manage_products', 'manage_orders', 'view_analytics', 'manage_agents'],
  },
];

// ============= PRODUCTS =============

export const dummyProducts: Product[] = [
  {
    id: 'prod-001',
    artisanId: 'artisan-001',
    name: 'Traditional Ethiopian Cotton Shawl',
    description:
      'Handwoven cotton shawl with traditional patterns. Perfect for any occasion, combining comfort with cultural heritage.',
    price: 2500,
    originalPrice: 3000,
    category: 'textiles',
    tags: ['cotton', 'traditional', 'handwoven', 'shawl'],
    images: [
      'https://via.placeholder.com/400?text=Shawl+1',
      'https://via.placeholder.com/400?text=Shawl+2',
    ],
    stock: 15,
    status: 'active',
    rating: 4.8,
    reviewCount: 24,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-04-15'),
    materials: ['cotton'],
    dimensions: { length: 200, width: 100, height: 1, unit: 'cm' },
    weight: { value: 0.5, unit: 'kg' },
    shippingDays: 5,
  },
  {
    id: 'prod-002',
    artisanId: 'artisan-001',
    name: 'Habesha Gonfa (Traditional Dress)',
    description: 'Authentic handwoven traditional Ethiopian dress with intricate patterns.',
    price: 5500,
    category: 'clothing',
    tags: ['dress', 'traditional', 'habesha', 'cultural'],
    images: [
      'https://via.placeholder.com/400?text=Dress+1',
      'https://via.placeholder.com/400?text=Dress+2',
      'https://via.placeholder.com/400?text=Dress+3',
    ],
    stock: 8,
    status: 'active',
    rating: 4.9,
    reviewCount: 18,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-04-14'),
    materials: ['cotton', 'silk'],
    dimensions: { length: 130, width: 60, height: 1, unit: 'cm' },
    weight: { value: 0.8, unit: 'kg' },
    shippingDays: 7,
  },
  {
    id: 'prod-003',
    artisanId: 'artisan-001',
    name: 'Ergonomic Weaving Basket',
    description: 'Beautiful handwoven basket for storage, decorative use, or traditional baskets.',
    price: 1200,
    originalPrice: 1500,
    category: 'home-decor',
    tags: ['basket', 'handwoven', 'storage', 'home'],
    images: ['https://via.placeholder.com/400?text=Basket+1'],
    stock: 32,
    status: 'active',
    rating: 4.7,
    reviewCount: 12,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-04-12'),
    materials: ['palm', 'straw'],
    weight: { value: 1.2, unit: 'kg' },
    shippingDays: 3,
  },
  {
    id: 'prod-004',
    artisanId: 'artisan-002',
    name: 'Afar Ceramic Vase',
    description: 'Hand-thrown ceramic vase inspired by traditional Afar designs.',
    price: 3200,
    category: 'home-decor',
    tags: ['ceramic', 'vase', 'traditional', 'afar'],
    images: ['https://via.placeholder.com/400?text=Vase+1', 'https://via.placeholder.com/400?text=Vase+2'],
    stock: 10,
    status: 'active',
    rating: 4.6,
    reviewCount: 9,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-04-13'),
    materials: ['clay'],
    dimensions: { length: 15, width: 15, height: 30, unit: 'cm' },
    weight: { value: 2.5, unit: 'kg' },
    shippingDays: 5,
  },
  {
    id: 'prod-005',
    artisanId: 'artisan-002',
    name: 'Decorative Pottery Bowl Set',
    description: 'Set of 3 hand-painted ceramic bowls with traditional Ethiopian patterns.',
    price: 2800,
    originalPrice: 3500,
    category: 'tableware',
    tags: ['pottery', 'bowls', 'handpainted', 'set'],
    images: [
      'https://via.placeholder.com/400?text=Bowls+1',
      'https://via.placeholder.com/400?text=Bowls+2',
      'https://via.placeholder.com/400?text=Bowls+3',
    ],
    stock: 20,
    status: 'active',
    rating: 4.5,
    reviewCount: 15,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-04-11'),
    materials: ['clay'],
    weight: { value: 3.0, unit: 'kg' },
    shippingDays: 4,
  },
  {
    id: 'prod-006',
    artisanId: 'artisan-002',
    name: 'Handcrafted Clay Lamp',
    description: 'Unique clay lamp with intricate cutout patterns, perfect for ambient lighting.',
    price: 4000,
    category: 'home-decor',
    tags: ['lamp', 'clay', 'lighting', 'decor'],
    images: ['https://via.placeholder.com/400?text=Lamp+1'],
    stock: 6,
    status: 'active',
    rating: 4.4,
    reviewCount: 7,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-04-10'),
    materials: ['clay'],
    weight: { value: 1.8, unit: 'kg' },
    shippingDays: 6,
  },
  {
    id: 'prod-007',
    artisanId: 'artisan-003',
    name: 'Ethiopian Silver Necklace',
    description: 'Contemporary silver necklace with traditional beadwork elements.',
    price: 6500,
    category: 'jewelry',
    tags: ['silver', 'necklace', 'jewelry', 'beadwork'],
    images: ['https://via.placeholder.com/400?text=Necklace+1', 'https://via.placeholder.com/400?text=Necklace+2'],
    stock: 5,
    status: 'pending_verification',
    rating: 0,
    reviewCount: 0,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-04-10'),
    materials: ['silver', 'beads'],
    weight: { value: 0.08, unit: 'kg' },
    shippingDays: 3,
  },
  {
    id: 'prod-008',
    artisanId: 'artisan-003',
    name: 'Brass & Bead Earrings',
    description: 'Beautiful brass earrings adorned with traditional beads.',
    price: 1800,
    category: 'jewelry',
    tags: ['brass', 'earrings', 'beads', 'handmade'],
    images: ['https://via.placeholder.com/400?text=Earrings+1'],
    stock: 12,
    status: 'pending_verification',
    rating: 0,
    reviewCount: 0,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-04-10'),
    materials: ['brass', 'beads'],
    weight: { value: 0.04, unit: 'kg' },
    shippingDays: 2,
  },
];

// ============= ORDERS =============

export const dummyOrders: Order[] = [
  {
    id: 'order-001',
    customerId: 'cust-001',
    items: [
      {
        productId: 'prod-001',
        productName: 'Traditional Ethiopian Cotton Shawl',
        artisanId: 'artisan-001',
        artisanName: 'Abeba Tsegaye',
        quantity: 1,
        price: 2500,
        total: 2500,
      },
    ],
    shippingAddress: dummyCustomers[0].addresses[0],
    subtotal: 2500,
    shippingCost: 300,
    tax: 280,
    total: 3080,
    status: 'delivered',
    paymentMethod: 'chapa',
    paymentReference: 'CHAPA-12345',
    trackingNumber: 'ETH-20240415-001',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-18'),
    estimatedDelivery: new Date('2024-04-20'),
  },
  {
    id: 'order-002',
    customerId: 'cust-002',
    items: [
      {
        productId: 'prod-004',
        productName: 'Afar Ceramic Vase',
        artisanId: 'artisan-002',
        artisanName: 'Girma Kebede',
        quantity: 2,
        price: 3200,
        total: 6400,
      },
    ],
    shippingAddress: dummyCustomers[1].addresses[0],
    subtotal: 6400,
    shippingCost: 400,
    tax: 680,
    total: 7480,
    status: 'shipped',
    paymentMethod: 'telebirr',
    paymentReference: 'TB-98765',
    trackingNumber: 'ETH-20240415-002',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-04-18'),
    estimatedDelivery: new Date('2024-04-22'),
  },
  {
    id: 'order-003',
    customerId: 'cust-001',
    items: [
      {
        productId: 'prod-003',
        productName: 'Ergonomic Weaving Basket',
        artisanId: 'artisan-001',
        artisanName: 'Abeba Tsegaye',
        quantity: 2,
        price: 1200,
        total: 2400,
      },
      {
        productId: 'prod-005',
        productName: 'Decorative Pottery Bowl Set',
        artisanId: 'artisan-002',
        artisanName: 'Girma Kebede',
        quantity: 1,
        price: 2800,
        total: 2800,
      },
    ],
    shippingAddress: dummyCustomers[0].addresses[0],
    subtotal: 5200,
    shippingCost: 400,
    tax: 560,
    total: 6160,
    status: 'processing',
    paymentMethod: 'chapa',
    paymentReference: 'CHAPA-54321',
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-18'),
    estimatedDelivery: new Date('2024-04-25'),
  },
];

// ============= REVIEWS =============

export const dummyReviews: Review[] = [
  {
    id: 'review-001',
    productId: 'prod-001',
    customerId: 'cust-001',
    rating: 5,
    title: 'Excellent quality and craftsmanship',
    text: 'The shawl arrived beautifully packaged. The weaving is intricate and the material is soft and high quality. Highly recommend!',
    status: 'approved',
    helpful: 12,
    unhelpful: 0,
    createdAt: new Date('2024-04-19'),
    updatedAt: new Date('2024-04-19'),
  },
  {
    id: 'review-002',
    productId: 'prod-004',
    customerId: 'cust-002',
    rating: 4,
    title: 'Beautiful vase, slightly heavier than expected',
    text: 'The design is stunning and authentic. Perfect for my collection. Only minor issue is that it was heavier than the product description suggested.',
    status: 'approved',
    helpful: 5,
    unhelpful: 1,
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-04-20'),
  },
  {
    id: 'review-003',
    productId: 'prod-002',
    customerId: 'cust-001',
    rating: 5,
    title: 'Perfect traditional dress',
    text: 'Wore this to a family event and received so many compliments. The craftsmanship is impeccable.',
    status: 'approved',
    helpful: 8,
    unhelpful: 0,
    createdAt: new Date('2024-04-18'),
    updatedAt: new Date('2024-04-18'),
  },
];

// ============= VERIFICATION TASKS =============

export const dummyVerificationTasks: VerificationTask[] = [
  {
    id: 'verify-001',
    artisanId: 'artisan-003',
    agentId: 'agent-002',
    productId: 'prod-007',
    status: 'in_progress',
    checklist: {
      handmade: true,
      materials: true,
      dimensions: false,
      identity: false,
    },
    sampleImages: [
      'https://via.placeholder.com/400?text=Sample+1',
      'https://via.placeholder.com/400?text=Sample+2',
    ],
    notes: 'Verified handmade process. Waiting for dimensions confirmation.',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-18'),
    dueDate: new Date('2024-04-25'),
  },
  {
    id: 'verify-002',
    artisanId: 'artisan-003',
    productId: 'prod-008',
    status: 'pending',
    checklist: {
      handmade: false,
      materials: false,
      dimensions: false,
      identity: false,
    },
    sampleImages: ['https://via.placeholder.com/400?text=Sample+3'],
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15'),
    dueDate: new Date('2024-04-28'),
  },
];

// ============= NOTIFICATIONS =============

export const dummyNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'cust-001',
    type: 'order_delivered',
    title: 'Order Delivered',
    message: 'Your order #order-001 has been delivered successfully!',
    relatedId: 'order-001',
    read: true,
    createdAt: new Date('2024-04-18'),
  },
  {
    id: 'notif-002',
    userId: 'cust-002',
    type: 'order_shipped',
    title: 'Order Shipped',
    message: 'Your order #order-002 has been shipped and is on its way!',
    relatedId: 'order-002',
    read: false,
    createdAt: new Date('2024-04-18'),
  },
  {
    id: 'notif-003',
    userId: 'artisan-001',
    type: 'review_posted',
    title: 'New Review Posted',
    message: 'A customer left a 5-star review on your Traditional Ethiopian Cotton Shawl',
    relatedId: 'review-001',
    read: false,
    createdAt: new Date('2024-04-19'),
  },
  {
    id: 'notif-004',
    userId: 'artisan-003',
    type: 'verification_task',
    title: 'Verification Task Assigned',
    message: 'Agent Selam Dagne has assigned a verification task for your product.',
    relatedId: 'verify-001',
    read: false,
    createdAt: new Date('2024-04-18'),
  },
];

// ============= CHAT CONVERSATIONS =============

export const dummyChatConversations: ChatConversation[] = [
  {
    id: 'chat-001',
    customerId: 'cust-001',
    subject: 'Question about product shipping',
    messages: [
      {
        id: 'msg-001',
        conversationId: 'chat-001',
        senderId: 'cust-001',
        senderRole: 'customer',
        message: 'How long does shipping usually take for items to Addis Ababa?',
        createdAt: new Date('2024-04-17T10:30:00'),
      },
      {
        id: 'msg-002',
        conversationId: 'chat-001',
        senderId: 'support-bot',
        senderRole: 'bot',
        message:
          'Most items ship within 3-7 business days depending on the artisan. You can track your order using the tracking number provided in your confirmation email.',
        createdAt: new Date('2024-04-17T10:35:00'),
      },
    ],
    status: 'closed',
    createdAt: new Date('2024-04-17'),
    updatedAt: new Date('2024-04-17'),
    lastMessageAt: new Date('2024-04-17T10:35:00'),
  },
];

// ============= Helper functions =============

export const getProductById = (id: string): Product | undefined => {
  return dummyProducts.find((p) => p.id === id);
};

export const getArtisanById = (id: string): Artisan | undefined => {
  return dummyArtisans.find((a) => a.id === id);
};

export const getOrderById = (id: string): Order | undefined => {
  return dummyOrders.find((o) => o.id === id);
};

export const getProductsByArtisan = (artisanId: string): Product[] => {
  return dummyProducts.filter((p) => p.artisanId === artisanId);
};

export const getOrdersByCustomer = (customerId: string): Order[] => {
  return dummyOrders.filter((o) => o.customerId === customerId);
};

export const getReviewsByProduct = (productId: string): Review[] => {
  return dummyReviews.filter((r) => r.productId === productId);
};

export const searchProducts = (query: string, category?: string, minPrice?: number, maxPrice?: number) => {
  return dummyProducts.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = !category || p.category === category;

    const matchesPrice =
      (!minPrice || p.price >= minPrice) && (!maxPrice || p.price <= maxPrice);

    return matchesQuery && matchesCategory && matchesPrice;
  });
};

export const getActiveProducts = () => {
  return dummyProducts.filter((p) => p.status === 'active');
};

export const getVerifiedArtisans = () => {
  return dummyArtisans.filter((a) => a.verificationStatus === 'verified');
};
