# Product Management System Documentation

## Overview

The Ethio-Crafts product management system handles product listings, search, filtering, and wishlist management with full integration to the dummy data service.

## Components

### Product Listing (`ProductListing.tsx`)
- Displays paginated product grid (20 products per page)
- Real-time filtering by category and price range
- Sorting by relevance, price, rating, and newest
- Dynamic category counts from actual products
- Loading and empty states

**Features:**
- 3-column responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Lazy loading with skeleton screens
- Filter chips for active filters
- Clear all filters button

### Product Detail Page (`ProductDetailPage.tsx`)
- Full product information including images, description, specifications
- Customer reviews and ratings
- Related products (same category/tags)
- Add to cart/wishlist actions
- Stock status and availability
- Artisan information and rating

**Features:**
- Image gallery with multiple product images
- Estimated delivery date calculation
- Customer review section with sorting
- Product specifications (materials, dimensions, weight)
- Similar products recommendations

### Product Card (`ProductCard.tsx`)
- Compact product preview for grid display
- Quick add to cart button
- Wishlist toggle
- Stock status badge
- Verified artisan badge
- Rating and review count

## Data Service Integration

### Product Service Methods

```typescript
// Get paginated active products
const response = await productService.getActive(page, limit);
// Returns: { data: Product[], total, page, limit }

// Get single product
const product = await productService.getById(id);

// Get products by artisan
const products = await productService.getByArtisan(artisanId);

// Search with filters
const results = await productService.search(query, {
  category: 'jewelry',
  minPrice: 1000,
  maxPrice: 5000
});

// Get all categories
const categories = await productService.getCategories();

// Get all tags
const tags = await productService.getTags();
```

## Product Utilities (`product-utils.ts`)

### WishlistManager
```typescript
import { wishlist } from '@/lib/product-utils';

// Add to wishlist
wishlist.add(productId);

// Remove from wishlist
wishlist.remove(productId);

// Check if wishlisted
wishlist.has(productId);

// Toggle wishlist
wishlist.toggle(productId);

// Get all wishlisted products
const items = wishlist.get();

// Clear wishlist
wishlist.clear();
```

### CartManager
```typescript
import { cart } from '@/lib/product-utils';

// Add item to cart
cart.add(productId, quantity);

// Remove item from cart
cart.remove(productId);

// Update item quantity
cart.update(productId, newQuantity);

// Get cart items
const items = cart.get();

// Get item count
const count = cart.count();

// Clear cart
cart.clear();

// Check if empty
cart.isEmpty();
```

### Product Utilities

```typescript
import { productUtils } from '@/lib/product-utils';

// Search products
const results = await productUtils.search(query, filters);

// Get trending products
const trending = await productUtils.getTrending(10);

// Get new products
const newProducts = await productUtils.getNew(10);

// Get products on sale
const onSale = await productUtils.getOnSale(10);

// Get top rated
const topRated = await productUtils.getTopRated(10);

// Calculate discount
const discount = productUtils.getDiscount(product);
// Returns: 15 (15% off)

// Format price
const formatted = productUtils.formatPrice(2500);
// Returns: "ETB 2,500"

// Get price range
const [min, max] = productUtils.getPriceRange(products);

// Check stock
const inStock = productUtils.isInStock(product);

// Get related products
const related = await productUtils.getRelated(product, 6);

// Format rating
const formatted = productUtils.formatRating(4.5);
// Returns: "4.5"

// Get star display
const stars = productUtils.getStars(4.5);
// Returns: { filled: 4, half: true, empty: 0 }

// Estimate delivery
const deliveryDate = productUtils.getEstimatedDelivery(product, 3);
```

## Product Status Flow

```
draft
  ↓
pending_verification → rejected (admin can override)
  ↓
active ↔ inactive (artisan can toggle)
  ↓
(available for purchase)
```

## Category System

### Predefined Categories
- textiles
- clothing
- home-decor
- tableware
- jewelry
- accessories

### Dynamic Category Filtering
Categories are calculated from active products, so category counts reflect actual inventory:

```typescript
const categories = useMemo(() => {
  const categoryMap = new Map<string, number>();
  products.forEach((p) => {
    categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
  });
  return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
}, [products]);
```

## Filtering and Sorting

### Available Filters
1. **Category** - Multiple selection
2. **Price Range** - Slider from 0 to 10,000 ETB
3. **Materials** - Checkbox based (extensible)

### Available Sorts
1. **Relevance** - Default, by product name
2. **Price: Low to High** - Ascending price
3. **Price: High to Low** - Descending price
4. **Newest** - By creation date
5. **Best Rated** - By average rating

