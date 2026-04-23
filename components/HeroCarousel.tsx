'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Product images for floating elements
const productImages = [
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1598303866858-0f64a02a2f13?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
]

// CSS for floating animation
const floatingStyles = `
  @keyframes float1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
    50% { transform: translateY(-20px) rotate(5deg); opacity: 1; }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
    50% { transform: translateY(-30px) rotate(-5deg); opacity: 0.9; }
  }
  @keyframes float3 {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
    50% { transform: translateY(-25px) rotate(3deg); opacity: 0.85; }
  }
  @keyframes float4 {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.75; }
    50% { transform: translateY(-35px) rotate(-8deg); opacity: 0.95; }
  }
  .float-item-1 { animation: float1 4s ease-in-out infinite; }
  .float-item-2 { animation: float2 5s ease-in-out infinite 0.5s; }
  .float-item-3 { animation: float3 4.5s ease-in-out infinite 1s; }
  .float-item-4 { animation: float4 5.5s ease-in-out infinite 1.5s; }
`

interface HeroBanner {
  id: number
  title: string
  subtitle: string
  ctaText: string
  image: string
  category: string
}

const banners: HeroBanner[] = [
  {
    id: 1,
    title: 'Discover Authentic Ethiopian Basketry',
    subtitle: 'Hand-woven craftsmanship passed down through generations',
    ctaText: 'Shop Baskets',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&h=600&fit=crop',
    category: 'Basketry',
  },
  {
    id: 2,
    title: 'Exquisite Ethiopian Jewelry',
    subtitle: 'Stunning pieces crafted with traditional techniques',
    ctaText: 'Shop Jewelry',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=600&fit=crop',
    category: 'Jewelry',
  },
  {
    id: 3,
    title: 'Handcrafted Leather Works',
    subtitle: 'Premium Ethiopian leather goods for every occasion',
    ctaText: 'Shop Leather',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=600&fit=crop',
    category: 'Leatherwork',
  },
  {
    id: 4,
    title: 'Ethiopian Textile Art',
    subtitle: 'Colorful woven textiles and traditional fabrics',
    ctaText: 'Shop Textiles',
    image: 'https://images.unsplash.com/photo-1581974267369-3e2e7693e6f9?w=1200&h=600&fit=crop',
    category: 'Textiles',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay])

  const next = () => {
    setCurrent((prev) => (prev + 1) % banners.length)
    setAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
    setAutoPlay(false)
  }

  const banner = banners[current]

  return (
    <>
      <style>{floatingStyles}</style>
      <div className="relative w-full h-screen bg-transparent overflow-hidden">
        {/* Two Column Layout */}
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12 lg:py-0 z-10">
            <div>
              {/* Category Label */}
              <div className="inline-flex mb-6">
                <span className="text-primary font-semibold text-sm tracking-wider uppercase">
                  {banner.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                {banner.title}
              </h2>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-primary font-semibold mb-6">
                {banner.subtitle}
              </p>

              {/* Description */}
              <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                Discover the beauty of authentic Ethiopian craftsmanship. Each piece tells a story of tradition, culture, and artistic excellence passed down through generations.
              </p>

              {/* CTA Button */}
              <div className="flex gap-4 items-center">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-semibold rounded-full shadow-lg transition-all hover:shadow-xl">
                  {banner.ctaText}
                </Button>
                <button
                  onClick={next}
                  className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Floating Product Images */}
          <div className="relative h-full hidden lg:block overflow-hidden">
            {/* Floating product image 1 */}
            <div className="float-item-1 absolute top-20 right-20 w-32 h-32 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={productImages[0]}
                alt="Product 1"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating product image 2 */}
            <div className="float-item-2 absolute top-40 right-40 w-28 h-28 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={productImages[1]}
                alt="Product 2"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating product image 3 */}
            <div className="float-item-3 absolute top-1/2 right-16 w-40 h-40 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={productImages[2]}
                alt="Product 3"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating product image 4 */}
            <div className="float-item-4 absolute bottom-32 right-32 w-32 h-32 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={productImages[3]}
                alt="Product 4"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Background accent - subtle gradient orb */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Navigation Dots - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrent(idx)
                setAutoPlay(false)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current ? 'bg-primary w-8' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Left Navigation Arrow */}
        <button
          onClick={prev}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-muted/50 hover:bg-muted text-foreground transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
    </>
  )
}
