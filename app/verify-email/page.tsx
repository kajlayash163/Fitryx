import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import VerifyEmailClient from '@/components/auth/verify-email-client'
import { Suspense } from 'react'

export const metadata = {
  title: 'Verify Email — Fitryx',
  description: 'Enter the verification code sent to your email.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
        <VerifyEmailClient />
      </Suspense>
      <Footer />
    </>
  )
}
