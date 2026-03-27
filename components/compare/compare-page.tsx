'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Check, Minus, Star, MapPin, ShieldCheck, BarChart2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
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
}

function RatingBar({ value, max = 5, delay = 0 }: { value: number; max?: number; delay?: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{
            width: isVisible ? `${(value / max) * 100}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span className="text-xs font-medium text-foreground w-6 text-right">{value}</span>
    </div>
  )
}

function GymColumn({ gym, onRemove, best }: { gym: Gym; onRemove: () => void; best: (key: keyof Gym) => number }) {
  const img = gym.images?.[0] || '/images/gym-1.jpg'
  const isMonthlyBest = Number(gym.price_monthly) === best('price_monthly')
  const isRatingBest = Number(gym.rating) === best('rating')

  return (
    <div className="flex flex-col min-w-[260px] card-surface rounded-2xl overflow-hidden border transition-all hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg animate-card-scale">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image src={img} alt={gym.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        {gym.verified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-xs text-primary font-medium">Verified</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Name */}
        <div className="min-h-[4.5rem]">
          <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-2">{gym.name}</h3>
          <p className="text-xs text-muted-foreground flex items-start gap-1 mt-1.5 line-clamp-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /> <span className="flex-1">{gym.location}</span>
          </p>
        </div>

        {/* Rating */}
        <div className={`rounded-xl p-3 flex flex-col ${isRatingBest ? 'bg-primary/10 border border-primary/20' : 'bg-muted/20'}`}>
          <p className="text-xs text-muted-foreground mb-1.5">Rating</p>
          <div className="flex items-center gap-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(Number(gym.rating)) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
            ))}
          </div>
          <RatingBar value={Number(gym.rating)} delay={200} />
          <div className="mt-2 h-6">
            {isRatingBest && <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">Highest Rated</Badge>}
          </div>
        </div>

        {/* Pricing */}
        <div className={`rounded-xl p-3 flex flex-col ${isMonthlyBest ? 'bg-primary/10 border border-primary/20' : 'bg-muted/20'}`}>
          <p className="text-xs text-muted-foreground mb-2">Pricing</p>
          <div className="flex flex-col gap-1.5 flex-grow">
            {[
              { label: 'Monthly', value: gym.price_monthly, period: 'mo' },
              { label: 'Quarterly', value: gym.price_quarterly, period: '3mo' },
              { label: 'Yearly', value: gym.price_yearly, period: 'yr' },
            ].map(({ label, value, period }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">₹{value}<span className="text-xs text-muted-foreground font-normal">/{period}</span></span>
              </div>
            ))}
          </div>
          <div className="mt-2 h-6">
            {isMonthlyBest && <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">Best Price</Badge>}
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-muted/20 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-2">Facilities ({gym.facilities?.length ?? 0})</p>
          <div className="flex flex-col gap-1">
            {['Pool', 'Sauna', 'Parking', 'Lockers', 'Yoga', 'CrossFit', 'Boxing', 'Cycling'].map(f => {
              const has = gym.facilities?.includes(f)
              return (
                <div key={f} className="flex items-center gap-2 py-0.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${has ? 'bg-primary/15' : 'bg-muted/30'}`}>
                    {has ? <Check className="w-2.5 h-2.5 text-primary" /> : <Minus className="w-2.5 h-2.5 text-muted-foreground/40" />}
                  </div>
                  <span className={`text-xs ${has ? 'text-foreground' : 'text-muted-foreground/40'}`}>{f}</span>
                </div>
              )
            })}
          </div>
        </div>

        <Link href={`/gyms/${gym.id}`}>
          <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
            View Full Details
          </Button>
        </Link>
      </div>
    </div>
  )
}

function AddGymSlot({ allGyms, onAdd }: { allGyms: Gym[]; onAdd: (gym: Gym) => void }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const filtered = allGyms.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-w-[260px] card-surface rounded-2xl border-dashed border-2 flex flex-col items-center justify-center p-8 gap-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Plus className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Add a gym</p>
        <p className="text-xs text-muted-foreground mt-1">Compare up to 3 gyms</p>
      </div>
      {!open ? (
        <Button size="sm" variant="ghost" className="border border-border/60 hover:border-primary/40" onClick={() => setOpen(true)}>
          Select Gym
        </Button>
      ) : (
        <div className="w-full flex flex-col gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-sm bg-secondary/50"
            autoFocus
          />
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1 rounded-xl bg-secondary/30 p-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground py-3 text-center">No gyms found</p>
            ) : (
              filtered.map(g => (
                <button key={g.id} onClick={() => { onAdd(g); setOpen(false); setSearch('') }}
                  className="text-left px-3 py-2 rounded-lg text-sm hover:bg-accent/50 text-foreground transition-colors"
                >
                  {g.name}
                </button>
              ))
            )}
          </div>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="text-xs text-muted-foreground">Cancel</Button>
        </div>
      )}
    </div>
  )
}

export default function ComparePage() {
  const [allGyms, setAllGyms] = useState<Gym[]>([])
  const [selected, setSelected] = useState<Gym[]>([])
  const searchParams = useSearchParams()

  useEffect(() => {
    fetch('/api/gyms').then(r => r.json()).then(d => {
      const gyms = d.gyms ?? []
      setAllGyms(gyms)
      // Auto-populate from URL params (e.g. /compare?ids=1,2,3 or /compare?ids=1)
      const idsParam = searchParams.get('ids')
      if (idsParam) {
        const ids = idsParam.split(',').map(Number).filter(Boolean)
        const matched = gyms.filter((g: Gym) => ids.includes(g.id)).slice(0, 3)
        if (matched.length > 0) setSelected(matched)
      }
    })
  }, [searchParams])

  const add = useCallback((gym: Gym) => {
    if (selected.length >= 3 || selected.find(g => g.id === gym.id)) return
    setSelected(prev => [...prev, gym])
  }, [selected])

  const remove = useCallback((id: number) => {
    setSelected(prev => prev.filter(g => g.id !== id))
  }, [])

  const best = useCallback((key: keyof Gym) => {
    if (selected.length === 0) return 0
    const vals = selected.map(g => Number(g[key]))
    return key === 'price_monthly' ? Math.min(...vals) : Math.max(...vals)
  }, [selected])

  const available = allGyms.filter(g => !selected.find(s => s.id === g.id))

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-3 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>Compare</Badge>
          <h1 className="text-4xl font-bold text-foreground animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>Gym Comparison</h1>
          <p className="text-muted-foreground mt-2 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>Compare up to 3 gyms side-by-side to find your perfect match</p>
        </div>

        {selected.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BarChart2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Start comparing gyms</h3>
              <p className="text-muted-foreground text-sm max-w-sm">Add gyms using the search below to compare their pricing, facilities, and ratings side-by-side.</p>
            </div>
            <AddGymSlot allGyms={available} onAdd={add} />
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-5 min-w-max">
              {selected.map(gym => (
                <GymColumn key={gym.id} gym={gym} onRemove={() => remove(gym.id)} best={best} />
              ))}
              {selected.length < 3 && (
                <AddGymSlot allGyms={available} onAdd={add} />
              )}
            </div>
          </div>
        )}

        {selected.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="w-4 h-4" />
            <span>Not seeing the right gym?</span>
            <Link href="/gyms" className="text-primary hover:underline">Browse all gyms</Link>
          </div>
        )}
      </div>
    </div>
  )
}
