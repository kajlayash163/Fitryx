'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Mail, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import FitryxLogo from '@/components/fitryx-logo'

type Step = 'email' | 'otp' | 'newpass' | 'done'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Something went wrong')
        return
      }
      toast.success('Reset code sent! Check your email.')
      setStep('otp')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyAndReset(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Reset failed')
        return
      }
      toast.success('Password reset successfully!')
      setStep('done')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <FitryxLogo className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Fitryx</span>
        </Link>

        <div className="card-surface border border-border/40 rounded-2xl p-8">
          {step === 'email' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Forgot password?</h1>
                  <p className="text-sm text-muted-foreground">Enter your email to receive a reset code</p>
                </div>
              </div>
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="mt-1.5 bg-secondary/50 border-border/60 focus:border-primary/50"
                  />
                </div>
                <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset code'}
                </Button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Reset your password</h1>
                  <p className="text-sm text-muted-foreground">Enter the code sent to {email}</p>
                </div>
              </div>
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                <div>
                  <Label htmlFor="otp" className="text-sm text-muted-foreground">Reset Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="______"
                    required
                    className="mt-1.5 bg-secondary/50 border-border/60 focus:border-primary/50 text-center tracking-[0.5em] text-lg font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="newpass" className="text-sm text-muted-foreground">New Password</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="newpass"
                      type={showPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      className="bg-secondary/50 border-border/60 focus:border-primary/50 pr-10"
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset password'}
                </Button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h1 className="text-lg font-semibold text-foreground mb-2">Password reset!</h1>
              <p className="text-sm text-muted-foreground mb-6">You can now sign in with your new password.</p>
              <Button onClick={() => router.push('/login')} className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl">
                Go to Sign In
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
