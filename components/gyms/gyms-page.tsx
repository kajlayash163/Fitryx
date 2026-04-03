'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Star, MapPin, SlidersHorizontal, X, ShieldCheck, ArrowRight, BarChart2, Clock, Shield, Users, Heart, ChevronDown, Check } from 'lucide-react'
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
const SORT_OPTIONS = [
  { label: 'Rating (High→Low)', value: 'rating_desc' },
  { label: 'Price (Low→High)', value: 'price_asc' },
  { label: 'Price (High→Low)', value: 'price_desc' },
  { label: 'Name (A→Z)', value: 'name_asc' },
]
const GYMS_PER_PAGE = 9
const PRICE_MIN = 500
const PRICE_MAX = 5000

/* ────── GYM CARD ────── */
function GymCard({ gym, delay, isFavorited, onToggleFav }: { gym: Gym; delay: number; isFavorited: boolean; onToggleFav: () => void }) {
  const { ref, isVisible } = useReveal()
  const img = gym.images?.[0] || '/images/gym-1.jpg'
  const genderLabel = gym.gender_type === 'women_only' ? 'Women Only' : gym.gender_type === 'men_only' ? 'Men Only' : null

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`card-surface rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500 reveal-hidden flex flex-col h-full ${isVisible ? 'reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
        <Image src={img} alt={gym.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); onToggleFav() }}
            className={`w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm border border-border/40 flex items-center justify-center transition-colors hover:bg-pink-500/20 ${isFavorited ? 'text-pink-500' : 'text-muted-foreground'}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-pink-500' : ''}`} />
          </button>
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

        {gym.women_safety_rating && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <Shield className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">Women Safety: {Number(gym.women_safety_rating).toFixed(1)}/5</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {gym.facilities?.slice(0, 3).map(f => (
            <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground border border-border/40">{f}</span>
          ))}
          {gym.facilities?.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground border border-border/40">+{gym.facilities.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/40 mt-auto pt-5">
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

/* ────── PRICE RANGE SLIDER (dual-thumb) ────── */
function PriceSlider({ min, max, valueMin, valueMax, onChange }: {
  min: number; max: number; valueMin: number; valueMax: number; onChange: (lo: number, hi: number) => void
}) {
  const track = useRef<HTMLDivElement>(null)

  const pctMin = ((valueMin - min) / (max - min)) * 100
  const pctMax = ((valueMax - min) / (max - min)) * 100

  const handlePointer = (thumb: 'min' | 'max') => (e: React.PointerEvent) => {
    e.preventDefault()
    const el = track.current; if (!el) return
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width))
      const val = Math.round((min + pct * (max - min)) / 100) * 100
      if (thumb === 'min') onChange(Math.min(val, valueMax - 100), valueMax)
      else onChange(valueMin, Math.max(val, valueMin + 100))
    }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div className="pt-2 pb-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-foreground bg-secondary/60 px-2 py-0.5 rounded">₹{valueMin.toLocaleString()}</span>
        <span className="text-xs font-medium text-foreground bg-secondary/60 px-2 py-0.5 rounded">₹{valueMax.toLocaleString()}</span>
      </div>
      <div ref={track} className="relative h-1.5 rounded-full bg-muted/40 cursor-pointer">
        {/* Active range */}
        <div className="absolute h-full rounded-full bg-primary/60" style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }} />
        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-background border-2 border-primary shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${pctMin}%` }}
          onPointerDown={handlePointer('min')}
        />
        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-background border-2 border-primary shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          style={{ left: `${pctMax}%` }}
          onPointerDown={handlePointer('max')}
        />
      </div>
    </div>
  )
}


/* ────── MAIN PAGE ────── */
export default function GymsPage() {
  const [allGyms, setAllGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [genderFilter, setGenderFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState('rating_desc')
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX])
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<number[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  const fetchGyms = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (verifiedOnly) params.set('verified', 'true')
      if (genderFilter) params.set('gender_type', genderFilter)
      const res = await fetch(`/api/gyms?${params.toString()}`)
      const data = await res.json()
      setAllGyms(data.gyms ?? [])
    } finally {
      setLoading(false)
    }
  }, [search, verifiedOnly, genderFilter])

  useEffect(() => {
    const t = setTimeout(fetchGyms, search.length > 0 ? 500 : 0)
    return () => clearTimeout(t)
  }, [fetchGyms, search.length])

  useEffect(() => {
    fetch('/api/favorites')
      .then(r => r.json())
      .then(d => setFavorites(d.favorites ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => { setPage(1) }, [search, selectedFacilities, verifiedOnly, genderFilter, sortBy, priceRange])

  const toggleFacility = (f: string) => {
    setSelectedFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const toggleFavorite = async (gymId: number) => {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gym_id: gymId }),
    })
    const data = await res.json()
    if (data.favorited) setFavorites(prev => [...prev, gymId])
    else setFavorites(prev => prev.filter(id => id !== gymId))
  }

  const clearAllFilters = () => {
    setSelectedFacilities([]); setVerifiedOnly(false); setGenderFilter(''); setPriceRange([PRICE_MIN, PRICE_MAX])
  }

  // Compute active filter count
  const activeFilterCount = selectedFacilities.length
    + (verifiedOnly ? 1 : 0)
    + (genderFilter ? 1 : 0)
    + (priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX ? 1 : 0)

  // Apply client-side filters + sort
  let gyms = [...allGyms]
  if (selectedFacilities.length > 0) gyms = gyms.filter(gym => selectedFacilities.every(f => gym.facilities?.includes(f)))
  if (priceRange[0] !== PRICE_MIN) gyms = gyms.filter(g => g.price_monthly >= priceRange[0])
  if (priceRange[1] !== PRICE_MAX) gyms = gyms.filter(g => g.price_monthly <= priceRange[1])

  gyms.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price_monthly - b.price_monthly
      case 'price_desc': return b.price_monthly - a.price_monthly
      case 'name_asc': return a.name.localeCompare(b.name)
      default: return Number(b.rating) - Number(a.rating)
    }
  })

  const totalGyms = gyms.length
  const totalPages = Math.ceil(totalGyms / GYMS_PER_PAGE)
  const paginatedGyms = gyms.slice(0, page * GYMS_PER_PAGE)

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-3 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>Listings</Badge>
            <h1 className="text-4xl font-bold text-foreground animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>Browse Gyms</h1>
            <p className="text-muted-foreground mt-2 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>{totalGyms} gyms available</p>
          </div>

          {/* Toolbar: Search + Sort + Filter */}
          <div className="flex items-center gap-3 animate-fade-up flex-wrap" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-secondary/50 border border-border/60 rounded-xl px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search gyms..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-secondary/50 border-border/60 focus:border-primary/50 rounded-xl"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setFilterOpen(o => !o)}
                className={`border rounded-xl px-4 gap-2 transition-all ${filterOpen || activeFilterCount > 0 ? 'border-primary/40 bg-primary/5 text-primary' : 'border-border/60 hover:border-primary/40 hover:bg-primary/5'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">{activeFilterCount}</span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ═══════════ PREMIUM FILTER OVERLAY ═══════════ */}
        {filterOpen && (
          <>
            {/* Backdrop with blur */}
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setFilterOpen(false)}
            />

            {/* Centered Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setFilterOpen(false)}>
              <div
                className="w-full max-w-lg rounded-3xl border border-border/40 bg-[oklch(0.12_0.014_250)] shadow-[0_0_80px_-12px_var(--glow-primary)] animate-fade-up overflow-hidden"
                style={{ animationDuration: '0.35s' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Glow accent line at top */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-foreground">Filters</h2>
                        <p className="text-xs text-muted-foreground">Refine your gym search</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="w-8 h-8 rounded-xl bg-secondary/60 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <div className="mb-6">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.15em] mb-3 font-medium">Sort by</p>
                    <div className="grid grid-cols-4 gap-1.5 bg-secondary/30 rounded-xl p-1">
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value)}
                          className={`px-2 py-2 rounded-lg text-[11px] font-medium transition-all ${sortBy === opt.value ? 'bg-primary/15 text-primary shadow-sm border border-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          {opt.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.15em] mb-3 font-medium">Monthly Price</p>
                    <div className="bg-secondary/20 rounded-xl p-4 border border-border/20">
                      <PriceSlider min={PRICE_MIN} max={PRICE_MAX} valueMin={priceRange[0]} valueMax={priceRange[1]} onChange={(lo, hi) => setPriceRange([lo, hi])} />
                    </div>
                  </div>

                  {/* Quick Toggles — 3 cards side by side */}
                  <div className="mb-6">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.15em] mb-3 font-medium">Quick Filters</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setVerifiedOnly(v => !v)}
                        className={`group relative flex flex-col items-center gap-2 px-3 py-3.5 rounded-xl text-xs font-medium transition-all border ${verifiedOnly ? 'bg-primary/10 text-primary border-primary/25 shadow-[0_0_15px_-3px_var(--glow-primary)]' : 'bg-secondary/20 text-muted-foreground border-border/20 hover:border-border/40 hover:bg-secondary/30'}`}
                      >
                        <ShieldCheck className="w-5 h-5" />
                        <span>Verified</span>
                        {verifiedOnly && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />}
                      </button>
                      <button
                        onClick={() => setGenderFilter(genderFilter === 'women_only' ? '' : 'women_only')}
                        className={`group relative flex flex-col items-center gap-2 px-3 py-3.5 rounded-xl text-xs font-medium transition-all border ${genderFilter === 'women_only' ? 'bg-pink-500/10 text-pink-400 border-pink-400/25 shadow-[0_0_15px_-3px_oklch(0.6_0.2_350/0.3)]' : 'bg-secondary/20 text-muted-foreground border-border/20 hover:border-border/40 hover:bg-secondary/30'}`}
                      >
                        <Users className="w-5 h-5" />
                        <span>Women</span>
                        {genderFilter === 'women_only' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-400" />}
                      </button>
                      <button
                        onClick={() => setGenderFilter(genderFilter === 'men_only' ? '' : 'men_only')}
                        className={`group relative flex flex-col items-center gap-2 px-3 py-3.5 rounded-xl text-xs font-medium transition-all border ${genderFilter === 'men_only' ? 'bg-blue-500/10 text-blue-400 border-blue-400/25 shadow-[0_0_15px_-3px_oklch(0.5_0.2_260/0.3)]' : 'bg-secondary/20 text-muted-foreground border-border/20 hover:border-border/40 hover:bg-secondary/30'}`}
                      >
                        <Users className="w-5 h-5" />
                        <span>Men</span>
                        {genderFilter === 'men_only' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="mb-7">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-[0.15em] mb-3 font-medium">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_FACILITIES.map(f => (
                        <button
                          key={f}
                          onClick={() => toggleFacility(f)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${selectedFacilities.includes(f) ? 'bg-primary/10 text-primary border-primary/25 shadow-[0_0_10px_-3px_var(--glow-primary)]' : 'bg-secondary/20 text-muted-foreground border-border/20 hover:border-border/40 hover:bg-secondary/30'}`}
                        >
                          {selectedFacilities.includes(f) && <Check className="w-3 h-3 inline mr-1.5 -mt-0.5" />}{f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-5 border-t border-border/20">
                    <button
                      onClick={clearAllFilters}
                      className={`text-sm font-medium transition-colors ${activeFilterCount > 0 ? 'text-muted-foreground hover:text-destructive' : 'text-muted/40 cursor-default'}`}
                      disabled={activeFilterCount === 0}
                    >
                      Clear all{activeFilterCount > 0 && ` (${activeFilterCount})`}
                    </button>
                    <Button
                      onClick={() => setFilterOpen(false)}
                      className="bg-primary text-primary-foreground hover:opacity-90 px-8 h-10 rounded-xl font-semibold text-sm transition-all hover:shadow-[0_0_30px_-5px_var(--glow-primary)]"
                    >
                      Show {totalGyms} gym{totalGyms !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-up" style={{ animationDuration: '0.3s' }}>
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                <ShieldCheck className="w-3 h-3" /> Verified <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3 ml-1 hover:text-destructive" /></button>
              </span>
            )}
            {genderFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                {genderFilter === 'women_only' ? 'Women Only' : 'Men Only'} <button onClick={() => setGenderFilter('')}><X className="w-3 h-3 ml-1 hover:text-destructive" /></button>
              </span>
            )}
            {(priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                ₹{priceRange[0]}–₹{priceRange[1]} <button onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}><X className="w-3 h-3 ml-1 hover:text-destructive" /></button>
              </span>
            )}
            {selectedFacilities.map(f => (
              <span key={f} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                {f} <button onClick={() => toggleFacility(f)}><X className="w-3 h-3 ml-1 hover:text-destructive" /></button>
              </span>
            ))}
            <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-primary ml-1">Clear all</button>
          </div>
        )}

        {/* Grid */}
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
        ) : totalGyms === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No gyms found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clearAllFilters} className="mt-4 text-primary">Clear all filters</Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedGyms.map((gym, i) => (
                <GymCard
                  key={gym.id}
                  gym={gym}
                  delay={i * 60}
                  isFavorited={favorites.includes(gym.id)}
                  onToggleFav={() => toggleFavorite(gym.id)}
                />
              ))}
            </div>
            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="ghost"
                  onClick={() => setPage(p => p + 1)}
                  className="border border-border/60 hover:border-primary/40 hover:bg-primary/5 px-8 rounded-xl"
                >
                  Load More ({totalGyms - paginatedGyms.length} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
