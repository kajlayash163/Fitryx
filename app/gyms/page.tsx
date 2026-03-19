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
      <GymsPage />
      <Footer />
    </>
  )
}
