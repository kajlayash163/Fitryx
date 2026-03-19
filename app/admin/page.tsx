'use client'

import { useEffect, useState } from 'react'
import { Dumbbell, Users, ShieldCheck, Clock, TrendingUp } from 'lucide-react'
import { useCountUp, useReveal } from '@/hooks/use-reveal'

type Stats = {
  totalGyms: number
  verifiedGyms: number
  pendingGyms: number
  totalUsers: number
  gymGrowth: { month: string; count: number }[]
  userGrowth: { month: string; count: number }[]
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
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => setStats(d))
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

  if (!stats) return null

  return (
    <div className="flex flex-col gap-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor your platform at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Dumbbell} label="Total Gyms" value={stats.totalGyms} color="bg-primary/10 text-primary" delay={0} />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-500/10 text-blue-400" delay={80} />
        <StatCard icon={ShieldCheck} label="Verified Gyms" value={stats.verifiedGyms} color="bg-emerald-500/10 text-emerald-400" delay={160} />
        <StatCard icon={Clock} label="Pending Approval" value={stats.pendingGyms} color="bg-amber-500/10 text-amber-400" delay={240} />
      </div>

      {/* Recent activity placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">Gym Registrations (6mo)</h3>
          {stats.gymGrowth.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              No data yet — add some gyms to see growth
            </div>
          ) : (
            <div className="flex items-end gap-3 h-32">
              {stats.gymGrowth.map((d, i) => {
                const max = Math.max(...stats.gymGrowth.map(x => Number(x.count)), 1)
                const pct = (Number(d.count) / max) * 100
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-full rounded-t-lg bg-primary/20 hover:bg-primary/30 transition-colors relative overflow-hidden" style={{ height: `${pct}%`, minHeight: 4 }}>
                      <div className="absolute inset-0 bg-primary/40 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.month}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="card-surface rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">User Registrations (6mo)</h3>
          {stats.userGrowth.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              No data yet — registrations will appear here
            </div>
          ) : (
            <div className="flex items-end gap-3 h-32">
              {stats.userGrowth.map((d, i) => {
                const max = Math.max(...stats.userGrowth.map(x => Number(x.count)), 1)
                const pct = (Number(d.count) / max) * 100
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-full rounded-t-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors" style={{ height: `${pct}%`, minHeight: 4 }} />
                    <span className="text-xs text-muted-foreground">{d.month}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card-surface rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add New Gym', href: '/admin/gyms' },
            { label: 'Manage Users', href: '/admin/users' },
            { label: 'View Analytics', href: '/admin/analytics' },
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
