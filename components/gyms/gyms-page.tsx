'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Star, MapPin, SlidersHorizontal, X, ShieldCheck, ArrowRight, BarChart2, Clock, Phone, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useReveal } from '@/hooks/use-reveal'

type Gym = {
  id: number
  name: string
  location: string
  description: string
  price_monthly: number
  price_quarterly: number
  price_yearly: number
  facilities: string[]
  rating: number
  review_count: number
  images: string[]
  verified: boolean
  gender_type: 'unisex' | 'women_only' | 'men_only'
  women_safety_rating: number | null
  opening_hours: string
  city: string
  phone: string | null
}

const ALL_FACILITIES = ['Pool', 'Sauna', 'Parking', 'Lockers', 'Yoga', 'Cardio', 'CrossFit', 'Personal Training', 'Boxing', 'Cycling']

function GymCard({ gym, delay }: { gym: Gym; delay: number }) {
  const { ref, isVisible } = useReveal()
  const img = gym.images?.[0] || '/images/gym-1.jpg'
  const genderLabel = gym.gender_type === 'women_only' ? 'Women Only' : gym.gender_type === 'men_only' ? 'Men Only' : null

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`card-surface rounded-2xl overflow-hidden group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 glow-primary-hover reveal-hidden flex flex-col h-full ${isVisible ? 'reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
        <Image src={img} alt={gym.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {genderLabel && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm border ${gym.gender_type === 'women_only' ? 'bg-pink-500/20 border-pink-400/30 text-pink-300' : 'bg-blue-500/20 border-blue-400/30 text-blue-300'}`}>
              <Users className="w-3 h-3" />
              <span className="text-xs font-medium">{genderLabel}</span>
            </div>
          )}
          {gym.verified && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary font-medium">Verified</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="text-sm font-semibold text-foreground">{Number(gym.rating).toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({gym.review_count})</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1">{gym.name}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5 line-clamp-1">
          <MapPin className="w-3 h-3 shrink-0" /> {gym.location}
        </p>
        {gym.opening_hours && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 shrink-0" /> {gym.opening_hours}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-2.5 line-clamp-2">{gym.description}</p>

        {/* Women Safety Rating */}
        {gym.women_safety_rating && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <Shield className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">Women Safety: {Number(gym.women_safety_rating).toFixed(1)}/5</span>
          </div>
        )}

        {/* Facilities */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {gym.facilities?.slice(0, 3).map(f => (
            <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground border border-border/40">{f}</span>
          ))}
          {gym.facilities?.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground border border-border/40">+{gym.facilities.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto pt-5">
          <div>
            <span className="text-xl font-bold text-primary">₹{gym.price_monthly}</span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/compare?ids=${gym.id}`}>
              <Button size="sm" variant="ghost" className="h-8 px-2 hover:bg-primary/10 hover:text-primary">
                <BarChart2 className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href={`/gyms/${gym.id}`}>
              <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 h-8">
                View <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchGyms = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (verifiedOnly) params.set('verified', 'true')
      if (genderFilter) params.set('gender_type', genderFilter)
      const res = await fetch(`/api/gyms?${params.toString()}`)
      const data = await res.json()
      let results = data.gyms ?? []
      // Client-side multi-facility filter
      if (selectedFacilities.length > 0) {
        results = results.filter((gym: Gym) =>
          selectedFacilities.every(f => gym.facilities?.includes(f))
        )
      }
      setGyms(results)
    } finally {
      setLoading(false)
    }
  }, [search, verifiedOnly, selectedFacilities, genderFilter])

  useEffect(() => {
    // Debounce search with 500ms delay to reduce API calls
    const t = setTimeout(fetchGyms, search.length > 0 ? 500 : 0)
    return () => clearTimeout(t)
  }, [fetchGyms, search.length])

  const toggleFacility = (f: string) => {
    setSelectedFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-3">Listings</Badge>
            <h1 className="text-4xl font-bold text-foreground">Browse Gyms</h1>
            <p className="text-muted-foreground mt-2">{gyms.length} gyms available</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search gyms or locations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 w-72 bg-secondary/50 border-border/60 focus:border-primary/50"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="border border-border/60 hover:border-primary/40 hover:bg-primary/5 lg:hidden"
              onClick={() => setSidebarOpen(o => !o)}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-56 shrink-0`}>
            <div className="card-surface rounded-2xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                {(selectedFacilities.length > 0 || verifiedOnly || genderFilter) && (
                  <button
                    onClick={() => { setSelectedFacilities([]); setVerifiedOnly(false); setGenderFilter('') }}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Verified */}
              <div className="mb-5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2.5 font-medium">Status</p>
                <button
                  onClick={() => setVerifiedOnly(v => !v)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${verifiedOnly ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-accent/50'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified only
                </button>
              </div>

              {/* Gender Type */}
              <div className="mb-5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2.5 font-medium">For</p>
                {[{ label: 'All Gyms', value: '' }, { label: 'Women Only', value: 'women_only' }, { label: 'Men Only', value: 'men_only' }].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setGenderFilter(genderFilter === opt.value ? '' : opt.value)}
                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${genderFilter === opt.value ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-accent/50'}`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Facilities */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2.5 font-medium">Facilities</p>
                <div className="flex flex-col gap-1.5">
                  {ALL_FACILITIES.map(f => (
                    <button
                      key={f}
                      onClick={() => toggleFacility(f)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${selectedFacilities.includes(f) ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-accent/50'}`}
                    >
                      {selectedFacilities.includes(f) && <X className="w-3 h-3 shrink-0" />}
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-surface rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-[16/9] bg-muted/30" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/4 rounded bg-muted/30" />
                      <div className="h-4 w-1/2 rounded bg-muted/20" />
                      <div className="h-4 w-full rounded bg-muted/20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : gyms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No gyms found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {gyms.map((gym, i) => (
                  <GymCard key={gym.id} gym={gym} delay={i * 60} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
