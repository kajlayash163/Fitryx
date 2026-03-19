import { notFound } from 'next/navigation'
import sql from '@/lib/db'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import GymDetailClient from '@/components/gyms/gym-detail-client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [gym] = await sql`SELECT name, location FROM gyms WHERE id = ${id}`
  if (!gym) return { title: 'Gym not found — Fitryx' }
  return { title: `${gym.name} — Fitryx`, description: `View details, pricing and facilities for ${gym.name} in ${gym.location}` }
}

export default async function GymDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [gym] = await sql`SELECT * FROM gyms WHERE id = ${id}`
  if (!gym) notFound()

  return (
    <>
      <Navbar />
      <GymDetailClient gym={gym} />
      <Footer />
    </>
  )
}
