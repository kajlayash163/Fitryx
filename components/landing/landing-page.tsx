'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Search, BarChart2, Star, MapPin, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useReveal, useCountUp } from '@/hooks/use-reveal'

/* ─── Stat Counter ─────────────────────────────────────── */
function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isVisible } = useReveal()
  const count = useCountUp(value, isVisible)
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`text-center reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}>
      <p className="text-5xl font-bold text-primary tabular-nums">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

/* ─── Feature Row ────────────────────────────────────────── */
function FeatureRow({
  title, description, image, reverse, icon: Icon,
}: {
  title: string
  description: string
  image: string
  reverse?: boolean
  icon: React.ElementType
}) {
  const { ref: textRef, isVisible: textVisible } = useReveal()
  const { ref: imgRef, isVisible: imgVisible } = useReveal()

  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
      {/* Text */}
      <div
        ref={textRef as React.RefObject<HTMLDivElement>}
        className={`flex-1 ${reverse ? 'reveal-right' : 'reveal-left'} ${textVisible ? 'reveal-visible' : ''}`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
          <Icon className="w-3.5 h-3.5" />
          Feature
        </div>
        <h3 className="text-3xl font-bold text-foreground text-balance mb-4">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <Link href="/gyms" className="inline-flex items-center gap-2 mt-6 text-primary text-sm font-medium hover:gap-3 transition-all">
          Learn more <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Image */}
      <div
        ref={imgRef as React.RefObject<HTMLDivElement>}
        className={`flex-1 w-full ${reverse ? 'reveal-left' : 'reveal-right'} ${imgVisible ? 'reveal-visible' : ''}`}
      >
        <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-[0_32px_64px_oklch(0_0_0/0.5)]">
          <Image
            src={image}
            alt={title}
            width={640}
            height={400}
            className="w-full object-cover aspect-[16/10] scale-100 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
        </div>
      </div>
    </div>
  )
}

/* ─── Gym Preview Card ───────────────────────────────────── */
function GymPreviewCard({
  name, location, rating, price, image, delay,
}: {
  name: string; location: string; rating: number; price: number; image: string; delay: number
}) {
  const { ref, isVisible } = useReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`card-surface rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 glow-primary-hover reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="text-sm font-semibold text-foreground">{rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-foreground">{name}</h4>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3" /> {location}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-primary font-bold">₹{price}<span className="text-xs text-muted-foreground font-normal">/mo</span></span>
          <Link href="/gyms">
            <Button size="sm" variant="ghost" className="text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary">View</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Landing Page ──────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  const { ref: statsRef, isVisible: statsVisible } = useReveal({ threshold: 0.2 })

  const GYMS_PREVIEW = [
    { name: 'Gold\'s Gym Malviya Nagar', location: 'Jaipur, Rajasthan', rating: 4.9, price: 2999, image: '/images/gym-1.jpg', delay: 0 },
    { name: 'Corenergy Fitness', location: 'Jaipur, Rajasthan', rating: 4.8, price: 2799, image: '/images/gym-2.jpg', delay: 100 },
    { name: 'M&Y Fitness Club', location: 'Jaipur, Rajasthan', rating: 4.8, price: 3299, image: '/images/gym-3.jpg', delay: 200 },
  ]

  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        {/* Background image + overlay */}
        <div className="absolute inset-0 -z-10">
          <Image src="/images/hero-gym.jpg" alt="Hero gym" fill className="object-cover opacity-20" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          {/* Glow orbs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />
        </div>

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6 animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <Zap className="w-3 h-3" />
          Discover 200+ verified gyms across India
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance max-w-4xl leading-tight animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
          Find your perfect{' '}
          <span className="text-primary relative">
            gym in India
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/40 rounded-full" />
          </span>{' '}
        </h1>

        {/* Sub */}
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
          Fitryx is India's premier platform to discover, compare, and choose the best gyms in your city — with real Indian pricing, verified reviews, and detailed facility information across all major cities.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <Link href="/gyms">
            <Button size="lg" className="bg-primary text-primary-foreground px-8 h-12 text-base glow-primary hover:opacity-90 hover:shadow-[0_0_32px_oklch(0.65_0.22_195/0.4)] transition-all duration-300">
              <Search className="w-4 h-4 mr-2" />
              Browse Gyms
            </Button>
          </Link>
          <Link href="/compare">
            <Button size="lg" variant="ghost" className="px-8 h-12 text-base border border-border/60 hover:border-primary/40 hover:bg-primary/5">
              <BarChart2 className="w-4 h-4 mr-2" />
              Compare Gyms
            </Button>
          </Link>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        ref={statsRef as React.RefObject<HTMLDivElement>}
        className="py-20 border-y border-border/40 bg-[oklch(0.115_0.013_250)]"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {statsVisible && (
            <>
              <StatCard value={200} suffix="+" label="Verified Gyms in India" />
              <StatCard value={25000} suffix="+" label="Active Members" />
              <StatCard value={15} suffix="" label="Major Indian Cities" />
              <StatCard value={96} suffix="%" label="Satisfaction Rate" />
            </>
          )}
          {!statsVisible && (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-12 w-24 mx-auto rounded bg-muted/30 animate-pulse mb-2" />
                  <div className="h-4 w-20 mx-auto rounded bg-muted/20 animate-pulse" />
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* ── Feature Rows ── */}
      <section className="py-24 max-w-7xl mx-auto px-6 flex flex-col gap-28">
        <div className="text-center mb-4 reveal-hidden" style={{ transition: 'none' }}>
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-4">Features</Badge>
          <h2 className="text-4xl font-bold text-foreground text-balance">Everything you need to choose wisely</h2>
        </div>
        <FeatureRow
          title="Discover gyms with smart search"
          description="Search by location, price range, facilities, or rating. Our intelligent filter system helps you pinpoint exactly the gym that matches your lifestyle and budget."
          image="/images/feature-search.jpg"
          icon={Search}
        />
        <FeatureRow
          title="Side-by-side gym comparison"
          description="Compare multiple gyms at once — pricing tiers, amenities, ratings and more. Make informed decisions with our clean comparison interface built for clarity."
          image="/images/feature-compare.jpg"
          reverse
          icon={BarChart2}
        />
      </section>

      {/* ── Featured Gyms ── */}
      <section className="py-24 bg-[oklch(0.115_0.013_250)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-3">Top Picks</Badge>
              <h2 className="text-3xl font-bold text-foreground">Featured gyms</h2>
            </div>
            <Link href="/gyms" className="hidden sm:flex items-center gap-2 text-sm text-primary hover:gap-3 transition-all font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GYMS_PREVIEW.map(gym => (
              <GymPreviewCard key={gym.name} {...gym} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Fitryx ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-4">Why Fitryx</Badge>
          <h2 className="text-4xl font-bold text-foreground text-balance max-w-xl mx-auto">Built for people who take fitness seriously</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every gym goes through our admin verification process before appearing on the platform.' },
            { icon: BarChart2, title: 'Real Pricing', desc: 'Monthly, quarterly, and yearly plans displayed clearly — no hidden fees or surprises.' },
            { icon: Star, title: 'Honest Reviews', desc: 'Ratings from real members who actually use the gym. No inflated or fake reviews.' },
            { icon: Search, title: 'Powerful Filters', desc: 'Filter by amenities, budget, distance, and rating to find the gym that truly fits you.' },
            { icon: Zap, title: 'Instant Compare', desc: 'Compare up to 3 gyms simultaneously with a clear, structured side-by-side view.' },
            { icon: MapPin, title: 'City-wide Coverage', desc: 'Available across 48 cities and growing. Find a great gym wherever you are.' },
          ].map(({ icon: Icon, title, desc }, i) => {
            return (
              <WhyCard key={title} icon={Icon} title={title} desc={desc} delay={i * 80} />
            )
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto card-surface rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <div className="relative">
            <h2 className="text-4xl font-bold text-foreground text-balance mb-4">Ready to find your gym?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join thousands of fitness enthusiasts who use Fitryx to make smarter gym decisions.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary text-primary-foreground px-8 h-12 glow-primary hover:opacity-90">
                  Get started free
                </Button>
              </Link>
              <Link href="/gyms">
                <Button size="lg" variant="ghost" className="px-8 h-12 border border-border/60 hover:border-primary/40">
                  Browse gyms
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function WhyCard({ icon: Icon, title, desc, delay }: { icon: React.ElementType; title: string; desc: string; delay: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`card-surface rounded-2xl p-6 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h4 className="font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}
