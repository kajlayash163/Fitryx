'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  CheckCircle, Bell, Mail, Lock, MessageSquare, LogOut, 
  Edit2, Calendar, Settings, Shield, Heart, Star,
  ChevronRight, Trash2, ExternalLink, Zap, Award, User
} from 'lucide-react'

type UserData = {
  id: number; name: string; email: string; role: string
  is_verified: boolean; created_at: string; google_id?: string | null
}
type Review = {
  id: number; rating: number; comment: string; created_at: string
  user_id: number; user_name: string
}

/* ═══ Animated counter hook ═══ */
function useAnimatedNumber(target: number, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (target === 0) { setVal(0); return }
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return val
}

/* ═══ Google brand icon ═══ */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

/* ═══ Stagger animation CSS (keyframes injected once) ═══ */
const staggerCSS = `
@keyframes prof-fade-up {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes prof-slide-in {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes prof-glow-pulse {
  0%, 100% { box-shadow: 0 0 30px rgba(45, 212, 191, 0.08); }
  50% { box-shadow: 0 0 50px rgba(45, 212, 191, 0.18); }
}
@keyframes prof-shimmer {
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
}
@keyframes prof-orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.prof-stagger { animation: prof-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both; }
.prof-slide { animation: prof-slide-in 0.5s cubic-bezier(0.16,1,0.3,1) both; }
.prof-glow { animation: prof-glow-pulse 4s ease-in-out infinite; }
.prof-shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(91,244,222,0.06) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: prof-shimmer 3s linear infinite;
}
`

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [favCount, setFavCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [editName, setEditName] = useState(false)
  const [nameVal, setNameVal] = useState('')
  const [changePw, setChangePw] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'reviews'>('overview')

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (!meData.user) { setLoading(false); return }
        setUser(meData.user)
        setNameVal(meData.user.name)

        const favRes = await fetch('/api/favorites')
        const favData = await favRes.json()
        setFavCount(favData.favorites?.length ?? 0)

        const gymsRes = await fetch('/api/gyms')
        const gymsData = await gymsRes.json()
        const allReviews: Review[] = []
        for (const gym of (gymsData.gyms ?? []).slice(0, 20)) {
          const rRes = await fetch(`/api/reviews?gym_id=${gym.id}`)
          const rData = await rRes.json()
          allReviews.push(...(rData.reviews ?? []).filter((r: Review) => r.user_id === meData.user.id))
        }
        setReviews(allReviews)
      } catch { /* empty */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const saveName = async () => {
    if (!nameVal.trim() || nameVal === user?.name) { setEditName(false); return }
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameVal }),
    })
    const data = await res.json()
    if (res.ok) { setUser(data.user); toast.success('Name updated'); setEditName(false) }
    else toast.error(data.error)
    setSaving(false)
  }

  const savePassword = async () => {
    if (newPw.length < 8) { toast.error('Min. 8 characters'); return }
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    })
    const data = await res.json()
    if (res.ok) { toast.success('Password changed'); setChangePw(false); setCurrentPw(''); setNewPw('') }
    else toast.error(data.error)
    setSaving(false)
  }

  const deleteReview = async (id: number) => {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    setReviews(prev => prev.filter(r => r.id !== id))
    toast.success('Review deleted')
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  // Animated numbers
  const animReviews = useAnimatedNumber(reviews.length)
  const animFavs = useAnimatedNumber(favCount)

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#0a0a14]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#5bf4de]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#5bf4de] animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#2dd4bf] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
      </div>
    )
  }

  /* ─── Not signed in ─── */
  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#0a0a14]">
        <div className="text-center max-w-sm prof-stagger">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1e1e2c] to-[#12121e] flex items-center justify-center mx-auto mb-6 border border-[#474753]/20">
            <User className="w-8 h-8 text-[#5bf4de]" />
          </div>
          <h2 className="text-2xl font-bold text-[#e7e3f3] mb-2">Not signed in</h2>
          <p className="text-[#aca9b8] text-sm mb-8">Sign in to manage your profile and reviews</p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-[#2dd4bf] to-[#0d9488] text-[#0a0a14] hover:opacity-90 px-10 h-11 rounded-2xl font-bold text-sm shadow-[0_8px_32px_rgba(45,212,191,0.2)]">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
  const hasGoogle = !!user.google_id
  const hasPassword = true

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Zap },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'reviews' as const, label: 'Reviews', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#e7e3f3] pb-24 font-['Inter',sans-serif]">
      <style dangerouslySetInnerHTML={{ __html: staggerCSS }} />

      {/* ═══ AMBIENT BG EFFECTS ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#2dd4bf]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-[#0d9488]/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* ═══ HERO BANNER ═══ */}
      <div className="relative w-full pt-16">
        <div className="relative h-[200px] md:h-[260px] overflow-hidden">
          {/* Animated gradient mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d9488]/40 via-[#0a0a14] to-[#1e1e2c]" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSg5MSwyNDQsMjIyLDAuMSkiLz48L3N2Zz4=')] bg-repeat" style={{ backgroundSize: '40px 40px' }} />
          </div>
          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a14] to-transparent" />
          {/* Orbiting ring decoration */}
          <div className="absolute top-12 right-[10%] w-32 h-32 md:w-48 md:h-48 rounded-full border border-[#5bf4de]/10 opacity-50" style={{ animation: 'prof-orbit 20s linear infinite' }} />
          <div className="absolute top-20 right-[12%] w-24 h-24 md:w-36 md:h-36 rounded-full border border-[#5bf4de]/5" style={{ animation: 'prof-orbit 15s linear infinite reverse' }} />
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="relative z-10 -mt-24 md:-mt-28 px-4 md:px-6 max-w-4xl mx-auto">

        {/* ═══ PROFILE CARD ═══ */}
        <div className="prof-stagger relative rounded-3xl bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#474753]/15 overflow-hidden prof-glow" style={{ animationDelay: '0.1s' }}>
          {/* Shimmer bar */}
          <div className="h-[2px] w-full prof-shimmer" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#2dd4bf] to-[#0d9488] flex items-center justify-center text-[#0a0a14] text-2xl md:text-3xl font-bold shadow-[0_12px_40px_rgba(45,212,191,0.15)] group-hover:shadow-[0_12px_40px_rgba(45,212,191,0.3)] transition-shadow duration-500">
                  {initials}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#10b981] rounded-full border-[3px] border-[#0f0f1a]" />
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {editName ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Input
                        value={nameVal}
                        onChange={e => setNameVal(e.target.value)}
                        className="h-10 bg-[#12121e] border-[#474753]/40 text-white font-semibold max-w-[220px] rounded-xl focus:border-[#5bf4de]/50 focus:ring-1 focus:ring-[#5bf4de]/20"
                        autoFocus
                        onKeyDown={e => e.key === 'Enter' && saveName()}
                      />
                      <button onClick={saveName} disabled={saving} className="text-sm text-[#5bf4de] font-bold hover:underline whitespace-nowrap">Save</button>
                      <button onClick={() => { setEditName(false); setNameVal(user.name) }} className="text-sm text-[#757481] hover:text-[#aca9b8]">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight truncate">{user.name}</h1>
                      <button onClick={() => setEditName(true)} className="text-[#5bf4de]/60 hover:text-[#5bf4de] transition-colors p-1 rounded-lg hover:bg-[#5bf4de]/10" title="Edit name">
                        <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                      {user.is_verified && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
                          <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
                          <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">Verified</span>
                        </div>
                      )}
                      {user.role === 'admin' && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5bf4de]/10 border border-[#5bf4de]/20">
                          <Award className="w-3.5 h-3.5 text-[#5bf4de]" />
                          <span className="text-[10px] font-bold text-[#5bf4de] uppercase tracking-wider">Admin</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[#757481] text-sm mt-1">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {joinedDate}</span>
                </div>

                {!user.is_verified && (
                  <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`} className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-medium text-amber-400 bg-amber-400/8 border border-amber-400/15 px-3 py-1 rounded-lg hover:bg-amber-400/15 transition-colors">
                    Unverified — Verify now <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Logout (desktop) */}
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#757481] border border-[#474753]/20 bg-[#12121e]/50 hover:text-[#ff716c] hover:border-[#ff716c]/20 hover:bg-[#ff716c]/5 transition-all duration-300 uppercase tracking-wider"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </div>
        </div>

        {/* ═══ STAT CARDS ═══ */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-5 md:mt-6">
          {[
            { label: 'Reviews', value: animReviews, icon: Star, color: '#f59e0b', delay: '0.2s' },
            { label: 'Saved Gyms', value: animFavs, icon: Heart, color: '#ef4444', delay: '0.3s' },
            { label: 'Status', value: user.role, icon: Award, color: '#5bf4de', delay: '0.4s', isStr: true },
          ].map(stat => (
            <div
              key={stat.label}
              className="prof-stagger group relative rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-sm border border-[#474753]/15 p-4 md:p-5 overflow-hidden hover:border-[#474753]/30 transition-all duration-500"
              style={{ animationDelay: stat.delay }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at 50% 120%, ${stat.color}08 0%, transparent 70%)` }} />
              <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
              <div className="text-2xl md:text-3xl font-bold text-white tabular-nums capitalize">{stat.isStr ? stat.value : stat.value}</div>
              <div className="text-[11px] text-[#757481] font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ═══ NAV TABS ═══ */}
        <div className="mt-8 md:mt-10 mb-6 flex items-center gap-1 p-1 rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-sm border border-[#474753]/15 prof-stagger" style={{ animationDelay: '0.4s' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#5bf4de]/10 text-[#5bf4de] shadow-[0_0_20px_rgba(45,212,191,0.08)]'
                  : 'text-[#757481] hover:text-[#aca9b8]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══ TAB CONTENT ═══ */}
        <div className="space-y-4">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-4 prof-stagger" style={{ animationDelay: '0.1s' }}>
              {/* Google Account */}
              <div className="rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-sm border border-[#474753]/15 p-5 prof-slide" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg">
                      <GoogleIcon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Google Account</p>
                      <p className="text-xs text-[#757481] mt-0.5">{hasGoogle ? user.email : 'Not connected'}</p>
                    </div>
                  </div>
                  {hasGoogle ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/15">
                      <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[11px] font-bold text-[#10b981] uppercase tracking-wider">Linked</span>
                    </div>
                  ) : (
                    <a href="/api/auth/google" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-[#5bf4de] bg-[#5bf4de]/10 border border-[#5bf4de]/20 hover:bg-[#5bf4de]/15 transition-all">
                      Connect <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/favorites" className="prof-slide group flex items-center gap-4 rounded-2xl bg-[#0f0f1a]/60 border border-[#474753]/15 p-5 hover:border-[#474753]/30 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#ef4444]/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#ef4444]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Saved Gyms</p>
                    <p className="text-xs text-[#757481]">{favCount} gyms saved</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#474753] group-hover:text-[#757481] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link href="/gyms" className="prof-slide group flex items-center gap-4 rounded-2xl bg-[#0f0f1a]/60 border border-[#474753]/15 p-5 hover:border-[#474753]/30 transition-all duration-300" style={{ animationDelay: '0.25s' }}>
                  <div className="w-10 h-10 rounded-xl bg-[#5bf4de]/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#5bf4de]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">Discover Gyms</p>
                    <p className="text-xs text-[#757481]">Browse & compare</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#474753] group-hover:text-[#757481] group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <div className="space-y-4 prof-stagger" style={{ animationDelay: '0.1s' }}>
              {/* Password */}
              <div className="rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-sm border border-[#474753]/15 p-5 prof-slide" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-[#f59e0b]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Password</p>
                      <p className="text-xs text-[#757481]">{changePw ? 'Change your password' : '••••••••••'}</p>
                    </div>
                  </div>
                  {!changePw && (
                    <button onClick={() => setChangePw(true)} className="text-[11px] font-bold uppercase tracking-wider text-[#5bf4de] px-4 py-2 bg-[#5bf4de]/10 border border-[#5bf4de]/20 rounded-xl hover:bg-[#5bf4de]/15 transition-all active:scale-95">
                      Change
                    </button>
                  )}
                </div>
                {changePw && (
                  <div className="space-y-3 mt-5 ml-[52px] animate-in fade-in slide-in-from-top-2 duration-300">
                    {hasPassword && (
                      <Input type="password" placeholder="Current password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                        className="h-10 bg-[#12121e] border-[#474753]/30 text-white rounded-xl focus:border-[#5bf4de]/50" />
                    )}
                    <Input type="password" placeholder="New password (min. 8 characters)" value={newPw} onChange={e => setNewPw(e.target.value)}
                      className="h-10 bg-[#12121e] border-[#474753]/30 text-white rounded-xl focus:border-[#5bf4de]/50" />
                    <div className="flex items-center gap-2 pt-1">
                      <Button onClick={savePassword} disabled={saving} className="bg-gradient-to-r from-[#2dd4bf] to-[#0d9488] text-[#0a0a14] h-9 px-5 rounded-xl text-xs font-bold hover:opacity-90 shadow-[0_4px_16px_rgba(45,212,191,0.15)]">
                        {saving ? 'Saving...' : 'Update Password'}
                      </Button>
                      <button onClick={() => { setChangePw(false); setCurrentPw(''); setNewPw('') }} className="text-xs text-[#757481] hover:text-[#aca9b8] px-3 py-2">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Session Info */}
              <div className="rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-sm border border-[#474753]/15 p-5 prof-slide" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Active Session</p>
                    <p className="text-xs text-[#757481]">Logged in • Sessions rotate on every login for security</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-sm border border-[#474753]/15 p-5 prof-slide" style={{ animationDelay: '0.25s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Email Notifications</p>
                    <p className="text-xs text-[#757481]">Receive updates about your reviews</p>
                  </div>
                  <div className="text-[11px] font-bold text-[#757481] uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#12121e] border border-[#474753]/20">Soon</div>
                </div>
              </div>
            </div>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'reviews' && (
            <div className="space-y-3 prof-stagger" style={{ animationDelay: '0.1s' }}>
              {reviews.length === 0 ? (
                <div className="rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-sm border border-[#474753]/15 p-10 text-center prof-slide">
                  <div className="w-14 h-14 rounded-2xl bg-[#1e1e2c] flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-6 h-6 text-[#474753]" />
                  </div>
                  <p className="text-sm text-[#757481] mb-5">No reviews yet. Explore gyms and share your experience!</p>
                  <Link href="/gyms">
                    <Button className="bg-gradient-to-r from-[#2dd4bf] to-[#0d9488] text-[#0a0a14] h-10 px-8 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(45,212,191,0.15)]">
                      Explore Gyms
                    </Button>
                  </Link>
                </div>
              ) : (
                reviews.map((review, i) => (
                  <div key={review.id} className="prof-slide group rounded-2xl bg-[#0f0f1a]/60 backdrop-blur-sm border border-[#474753]/15 p-5 hover:border-[#474753]/25 transition-all duration-300 relative" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                    {/* Delete button */}
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="absolute top-4 right-4 p-2 rounded-lg text-[#474753] opacity-0 group-hover:opacity-100 hover:text-[#ff716c] hover:bg-[#ff716c]/10 transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-start gap-4">
                      {/* Star badge */}
                      <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-[#f59e0b]">{review.rating}</span>
                      </div>

                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#474753]'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[#aca9b8] leading-relaxed line-clamp-2">"{review.comment}"</p>
                        <p className="text-[10px] text-[#474753] mt-2 font-bold uppercase tracking-widest">
                          {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ═══ MOBILE SIGN OUT ═══ */}
        <div className="flex justify-center mt-10 sm:hidden">
          <button onClick={logout} className="flex items-center gap-2 text-[#757481] hover:text-[#ff716c] transition-colors font-bold py-3 px-8 rounded-2xl bg-[#ff716c]/5 hover:bg-[#ff716c]/10 border border-[#ff716c]/15 active:scale-95 duration-150 text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </main>
    </div>
  )
}
