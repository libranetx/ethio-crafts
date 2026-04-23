'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'



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
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Two Column Layout */}
      <div className="h-full grid grid-cols-1 lg:grid-cols-2 items-stretch">
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
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-semibold rounded-full shadow-lg transition-all hover:shadow-xl w-fit">
              {banner.ctaText}
            </Button>
          </div>
        </div>

        {/* Right Column - Full Height Product Image */}
        <div className="relative h-full hidden lg:block overflow-hidden">
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            priority
            sizes="50vw"
            className="w-full h-full object-cover"
          />
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

      {/* Left Navigation Arrow - at beginning of left side */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-white text-foreground shadow-lg transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Navigation Arrow - at end of right side */}
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/80 hover:bg-white text-foreground shadow-lg transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
