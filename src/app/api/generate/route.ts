import { NextRequest, NextResponse } from 'next/server'

// Cloudflare Worker AI proxy URL (free, no token needed)
const WORKER_URL = 'https://anime-avatar-ai.langshi2101.workers.dev'

export async function POST(request: NextRequest) {
  try {
    const { image, style } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, style }),
    })

    const data = await response.json()

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Generation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
