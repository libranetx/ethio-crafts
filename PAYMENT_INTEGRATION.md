# Payment Integration Documentation

## Overview

The Ethio-Crafts platform supports two primary payment gateways:
1. **Chapa** - Card-based payments (primary)
2. **TeleBirr** - Mobile money payments (fallback)
3. **Cash on Delivery** - COD option

All payment logic is handled through the centralized `payment-service.ts`.

## Payment Gateways

### Chapa Integration

**Status:** Mocked (ready for production integration)

Chapa is the primary payment processor handling card transactions.

**Configuration:**
```typescript
const chapaConfig = {
  secretKey: process.env.CHAPA_SECRET_KEY,
  publicKey: process.env.CHAPA_PUBLIC_KEY,
  apiUrl: process.env.CHAPA_API_URL || 'https://api.chapa.co/v1',
  environment: 'test' | 'production',
}
```

**Environment Variables Required:**
- `CHAPA_SECRET_KEY` - Your Chapa secret key
- `CHAPA_PUBLIC_KEY` - Your Chapa public key
- `CHAPA_API_URL` - Chapa API endpoint (default: https://api.chapa.co/v1)
- `CHAPA_ENVIRONMENT` - Set to 'test' or 'production'

**Methods:**
```typescript
// Initialize payment
await chapaService.initializePayment(paymentRequest)

// Verify payment status
await chapaService.verifyPayment(reference)

// Refund payment
await chapaService.refundPayment(reference, amount?)
```

### TeleBirr Integration

**Status:** Mocked (ready for production integration)

TeleBirr handles mobile money payments, serving as fallback when Chapa is unavailable.

**Configuration:**
```typescript
const teleBirrConfig = {
  merchantId: process.env.TELEBIRR_MERCHANT_ID,
  apiKey: process.env.TELEBIRR_API_KEY,
  apiUrl: process.env.TELEBIRR_API_URL || 'https://api.telebirr.com/v1',
  environment: 'test' | 'production',
}
```

**Environment Variables Required:**
- `TELEBIRR_MERCHANT_ID` - Your TeleBirr merchant ID
- `TELEBIRR_API_KEY` - Your TeleBirr API key
- `TELEBIRR_API_URL` - TeleBirr API endpoint
- `TELEBIRR_ENVIRONMENT` - Set to 'test' or 'production'

**Methods:**
```typescript
// Initialize payment
await teleBirrService.initializePayment(paymentRequest)

// Verify payment status
await teleBirrService.verifyPayment(reference)

// Refund payment
await teleBirrService.refundPayment(reference, amount?)
```

## Unified Payment Service

The `paymentService` provides a unified interface for payment operations:

```typescript
// Initialize payment (auto-fallback to TeleBirr if Chapa fails)
const response = await paymentService.initializePayment(request, 'chapa')

// Verify payment
const result = await paymentService.verifyPayment(reference, provider)

// Refund payment
const refund = await paymentService.refundPayment(reference, provider, amount)

// Calculate totals
const totals = paymentService.calculateOrderTotal(subtotal, shippingCost)
// Returns: { subtotal, tax, shippingCost, total }

// Get transaction history
const transactions = paymentService.getTransactionHistory(orderId?)

// Get single transaction
const transaction = paymentService.getTransaction(reference)

// Record webhook event
paymentService.recordWebhookEvent(provider, reference, status, metadata)
```

## Payment Flow

### 1. Checkout Step
- Customer selects payment method (Chapa/TeleBirr/COD)
- Fills in shipping and payment details

### 2. Order Review
- Customer reviews order summary
- Confirms shipping address and payment method

### 3. Place Order
- Click "Place Order" button
- `handlePlaceOrder()` is triggered
- Payment service initializes transaction

### 4. Payment Processing
```typescript
const paymentResponse = await paymentService.initializePayment({
  orderId: 'order-xxx',
  amount: 7302.50,
  currency: 'ETB',
  provider: 'chapa', // or 'telebirr'
  customerEmail: 'user@example.com',
  customerName: 'John Doe',
  customerPhone: '+251911123456',
  description: 'Order ORD-2024-ABC123',
  returnUrl: window.location.origin + '/checkout?step=confirmation',
})
```

### 5. Redirect to Payment Gateway
- If `redirectUrl` is provided, redirect customer to Chapa/TeleBirr
- Customer completes payment on gateway

### 6. Webhook Callback
- Payment gateway sends webhook to your server
- Process webhook with `handleChapaWebhook()` or `handleTeleBirrWebhook()`
- Update order status in database

### 7. Confirmation
- Customer sees confirmation page with order number
- Email confirmation sent to customer

## Tax Calculation

The system applies:
- **15% tax** on product subtotal
- **10% tax** on shipping cost

```typescript
const totals = paymentService.calculateOrderTotal(6350, 300)
// Returns:
// {
//   subtotal: 6350,
//   tax: 970 (6350*0.15 + 300*0.1),
//   shippingCost: 300,
//   total: 7620
// }
```

## Refund Processing

### Full Refund
```typescript
const refund = await paymentService.refundPayment(
  'CHAPA-12345',
  'chapa',
  0 // 0 = full refund
)
```

### Partial Refund
```typescript
const refund = await paymentService.refundPayment(
  'CHAPA-12345',
  'chapa',
  2000 // Refund 2000 ETB
)
```

## Webhook Integration

### Chapa Webhook Handler
```typescript
// Route: POST /api/webhooks/chapa
import { handleChapaWebhook } from '@/lib/payment-service'

export async function POST(request: Request) {
  const payload = await request.json()
  const success = await handleChapaWebhook(payload)
  
  return new Response(
    JSON.stringify({ success }),
    { status: success ? 200 : 400 }
  )
}
```

Chapa webhook payload structure:
```json
{
  "tx_ref": "order-123",
  "status": "success",
  "amount": 7302.50,
  "currency": "ETB"
}
```

### TeleBirr Webhook Handler
```typescript
// Route: POST /api/webhooks/telebirr
import { handleTeleBirrWebhook } from '@/lib/payment-service'

export async function POST(request: Request) {
  const payload = await request.json()
  const success = await handleTeleBirrWebhook(payload)
  
  return new Response(
    JSON.stringify({ success }),
    { status: success ? 200 : 400 }
  )
}
```

TeleBirr webhook payload structure:
```json
{
  "order_id": "order-123",
  "status": "success",
  "amount": 7302.50,
  "currency": "ETB"
}
```

## Migration to Production

### Step 1: Get API Credentials
- Sign up on [Chapa](https://dashboard.chapa.co)
- Sign up on [TeleBirr Merchant](https://merchant.telebirr.com)
- Get your API keys and credentials

### Step 2: Set Environment Variables
```bash
# Chapa
CHAPA_SECRET_KEY=your_chapa_secret_key
CHAPA_PUBLIC_KEY=your_chapa_public_key
CHAPA_ENVIRONMENT=production

# TeleBirr
TELEBIRR_MERCHANT_ID=your_merchant_id
TELEBIRR_API_KEY=your_api_key
TELEBIRR_ENVIRONMENT=production
```

### Step 3: Replace Mock with Real API Calls

In `chapaService.initializePayment()`, uncomment and use the actual API call:

```typescript
// BEFORE (Mock)
const transactionId = `CHAPA-${Date.now()}`

// AFTER (Real)
const response = await fetch(`${chapaConfig.apiUrl}/transaction/initialize`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${chapaConfig.secretKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: request.amount,
    currency: request.currency,
    email: request.customerEmail,
    // ... other fields
  }),
})
const data = await response.json()
const transactionId = data.data.checkout_url.split('/').pop()
```

### Step 4: Implement Webhook Signature Verification

Add signature verification for production:

```typescript
function verifyChapaSignature(payload: Record<string, any>): boolean {
  // Verify HMAC signature from Chapa
  const signature = crypto
    .createHmac('sha256', chapaConfig.secretKey)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  return signature === payload.__signature
}
```

### Step 5: Deploy

- Deploy to Vercel with production environment variables
- Configure webhook URLs in Chapa and TeleBirr dashboards
- Test with sandbox transactions first
- Monitor payment logs and metrics

## Testing

### Test Credit Cards (Chapa)
- **Success:** 4111 1111 1111 1111
- **Declined:** 4242 4242 4242 4242

### Test Transactions
```typescript
// Initialize payment with test card
const response = await paymentService.initializePayment({
  orderId: 'test-001',
  amount: 1000,
  currency: 'ETB',
  provider: 'chapa',
  customerEmail: 'test@example.com',
  customerName: 'Test User',
  customerPhone: '+251911111111',
  description: 'Test transaction',
})

// Verify payment
const verification = await paymentService.verifyPayment(
  response.paymentReference,
  'chapa'
)
```

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid API Key | Wrong credentials | Verify env variables |
| Amount Mismatch | Calculation error | Check tax/shipping logic |
| Network Timeout | Connection issue | Implement retry logic |
| Invalid Reference | Wrong transaction ID | Log all reference IDs |
| Declined Payment | Card issues | Guide customer to retry |

## Supported Currencies

Currently supported: **ETB (Ethiopian Birr)**

To add more currencies:
1. Update `PaymentRequest` type
2. Add currency-specific tax rates
3. Update payment gateway configurations

## Artisan Payouts

When orders are completed:
1. Customer payment is processed
2. Artisan payment is held for 3 days (for chargebacks)
3. After 3 days, funds are released to artisan's bank account
4. Weekly settlement report is generated

Payout calculation:
```
Artisan Amount = Order Total × (1 - Platform Fee) × (1 - Payment Fee)
Platform Fee = 15%
Payment Fee = 2.5% (varies by provider)
```

## Security Checklist

- [ ] All API keys are in environment variables
- [ ] Webhook signatures are verified
- [ ] HTTPS is enforced for all payment pages
- [ ] PCI compliance measures are in place
- [ ] Sensitive data is not logged
- [ ] Rate limiting is configured
- [ ] SQL injection prevention is implemented
- [ ] CSRF tokens are used
- [ ] Payment data is encrypted in transit
