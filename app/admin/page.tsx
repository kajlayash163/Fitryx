'use client'

import { useEffect, useState } from 'react'
import { Dumbbell, Users, Star, ShieldCheck, TrendingUp, Medal } from 'lucide-react'
import { useCountUp, useReveal } from '@/hooks/use-reveal'

type Stats = {
  users: { total: number; verified: number }
  gyms: { total: number }
  reviews: { total: number }
  topGyms: { id: number; name: string; rating: number; review_count: number }[]
}

function StatCard({
  icon: Icon, label, value, color, delay,
}: {
  icon: React.ElementType; label: string; value: number; color: string; delay: number
}) {
  const { ref, isVisible } = useReveal()
  const count = useCountUp(value, isVisible, 1400)
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`card-surface rounded-2xl p-6 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold text-foreground tabular-nums">{count.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-surface rounded-2xl p-6 animate-pulse h-32" />
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="card-surface rounded-2xl p-8 text-center">
        <p className="text-muted-foreground text-sm">Failed to load stats. Are you an admin?</p>
      </div>
    )
  }

  const verifiedPct = stats.users.total > 0 ? Math.round((stats.users.verified / stats.users.total) * 100) : 0

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor your platform at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Dumbbell} label="Total Gyms" value={stats.gyms.total} color="bg-primary/10 text-primary" delay={0} />
        <StatCard icon={Users} label="Total Users" value={stats.users.total} color="bg-blue-500/10 text-blue-400" delay={80} />
        <StatCard icon={Star} label="Total Reviews" value={stats.reviews.total} color="bg-amber-500/10 text-amber-400" delay={160} />
        <StatCard icon={ShieldCheck} label="Verified Users" value={stats.users.verified} color="bg-emerald-500/10 text-emerald-400" delay={240} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated Gyms */}
        <div className="card-surface rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
            <Medal className="w-4 h-4 text-primary" /> Top Rated Gyms
          </h3>
          {stats.topGyms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No gyms yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.topGyms.map((gym, i) => (
                <div key={gym.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/30 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-amber-500/20 text-amber-400' :
                    i === 1 ? 'bg-gray-400/20 text-gray-300' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{gym.name}</p>
                    <p className="text-xs text-muted-foreground">{gym.review_count} reviews</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    <span className="text-sm font-semibold text-foreground">{Number(gym.rating).toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verification Status */}
        <div className="card-surface rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> User Verification
          </h3>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted/20" />
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-400"
                  strokeDasharray={`${verifiedPct} ${100 - verifiedPct}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{verifiedPct}%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{stats.users.verified}</span> of {stats.users.total} users verified
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card-surface rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Manage Gyms', href: '/admin/gyms' },
            { label: 'View All Users', href: '/admin/users' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-accent/50 text-foreground border border-border/40 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
