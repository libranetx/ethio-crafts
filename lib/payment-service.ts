'use client';

// ============= TYPES =============

export type PaymentProvider = 'chapa' | 'telebirr';
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded';

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  description: string;
  returnUrl?: string;
  notificationUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  paymentReference: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  amount: number;
  timestamp: Date;
  redirectUrl?: string;
  errorMessage?: string;
}

export interface ChapaConfig {
  secretKey: string;
  publicKey: string;
  apiUrl: string;
  environment: 'test' | 'production';
}

export interface TeleBirrConfig {
  merchantId: string;
  apiKey: string;
  apiUrl: string;
  environment: 'test' | 'production';
}

export interface TransactionRecord {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  provider: PaymentProvider;
  transactionId: string;
  paymentReference: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

// ============= PAYMENT RECORDS (Dummy) =============

const transactionRecords: TransactionRecord[] = [
  {
    id: 'txn-001',
    orderId: 'order-001',
    amount: 3080,
    status: 'success',
    provider: 'chapa',
    transactionId: 'CHAPA-12345',
    paymentReference: 'CHAPA-12345',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-10'),
  },
  {
    id: 'txn-002',
    orderId: 'order-002',
    amount: 7480,
    status: 'success',
    provider: 'telebirr',
    transactionId: 'TB-98765',
    paymentReference: 'TB-98765',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-04-12'),
  },
];

// ============= MOCK CONFIGS =============

const chapaConfig: ChapaConfig = {
  secretKey: process.env.CHAPA_SECRET_KEY || 'test_secret_key',
  publicKey: process.env.CHAPA_PUBLIC_KEY || 'test_public_key',
  apiUrl: process.env.CHAPA_API_URL || 'https://api.chapa.co/v1',
  environment: (process.env.CHAPA_ENVIRONMENT as 'test' | 'production') || 'test',
};

const teleBirrConfig: TeleBirrConfig = {
  merchantId: process.env.TELEBIRR_MERCHANT_ID || 'test_merchant',
  apiKey: process.env.TELEBIRR_API_KEY || 'test_api_key',
  apiUrl: process.env.TELEBIRR_API_URL || 'https://api.telebirr.com/v1',
  environment: (process.env.TELEBIRR_ENVIRONMENT as 'test' | 'production') || 'test',
};

// ============= CHAPA SERVICE =============

export const chapaService = {
  /**
   * Initialize payment with Chapa
   * In production, this would call the actual Chapa API
   */
  async initializePayment(request: PaymentRequest): Promise<PaymentResponse> {
    const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay();

    try {
      // In production:
      // const response = await fetch(`${chapaConfig.apiUrl}/transaction/initialize`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${chapaConfig.secretKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     amount: request.amount,
      //     currency: request.currency,
      //     email: request.customerEmail,
      //     first_name: request.customerName.split(' ')[0],
      //     last_name: request.customerName.split(' ').slice(1).join(' '),
      //     phone_number: request.customerPhone,
      //     tx_ref: request.orderId,
      //     callback_url: request.returnUrl,
      //     return_url: request.returnUrl,
      //     description: request.description,
      //   }),
      // });
      // const data = await response.json();

      const transactionId = `CHAPA-${Date.now()}`;
      const paymentReference = transactionId;

      // Create dummy transaction record
      const record: TransactionRecord = {
        id: `txn-${Date.now()}`,
        orderId: request.orderId,
        amount: request.amount,
        status: 'processing',
        provider: 'chapa',
        transactionId,
        paymentReference,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: request,
      };
      transactionRecords.push(record);

      return {
        success: true,
        transactionId,
        paymentReference,
        status: 'processing',
        provider: 'chapa',
        amount: request.amount,
        timestamp: new Date(),
        redirectUrl: `https://checkout.chapa.co/checkout/${transactionId}`,
      };
    } catch (error) {
      console.error('Chapa payment initialization failed:', error);
      return {
        success: false,
        transactionId: '',
        paymentReference: '',
        status: 'failed',
        provider: 'chapa',
        amount: request.amount,
        timestamp: new Date(),
        errorMessage: 'Failed to initialize payment with Chapa',
      };
    }
  },

  /**
   * Verify payment status with Chapa
   */
  async verifyPayment(reference: string): Promise<PaymentResponse> {
    const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay();

    try {
      // In production:
      // const response = await fetch(
      //   `${chapaConfig.apiUrl}/transaction/verify/${reference}`,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${chapaConfig.secretKey}`,
      //     },
      //   }
      // );
      // const data = await response.json();

      const record = transactionRecords.find((t) => t.paymentReference === reference);
      if (record) {
        return {
          success: record.status === 'success',
          transactionId: record.transactionId,
          paymentReference: record.paymentReference,
          status: record.status,
          provider: 'chapa',
          amount: record.amount,
          timestamp: record.updatedAt,
        };
      }

      return {
        success: false,
        transactionId: '',
        paymentReference: reference,
        status: 'failed',
        provider: 'chapa',
        amount: 0,
        timestamp: new Date(),
        errorMessage: 'Transaction not found',
      };
    } catch (error) {
      console.error('Chapa payment verification failed:', error);
      return {
        success: false,
        transactionId: '',
        paymentReference: reference,
        status: 'failed',
        provider: 'chapa',
        amount: 0,
        timestamp: new Date(),
        errorMessage: 'Failed to verify payment with Chapa',
      };
    }
  },

  /**
   * Refund payment with Chapa
   */
  async refundPayment(reference: string, amount?: number): Promise<PaymentResponse> {
    const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay();

    try {
      // In production:
      // const response = await fetch(`${chapaConfig.apiUrl}/transaction/refund`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${chapaConfig.secretKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     reference,
      //     amount: amount || 0, // 0 for full refund
      //   }),
      // });
      // const data = await response.json();

      const record = transactionRecords.find((t) => t.paymentReference === reference);
      if (record) {
        record.status = 'refunded';
        record.updatedAt = new Date();

        return {
          success: true,
          transactionId: record.transactionId,
          paymentReference: record.paymentReference,
          status: 'refunded',
          provider: 'chapa',
          amount: record.amount,
          timestamp: record.updatedAt,
        };
      }

      return {
        success: false,
        transactionId: '',
        paymentReference: reference,
        status: 'failed',
        provider: 'chapa',
        amount: 0,
        timestamp: new Date(),
        errorMessage: 'Transaction not found for refund',
      };
    } catch (error) {
      console.error('Chapa refund failed:', error);
      return {
        success: false,
        transactionId: '',
        paymentReference: reference,
        status: 'failed',
        provider: 'chapa',
        amount: 0,
        timestamp: new Date(),
        errorMessage: 'Failed to process refund with Chapa',
      };
    }
  },
};

// ============= TELEBIRR SERVICE =============

export const teleBirrService = {
  /**
   * Initialize payment with TeleBirr
   */
  async initializePayment(request: PaymentRequest): Promise<PaymentResponse> {
    const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay();

    try {
      // In production:
      // const response = await fetch(`${teleBirrConfig.apiUrl}/checkout/create`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${teleBirrConfig.apiKey}`,
      //     'Content-Type': 'application/json',
      //     'X-Merchant-ID': teleBirrConfig.merchantId,
      //   },
      //   body: JSON.stringify({
      //     amount: request.amount,
      //     currency: request.currency,
      //     customer_phone: request.customerPhone,
      //     customer_email: request.customerEmail,
      //     order_id: request.orderId,
      //     description: request.description,
      //     return_url: request.returnUrl,
      //     webhook_url: request.notificationUrl,
      //   }),
      // });
      // const data = await response.json();

      const transactionId = `TB-${Date.now()}`;
      const paymentReference = transactionId;

      const record: TransactionRecord = {
        id: `txn-${Date.now()}`,
        orderId: request.orderId,
        amount: request.amount,
        status: 'processing',
        provider: 'telebirr',
        transactionId,
        paymentReference,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: request,
      };
      transactionRecords.push(record);

      return {
        success: true,
        transactionId,
        paymentReference,
        status: 'processing',
        provider: 'telebirr',
        amount: request.amount,
        timestamp: new Date(),
        redirectUrl: `https://checkout.telebirr.com/checkout/${transactionId}`,
      };
    } catch (error) {
      console.error('TeleBirr payment initialization failed:', error);
      return {
        success: false,
        transactionId: '',
        paymentReference: '',
        status: 'failed',
        provider: 'telebirr',
        amount: request.amount,
        timestamp: new Date(),
        errorMessage: 'Failed to initialize payment with TeleBirr',
      };
    }
  },

  /**
   * Verify payment status with TeleBirr
   */
  async verifyPayment(reference: string): Promise<PaymentResponse> {
    const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay();

    try {
      // In production:
      // const response = await fetch(
      //   `${teleBirrConfig.apiUrl}/transaction/status/${reference}`,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${teleBirrConfig.apiKey}`,
      //       'X-Merchant-ID': teleBirrConfig.merchantId,
      //     },
      //   }
      // );
      // const data = await response.json();

      const record = transactionRecords.find((t) => t.paymentReference === reference);
      if (record) {
        return {
          success: record.status === 'success',
          transactionId: record.transactionId,
          paymentReference: record.paymentReference,
          status: record.status,
          provider: 'telebirr',
          amount: record.amount,
          timestamp: record.updatedAt,
        };
      }

      return {
        success: false,
        transactionId: '',
        paymentReference: reference,
        status: 'failed',
        provider: 'telebirr',
        amount: 0,
        timestamp: new Date(),
        errorMessage: 'Transaction not found',
      };
    } catch (error) {
      console.error('TeleBirr payment verification failed:', error);
      return {
        success: false,
        transactionId: '',
        paymentReference: reference,
        status: 'failed',
        provider: 'telebirr',
        amount: 0,
        timestamp: new Date(),
        errorMessage: 'Failed to verify payment with TeleBirr',
      };
    }
  },

  /**
   * Refund payment with TeleBirr
   */
  async refundPayment(reference: string, amount?: number): Promise<PaymentResponse> {
    const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay();

    try {
      // In production:
      // const response = await fetch(`${teleBirrConfig.apiUrl}/transaction/refund`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${teleBirrConfig.apiKey}`,
      //     'Content-Type': 'application/json',
      //     'X-Merchant-ID': teleBirrConfig.merchantId,
      //   },
      //   body: JSON.stringify({
      //     reference,
      //     amount: amount || 0,
      //   }),
      // });
      // const data = await response.json();

      const record = transactionRecords.find((t) => t.paymentReference === reference);
      if (record) {
        record.status = 'refunded';
        record.updatedAt = new Date();

        return {
          success: true,
          transactionId: record.transactionId,
          paymentReference: record.paymentReference,
          status: 'refunded',
          provider: 'telebirr',
          amount: record.amount,
          timestamp: record.updatedAt,
        };
      }

      return {
        success: false,
        transactionId: '',
        paymentReference: reference,
        status: 'failed',
        provider: 'telebirr',
        amount: 0,
        timestamp: new Date(),
        errorMessage: 'Transaction not found for refund',
      };
    } catch (error) {
      console.error('TeleBirr refund failed:', error);
      return {
        success: false,
        transactionId: '',
        paymentReference: reference,
        status: 'failed',
        provider: 'telebirr',
        amount: 0,
        timestamp: new Date(),
        errorMessage: 'Failed to process refund with TeleBirr',
      };
    }
  },
};

// ============= UNIFIED PAYMENT SERVICE =============

export const paymentService = {
  /**
   * Initialize payment with primary provider (Chapa)
   * Falls back to TeleBirr if needed
   */
  async initializePayment(
    request: PaymentRequest,
    primaryProvider: PaymentProvider = 'chapa'
  ): Promise<PaymentResponse> {
    try {
      if (primaryProvider === 'chapa') {
        return await chapaService.initializePayment(request);
      } else {
        return await teleBirrService.initializePayment(request);
      }
    } catch (error) {
      // Fallback to other provider if primary fails
      const fallbackProvider = primaryProvider === 'chapa' ? 'telebirr' : 'chapa';
      console.warn(
        `Payment initialization with ${primaryProvider} failed, trying ${fallbackProvider}`
      );

      if (fallbackProvider === 'chapa') {
        return await chapaService.initializePayment(request);
      } else {
        return await teleBirrService.initializePayment(request);
      }
    }
  },

  /**
   * Verify payment with the correct provider
   */
  async verifyPayment(reference: string, provider: PaymentProvider): Promise<PaymentResponse> {
    if (provider === 'chapa') {
      return await chapaService.verifyPayment(reference);
    } else {
      return await teleBirrService.verifyPayment(reference);
    }
  },

  /**
   * Refund payment with the correct provider
   */
  async refundPayment(reference: string, provider: PaymentProvider, amount?: number): Promise<PaymentResponse> {
    if (provider === 'chapa') {
      return await chapaService.refundPayment(reference, amount);
    } else {
      return await teleBirrService.refundPayment(reference, amount);
    }
  },

  /**
   * Get transaction history
   */
  getTransactionHistory(orderId?: string): TransactionRecord[] {
    if (orderId) {
      return transactionRecords.filter((t) => t.orderId === orderId);
    }
    return transactionRecords;
  },

  /**
   * Get transaction by reference
   */
  getTransaction(reference: string): TransactionRecord | undefined {
    return transactionRecords.find((t) => t.paymentReference === reference);
  },

  /**
   * Record webhook event (would be called from webhook endpoint)
   */
  recordWebhookEvent(
    provider: PaymentProvider,
    reference: string,
    status: PaymentStatus,
    metadata?: Record<string, any>
  ): void {
    const record = transactionRecords.find((t) => t.paymentReference === reference);
    if (record) {
      record.status = status;
      record.updatedAt = new Date();
      if (metadata) {
        record.metadata = { ...record.metadata, ...metadata };
      }
    }
  },

  /**
   * Calculate order total with taxes and shipping
   */
  calculateOrderTotal(subtotal: number, shippingCost: number = 300): {
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
  } {
    // Tax rate 15% for products, 10% for shipping
    const tax = subtotal * 0.15;
    const shippingTax = shippingCost * 0.1;
    const totalTax = tax + shippingTax;

    return {
      subtotal,
      tax: Math.round(totalTax),
      shippingCost,
      total: subtotal + totalTax + shippingCost,
    };
  },
};

// ============= WEBHOOK HANDLERS =============

/**
 * Handle Chapa webhook notifications
 * This would be called from a route handler
 */
export async function handleChapaWebhook(payload: Record<string, any>): Promise<boolean> {
  try {
    const { tx_ref, status } = payload;

    // Verify webhook signature (important for production)
    // const isValid = verifyChapaSignature(payload);
    // if (!isValid) return false;

    const statusMap: Record<string, PaymentStatus> = {
      success: 'success',
      failed: 'failed',
      pending: 'processing',
      cancelled: 'failed',
    };

    const paymentStatus = statusMap[status] || 'processing';
    paymentService.recordWebhookEvent('chapa', tx_ref, paymentStatus, payload);

    return true;
  } catch (error) {
    console.error('Chapa webhook processing failed:', error);
    return false;
  }
}

/**
 * Handle TeleBirr webhook notifications
 */
export async function handleTeleBirrWebhook(payload: Record<string, any>): Promise<boolean> {
  try {
    const { order_id, status } = payload;

    // Verify webhook signature (important for production)
    // const isValid = verifyTeleBirrSignature(payload);
    // if (!isValid) return false;

    const statusMap: Record<string, PaymentStatus> = {
      success: 'success',
      failed: 'failed',
      pending: 'processing',
      cancelled: 'failed',
    };

    const paymentStatus = statusMap[status] || 'processing';
    paymentService.recordWebhookEvent('telebirr', order_id, paymentStatus, payload);

    return true;
  } catch (error) {
    console.error('TeleBirr webhook processing failed:', error);
    return false;
  }
}
