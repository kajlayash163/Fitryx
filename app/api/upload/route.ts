import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

/**
 * POST /api/upload
 * Proxies image uploads to Cloudinary.
 * Accepts multipart/form-data with a "file" field.
 * Returns the Cloudinary URL.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!CLOUD_NAME) {
      return NextResponse.json({ error: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME to .env' }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and AVIF images are allowed' }, { status: 400 })
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    // Upload to Cloudinary using unsigned preset (simpler) or signed
    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('upload_preset', UPLOAD_PRESET || 'fitryx_uploads')
    uploadData.append('folder', 'fitryx/gyms')

    let uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    // If we have API key and secret, use signed upload
    if (API_KEY && API_SECRET) {
      const timestamp = Math.floor(Date.now() / 1000).toString()
      const crypto = await import('crypto')
      const signatureStr = `folder=fitryx/gyms&timestamp=${timestamp}${API_SECRET}`
      const signature = crypto.createHash('sha1').update(signatureStr).digest('hex')

      uploadData.delete('upload_preset')
      uploadData.append('api_key', API_KEY)
      uploadData.append('timestamp', timestamp)
      uploadData.append('signature', signature)
    }

    const cloudRes = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadData,
    })

    if (!cloudRes.ok) {
      const errText = await cloudRes.text()
      console.error('[upload] Cloudinary error:', errText)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const result = await cloudRes.json()
    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (err) {
    console.error('[upload]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
