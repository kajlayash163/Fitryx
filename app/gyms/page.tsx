import { Suspense } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import GymsPage from '@/components/gyms/gyms-page'

export const metadata = {
  title: 'Browse Gyms — Fitryx',
  description: 'Discover and filter verified gyms with real pricing and facilities.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
        <GymsPage />
      </Suspense>
      <Footer />
    </>
  )
}
