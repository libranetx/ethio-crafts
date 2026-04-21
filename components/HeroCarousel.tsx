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
    <div className="relative w-full overflow-hidden">
      {/* Hero Section with Blue Background */}
      <div className="relative w-full bg-gradient-to-b from-blue-500 to-blue-400 pt-12 pb-32 sm:pt-20 sm:pb-40 lg:pt-24 lg:pb-48">
        {/* Two Column Layout */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Side - Product Image */}
            <div className="flex justify-center items-center order-2 lg:order-1">
              <div className="relative w-full max-w-sm h-80 sm:h-96 lg:h-full">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center order-1 lg:order-2">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-white/70 text-sm font-medium tracking-widest">
                  {banner.category.toUpperCase()}
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
                {banner.title}
              </h2>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-white/90 mb-8 text-balance max-w-xl leading-relaxed">
                {banner.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-blue-500 hover:bg-blue-50 px-8 py-3 text-base font-semibold rounded-full shadow-lg transition-all hover:shadow-xl">
                  {banner.ctaText}
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-base font-semibold rounded-full transition-all">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator - Positioned at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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

        {/* Wavy Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{
          clipPath: 'polygon(0 40%, 0 100%, 100% 100%, 100% 40%, 75% 35%, 50% 40%, 25% 35%, 0 40%)'
        }} />
      </div>
    </div>
  )
}
