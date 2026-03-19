import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const verified = searchParams.get('verified')
    const facility = searchParams.get('facility')
    const genderType = searchParams.get('gender_type')
    const city = searchParams.get('city')

    let gyms
    if (search || verified !== null || facility || genderType || city) {
      gyms = await sql`
        SELECT id, name, location, description, price_monthly, price_quarterly, price_yearly,
               facilities, rating, review_count, images, verified, created_at,
               gender_type, women_safety_rating, opening_hours, city, phone
        FROM gyms
        WHERE (${search} = '' OR name ILIKE ${'%' + search + '%'} OR location ILIKE ${'%' + search + '%'})
          AND (${verified === null} OR verified = ${verified === 'true'})
          AND (${facility === null || facility === ''} OR ${facility} = ANY(facilities))
          AND (${genderType === null || genderType === ''} OR gender_type = ${genderType ?? ''})
          AND (${city === null || city === ''} OR city ILIKE ${city ?? ''})
        ORDER BY rating DESC
      `
    } else {
      gyms = await sql`
        SELECT id, name, location, description, price_monthly, price_quarterly, price_yearly,
               facilities, rating, review_count, images, verified, created_at,
               gender_type, women_safety_rating, opening_hours, city, phone
        FROM gyms
        ORDER BY rating DESC
      `
    }

    const response = NextResponse.json({ gyms })
    // Cache responses for 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (err) {
    console.error('[gyms GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const body = await req.json()
    const { name, location, description, price_monthly, price_quarterly, price_yearly, facilities, images, gender_type, women_safety_rating, opening_hours, city, phone } = body

    const [gym] = await sql`
      INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, images, gender_type, women_safety_rating, opening_hours, city, phone)
      VALUES (${name}, ${location}, ${description ?? ''}, ${price_monthly ?? 0}, ${price_quarterly ?? 0}, ${price_yearly ?? 0},
              ${facilities ?? []}, ${images ?? []}, ${gender_type ?? 'unisex'}, ${women_safety_rating ?? null}, ${opening_hours ?? '6:00 AM - 10:00 PM'}, ${city ?? 'Jaipur'}, ${phone ?? null})
      RETURNING *
    `
    return NextResponse.json({ gym }, { status: 201 })
  } catch (err) {
    console.error('[gyms POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
