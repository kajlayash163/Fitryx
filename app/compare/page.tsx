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
      <ComparePage />
      <Footer />
    </>
  )
}
