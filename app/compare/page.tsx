import { Suspense } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ComparePage from '@/components/compare/compare-page'

export const metadata = {
  title: 'Compare Gyms — Fitryx',
  description: 'Compare gyms side-by-side to find the best fit for your needs and budget.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
        <ComparePage />
      </Suspense>
      <Footer />
    </>
  )
}
