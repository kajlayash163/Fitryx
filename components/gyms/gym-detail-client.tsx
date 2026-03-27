'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, ShieldCheck, Check, ChevronLeft, BarChart2, Dumbbell, Waves, Car, Lock, Bike, Zap, Users, Heart, Trash2, Send, Navigation } from 'lucide-react'
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
  latitude?: number
  longitude?: number
}

type Review = {
  id: number
  rating: number
  comment: string
  created_at: string
  user_id: number
  user_name: string
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
      <p className="text-4xl font-bold text-foreground">₹{Math.round(price).toLocaleString('en-IN')}<span className="text-sm font-normal text-muted-foreground ml-1">/{period}</span></p>
      <Button className={`mt-2 ${highlight ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-foreground/10 border border-foreground/20 text-foreground hover:bg-foreground/20'}`}>
        Choose Plan
      </Button>
    </div>
  )
}

function StarRating({ rating, onChange, interactive = false }: { rating: number; onChange?: (r: number) => void; interactive?: boolean }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star className={`w-4 h-4 transition-colors ${i <= (hover || rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>
      ))}
    </div>
  )
}

export default function GymDetailClient({ gym }: { gym: Gym }) {
  const [activeImage, setActiveImage] = useState(0)
  const { ref: reviewsRef, isVisible: reviewsVisible } = useReveal()
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | null>(null)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [isFavorited, setIsFavorited] = useState(false)

  const images = gym.images?.length > 0 ? gym.images : ['/images/gym-1.jpg', '/images/gym-2.jpg', '/images/gym-3.jpg']

  // Fetch reviews
  useEffect(() => {
    fetch(`/api/reviews?gym_id=${gym.id}`)
      .then(r => r.json())
      .then(d => setReviews(d.reviews ?? []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false))
  }, [gym.id])

  // Fetch current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setCurrentUser(d.user) })
      .catch(() => {})
  }, [])

  // Check favorites
  useEffect(() => {
    fetch('/api/favorites')
      .then(r => r.json())
      .then(d => { if (d.favorites?.includes(gym.id)) setIsFavorited(true) })
      .catch(() => {})
  }, [gym.id])

  const handleSubmitReview = async () => {
    if (!newRating || !newComment.trim()) {
      setReviewError('Please select a rating and write a comment')
      return
    }
    setSubmitting(true)
    setReviewError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gym_id: gym.id, rating: newRating, comment: newComment }),
      })
      const data = await res.json()
      if (!res.ok) { setReviewError(data.error); return }
      // Refresh reviews
      const reviewsRes = await fetch(`/api/reviews?gym_id=${gym.id}`)
      const reviewsData = await reviewsRes.json()
      setReviews(reviewsData.reviews ?? [])
      setNewRating(0)
      setNewComment('')
    } catch { setReviewError('Failed to submit review') }
    finally { setSubmitting(false) }
  }

  const handleDeleteReview = async (id: number) => {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const handleToggleFavorite = async () => {
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gym_id: gym.id }),
    })
    const data = await res.json()
    setIsFavorited(data.favorited)
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    return `${months}mo ago`
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back */}
        <Link href="/gyms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 group transition-colors animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to gyms
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
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
              <span className="text-sm text-muted-foreground">({reviews.length > 0 ? reviews.length : gym.review_count} reviews)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <Button
                variant="ghost"
                onClick={handleToggleFavorite}
                className={`border border-border/60 hover:border-pink-400/40 hover:bg-pink-500/5 ${isFavorited ? 'text-pink-500' : ''}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-pink-500' : ''}`} />
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
            )}
            <Link href={`/compare?ids=${gym.id}`}>
              <Button variant="ghost" className="border border-border/60 hover:border-primary/40 hover:bg-primary/5">
                <BarChart2 className="w-4 h-4 mr-2" /> Compare
              </Button>
            </Link>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-3 gap-3 mb-12 rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
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

            {/* Location Map */}
            {gym.latitude && gym.longitude && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4">Location</h2>
                <div className="rounded-2xl overflow-hidden border border-border/40" style={{ filter: 'invert(90%) hue-rotate(180deg)', WebkitFilter: 'invert(90%) hue-rotate(180deg)' }}>
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(gym.name + ', ' + gym.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(gym.name + ', ' + gym.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    View on Google Maps
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(gym.name + ', ' + gym.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </section>
            )}

            {/* Reviews */}
            <section ref={reviewsRef as React.RefObject<HTMLElement>}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Member Reviews</h2>
                <span className="text-sm text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Write Review Form */}
              {currentUser ? (
                <div className="card-surface rounded-2xl p-5 mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Write a Review</p>
                  <div className="flex items-center gap-3 mb-3">
                    <StarRating rating={newRating} onChange={setNewRating} interactive />
                    {newRating > 0 && <span className="text-sm text-muted-foreground">{newRating}/5</span>}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Share your experience at this gym..."
                    rows={3}
                    className="w-full bg-secondary/50 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
                  />
                  {reviewError && <p className="text-xs text-destructive mt-2">{reviewError}</p>}
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="mt-3 bg-primary text-primary-foreground hover:opacity-90"
                    size="sm"
                  >
                    <Send className="w-3.5 h-3.5 mr-2" />
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              ) : (
                <div className="card-surface rounded-2xl p-5 mb-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    <Link href="/login" className="text-primary hover:underline">Sign in</Link> to write a review
                  </p>
                </div>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="flex flex-col gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card-surface rounded-2xl p-5 animate-pulse">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-muted/30" />
                        <div className="h-4 w-24 rounded bg-muted/30" />
                      </div>
                      <div className="h-4 w-full rounded bg-muted/20 mb-2" />
                      <div className="h-4 w-3/4 rounded bg-muted/20" />
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="card-surface rounded-2xl p-8 text-center">
                  <Star className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review, i) => (
                    <div
                      key={review.id}
                      className={`card-surface rounded-2xl p-5 reveal-hidden ${reviewsVisible ? 'reveal-visible' : ''}`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                            {review.user_name[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground text-sm">{review.user_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{timeAgo(review.created_at)}</span>
                          {currentUser && (currentUser.id === review.user_id) && (
                            <button onClick={() => handleDeleteReview(review.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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
              )}
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
