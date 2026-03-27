import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ToolsPage from '@/components/tools/tools-page'

export const metadata = {
  title: 'Fitness Tools — Fitryx',
  description: 'Calculate your BMI, daily calorie needs, and more with our free fitness tools.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <ToolsPage />
      <Footer />
    </>
  )
}
