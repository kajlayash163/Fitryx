'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Dumbbell, MapPin, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [location] = useState('Jaipur, Rajasthan')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user) })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const navLinks = [
    { label: 'Gyms', href: '/gyms' },
    { label: 'Compare', href: '/compare' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[oklch(0.10_0.012_250/0.9)] backdrop-blur-xl border-b border-border/40'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:shadow-[0_0_16px_oklch(0.65_0.22_195/0.5)] transition-shadow duration-300">
            <Dumbbell className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">Fitryx</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/40">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{location}</span>
          </div>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="w-20 h-9 rounded-md bg-muted/30 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                    Dashboard
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-border/40">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm ring-1 ring-primary/30 shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-1 rounded-full transition-colors"
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' })
                    window.location.href = '/'
                  }}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:opacity-90 glow-primary-hover transition-all">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[oklch(0.12_0.014_250)] border-t border-border/40 px-6 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
            {isLoading ? (
              <div className="w-full h-9 rounded-md bg-muted/30 animate-pulse" />
            ) : user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10">Dashboard</Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' })
                    window.location.href = '/'
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign in</Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
