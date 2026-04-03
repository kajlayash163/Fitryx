'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  CheckCircle,
  Bell,
  Mail,
  Lock,
  MessageSquare,
  LogOut,
  Edit2,
  Calendar,
  Settings
} from 'lucide-react'

type UserData = {
  id: number; name: string; email: string; role: string
  is_verified: boolean; created_at: string; google_id?: string | null
}
type Review = {
  id: number; rating: number; comment: string; created_at: string
  user_id: number; user_name: string
}

/* ═══ SVG Icons / Brand ═══ */
const Ico = {
  verified: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#5bf4de]">
      <path d="M10 1l2.39 2.06 3.07.52-.14 3.1L17.5 9.5l-2.18 2.82.14 3.1-3.07.52L10 18l-2.39-2.06-3.07-.52.14-3.1L2.5 9.5l2.18-2.82-.14-3.1 3.07-.52L10 1z" fill="currentColor"/>
      <path d="M7.5 10l2 2 3.5-4" stroke="#0d0d17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  google: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 .5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.1l-4.2 2.4.8-4.7L1.2 5.5l4.7-.7L8 .5z"/>
    </svg>
  ),
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [favCount, setFavCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Edit states
  const [editName, setEditName] = useState(false)
  const [nameVal, setNameVal] = useState('')
  const [changePw, setChangePw] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [saving, setSaving] = useState(false)

  // Preferences (Local state for UI)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(false)

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

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#0d0d17]">
        <div className="w-8 h-8 border-2 border-[#5bf4de] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  /* ─── Not signed in ─── */
  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#0d0d17]">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#1e1e2c] flex items-center justify-center mx-auto mb-5 text-[#aca9b8] text-2xl">?</div>
          <h2 className="text-xl font-bold text-[#e7e3f3] mb-2">Not signed in</h2>
          <p className="text-[#aca9b8] text-sm mb-6">Sign in to view your profile</p>
          <Link href="/login">
            <Button className="bg-[#5bf4de] text-[#00443c] hover:bg-[#48e5d0] px-8 h-10 rounded-xl font-bold">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
  const hasGoogle = !!user.google_id
  const hasPassword = true // from API logic

  return (
    <div className="min-h-screen bg-[#0d0d17] text-[#e7e3f3] pb-24 font-sans">
      
      {/* Hero Section */}
      {/* We add mt-16 to ensure it sits slightly below the global navbar, but still looks continuous */}
      <div className="relative w-full h-[240px] md:h-[280px] bg-gradient-to-br from-[#11c9b4]/50 to-[#0d0d17] overflow-hidden mt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#5bf4de]/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1UdshkqFmei6ZeMQH9UIcAgtc9dwnS_-mrY5zgwlHqtB4vUaSd66aqvBPvnuul8suHv8qfAxI4ZeevLpwahsYE2Mu0bvqkpoBsJKZgXRJkTiRp9xRMueHk6poyjT2UozXyg2lnG94Mo_TNifiL58gWLPf9l1DPX3v85JVrnUCbFRFRydlMZxzj5F6V3mr1-vkzsAUSQvBuuyZaqc-FDlMwt3CdWhXxNir91EGLihe4Z90gVnnMMggWgW4AJgxNSrfLYveWVCF5Bph')" }}></div>
      </div>

      {/* Profile Header */}
      <main className="relative z-10 -mt-16 md:-mt-20 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-6 mb-8 md:mb-12">
          
          <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] shrink-0 rounded-full border-4 border-[#0d0d17] bg-gradient-to-br from-[#5bf4de] to-[#0d0d17] flex items-center justify-center text-[#003a33] text-3xl md:text-4xl font-bold shadow-[0px_20px_40px_rgba(45,212,191,0.08)]">
            {initials}
          </div>
          
          <div className="flex-1 pb-1 md:pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-1">
              {editName ? (
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Input
                    value={nameVal}
                    onChange={e => setNameVal(e.target.value)}
                    className="h-10 bg-[#12121e] border-[#474753]/50 text-white font-semibold max-w-[200px]"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                  />
                  <button onClick={saveName} disabled={saving} className="text-sm text-[#5bf4de] font-bold hover:underline">Save</button>
                  <button onClick={() => { setEditName(false); setNameVal(user.name) }} className="text-sm text-[#aca9b8] hover:underline">Cancel</button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#e7e3f3]">{user.name}</h1>
                  <button onClick={() => setEditName(true)} className="text-[#5bf4de] hover:text-[#48e5d0] transition-colors p-1" title="Edit name">
                    <Edit2 strokeWidth={3} className="w-4 h-4" />
                  </button>
                  {user.is_verified && Ico.verified}
                  {user.role === 'admin' && (
                    <span className="bg-[#5bf4de]/10 text-[#5bf4de] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">Admin</span>
                  )}
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[#aca9b8] text-sm">
              <span className="flex items-center gap-1.5 font-medium"><Mail className="w-4 h-4" /> {user.email}</span>
              <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-4 h-4" /> Joined {joinedDate}</span>
              {!user.is_verified && (
                <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`}>
                  <span className="flex items-center gap-1.5 text-[#ff716c] hover:underline cursor-pointer font-medium">
                    Unverified
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
          <div className="bg-[#1e1e2c] border border-[#474753]/20 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-[0px_20px_40px_rgba(45,212,191,0.02)]">
            <span className="text-[#aca9b8] text-[10px] font-bold tracking-widest uppercase">Reviews Written</span>
            <div className="text-3xl md:text-4xl font-bold text-[#5bf4de] mt-1 md:mt-2">{reviews.length}</div>
          </div>
          <div className="bg-[#1e1e2c] border border-[#474753]/20 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-[0px_20px_40px_rgba(45,212,191,0.02)]">
            <span className="text-[#aca9b8] text-[10px] font-bold tracking-widest uppercase">Saved Gyms</span>
            <div className="text-3xl md:text-4xl font-bold text-[#5bf4de] mt-1 md:mt-2">{favCount}</div>
          </div>
          <div className="bg-[#1e1e2c] border border-[#474753]/20 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-[0px_20px_40px_rgba(45,212,191,0.02)] col-span-2 md:col-span-1">
            <span className="text-[#aca9b8] text-[10px] font-bold tracking-widest uppercase">Member Status</span>
            <div className="text-3xl md:text-4xl font-bold text-[#5bf4de] mt-1 md:mt-2 capitalize">{user.role}</div>
          </div>
        </section>

        {/* Settings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <section>
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-[#e7e3f3]">
              <Settings className="w-5 h-5 text-[#5bf4de]" />
              Settings
            </h2>
            <div className="space-y-3 md:space-y-4">
              
              {/* Linked Accounts */}
              <div className="bg-[#12121e] border border-[#474753]/20 rounded-xl p-4 md:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                    {Ico.google}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e7e3f3]">Google Account</p>
                    <p className="text-[11px] md:text-xs text-[#5bf4de]">{hasGoogle ? 'Connected' : 'Not connected'}</p>
                  </div>
                </div>
                {hasGoogle ? (
                  <CheckCircle className="w-5 h-5 text-[#aca9b8]" />
                ) : (
                  <a href="/api/auth/google" className="text-[10px] font-bold uppercase tracking-widest text-[#5bf4de] px-4 py-2 bg-[#5bf4de]/10 border border-[#5bf4de]/20 rounded-full hover:bg-[#5bf4de]/20 transition-all text-center">Connect</a>
                )}
              </div>

              {/* Security */}
              <div className="bg-[#12121e] border border-[#474753]/20 rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[#aca9b8]" />
                    <p className="text-sm font-semibold text-[#e7e3f3]">Security</p>
                  </div>
                  {!changePw && (
                    <button onClick={() => setChangePw(true)} className="text-[10px] font-bold uppercase tracking-widest text-[#5bf4de] px-3 md:px-4 py-2 bg-[#5bf4de]/10 rounded-full hover:bg-[#5bf4de]/20 transition-all active:scale-95">Change Password</button>
                  )}
                </div>
                {changePw && (
                  <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300 pl-8 md:pl-8">
                    {hasPassword && (
                      <Input
                        type="password"
                        placeholder="Current password"
                        value={currentPw}
                        onChange={e => setCurrentPw(e.target.value)}
                        className="h-9 md:h-10 bg-[#0d0d17] border-[#474753]/30 text-white text-sm"
                      />
                    )}
                    <Input
                      type="password"
                      placeholder="New password (min. 8 characters)"
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      className="h-9 md:h-10 bg-[#0d0d17] border-[#474753]/30 text-white text-sm"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <Button onClick={savePassword} disabled={saving} className="bg-gradient-to-r from-[#5bf4de] to-[#11c9b4] text-[#00594f] h-8 md:h-9 px-4 md:px-5 rounded-full text-xs font-bold hover:opacity-90">
                        {saving ? 'Saving...' : 'Update'}
                      </Button>
                      <button onClick={() => { setChangePw(false); setCurrentPw(''); setNewPw('') }} className="text-xs text-[#aca9b8] hover:text-white px-2">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Preferences */}
              <div className="bg-[#12121e] border border-[#474753]/20 rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#aca9b8]" />
                    <p className="text-sm font-semibold text-[#e7e3f3]">Push Notifications</p>
                  </div>
                  {/* Toggle */}
                  <div onClick={() => setPushNotifs(!pushNotifs)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${pushNotifs ? 'bg-[#5bf4de]/20' : 'bg-[#252433]'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${pushNotifs ? 'right-1 bg-[#5bf4de]' : 'left-1 bg-[#aca9b8]'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#aca9b8]" />
                    <p className="text-sm font-semibold text-[#e7e3f3]">Email Updates</p>
                  </div>
                  {/* Toggle */}
                  <div onClick={() => setEmailNotifs(!emailNotifs)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${emailNotifs ? 'bg-[#5bf4de]/20' : 'bg-[#252433]'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${emailNotifs ? 'right-1 bg-[#5bf4de]' : 'left-1 bg-[#aca9b8]'}`}></div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Recent Reviews */}
          <section>
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-[#e7e3f3]">
              <MessageSquare className="w-5 h-5 text-[#5bf4de]" />
              Recent Reviews
            </h2>
            <div className="space-y-3 md:space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-[#12121e] border border-[#474753]/20 rounded-xl p-6 text-center">
                  <p className="text-sm text-[#aca9b8] mb-4">No reviews yet.</p>
                  <Link href="/gyms">
                    <Button className="bg-[#5bf4de]/10 text-[#5bf4de] border border-[#5bf4de]/20 hover:bg-[#5bf4de]/20 h-9 px-6 rounded-full text-xs font-bold uppercase tracking-widest">Explore Gyms</Button>
                  </Link>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-[#1e1e2c] border border-[#474753]/20 rounded-xl p-4 md:p-5 shadow-[0px_20px_40px_rgba(45,212,191,0.02)] relative group">
                    <button onClick={() => deleteReview(review.id)} className="absolute top-4 right-4 text-[#aca9b8] md:opacity-0 group-hover:opacity-100 hover:text-[#ff716c] transition-all">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <div className="flex justify-between items-start mb-2 md:mb-3 pr-6">
                      <h3 className="font-bold text-[#e7e3f3] line-clamp-1">{review.user_name || 'Gym'}</h3>
                      <div className="flex gap-0.5 shrink-0 mt-1">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className={j < review.rating ? 'text-[#5bf4de]' : 'text-[#474753]'}>{Ico.star}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[#aca9b8] text-sm italic">"{review.comment}"</p>
                    <p className="text-[10px] text-[#757481] mt-3 font-bold uppercase tracking-widest">
                      Reviewed {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Logout Section */}
        <div className="flex justify-center mt-6 md:mt-8 pb-12">
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-[#d7383b] hover:text-[#ff716c] transition-colors font-bold py-3 px-8 rounded-full bg-[#ff716c]/5 hover:bg-[#ff716c]/10 border border-[#ff716c]/20 active:scale-95 duration-150"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  )
}
