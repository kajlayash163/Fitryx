import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ProfilePage from '@/components/profile/profile-page'

export const metadata = {
  title: 'My Profile — Fitryx',
  description: 'View and manage your Fitryx account.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <ProfilePage />
      <Footer />
    </>
  )
}
