'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Heart, ArrowRight, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Gym = {
  id: number
  name: string
  location: string
  description: string
  price_monthly: number
  facilities: string[]
  rating: number
  review_count: number
  images: string[]
  verified: boolean
}

export default function FavoritesPage() {
  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    async function loadFavorites() {
      try {
        // Check if logged in
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (!meData.user) { setLoading(false); return }
        setUser(meData.user)

        // Get favorite IDs
        const favRes = await fetch('/api/favorites')
        const favData = await favRes.json()
        const favIds: number[] = favData.favorites ?? []
        if (favIds.length === 0) { setLoading(false); return }

        // Get all gyms and filter
        const gymsRes = await fetch('/api/gyms')
        const gymsData = await gymsRes.json()
        const favGyms = (gymsData.gyms ?? []).filter((g: Gym) => favIds.includes(g.id))
        setGyms(favGyms)
      } catch { /* empty */ }
      finally { setLoading(false) }
    }
    loadFavorites()
  }, [])

  const removeFavorite = async (gymId: number) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gym_id: gymId }),
    })
    setGyms(prev => prev.filter(g => g.id !== gymId))
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-3 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>Favorites</Badge>
          <h1 className="text-4xl font-bold text-foreground animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>Saved Gyms</h1>
          <p className="text-muted-foreground mt-2 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>{gyms.length} gym{gyms.length !== 1 ? 's' : ''} saved</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-surface rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-muted/30" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-muted/30" />
                  <div className="h-4 w-1/2 rounded bg-muted/20" />
                </div>
              </div>
            ))}
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Sign in to save gyms</h3>
            <p className="text-muted-foreground text-sm mb-4">Create an account to start saving your favorite gyms</p>
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground">Sign in</Button>
            </Link>
          </div>
        ) : gyms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No saved gyms yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Browse gyms and click the heart icon to save them here</p>
            <Link href="/gyms">
              <Button className="bg-primary text-primary-foreground">Browse Gyms</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {gyms.map(gym => (
              <div key={gym.id} className="card-surface rounded-2xl overflow-hidden group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={gym.images?.[0] || '/images/gym-1.jpg'} alt={gym.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <button
                    onClick={() => removeFavorite(gym.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm border border-border/40 flex items-center justify-center text-pink-500 hover:bg-pink-500/20 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-pink-500" />
                  </button>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="text-sm font-semibold text-foreground">{Number(gym.rating).toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1">{gym.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5"><MapPin className="w-3 h-3 shrink-0" /> {gym.location}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4">
                    <div>
                      <span className="text-xl font-bold text-primary">₹{gym.price_monthly}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                    <Link href={`/gyms/${gym.id}`}>
                      <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 h-8">
                        View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
