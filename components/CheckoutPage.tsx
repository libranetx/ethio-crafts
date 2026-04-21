'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, CreditCard, CheckCircle, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { paymentService } from '@/lib/payment-service'

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation'

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [paymentError, setPaymentError] = useState<string>('')
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    shippingMethod: 'standard',
    paymentMethod: 'chapa',
  })

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: CheckCircle },
    { id: 'confirmation', label: 'Confirmation', icon: CheckCircle },
  ] as const

  const orderData = {
    subtotal: 6350,
    shipping: 0,
    tax: 952.5,
    total: 7302.5,
    items: [
      { name: 'Hand-Woven Ethiopian Basket', qty: 1, price: 2850 },
      { name: 'Traditional Ethiopian Coffee Roaster', qty: 2, price: 3500 },
    ],
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep === 'shipping') setCurrentStep('payment')
    else if (currentStep === 'payment') setCurrentStep('review')
    else if (currentStep === 'review') setCurrentStep('confirmation')
  }

  const handlePrev = () => {
    if (currentStep === 'payment') setCurrentStep('shipping')
    else if (currentStep === 'review') setCurrentStep('payment')
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    setPaymentError('')

    try {
      // Generate order ID and number
      const orderId = `order-${Date.now()}`
      const orderNum = `ORD-${new Date().getFullYear()}-${Math.random().toString(36).substring(7).toUpperCase()}`
      setOrderNumber(orderNum)

      // Calculate totals using payment service
      const shippingCost = formData.shippingMethod === 'express' ? 750 : 250
      const totals = paymentService.calculateOrderTotal(orderData.subtotal, shippingCost)

      // Initialize payment based on selected method
      if (formData.paymentMethod === 'chapa' || formData.paymentMethod === 'telebirr') {
        const paymentResponse = await paymentService.initializePayment({
          orderId,
          amount: totals.total,
          currency: 'ETB',
          provider: formData.paymentMethod as 'chapa' | 'telebirr',
          customerEmail: formData.email,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          description: `Order ${orderNum} - ${orderData.items.length} items`,
          returnUrl: `${window.location.origin}/checkout?step=confirmation&order=${orderNum}`,
        })

        if (paymentResponse.success) {
          // In a real app, redirect to payment gateway
          if (paymentResponse.redirectUrl) {
            console.log('[v0] Redirecting to payment gateway:', paymentResponse.redirectUrl)
            // window.location.href = paymentResponse.redirectUrl
          }
          // For demo, move to confirmation
          setCurrentStep('confirmation')
        } else {
          setPaymentError(paymentResponse.errorMessage || 'Payment initialization failed')
        }
      } else if (formData.paymentMethod === 'cod') {
        // Cash on delivery - skip payment processing
        setCurrentStep('confirmation')
      }
    } catch (error) {
      console.error('[v0] Payment error:', error)
      setPaymentError('An error occurred while processing your payment')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Checkout</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const stepIndex = steps.findIndex((s) => s.id === step.id)
              const currentIndex = steps.findIndex((s) => s.id === currentStep)
              const isCompleted = stepIndex < currentIndex
              const isCurrent = stepIndex === currentIndex

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                      isCompleted || isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? '✓' : stepIndex + 1}
                  </div>
                  <span
                    className={`ml-3 font-medium text-sm ${
                      isCurrent ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 mx-4 h-1 rounded-full ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Panel: Form (66%) */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 'shipping' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Shipping Information</h2>

                <div className="space-y-6">
                  {/* Contact Section */}
                  <div className="border-b border-border pb-6">
                    <h3 className="font-medium text-foreground mb-4">Contact Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="you@example.com"
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+251 900 123 456"
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Section */}
                  <div className="border-b border-border pb-6">
                    <h3 className="font-medium text-foreground mb-4">Delivery Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="123 Main Street"
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Addis Ababa"
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="1234"
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Shipping Method</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', label: 'Standard Delivery (3-5 days)', price: 250 },
                        { id: 'express', label: 'Express Delivery (1-2 days)', price: 750 },
                      ].map((method) => (
                        <label key={method.id} className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={formData.shippingMethod === method.id}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary"
                          />
                          <div className="ml-4 grow">
                            <p className="font-medium text-foreground">{method.label}</p>
                          </div>
                          <span className="text-primary font-medium">ETB {method.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full mt-8 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 'payment' && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Payment Method</h2>

                <div className="space-y-4 mb-8">
                  {[
                    { id: 'chapa', label: 'Chapa (Card Payment)', icon: CreditCard },
                    { id: 'telebirr', label: 'TeleBirr (Mobile Payment)', icon: Phone },
                    { id: 'cod', label: 'Cash on Delivery', icon: MapPin },
                  ].map((method) => (
                    <label key={method.id} className="flex items-center p-4 border-2 border-border rounded-lg cursor-pointer hover:bg-muted/50" style={{borderColor: formData.paymentMethod === method.id ? 'var(--primary)' : 'var(--border)'}}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <method.icon className="w-5 h-5 ml-3 text-primary" />
                      <span className="ml-2 font-medium text-foreground">{method.label}</span>
                    </label>
                  ))}
                </div>

                {formData.paymentMethod === 'chapa' && (
                  <div className="bg-muted/50 rounded-lg p-6 mb-8 space-y-4">
                    <p className="text-sm text-foreground font-medium">Card Details</p>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'telebirr' && (
                  <div className="bg-muted/50 rounded-lg p-6 mb-8">
                    <p className="text-sm text-foreground mb-4">You will receive a TeleBirr prompt on your registered phone number</p>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+251 900 123 456"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handlePrev}
                    variant="outline"
                    className="flex-1 border-border h-12 font-medium"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium"
                  >
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 'review' && (
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-foreground">Review Order</h2>

                {/* Items */}
                <div className="border-b border-border pb-6">
                  <h3 className="font-medium text-foreground mb-4">Order Items</h3>
                  <div className="space-y-2">
                    {orderData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground">{item.name} x {item.qty}</span>
                        <span className="text-foreground font-medium">ETB {(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-b border-border pb-6">
                  <h3 className="font-medium text-foreground mb-4">Shipping Address</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{formData.fullName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}</p>
                  </div>
                  <Button onClick={() => setCurrentStep('shipping')} variant="outline" className="mt-4 border-border text-sm">Edit</Button>
                </div>

                {/* Payment Method */}
                <div className="border-b border-border pb-6">
                  <h3 className="font-medium text-foreground mb-4">Payment Method</h3>
                  <p className="text-sm text-muted-foreground capitalize">{formData.paymentMethod}</p>
                  <Button onClick={() => setCurrentStep('payment')} variant="outline" className="mt-4 border-border text-sm">Edit</Button>
                </div>

                {paymentError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{paymentError}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={handlePrev}
                    variant="outline"
                    className="flex-1 border-border h-12 font-medium"
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 'confirmation' && (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-serif font-bold text-foreground">Order Confirmed!</h2>
                  <p className="text-muted-foreground mt-2">Thank you for your purchase</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                  <p className="text-2xl font-bold text-primary font-mono">#{orderNumber}</p>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  A confirmation email has been sent to {formData.email}
                </p>

                <div className="flex flex-col gap-3">
                  <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium">
                    <Link href={`/orders/${orderNumber}`}>
                    Track Your Order
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-border h-12 font-medium">
                    <Link href="/products">
                    Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Order Summary (34% - Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card border border-border rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-serif font-bold text-foreground">Order Summary</h3>

              <div className="space-y-3 pb-6 border-b border-border max-h-64 overflow-y-auto">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="text-foreground font-medium">ETB {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">ETB {orderData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">{orderData.shipping === 0 ? 'Free' : `ETB ${orderData.shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground font-medium">ETB {orderData.tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-foreground font-medium">Total</span>
                <span className="text-2xl font-bold text-primary">ETB {orderData.total.toLocaleString()}</span>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-foreground">Secure checkout with encryption</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  No direct contact with artisans. Ethio Crafts handles all communication and quality assurance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
