import { Header } from '@/components/Header'
import HeroCarousel from '@/components/HeroCarousel'
import { CategoryGrid } from '@/components/CategoryGrid'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { CulturalStories } from '@/components/CulturalStories'
import { Footer } from '@/components/Footer'
import ChatSupport from '@/components/ChatSupport'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <HeroCarousel />
      </div>
      <CategoryGrid />
      <FeaturedProducts />
      <CulturalStories />
      <Footer />
      <ChatSupport />
    </main>
  )
}
