import { Product } from './types';
import { productService } from './data-service';

/**
 * Wishlist manager for client-side state
 */
export class WishlistManager {
  private key = 'ethio_wishlist';

  get(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : [];
  }

  set(items: string[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  add(productId: string): boolean {
    const items = this.get();
    if (!items.includes(productId)) {
      items.push(productId);
      this.set(items);
      return true;
    }
    return false;
  }

  remove(productId: string): boolean {
    const items = this.get();
    const filtered = items.filter((id) => id !== productId);
    if (filtered.length < items.length) {
      this.set(filtered);
      return true;
    }
    return false;
  }

  has(productId: string): boolean {
    return this.get().includes(productId);
  }

  toggle(productId: string): boolean {
    return this.has(productId) ? this.remove(productId) : this.add(productId);
  }

  clear(): void {
    this.set([]);
  }
}

/**
 * Cart manager for client-side state
 */
export class CartManager {
  private key = 'ethio_cart';

  interface CartItem {
    productId: string;
    quantity: number;
    addedAt: number;
  }

  get(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : [];
  }

  set(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  add(productId: string, quantity: number = 1): CartItem[] {
    const items = this.get();
    const existing = items.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId,
        quantity,
        addedAt: Date.now(),
      });
    }

    this.set(items);
    return items;
  }

  remove(productId: string): CartItem[] {
    const items = this.get().filter((item) => item.productId !== productId);
    this.set(items);
    return items;
  }

  update(productId: string, quantity: number): CartItem[] {
    const items = this.get();
    const item = items.find((i) => i.productId === productId);
    if (item) {
      if (quantity <= 0) {
        return this.remove(productId);
      }
      item.quantity = quantity;
      this.set(items);
    }
    return items;
  }

  clear(): void {
    this.set([]);
  }

  count(): number {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  }

  isEmpty(): boolean {
    return this.get().length === 0;
  }
}

/**
 * Product search and filtering utilities
 */
export const productUtils = {
  /**
   * Search products by query
   */
  async search(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    return productService.search(query, filters);
  },

  /**
   * Get products by category
   */
  async getByCategory(category: string): Promise<Product[]> {
    const allProducts = await productService.getActive();
    return allProducts.data.filter((p) => p.category === category);
  },

  /**
   * Get trending products (by sales/reviews)
   */
  async getTrending(limit: number = 10): Promise<Product[]> {
    const allProducts = await productService.getActive();
    return allProducts.data
      .sort((a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating)
      .slice(0, limit);
  },

  /**
   * Get new products
   */
  async getNew(limit: number = 10): Promise<Product[]> {
    const allProducts = await productService.getActive();
    return allProducts.data
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  /**
   * Get products on sale
   */
  async getOnSale(limit: number = 10): Promise<Product[]> {
    const allProducts = await productService.getActive();
    return allProducts.data
      .filter((p) => p.originalPrice && p.price < p.originalPrice)
      .sort((a, b) => {
        const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
        const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
        return discountB - discountA;
      })
      .slice(0, limit);
  },

  /**
   * Get top rated products
   */
  async getTopRated(limit: number = 10): Promise<Product[]> {
    const allProducts = await productService.getActive();
    return allProducts.data
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, limit);
  },

  /**
   * Calculate discount percentage
   */
  getDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  },

  /**
   * Format price
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  /**
   * Get price range from products
   */
  getPriceRange(products: Product[]): [number, number] {
    if (products.length === 0) return [0, 0];
    const prices = products.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  },

  /**
   * Check if product is in stock
   */
  isInStock(product: Product): boolean {
    return product.stock > 0;
  },

  /**
   * Get related products (same category or tags)
   */
  async getRelated(product: Product, limit: number = 6): Promise<Product[]> {
    const allProducts = await productService.getActive();
    
    return allProducts.data
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category === product.category ||
            p.tags.some((tag) => product.tags.includes(tag)))
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  },

  /**
   * Format review rating
   */
  formatRating(rating: number): string {
    return rating.toFixed(1);
  },

  /**
   * Get star display
   */
  getStars(rating: number): { filled: number; half: boolean; empty: number } {
    const filled = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - filled - (half ? 1 : 0);
    return { filled, half, empty };
  },

  /**
   * Estimate delivery date
   */
  getEstimatedDelivery(product: Product, shippingDays: number = 3): Date {
    const date = new Date();
    date.setDate(date.getDate() + (product.shippingDays || shippingDays));
    return date;
  },

  /**
   * Get product summary text
   */
  getSummary(product: Product): string {
    const parts = [
      product.category,
      product.materials?.join(', '),
      `${product.stock} in stock`,
    ].filter(Boolean);
    return parts.join(' • ');
  },
};

/**
 * Export instances
 */
export const wishlist = new WishlistManager();
export const cart = new CartManager();
