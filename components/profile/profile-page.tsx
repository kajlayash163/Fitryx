'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Mail, ShieldCheck, ShieldOff, Star, Heart, Trash2, Calendar, Loader2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type UserData = {
  id: number
  name: string
  email: string
  role: string
  is_verified: boolean
  created_at: string
}

type Review = {
  id: number
  rating: number
  comment: string
  created_at: string
  user_id: number
  user_name: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [favCount, setFavCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const meRes = await fetch('/api/auth/me')
        const meData = await meRes.json()
        if (!meData.user) { setLoading(false); return }
        setUser(meData.user)

        // Fetch user's favorites count
        const favRes = await fetch('/api/favorites')
        const favData = await favRes.json()
        setFavCount(favData.favorites?.length ?? 0)

        // Fetch all reviews and filter to this user's
        // (For a production app you'd make a dedicated endpoint)
        const gymsRes = await fetch('/api/gyms')
        const gymsData = await gymsRes.json()
        const allReviews: Review[] = []
        for (const gym of (gymsData.gyms ?? []).slice(0, 20)) {
          const rRes = await fetch(`/api/reviews?gym_id=${gym.id}`)
          const rData = await rRes.json()
          const userReviews = (rData.reviews ?? []).filter((r: Review) => r.user_id === meData.user.id)
          allReviews.push(...userReviews)
        }
        setReviews(allReviews)
      } catch { /* empty */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const deleteReview = async (id: number) => {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Not signed in</h2>
          <p className="text-muted-foreground text-sm mb-4">Sign in to view your profile</p>
          <Link href="/login"><Button className="bg-primary text-primary-foreground">Sign In</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header Card */}
        <div className="card-surface rounded-2xl p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold ring-2 ring-primary/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  {user.role === 'admin' && <Badge className="bg-primary/10 text-primary border-primary/20">Admin</Badge>}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {user.is_verified ? (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </Badge>
                  ) : (
                    <Link href={`/verify-email?email=${encodeURIComponent(user.email)}`}>
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 gap-1 cursor-pointer hover:bg-amber-500/20 transition-colors">
                        <ShieldOff className="w-3 h-3" /> Unverified — Click to verify
                      </Badge>
                    </Link>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Joined {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                window.location.href = '/'
              }}
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card-surface rounded-2xl p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{reviews.length}</p>
            <p className="text-sm text-muted-foreground">Reviews Written</p>
          </div>
          <div className="card-surface rounded-2xl p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{favCount}</p>
            <p className="text-sm text-muted-foreground">Saved Gyms</p>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Your Reviews</h2>
          {reviews.length === 0 ? (
            <div className="card-surface rounded-2xl p-8 text-center">
              <Star className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">You haven't written any reviews yet</p>
              <Link href="/gyms"><Button className="mt-3 bg-primary text-primary-foreground" size="sm">Browse Gyms</Button></Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map(review => (
                <div key={review.id} className="card-surface rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <button onClick={() => deleteReview(review.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
