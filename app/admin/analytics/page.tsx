'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, Users, ShieldCheck, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { useReveal, useCountUp } from '@/hooks/use-reveal'

type Stats = {
  totalGyms: number
  verifiedGyms: number
  pendingGyms: number
  totalUsers: number
  gymGrowth: { month: string; count: number }[]
  userGrowth: { month: string; count: number }[]
}

function KpiCard({
  icon: Icon, label, value, sub, color, trend, delay,
}: {
  icon: React.ElementType
  label: string
  value: number
  sub?: string
  color: string
  trend?: 'up' | 'down'
  delay: number
}) {
  const { ref, isVisible } = useReveal()
  const count = useCountUp(value, isVisible, 1600)
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
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-destructive'}`}>
            {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'up' ? 'Active' : 'Low'}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-foreground tabular-nums">{count.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  )
}

function BarChart({
  data, color, label,
}: {
  data: { month: string; count: number }[]
  color: string
  label: string
}) {
  const { ref, isVisible } = useReveal()
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-36 text-sm text-muted-foreground">
        No data yet
      </div>
    )
  }
  const max = Math.max(...data.map(d => Number(d.count)), 1)
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex items-end gap-2 h-36">
      {data.map((d, i) => {
        const pct = (Number(d.count) / max) * 100
        return (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1 group">
            <div className="relative w-full flex items-end justify-center" style={{ height: '112px' }}>
              {/* tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border/60 rounded-lg px-2 py-1 text-xs text-foreground whitespace-nowrap z-10 pointer-events-none">
                {d.count} {label.toLowerCase()}
              </div>
              <div
                className={`w-full rounded-t-lg ${color} transition-all duration-700`}
                style={{
                  height: isVisible ? `${pct}%` : '0%',
                  minHeight: isVisible ? 4 : 0,
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{d.month}</span>
          </div>
        )
      })}
    </div>
  )
}

function RatioBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const { ref, isVisible } = useReveal()
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">{value} <span className="text-muted-foreground/60">({pct}%)</span></span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: isVisible ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
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
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 rounded-lg bg-muted/30 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="card-surface rounded-2xl h-36 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="card-surface rounded-2xl h-56 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const verifiedPct = stats.totalGyms > 0 ? Math.round((stats.verifiedGyms / stats.totalGyms) * 100) : 0

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform-wide metrics and growth data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          icon={Dumbbell} label="Total Gyms" value={stats.totalGyms}
          sub="All listings" color="bg-primary/10 text-primary"
          trend="up" delay={0}
        />
        <KpiCard
          icon={Users} label="Total Users" value={stats.totalUsers}
          sub="Registered accounts" color="bg-blue-500/10 text-blue-400"
          trend="up" delay={80}
        />
        <KpiCard
          icon={ShieldCheck} label="Verified" value={stats.verifiedGyms}
          sub={`${verifiedPct}% of all gyms`} color="bg-emerald-500/10 text-emerald-400"
          delay={160}
        />
        <KpiCard
          icon={Clock} label="Pending" value={stats.pendingGyms}
          sub="Awaiting review" color="bg-amber-500/10 text-amber-400"
          trend={stats.pendingGyms > 0 ? 'down' : undefined}
          delay={240}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Gym Registrations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
          <BarChart data={stats.gymGrowth} color="bg-primary/40 hover:bg-primary/60" label="Gyms" />
        </div>

        <div className="card-surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">User Registrations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          </div>
          <BarChart data={stats.userGrowth} color="bg-blue-500/40 hover:bg-blue-500/60" label="Users" />
        </div>
      </div>

      {/* Ratio & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gym breakdown */}
        <div className="card-surface rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-6">Gym Verification Status</h3>
          <div className="flex flex-col gap-5">
            <RatioBar label="Verified Gyms" value={stats.verifiedGyms} total={stats.totalGyms} color="bg-emerald-400" />
            <RatioBar label="Pending Gyms" value={stats.pendingGyms} total={stats.totalGyms} color="bg-amber-400" />
          </div>
          <div className="mt-6 pt-5 border-t border-border/40">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Verification rate</span>
              <span className="text-emerald-400 font-semibold">{verifiedPct}%</span>
            </div>
          </div>
        </div>

        {/* Platform health */}
        <div className="card-surface rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-6">Platform Health</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Gyms per User', value: stats.totalUsers > 0 ? (stats.totalGyms / stats.totalUsers).toFixed(2) : '–' },
              { label: 'Verification Rate', value: `${verifiedPct}%` },
              { label: 'Pending Reviews', value: stats.pendingGyms },
              { label: 'Active Listings', value: stats.verifiedGyms },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/20 rounded-xl p-4">
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
