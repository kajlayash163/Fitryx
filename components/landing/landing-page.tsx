'use client'

import { useEffect, useRef, useState, useCallback, type MouseEvent as ReactMouseEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Search, BarChart2, Star, MapPin, ShieldCheck, Zap, Sparkles, Clock, Shield, Users, Dumbbell, Trophy, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReveal, useCountUp } from '@/hooks/use-reveal'

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */
function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.unobserve(el) } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return { ref, vis }
}

function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null)
  const handleMove = useCallback((e: ReactMouseEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`
  }, [])
  const handleLeave = useCallback(() => {
    const el = ref.current; if (!el) return
    el.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)'
  }, [])
  return { ref, handleMove, handleLeave }
}

/* ═══════════════════════════════════════════
   WORD REVEAL — stagger, but NO overflow:hidden
   ═══════════════════════════════════════════ */
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const { ref, vis } = useScrollReveal(delay)
  return (
    <span ref={ref} className="inline">
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block mr-[0.28em] transition-all duration-700"
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? 'translateY(0)' : 'translateY(40px)',
            filter: vis ? 'blur(0px)' : 'blur(8px)',
            transitionDelay: `${delay + i * 80}ms`,
          }}>{w}</span>
      ))}
    </span>
  )
}

/* ═══════════════════════════════════════════
   STAT
   ═══════════════════════════════════════════ */
function Stat({ value, suffix, label, d }: { value: number; suffix: string; label: string; d: number }) {
  const { ref: rRef, isVisible } = useReveal()
  const count = useCountUp(value, isVisible)
  const { ref: sRef, vis } = useScrollReveal(d)
  return (
    <div ref={(n) => {
      (rRef as React.MutableRefObject<HTMLDivElement | null>).current = n;
      (sRef as React.MutableRefObject<HTMLDivElement | null>).current = n
    }} className={`text-center transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <p className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
        {count.toLocaleString()}{suffix}
      </p>
      <div className="w-8 h-0.5 bg-border mx-auto mt-3 mb-2" />
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════
   FEATURE with 3D tilt
   ═══════════════════════════════════════════ */
function Feature({ title, desc, img, rev, icon: Icon, num }: {
  title: string; desc: string; img: string; rev?: boolean; icon: React.ElementType; num: string
}) {
  const { ref: tRef, vis: tVis } = useScrollReveal()
  const { ref: iRef, vis: iVis } = useScrollReveal(150)
  const tilt = use3DTilt()
  return (
    <div className={`flex flex-col ${rev ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>
      <div ref={tRef} className={`flex-1 transition-all duration-700 ${tVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <span className="text-7xl font-black text-muted/30 block mb-4 select-none">{num}</span>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-muted-foreground text-xs font-medium mb-4">
          <Icon className="w-3.5 h-3.5 text-primary" /> Feature
        </div>
        <h3 className="text-3xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] mb-5">{title}</h3>
        <p className="text-muted-foreground text-lg leading-relaxed">{desc}</p>
        <Link href="/gyms" className="inline-flex items-center gap-2 mt-8 text-primary text-sm font-medium group">
          Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>
      <div ref={(n) => {
        (iRef as React.MutableRefObject<HTMLDivElement | null>).current = n;
        (tilt.ref as React.MutableRefObject<HTMLDivElement | null>).current = n
      }}
        className={`flex-1 w-full transition-all duration-700 cursor-default ${iVis ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
        onMouseMove={tilt.handleMove} onMouseLeave={tilt.handleLeave}
        style={{ transition: 'transform 0.15s ease-out, opacity 0.7s ease, translate 0.7s ease' }}>
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-border/30">
          <Image src={img} alt={title} width={640} height={400} className="w-full object-cover aspect-[16/10]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   GYM CARD — matches /gyms layout
   ═══════════════════════════════════════════ */
function GymPreviewCard({ name, location, rating, reviewCount, price, image, description, facilities, verified, openingHours, womenSafety, idx }: {
  name: string; location: string; rating: number; reviewCount: number; price: number; image: string; description: string; facilities: string[]; verified: boolean; openingHours: string; womenSafety: number | null; idx: number
}) {
  const { ref, vis } = useScrollReveal(idx * 100)
  const tilt = use3DTilt()
  return (
    <div ref={(n) => {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
      (tilt.ref as React.MutableRefObject<HTMLDivElement | null>).current = n
    }} onMouseMove={tilt.handleMove} onMouseLeave={tilt.handleLeave}
      className={`card-surface rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-500 flex flex-col h-full ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transition: 'transform 0.15s ease-out, opacity 0.7s ease, translate 0.7s ease', transitionDelay: `${idx * 100}ms` }}>
      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
        <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        {verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
            <ShieldCheck className="w-3 h-3 text-primary" /><span className="text-xs text-primary font-medium">Verified</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1">{name}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5"><MapPin className="w-3 h-3 shrink-0" /> {location}</p>
        {openingHours && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-3 h-3 shrink-0" /> {openingHours}</p>}
        <p className="text-sm text-muted-foreground mt-2.5 line-clamp-2">{description}</p>
        {womenSafety && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <Shield className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">Women Safety: {womenSafety.toFixed(1)}/5</span>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {facilities.slice(0, 3).map(f => <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground border border-border/40">{f}</span>)}
          {facilities.length > 3 && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground border border-border/40">+{facilities.length - 3}</span>}
        </div>
        <div className="flex items-center justify-between border-t border-border/40 mt-auto pt-5">
          <div>
            <span className="text-xl font-bold text-primary">₹{price}</span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/compare?ids=1"><Button size="sm" variant="ghost" className="h-8 px-2 hover:bg-primary/10 hover:text-primary"><BarChart2 className="w-3.5 h-3.5" /></Button></Link>
            <Link href="/gyms"><Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 h-8">View <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   WHY CARD
   ═══════════════════════════════════════════ */
function WhyCard({ icon: Icon, title, desc, d }: { icon: React.ElementType; title: string; desc: string; d: number }) {
  const { ref, vis } = useScrollReveal(d)
  const tilt = use3DTilt()
  return (
    <div ref={(n) => {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
      (tilt.ref as React.MutableRefObject<HTMLDivElement | null>).current = n
    }} onMouseMove={tilt.handleMove} onMouseLeave={tilt.handleLeave}
      className={`rounded-2xl p-7 card-surface hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transition: 'transform 0.15s ease-out, opacity 0.7s ease, translate 0.7s ease, border-color 0.3s ease, box-shadow 0.3s ease', transitionDelay: `${d}ms` }}>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-primary/10 border border-primary/15">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h4 className="font-semibold text-foreground text-lg mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MARQUEE
   ═══════════════════════════════════════════ */
function Marquee() {
  const items = ['Gold\'s Gym', 'Anytime Fitness', 'Corenergy', 'Multifit', 'The Shredded Club', 'Innovana', 'Rock The Gym', 'Plus Fitness', 'Infinity Fitness']
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden py-6 border-y border-border/30 bg-background/50">
      <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 mx-8 text-muted-foreground/40 text-sm font-medium">
            <Dumbbell className="w-4 h-4 text-primary/30" />{item}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const { ref: fhRef, vis: fhVis } = useScrollReveal()
  const { ref: whRef, vis: whVis } = useScrollReveal()
  const { ref: ctaRef, vis: ctaVis } = useScrollReveal()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h, { passive: true })
    return () => window.removeEventListener('mousemove', h)
  }, [])

  const GYMS = [
    { name: "Gold's Gym Malviya Nagar", location: 'Malviya Nagar, Jaipur, Rajasthan', rating: 4.9, reviewCount: 342, price: 2999, image: '/images/gym-weights.png', description: 'The Mecca of Bodybuilding — 11,000 sq ft spread across 3 floors with elite equipment.', facilities: ['Free Weights', 'Cardio', 'Personal Training', 'Lockers'], verified: true, openingHours: '5:30 AM - 10:30 PM', womenSafety: 4.2 },
    { name: 'Corenergy Fitness', location: 'Vaishali Nagar, Jaipur, Rajasthan', rating: 5.0, reviewCount: 256, price: 2799, image: '/images/gym-cardio.png', description: 'Founded by a physiotherapist, providing state-of-the-art equipment and guidance.', facilities: ['Free Weights', 'Cardio', 'Strength Training', 'Yoga'], verified: true, openingHours: '5:00 AM - 10:00 PM', womenSafety: 4.0 },
    { name: 'Multifit Vaishali Nagar', location: 'Vaishali Nagar, Jaipur, Rajasthan', rating: 4.7, reviewCount: 189, price: 3539, image: '/images/gym-crossfit.png', description: 'Multi-activity fitness center with CrossFit, swimming, and group sessions.', facilities: ['CrossFit', 'Pool', 'Yoga', 'Personal Training'], verified: true, openingHours: '6:00 AM - 10:00 PM', womenSafety: 4.5 },
  ]

  return (
    <main className="overflow-x-hidden">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Mouse spotlight */}
        {mounted && <div className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, var(--glow-primary), transparent 40%)` }} />}

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-[0.12] blur-[140px] apple-float bg-primary" />
          <div className="absolute bottom-1/4 left-[15%] w-[500px] h-[350px] rounded-full opacity-[0.06] blur-[120px] apple-float bg-[oklch(0.55_0.2_280)]" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[60%] right-[10%] w-[350px] h-[250px] rounded-full opacity-[0.05] blur-[100px] apple-float bg-[oklch(0.6_0.2_340)]" style={{ animationDelay: '4s' }} />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-secondary/80 backdrop-blur-md text-xs font-medium mb-10 text-muted-foreground animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            India&apos;s #1 Gym Discovery Platform
          </div>

          {/* TITLE — word reveal with blur-in, shimmer on second line */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-extrabold text-foreground leading-[0.95] tracking-[-0.04em]">
            <WordReveal text="Find your" delay={200} />
            <br />
            <span className="apple-shimmer-text inline-block animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              perfect gym
            </span>
          </h1>

          {/* Sub */}
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light animate-fade-up" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
            Discover, compare, and choose the best gyms in your city — with real pricing, verified reviews, and complete facility details.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 animate-fade-up" style={{ animationDelay: '1.1s', animationFillMode: 'both' }}>
            <Link href="/gyms">
              <Button size="lg" className="h-14 px-12 text-base font-semibold rounded-2xl bg-primary text-primary-foreground transition-all duration-500 hover:shadow-[0_0_50px_var(--glow-primary)] hover:scale-[1.03] active:scale-[0.98]">
                <Search className="w-4 h-4 mr-2" /> Browse Gyms
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="ghost" className="h-14 px-12 text-base font-semibold rounded-2xl border border-border text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
                <BarChart2 className="w-4 h-4 mr-2" /> Compare Gyms
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/30 animate-fade-up" style={{ animationDelay: '1.3s', animationFillMode: 'both' }}>
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <Marquee />

      {/* ═══════════ STATS ═══════════ */}
      <section className="py-28 relative border-b border-border/20">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <Stat value={200} suffix="+" label="Verified Gyms" d={0} />
          <Stat value={25000} suffix="+" label="Active Members" d={100} />
          <Stat value={15} suffix="" label="Indian Cities" d={200} />
          <Stat value={96} suffix="%" label="Satisfaction" d={300} />
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="py-36 max-w-7xl mx-auto px-6 flex flex-col gap-40">
        <div ref={fhRef} className={`text-center transition-all duration-700 ${fhVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-xs tracking-[0.3em] uppercase font-medium mb-5 text-primary">Features</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
            Everything you need<br className="hidden sm:block" /> to choose wisely
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">Powerful tools designed to make finding and comparing gyms effortless.</p>
        </div>
        <Feature title="Discover gyms with smart search" desc="Search by location, price range, facilities, or rating. Our intelligent filter system helps you find exactly the gym that matches your lifestyle and budget." img="/images/gym-weights.png" icon={Search} num="01" />
        <Feature title="Side-by-side gym comparison" desc="Compare multiple gyms at once — pricing, amenities, ratings and more. Make informed decisions with our structured comparison view." img="/images/gym-cardio.png" rev icon={BarChart2} num="02" />
        <Feature title="Track your fitness journey" desc="Use our built-in calculators for BMI, calories, ideal weight, and more. Calculate your 1RM, water intake, and body fat — all in one place." img="/images/gym-functional.png" icon={TrendingUp} num="03" />
      </section>

      {/* ═══════════ FEATURED GYMS ═══════════ */}
      <section className="py-36 border-y border-border/20 bg-[oklch(0.09_0.01_250)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase font-medium mb-3 text-primary">Top Picks</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Featured gyms in Jaipur</h2>
              <p className="mt-2 text-muted-foreground text-sm">Handpicked top-rated gyms with verified reviews</p>
            </div>
            <Link href="/gyms" className="hidden sm:flex items-center gap-2 text-sm text-primary font-medium group">
              View all gyms <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GYMS.map((gym, i) => <GymPreviewCard key={gym.name} {...gym} idx={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY FITRYX ═══════════ */}
      <section className="py-36 max-w-7xl mx-auto px-6">
        <div ref={whRef} className={`text-center mb-20 transition-all duration-700 ${whVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-xs tracking-[0.3em] uppercase font-medium mb-5 text-primary">Why Fitryx</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight max-w-3xl mx-auto leading-[1.1]">Built for people who take fitness seriously</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every gym is admin-verified before appearing on our platform.' },
            { icon: BarChart2, title: 'Real Pricing', desc: 'Monthly, quarterly, and yearly plans — transparent, no hidden fees.' },
            { icon: Star, title: 'Honest Reviews', desc: 'Ratings from real members who actually use the gym.' },
            { icon: Search, title: 'Powerful Filters', desc: 'Filter by amenities, budget, distance, rating — find your match.' },
            { icon: Zap, title: 'Instant Compare', desc: 'Compare up to 3 gyms side-by-side in one clean view.' },
            { icon: MapPin, title: 'City Coverage', desc: '15+ cities and growing. Find a great gym wherever you are.' },
          ].map(({ icon, title, desc }, i) => <WhyCard key={title} icon={icon} title={title} desc={desc} d={i * 80} />)}
        </div>
      </section>

      {/* ═══════════ CTA — animated gradient border ═══════════ */}
      <section className="py-36 px-6">
        <div ref={ctaRef} className={`max-w-4xl mx-auto relative rounded-[2rem] p-[1px] transition-all duration-700 ${ctaVis ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
          <div className="absolute inset-0 rounded-[2rem] opacity-50" style={{ background: 'linear-gradient(135deg, var(--primary), oklch(0.55 0.2 280), oklch(0.6 0.2 340), var(--primary))', backgroundSize: '300% 300%', animation: 'gradientShift 6s ease infinite' }} />
          <div className="relative rounded-[calc(2rem-1px)] bg-background p-16 md:p-20 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-[120px] opacity-10 bg-primary" />
            <div className="relative">
              <Trophy className="w-10 h-10 mx-auto mb-6 text-muted-foreground/20" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6 leading-[1.1]">Ready to find<br />your perfect gym?</h2>
              <p className="text-muted-foreground mb-12 max-w-md mx-auto text-lg font-light">Join thousands of fitness enthusiasts making smarter gym decisions.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register"><Button size="lg" className="h-14 px-12 font-semibold rounded-2xl bg-primary text-primary-foreground transition-all duration-500 hover:shadow-[0_0_50px_var(--glow-primary)] hover:scale-[1.03]">Get started free</Button></Link>
                <Link href="/gyms"><Button size="lg" variant="ghost" className="h-14 px-12 font-semibold rounded-2xl border border-border text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">Browse gyms</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
