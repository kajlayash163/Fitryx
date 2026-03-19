'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, ShieldCheck, Check, ChevronLeft, BarChart2, Dumbbell, Waves, Car, Lock, Bike, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

const FACILITY_ICONS: Record<string, React.ElementType> = {
  Pool: Waves,
  Parking: Car,
  Lockers: Lock,
  Cycling: Bike,
  CrossFit: Zap,
  'Personal Training': Users,
}

function PricingCard({ label, price, period, highlight }: { label: string; price: number; period: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 flex flex-col gap-2 transition-all duration-300 relative overflow-hidden ${highlight ? 'bg-primary/10 border border-primary/30 glow-primary' : 'card-surface hover:border-primary/20'}`}>
      {highlight && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground text-xs">Best Value</Badge>
        </div>
      )}
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="text-4xl font-bold text-foreground">₹{price}<span className="text-sm font-normal text-muted-foreground ml-1">/{period}</span></p>
      <Button className={`mt-2 ${highlight ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-secondary hover:bg-accent'}`}>
        Choose Plan
      </Button>
    </div>
  )
}

const DUMMY_REVIEWS = [
  { name: 'Alex M.', rating: 5, comment: 'Absolutely world-class equipment and a great atmosphere. The staff is incredibly knowledgeable.', date: '2 weeks ago' },
  { name: 'Sarah L.', rating: 4, comment: 'Great facilities and clean spaces. The parking can get busy on weekends but otherwise a top-tier gym.', date: '1 month ago' },
  { name: 'Jordan K.', rating: 5, comment: 'Best gym in the city, hands down. The pool and sauna alone are worth the monthly fee.', date: '1 month ago' },
]

export default function GymDetailClient({ gym }: { gym: Gym }) {
  const [activeImage, setActiveImage] = useState(0)
  const { ref: reviewsRef, isVisible: reviewsVisible } = useReveal()

  const images = gym.images?.length > 0 ? gym.images : ['/images/gym-1.jpg', '/images/gym-2.jpg', '/images/gym-3.jpg']

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back */}
        <Link href="/gyms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 group transition-colors">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to gyms
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-foreground">{gym.name}</h1>
              {gym.verified && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-primary font-medium">Verified</span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {gym.location}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(gym.rating)) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              ))}
              <span className="text-sm font-medium text-foreground">{Number(gym.rating).toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({gym.review_count} reviews)</span>
            </div>
          </div>
          <Link href={`/compare?ids=${gym.id}`}>
            <Button variant="ghost" className="border border-border/60 hover:border-primary/40 hover:bg-primary/5">
              <BarChart2 className="w-4 h-4 mr-2" /> Compare
            </Button>
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-3 gap-3 mb-12 rounded-2xl overflow-hidden">
          <div className="col-span-3 md:col-span-2 relative aspect-[16/9]">
            <Image src={images[activeImage]} alt={gym.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 66vw" />
          </div>
          <div className="col-span-3 md:col-span-1 flex md:flex-col gap-3">
            {images.slice(0, 3).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative flex-1 rounded-xl overflow-hidden transition-all ${activeImage === i ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-80'}`}
              >
                <Image src={img} alt={`${gym.name} ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* About */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">About this gym</h2>
              <p className="text-muted-foreground leading-relaxed">{gym.description || 'A premium fitness facility offering world-class equipment and expert trainers to help you reach your fitness goals.'}</p>
            </section>

            {/* Facilities */}
            {gym.facilities?.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gym.facilities.map(f => {
                    const Icon = FACILITY_ICONS[f] ?? Dumbbell
                    return (
                      <div key={f} className="card-surface rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm text-foreground font-medium">{f}</span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section ref={reviewsRef as React.RefObject<HTMLElement>}>
              <h2 className="text-xl font-bold text-foreground mb-4">Member Reviews</h2>
              <div className="flex flex-col gap-4">
                {DUMMY_REVIEWS.map((review, i) => (
                  <div
                    key={i}
                    className={`card-surface rounded-2xl p-5 reveal-hidden ${reviewsVisible ? 'reveal-visible' : ''}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {review.name[0]}
                        </div>
                        <span className="font-medium text-foreground text-sm">{review.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Pricing Sidebar */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-foreground">Membership Plans</h2>
            <PricingCard label="Monthly" price={gym.price_monthly} period="mo" />
            <PricingCard label="Quarterly" price={gym.price_quarterly} period="3mo" highlight />
            <PricingCard label="Yearly" price={gym.price_yearly} period="yr" />

            <div className="card-surface rounded-2xl p-5 mt-2">
              <h4 className="text-sm font-semibold text-foreground mb-3">All plans include</h4>
              {['Full equipment access', 'Locker rooms', 'Free Wi-Fi', 'Member app'].map(item => (
                <div key={item} className="flex items-center gap-2 py-1.5">
                  <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
