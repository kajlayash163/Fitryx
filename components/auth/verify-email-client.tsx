'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VerifyEmailClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') ?? ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(() => setResendCooldown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // digits only
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    // Auto-focus next
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] ?? ''
    setOtp(newOtp)
    if (pasted.length === 6) inputRefs.current[5]?.focus()
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) { setError('Please enter the full 6-digit code'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess(true)
      setTimeout(() => router.push('/gyms'), 2000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setResendCooldown(60)
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error)
    } catch {
      setError('Failed to resend code')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="card-surface rounded-2xl p-10 text-center max-w-md w-full mx-4">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h2>
          <p className="text-muted-foreground text-sm">Your account is now active. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="card-surface rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Verify your email</h2>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a 6-digit code to<br />
            <span className="text-foreground font-medium">{email || 'your email'}</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 bg-secondary/50 text-foreground focus:outline-none ${
                digit
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border/60 focus:border-primary/50'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-destructive text-center mb-4">{error}</p>
        )}

        <Button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-primary text-primary-foreground hover:opacity-90 h-11"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Email'}
        </Button>

        <div className="text-center mt-5">
          <p className="text-xs text-muted-foreground mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              resendCooldown > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:underline'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  )
}
