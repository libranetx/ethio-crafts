'use client'

import { useEffect, useMemo, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { X } from 'lucide-react'
import { productService } from '@/lib/data-service'
import { Product } from '@/lib/types'

export function ProductListing() {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('relevance')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await productService.getActive(1, 24)
        setProducts(response.data)
      } catch (error) {
        console.error('[v0] Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Calculate categories dynamically from products
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>()
    products.forEach((p) => {
      categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1)
    })
    return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
  }, [products])

  // Get regions from artisans
  const regions = [
    { name: 'Addis Ababa', count: 340 },
    { name: 'Oromia', count: 156 },
    { name: 'SNNPR', count: 89 },
    { name: 'Amhara', count: 78 },
    { name: 'Tigray', count: 65 },
  ]

  const materials = [
    { name: 'Clay', count: 284 },
    { name: 'Cotton', count: 156 },
    { name: 'Silk', count: 142 },
    { name: 'Brass', count: 93 },
    { name: 'Straw', count: 187 },
  ]

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(p.category)
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
      return matchesCategory && matchesPrice
    })

    // Apply sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return filtered
  }, [products, selectedCategory, priceRange, sortBy])

  const activeFilters = selectedCategory.length + selectedRegion.length

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
        Shop All Products
      </h1>
      <p className="text-muted-foreground mb-8">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar - Left */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Sort */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.name} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedCategory.includes(cat.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategory([...selectedCategory, cat.name])
                        } else {
                          setSelectedCategory(selectedCategory.filter((c) => c !== cat.name))
                        }
                      }}
                    />
                    <span className="text-sm text-foreground flex-1">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">({cat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                Region of Origin
              </h3>
              <div className="space-y-2">
                {regions.map((region) => (
                  <label key={region.name} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedRegion.includes(region.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRegion([...selectedRegion, region.name])
                        } else {
                          setSelectedRegion(selectedRegion.filter((r) => r !== region.name))
                        }
                      }}
                    />
                    <span className="text-sm text-foreground flex-1">{region.name}</span>
                    <span className="text-xs text-muted-foreground">({region.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                Price Range
              </h3>
              <div className="space-y-4">
                <Slider
                  defaultValue={[0, 10000]}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
                <div className="flex gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {priceRange[0].toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
                  </span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-muted-foreground">
                    {priceRange[1].toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                Material
              </h3>
              <div className="space-y-2">
                {materials.map((mat) => (
                  <label key={mat.name} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox />
                    <span className="text-sm text-foreground flex-1">{mat.name}</span>
                    <span className="text-xs text-muted-foreground">({mat.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilters > 0 && (
              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/5"
                onClick={() => {
                  setSelectedCategory([])
                  setSelectedRegion([])
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Products Grid - Right */}
        <main className="lg:col-span-3">
          {/* Active Filters Chips */}
          {activeFilters > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedCategory.map((cat) => (
                <div
                  key={cat}
                  className="inline-flex items-center gap-2 bg-primary/10 border border-primary rounded-full px-3 py-1 text-sm"
                >
                  <span className="text-primary font-medium">{cat}</span>
                  <button
                    onClick={() => setSelectedCategory(selectedCategory.filter((c) => c !== cat))}
                    className="text-primary hover:text-primary/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {selectedRegion.map((region) => (
                <div
                  key={region}
                  className="inline-flex items-center gap-2 bg-primary/10 border border-primary rounded-full px-3 py-1 text-sm"
                >
                  <span className="text-primary font-medium">{region}</span>
                  <button
                    onClick={() => setSelectedRegion(selectedRegion.filter((r) => r !== region))}
                    className="text-primary hover:text-primary/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-72 animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory([])
                  setPriceRange([0, 10000])
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && filteredProducts.length > 0 && (
            <>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    image={product.images[0] || '/images/product.jpg'}
                    rating={product.rating}
                    reviews={product.reviewCount}
                    verified={product.status === 'active'}
                    inStock={product.stock > 0}
                  />
                ))}
              </div>

              {/* Load More */}
              {filteredProducts.length >= 24 && (
                <div className="mt-12 text-center">
                  <Button
                    variant="outline"
                    className="px-8 border-primary text-primary hover:bg-primary/10"
                    size="lg"
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
