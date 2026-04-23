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
    <div className="relative w-full h-screen bg-white overflow-hidden group">
      {/* Background Image with hover zoom effect */}
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
          {banner.title}
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 text-balance max-w-2xl">
          {banner.subtitle}
        </p>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base">
          {banner.ctaText}
        </Button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx)
              setAutoPlay(false)
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === current ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Category Badge */}
      <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
        {banner.category}
      </div>
    </div>
  )
}
