'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import FitryxLogo from '@/components/fitryx-logo'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Registration failed')
        return
      }
      if (data.needsVerification) {
        toast.success('Verification code sent to your email!')
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      } else {
        toast.success('Account created! Welcome to Fitryx.')
        router.push('/gyms')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-[oklch(0.09_0.010_250)] border-r border-border/40">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[100px] rounded-full" />
        </div>
        <div className="relative flex flex-col justify-between h-full p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <FitryxLogo className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Fitryx</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold text-foreground text-balance leading-tight mb-4">
              Start your fitness journey today
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Join thousands of fitness enthusiasts who use Fitryx to make smarter gym decisions. Free to use, always.
            </p>
            <div className="mt-10 card-surface rounded-2xl p-5">
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {"\"Fitryx helped me find a gym that perfectly fit my budget and workout style. The comparison tool is genuinely brilliant.\""}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">J</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Jordan K.</p>
                  <p className="text-xs text-muted-foreground">Fitryx member</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/50">© 2025 Fitryx</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FitryxLogo className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Fitryx</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Create account</h1>
          <p className="text-muted-foreground text-sm mb-8">Join Fitryx — it&apos;s completely free</p>

          {/* Google Sign-Up */}
          <a
            href="/api/auth/google"
            className="w-full h-11 rounded-xl border border-border/60 bg-secondary/30 hover:bg-secondary/50 flex items-center justify-center gap-3 text-sm font-medium text-foreground transition-colors mb-6"
          >
            <GoogleIcon className="w-5 h-5" />
            Continue with Google
          </a>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or sign up with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-sm text-foreground">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={update('name')}
                required
                className="bg-secondary/50 border-border/60 focus:border-primary/50 h-11 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
                required
                className="bg-secondary/50 border-border/60 focus:border-primary/50 h-11 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={update('password')}
                  required
                  minLength={8}
                  className="bg-secondary/50 border-border/60 focus:border-primary/50 h-11 pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 bg-primary text-primary-foreground hover:opacity-90 glow-primary transition-all mt-1"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By signing up you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms</a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
