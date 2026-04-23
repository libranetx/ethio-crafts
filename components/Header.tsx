'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import MegaMenu from './MegaMenu'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="font-serif text-lg font-bold text-primary-foreground">E</span>
            </div>
            <span className="hidden font-serif text-xl font-bold text-foreground sm:inline">
              Ethio Crafts
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 px-8 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search handicrafts..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <nav className="hidden items-center gap-6 md:flex">
              <MegaMenu />
              <Link href="/demo" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Stories
              </Link>
              <Link href="/demo" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Help
              </Link>
            </nav>

            {/* Account Button */}
            <Link href="/dashboard/customer" className="p-2 hover:bg-muted rounded-lg transition-colors" title="My Account" aria-label="Open my account">
              <User className="h-5 w-5 text-foreground" />
            </Link>

            {/* Cart Button */}
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Open cart">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              <span className="absolute top-1 right-1 h-4 w-4 text-xs font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-border py-4 md:hidden">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/products" className="block px-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded">
                Shop
              </Link>
              <Link href="/demo" className="block px-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded">
                Stories
              </Link>
              <Link href="/demo" className="block px-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded">
                Help
              </Link>
            </div>
          </nav>
        )}
      </div>

    </header>
  )
}