### Filter Application
```typescript
const filteredProducts = products
  .filter((p) => {
    const matchesCategory = !selectedCategory.length || 
      selectedCategory.includes(p.category);
    const matchesPrice = p.price >= priceRange[0] && 
      p.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  })
  .sort((a, b) => {
    // Apply sort logic
  });
```

## Search Implementation

### Search Features
- Full-text search on product name and description
- Tag matching
- Case-insensitive search

```typescript
async search(query: string, category?: string, minPrice?: number, maxPrice?: number) {
  return dummyProducts.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = !category || p.category === category;
    const matchesPrice = (!minPrice || p.price >= minPrice) && 
      (!maxPrice || p.price <= maxPrice);

    return matchesQuery && matchesCategory && matchesPrice;
  });
}
```

## Pricing and Discounts

### Price Calculation
```
Final Price = Price (can be discounted)
Original Price = Price before discount (optional)
Discount % = ((Original - Final) / Original) * 100
```

### Display Format
- Currency: Ethiopian Birr (ETB)
- No decimal places (prices are whole numbers)
- Example: "ETB 2,500"

## Pagination

### Default Settings
- Products per page: 20
- Max load at once: 24 (for grid display)

### Pagination Example
```typescript
const { data, total, page, limit } = await productService.getActive(1, 20);

console.log(`Showing ${data.length} of ${total} products`);
console.log(`Page ${page} of ${Math.ceil(total / limit)}`);
```

## Reviews and Ratings

### Review System
- 5-star rating scale
- Text reviews up to 1000 characters
- Optional review images
- Helpful/unhelpful voting
- Status: pending, approved, rejected

### Average Rating
Calculated from approved reviews only:
```typescript
const averageRating = reviews
  .filter(r => r.status === 'approved')
  .reduce((sum, r) => sum + r.rating, 0) / approvedCount;
```

## Related Products

Related products are shown based on:
1. Same category (primary)
2. Shared tags (secondary)
3. Sorted randomly to provide variety

```typescript
const related = await productUtils.getRelated(product, 6);
```

## Artisan Integration

Each product links to its artisan:
- Artisan name and profile image
- Artisan rating and total sales
- Other products by artisan
- Artisan verification status

```typescript
const artisan = await artisanService.getById(product.artisanId);
```

## Stock Management

### Stock Status
- In Stock: stock > 0
- Out of Stock: stock = 0
- Low Stock Warning: stock < 5 (optional)

### Stock Display
```typescript
{product.stock > 0 ? (
  <span className="text-green-600">{product.stock} in stock</span>
) : (
  <span className="text-red-600">Out of Stock</span>
)}
```

## Product Images

### Image Requirements
- Minimum: 1 image
- Maximum: 5 images per product
- Recommended: 3-4 images for best presentation

### Image Handling
- First image used as thumbnail
- All images shown in detail gallery
- Placeholder used if image missing

```typescript
<img 
  src={product.images[0] || '/images/product-placeholder.jpg'} 
  alt={product.name}
/>
```

## Performance Optimization

### Implemented Optimizations
1. **Memoization** - Products list cached with useMemo
2. **Lazy Loading** - Images lazy loaded in grid
3. **Pagination** - Load 20 products per page
4. **Skeleton Screens** - Loading state while fetching
5. **Debounced Search** - Prevents excessive API calls

### Recommended Optimizations for Production
1. Add image caching headers
2. Implement CDN for product images
3. Use infinite scroll instead of pagination
4. Cache search results
5. Implement product recommendations with ML

## Artisan Storefront

Each artisan has a storefront showing:
- Artisan profile and verification status
- All their active products
- Artisan reviews and ratings
- Contact information

```typescript
// Get artisan products
const products = await productService.getByArtisan(artisanId);
```

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Products not loading | Data service error | Check console for errors |
| Filters not working | State not updating | Verify state setters |
| Images not showing | Wrong image path | Check image URL format |
| Slow performance | Too many products | Implement pagination |
| Cart not persisting | localStorage disabled | Enable cookies |

## Migration to Real Data

When connecting to real database:

1. Replace dummy data in `dummy-data.ts` with API calls
2. Update `productService` methods to call backend APIs
3. Implement image upload/serving
4. Add database query optimization
5. Implement caching strategy

```typescript
// Before (dummy)
async getActive(page: number, limit: number) {
  return { data: dummyProducts.filter(p => p.status === 'active') };
}

// After (real API)
async getActive(page: number, limit: number) {
  const response = await fetch(`/api/products?status=active&page=${page}&limit=${limit}`);
  return response.json();
}
```
