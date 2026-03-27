import { Suspense } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FavoritesPage from '@/components/favorites/favorites-page'

export const metadata = {
  title: 'My Favorites — Fitryx',
  description: 'View your saved and favorited gyms.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
        <FavoritesPage />
      </Suspense>
      <Footer />
    </>
  )
}
