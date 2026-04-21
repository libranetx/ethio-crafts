'use client';

import { ChatMessage, ChatConversation } from './types';
import { chatService } from './data-service';
import { productService } from './data-service';
import { orderService } from './data-service';

/**
 * AI Chatbot service for customer support
 */

export interface ChatbotResponse {
  message: string;
  confidence: number;
  requiresHuman: boolean;
  suggestedAction?: string;
}

/**
 * Intent detection for user messages
 */
function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Order-related intents
  if (lowerMessage.includes('order') || lowerMessage.includes('track')) return 'order_tracking';
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) return 'payment';
  if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) return 'refund';
  if (lowerMessage.includes('shipping') || lowerMessage.includes('deliver')) return 'shipping';

  // Product-related intents
  if (lowerMessage.includes('product') || lowerMessage.includes('find')) return 'product_search';
  if (lowerMessage.includes('category')) return 'product_category';
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) return 'product_price';
  if (lowerMessage.includes('return') || lowerMessage.includes('damaged')) return 'returns';

  // Account-related intents
  if (lowerMessage.includes('account') || lowerMessage.includes('sign up') || lowerMessage.includes('register'))
    return 'account';
  if (lowerMessage.includes('password') || lowerMessage.includes('login')) return 'account_security';
  if (lowerMessage.includes('profile') || lowerMessage.includes('address')) return 'profile';
  if (lowerMessage.includes('wishlist') || lowerMessage.includes('favorite')) return 'wishlist';

  // Artisan-related intents
  if (lowerMessage.includes('artisan') || lowerMessage.includes('seller')) return 'artisan';
  if (lowerMessage.includes('sell') || lowerMessage.includes('become')) return 'become_artisan';

  // General intents
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help'))
    return 'greeting';
  if (lowerMessage.includes('about')) return 'about';
  if (lowerMessage.includes('contact')) return 'contact';

  return 'general_inquiry';
}

/**
 * Generate response based on intent
 */
function generateResponse(intent: string): ChatbotResponse {
  let response = '';
  let confidence = 0.8;
  let requiresHuman = false;

  switch (intent) {
    case 'order_tracking':
      response =
        'To track your order, go to "My Orders" in your account and click on the order number. You will see the current status and tracking information.';
      confidence = 0.95;
      break;

    case 'payment':
      response =
        'We accept payment via Chapa (card) or TeleBirr (mobile money). If you are having payment issues, try a different payment method or contact our support team.';
      confidence = 0.85;
      break;

    case 'refund':
      response =
        'Refunds are processed based on your order status. Full refund before shipment, 50% restocking fee after delivery. Contact support@ethio-crafts.com with your order number.';
      confidence = 0.8;
      requiresHuman = true;
      break;

    case 'shipping':
      response = 'Standard shipping takes 3-5 days for ETB 250. Express shipping takes 1-2 days for ETB 750.';
      confidence = 0.9;
      break;

    case 'product_search':
      response = 'You can search products by name, category, or price range. Use the filters on the products page to find what you are looking for.';
      confidence = 0.85;
      break;

    case 'product_category':
      response =
        'We offer products in these categories: Textiles, Clothing, Home Decor, Tableware, and Jewelry. All handmade by verified artisans.';
      confidence = 0.85;
      break;

    case 'product_price':
      response = 'Product prices range from ETB 1,200 to ETB 6,500. You can filter by price range using the slider on the products page.';
      confidence = 0.8;
      break;

    case 'returns':
      response =
        'Products can be returned within 30 days of delivery if damaged or defective. Contact support with your order number for a return label.';
      confidence = 0.85;
      requiresHuman = true;
      break;

    case 'account':
      response =
        'Create a free account by clicking "Sign Up" at the top of the page. You will need an email and password.';
      confidence = 0.85;
      break;

    case 'account_security':
      response = 'You can reset your password by clicking "Forgot Password" on the login page. Enter your email and follow the instructions.';
      confidence = 0.85;
      requiresHuman = true;
      break;

    case 'profile':
      response = 'Update your profile information and addresses in your account settings. Click on your profile icon in the top right.';
      confidence = 0.85;
      break;

    case 'wishlist':
      response = 'Click the heart icon on any product to add it to your wishlist for later. Access your wishlist from your account menu.';
      confidence = 0.9;
      break;

    case 'artisan':
      response =
        'To become an artisan seller, fill out the artisan application form. Your products will be verified for authenticity and quality.';
      confidence = 0.8;
      break;

    case 'become_artisan':
      response =
        'To become an artisan, apply through our platform. We verify products for handmade quality, authentic materials, and fair labor. Artisans receive 85% of sales.';
      confidence = 0.85;
      break;

    case 'greeting':
      response =
        'Hello! Welcome to Ethio-Crafts. How can I help you today? Ask about products, orders, accounts, or shipping.';
      confidence = 0.95;
      break;

    case 'about':
      response =
        'Ethio-Crafts connects customers with verified Ethiopian artisans selling authentic handcrafted products. Our mission is to support traditional craftspeople.';
      confidence = 0.9;
      break;

    case 'contact':
      response = 'Contact our support team at support@ethio-crafts.com or use this chat feature for immediate assistance.';
      confidence = 0.85;
      break;

    default:
      response =
        'I am not sure I understood your question. Please rephrase or contact support@ethio-crafts.com for detailed assistance.';
      confidence = 0.5;
      requiresHuman = true;
      break;
  }

  return {
    message: response,
    confidence,
    requiresHuman,
  };
}

/**
 * Chatbot manager
 */
export const chatbotService = {
  /**
   * Process user message and generate response
   */
  async processMessage(message: string): Promise<ChatbotResponse> {
    const intent = detectIntent(message);
    return generateResponse(intent);
  },

  /**
   * Get chat history for user
   */
  async getChatHistory(userId: string) {
    return await chatService.getByCustomer(userId);
  },

  /**
   * Get or create conversation
   */
  async getOrCreateConversation(userId: string, subject: string = 'Support Chat') {
    const conversations = await chatService.getByCustomer(userId);
    const existing = conversations.find((c) => c.status === 'open');

    if (existing) {
      return existing;
    }

    return await chatService.create(userId, subject);
  },

  /**
   * Send message in conversation
   */
  async sendMessage(conversationId: string, senderId: string, message: string) {
    return await chatService.sendMessage(conversationId, senderId, 'customer', message);
  },

  /**
   * Get bot response
   */
  async getBotResponse(message: string): Promise<string> {
    const response = await this.processMessage(message);
    return response.message;
  },

  /**
   * Escalate to human support
   */
  async escalateToHuman(conversationId: string) {
    const conversation = await chatService.getById(conversationId);
    if (conversation) {
      conversation.status = 'escalated';
      return {
        success: true,
        message: 'Your conversation has been escalated to our support team.',
      };
    }
    return { success: false };
  },

  /**
   * Close conversation
   */
  async closeConversation(conversationId: string) {
    const conversation = await chatService.getById(conversationId);
    if (conversation) {
      conversation.status = 'closed';
      return true;
    }
    return false;
  },

  /**
   * Get suggested questions
   */
  getSuggestedQuestions(): string[] {
    return [
      'How do I track my order?',
      'What is your return policy?',
      'How do I become an artisan?',
      'What shipping options are available?',
      'How do I reset my password?',
    ];
  },

  /**
   * Check if requires human escalation
   */
  requiresHumanSupport(response: ChatbotResponse): boolean {
    return response.requiresHuman || response.confidence < 0.6;
  },
};
